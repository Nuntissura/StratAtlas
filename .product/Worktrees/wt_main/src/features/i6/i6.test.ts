import { describe, expect, it } from 'vitest'
import { MCP_MINIMUM_TOOLS, submitAiAnalysis } from './aiGateway'

describe('I6 ai gateway and mcp', () => {
  it('requires policy approval and hash-addressed evidence references', () => {
    expect(() =>
      submitAiAnalysis({
        role: 'analyst',
        allowed: false,
        refs: [],
        prompt: 'test',
      }),
    ).toThrow()

    const result = submitAiAnalysis({
      role: 'analyst',
      allowed: true,
      refs: [{ bundle_id: 'b1', asset_id: 'a1', sha256: 'hash' }],
      prompt: 'summarize',
    })
    expect(result.label).toBe('AI-Derived Interpretation')
    expect(result.refs[0].bundle_id).toBe('b1')

    expect(() =>
      submitAiAnalysis({
        role: 'viewer',
        allowed: true,
        refs: [{ bundle_id: 'b1', asset_id: 'a1', sha256: 'hash' }],
        prompt: 'blocked',
      }),
    ).toThrow()
  })

  it('defines required mcp minimum tool surface', () => {
    expect(MCP_MINIMUM_TOOLS).toEqual([
      'get_bundle_manifest',
      'get_bundle_slice',
      'get_context_values',
      'submit_analysis',
      'list_layers',
      'get_scenario_delta',
    ])
  })
})
