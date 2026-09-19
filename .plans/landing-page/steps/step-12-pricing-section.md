# Step 12: Sección Pricing (Free/Pro) con los 3 diferenciadores del plan Pro

## Tarea

Crear la sección `Pricing`
(`apps/panel/src/sections/Pricing/Pricing.tsx` +
`Pricing.module.scss`) con dos tarjetas de plan, **solo visuales, sin
checkout ni Stripe** (acuerdo punto 9, no reabrir):

- **Free** — "0€", con las funciones base (overlay básico, un número
  limitado de estadísticas simultáneas, personalización básica de
  posición). CTA: **"Empezar gratis"**, enlaza a `/register`.
- **Pro** — "~20€/mes" (texto exacto a decidir por quien implemente,
  p.ej. "20€/mes"), con los 3 diferenciadores explícitos del acuerdo:
  1. Más estadísticas/widgets disponibles simultáneamente en el overlay.
  2. Personalización visual avanzada (temas, colores, marca propia, sin
     marca de agua de ValoVerlay).
  3. Acceso anticipado al futuro editor drag & drop de posicionamiento
     libre.
  CTA: **"Empezar con Pro"**, enlaza igualmente a `/register` (no hay
  flujo de pago que construir — mismo registro que el resto, tal como
  fija el acuerdo).

## Criterios de aceptación

- [ ] Renderiza exactamente 2 tarjetas de plan (Free y Pro).
- [ ] La tarjeta Pro lista los 3 diferenciadores como items
      identificables (p.ej. `<li>` dentro de una lista).
- [ ] Los CTA de ambas tarjetas enlazan a `/register`.
- [ ] Ningún elemento de la sección enlaza a un dominio de pago externo
      ni renderiza un formulario de tarjeta.

## Tests a escribir en rojo (si el tipo de tarea aplica para test)

- Fichero de test: `apps/panel/src/sections/Pricing/Pricing.test.tsx`
- `describe('Pricing')`:
  - `it('renderiza las 2 tarjetas de plan')` —
    `screen.getAllByRole('heading', { level: 3 })` tiene `length === 2`
    (uno por plan). Falla porque `Pricing` no existe todavía.
  - `it('el plan Pro lista los 3 diferenciadores')` —
    dentro del bloque del plan Pro,
    `screen.getAllByRole('listitem')` tiene `length === 3`, y su texto
    conjunto contiene `/estadísticas|widgets/i`,
    `/personalización|marca de agua/i` y
    `/drag.{0,3}drop|arrastrar/i` respectivamente (una assertion por
    diferenciador, tres `it` separados o un único `it` con 3 asserts
    consecutivos sobre el mismo render — preferible 3 `it` separados
    para que un fallo señale qué diferenciador falta).
  - `it('el CTA del plan Free enlaza a registro')` —
    `screen.getByRole('link', { name: /empezar gratis/i })` con
    `href="/register"`.
  - `it('el CTA del plan Pro enlaza a registro')` —
    `screen.getByRole('link', { name: /empezar con pro/i })` con
    `href="/register"`.

## Criterio de verde

Todos los tests del paso pasan + linter limpio.
Comando: `pnpm --filter panel test && pnpm --filter panel lint`

## Ficheros afectados

- `apps/panel/src/sections/Pricing/Pricing.tsx` — nuevo.
- `apps/panel/src/sections/Pricing/Pricing.module.scss` — nuevo.
- `apps/panel/src/sections/Pricing/Pricing.test.tsx` — nuevo, tests
  descritos arriba.

## Skills necesarias

- tdd — ciclo rojo/verde de la sección.
- frontend-design — jerarquía visual entre plan Free y Pro (destacar Pro
  sin ocultar Free).

## Commits de este step

test: Añadir tests en rojo de la sección Pricing
feat: Implementar la sección Pricing
