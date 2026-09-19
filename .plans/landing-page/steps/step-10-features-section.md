# Step 10: Sección Features con copy real de las tres piezas del producto

## Tarea

Crear la sección `Features` (`apps/panel/src/sections/Features/Features.tsx`
+ `Features.module.scss`) con un heading de sección y 3 tarjetas, una
por cada pieza del producto descrita en `project-overview.md`:

1. **"Overlay en vivo para OBS"** — "Pégalo como Browser Source y
   listo: sin login dentro de OBS, se identifica con una URL única y
   segura."
2. **"Panel de customización"** — "Elige qué estadísticas mostrar y en
   qué posición, sin tocar código."
3. **"Datos en tiempo real"** — "Mientras juegas, tus stats se
   actualizan solas en el overlay — no hace falta refrescar nada."

El copy exacto lo ajustará el usuario después (acuerdo punto 12); el
contenido debe ser real y específico del producto, no genérico.

## Criterios de aceptación

- [ ] `Features` renderiza un heading de sección.
- [ ] `Features` renderiza exactamente 3 tarjetas de feature.
- [ ] Cada tarjeta tiene su propio heading (nivel 3) y texto descriptivo.

## Tests a escribir en rojo (si el tipo de tarea aplica para test)

- Fichero de test: `apps/panel/src/sections/Features/Features.test.tsx`
- `describe('Features')`:
  - `it('renderiza el heading de la sección')` —
    `screen.getByRole('heading', { level: 2 })` presente. Falla porque
    `Features` no existe todavía.
  - `it('renderiza las 3 tarjetas de feature')` —
    `screen.getAllByRole('heading', { level: 3 })` tiene `length === 3`.
  - `it('la tarjeta de overlay menciona OBS')` —
    entre los headings de nivel 3, al menos uno contiene `/obs/i`.
  - `it('la tarjeta de panel menciona personalización')` —
    al menos un heading de nivel 3 contiene `/panel|customiza/i`.
  - `it('la tarjeta de tiempo real menciona actualización en vivo')` —
    al menos un heading de nivel 3 contiene `/tiempo real|en vivo/i`.

## Criterio de verde

Todos los tests del paso pasan + linter limpio.
Comando: `pnpm --filter panel test && pnpm --filter panel lint`

## Ficheros afectados

- `apps/panel/src/sections/Features/Features.tsx` — nuevo.
- `apps/panel/src/sections/Features/Features.module.scss` — nuevo.
- `apps/panel/src/sections/Features/Features.test.tsx` — nuevo, tests
  descritos arriba.

## Skills necesarias

- tdd — ciclo rojo/verde de la sección.
- frontend-design — layout de tarjetas (grid responsive).

## Commits de este step

test: Añadir tests en rojo de la sección Features
feat: Implementar la sección Features
