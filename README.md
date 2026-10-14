# 🐭 Ratón Bento Box (Bento Box Master)

![Stack](https://img.shields.io/badge/React_19-TypeScript-61dafb?logo=react&logoColor=white)
![Build](https://img.shields.io/badge/Vite_7-Tailwind_4-a855f7?logo=vite&logoColor=white)
![Motion](https://img.shields.io/badge/Framer_Motion-Lucide-f472b6)
![Audio](https://img.shields.io/badge/WebAudio-100%25_sintetizado-f2c14e)
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
### Modos de juego

| Modo | Descripción | Desbloqueo |
| --- | --- | --- |
| 🧘 **Zen** | Sin límite de tiempo. Pura organización y ASMR. | Desde el inicio |
| ⏱️ **Servicio del día** | Los 24 niveles contrarreloj, con barra ultrafina de 5 px arriba que se vuelve roja en los últimos 10 segundos. | Nivel 3 |
| ♾️ **Carrera** | **Cajas infinitas generadas proceduralmente.** El reloj nunca se detiene: cada bento servido hereda el tiempo sobrante más un bonus que mengua con las rondas. Las cajas crecen de 4×3 hasta 8×7. Guarda récord de bentos servidos y de puntos. | Nivel 2 |

### 24 niveles de campaña

Tres temporadas de 8 niveles: 16 cajas artesanales y 8 **Retos del chef**
seleccionados con semillas fijas. La progresión va desde una caja 4×3 de
cinco piezas hasta **La mesa de Mochi**, un desafío experto de 8×7.
Todas las teselaciones están verificadas celda a celda: cada nivel tiene
solución exacta sin huecos ni solapes.

### Generación procedural (modo Carrera)

El generador (`src/game/generator.ts`) **nunca produce una caja imposible**,
porque construye el puzzle al revés:

1. Parte la rejilla en compartimentos rectangulares mediante división recursiva con semilla.
2. Tesela cada compartimento con piezas reales por *backtracking* (siempre existe la pieza 1×1 como último recurso).
3. La bandeja nace de esa teselación, así que la solución está garantizada.
4. El pedido del cliente se construye con las piezas que realmente hay en la caja.

Verificado con 400 cajas aleatorias: **400/400 perfectas y resolubles**.
Con la misma semilla sale exactamente la misma caja.

---

## 🐭 La Mascota: Mochi el Ratón Chef

Dibujado 100% en SVG vectorial interactivo:
- Orejas redondas grandes con interior rosado.
- Bigotes, hocico y dientecito de ratón característico.
- Delantal de cocina y cinta hachimaki roja tradicional.
- Reacciones en vivo: parpadea de forma natural, sonríe, se preocupa con movimientos erróneos y alza sus patitas celebrando cuando completas la caja.

---

## 🚀 Despliegue automático en un clic (`deploy.bat`)

El archivo **`deploy.bat`** automatiza el ciclo completo para Windows.
Es **autocontenido** (no necesita ningún otro archivo), no usa `goto` ni
paréntesis dentro de bloques `if`, y guarda finales de línea CRLF:

1. Comprueba Node.js y npm.
2. Comprueba Git, inicializa el repo y apunta `origin` a `https://github.com/CoipoNorte/Raton-Bento-Box.git` (rama `main`).
3. Crea el `.gitignore` si no existe.
4. Agrega los scripts `"predeploy": "npm run build"` y `"deploy": "gh-pages -d dist"` a `package.json` con `node -e`.
5. Fija `base: '/Raton-Bento-Box/'` en `vite.config.ts`.
6. `npm install` e instala **`gh-pages`** como dependencia de desarrollo.
7. `npm run build` generando la carpeta `dist` (y la verifica).
8. `git add -A` + `git commit` automático **solo si hay cambios**.
9. `git push -u origin main` subiendo todo el código fuente.
10. `npm run deploy` publicando `dist` en la rama `gh-pages` (con reintento vía `npx gh-pages -d dist`).
11. Verifica la rama `gh-pages` remota y muestra el resumen final.

### Para ejecutarlo:
Solo haz doble clic sobre **`deploy.bat`** o ejecútalo en la terminal:
```cmd
deploy.bat
```

> **Configuración en GitHub (solo la primera vez):**
> Ve a `Settings` > `Pages` en el repositorio:
> - **Source**: `Deploy from a branch`
> - **Branch**: `gh-pages` / `(root)`
> - Pulsa **Save**. En un par de minutos estará disponible en `https://coiponorte.github.io/Raton-Bento-Box/`.

---

## 🛠️ Desarrollo local

```bash
# 1. Instalar dependencias
npm install

# 2. Servidor de desarrollo local
npm run dev

# 3. Compilar para producción
npm run build

# 4. Vista previa de producción
npm run preview
```

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
    │   ├── generator.ts   # Cajas procedurales del modo Carrera
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
