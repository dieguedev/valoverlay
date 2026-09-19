---
name: ejecutar
description: Ejecuta un ticket wayfinder (issue hijo de un issue mapa publicado por /planificar + /crear-tickets), lanzando un subagente por baby-step con el ciclo TDD rojo-verde y un gate de revisión humana entre pasos. Usar cuando el usuario quiera continuar o retomar la implementación de un plan ya aprobado y desglosado en tickets.
disable-model-invocation: true
---

# Ejecutar

## Inicio

Detecta el `PROJECT_ROOT` y lee la config de `planificar`:

```bash
PROJECT_ROOT=$(git rev-parse --show-toplevel 2>/dev/null)
if [ -z "$PROJECT_ROOT" ]; then
  echo "No estás dentro de un repositorio git. No se puede localizar el proyecto."
  exit 1
fi

CONFIG="$PROJECT_ROOT/.claude/skills/planificar/references/config.json"
PROJECT_NAME=$(python3 -c "import json;print(json.load(open('$CONFIG'))['project_name'])")
TICKET_TRACKER_TYPE=$(python3 -c "import json;print(json.load(open('$CONFIG'))['ticket_tracker']['type'])")
```

El usuario **DEBE PROPORCIONAR** el número del issue mapa (`wayfinder:map`) publicado por `/planificar`. Si no lo da, pídeselo:

```
Necesito el número del issue mapa (el que publicó /planificar con label "wayfinder:map")
para poder buscar los tickets listos para ejecutar.
```

### Frontier query

Con el número de mapa, lee `$PROJECT_ROOT/docs/agents/issue-tracker.md` (sección "Wayfinding operations") y sigue su convención de **frontier query**: lista los issues hijos abiertos del mapa, descarta los que tengan algún blocker abierto o ya tengan asignado, y ordénalos como diga el issue mapa.

Presenta la frontera al usuario:

```
Mapa: #[map] — [título]

Tickets listos para arrancar (sin blockers pendientes, sin asignar):
  - #[n1] — [título]
  - #[n2] — [título]
  ...

¿Con cuál seguimos?
```

Si el usuario no especifica, toma el primero en el orden del mapa.

### Al elegir un ticket

1. **Claim**: `gh issue edit <n> --add-assignee @me` (primera escritura de la sesión, según la convención de wayfinder).
2. **Rama dedicada**: crea y cambia a una rama para este ticket, p. ej. `feat/<n>-<slug>`.
3. **Cargar el plan agrupado**: lee el issue del ticket (`gh issue view <n> --comments`) para obtener el checklist de baby-steps que agrupa y el `FEATURE_SLUG` (de la ruta `.plans/<feature-slug>/` que apunta). Lee de ahí `indice.md` y localiza, dentro de `steps/*.md`, únicamente los ficheros de los baby-steps que este ticket agrupa.

Identifica los pasos pendientes (`[ ]`) del ticket y pregunta:

```
Ticket #[n] — [título]

Pasos pendientes:
  [ ] 1. [descripción]
  [ ] 2. [descripción]
  ...

¿Empezamos por el paso 1 o quieres empezar por alguno en concreto?
```

## Ciclo de ejecución por paso

Para **TODOS LOS PASOS**, sigue este ciclo (sin cambios respecto al pipeline anterior — este es el gate fino que no se sacrifica frente al `/implement` oficial):

### 1. Cargar contexto del paso

Lee el fichero `steps/step-NN-nombre.md` correspondiente. Es el único fichero que el orquestador necesita leer, no cargues las skills aquí.

Este fichero es un **contrato cerrado**, no una propuesta: `planificar` ya decidió el seam, los tests exactos en rojo, el criterio de verde y los commits de este step. Tu trabajo aquí es orquestar su ejecución, no reabrirlo.

Extrae la lista de skills de la sección "Skills necesarias" del fichero y calcula sus paths:
`$PROJECT_ROOT/.claude/skills/[nombre]/SKILL.md`.

Si el step incluye una sección "Tests a escribir en rojo", añade también la skill `tdd` a esa lista aunque el step no la mencione explícitamente, el subagente la necesita para ejecutar el bucle rojo-verde correctamente.

### 2. Lanzar el subagente ejecutor

Lanza el subagente con:
- Contenido completo del fichero del paso.
- La lista de paths de skills
- La siguiente instrucción de ejecución:

