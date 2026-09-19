# Step 13: Sección FAQ interactiva (acordeón)

## Tarea

Crear la sección `Faq` (`apps/panel/src/sections/Faq/Faq.tsx` +
`Faq.module.scss`): una lista de preguntas frecuentes en formato
acordeón (cada pregunta es un botón; al pulsarla se muestra/oculta su
respuesta; solo una respuesta visible a la vez, o varias — decisión
libre de implementación, no estaba fijado en el acuerdo). Preguntas
propuestas (copy real, ajustable después):

1. **"¿Necesito vincular mi cuenta de Riot?"** — "Sí, para que el
   overlay muestre tus datos reales de partida. Puedes crear tu cuenta
   de ValoVerlay primero y vincular Riot después, desde tu perfil."
2. **"¿Es gratis?"** — "Sí, el plan Free no tiene coste. El plan Pro
   añade más estadísticas simultáneas y personalización avanzada."
3. **"¿Funciona con OBS?"** — "Sí, el overlay se pega como Browser
   Source de OBS; no necesitas ningún plugin adicional."
4. **"¿Puedo cancelar cuando quiera?"** — "Sí, no hay permanencia."

## Criterios de aceptación

- [ ] Renderiza al menos 3 preguntas.
- [ ] Cada pregunta es interactiva: al pulsarla, su respuesta pasa de
      oculta a visible (comportamiento real de acordeón, no toda la
      información visible de forma estática — es lo único de esta
      sección que aporta lógica testeable de verdad).
- [ ] Al volver a pulsar la misma pregunta, la respuesta vuelve a
      ocultarse.

## Tests a escribir en rojo (si el tipo de tarea aplica para test)

- Fichero de test: `apps/panel/src/sections/Faq/Faq.test.tsx`
- `describe('Faq')`:
  - `it('la respuesta está oculta antes de pulsar la pregunta')` —
    `render(<Faq />)`,
    `screen.queryByText(/vincular cuenta de riot/i)` es la pregunta
    (visible como botón); su respuesta asociada
    (`screen.queryByText(/no necesitas ningún plugin/i)` o el texto de
    respuesta que corresponda) no está en el documento
    (`toBeNull()` o `toBeInTheDocument()` con `expect(...).not`). Falla
    porque `Faq` no existe todavía.
  - `it('pulsar una pregunta muestra su respuesta')` — usando
    `userEvent.click` sobre `screen.getByRole('button', { name: /obs/i })`,
    después del click `screen.getByText(/browser source/i)` está en el
    documento.
  - `it('pulsar de nuevo la misma pregunta oculta la respuesta')` — dos
    clicks consecutivos sobre el mismo botón dejan la respuesta fuera
    del documento otra vez.

## Criterio de verde

Todos los tests del paso pasan + linter limpio.
Comando: `pnpm --filter panel test && pnpm --filter panel lint`

## Ficheros afectados

- `apps/panel/src/sections/Faq/Faq.tsx` — nuevo, estado local
  (`useState`) para trackear qué pregunta(s) están abiertas.
- `apps/panel/src/sections/Faq/Faq.module.scss` — nuevo.
- `apps/panel/src/sections/Faq/Faq.test.tsx` — nuevo, tests descritos
  arriba (usa `@testing-library/user-event`, instalado en el step 01).

## Skills necesarias

- tdd — ciclo rojo/verde del comportamiento de acordeón.

## Commits de este step

test: Añadir tests en rojo de la sección Faq
feat: Implementar la sección Faq con acordeón
