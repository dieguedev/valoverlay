# Step 21: Instalar y configurar el cliente de Better Auth en apps/panel

## Tarea

Instalar `better-auth` en `apps/panel` (el paquete expone también el
cliente, vía el subpath `better-auth/react`) y crear
`apps/panel/src/lib/auth-client.ts`, que exporta un `authClient` creado
con `createAuthClient({ baseURL: import.meta.env.VITE_SERVER_URL ?? 'http://localhost:3050' })`
y los helpers que se consumen directamente en los steps siguientes:
`signIn`, `signUp`, `signOut`, `useSession`. Añadir
`VITE_SERVER_URL` a un `.env.example` de `apps/panel` (crear si no
existe).

Este step es de configuración/wiring de un cliente de terceros — no
introduce lógica propia (no valida, no transforma, no deriva nada; es
un reenvío directo de `createAuthClient`, exactamente el caso que la
guía de buenos tests de la skill `tdd` señala como frontera que no se
gana test propio: "constructores, getters, constantes y reenvíos
triviales solo se ganan tests cuando validan, normalizan, aplican un
valor por defecto, derivan, fuerzan una regla o causan efectos
secundarios"). El comportamiento real de `authClient` se prueba donde se
usa de verdad: las páginas `/register` (step 22) y `/login` (step 23).

## Criterios de aceptación

- [ ] `apps/panel/src/lib/auth-client.ts` exporta `authClient` (o los
      helpers desestructurados `signIn`/`signUp`/`signOut`/`useSession`)
      apuntando a `VITE_SERVER_URL`.
- [ ] `pnpm --filter panel build` compila sin errores con la nueva
      dependencia.

## Tests a escribir en rojo (si el tipo de tarea aplica para test)

No aplica: reenvío trivial de una librería de terceros, sin lógica
propia que validar, normalizar o derivar (ver justificación en
"Tarea"). El comportamiento se cubre indirectamente en los steps 22 y
23, donde `authClient` se mockea en el límite correcto (la llamada de
red) para probar el comportamiento real de los formularios.

## Criterio de verde

Build limpio (no hay tests de producto que ejecutar en este step).
Comando: `pnpm --filter panel build`

## Ficheros afectados

- `apps/panel/package.json` — añadir dependency `better-auth`.
- `apps/panel/src/lib/auth-client.ts` — nuevo.
- `apps/panel/.env.example` — nuevo (o ampliado si ya existiera),
  documenta `VITE_SERVER_URL`.

## Skills necesarias

- tdd — para justificar explícitamente por qué este step no lleva tests
  propios (reenvío trivial de librería de terceros).

## Commits de este step

feat: Configurar el cliente de Better Auth en apps/panel