```
Este step es un contrato cerrado: el seam, los tests en rojo, el criterio de verde y los
commits ya están decididos en el fichero del paso. NO los reinterpretes ni los mejores.

Si el step tiene sección "Tests a escribir en rojo", sigue el bucle red-green-refactor de
la skill `tdd` que ya has leído, con estas particularidades de este contexto:

- El seam ya está acordado en el step — no hay paso de confirmación con el usuario, sáltatelo.
- Los tests del rojo son exactamente los descritos en "Tests a escribir en rojo": mismo
  fichero, mismos describe/it, mismo motivo de fallo. No inventes tests adicionales.
- Tras cada fase del bucle (rojo, implementación, verde, refactor si aplica), haz el commit
  correspondiente usando los mensajes de "Commits de este step" o con el formato `tipo: Descripción` si
  no viene propuesto.
- Verifica el linter tras el verde.
- Si tras 1 reintento no consigues el verde, para y reporta: qué falla, qué probaste, qué necesitas.

Si el step NO tiene sección "Tests a escribir en rojo" (tarea no testable), implementa
directamente lo descrito en "Tarea" y usa los commits propuestos en "Commits de este step".

Reglas absolutas:
- NUNCA inventes tests que no estén en el step, ni cambies el seam ya decidido
- NUNCA hagas commit de código que no compila ni de tests que fallan (salvo el commit de
  rojo, donde deben fallar intencionalmente)
```

**El subagente carga las skills**, no el orquestador. Esto mantiene el contexto del orquestador limpio.

### 3. Gestión de fallos

Si el subagente escala un fallo:
- Muestra el resumen del fallo al usuario
- Si el fallo revela que el seam o los tests definidos en el step estaban mal planteados, no lo decidas tú: coméntaselo al usuario explícitamente, puede implicar reabrir `/planificar` para ese step
- El usuario decide: ajustar el test, dar una pista de implementación, replantear el paso o reabrir la planificación
- NUNCA avances al siguiente paso con el actual sin resolver

### 4. Gate de revisión humana

Cuando el subagente reporte éxito, muestra al usuario:

```
Paso [N] completado: [nombre]

Commits realizados:
  - [mensaje commit 1]
  - [mensaje commit 2]
  - ...

Ficheros modificados: [lista breve]

Revisa los cambios. Avísame cuando estés listo para continuar.
Siguiente paso: [descripción del paso N+1, o "este era el último paso del ticket"]
```

NO lances el siguiente paso automáticamente, espera confirmación explícita.

Cuando se confirme, marca el paso completado en el `indice.md` (cambia `[ ]` por `[x]`) y en el checklist del issue del ticket, y procede al siguiente paso.

## Cierre del ticket

Cuando todos los baby-steps del ticket estén en `[x]`:

1. Comenta y cierra el issue hijo (resolve de wayfinder): `gh issue comment <n> --body "..."` seguido de `gh issue close <n>`.
2. Push de la rama y apertura de la PR:

```bash
git push -u origin feat/<n>-<slug>
gh pr create --base main --title "<título del ticket>" --body "Closes #<n>

Parte del mapa #<map>."
```

3. Avisa al usuario:

```
Ticket #[n] completado :)
PR abierta: [url de la PR devuelta por gh pr create]

¿Hay más tickets listos en la frontera del mapa #[map]? Corré /ejecutar de nuevo sobre #[map] para verlo.
```

**`ejecutar` SÍ abre la PR** al cerrar el ticket, contra `main`, con `Closes #<n>` para que el merge cierre el issue automáticamente.

### Cuando el mapa se queda sin hijos abiertos

Si al recalcular la frontera del mapa no quedan issues hijos abiertos, recuérdale al usuario limpiar el plan:

```
El mapa #[map] ya no tiene tickets abiertos. El plan en `.plans/<feature-slug>/` cumplió
su función — el registro permanente ya son el código, los issues cerrados y el historial
de git. Podés borrarlo con un commit tipo `chore: limpiar plan de <feature-slug>`.
```

## Reglas

- NO saltarse el gate de revisión entre pasos
- NO hacer commit de código roto o tests fallando (salvo el commit de test rojo, siempre y cuando el rojo sea un rojo real por falta de implementación)
- NO dejar que el subagente ejecutor invente tests o cambie el seam definido en el step: si lo necesita, es una señal de que hay que reabrir la planificación, no de improvisar
- Máximo 1 reintento del subagente antes de escalar al usuario
- Si el usuario pide saltar un paso, avisar del riesgo y pedir confirmación explícita
- Los pasos se ejecutan en orden salvo que el usuario indique lo contrario
- Al cerrar el ticket, abrir la PR contra `main` con `gh pr create` (no dejarla en manos del usuario)
