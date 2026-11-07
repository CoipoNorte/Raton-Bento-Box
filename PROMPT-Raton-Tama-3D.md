# PROMPT — Ratón Tama (clon de Tamagotchi en 3D, escalable)

Hola, soy fan de los juegos de mascota virtual, acogedores y adictivos, que se
juegan a ratitos durante todo el día. Quiero que diseñemos y programemos un
juego web precioso, muy satisfactorio y **escalable**, jugable en cualquier
dispositivo: celular vertical, celular horizontal, tablet, escritorio y **con
mando**.

## Concepto

**Ratón Tama**: un clon moderno de Tamagotchi donde cuidas a una criatura que
vive en tiempo real, crece, evoluciona según cómo la trates y acaba dejando
paso a una nueva generación. La fantasía es la ternura de tener un bichito que
te espera: darle de comer, limpiarlo, jugar con él, arroparlo al dormir y verlo
convertirse en algo distinto según tus cuidados.

**Estilo visual: 3D de juguete tipo Nintendo Switch.** Debe parecer un diorama
de plástico bonito: criatura chibi redondita, sombreado *toon* con bordes
suaves, colores pastel saturados, materiales mate con un punto de brillo,
profundidad de campo sutil y una habitación-diorama que se puede girar un poco.
Nada de realismo: juguete adorable.

---

## Jugabilidad principal: el bucle de cuidado

1. La criatura vive en una **habitación 3D** (diorama) y reacciona en vivo:
   parpadea, respira, se aburre, salta, pide cosas con globos de icono.
2. **Necesidades** que bajan con el tiempo real y se atienden con acciones:

| Necesidad | Baja cada | Se cubre con | Icono |
| --- | --- | --- | --- |
| Hambre | ~2 h | Comida (varios tipos) | 🍙 |
| Ánimo | ~3 h | Jugar, caricias, mimos | 😊 |
| Energía | ciclo día/noche | Dormir, apagar la luz | 💤 |
| Higiene | al ensuciarse | Ducha, limpiar caca | 🫧 |
| Salud | si se descuida | Medicina, descanso | 💊 |
| Vínculo | sube al cuidar bien | Constancia y mimos | 💗 |

3. **Acciones básicas**: alimentar, jugar, limpiar, dormir/luz, curar, mimar.
   Cada una con animación propia y sonido propio.
4. La criatura **avisa sola**: iconos flotantes sobre su cabeza, nunca texto
   largo. Naranja = necesita algo, rojo = urgente, verde = contento.
5. **Caca y suciedad**: aparecen con el tiempo; si no limpias, enferma.
6. **Enfermedad**: se avisa con icono claro y se cura con medicina; nunca
   castigues con pérdida total, solo ralentiza el crecimiento.

---

## Ciclo de vida y evolución (el corazón escalable)

- **Etapas**: huevo → bebé → niño → adolescente → adulto → anciano.
- Cada etapa dura un tiempo configurable y **la evolución depende de los
  cuidados**: estadísticas medias, número de descuidos, disciplina y vínculo.
- **Árbol de evolución ramificado definido en datos**, no en código: de cada
  etapa pueden salir varias especies según condiciones. Añadir una especie
  nueva debe ser **añadir una entrada a un catálogo**, nada más.
- **Generaciones**: al final de la vida, la criatura deja un huevo. La nueva
  generación hereda pequeños rasgos (color, afinidad, estadística favorita) y
  se guarda un **álbum/enciclopedia** con todas las especies descubiertas.
- Muerte tratada con cariño: nada de pantallas tristes y agresivas; es un
  "se va de viaje" con homenaje, álbum y bonus para la siguiente generación.

---

## Contenido escalable (requisito arquitectónico)

Todo el contenido vive en **catálogos de datos tipados**, para que ampliar el
juego no obligue a tocar la lógica:

