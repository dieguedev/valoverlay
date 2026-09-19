---
fecha: 2026-09-17T17:21:07Z
git_commit: 1ebf44559cf1b82946747c98cfc77c707afcab13
rama: main
repositorio: valoverlay
estado: "completada"
ultima_modificacion: 2026-09-17T17:21:07Z
---

# Exploración: landing-page — Landing page pública de ValoVerlay

## Resumen

El monorepo pnpm (`pnpm-workspace.yaml`: `apps/*`, `packages/*`) contiene
cuatro paquetes: `apps/server`, `apps/panel`, `apps/overlay` y
`packages/shared`. `apps/panel` y `apps/overlay` son, ambos, scaffolds sin
modificar generados por el template oficial `create-vite` (React + TS +
SWC/Oxc), con estructura de ficheros idéntica entre sí (`App.tsx`, `App.css`,
`index.css`, `main.tsx`, `vite.config.ts`, mismos assets `hero.png`,
`react.svg`, `vite.svg`). `apps/panel/src/App.tsx` solo contiene una
llamada `fetch` de prueba a `http://localhost:3050/health` del server. No
existe routing (no hay `react-router` ni ninguna librería de routing
instalada en ningún `package.json` del repo), no existe ningún sistema de
CSS Modules en uso (no hay ficheros `*.module.css`/`*.module.scss`, ni
`sass` en ninguna dependencia), no hay Better Auth ni ninguna lógica de
sesión/autenticación integrada en `apps/panel` (ni en ningún otro paquete:
`grep` de `better-auth` en todo el repo no da resultados), y no hay
configuración de despliegue (no existe ningún `Dockerfile` ni configuración
de Nginx en el repo; solo hay un `docker-compose.yml` en la raíz que
levanta únicamente un contenedor de Postgres). No hay ningún framework de
testing configurado ni a nivel raíz ni en `apps/panel` (no hay `vitest` ni
`jest` en ningún `package.json`, ni ficheros de test).

## Hallazgos detallados

### Estructura del monorepo

- Raíz (`/Users/diegue/Proyectos/valoverlay/package.json`): paquete privado
  vacío, sin scripts (`{"name": "valoverlay", "private": true, "version":
  "0.0.0"}`). No define scripts `dev`/`build`/`test` a nivel raíz.
- `pnpm-workspace.yaml` declara los workspaces `apps/*` y `packages/*`, más
  `allowBuilds: { esbuild: true }`.
- `apps/server`: Express + Socket.IO + Drizzle (`apps/server/src/index.ts`,
  `apps/server/src/db/index.ts`, `apps/server/src/db/schema.ts`,
  `apps/server/drizzle.config.ts`).
- `apps/panel`: React + Vite, scaffold sin modificar (ver sección
  siguiente).
- `apps/overlay`: React + Vite, scaffold sin modificar, estructura de
  ficheros idéntica a `apps/panel` (mismo `App.tsx`/`App.css`/`index.css`,
  mismos assets de ejemplo).
- `packages/shared`: paquete `@valoverlay/shared`
  (`packages/shared/package.json`), un único fichero
  `packages/shared/src/index.ts` que exporta el tipo `HealthResponse =
  { status: "ok" }`. Sin build step (`"main": "./src/index.ts"`, `"types":
  "./src/index.ts"`), consumido directamente como TS fuente por `server` y
  `panel`.

### `apps/panel` — contenido actual

- `apps/panel/package.json`: nombre `panel`, `"type": "module"`. Scripts:
  `dev` (`vite`), `build` (`tsc -b && vite build`), `lint` (`oxlint`),
  `preview` (`vite preview`). Dependencias: `@valoverlay/shared`
  (`workspace:*`), `react@^19.2.8`, `react-dom@^19.2.8`. DevDependencies:
  `@types/node`, `@types/react`, `@types/react-dom`,
  `@vitejs/plugin-react@^6.1.0`, `oxlint@^1.79.0`, `typescript@~6.0.2`,
  `vite@^8.2.2`.
