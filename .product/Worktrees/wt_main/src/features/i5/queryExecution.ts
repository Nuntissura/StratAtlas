import * as duckdb from '@duckdb/duckdb-wasm'
import duckdbEhWasm from '@duckdb/duckdb-wasm/dist/duckdb-eh.wasm?url'
import duckdbBrowserEhWorker from '@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js?url'
import duckdbBrowserMvpWorker from '@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js?url'
import duckdbMvpWasm from '@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm?url'
import { runQuery, type QueryCondition, type VersionedQuery } from './queryBuilder'

type NodeModuleNamespace = {
  createRequire(path: string | URL): NodeJS.Require
}

type NodeDuckDbTable = {
  toArray(): unknown[]
}

type NodeDuckDbStatement = {
  close(): void
  query(...params: QueryExecutionParam[]): NodeDuckDbTable
}

type NodeDuckDbConnection = {
  close(): void
  prepare(sql: string): NodeDuckDbStatement
}

type NodeDuckDbBindings = {
  instantiate(): Promise<unknown>
  open(config: Record<string, never>): void
  registerFileText(fileName: string, text: string): void
  connect(): NodeDuckDbConnection
  dropFile(fileName: string): void
}

type DuckDbBlockingModule = {
  NODE_RUNTIME: unknown
  createDuckDB(
    bundles: duckdb.DuckDBBundles,
    logger: duckdb.Logger,
    runtime: unknown,
  ): Promise<NodeDuckDbBindings>
}

type QueryRow = Record<string, unknown> & {
  id?: number
  hour?: number
  region?: string
  context_domains?: string[]
}

type QueryExecutionParam = number | string

export type QueryExecutionEngine = 'duckdb-wasm' | 'in-memory-fallback'

export type QueryExecutionRuntime =
  | 'browser-async'
  | 'node-blocking'
  | 'synchronous-fallback'

export interface QueryExecutionPlan {
  sql: string
  params: QueryExecutionParam[]
  predicateCount: number
}

export interface QueryExecutionResult {
  resultCount: number
  matchedRowIds: number[]
  summary: string
  engine: QueryExecutionEngine
  runtime: QueryExecutionRuntime
  sqlFingerprint: string
  predicateCount: number
}

interface StagedQueryRow extends QueryRow {
  context_domains_joined: string
  context_domains_text: string
}

const QUIET_LOGGER: duckdb.Logger = {
  log() {
    // Query execution should not spam the desktop console during normal analyst flows.
  },
}

const BROWSER_BUNDLES: duckdb.DuckDBBundles = {
  mvp: {
    mainModule: duckdbMvpWasm,
    mainWorker: duckdbBrowserMvpWorker,
  },
  eh: {
    mainModule: duckdbEhWasm,
    mainWorker: duckdbBrowserEhWorker,
  },
}

const DEFAULT_RUNTIME_LABEL: QueryExecutionRuntime = 'synchronous-fallback'

let browserDuckDbPromise: Promise<duckdb.AsyncDuckDB> | null = null
let nodeDuckDbPromise: Promise<NodeDuckDbBindings> | null = null
let queryExecutionCounter = 0

const isNodeLikeRuntime = (): boolean =>
  typeof process !== 'undefined' && typeof process.versions?.node === 'string'

