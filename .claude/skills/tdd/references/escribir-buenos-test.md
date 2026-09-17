# Escribir buenos tests

**Carga esta referencia cuando:** escribas o modifiques tests, añadas mocks,
o añadas métodos de limpieza/helpers para tests.

## Visión general

Un test existe para detectar una rotura concreta. Dos principios rigen todo
esto:

```
1. Todo test nombra la rotura que detecta
2. Todo test ejercita lo real
```

El TDD estricto produce ambas cosas de forma natural: un test escrito
primero y visto fallar contra código real ya ha demostrado que puede
fallar, y solo se gana un mock cuando la dependencia real resulta lenta o
externa.

## Principio 1: Nombra la rotura

Antes de escribir el cuerpo del test, responde: **¿qué cambio de
producción debería hacer fallar este test — y ese cambio es un bug o una
decisión?** Un test se gana su sitio detectando una rama incorrecta, un
efecto secundario que falta, un argumento incorrecto, un caso límite o un
contrato roto.

**Deriva las expectativas de forma independiente.** Usa literales y
fixtures comprobados a mano; los tests dirigidos por tabla con valores
`want` literales son la forma preferida. Una expectativa calculada por el
propio código bajo test — o sus helpers — pasa sin importar lo que haga
ese código:

```typescript
// ❌ Assertion espejo: el mismo builder calcula ambos lados — siempre verdadero
const expected = buildSearchQuery({ tag: "urgent" });
expect(buildSearchQuery({ tag: "urgent" })).toBe(expected);

// ✅ Literal derivado a mano
expect(buildSearchQuery({ tag: "urgent" })).toBe('tag:"urgent"');
```

**Nada de detectores de cambios.** Si un test solo puede fallar por
decisiones intencionadas — el valor de una constante, el texto exacto de
un mensaje, la estructura privada — salta con cada rediseño y duerme
durante los bugs de verdad. Testea el comportamiento que depende de la
decisión: no `expect(MAX_RETRIES).toBe(5)`, sino "una llamada fallida se
reintenta 5 veces y el sexto intento nunca ocurre."

**Comportamiento, no texto.** Comprobar que un script, skill o config
contiene una línea exacta solo demuestra que la fuente es la fuente.
Ejecuta los scripts contra entradas controladas y comprueba salidas,
efectos secundarios o códigos de salida. Los documentos que instruyen a
agentes se testean por el comportamiento del agente que los consume
(superpowers:writing-skills); la prosa para humanos no se gana ningún
test.

**Tu código, no el framework.** Testea el contrato que tu código ofrece
en sus fronteras — la ruta que registras, la query que emites, el payload
que produces. La mecánica de las dependencias upstream es cosa de sus
mantenedores (el clásico: comprobar que tu router invoca un handler
registrado — eso es un test del framework, no tuyo). Cuando un
comportamiento upstream te sorprendió de verdad, escribe un único test de
caracterización acotado que nombre esa suposición. La misma frontera
aplica dentro de tu propio código: constructores, getters, constantes y
reenvíos triviales solo se ganan tests cuando validan, normalizan,
aplican un valor por defecto, derivan, fuerzan una regla o causan efectos
secundarios — si no, comprueba el primer resultado visible para quien
consume ese código que dependa de ellos.

### Función de guarda

```
ANTES de escribir el cuerpo del test:
  Nombra el cambio de producción que haría fallar este test.

  No puedes nombrar ninguno     → rediseña en torno a un comportamiento observable
  "El texto fuente cambió"      → ejecuta el artefacto y comprueba sus efectos
  Solo decisiones intencionadas → detector de cambios; testea el comportamiento
                                   que depende de la decisión

  Confirma que el valor esperado se deriva sin usar el código bajo test.
  SI reutiliza la lógica o los helpers del código:
    Sustitúyelo por un literal o un fixture comprobado a mano
```

## Principio 2: Ejercita lo real

**El mock no se gana ningún assert.** Un assert sobre un mock pasa cuando
el mock está presente y falla cuando no lo está — no dice nada sobre el
componente. Comprueba el comportamiento del componente real; si lo que
estás comprobando es el mock, desmockéalo o borra el assert.

```typescript
// ✅ Comportamiento real
expect(screen.getByRole("navigation")).toBeInTheDocument();

// ❌ Existencia del mock
expect(screen.getByTestId("sidebar-mock")).toBeInTheDocument();
```

**corrección de tu compañero humano:** "¿Estamos testeando el
comportamiento de un mock?"

**Mockea al nivel correcto.** Aprende todos los efectos secundarios del
método real antes de reemplazarlo; mockea la operación lenta o externa y
mantén real lo que el test necesita. Si tienes dudas, ejecuta primero el
test contra la implementación real y observa qué hace falta de verdad.

