# Step 17: Instalar Better Auth + adapter Drizzle, generar y migrar el schema de auth

## Tarea

Instalar `better-auth` en `apps/server` y configurar la instancia de
Better Auth (`apps/server/src/auth.ts`) usando el **adapter oficial de
Drizzle** (`better-auth/adapters/drizzle`) sobre el `db` ya existente
(`apps/server/src/db/index.ts`), con `emailAndPassword: { enabled: true }`
(el proveedor Google se añade en el step 20, para no mezclar dos
proveedores en el mismo step). Generar el schema de tablas que Better
Auth necesita (`user`, `session`, `account`, `verification`) con el CLI
oficial de Better Auth y aplicarlo con `drizzle-kit push` tanto a la
base de datos de desarrollo como a una base de datos de test dedicada.

Este step deja el schema migrado y la instancia `auth` exportada, pero
**no la monta todavía en Express** (eso es el step 18) — es
deliberadamente el step "solo schema/config" para no mezclar migración
de base de datos con la ruta HTTP en el mismo ciclo rojo/verde.

### Base de datos de test

Se usa el mismo Postgres de `docker-compose.yml`, con una base de datos
separada `valoverlay_test` para no mezclar datos de test con los de
desarrollo:

```bash
docker exec -it $(docker compose ps -q postgres) \
  psql -U valoverlay -d valoverlay -c "CREATE DATABASE valoverlay_test;"
```

Variable de entorno nueva `TEST_DATABASE_URL` (documentar en un
`.env.example` si el repo no tiene uno, o en el README de `apps/server`
si lo hay), valor por defecto
`postgres://valoverlay:valoverlay@localhost:5432/valoverlay_test`.
Aplicar el mismo schema a ambas bases:

```bash
DATABASE_URL=postgres://valoverlay:valoverlay@localhost:5432/valoverlay pnpm --filter server db:push
DATABASE_URL=postgres://valoverlay:valoverlay@localhost:5432/valoverlay_test pnpm --filter server db:push
```

## Criterios de aceptación

- [ ] `apps/server/src/auth.ts` exporta una instancia `auth` de Better
      Auth configurada con `drizzleAdapter` y `emailAndPassword.enabled === true`.
- [ ] El CLI de Better Auth genera el schema de las tablas de auth en
      un fichero Drizzle nuevo (p.ej.
      `apps/server/src/db/auth-schema.ts`), sin sobreescribir
      `apps/server/src/db/schema.ts` (la tabla `ping` existente se
      mantiene intacta).
- [ ] `pnpm --filter server db:push` aplica el schema combinado
      (`schema.ts` + `auth-schema.ts`) sin errores contra
      `valoverlay` y contra `valoverlay_test`.
- [ ] Tras la migración, las tablas `user`, `session`, `account` y
      `verification` existen en ambas bases de datos.

## Tests a escribir en rojo (si el tipo de tarea aplica para test)

No aplica un ciclo rojo→verde de comportamiento de producción
observable: este step es configuración e infraestructura de datos (el
schema generado por el CLI de Better Auth no es código que este equipo
escriba ni deba testear línea a línea — testear que una tabla generada
tiene tal columna sería testear el framework, no nuestro código, según
la skill `tdd`). El comportamiento real de `auth` (que efectivamente
cree y autentique usuarios) se verifica en los steps 18 y 19, que sí
tienen ciclo rojo/verde completo contra Postgres real.

El criterio de verde de este step es puramente de infraestructura:
migración aplicada + servidor sigue arrancando.

## Criterio de verde

Migración aplicada sin errores + el servidor sigue arrancando +
`pnpm --filter server build` compila.
Comando:
`pnpm --filter server db:push && pnpm --filter server build`

## Ficheros afectados

- `apps/server/package.json` — añadir dependency `better-auth`.
- `apps/server/src/auth.ts` — nuevo, instancia `auth` de Better Auth con
  `drizzleAdapter(db, { provider: 'pg', schema: authSchema })` y
  `emailAndPassword: { enabled: true }`.
- `apps/server/src/db/auth-schema.ts` — nuevo, generado por
  `npx @better-auth/cli generate` (tablas `user`, `session`, `account`,
  `verification`).
- `apps/server/drizzle.config.ts` — `schema` pasa a apuntar a un array
  (`['./src/db/schema.ts', './src/db/auth-schema.ts']`) o a un barrel
  que reexporte ambos, para que `drizzle-kit push` migre las tablas de
  producto y las de auth juntas.
- `.env.example` (raíz o `apps/server/.env.example`, según convención
  que ya exista en el repo — si no existe ninguna, crearlo en
  `apps/server/`) — documentar `DATABASE_URL` y `TEST_DATABASE_URL`.

## Skills necesarias

- tdd — para justificar explícitamente por qué este step de
  schema/migración no lleva ciclo rojo/verde de producto (excepción de
  "código generado"/"fichero de configuración"), dejando el
  comportamiento real para los steps 18-19.

## Commits de este step

feat: Instalar Better Auth con adapter Drizzle y migrar el schema de auth