const stableFingerprint = (value: unknown): string => {
  const serialized = JSON.stringify(value)
  let hash = 2166136261
  for (let index = 0; index < serialized.length; index += 1) {
    hash ^= serialized.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return `queryexec-${(hash >>> 0).toString(16).padStart(8, '0')}`
}

const escapeSqlLiteral = (value: string): string => value.replaceAll("'", "''")

const formatErrorReason = (error: unknown): string =>
  String(error).replace(/^Error:\s*/u, '').trim().slice(0, 180)

const normalizeDomainArray = (value: unknown): string[] =>
  Array.isArray(value)
    ? [...new Set(value.filter((entry): entry is string => typeof entry === 'string'))].sort(
        (left, right) => left.localeCompare(right),
      )
    : []

const buildContextDomainEnvelope = (
  domains: string[] | undefined,
): { joined: string; text: string } => {
  const normalized = normalizeDomainArray(domains)
  return {
    joined: normalized.join(','),
    text: normalized.length > 0 ? `|${normalized.join('|')}|` : '|',
  }
}

const stageRowsForDuckDb = (rows: QueryRow[]): StagedQueryRow[] =>
  rows.map((row) => {
    const domains = buildContextDomainEnvelope(row.context_domains)
    return {
      ...row,
      context_domains_joined: domains.joined,
      context_domains_text: domains.text,
    }
  })

const buildTextContainsClause = (column: string, value: string): QueryExecutionPlan => ({
  sql: `lower(coalesce(cast(${column} as varchar), '')) LIKE ?`,
  params: [`%${value.toLowerCase()}%`],
  predicateCount: 1,
})

const buildConditionPlan = (condition: QueryCondition): QueryExecutionPlan => {
  switch (condition.field) {
    case 'speed':
    case 'hour': {
      if (typeof condition.value !== 'number') {
        return { sql: '1 = 0', params: [], predicateCount: 1 }
      }
      if (condition.operator === 'equals') {
        return { sql: `${condition.field} = ?`, params: [condition.value], predicateCount: 1 }
      }
      if (condition.operator === 'greater_than') {
        return { sql: `${condition.field} > ?`, params: [condition.value], predicateCount: 1 }
      }
      if (condition.operator === 'less_than') {
        return { sql: `${condition.field} < ?`, params: [condition.value], predicateCount: 1 }
      }
      return buildTextContainsClause(condition.field, String(condition.value))
    }
    case 'type':
      if (condition.operator === 'equals') {
        return {
          sql: `coalesce(cast(type as varchar), '') = ?`,
          params: [String(condition.value)],
          predicateCount: 1,
        }
      }
      return buildTextContainsClause('type', String(condition.value))
    case 'context_domains':
      if (condition.operator === 'equals') {
        return {
          sql: `coalesce(context_domains_joined, '') = ?`,
          params: [String(condition.value)],
          predicateCount: 1,
        }
      }
      return buildTextContainsClause('context_domains_text', `|${String(condition.value)}|`)
    default:
      return { sql: '1 = 0', params: [], predicateCount: 1 }
  }
}

export const buildQueryExecutionPlan = (
  query: VersionedQuery,
  fileName: string,
): QueryExecutionPlan => {
  const clauses: string[] = ['hour >= ?', 'hour <= ?']
  const params: QueryExecutionParam[] = [query.timeWindow.startHour, query.timeWindow.endHour]
  let predicateCount = 2

  if (query.aoi.trim().length > 0) {
    clauses.push('region = ?')
    params.push(query.aoi.trim())
    predicateCount += 1
  }

  query.contextDomainIds
    .filter((domainId) => domainId.trim().length > 0)
    .forEach((domainId) => {
      clauses.push(`lower(context_domains_text) LIKE ?`)
      params.push(`%|${domainId.toLowerCase()}|%`)
      predicateCount += 1
    })

  query.conditions.forEach((condition) => {
    const plan = buildConditionPlan(condition)
    clauses.push(plan.sql)
    params.push(...plan.params)
    predicateCount += plan.predicateCount
  })

  return {
    sql: [
      `WITH query_source_rows AS (`,
      `  SELECT * FROM read_json_auto('${escapeSqlLiteral(fileName)}')`,
      `)`,
      `SELECT id`,
      `FROM query_source_rows`,
      `WHERE ${clauses.join(' AND ')}`,
      `ORDER BY hour ASC, id ASC`,
    ].join('\n'),
    params,
    predicateCount,
  }
}

const normalizeTableRows = (table: { toArray(): unknown[] }): Record<string, unknown>[] =>
  table.toArray().map((row) => {
    if (typeof row === 'object' && row !== null && 'toJSON' in row && typeof row.toJSON === 'function') {
      return row.toJSON() as Record<string, unknown>
    }
    return typeof row === 'object' && row !== null ? (row as Record<string, unknown>) : {}
  })

const normalizeRowId = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }
  if (typeof value === 'bigint') {
    const converted = Number(value)
    return Number.isFinite(converted) ? converted : null
  }
  if (typeof value === 'string') {
    const converted = Number(value)
    return Number.isFinite(converted) ? converted : null
  }
  return null
}

const nextExecutionId = (): string => {
  queryExecutionCounter += 1
  return `query-source-${queryExecutionCounter.toString().padStart(4, '0')}.json`
}

const loadNodeModuleNamespace = async (): Promise<NodeModuleNamespace> => {
  const specifier = 'node:module'
  return import(/* @vite-ignore */ specifier) as Promise<NodeModuleNamespace>
}

const loadDuckDbBlockingModule = async (): Promise<DuckDbBlockingModule> => {
  const specifier = '@duckdb/duckdb-wasm/blocking'
  return import(/* @vite-ignore */ specifier) as Promise<DuckDbBlockingModule>
}