- `especies.ts` — criaturas, etapas, condiciones de evolución, paleta y forma.
- `comidas.ts` — alimentos, efecto en estadísticas, precio, modelo procedural.
- `objetos.ts` — muebles, juguetes, decoración, ropa y accesorios.
- `minijuegos.ts` — registro de minijuegos (ver abajo).
- `logros.ts` — misiones y logros.
- `economia.ts` — monedas, precios, recompensas.
- `tutoriales.ts` — lecciones del tutorial y sus disparadores (ver abajo).

**Regla de oro:** añadir contenido = añadir una entrada al catálogo. Si para
meter una comida nueva hay que tocar cinco archivos, la arquitectura está mal.

---

## Minijuegos (arquitectura de plugin)

Mínimo **tres minijuegos** sencillos y satisfactorios, por ejemplo:
adivina la dirección, memoria de secuencias, atrapar objetos que caen.

Cada minijuego debe implementar una **interfaz común** (`MiniJuego`) con:
`id`, `nombre`, `icono`, `componente`, `duración`, `recompensa` y
`controlesSoportados`. El contenedor del juego se encarga del marcador, la
pausa, la cuenta atrás y el cierre, así que crear uno nuevo es escribir un
componente y registrarlo en el catálogo.

---

## Modo tutorial (enseñar jugando, no leyendo)

El juego debe **enseñarse solo**. Nada de un muro de texto al principio que
nadie lee: la enseñanza ocurre **durante la partida**, justo cuando cada
funcionalidad aparece por primera vez. Es un requisito de primer nivel, no un
añadido final.

### Principios

1. **Just-in-time**: cada lección aparece en el momento en que esa mecánica se
   vuelve relevante. No se explica la tienda hasta que hay monedas; no se
   explica la evolución hasta que la criatura está a punto de evolucionar.
2. **Mostrar, no contar**: frases de **una línea como máximo**, con icono
   grande y una mano/flecha animada señalando el objetivo real de la pantalla.
3. **Aprender haciendo**: la mayoría de los pasos no se cierran con "Aceptar",
   se cierran **cuando el jugador realiza la acción**. El paso de alimentar
   termina cuando de verdad da de comer.
4. **Siempre saltable y siempre repetible**: botón de saltar visible, y un
   **Manual** en el menú para volver a ver cualquier lección cuando quiera.
5. **El tutorial congela los relojes** (ver regla 8 de errores a evitar): la
   simulación de necesidades, el ciclo día/noche y los temporizadores se
   detienen mientras hay una lección modal activa. La partida arranca de verdad
   cuando el jugador pulsa "¡Empezar!".

### Guía: la mascota acompañante

Un personaje guía (un ratón veterano, un abuelo o un hada) aparece en una
esquina con un bocadillo. Debe ser **pequeño y nunca tapar la criatura ni el
botón que está enseñando**. Tiene expresiones: explica, celebra, advierte.

### Estructura de una lección

El tutorial es **data-driven**, igual que el resto del contenido. Un catálogo
`tutoriales.ts` define cada paso con esta forma:

```ts
interface PasoTutorial {
  id: string;
  /** Cuándo se dispara: evento del juego o condición sobre el estado. */
  disparador: Disparador;
  /** Selector o id del elemento a resaltar; null = lección sin foco. */
  objetivo: string | null;
  icono: string;
  titulo: string;        // 3-4 palabras
  texto: string;         // una línea, sin tecnicismos
  /** Cómo se completa: acción del jugador o confirmación. */
  completar: { tipo: "accion"; accion: string } | { tipo: "confirmar" };
  /** Si el juego debe pausarse mientras se muestra. */
  pausa: boolean;
  /** Orden y requisitos previos. */
  requiere?: string[];
  /** Categoría para el Manual. */
  categoria: "basico" | "cuidado" | "progreso" | "social" | "avanzado";
}
```

**Regla de oro:** añadir una lección = añadir una entrada al catálogo. Si para
enseñar algo nuevo hay que tocar la lógica del juego, la arquitectura está mal.