```typescript
// ❌ El mock se traga la escritura de config que la detección de duplicados lee
vi.mock("ToolCatalog", () => ({
  discoverAndCacheTools: vi.fn().mockResolvedValue(undefined),
}));

// ✅ Mockea solo el arranque lento del servidor; la escritura de config sigue siendo real
vi.mock("MCPServerManager");
```

**Haz los dobles específicos.** Cuando los argumentos, el número de
llamadas o el orden son parte del contrato, compruébalos — un doble que
acepta cualquier cosa no verifica nada. Da a cada rama (éxito, error,
malformado) su propio fixture o spy, para que la rama equivocada no pueda
satisfacer la expectativa.

**Refleja los datos reales por completo.** Mockea la estructura completa
tal como existe en la realidad — todos los campos documentados — no solo
los que tu test lee. Los mocks parciales fallan en silencio cuando código
posterior lee un campo omitido: el test pasa mientras la integración se
rompe.

**Las clases de producción solo llevan métodos de producción.** La
limpieza que solo necesitan los tests va en utilidades de test, nunca
como un `destroy()` en la clase de producción. Pregúntate: ¿este método
se llama solo desde tests? ¿Esta clase es dueña del ciclo de vida de este
recurso? Respuestas incorrectas → utilidad de test.

**Prefiere componentes reales a mocks complejos.** Cuando el setup del
mock crece más que la lógica del test, el mock no tiene métodos que sí
tiene el componente real, o los tests se rompen cuando cambia el mock,
pasa a un test de integración con componentes reales. **pregunta de tu
compañero humano:** "¿de verdad necesitamos usar un mock aquí?"

### Función de guarda

```
ANTES de añadir un mock o un helper de test:
  Lista los efectos secundarios del método real; mantén reales los que
  el test necesita — mockea el nivel lento/externo por debajo de ellos.

  Las respuestas del mock reflejan la estructura real completa.

  Un método que solo llaman los tests va en utilidades de test, no en producción.

  ¿Estás a punto de comprobar el mock en sí?
    Desmockéalo o borra el assert.
```

## Los tests se entregan con la implementación

El ciclo de TDD — test en rojo, implementación mínima, refactor — es lo
que significa "completo". Entrega los tests que el comportamiento
necesita y solo esos: el código trivial y la prosa para humanos no se
ganan ninguno, y un test escrito para cumplir un proceso cuesta
mantenimiento para siempre.

## La comprobación de mutación

Antes de terminar, muta mentalmente el código de producción; al menos un
test debería fallar por cada mutación realista:

- Constante o argumento incorrecto
- Rama/handler incorrecto
- Falta un cambio de estado o efecto secundario
- Retorno vacío o por defecto
- Falta validación para entrada cero, vacía, nula, no autorizada o malformada

Una mutación que nada detecta marca ese comportamiento como desprotegido
— o el test como tautológico.

## Referencia rápida

| Cuando...                              | Haz                                                                    |
| --------------------------------------- | ----------------------------------------------------------------------- |
| Escribes cualquier test                 | Nombra la rotura que detecta — un bug, no una decisión                  |
| Construyes un valor esperado            | Derívalo a mano; nunca con el código bajo test                          |
| Testeas un script o documento           | Ejecútalo / pon a prueba a quien lo consume; nunca grepees su texto     |
| Vas a testear una dependencia           | Testea el contrato de tu frontera, no su mecánica interna documentada   |
| Quieres comprobar un elemento mockeado  | Testea el componente real, o desmockéalo                                |
| Estás a punto de mockear un método      | Aprende sus efectos secundarios; mockea el nivel lento/externo          |
| Construyes la respuesta de un mock      | Refleja la estructura real por completo                                 |
| Necesitas limpieza que solo usan tests  | Ponla en utilidades de test                                             |
| El setup del mock crece sin parar       | Pasa a un test de integración con componentes reales                    |
| Terminas un fichero de test             | Ejecuta la comprobación de mutación                                     |

## Señales de alarma

- El setup y el assert comparten el mismo objeto, lo que garantiza la igualdad
- El test solo puede fallar por un panic, un crash o un selector que falta
- El test falla con cualquier cambio intencionado, nunca con una rotura accidental
- Los valores esperados están escondidos detrás de bucles, builders o helpers
- El test grepea texto fuente, o comprueba que un símbolo eliminado sigue eliminado
- El test seguiría importando aunque solo quedara el framework
- El test existe por cobertura, sin comprobar ningún efecto secundario ni resultado
- Un assert comprueba un test ID `*-mock`, o falla si quitas el mock
- Un método se llama solo desde ficheros de test
- El setup del mock es más de la mitad del test, o no puedes explicar por qué hace falta el mock
- Mockear "por si acaso"
