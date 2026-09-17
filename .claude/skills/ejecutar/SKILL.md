---
name: ejecutar
description: Ejecuta paso a paso un plan generado por la skill /planificar, lanzando un subagente por baby-step con el ciclo TDD rojo-verde y un gate de revisión humana entre pasos. Usar cuando el usuario quiera continuar o retomar la implementación de un plan ya aprobado.
disable-model-invocation: true
---

# Ejecutar

## Inicio

Detecta el `PROJECT_ROOT` y lee la config de `planificar` para saber dónde vive el plan:

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

El plan puede vivir en el filesystem local o en una bóveda de Obsidian. `/planificar` guarda en local siempre en la misma ruta fija: `/tmp/${PROJECT_NAME}-tasks/$TASK_ID`.

El usuario **DEBE PROPORCIONAR**:

- El `TASK_ID` con el que se generó el plan (el identificador de rama/ticket si `TICKET_TRACKER_TYPE` no es `none`, o el identificador kebab-case que se usó como nombre de carpeta si es `none`).
- El método en el que se ha guardado el plan generado por `/planificar`: local u Obsidian.

Si no proporciona estos datos, escríbele lo siguiente:

```
Necesito el identificador de la tarea (TASK_ID) y el método en el que has guardado el plan generado por "/planificar" (local u Obsidian) para poder continuar.
```

Si se proporcionan los datos, localiza el índice:

- **Local**: `OUTPUT_DIR="/tmp/${PROJECT_NAME}-tasks/$TASK_ID"`, lee `$OUTPUT_DIR/indice.md`.
- **Obsidian**: pide la bóveda si no la ha dado ya, y lee `indice` con el MCP de Obsidian dentro de la carpeta `$PROJECT_NAME/$TASK_ID`.

Identifica los pasos pendientes (`[ ]`) y pregunta:

```
Plan cargado: #[id] — [título]

Pasos pendientes:
  [ ] 1. [descripción]
  [ ] 2. [descripción]
  ...

¿Empezamos por el paso 1 o quieres empezar por alguno en concreto?
```

## Ciclo de ejecución por paso

Para **TODOS LOS PASOS**, sigue este ciclo:

### 1. Cargar contexto del paso

Lee el fichero `steps/step-NN-nombre.md` correspondiente (local u Obsidian, según dónde viva el plan). Es el único fichero que el orquestador necesita leer, no cargues las skills aquí.

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
Siguiente paso: [descripción del paso N+1, o "este era el último paso"]
```

NO lances el siguiente paso automáticamente, espera confirmación explícita.

Cuando se confirme, marca el paso completado en el `indice.md` (cambia `[ ]` por `[x]`) y procede al siguiente paso.

### 5. Finalización

Cuando todos los pasos estén en `[x]`:

```
TODOS LOS PASOS HAN SIDO COMPLETADOS en #[id] :)
Revisa que todos los cambios estén bien!
```

## Reglas

- NO saltarse el gate de revisión entre pasos
- NO hacer commit de código roto o tests fallando (salvo el commit de test rojo, siempre y cuando el rojo sea un rojo real por falta de implementación)
- NO dejar que el subagente ejecutor invente tests o cambie el seam definido en el step: si lo necesita, es una señal de que hay que reabrir la planificación, no de improvisar
- Máximo 1 reintento del subagente antes de escalar al usuario
- Si el usuario pide saltar un paso, avisar del riesgo y pedir confirmación explícita
- Los pasos se ejecutan en orden salvo que el usuario indique lo contrario