### Capa visual del tutorial

- **Foco con recorte (spotlight)**: oscurece la pantalla salvo un agujero
  redondeado sobre el elemento que se enseña, calculado desde su
  `getBoundingClientRect()` y **recalculado al girar el dispositivo o hacer
  scroll** (si no, el agujero se queda donde no debe).
- **Mano animada** o flecha que apunta al objetivo, con el gesto correcto
  (tocar, arrastrar, mantener).
- Mientras hay foco, **solo el elemento resaltado es interactivo**; el resto
  queda bloqueado para que sea imposible perderse.
- El bocadillo se coloca **automáticamente** arriba o abajo del objetivo según
  dónde haya hueco, y nunca se sale de la pantalla.
- Respeta `prefers-reduced-motion`: sin manita saltarina, solo resaltado.

### Qué se enseña y cuándo

**Primeros minutos (tutorial guiado, con pausa):**

| # | Lección | Se completa cuando |
| --- | --- | --- |
| 1 | Saluda a tu mascota | Acaricia a la criatura |
| 2 | Mira sus necesidades | Confirma tras resaltar los medidores |
| 3 | Dale de comer | Alimenta una vez |
| 4 | Juega con ella | Termina una interacción de juego |
| 5 | Mantenla limpia | Limpia una suciedad |
| 6 | Gira la cámara | Arrastra el diorama |
| 7 | ¡Listo! | Pulsa "¡Empezar!" y arrancan los relojes |

**Contextuales (durante la partida, sin pausa salvo que sea crítico):**

- **Primera caca** → cómo limpiar y qué pasa si no lo haces.
- **Primera noche** → apagar la luz para que duerma.
- **Primera enfermedad** → usar medicina; aquí sí conviene pausar.
- **Primeras monedas** → abrir la tienda y comprar.
- **Primer minijuego disponible** → cómo se juega y qué recompensa da.
- **Vínculo alto por primera vez** → qué desbloquea el cariño.
- **Antes de evolucionar** → qué influye en la rama de evolución.
- **Primera evolución** → celebración y enciclopedia.
- **Final de vida / nueva generación** → herencia y álbum, con tacto.
- **Mando conectado** → mapa de botones y navegación por foco.
- **Vuelta tras una ausencia larga** → cómo leer el resumen "mientras no estabas".

### Adaptación a los controles

El tutorial **detecta la fuente de entrada activa** y cambia el texto y los
iconos en consecuencia, en caliente:

- Táctil: "Toca a tu mascota".
- Teclado: "Pulsa **Enter**" con la tecla dibujada.
- Mando: "Pulsa **A**" con el botón dibujado.

Si el jugador conecta un mando a mitad del tutorial, la lección actual cambia
de iconos sin reiniciarse.

### Persistencia y Manual

- Se guarda qué lecciones se han visto (en el guardado versionado), para no
  repetirlas en cada sesión.
- **Manual** accesible desde el menú y la pausa, con las lecciones agrupadas
  por categoría y marcadas las ya vistas. Desde ahí se puede **repetir**
  cualquiera o **reiniciar el tutorial completo**.
- Ajuste en opciones: *Consejos* (todos / solo esenciales / ninguno).
- En partidas de generaciones posteriores, el tutorial básico **no se repite**;
  solo aparecen las lecciones de contenido nuevo.

---

## Tiempo real y progreso sin conexión

- El juego avanza **en tiempo real** aunque esté cerrado: al volver, se calcula
  el tiempo transcurrido y se aplica el progreso con un resumen amable
  ("mientras no estabas…") con iconos.
- Límite de recuperación (p. ej. máximo 12 h de decaimiento) para que volver
  tras una semana no sea un castigo brutal.
- **Protección contra el reloj trucado**: si el reloj del sistema salta hacia
  atrás, se ignora; si salta hacia delante de forma absurda, se recorta. Hay
  que guardar siempre la última marca de tiempo validada.