- `apps/panel/src/main.tsx:1-10` — entrypoint estándar: monta `<App />`
  dentro de `<StrictMode>` en `#root`, importa `./index.css`.
- `apps/panel/src/App.tsx:1-17` — único componente de la app. Importa el
  tipo `HealthResponse` de `@valoverlay/shared`, hace `fetch` a
  `http://localhost:3050/health` en un `useEffect` y renderiza `<p>server
  status: {status}</p>`. No contiene routing, layout, ni estructura de
  página real; es el único componente de negocio existente en `panel`.
- `apps/panel/src/App.css` e `index.css` son el CSS global (plano, no CSS
  Modules) del template de `create-vite`: variables de tema en `:root`
  (`--text`, `--bg`, `--accent`, `--border`, etc.) con override vía
  `@media (prefers-color-scheme: dark)` en `apps/panel/src/index.css:33-51`,
  y clases de ejemplo (`.hero`, `.counter`, `#next-steps`, etc.) del
  template en `apps/panel/src/App.css` sin relación con el dominio del
  producto.
- `apps/panel/index.html:1-13` — HTML base del template Vite: `<title>panel
  </title>`, sin meta tags SEO (no hay `<meta name="description">`, no hay
  Open Graph, no hay `<html lang>` distinto de `en`), `<div id="root">` y
  script módulo a `/src/main.tsx`.
- `apps/panel/public/`: solo `favicon.svg` e `icons.svg` (assets del
  template).
- `apps/panel/src/assets/`: `hero.png`, `react.svg`, `vite.svg` — assets de
  ejemplo del template `create-vite`, sin relación con contenido de
  producto/marketing.
- `apps/panel/README.md` es el README por defecto del template
  `create-vite` (menciona plugins oficiales `@vitejs/plugin-react` /
  `plugin-react-swc` y cómo activar reglas type-aware de Oxlint).
- No hay ningún directorio `src/pages`, `src/routes`, `src/components`,
  `src/layouts` dentro de `apps/panel`.

### Routing

- No existe ningún sistema de routing configurado en `apps/panel`.
  `apps/panel/src/App.tsx` no importa ni usa `react-router-dom` ni
  ninguna otra librería de routing. `grep -r "react-router"` sobre todos
  los `package.json` del repo no arroja resultados. No hay ficheros de
  configuración de rutas.

### Configuración de Vite en `apps/panel`

- `apps/panel/vite.config.ts:1-7` — configuración mínima:
  ```ts
  import react from '@vitejs/plugin-react'
  import { defineConfig } from 'vite'

  export default defineConfig({
    plugins: [react()],
  })
  ```
  Solo el plugin `@vitejs/plugin-react`. No hay alias de rutas (`resolve.alias`),
  no hay configuración explícita de CSS Modules/SASS (Vite trae soporte de
  CSS Modules nativo vía convención de nombre `*.module.css`, pero no hay
  ningún fichero que use esa convención todavía, ni el preprocesador `sass`
  está instalado en devDependencies), y no hay definición de variables de
  entorno (`envDir`, `define`, uso de `import.meta.env`) en ningún fichero
  de `apps/panel`.
- `apps/panel/tsconfig.json:1-7` referencia `tsconfig.app.json` y
  `tsconfig.node.json` (patrón de project references de TS estándar del
  template Vite).
- `apps/panel/tsconfig.app.json:1-26` — `target: es2023`, `jsx:
  react-jsx`, `moduleResolution: bundler`, `noEmit: true`, sin paths/alias
  personalizados.
- `apps/panel/.oxlintrc.json:1-8` — linter Oxlint con plugins `react`,
  `typescript`, `oxc`; reglas `react/rules-of-hooks: error` y
  `react/only-export-components: warn`.

### Componentes/layouts/assets reutilizables

- No existen componentes, layouts ni páginas reutilizables en
  `apps/panel` más allá del único `App.tsx` de prueba descrito arriba.
- `packages/shared/src/index.ts` solo exporta el tipo `HealthResponse`; no
  contiene componentes, tokens de diseño, ni utilidades de UI.
