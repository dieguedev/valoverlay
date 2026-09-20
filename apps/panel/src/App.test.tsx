import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('rutas públicas', () => {
  it('renderiza la página de inicio en /', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: /inicio/i })).toBeInTheDocument()
  })

  it('renderiza la página de login en /login', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <App />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: /iniciar sesión/i })).toBeInTheDocument()
  })

  it('renderiza la página de registro en /register', () => {
    render(
      <MemoryRouter initialEntries={['/register']}>
        <App />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: /crear cuenta/i })).toBeInTheDocument()
  })

  it('renderiza la página de privacidad en /privacy', () => {
    render(
      <MemoryRouter initialEntries={['/privacy']}>
        <App />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('heading', { name: /política de privacidad/i }),
    ).toBeInTheDocument()
  })

  it('renderiza la página de términos en /terms', () => {
    render(
      <MemoryRouter initialEntries={['/terms']}>
        <App />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('heading', { name: /términos y condiciones/i }),
    ).toBeInTheDocument()
  })
})
