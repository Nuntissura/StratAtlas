import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('creates a bundle through the I0 shell flow', async () => {
    localStorage.clear()
    const user = userEvent.setup()
    render(<App />)

    expect(screen.getByText('StratAtlas I0 Walking Skeleton')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Create Bundle' }))

    expect(await screen.findByText(/Bundle .* created/)).toBeInTheDocument()
  })
})
