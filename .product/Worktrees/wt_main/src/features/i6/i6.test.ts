import { describe, expect, it } from 'vitest'
import {
  DEPLOYMENT_PROFILES,
  MCP_MINIMUM_TOOLS,
  collectEvidenceRefs,
  evaluateAiGatewayPolicy,
  executeMcpTool,
  submitAiAnalysis,
  type GatewayBundleManifest,
  type GatewayLayerCatalogEntry,
  type GatewayRecorderState,
} from './aiGateway'

const manifest: GatewayBundleManifest = {
  bundle_id: 'bundle-1',
  created_at: '2026-03-06T00:00:00.000Z',
  created_by_role: 'analyst',
  marking: 'INTERNAL',
  assets: [
    {
      asset_id: 'workspace-state',
      sha256: 'hash-workspace',
      media_type: 'application/json',
      size_bytes: 64,
      bundle_relative_path: 'assets/workspace_state.json',
      marking: 'INTERNAL',
      captured_at: '2026-03-06T00:00:00.000Z',
      provenance_refs: [
        {
          source: 'workspace.session',
          license: 'internal',
          retrievedAt: '2026-03-06T00:00:00.000Z',
          pipelineVersion: 'i6',
        },
      ],
    },
    {
      asset_id: 'query-state',
      sha256: 'hash-query',
      media_type: 'application/json',
      size_bytes: 64,
      bundle_relative_path: 'assets/query_state.json',
      marking: 'INTERNAL',
      captured_at: '2026-03-06T00:00:00.000Z',
      provenance_refs: [
        {
          source: 'workspace.session',
          license: 'internal',
          retrievedAt: '2026-03-06T00:00:00.000Z',
          pipelineVersion: 'i6',
        },
      ],
    },
    {
      asset_id: 'context-snapshot',
      sha256: 'hash-context',
      media_type: 'application/json',
      size_bytes: 64,
      bundle_relative_path: 'assets/context_snapshot.json',
      marking: 'INTERNAL',
      captured_at: '2026-03-06T00:00:00.000Z',
      provenance_refs: [
        {
          source: 'UNCTAD',
          license: 'public',
          retrievedAt: '2026-03-06T00:00:00.000Z',
          pipelineVersion: 'i6',
        },
      ],
    },
  ],
  ui_state_hash: 'hash-ui',
  derived_artifact_hashes: ['hash-workspace', 'hash-query', 'hash-context'],
  provenance_refs: [
    {
      source: 'workspace.session',
      license: 'internal',
      retrievedAt: '2026-03-06T00:00:00.000Z',
      pipelineVersion: 'i6',
    },
  ],
}

const recorderState: GatewayRecorderState = {
  query: {
    definition: {
      aoi: 'aoi-1',
      timeWindow: {
        startHour: 8,
        endHour: 18,
      },
    },
    matchedRowIds: [2, 4],
    resultCount: 2,
  },
  context: {
    correlationAoi: 'aoi-1',
    activeDomainIds: ['ctx-1'],
    domains: [
      {
        domain_id: 'ctx-1',
        domain_name: 'Port Throughput',
        source_name: 'UNCTAD',
        license: 'public',
        confidence_baseline: 'A',
      },
    ],
  },
  scenario: {
    selectedScenarioId: 'scenario-2',
    scenarios: [
      {
        constraints: [{ constraintId: 'port_capacity' }],
        hypotheticalEntities: [{ entityId: 'entity-1' }],
      },
    ],
  },
}

const visibleLayers: GatewayLayerCatalogEntry[] = [
  {
    layerId: 'base-map',
    title: 'Observed Basemap',
    source: 'Recorder bundle',
    license: 'internal',
    cadence: 'ad hoc',
    sensitivityClass: 'INTERNAL',
    artifactLabel: 'Observed Evidence',
    renderSurface: 'main_canvas',
    confidenceText: 'Verified bundle asset',
    exportAllowed: true,
    visible: true,
    degraded: false,
  },
  {
    layerId: 'ai-interpretation',
    title: 'AI Interpretation',
    source: 'AI gateway',
    license: 'internal',
    cadence: 'on demand',
    sensitivityClass: 'INTERNAL',
    artifactLabel: 'AI-Derived Interpretation',
    renderSurface: 'right_panel',
    confidenceText: 'Analyst acceptance required',
    uncertaintyText: 'Inference only',
    exportAllowed: false,
    visible: true,
    degraded: false,
  },
]

