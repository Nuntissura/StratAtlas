import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'
import { backend } from './lib/backend'

describe('App', () => {
  it('creates a bundle through the I0 shell flow', async () => {
    localStorage.clear()
    const user = userEvent.setup()
    render(<App />)

    expect(screen.getByText('StratAtlas Integrated Workbench')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Create Bundle' }))

    expect(await screen.findByText(/Bundle .* created/)).toBeInTheDocument()
  })

  it('hydrates recorder state from the authoritative backend store', async () => {
    localStorage.clear()
    await backend.saveRecorderState({
      role: 'analyst',
      state: {
        workspace: {
          mode: 'Offline (forced)',
          workflowMode: 'replay',
          note: 'Hydrated note',
          activeLayers: ['base-map'],
          replayCursor: 64,
          forcedOffline: true,
          uiVersion: 'i0-recorder-hardening',
        },
        query: {
          definition: {
            queryId: 'query-main',
            version: 4,
            conditions: [{ field: 'speed', operator: 'greater_than', value: 28 }],
          },
          resultCount: 2,
          sourceRowCount: 4,
          matchedRowIds: [2, 4],
        },
        context: {
          domains: [
            {
              domain_id: 'ctx-1',
              domain_name: 'Port Throughput',
              domain_class: 'economic_indicator',
              source_name: 'UNCTAD',
              source_url: 'https://example.test/context',
              license: 'public',
              update_cadence: 'monthly',
              spatial_binding: 'point',
              temporal_resolution: 'monthly',
              sensitivity_class: 'PUBLIC',
              confidence_baseline: 'A',
              methodology_notes: 'Official aggregation',
              offline_behavior: 'pre_cacheable',
              presentation_type: 'map_overlay',
            },
          ],
          activeDomainIds: ['ctx-1'],
          correlationAoi: 'aoi-7',
        },
        selectedBundleId: undefined,
        savedAt: '2026-03-06T00:00:00.000Z',
      },
    })

    render(<App />)

    expect(await screen.findByDisplayValue('Hydrated note')).toBeInTheDocument()
    expect(screen.getByText('Query v4')).toBeInTheDocument()
    expect(screen.getByText('Active context domains: 1 | Correlation AOI: aoi-7')).toBeInTheDocument()
    expect(screen.getByText('OFFLINE')).toBeInTheDocument()
  })

  it('renders required I1 UI regions', async () => {
    render(<App />)
    expect(await screen.findByTestId('region-header')).toBeInTheDocument()
    expect(screen.getByTestId('region-left-panel')).toBeInTheDocument()
    expect(screen.getByTestId('region-main-canvas')).toBeInTheDocument()
    expect(screen.getByTestId('region-right-panel')).toBeInTheDocument()
    expect(screen.getByTestId('region-bottom-panel')).toBeInTheDocument()
  })

  it('runs compare workflow and updates delta output', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.selectOptions(screen.getByLabelText('Mode'), 'compare')
    expect(await screen.findByText('Baseline / Delta / Briefing (I2)')).toBeInTheDocument()

    const baselineInput = screen.getByLabelText('Baseline Series')
    const eventInput = screen.getByLabelText('Event Series')
    await user.clear(baselineInput)
    await user.type(baselineInput, '1,2,3')
    await user.clear(eventInput)
    await user.type(eventInput, '2,4,6')

    expect(await screen.findByText('Delta: [1, 2, 3]')).toBeInTheDocument()
  })

  it('reopens a bundle and restores workspace, query, and context state', async () => {
    localStorage.clear()
    const user = userEvent.setup()
    render(<App />)

    await user.selectOptions(screen.getByLabelText('Mode'), 'replay')
    await user.clear(screen.getByLabelText('Analyst Note'))
    await user.type(screen.getByLabelText('Analyst Note'), 'Recorder note')
    await user.click(screen.getByRole('button', { name: 'Force Offline Mode' }))
    await user.click(screen.getByRole('button', { name: 'Register Domain' }))
    await user.clear(screen.getByLabelText('Correlation AOI'))
    await user.type(screen.getByLabelText('Correlation AOI'), 'aoi-9')
    await user.click(screen.getByRole('button', { name: 'Save Correlation Selection' }))
    await user.clear(screen.getByLabelText('Minimum Speed'))
    await user.type(screen.getByLabelText('Minimum Speed'), '30')
    await user.click(screen.getByRole('button', { name: 'Save Query Version' }))
    await user.click(screen.getByRole('button', { name: 'Create Bundle' }))
    expect(await screen.findByText(/Bundle .* created/)).toBeInTheDocument()

    await user.clear(screen.getByLabelText('Analyst Note'))
    await user.type(screen.getByLabelText('Analyst Note'), 'Mutated note')
    await user.selectOptions(screen.getByLabelText('Mode'), 'compare')
    await user.click(screen.getByRole('button', { name: 'Disable Forced Offline' }))
    await user.clear(screen.getByLabelText('Correlation AOI'))
    await user.type(screen.getByLabelText('Correlation AOI'), 'aoi-2')
    await user.click(screen.getByRole('checkbox', { name: /Port Throughput/ }))

    await user.click(screen.getByRole('button', { name: 'Reopen Bundle' }))

    expect(await screen.findByDisplayValue('Recorder note')).toBeInTheDocument()
    expect(screen.getByText('Current mode: replay')).toBeInTheDocument()
    expect(screen.getByText('Query v2')).toBeInTheDocument()
    expect(screen.getByText('Active context domains: 1 | Correlation AOI: aoi-9')).toBeInTheDocument()
    expect(screen.getByText('OFFLINE')).toBeInTheDocument()
  })
})