- `apps/overlay` tiene la misma estructura scaffold que `apps/panel`
  (mismos ficheros, mismo contenido de plantilla) pero es una app
  independiente; no hay import cruzado entre `apps/panel` y `apps/overlay`.

### Sistema de diseño / tokens / CSS Modules

- No hay ningún sistema de diseño ni tokens SASS establecidos en el
  proyecto. Las únicas "variables de tema" existentes son las CSS custom
  properties del template `create-vite` en `apps/panel/src/index.css:1-31`
  (p.ej. `--accent: #aa3bff`, `--text`, `--bg`, `--border`), pensadas para
  el ejemplo de contador del template, no para el producto.
- No hay ningún fichero SASS (`.scss`/`.sass`) en el repo, ni la
  dependencia `sass` instalada en ningún `package.json`.
- No hay convención de CSS Modules en uso: no existe ningún fichero
  `*.module.css` ni `*.module.scss` en el repo (verificado con `find`).
  `apps/panel/src/App.css` es CSS global plano importado directamente en
  `App.tsx` habría que revisar el import real, pero el patrón de nombre de
  fichero (`App.css`, no `App.module.css`) indica que no usa CSS Modules.

### Autenticación / sesión

- No existe ninguna lógica de sesión ni autenticación (Better Auth u
  otra) integrada en `apps/panel`. `grep -r "better-auth"` sobre todo el
  repo (ficheros `.json`, `.ts`, `.tsx`) no arroja resultados en ningún
  paquete, incluyendo `apps/server`.
- `apps/server/src/index.ts:1-45` no monta Better Auth ni ningún
  middleware de sesión; solo expone `GET /health`, `GET /db-health` y el
  canal de Socket.IO con un token de desarrollo hardcodeado
  (`DEV_TOKEN = "dev-token"`, `apps/server/src/index.ts:14`) usado para
  aislar el `room` de Socket.IO — no relacionado con sesión de usuario ni
  con distinguir rutas públicas/privadas.
- En consecuencia, no hay en `apps/panel` ningún mecanismo actual que
  distinga entre rutas públicas y rutas con sesión (no existe tal
  distinción porque no hay routing todavía).

### Scripts de build/dev/test

- Raíz (`/Users/diegue/Proyectos/valoverlay/package.json`): sin sección
  `scripts`.
- `apps/panel/package.json:6-11`: `dev` → `vite`; `build` → `tsc -b &&
  vite build`; `lint` → `oxlint`; `preview` → `vite preview`. No hay
  script `test`.
- `apps/server/package.json:6-11`: `dev` → `tsx watch src/index.ts`;
  `build` → `tsc -b`; `start` → `node dist/src/index.js`; `db:push` →
  `drizzle-kit push`. Tampoco hay script `test`.
- No hay ningún script de test ni configuración de test runner
  (`vitest`, `jest`, etc.) en ningún `package.json` del repo (búsqueda
  `grep -ri "vitest\|jest"` sobre todos los `package.json` sin resultados).

### Despliegue

- El único fichero de infraestructura del repo es
  `/Users/diegue/Proyectos/valoverlay/docker-compose.yml`, que define
  exclusivamente un servicio `postgres` (imagen `postgres:17-alpine`,
  credenciales hardcodeadas `valoverlay`/`valoverlay`, puerto `5432`,
  volumen `postgres-data`). No define servicios para `server`, `panel` ni
  `overlay`.
- No existe ningún `Dockerfile` en el repo (búsqueda `find . -iname
  "Dockerfile*"` sin resultados fuera de `node_modules`).
- No existe ninguna configuración de Nginx en el repo (búsqueda `find .
  -iname "*nginx*"` sin resultados).
- En consecuencia, no hay hoy ninguna configuración que determine cómo se
  sirve `apps/panel` en producción ni que distinga el servir la landing
  del dashboard.

### Dependencias instaladas en `apps/panel`

- `dependencies`: `@valoverlay/shared` (workspace), `react@^19.2.8`,
  `react-dom@^19.2.8`. No hay ninguna dependencia de routing, formularios
  ni SEO/meta-tags instalada.