- Ciclo **día/noche** real que cambia la luz del diorama y la música.

---

## Progresión y persistencia

Monedas, objetos comprados, especies descubiertas, generación actual, récords
de minijuegos y preferencias se guardan de forma persistente en `localStorage`,
encapsulado en `src/game/storage.ts`, protegido contra modo incógnito (fallback
en memoria) y listo para migrar a IndexedDB sin tocar el resto del juego.

Incluye **versionado del guardado** (`version: 1`) y una función de migración,
para que una actualización futura no borre la mascota de nadie.

---

## Sonido y música (WebAudio sintetizado, sin archivos de audio)

Igual que en el proyecto anterior: **todo sintetizado**, cero archivos.

- **Voz de la criatura**: balbuceos cortos con oscilador y envolvente de tono,
  distintos según etapa (agudo de bebé, medio de adulto) y ánimo.
- Comer: mordisquitos. Beber: glups. Jugar: blips alegres.
- Limpiar: burbujas con ruido filtrado. Dormir: respiración suave.
- Enfermar: tono descendente apagado. Curar: campanita ascendente.
- Evolución: **fanfarria pentatónica** con arpegio y brillo.
- Compra: tintineo de monedas. Error: golpe sordo, nunca estridente.
- **Música generativa en bucle**: capas (pad + arpegio + percusión suave) que
  se encienden y apagan según el momento del día y el ánimo. Debe poder
  silenciarse por separado de los efectos.
- Botón de silencio persistente. Todo tolerante a fallos: **nunca lanza
  excepciones** y el audio se despierta con el primer gesto del usuario.

---

## Controles: escritorio, móvil y mando

Implementa una **capa de entrada semántica**: el juego nunca escucha teclas
concretas, escucha **acciones** (`confirmar`, `cancelar`, `arriba`, `abajo`,
`izquierda`, `derecha`, `menu`, `accionRapida1..4`, `pausa`).

- **Escritorio**: teclado (flechas/WASD, Enter, Esc, 1-4, P) y ratón con hover.
- **Móvil**: toque directo sobre la criatura y los objetos, más una barra de
  acciones con objetivos táctiles de **44 px mínimo**. Gestos: tocar para
  acariciar, arrastrar comida hasta la boca, deslizar para girar la cámara.
- **Mando**: Gamepad API con bucle de sondeo en `requestAnimationFrame`,
  **zona muerta** en los sticks, anti-repetición en el D-pad, mapeo estándar
  (A confirmar, B cancelar, X/Y acciones, LB/RB cambiar pestaña, Start pausa) y
  **vibración** opcional en eventos importantes.
- **Navegación por foco**: todo elemento interactivo debe ser alcanzable con
  D-pad/teclado, con un **anillo de foco visible** y bien contrastado. Al
  conectar un mando, el juego muestra un aviso y cambia los iconos de ayuda a
  botones de mando automáticamente.
- Hook `useEntrada` (o `useInput`) que unifica las tres fuentes y expone el
  estado de las acciones, más `useGamepad` para la detección y el sondeo.

---

## Rendimiento 3D (crítico, es lo que mata estos proyectos en móvil)

- `<Canvas>` con `dpr={[1, 2]}` limitado, `performance={{ min: 0.5 }}` y
  renderizado **bajo demanda** (`frameloop="demand"`) cuando la escena esté
  quieta; vuelve a continuo durante animaciones.
- Materiales **toon** baratos, una sola luz direccional con sombra suave de
  resolución modesta + luz ambiental. Nada de postprocesado pesado en móvil.
- Geometría **procedural con primitivas** (esferas, cápsulas, cajas
  redondeadas): sin modelos externos, igual que la comida SVG del otro juego.
- Instanciado para objetos repetidos; nada de crear geometrías o materiales
  dentro del bucle de render (memorízalos con `useMemo`).