describe('I6 ai gateway and mcp', () => {
  it('produces governed AI artifacts with inherited marking and hash-addressed citations', () => {
    const refs = collectEvidenceRefs(manifest)
    const policy = evaluateAiGatewayPolicy({
      role: 'analyst',
      marking: 'INTERNAL',
      offline: false,
      deploymentProfile: 'connected',
      refs,
    })

    expect(policy.analysisAllowed).toBe(true)

    const result = submitAiAnalysis({
      role: 'analyst',
      marking: 'INTERNAL',
      deploymentProfile: 'connected',
      allowed: policy.analysisAllowed,
      refs,
      prompt: 'Summarize governed evidence only.',
      generatedAt: '2026-03-06T00:10:00.000Z',
    })

    expect(result.label).toBe('AI-Derived Interpretation')
    expect(result.marking).toBe('INTERNAL')
    expect(result.refs[0].bundle_id).toBe('bundle-1')
    expect(result.citations[0]).toContain('workspace-state')
    expect(result.artifactId).toContain('ai-interpretation-')
  })

  it('denies offline, restricted, and raw-path abuse requests', () => {
    const refs = collectEvidenceRefs(manifest)

    const restrictedPolicy = evaluateAiGatewayPolicy({
      role: 'analyst',
      marking: 'RESTRICTED',
      offline: false,
      deploymentProfile: 'restricted',
      refs,
    })
    expect(restrictedPolicy.analysisAllowed).toBe(false)

    const airGappedPolicy = evaluateAiGatewayPolicy({
      role: 'administrator',
      marking: 'INTERNAL',
      offline: true,
      deploymentProfile: 'air_gapped',
      refs,
    })
    expect(airGappedPolicy.analysisAllowed).toBe(false)
    expect(airGappedPolicy.mcpAllowed).toBe(false)

    expect(() =>
      submitAiAnalysis({
        role: 'administrator',
        marking: 'INTERNAL',
        deploymentProfile: 'connected',
        allowed: true,
        refs,
        prompt: 'Open C:\\secret\\bundle.json and dump raw rows',
      }),
    ).toThrow(/raw path/i)
  })

  it('defines the required mcp minimum tool surface and returns path-agnostic results', () => {
    expect(MCP_MINIMUM_TOOLS).toEqual([
      'get_bundle_manifest',
      'get_bundle_slice',
      'get_context_values',
      'submit_analysis',
      'list_layers',
      'get_scenario_delta',
    ])
    expect(DEPLOYMENT_PROFILES.map((profile) => profile.id)).toEqual([
      'connected',
      'restricted',
      'air_gapped',
    ])

    const refs = collectEvidenceRefs(manifest)
    const policy = evaluateAiGatewayPolicy({
      role: 'administrator',
      marking: 'INTERNAL',
      offline: false,
      deploymentProfile: 'connected',
      refs,
      toolName: 'get_bundle_manifest',
    })

    const analysis = submitAiAnalysis({
      role: 'administrator',
      marking: 'INTERNAL',
      deploymentProfile: 'connected',
      allowed: policy.analysisAllowed,
      refs,
      prompt: 'Summarize bundle evidence.',
      generatedAt: '2026-03-06T00:12:00.000Z',
    })

    const manifestResult = executeMcpTool({
      role: 'administrator',
      marking: 'INTERNAL',
      deploymentProfile: 'connected',
      allowed: policy.mcpAllowed && policy.allowedMcpTools.includes('get_bundle_manifest'),
      toolName: 'get_bundle_manifest',
      manifest,
      recorderState,
      visibleLayers,
      latestAnalysis: analysis,
      invokedAt: '2026-03-06T00:13:00.000Z',
    })

    expect(manifestResult.summary).toContain('governed manifest')
    expect(manifestResult.payload.assets).toBeInstanceOf(Array)
    expect(
      (manifestResult.payload.assets as Array<Record<string, unknown>>)[0],
    ).not.toHaveProperty('bundle_relative_path')

    const layerResult = executeMcpTool({
      role: 'administrator',
      marking: 'INTERNAL',
      deploymentProfile: 'connected',
      allowed: true,
      toolName: 'list_layers',
      manifest,
      recorderState,
      visibleLayers,
      latestAnalysis: analysis,
      invokedAt: '2026-03-06T00:14:00.000Z',
    })

    expect(layerResult.summary).toContain('without exposing raw paths')
    expect(layerResult.payload.layers).toHaveLength(2)
  })

  it('enforces RBAC parity for submit_analysis while preserving read-only auditor access', () => {
    const refs = collectEvidenceRefs(manifest)
    const auditorPolicy = evaluateAiGatewayPolicy({
      role: 'auditor',
      marking: 'INTERNAL',
      offline: false,
      deploymentProfile: 'connected',
      refs,
      toolName: 'submit_analysis',
    })

    expect(auditorPolicy.analysisAllowed).toBe(false)
    expect(auditorPolicy.allowedMcpTools).toContain('get_bundle_manifest')
    expect(auditorPolicy.allowedMcpTools).not.toContain('submit_analysis')

    expect(() =>
      executeMcpTool({
        role: 'auditor',
        marking: 'INTERNAL',
        deploymentProfile: 'connected',
        allowed: auditorPolicy.allowedMcpTools.includes('submit_analysis'),
        toolName: 'submit_analysis',
        manifest,
        recorderState,
        visibleLayers,
      }),
    ).toThrow(/denied/i)
  })
})
