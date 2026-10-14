# 🐭 [Ratón Bento Box](https://coiponorte.github.io/Raton-Bento-Box/)

![Stack](https://img.shields.io/badge/React_19-TypeScript-61dafb?logo=react&logoColor=white)
![Build](https://img.shields.io/badge/Vite_7-Tailwind_4-a855f7?logo=vite&logoColor=white)
![Motion](https://img.shields.io/badge/Framer_Motion-Lucide-f472b6)
![Audio](https://img.shields.io/badge/WebAudio-100%25_sintetizado-f2c14e)
![Niveles](https://img.shields.io/badge/24_niveles-+_modo_infinito-a03127)
![Deploy](https://img.shields.io/badge/GitHub_Pages-listo-2ea44f?logo=github)

Un juego acogedor y ultra relajante de organización donde preparas cajas bento encajando ingredientes como un rompecabezas, buscando el **encaje perfecto sin huecos**, con sonido **ASMR WebAudio sintetizado** y acompañado por **Mochi, el simpático ratoncito chef**.

- 🌐 **Web en producción:** https://coiponorte.github.io/Raton-Bento-Box/
- 💻 **Repositorio de código:** https://github.com/CoipoNorte/Raton-Bento-Box

---

## 🎮 Cómo se juega

1. **La caja bento**: una rejilla tradicional con compartimentos rectangulares e irregulares.
2. **La tabla de preparación**: contiene los ingredientes del nivel con formas de poliominós (bloque de arroz 2×2, onigiri en L, tamagoyaki 1×2, salmón 1×3, brocoli 1×1, edamame 1×2, takuan, karaage, maki, tempura, etc.).
3. **Arrastrar & encaje con imán**:
   - Arrastra una pieza hacia la caja. Se ve un fantasma translúcido: **verde** si encaja, **rojo** si choca.
   - Cuenta con **imán magnético**: si sueltas cerca de un hueco válido, la pieza se auto-alinea suavemente.
   - El scroll de la bandeja funciona de forma totalmente nativa sin disparar arrastres falsos.
4. **Rotar**:
   - Toca una pieza en la bandeja para rotarla 90° con animación de resorte.
   - También puedes pulsar el botón **Rotar** en pantalla o la tecla **`R`**.
5. **Quitar pieza**:
   - Toca cualquier pieza dentro de la caja y volverá a la bandeja con un efecto sonoro suave.
6. **Deshacer y Vaciar**:
   - Botón **Deshacer** (o atajo `Ctrl+Z` / `U`) y botón **Vaciar caja** siempre accesibles a un toque.
7. **Pistas limitadas**:
   - El botón de bombilla resalta un hueco y la pieza que calza en él.
8. **Cerrar Bento (El Clímax ASMR)**:
   - Al completar el 100% sin huecos y cumplir el pedido del cliente, se activa el botón dorado/verde **CERRAR BENTO**.
   - Se reproduce la secuencia sensorial:
     1. La tapa de laca baja con un **clic** seco y whoosh.
     2. La goma elástica se estira y suelta con un *pluck*.
     3. El pañuelo **furoshiki** envuelve la caja y se ata.
     4. Lluvia de **pétalos de sakura** y arpegio pentatónico koto (C–D–E–G–A).
     5. Revelación de estrellas y puntuación (se puede saltar con un toque).

---

## 🌟 Reglas tácticas y puntuación

- **Tarjeta de pedido**: muestra qué ingredientes o colores solicita el cliente mediante iconos visuales. Naranja indica pendiente, verde indica completado.
- **Regla Goshiki (5 colores)**: rojo, amarillo, verde, blanco y negro. Un medidor de 5 puntitos se enciende a medida que los incluyes, otorgando bonificación especial al cerrar la caja con la armonía completa.
- **Encaje perfecto de compartimento**: al completar un compartimento individual se produce un destello dorado y repique de campanita.
- **Estrellas 1–3 por nivel**: se consiguen por terminar sin huecos, completar el goshiki, jugar con elegancia (sin deshacer ni retirar piezas) y encadenar encajes perfectos. En total hay **72 estrellas** por conseguir.

---

## 🕹️ Modos de juego

| Modo | Descripción | Desbloqueo |
| --- | --- | --- |
| 🧘 **Zen** | Sin límite de tiempo. Pura organización y ASMR. | Desde el inicio |
| ⏱️ **Servicio del día** | Los 24 niveles contrarreloj, con barra ultrafina de 5 px pegada al borde superior que se vuelve roja en los últimos 10 segundos. | Nivel 3 |
| ♾️ **Carrera** | **Cajas infinitas generadas proceduralmente.** El reloj nunca se detiene: cada bento servido hereda el tiempo sobrante más un bonus que mengua con las rondas. Las cajas crecen de 4×3 hasta 8×7 y se guardan los récords de bentos servidos y de puntos. | Nivel 2 |

---

## 🍱 Campaña: 24 niveles en tres temporadas

| Temporada | Niveles | Progresión |
| --- | --- | --- |
| **Primera temporada** | 1–8 | Desde una caja 4×3 de cinco piezas hasta cajas de 7×6. Enseña a colocar, rotar y equilibrar colores. |
| **Segunda temporada** | 9–16 | Cajas de 6×5 a 8×7, terminando en el **Bento del maestro** (56 celdas, 16 compartimentos, 20 piezas). |
| **Retos del chef** | 17–24 | Ocho cajas expertas de semilla fija, de 7×6 a 8×7, con goshiki completo obligatorio. Culminan en **La mesa de Mochi**. |

Todas las teselaciones están **verificadas celda a celda**: cada nivel tiene solución exacta sin huecos, sin solapes y con pedidos siempre alcanzables.

### 🎲 Generación procedural

El generador (`src/game/generator.ts`) **nunca produce una caja imposible**, porque construye el puzzle al revés:

1. Parte la rejilla en compartimentos rectangulares mediante división recursiva con semilla.
2. Tesela cada compartimento con piezas reales por *backtracking* (la pieza 1×1 garantiza siempre el cierre).
3. La bandeja nace de esa teselación, así que la solución está asegurada.
4. El pedido del cliente se construye solo con piezas que realmente existen en la caja.

Con la misma semilla sale exactamente la misma caja, y por eso los **Retos del chef** son estables partida tras partida.

---

## 🐭 La Mascota: Mochi el Ratón Chef

Dibujado 100% en SVG vectorial interactivo, con proporciones chibi:

- Orejas redondas grandes con interior rosado que se menean al ritmo de su ánimo.
- Ojos enormes con doble brillo, naricita de corazón y boquita «w» de ratón.
- Mejillas sonrojadas, bigotes finos y colita en espiral que se balancea.
- Gorrito de chef ladeado con cinta hachimaki roja y delantal con bolsillo de corazón.
- Reacciones en vivo: parpadea de forma natural, sonríe, se preocupa con movimientos erróneos y alza sus patitas entre chispas doradas cuando cierras la caja.

---

## 📱 Diseño responsive

- **Celular vertical**: pedido compacto arriba, caja al centro y bandeja deslizable abajo.
- **Celular horizontal**: modo denso automático que encoge fichas, botones y paneles, nunca la caja.
- **Tablet y escritorio**: tres columnas con pedido a la izquierda, caja al centro y bandeja a la derecha.
- La caja bento **siempre es el elemento más grande** de la pantalla: su tamaño se calcula con la geometría exacta del marco para que jamás desborde su contenedor.
- HUD flotante en pastillas translúcidas, objetivos táctiles de 44 px, `h-dvh` sin scroll y respeto por `prefers-reduced-motion`.

---

## 📁 Estructura del proyecto

```
.
├── deploy.bat             # Automatización completa de Git, build y Pages
├── index.html             # HTML con splash de carga para evitar pantalla en blanco
├── package.json           # Dependencias y scripts de Vite + gh-pages
├── README.md              # Documentación completa del proyecto
├── .gitignore             # Archivos y carpetas ignorados por Git
├── public/
│   ├── .nojekyll          # Evita procesamiento de Jekyll en GitHub Pages
│   └── icon.svg           # Favicon vectorial temático
└── src/
    ├── App.tsx            # Orquestador de pantallas, persistencia y audio
    ├── index.css          # Estilos globales y tipografía M PLUS Rounded
    ├── main.tsx           # Punto de entrada de React
    ├── game/
    │   ├── balance.ts     # Puntuaciones, bonos y umbrales de estrellas
    │   ├── generator.ts   # Cajas procedurales del modo Carrera y retos
    │   ├── ingredients.ts # Catálogo de 13 ingredientes con formas y goshiki
    │   ├── layout.ts      # Geometría exacta de la caja (cero desbordes)
    │   ├── levels.ts      # Campaña teselada de 24 niveles
    │   ├── logic.ts       # Poliominós, rotación, validación e imán
    │   ├── sound.ts       # Motor de audio ASMR WebAudio 100% sintetizado
    │   ├── storage.ts     # Persistencia local con respaldo en memoria
    │   └── types.ts       # Tipos TypeScript compartidos
    ├── hooks/
    │   ├── useTapSinArrastre.ts # Gestos táctiles inteligentes + scroll nativo
    │   └── useViewport.ts       # Detección responsiva de pantalla
    ├── components/
    │   ├── BentoBox.tsx   # Rejilla, marco de laca, compartimentos y piezas
    │   ├── ColorMeter.tsx # Medidor goshiki de 5 colores
    │   ├── Fondo.tsx      # Textura washi, gradientes suaves y vapor
    │   ├── FoodSVG.tsx    # Ilustraciones vectoriales procedurales con clipPath
    │   ├── HUD.tsx        # Pastillas flotantes para pausa, nivel y volumen
    │   ├── Mascot.tsx     # Mochi, el ratón chef en SVG interactivo
    │   ├── OrderCard.tsx  # Tarjeta visual con pedidos en iconos
    │   ├── PieceTray.tsx  # Bandeja con scroll nativo y slots uniformes
    │   └── Sakura.tsx     # Partículas de pétalos de cerezo
    └── screens/
        ├── CareerEnd.tsx    # Resumen y récords del modo Carrera
        ├── GameScreen.tsx   # Pantalla principal con los tres modos de layout
        ├── LevelSelect.tsx  # Carta scrolleable de los 24 bentos
        ├── ResultScreen.tsx # Ceremonia de cierre ASMR y puntuación
        └── StartScreen.tsx  # Portada con selector de modo y Carrera
```

---

*¡Que disfrutes preparando cada bento con Mochi el ratón!* 🐭🍱🌸