- **Detección de capacidades**: si el dispositivo es flojo, baja sombras y
  resolución automáticamente.
- **Fallback sin WebGL obligatorio**: si no hay WebGL, el juego debe seguir
  siendo jugable con una vista 2D de la criatura (SVG), nunca pantalla negra.
- `prefers-reduced-motion`: reduce animaciones, cámara estática.
- Suspense con un cargador bonito mientras se prepara la escena.

---

## Estética

Juguete japonés moderno y acogedor, *kawaii* minimalista: plástico pastel,
madera clara, menta, rosa chicle, crema. Tipografía redondeada, degradados
suaves, partículas lentas (polvo de luz, corazoncitos, burbujas).

- **Criatura 100 % procedural en código 3D**: cuerpo redondito, orejas grandes,
  **ojos enormes con doble brillo**, mejillas sonrojadas, boquita «w». Que se
  reconozca el ánimo de un vistazo, sin leer.
- **Interfaz 2D flotante** sobre el 3D (HUD en pastillas translúcidas), con
  iconos Lucide y medidores de necesidades muy legibles.
- Animaciones con **spring physics**: rebotes al saltar, squash & stretch al
  comer, inercia al girar la cámara.

---

## Diseño responsive (muy importante)

**La criatura y su diorama son SIEMPRE el elemento más grande de la pantalla.**

- **Escritorio / tablet**: diorama central grande, panel de necesidades a un
  lado y barra de acciones abajo, con `clamp()` y ancho máximo para no
  deformarse en 21:9.
- **Celular vertical**: diorama arriba ocupando la mayor parte, necesidades
  compactas y barra de acciones abajo al alcance del pulgar.
- **Celular horizontal (poca altura)**: modo denso automático; encogen paneles
  y botones, **nunca el diorama**.
- Hook `useViewport` (ancho, alto, retrato, altura escasa) para que girar el
  dispositivo reorganice la escena **sin perder el estado ni la cámara**.
- HUD flotante y mínimo. Nada de scroll en la pantalla principal: `h-dvh`.
- Objetivos táctiles de 44 px mínimo.

---

## Stack técnico

React 19 + TypeScript (estricto, con `noUnusedLocals`) + Vite 7 + Tailwind CSS 4
+ **@react-three/fiber 9 + @react-three/drei 10 + three** + Framer Motion +
iconos Lucide.

> ⚠️ **Compatibilidad de versiones, respétala o perderás horas:**
> `@react-three/fiber@8` empareja con `react@18` y `@react-three/fiber@9`
> empareja con `react@19`. Además, algunas versiones de fiber@9 declaran un
> tope superior en React (`>=19 <19.3`). **Fija React en 19.2.x** y usa
> `@react-three/fiber@^9.8`, `@react-three/drei@^10.7` y `three@^0.186`.
> Si npm protesta por *peer dependencies*, es este problema: no lo tapes con
> `--force`, ajusta las versiones.

Código modular, limpio y **comentado en español**, separando:

