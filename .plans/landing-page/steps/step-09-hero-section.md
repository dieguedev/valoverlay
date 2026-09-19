# Step 09: Sección Hero con copy real y CTA a /register

## Tarea

Crear la sección `Hero` (`apps/panel/src/sections/Hero/Hero.tsx` +
`Hero.module.scss`), la primera sección visible de la home. Copy
propuesto (el usuario lo ajustará después, según el acuerdo punto 12 —
no es texto final, pero es contenido real de producto, no Lorem ipsum):

- Heading principal: **"Tu overlay de estadísticas de Valorant, listo
  para OBS en minutos"**.
- Subheading: **"ValoVerlay conecta tu cuenta de Riot con un overlay en
  vivo para tus directos: KDA, rango, economía y más, actualizado en
  tiempo real mientras juegas."**
- CTA primario: **"Crear cuenta gratis"**, enlaza a `/register`.
- CTA secundario: **"Ver cómo funciona"**, enlaza con scroll ancla a la
  sección "Cómo funciona" (`href="#como-funciona"`; el `id` lo expone la
  sección del step 11 — hasta entonces el enlace no falla, solo no hace
  scroll a nada porque el ancla no existe todavía).

## Criterios de aceptación

- [ ] `Hero` renderiza el heading principal como `<h1>`.
- [ ] `Hero` renderiza el CTA primario como enlace a `/register`.
- [ ] `Hero` renderiza el CTA secundario como enlace a `#como-funciona`.

## Tests a escribir en rojo (si el tipo de tarea aplica para test)

- Fichero de test: `apps/panel/src/sections/Hero/Hero.test.tsx`
- `describe('Hero')`:
  - `it('renderiza el heading principal')` —
    `render(<MemoryRouter><Hero /></MemoryRouter>)`,
    `screen.getByRole('heading', { level: 1 })` contiene el texto
    "overlay" (comprobación por palabra clave con regex
    `/overlay/i`, no el copy completo literal, para no acoplar el test
    al texto exacto que el usuario va a ajustar después). Falla porque
    `Hero` no existe todavía.
  - `it('el CTA primario enlaza a registro')` —
    `screen.getByRole('link', { name: /crear cuenta/i })` con
    `href="/register"`.
  - `it('el CTA secundario enlaza al ancla de cómo funciona')` —
    `screen.getByRole('link', { name: /cómo funciona/i })` con
    `href="#como-funciona"`.

## Criterio de verde

Todos los tests del paso pasan + linter limpio.
Comando: `pnpm --filter panel test && pnpm --filter panel lint`

## Ficheros afectados

- `apps/panel/src/sections/Hero/Hero.tsx` — nuevo.
- `apps/panel/src/sections/Hero/Hero.module.scss` — nuevo.
- `apps/panel/src/sections/Hero/Hero.test.tsx` — nuevo, tests descritos
  arriba.

## Skills necesarias

- tdd — ciclo rojo/verde de la sección.
- frontend-design — composición visual del hero (jerarquía tipográfica,
  imagen/ilustración de apoyo si aplica).

## Commits de este step

test: Añadir tests en rojo de la sección Hero
feat: Implementar la sección Hero
