import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('creates a bundle through the I0 shell flow', async () => {
    localStorage.clear()
    const user = userEvent.setup()
    render(<App />)

    expect(screen.getByText('StratAtlas Integrated Workbench')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Create Bundle' }))

    expect(await screen.findByText(/Bundle .* created/)).toBeInTheDocument()
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
})