```
src/
├── game/
│   ├── types.ts         # Tipos: criatura, estadísticas, etapa, objeto, guardado
│   ├── especies.ts      # Catálogo de criaturas y árbol de evolución
│   ├── comidas.ts       # Catálogo de alimentos y efectos
│   ├── objetos.ts       # Muebles, juguetes, accesorios
│   ├── minijuegos.ts    # Registro de minijuegos (plugin)
│   ├── tutoriales.ts    # Lecciones, disparadores y categorías del Manual
│   ├── economia.ts      # Monedas, precios, recompensas
│   ├── balance.ts       # Ritmos de decaimiento, umbrales, dificultad
│   ├── simulacion.ts    # Motor de necesidades, tiempo real y offline
│   ├── evolucion.ts     # Reglas de crecimiento y ramificación
│   ├── sound.ts         # Motor de audio y música WebAudio
│   └── storage.ts       # Guardado versionado (anti-incógnito)
├── hooks/
│   ├── useViewport.ts
│   ├── useEntrada.ts        # Capa semántica: teclado + táctil + mando
│   ├── useGamepad.ts        # Sondeo, zona muerta, anti-repetición
│   ├── useGestoSeguro.ts    # Un gesto = una acción (ver errores a evitar)
│   ├── useTutorial.ts       # Disparadores, progreso y pausa de lecciones
│   └── useTiempoReal.ts     # Reloj del juego y recuperación offline
├── tres/                    # Todo lo que vive dentro del Canvas
│   ├── Escena.tsx       # Canvas, luces, cámara, calidad adaptativa
│   ├── Criatura.tsx     # Modelo procedural + animaciones de ánimo
│   ├── Habitacion.tsx   # Diorama, muebles y decoración
│   ├── Particulas.tsx   # Corazones, burbujas, polvo de luz
│   └── Fallback2D.tsx   # Vista SVG si no hay WebGL
├── components/
│   ├── HUD.tsx · BarraAcciones.tsx · MedidorNecesidad.tsx
│   ├── Tienda.tsx · Enciclopedia.tsx · AvisoMando.tsx
│   ├── CapaTutorial.tsx # Foco con recorte, bocadillo y mano animada
│   ├── GuiaMascota.tsx  # El personaje que acompaña y explica
│   ├── Manual.tsx       # Lecciones repetibles agrupadas por categoría
│   └── Fondo.tsx · ResumenAusencia.tsx
└── screens/
    └── StartScreen.tsx · GameScreen.tsx · MiniJuegoScreen.tsx
        · EvolucionScreen.tsx · GeneracionScreen.tsx
```

---

## ERRORES QUE DEBES EVITAR DESDE EL PRINCIPIO

Esto es lo más importante del encargo. Son fallos reales, ya sufridos y
depurados en un proyecto anterior; evítalos **desde la primera línea**.

### Gestos e interacción

1. **El bug del gesto doble.** Nunca uses a la vez `drag` y `onTap` de Framer
   Motion en el mismo elemento: al soltar se disparan **ambos** y la acción
   ocurre dos veces. Implementa un **único flujo de puntero** (`pointerdown` →
   `pointermove` → `pointerup`) que decida entre **tap / arrastre / scroll**,
   de forma excluyente, con umbral en píxeles.
2. **No pongas `touch-action: pan-x/pan-y` en elementos arrastrables.** El
   navegador se queda el gesto y te manda `pointercancel`: el objeto no se
   mueve y el siguiente toque dispara otra acción. Usa `touch-action: none` y
   **haz tú el scroll** del contenedor cuando el gesto sea claramente paralelo.
3. **Limpia los gestos huérfanos.** Si se pierde un `pointerup`, el siguiente
   gesto debe poder empezar igualmente; no bloquees la entrada para siempre.
4. **Lo que se ve es lo que se hace.** Si una vista previa y el objeto real se
   dibujan por caminos distintos, acabarán divergiendo. Debe haber **una sola
   fuente de verdad** para cada representación.

### Interfaz y layout

5. **Mide antes de dibujar.** Si calculas el tamaño de un elemento ignorando su
   marco, borde o relleno, se saldrá de su contenedor. Ten un **módulo de
   geometría único** que devuelva el tamaño real y úsalo tanto para calcular
   como para pintar.
6. **Nada de desbordes:** `min-w-0`, `truncate`, `flex-wrap` y `overflow-hidden`
   donde toque. Pruébalo en 320 px de ancho y en 360 px de alto.
7. **Prioriza el área jugable.** El diorama manda; el HUD flota.
8. **El tutorial debe congelar todos los relojes** (incluida la simulación de
   necesidades). El juego empieza cuando el jugador pulsa "¡Empezar!". Añade
   también botón de pausa.
