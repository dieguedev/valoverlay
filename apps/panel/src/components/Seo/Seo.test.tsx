import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Seo from './Seo'

describe('Seo', () => {
  it('escribe el title del documento', () => {
    render(<Seo title="Título de prueba" description="Descripción de prueba" />)

    expect(document.title).toBe('Título de prueba')
  })

  it('escribe la meta description del documento', () => {
    render(<Seo title="Título de prueba" description="Descripción de prueba" />)

    expect(
      document.querySelector('meta[name="description"]')?.getAttribute('content'),
    ).toBe('Descripción de prueba')
  })
})
