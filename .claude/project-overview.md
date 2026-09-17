# ValoVerlay — Visión del proyecto

Este documento describe **qué** se está construyendo y **para quién**,
independientemente de las decisiones técnicas de implementación (esas están
en [`stack-decisions.md`](./stack-decisions.md)). Pensado como punto de
partida para que cualquier otra IA o desarrollador entienda el producto sin
haber estado en la conversación original.

## Qué es

**ValoVerlay** es una plataforma web (`valoverlay.com`) que permite a
jugadores de Valorant generar un **overlay de estadísticas en vivo para
usar como Browser Source en OBS**, junto con un **panel de customización**
donde configuran qué estadísticas se muestran y cómo se ven.

Es un producto **SaaS multi-usuario**, no una herramienta personal de un
solo streamer: cualquier jugador de Valorant puede entrar, autenticarse con
su cuenta de Riot y generar su propio overlay, de forma similar en
concepto a lo que hacen StreamElements o Streamlabs pero enfocado
específicamente en estadísticas de Valorant.

## Para quién

Streamers y creadores de contenido de Valorant que quieren mostrar en
directo (vía OBS) sus estadísticas de partida/perfil sin depender de
herramientas genéricas o de terceros no especializados en el juego.

## Las tres piezas del producto

1. **El overlay** — la pieza visual que se pega como Browser Source dentro
   de OBS. Muestra las estadísticas de Valorant configuradas (KDA, rango,
   economía, etc.) con el layout que el usuario haya elegido en el panel.
   No requiere ningún tipo de login dentro de OBS: se identifica mediante
   una URL única con un token secreto que el panel genera para cada
   usuario.

2. **El panel de customización** — la aplicación web donde el usuario,
   tras autenticarse con su cuenta de Riot, decide qué estadísticas quiere
   mostrar y en qué posición. En la primera versión es un formulario
   simple (activar/desactivar cada stat + posición preset como
   `top-left`/`top-right`), pensado para poder evolucionar más adelante a
   un editor visual de arrastrar y soltar sin romper las configuraciones ya
   guardadas de los usuarios.

3. **El servidor** — conecta ambas piezas: gestiona la autenticación,
   guarda la configuración de cada usuario, habla con la API de Riot Games
   para obtener sus datos de partida, y empuja esos datos en tiempo real al
   overlay correspondiente mientras el usuario está jugando/streameando.

## Cómo encajan entre sí (flujo de usuario)

1. El usuario entra a `valoverlay.com` y se autentica con su cuenta de
   Riot (Riot es el único proveedor de identidad del producto — no hay
   registro con email/contraseña propio).
2. Como parte de ese login, autoriza explícitamente (opt-in) que la
   plataforma acceda a sus datos de partida vía la API oficial de Riot.
3. En el panel, configura qué estadísticas quiere ver y dónde.
4. El panel le da una URL única (con un token secreto) que el usuario pega
   como Browser Source en OBS.
5. Mientras juega, el servidor obtiene sus datos de Valorant y los empuja
   en tiempo real a ese overlay concreto, que se actualiza en directo sin
   que el usuario tenga que hacer nada más.
6. Si vuelve al panel y cambia la configuración (por ejemplo, oculta una
   estadística), el overlay que ya tiene abierto en OBS se actualiza al
   momento, sin tener que pegar una URL nueva.

## Origen de los datos

Los datos de Valorant vienen de la **API oficial de Riot Games**
(`val-match-v1`), a la que se accede mediante un flujo OAuth (RSO) donde
cada jugador autoriza explícitamente compartir sus propios datos — no hay
acceso a datos de terceros sin su consentimiento. Mientras se desarrolla el
producto y no se dispone todavía de aprobación de Riot para producción, se
trabaja contra datos simulados (mocks).

Importante: el acceso de producción a la API de Riot **no se puede
solicitar desde el día 1** — Riot exige ver un MVP funcionando (contra
mocks) antes de evaluar la solicitud. Es decir, "desarrollar contra mocks"
no es solo una comodidad temporal, es un prerrequisito obligatorio de
Riot: primero MVP completo, después solicitud, después (si se aprueba)
datos reales.

## Estado actual

Fase inicial de desarrollo: monorepo scaffoldeado (server, panel, overlay,
paquete compartido), Postgres conectado vía Drizzle, y un primer canal de
Socket.IO entre server y overlay (con token hardcodeado de desarrollo, aún
sin autenticación real). Todavía no hay auth de usuarios ni datos de Riot.
La aprobación del acceso de producción por parte de Riot es un paso
externo pendiente que **no se puede solicitar hasta tener un MVP completo
funcionando contra mocks** — condiciona no solo cuándo el producto puede
dejar de depender de datos simulados, sino el orden mismo del roadmap: el
MVP con mocks es un hito obligatorio, no una fase paralela.

## Qué NO es (por ahora)

- No es una herramienta que muestre datos de otros jugadores sin su
  consentimiento (scouting de rivales, perfiles públicos no autorizados) —
  la política de Riot lo prohíbe explícitamente salvo opt-in.
- No es un overlay genérico multi-juego — está pensado específicamente
  para Valorant.
- No incluye (todavía) edición visual tipo arrastrar-y-soltar del layout —
  eso es una evolución futura posible, no parte del alcance inicial.

## Documentos relacionados

- [`stack-decisions.md`](./stack-decisions.md) — decisiones técnicas de
  arquitectura (stack, hosting, auth, base de datos, etc.) y el porqué de
  cada una.