const getNodeDuckDb = async (): Promise<NodeDuckDbBindings> => {
  if (!nodeDuckDbPromise) {
    nodeDuckDbPromise = (async () => {
      const blockingModule = await loadDuckDbBlockingModule()
      const moduleNamespace = await loadNodeModuleNamespace()
      const require = moduleNamespace.createRequire(import.meta.url)
      const bundles: duckdb.DuckDBBundles = {
        mvp: {
          mainModule: require.resolve('@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm'),
          mainWorker: require.resolve('@duckdb/duckdb-wasm/dist/duckdb-node-mvp.worker.cjs'),
        },
        eh: {
          mainModule: require.resolve('@duckdb/duckdb-wasm/dist/duckdb-eh.wasm'),
          mainWorker: require.resolve('@duckdb/duckdb-wasm/dist/duckdb-node-eh.worker.cjs'),
        },
      }

      const db = await blockingModule.createDuckDB(
        bundles,
        QUIET_LOGGER,
        blockingModule.NODE_RUNTIME,
      )
      await db.instantiate()
      db.open({})
      return db
    })().catch((error) => {
      nodeDuckDbPromise = null
      throw error
    })
  }

  return nodeDuckDbPromise
}

const getBrowserDuckDb = async (): Promise<duckdb.AsyncDuckDB> => {
  if (!browserDuckDbPromise) {
    browserDuckDbPromise = (async () => {
      if (typeof Worker !== 'function') {
        throw new Error('Worker runtime unavailable for browser DuckDB execution')
      }

      const bundle = await duckdb.selectBundle(BROWSER_BUNDLES)
      const worker = new Worker(bundle.mainWorker!)
      const db = new duckdb.AsyncDuckDB(QUIET_LOGGER, worker)
      await db.instantiate(bundle.mainModule, bundle.pthreadWorker)
      await db.open({})
      return db
    })().catch((error) => {
      browserDuckDbPromise = null
      throw error
    })
  }

  return browserDuckDbPromise
}

const executeWithNodeDuckDb = async (
  plan: QueryExecutionPlan,
  fileName: string,
  rows: StagedQueryRow[],
): Promise<{ matchedRowIds: number[]; runtime: QueryExecutionRuntime }> => {
  const db = await getNodeDuckDb()
  db.registerFileText(fileName, JSON.stringify(rows))

  const connection = db.connect()
  try {
    const statement = connection.prepare(plan.sql)
    try {
      const result = statement.query(...plan.params)
      const matchedRowIds = normalizeTableRows(result)
        .map((row) => normalizeRowId(row.id))
        .filter((value): value is number => value !== null)
      return {
        matchedRowIds,
        runtime: 'node-blocking',
      }
    } finally {
      statement.close()
    }
  } finally {
    connection.close()
    db.dropFile(fileName)
  }
}

const executeWithBrowserDuckDb = async (
  plan: QueryExecutionPlan,
  fileName: string,
  rows: StagedQueryRow[],
): Promise<{ matchedRowIds: number[]; runtime: QueryExecutionRuntime }> => {
  const db = await getBrowserDuckDb()
  await db.registerFileText(fileName, JSON.stringify(rows))

  const connection = await db.connect()
  try {
    const statement = await connection.prepare(plan.sql)
    try {
      const result = await statement.query(...plan.params)
      const matchedRowIds = normalizeTableRows(result)
        .map((row) => normalizeRowId(row.id))
        .filter((value): value is number => value !== null)
      return {
        matchedRowIds,
        runtime: 'browser-async',
      }
    } finally {
      await statement.close()
    }
  } finally {
    await connection.close()
    await db.dropFile(fileName)
  }
}

export const executeQuery = async (
  query: VersionedQuery,
  rows: QueryRow[],
): Promise<QueryExecutionResult> => {
  const stagedRows = stageRowsForDuckDb(rows)
  const fileName = nextExecutionId()
  const plan = buildQueryExecutionPlan(query, fileName)
  const sqlFingerprint = stableFingerprint({
    sql: plan.sql,
    params: plan.params,
  })

  try {
    const execution = isNodeLikeRuntime()
      ? await executeWithNodeDuckDb(plan, fileName, stagedRows)
      : await executeWithBrowserDuckDb(plan, fileName, stagedRows)

    return {
      resultCount: execution.matchedRowIds.length,
      matchedRowIds: execution.matchedRowIds,
      summary: `Execution: duckdb-wasm (${execution.runtime}) | Matched ${execution.matchedRowIds.length} of ${rows.length} governed row(s).`,
      engine: 'duckdb-wasm',
      runtime: execution.runtime,
      sqlFingerprint,
      predicateCount: plan.predicateCount,
    }
  } catch (error) {
    const fallbackRows = runQuery(query, rows)
    return {
      resultCount: fallbackRows.length,
      matchedRowIds: fallbackRows
        .map((row) => normalizeRowId(row.id))
        .filter((value): value is number => value !== null),
      summary: `Execution: in-memory fallback | Matched ${fallbackRows.length} of ${rows.length} governed row(s) | DuckDB unavailable: ${formatErrorReason(error)}`,
      engine: 'in-memory-fallback',
      runtime: DEFAULT_RUNTIME_LABEL,
      sqlFingerprint,
      predicateCount: plan.predicateCount,
    }
  }
}