- `devDependencies`: `@types/node`, `@types/react`, `@types/react-dom`,
  `@vitejs/plugin-react@^6.1.0`, `oxlint@^1.79.0`, `typescript@~6.0.2`,
  `vite@^8.2.2`. No hay `sass`, `vitest`, `react-router-dom`, librerías de
  formularios (`react-hook-form`, etc.) ni librerías de SEO
  (`react-helmet` u otras).

## Preguntas y respuestas

P: ¿Qué apps existen actualmente en el monorepo y cuál es la estructura de
carpetas de cada una?
R: `apps/server` (Express + Socket.IO + Drizzle: `src/index.ts`,
`src/db/index.ts`, `src/db/schema.ts`, `drizzle.config.ts`), `apps/panel` y
`apps/overlay` (ambos scaffolds `create-vite` React+TS idénticos entre sí:
`src/App.tsx`, `src/App.css`, `src/index.css`, `src/main.tsx`,
`src/assets/`, `public/`, `vite.config.ts`, `tsconfig*.json`,
`.oxlintrc.json`), y `packages/shared` (`src/index.ts` con un único tipo
exportado).

P: ¿Existe ya código dentro de `apps/panel`? ¿Qué contiene exactamente?
R: Sí, pero es el scaffold sin modificar de `create-vite` (template
React+TS con SWC/Oxc) más una única modificación funcional: `App.tsx` hace
un `fetch` de prueba a `http://localhost:3050/health` del server y muestra
el resultado. `package.json` tiene scripts `dev`/`build`/`lint`/`preview`
y solo `react`/`react-dom`/`@valoverlay/shared` como dependencias de
producción.

P: ¿Hay ya algún sistema de routing configurado en `apps/panel`?
R: No. No hay `react-router` ni ninguna otra librería de routing instalada
en ningún `package.json` del repo, ni configuración de rutas en ningún
fichero.

P: ¿Cómo está configurado Vite en `apps/panel`?
R: Configuración mínima (`apps/panel/vite.config.ts`) con solo el plugin
`@vitejs/plugin-react`. Sin alias de resolución, sin configuración
explícita de SASS (no instalado), sin definición de variables de entorno
personalizadas.

P: ¿Existen ya componentes, layouts, páginas o assets reutilizables
relevantes para una landing pública?
R: No. El único componente es el `App.tsx` de prueba con el fetch de
health-check. Los assets presentes (`hero.png`, `react.svg`, `vite.svg`,
`favicon.svg`, `icons.svg`) son los del template `create-vite`, sin
relación con contenido de marketing/producto. `packages/shared` no
contiene componentes ni tokens de diseño.

P: ¿Hay ya algún sistema de diseño, tokens/variables SASS, o convenciones
de estilos establecidas?
R: No. No hay ficheros SASS ni la dependencia `sass` instalada, y no hay
ningún fichero `*.module.css`/`*.module.scss` en el repo. Las únicas
variables de tema existentes son custom properties CSS planas del template
en `apps/panel/src/index.css`.

P: ¿Existe ya lógica de sesión/autenticación (Better Auth) integrada en
`apps/panel`?
R: No. No hay ninguna referencia a `better-auth` en ningún fichero del
repo (ni en `apps/panel` ni en `apps/server`). El server actual no monta
autenticación de usuarios; su único mecanismo de "token" es
`DEV_TOKEN = "dev-token"` hardcodeado para el room de Socket.IO
(`apps/server/src/index.ts:14`), no relacionado con sesión.

P: ¿Qué scripts de build/dev/test existen a nivel raíz y en `apps/panel`?
R: A nivel raíz, ninguno (el `package.json` raíz no define `scripts`). En
`apps/panel`: `dev` (`vite`), `build` (`tsc -b && vite build`), `lint`
(`oxlint`), `preview` (`vite preview`). No hay script `test` en ningún
`package.json` del repo.

P: ¿Hay algún framework o convención de testing ya configurado?
R: No. No aparece `vitest`, `jest` ni ningún otro test runner en ningún
`package.json` del monorepo, ni ficheros de test.

