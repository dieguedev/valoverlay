# Step 11: Sección "Cómo funciona" con los pasos del flujo de usuario

## Tarea

Crear la sección `HowItWorks`
(`apps/panel/src/sections/HowItWorks/HowItWorks.tsx` +
`HowItWorks.module.scss`), con `id="como-funciona"` (ancla que usa el
CTA secundario del Hero, step 09) y una lista ordenada de 4 pasos,
tomados directamente del flujo de usuario descrito en
`project-overview.md`:

1. **"Regístrate en ValoVerlay"** — con email y contraseña o con Google.
2. **"Vincula tu cuenta de Riot"** — autoriza el acceso a tus datos de
   partida desde tu perfil.
3. **"Configura tu overlay"** — elige qué estadísticas mostrar y dónde.
4. **"Pégalo en OBS"** — copia tu URL única como Browser Source y
   empieza a streamear.

## Criterios de aceptación

- [ ] La sección tiene `id="como-funciona"`.
- [ ] Renderiza un heading de sección.
- [ ] Renderiza exactamente 4 pasos, cada uno con su propio heading o
      etiqueta de paso (p.ej. "Paso 1", "Paso 2"...) y una descripción.

## Tests a escribir en rojo (si el tipo de tarea aplica para test)

- Fichero de test: `apps/panel/src/sections/HowItWorks/HowItWorks.test.tsx`
- `describe('HowItWorks')`:
  - `it('tiene el id de ancla como-funciona')` —
    `render(<HowItWorks />)`,
    `container.querySelector('#como-funciona')` no es `null`. Falla
    porque el componente no existe todavía.
  - `it('renderiza el heading de la sección')` —
    `screen.getByRole('heading', { level: 2 })` presente.
  - `it('renderiza los 4 pasos del flujo')` —
    `screen.getAllByRole('listitem')` (o el rol equivalente que use la
    implementación, p.ej. `heading` de nivel 3 si no usa lista
    semántica) tiene `length === 4`.
  - `it('el segundo paso menciona vincular la cuenta de Riot')` — dentro
    de los textos de los pasos, al menos uno contiene `/riot/i` y
    `/vincul/i`.

## Criterio de verde

Todos los tests del paso pasan + linter limpio.
Comando: `pnpm --filter panel test && pnpm --filter panel lint`

## Ficheros afectados

- `apps/panel/src/sections/HowItWorks/HowItWorks.tsx` — nuevo.
- `apps/panel/src/sections/HowItWorks/HowItWorks.module.scss` — nuevo.
- `apps/panel/src/sections/HowItWorks/HowItWorks.test.tsx` — nuevo,
  tests descritos arriba.

## Skills necesarias

- tdd — ciclo rojo/verde de la sección.
- frontend-design — layout de pasos numerados (vertical en mobile,
  horizontal/timeline en desktop).

## Commits de este step

test: Añadir tests en rojo de la sección Cómo funciona
feat: Implementar la sección Cómo funciona