9. **Obligar a leer o a contar, no.** Todo feedback debe ser visual: naranja lo
   que falta, rojo lo que urge, verde lo que ya está bien.
10. **Castigar en exceso, tampoco.** Un descuido avisa con una sacudida suave,
    no destruye el progreso.

### Tutorial

11. **El tutorial nunca debe poder atascar la partida.** Si una lección espera
    una acción que ya no es posible (el objeto desapareció, la criatura
    evolucionó, el jugador cambió de pantalla), debe **caducar sola** y
    liberar el control. Toda lección necesita una salida garantizada.
12. **El foco con recorte se recalcula**, no se calcula una vez. Al girar el
    dispositivo, abrir el teclado virtual o hacer scroll, el agujero debe
    seguir a su objetivo; si no, acabas señalando el vacío.
13. **Nunca muestres dos lecciones a la vez.** Una cola con prioridad: si se
    disparan dos a la vez, una espera.
14. **No enseñes lo que aún no existe.** Antes de resaltar un elemento,
    comprueba que está montado y visible; si no, pospón la lección.
15. **Respeta al jugador veterano.** Si ya vio una lección, no se repite; la
    segunda generación no vuelve a explicar lo básico.

### Datos y contenido

16. **Valida el contenido automáticamente.** Escribe un script que compruebe
    que los catálogos son coherentes (sin ids duplicados, sin referencias
    rotas, sin evoluciones inalcanzables). Encontrarás errores reales.
17. **Genera bajo demanda y memoriza.** Si el contenido crece, no construyas
    todo al arrancar: construye al pedir y cachea.

### Despliegue en Windows (`.bat`)

18. **`npm`, `npx` y `node` SIEMPRE con `call`.** En Windows son scripts
    `.cmd`; si un `.bat` los invoca sin `call`, el control **no vuelve** y el
    script padre muere en silencio, sin error. Este fallo cuesta horas.
19. **Nunca pongas paréntesis dentro de un bloque `if (...)`**, ni siquiera en
    los mensajes de `echo`: `cmd.exe` cierra el bloque antes de tiempo y lanza
    el críptico `No se esperaba ... en este momento`.
20. **Nunca uses `goto` desde dentro de un bloque con paréntesis**: produce
    `El sistema no encuentra la etiqueta por lotes especificada`.
21. **Guarda el `.bat` con finales de línea CRLF.** Con LF, `cmd.exe` no
    encuentra las etiquetas.
22. **El `.bat` debe ser autocontenido**: que no dependa de otros archivos
    auxiliares que el usuario quizá no copie.
23. Cuidado con `!` dentro de comandos si usas `EnableDelayedExpansion`: se lo
    come la expansión. Evítalo o desactiva la expansión diferida.

---

## Verificaciones automáticas obligatorias

Incluye scripts de verificación (en `scripts/`) que se puedan ejecutar con
`node` y que comprueben:

- **Catálogos**: ids únicos, referencias válidas, precios positivos.
- **Árbol de evolución**: toda especie es alcanzable y no hay ciclos.
- **Balance**: ninguna necesidad baja tan rápido que sea imposible de atender.
- **Guardado**: migrar una partida de la versión anterior no pierde datos.
- **Responsive**: el diorama cabe en los tamaños objetivo (320×568 hasta 2560×1080).
- **Tutorial**: ids únicos, sin dependencias circulares en `requiere`, todos los
  `objetivo` apuntan a elementos que existen de verdad, toda lección es
  alcanzable con algún disparador y ninguna bloquea la partida si su objetivo
  no aparece (debe haber salida por tiempo o por saltar).

Enséñame la salida de esas verificaciones al terminar.

---

## Requerimientos de despliegue

El proyecto se llamará **Raton-Tama** y debe quedar listo para GitHub Pages en
`https://coiponorte.github.io/Raton-Tama/` desde el repositorio
`https://github.com/CoipoNorte/Raton-Tama`.