P: ¿Existe ya configuración de despliegue que determine cómo se sirve
`apps/panel` en producción?
R: No. Solo existe `docker-compose.yml` en la raíz y define exclusivamente
un contenedor de Postgres. No hay `Dockerfile` ni configuración de Nginx
en ningún punto del repo.

P: ¿Qué dependencias están ya instaladas en `apps/panel/package.json`
relacionadas con routing, formularios, SEO, meta-tags?
R: Ninguna. Las únicas dependencias de producción son `react`, `react-dom`
y `@valoverlay/shared`; no hay `react-router-dom`, librerías de
formularios ni librerías de SEO/meta-tags.

## Referencias de código

- `apps/panel/package.json:1-26` — manifiesto de `panel`: scripts, deps y
  devDeps completas.
- `apps/panel/vite.config.ts:1-7` — configuración de Vite (solo plugin
  React).
- `apps/panel/src/App.tsx:1-17` — único componente de la app: fetch de
  prueba a `/health` del server.
- `apps/panel/src/main.tsx:1-10` — entrypoint, monta `App` en `#root`.
- `apps/panel/index.html:1-13` — HTML base sin meta tags SEO.
- `apps/panel/src/index.css:1-31` — variables de tema CSS del template
  (custom properties en `:root`).
- `apps/panel/src/index.css:33-51` — override de tema para `prefers-color-scheme: dark`.
- `apps/panel/tsconfig.app.json:1-26` — config TS de la app (jsx,
  moduleResolution, target).
- `apps/panel/.oxlintrc.json:1-8` — configuración del linter Oxlint.
- `apps/server/src/index.ts:1-45` — servidor Express + Socket.IO;
  `DEV_TOKEN` hardcodeado en línea 14; endpoints `/health` (línea 28) y
  `/db-health` (línea 33).
- `packages/shared/src/index.ts:1-3` — único tipo exportado
  (`HealthResponse`).
- `pnpm-workspace.yaml:1-4` — definición de workspaces (`apps/*`,
  `packages/*`).
- `docker-compose.yml:1-14` — único servicio definido: `postgres`.
- `.claude/stack-decisions.md:228-241` (punto 13) — decisión ya tomada de
  que la landing pública vive dentro de `apps/panel` como rutas públicas
  sin sesión.

## Arquitectura

- Monorepo pnpm con cuatro paquetes (`apps/server`, `apps/panel`,
  `apps/overlay`, `packages/shared`), sin scripts orquestadores a nivel
  raíz; cada paquete se ejecuta con sus propios scripts (previsible uso de
  `pnpm --filter <paquete> <script>`, aunque no hay evidencia de ello en
  ningún fichero de configuración raíz).
- `apps/panel` y `apps/overlay` comparten exactamente la misma estructura
  de ficheros porque ambos provienen del mismo template `create-vite`
  (React + TypeScript + `@vitejs/plugin-react`), sin ninguna
  personalización de arquitectura (sin routing, sin gestor de estado, sin
  CSS Modules/SASS, sin testing) aplicada todavía a ninguno de los dos.
- `packages/shared` se consume como fuente TypeScript directa (sin paso de
  build propio: `"main"`/`"types"` apuntan a `./src/index.ts`), y hoy solo
  expone el tipo `HealthResponse` usado por el único endpoint de
  health-check consumido desde `apps/panel/src/App.tsx`.
- El único acoplamiento cross-app implementado hasta ahora es
  `apps/panel` → `apps/server` vía HTTP fetch a `/health`, y
  `apps/server` ↔ Socket.IO con un token de desarrollo hardcodeado (no
  relacionado con `apps/panel`, sino pensado para `apps/overlay` según la
  documentación de contexto).
- No hay ninguna pieza de infraestructura (Dockerfile, Nginx, CI) que
  hoy defina cómo `apps/panel` llegaría a producción; el único artefacto
  de infraestructura existente en el repo es el contenedor de Postgres en
  `docker-compose.yml`.
