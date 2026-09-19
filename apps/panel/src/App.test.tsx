import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import App from './App'

describe('App', () => {
  it('renderiza el estado del servidor', () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.reject(new Error('not mocked'))),
    )

    render(<App />)

    expect(screen.getByText(/server status/i)).toBeInTheDocument()
  })
})