- `vite.config.ts` con `base: '/Raton-Tama/'` (igual al nombre del repo).
- **`deploy.bat`** autocontenido que automatice TODO en Windows, en pasos
  numerados con mensajes claros y manejo de errores, respetando las reglas 18 a
  23 de la sección anterior:
  1. comprobar Node.js y npm → 2. comprobar Git, inicializar repo, fijar el
  remoto `origin` y la rama `main` → 3. crear `.gitignore` si falta →
  4. añadir scripts `predeploy`/`deploy` a `package.json` con `node -e` →
  5. verificar/insertar el `base` en `vite.config.ts` → 6. `npm install` +
  instalar `gh-pages` → 7. `npm run build` y comprobar que existe
  `dist/index.html` → 8. `git add -A` + commit automático **solo si hay
  cambios** → 9. `git push origin main` → 10. `npm run deploy`.
  Al terminar, recordar activar Settings → Pages → rama `gh-pages` / (root).
- `.gitignore` completo (node_modules/, dist/, caché de Vite, logs, .DS_Store,
  .vscode/…).
- `README.md` profesional y amigable: badges, cómo se juega, tabla de controles
  (teclado / táctil / mando), **sección del modo tutorial y del Manual
  repetible**, características, stack con la **nota de compatibilidad de
  versiones de R3F**, estructura de carpetas, desarrollo local, guía de
  despliegue y **tabla de solución de problemas** que incluya los fallos de
  `.bat` y el de WebGL.
- `icon.svg` representativo (la criatura) como favicon, y `<title>` correcto en
  `index.html`.

## Evitar la temida "página en blanco" en GitHub Pages

- `public/.nojekyll`.
- Pantalla de carga ("Despertando a tu mascota…") dentro de `#root` en el
  `index.html`, que React reemplaza al montar: sirve de splash y de
  diagnóstico (si se congela, es error de JS; si no aparece nada, es caché o
  rama mal configurada).
- Un `<noscript>` con aviso.
- **Aviso claro si no hay WebGL**, con el fallback 2D activándose solo.
- Documentar en el README que la causa más común es tener Pages apuntando a
  `main` en vez de `gh-pages`, y que después hay que recargar con `Ctrl+F5`.

---

## Criterios de aceptación

Antes de darlo por terminado, comprueba que:

- [ ] `npm run build` compila sin errores ni avisos de TypeScript.
- [ ] Los scripts de verificación pasan al 100 %.
- [ ] Se juega con teclado, con el dedo y con mando, sin tocar el ratón.
- [ ] Funciona en 320×568 sin que nada se salga de su recuadro.
- [ ] Cerrar y reabrir el juego conserva la mascota y aplica el tiempo pasado.
- [ ] Sin WebGL, el juego sigue siendo jugable con el fallback 2D.
- [ ] El `.bat` llega hasta el final en una máquina limpia.
- [ ] Silenciar el sonido persiste entre sesiones.
- [ ] **Alguien que nunca ha jugado entiende el juego sin preguntar nada**, solo
      siguiendo el tutorial.
- [ ] **El tutorial se puede saltar** y aun así el juego se entiende por los
      iconos.
- [ ] **Ninguna lección deja la partida bloqueada** aunque se cambie de pantalla
      o se gire el dispositivo a mitad.
- [ ] El foco con recorte **señala siempre el elemento correcto**, también tras
      rotar el móvil.
- [ ] Las lecciones muestran **el botón correcto** según se juegue con teclado,
      dedo o mando.
- [ ] Las lecciones vistas **no se repiten** en la siguiente sesión ni en la
      siguiente generación.

Entrégame el código estructurado, limpio, comentado en español y optimizado,
para copiarlo, ejecutar el `.bat` y tenerlo funcionando en línea de inmediato.
**¡Que dé tanta ternura que la gente lo abra solo para ver cómo bosteza su
bichito!**
