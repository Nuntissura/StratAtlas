export interface BundleReference {
  bundle_id: string
  asset_id: string
  sha256: string
}

export interface AiAnalysisRequest {
  role: 'viewer' | 'analyst' | 'administrator' | 'auditor'
  allowed: boolean
  refs: BundleReference[]
  prompt: string
}

export interface AiAnalysisResult {
  label: 'AI-Derived Interpretation'
  refs: BundleReference[]
  content: string
}

export const submitAiAnalysis = (request: AiAnalysisRequest): AiAnalysisResult => {
  if (!request.allowed) {
    throw new Error('AI gateway policy denied request')
  }
  if (request.role === 'viewer') {
    throw new Error('Viewer role is not allowed to submit AI analysis')
  }
  const invalidRef = request.refs.find(
    (ref) => !ref.bundle_id || !ref.asset_id || !ref.sha256,
  )
  if (invalidRef) {
    throw new Error('AI analysis requires hash-addressed evidence references')
  }
  return {
    label: 'AI-Derived Interpretation',
    refs: request.refs,
    content: `Generated analysis for ${request.refs.length} referenced assets: ${request.prompt.slice(0, 140)}`,
  }
}

export const MCP_MINIMUM_TOOLS = [
  'get_bundle_manifest',
  'get_bundle_slice',
  'get_context_values',
  'submit_analysis',
  'list_layers',
  'get_scenario_delta',
] as const
