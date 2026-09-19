# Step 03: Instalar SASS y definir los tokens de diseño de la marca

## Tarea

Instalar el preprocesador `sass` en `apps/panel` (decisión ya tomada en
`stack-decisions.md` punto 1: CSS Modules + SASS) y crear el fichero de
tokens de diseño compartido `apps/panel/src/styles/_tokens.scss`:
variables SCSS de color (paleta de marca — fondo oscuro tipo gaming,
acento vibrante coherente con Valorant/Riot sin copiar su identidad
visual protegida, texto, bordes), tipografía (familia, escalas de
tamaño para heading/body) y espaciado (escala de espaciados base). Se
elimina el CSS plano de scaffold (`apps/panel/src/App.css`,
`apps/panel/src/index.css`) que no tiene relación con el producto.

Este step no crea ningún componente visual todavía — solo dispone la
base de estilos que los steps 06 en adelante van a `@use`.

## Criterios de aceptación

- [ ] `sass` está instalado como devDependency y Vite compila `.scss`
      sin configuración adicional (soporte nativo de Vite).
- [ ] `_tokens.scss` expone variables usables vía `@use '../styles/tokens' as *;`
      desde cualquier módulo `.module.scss` de `apps/panel/src`.
- [ ] `apps/panel/src/App.css` y `apps/panel/src/index.css` (CSS de
      scaffold sin relación con el producto) se eliminan; `index.html`
      ya no falla al cargar porque `main.tsx` deja de importar
      `./index.css`.
- [ ] `pnpm --filter panel build` compila sin errores tras el cambio.

## Tests a escribir en rojo (si el tipo de tarea aplica para test)

No aplica. Los tokens de diseño son valores SCSS (colores, tamaños,
espaciados) sin lógica de producción observable — no hay ningún
comportamiento de la aplicación que dependa de un valor concreto de
forma testeable sin convertirse en un "detector de cambios" (testear que
`$color-accent` vale exactamente `#ff4655`, por ejemplo, no protege
contra ningún bug real, solo contra un rediseño intencionado). Es un
caso explícito de "fichero de configuración" según la excepción de la
skill `tdd`.

El criterio de verde se demuestra con la compilación real
(`pnpm --filter panel build`) usando los tokens desde al menos un
fichero `.module.scss` de prueba mínimo, para confirmar que la cadena
Vite + SASS + CSS Modules funciona de punta a punta antes de que el
step 06 dependa de ella.

## Criterio de verde

Build limpio (no hay tests de producto que ejecutar en este step).
Comando: `pnpm --filter panel build`

## Ficheros afectados

- `apps/panel/package.json` — añadir devDependency `sass`.
- `apps/panel/src/styles/_tokens.scss` — nuevo, variables de color,
  tipografía y espaciado.
- `apps/panel/src/App.css` — eliminado.
- `apps/panel/src/index.css` — eliminado.
- `apps/panel/src/main.tsx` — quitar `import './index.css'`.
- `apps/panel/src/App.tsx` — quitar `import './App.css'` si existiera
  (verificar: hoy `App.tsx` no lo importa directamente, solo
  `main.tsx` importa `index.css`; confirmar al ejecutar el step).

## Skills necesarias

- frontend-design — para decidir la paleta y escala tipográfica de marca
  con intención, no valores por defecto genéricos, ya que el acuerdo
  exige fidelidad visual desde esta primera versión.

## Commits de este step

feat: Instalar SASS y definir tokens de diseño de la marca
