# Step 14: Componer la HomePage con todas las secciones en la ruta `/`

## Tarea

`HomePage` (placeholder desde el step 04, con `Seo` desde el step 05)
pasa a componer, en orden, las 6 secciones construidas en los steps
06-13: `Hero`, `Features`, `HowItWorks`, `Pricing`, `Faq` — el `Footer`
ya está montado a nivel de `PublicLayout` (step 08) y no se repite aquí.
Este step es de composición pura: no añade lógica nueva, solo ensambla
piezas ya testeadas individualmente.

## Criterios de aceptación

- [ ] Visitar `/` muestra, en scroll, en este orden: Hero, Features,
      Cómo funciona, Pricing, Faq (y, por `PublicLayout`, Header arriba
      y Footer abajo).
- [ ] El heading placeholder que tenía `HomePage` desde el step 04 se
      sustituye por el `Hero` real (deja de existir un `<h1>` genérico
      de placeholder).

## Tests a escribir en rojo (si el tipo de tarea aplica para test)

- Fichero de test: `apps/panel/src/pages/HomePage.test.tsx`
- `describe('HomePage')`:
  - `it('compone las 5 secciones en orden')` —
    `render(<MemoryRouter><HomePage /></MemoryRouter>)`, obtiene todos
    los headings de nivel 1 o 2 relevantes de cada sección (el heading
    del Hero, de Features, de HowItWorks, de Pricing, de Faq si la
    tiene) vía `screen.getAllByRole('heading')` y comprueba que el orden
    relativo en el DOM coincide con Hero < Features < HowItWorks <
    Pricing < Faq (usando `compareDocumentPosition` o comprobando el
    índice de cada uno en el array devuelto). Antes de implementar,
    `HomePage` solo tiene el heading placeholder del step 04, así que
    los headings de Features/HowItWorks/Pricing/Faq no se encuentran y
    el test falla.
  - `it('ya no muestra el heading placeholder del step 04')` —
    `screen.queryByRole('heading', { name: /inicio/i })` (el texto
    placeholder exacto que se haya usado en el step 04) es `null`.

## Criterio de verde

Todos los tests del paso pasan + linter limpio.
Comando: `pnpm --filter panel test && pnpm --filter panel lint`

## Ficheros afectados

- `apps/panel/src/pages/HomePage.tsx` — reemplaza el heading placeholder
  por `<Hero />`, `<Features />`, `<HowItWorks />`, `<Pricing />`,
  `<Faq />`, manteniendo el `<Seo />` ya presente desde el step 05.
- `apps/panel/src/pages/HomePage.test.tsx` — nuevo, tests descritos
  arriba.

## Skills necesarias

- tdd — ciclo rojo/verde de la composición.

## Commits de este step

test: Añadir test en rojo de la composición de HomePage
feat: Componer HomePage con todas las secciones de la landing
