/**
 * levels.ts — Campaña de 72 niveles en nueve temporadas.
 *
 * Las dos primeras temporadas son artesanales, definidas celda a celda.
 * El resto son retos de SEMILLA FIJA del generador procedural: siempre
 * producen exactamente la misma caja, la misma solución y el mismo pedido.
 *
 * Los niveles con semilla se construyen BAJO DEMANDA y se memorizan, así
 * la pantalla de inicio no paga el coste de generar toda la campaña.
 */
import { generarNivelCarrera } from "./generator";
import type { NivelDef } from "./types";

const NIVELES_ARTESANALES: NivelDef[] = [
  {
    id: 1,
    nombre: "Primer encargo",
    subtitulo: "Aprende a colocar y rotar",
    cols: 4,
    rows: 3,
    tiempo: 60,
    pistas: 2,
    pedido: [{ tipo: "ingrediente", id: "cherry", n: 1 }],
    compartimentos: [
      { x: 0, y: 0, w: 2, h: 2, piezas: [{ ing: "arroz", rot: 0, ox: 0, oy: 0 }] },
      { x: 2, y: 0, w: 2, h: 2, piezas: [{ ing: "karaage", rot: 0, ox: 0, oy: 0 }] },
      { x: 0, y: 2, w: 2, h: 1, piezas: [{ ing: "tamagoyaki", rot: 0, ox: 0, oy: 0 }] },
      { x: 2, y: 2, w: 1, h: 1, piezas: [{ ing: "brocoli", rot: 0, ox: 0, oy: 0 }] },
      { x: 3, y: 2, w: 1, h: 1, piezas: [{ ing: "cherry", rot: 0, ox: 0, oy: 0 }] },
    ],
  },
  {
    id: 2,
    nombre: "Almuerzo ligero",
    subtitulo: "Llega el sashimi",
    cols: 4,
    rows: 4,
    tiempo: 80,
    pistas: 2,
    pedido: [
      { tipo: "ingrediente", id: "salmon", n: 1 },
      { tipo: "ingrediente", id: "edamame", n: 1 },
    ],
    compartimentos: [
      { x: 0, y: 0, w: 2, h: 2, piezas: [{ ing: "arroz", rot: 0, ox: 0, oy: 0 }] },
      { x: 2, y: 0, w: 2, h: 2, piezas: [{ ing: "karaage", rot: 0, ox: 0, oy: 0 }] },
      { x: 0, y: 2, w: 3, h: 1, piezas: [{ ing: "salmon", rot: 0, ox: 0, oy: 0 }] },
      { x: 3, y: 2, w: 1, h: 1, piezas: [{ ing: "maki", rot: 0, ox: 0, oy: 0 }] },
      { x: 0, y: 3, w: 2, h: 1, piezas: [{ ing: "tamagoyaki", rot: 0, ox: 0, oy: 0 }] },
      { x: 2, y: 3, w: 2, h: 1, piezas: [{ ing: "edamame", rot: 0, ox: 0, oy: 0 }] },
    ],
  },
  {
    id: 3,
    nombre: "Algo verde",
    subtitulo: "El primer onigiri",
    cols: 5,
    rows: 4,
    tiempo: 95,
    pistas: 2,
    pedido: [
      { tipo: "ingrediente", id: "takuan", n: 2 },
      { tipo: "color", color: "verde", n: 1 },
    ],
    compartimentos: [
      { x: 0, y: 0, w: 2, h: 2, piezas: [{ ing: "arroz", rot: 0, ox: 0, oy: 0 }] },
      {
        x: 2, y: 0, w: 2, h: 2,
        piezas: [
          { ing: "onigiri", rot: 3, ox: 0, oy: 0 },
          { ing: "cherry", rot: 0, ox: 1, oy: 1 },
        ],
      },
      { x: 4, y: 0, w: 1, h: 3, piezas: [{ ing: "salmon", rot: 1, ox: 0, oy: 0 }] },
      { x: 0, y: 2, w: 2, h: 1, piezas: [{ ing: "tamagoyaki", rot: 0, ox: 0, oy: 0 }] },
      { x: 2, y: 2, w: 2, h: 1, piezas: [{ ing: "edamame", rot: 0, ox: 0, oy: 0 }] },
      {
        x: 0, y: 3, w: 3, h: 1,
        piezas: [
          { ing: "takuan", rot: 0, ox: 0, oy: 0 },
          { ing: "maki", rot: 0, ox: 2, oy: 0 },
        ],
      },
      { x: 3, y: 3, w: 2, h: 1, piezas: [{ ing: "takuan", rot: 0, ox: 0, oy: 0 }] },
    ],
  },
  {
    id: 4,
    nombre: "Mediodía en el mercado",
    subtitulo: "Seis compartimentos y picante",
    cols: 6,
    rows: 4,
    tiempo: 110,
    pistas: 2,
    pedido: [
      { tipo: "ingrediente", id: "umeboshi", n: 1 },
      { tipo: "color", color: "negro", n: 1 },
    ],
    compartimentos: [
      { x: 0, y: 0, w: 2, h: 2, piezas: [{ ing: "arroz", rot: 0, ox: 0, oy: 0 }] },
      { x: 2, y: 0, w: 2, h: 2, piezas: [{ ing: "karaage", rot: 0, ox: 0, oy: 0 }] },
      {
        x: 4, y: 0, w: 2, h: 2,
        piezas: [
          { ing: "onigiri", rot: 2, ox: 0, oy: 0 },
          { ing: "umeboshi", rot: 0, ox: 0, oy: 1 },
        ],
      },
      { x: 0, y: 2, w: 2, h: 1, piezas: [{ ing: "tamagoyaki", rot: 0, ox: 0, oy: 0 }] },
      { x: 2, y: 2, w: 2, h: 1, piezas: [{ ing: "takuan", rot: 0, ox: 0, oy: 0 }] },
      { x: 4, y: 2, w: 2, h: 1, piezas: [{ ing: "edamame", rot: 0, ox: 0, oy: 0 }] },
      { x: 0, y: 3, w: 3, h: 1, piezas: [{ ing: "salmon", rot: 0, ox: 0, oy: 0 }] },
      {
        x: 3, y: 3, w: 3, h: 1,
        piezas: [
          { ing: "zanahoria", rot: 0, ox: 0, oy: 0 },
          { ing: "maki", rot: 0, ox: 1, oy: 0 },
          { ing: "brocoli", rot: 0, ox: 2, oy: 0 },
        ],
      },
    ],
  },
  {
    id: 5,
    nombre: "La caja cuadrada",
    subtitulo: "Cinco por cinco sin huecos",
    cols: 5,
    rows: 5,
    tiempo: 125,
    pistas: 2,
    pedido: [
      { tipo: "ingrediente", id: "tamagoyaki", n: 2 },
      { tipo: "ingrediente", id: "salmon", n: 1 },
    ],
    compartimentos: [
      {
        x: 0, y: 0, w: 3, h: 2,
        piezas: [
          { ing: "arroz", rot: 0, ox: 0, oy: 0 },
          { ing: "tamagoyaki", rot: 1, ox: 2, oy: 0 },
        ],
      },
      {
        x: 3, y: 0, w: 2, h: 2,
        piezas: [
          { ing: "onigiri", rot: 1, ox: 0, oy: 0 },
          { ing: "maki", rot: 0, ox: 0, oy: 0 },
        ],
      },
      { x: 0, y: 2, w: 3, h: 1, piezas: [{ ing: "salmon", rot: 0, ox: 0, oy: 0 }] },
      { x: 3, y: 2, w: 2, h: 2, piezas: [{ ing: "karaage", rot: 0, ox: 0, oy: 0 }] },
      { x: 0, y: 3, w: 2, h: 1, piezas: [{ ing: "edamame", rot: 0, ox: 0, oy: 0 }] },
      { x: 2, y: 3, w: 1, h: 2, piezas: [{ ing: "takuan", rot: 1, ox: 0, oy: 0 }] },
      { x: 0, y: 4, w: 2, h: 1, piezas: [{ ing: "tamagoyaki", rot: 0, ox: 0, oy: 0 }] },
      { x: 3, y: 4, w: 2, h: 1, piezas: [{ ing: "takuan", rot: 0, ox: 0, oy: 0 }] },
    ],
  },
  {
    id: 6,
    nombre: "Arcoíris goshiki",
    subtitulo: "Los cinco colores en armonía",
    cols: 6,
    rows: 5,
    tiempo: 145,
    pistas: 3,
    pedido: [
      { tipo: "ingrediente", id: "onigiri", n: 1 },
      { tipo: "color", color: "negro", n: 1 },
    ],
    compartimentos: [
      { x: 0, y: 0, w: 2, h: 2, piezas: [{ ing: "arroz", rot: 0, ox: 0, oy: 0 }] },
      {
        x: 2, y: 0, w: 2, h: 2,
        piezas: [
          { ing: "tempura", rot: 0, ox: 0, oy: 0 },
          { ing: "brocoli", rot: 0, ox: 1, oy: 0 },
        ],
      },
      {
        x: 4, y: 0, w: 2, h: 2,
        piezas: [
          { ing: "onigiri", rot: 3, ox: 0, oy: 0 },
          { ing: "cherry", rot: 0, ox: 1, oy: 1 },
        ],
      },
      { x: 0, y: 2, w: 3, h: 1, piezas: [{ ing: "salmon", rot: 0, ox: 0, oy: 0 }] },
      { x: 3, y: 2, w: 2, h: 2, piezas: [{ ing: "karaage", rot: 0, ox: 0, oy: 0 }] },
      { x: 5, y: 2, w: 1, h: 2, piezas: [{ ing: "edamame", rot: 1, ox: 0, oy: 0 }] },
      {
        x: 0, y: 3, w: 3, h: 1,
        piezas: [
          { ing: "tamagoyaki", rot: 0, ox: 0, oy: 0 },
          { ing: "maki", rot: 0, ox: 2, oy: 0 },
        ],
      },
      {
        x: 0, y: 4, w: 3, h: 1,
        piezas: [
          { ing: "takuan", rot: 0, ox: 0, oy: 0 },
          { ing: "umeboshi", rot: 0, ox: 2, oy: 0 },
        ],
      },
      {
        x: 3, y: 4, w: 3, h: 1,
        piezas: [
          { ing: "edamame", rot: 0, ox: 0, oy: 0 },
          { ing: "zanahoria", rot: 0, ox: 2, oy: 0 },
        ],
      },
    ],
  },
  {
    id: 7,
    nombre: "Servicio del chef",
    subtitulo: "Siete columnas de precisión",
    cols: 7,
    rows: 5,
    tiempo: 170,
    pistas: 3,
    pedido: [
      { tipo: "ingrediente", id: "onigiri", n: 2 },
      { tipo: "color", color: "verde", n: 2 },
    ],
    compartimentos: [
      { x: 0, y: 0, w: 2, h: 2, piezas: [{ ing: "arroz", rot: 0, ox: 0, oy: 0 }] },
      {
        x: 2, y: 0, w: 3, h: 2,
        piezas: [
          { ing: "onigiri", rot: 3, ox: 0, oy: 0 },
          { ing: "onigiri", rot: 1, ox: 1, oy: 0 },
        ],
      },
      { x: 5, y: 0, w: 2, h: 2, piezas: [{ ing: "karaage", rot: 0, ox: 0, oy: 0 }] },
      { x: 0, y: 2, w: 3, h: 1, piezas: [{ ing: "salmon", rot: 0, ox: 0, oy: 0 }] },
      { x: 3, y: 2, w: 2, h: 2, piezas: [{ ing: "arroz", rot: 0, ox: 0, oy: 0 }] },
      { x: 5, y: 2, w: 1, h: 2, piezas: [{ ing: "tamagoyaki", rot: 1, ox: 0, oy: 0 }] },
      { x: 6, y: 2, w: 1, h: 2, piezas: [{ ing: "takuan", rot: 1, ox: 0, oy: 0 }] },
      { x: 0, y: 3, w: 1, h: 2, piezas: [{ ing: "edamame", rot: 1, ox: 0, oy: 0 }] },
      { x: 1, y: 3, w: 2, h: 1, piezas: [{ ing: "takuan", rot: 0, ox: 0, oy: 0 }] },
      {
        x: 1, y: 4, w: 2, h: 1,
        piezas: [
          { ing: "cherry", rot: 0, ox: 0, oy: 0 },
          { ing: "maki", rot: 0, ox: 1, oy: 0 },
        ],
      },
      { x: 3, y: 4, w: 2, h: 1, piezas: [{ ing: "tamagoyaki", rot: 0, ox: 0, oy: 0 }] },
      {
        x: 5, y: 4, w: 2, h: 1,
        piezas: [
          { ing: "brocoli", rot: 0, ox: 0, oy: 0 },
          { ing: "umeboshi", rot: 0, ox: 1, oy: 0 },
        ],
      },
    ],
  },
  {
    id: 8,
    nombre: "Festín de hanami",
    subtitulo: "El gran bento bajo los sakura",
    cols: 7,
    rows: 6,
    tiempo: 200,
    pistas: 3,
    pedido: [
      { tipo: "ingrediente", id: "salmon", n: 2 },
      { tipo: "color", color: "negro", n: 1 },
    ],
    compartimentos: [
      { x: 0, y: 0, w: 2, h: 2, piezas: [{ ing: "arroz", rot: 0, ox: 0, oy: 0 }] },
      {
        x: 2, y: 0, w: 3, h: 2,
        piezas: [
          { ing: "onigiri", rot: 3, ox: 0, oy: 0 },
          { ing: "onigiri", rot: 1, ox: 1, oy: 0 },
        ],
      },
      { x: 5, y: 0, w: 2, h: 2, piezas: [{ ing: "karaage", rot: 0, ox: 0, oy: 0 }] },
      {
        x: 0, y: 2, w: 2, h: 2,
        piezas: [
          { ing: "tempura", rot: 0, ox: 0, oy: 0 },
          { ing: "cherry", rot: 0, ox: 1, oy: 0 },
        ],
      },
      { x: 2, y: 2, w: 2, h: 2, piezas: [{ ing: "arroz", rot: 0, ox: 0, oy: 0 }] },
      {
        x: 4, y: 2, w: 3, h: 2,
        piezas: [
          { ing: "salmon", rot: 0, ox: 0, oy: 0 },
          { ing: "salmon", rot: 0, ox: 0, oy: 1 },
        ],
      },
      { x: 0, y: 4, w: 2, h: 1, piezas: [{ ing: "tamagoyaki", rot: 0, ox: 0, oy: 0 }] },
      { x: 2, y: 4, w: 2, h: 2, piezas: [{ ing: "karaage", rot: 0, ox: 0, oy: 0 }] },
      { x: 4, y: 4, w: 1, h: 1, piezas: [{ ing: "umeboshi", rot: 0, ox: 0, oy: 0 }] },
      { x: 5, y: 4, w: 2, h: 1, piezas: [{ ing: "edamame", rot: 0, ox: 0, oy: 0 }] },
      {
        x: 0, y: 5, w: 2, h: 1,
        piezas: [
          { ing: "maki", rot: 0, ox: 0, oy: 0 },
          { ing: "umeboshi", rot: 0, ox: 1, oy: 0 },
        ],
      },
      { x: 4, y: 5, w: 1, h: 1, piezas: [{ ing: "brocoli", rot: 0, ox: 0, oy: 0 }] },
      { x: 5, y: 5, w: 2, h: 1, piezas: [{ ing: "takuan", rot: 0, ox: 0, oy: 0 }] },
    ],
  },

  /* ======================= SEGUNDA TEMPORADA ======================= */

  {
    id: 9,
    nombre: "Turno de tarde",
    subtitulo: "Vuelve la clientela",
    cols: 6,
    rows: 5,
    tiempo: 150,
    pistas: 3,
    pedido: [
      { tipo: "ingrediente", id: "salmon", n: 2 },
      { tipo: "color", color: "verde", n: 2 },
    ],
    compartimentos: [
      { x: 0, y: 0, w: 2, h: 2, piezas: [{ ing: "arroz", rot: 0, ox: 0, oy: 0 }] },
      {
        x: 2, y: 0, w: 3, h: 2,
        piezas: [
          { ing: "onigiri", rot: 3, ox: 0, oy: 0 },
          { ing: "onigiri", rot: 1, ox: 1, oy: 0 },
        ],
      },
      { x: 5, y: 0, w: 1, h: 3, piezas: [{ ing: "salmon", rot: 1, ox: 0, oy: 0 }] },
      { x: 0, y: 2, w: 3, h: 1, piezas: [{ ing: "salmon", rot: 0, ox: 0, oy: 0 }] },
      { x: 3, y: 2, w: 2, h: 2, piezas: [{ ing: "karaage", rot: 0, ox: 0, oy: 0 }] },
      { x: 0, y: 3, w: 2, h: 1, piezas: [{ ing: "tamagoyaki", rot: 0, ox: 0, oy: 0 }] },
      { x: 2, y: 3, w: 1, h: 1, piezas: [{ ing: "brocoli", rot: 0, ox: 0, oy: 0 }] },
      { x: 5, y: 3, w: 1, h: 2, piezas: [{ ing: "edamame", rot: 1, ox: 0, oy: 0 }] },
      {
        x: 0, y: 4, w: 3, h: 1,
        piezas: [
          { ing: "takuan", rot: 0, ox: 0, oy: 0 },
          { ing: "maki", rot: 0, ox: 2, oy: 0 },
        ],
      },
      { x: 3, y: 4, w: 2, h: 1, piezas: [{ ing: "edamame", rot: 0, ox: 0, oy: 0 }] },
    ],
  },
  {
    id: 10,
    nombre: "Simetría perfecta",
    subtitulo: "Tres filas, tres sabores",
    cols: 6,
    rows: 6,
    tiempo: 165,
    pistas: 3,
    pedido: [
      { tipo: "ingrediente", id: "karaage", n: 2 },
      { tipo: "ingrediente", id: "umeboshi", n: 1 },
    ],
    compartimentos: [
      { x: 0, y: 0, w: 2, h: 2, piezas: [{ ing: "arroz", rot: 0, ox: 0, oy: 0 }] },
      { x: 2, y: 0, w: 2, h: 2, piezas: [{ ing: "karaage", rot: 0, ox: 0, oy: 0 }] },
      {
        x: 4, y: 0, w: 2, h: 2,
        piezas: [
          { ing: "onigiri", rot: 1, ox: 0, oy: 0 },
          { ing: "umeboshi", rot: 0, ox: 0, oy: 0 },
        ],
      },
      { x: 0, y: 2, w: 3, h: 1, piezas: [{ ing: "salmon", rot: 0, ox: 0, oy: 0 }] },
      { x: 3, y: 2, w: 3, h: 1, piezas: [{ ing: "salmon", rot: 0, ox: 0, oy: 0 }] },
      { x: 0, y: 3, w: 2, h: 2, piezas: [{ ing: "arroz", rot: 0, ox: 0, oy: 0 }] },
      { x: 2, y: 3, w: 2, h: 2, piezas: [{ ing: "karaage", rot: 0, ox: 0, oy: 0 }] },
      {
        x: 4, y: 3, w: 2, h: 2,
        piezas: [
          { ing: "tempura", rot: 0, ox: 0, oy: 0 },
          { ing: "cherry", rot: 0, ox: 1, oy: 0 },
        ],
      },
      { x: 0, y: 5, w: 2, h: 1, piezas: [{ ing: "tamagoyaki", rot: 0, ox: 0, oy: 0 }] },
      { x: 2, y: 5, w: 2, h: 1, piezas: [{ ing: "takuan", rot: 0, ox: 0, oy: 0 }] },
      { x: 4, y: 5, w: 2, h: 1, piezas: [{ ing: "edamame", rot: 0, ox: 0, oy: 0 }] },
    ],
  },
  {
    id: 11,
    nombre: "Siete columnas",
    subtitulo: "Encajes finos a la derecha",
    cols: 7,
    rows: 5,
    tiempo: 175,
    pistas: 3,
    pedido: [
      { tipo: "ingrediente", id: "takuan", n: 2 },
      { tipo: "color", color: "negro", n: 1 },
    ],
    compartimentos: [
      { x: 0, y: 0, w: 2, h: 2, piezas: [{ ing: "arroz", rot: 0, ox: 0, oy: 0 }] },
      {
        x: 2, y: 0, w: 3, h: 2,
        piezas: [
          { ing: "onigiri", rot: 3, ox: 0, oy: 0 },
          { ing: "onigiri", rot: 1, ox: 1, oy: 0 },
        ],
      },
      { x: 5, y: 0, w: 2, h: 2, piezas: [{ ing: "karaage", rot: 0, ox: 0, oy: 0 }] },
      { x: 0, y: 2, w: 3, h: 1, piezas: [{ ing: "salmon", rot: 0, ox: 0, oy: 0 }] },
      { x: 3, y: 2, w: 2, h: 2, piezas: [{ ing: "arroz", rot: 0, ox: 0, oy: 0 }] },
      // Franjas horizontales a la derecha: distinguen esta caja del nivel 7
      { x: 5, y: 2, w: 2, h: 1, piezas: [{ ing: "takuan", rot: 0, ox: 0, oy: 0 }] },
      { x: 5, y: 3, w: 2, h: 1, piezas: [{ ing: "tamagoyaki", rot: 0, ox: 0, oy: 0 }] },
      { x: 0, y: 3, w: 1, h: 2, piezas: [{ ing: "edamame", rot: 1, ox: 0, oy: 0 }] },
      { x: 1, y: 3, w: 2, h: 1, piezas: [{ ing: "takuan", rot: 0, ox: 0, oy: 0 }] },
      {
        x: 1, y: 4, w: 2, h: 1,
        piezas: [
          { ing: "cherry", rot: 0, ox: 0, oy: 0 },
          { ing: "maki", rot: 0, ox: 1, oy: 0 },
        ],
      },
      { x: 3, y: 4, w: 2, h: 1, piezas: [{ ing: "tamagoyaki", rot: 0, ox: 0, oy: 0 }] },
      {
        x: 5, y: 4, w: 2, h: 1,
        piezas: [
          { ing: "brocoli", rot: 0, ox: 0, oy: 0 },
          { ing: "umeboshi", rot: 0, ox: 1, oy: 0 },
        ],
      },
    ],
  },
  {
    id: 12,
    nombre: "Caja de dos pisos",
    subtitulo: "Arriba y abajo, todo cuadra",
    cols: 7,
    rows: 6,
    tiempo: 190,
    pistas: 3,
    pedido: [
      { tipo: "ingrediente", id: "onigiri", n: 2 },
      { tipo: "ingrediente", id: "zanahoria", n: 1 },
    ],
    compartimentos: [
      { x: 0, y: 0, w: 2, h: 2, piezas: [{ ing: "arroz", rot: 0, ox: 0, oy: 0 }] },
      { x: 2, y: 0, w: 2, h: 2, piezas: [{ ing: "karaage", rot: 0, ox: 0, oy: 0 }] },
      {
        x: 4, y: 0, w: 3, h: 2,
        piezas: [
          { ing: "onigiri", rot: 3, ox: 0, oy: 0 },
          { ing: "onigiri", rot: 1, ox: 1, oy: 0 },
        ],
      },
      {
        x: 0, y: 2, w: 2, h: 2,
        piezas: [
          { ing: "tempura", rot: 2, ox: 0, oy: 0 },
          { ing: "zanahoria", rot: 0, ox: 0, oy: 1 },
        ],
      },
      { x: 2, y: 2, w: 3, h: 1, piezas: [{ ing: "salmon", rot: 0, ox: 0, oy: 0 }] },
      { x: 5, y: 2, w: 2, h: 2, piezas: [{ ing: "karaage", rot: 0, ox: 0, oy: 0 }] },
      { x: 2, y: 3, w: 3, h: 1, piezas: [{ ing: "salmon", rot: 0, ox: 0, oy: 0 }] },
      { x: 0, y: 4, w: 2, h: 2, piezas: [{ ing: "arroz", rot: 0, ox: 0, oy: 0 }] },
      { x: 2, y: 4, w: 2, h: 1, piezas: [{ ing: "tamagoyaki", rot: 0, ox: 0, oy: 0 }] },
      { x: 4, y: 4, w: 1, h: 2, piezas: [{ ing: "edamame", rot: 1, ox: 0, oy: 0 }] },
      { x: 5, y: 4, w: 2, h: 1, piezas: [{ ing: "takuan", rot: 0, ox: 0, oy: 0 }] },
      {
        x: 2, y: 5, w: 2, h: 1,
        piezas: [
          { ing: "maki", rot: 0, ox: 0, oy: 0 },
          { ing: "cherry", rot: 0, ox: 1, oy: 0 },
        ],
      },
      {
        x: 5, y: 5, w: 2, h: 1,
        piezas: [
          { ing: "brocoli", rot: 0, ox: 0, oy: 0 },
          { ing: "umeboshi", rot: 0, ox: 1, oy: 0 },
        ],
      },
    ],
  },
  {
    id: 13,
    nombre: "Bandeja ancha",
    subtitulo: "Ocho columnas de paciencia",
    cols: 8,
    rows: 5,
    tiempo: 205,
    pistas: 3,
    pedido: [
      { tipo: "ingrediente", id: "karaage", n: 2 },
      { tipo: "color", color: "verde", n: 2 },
    ],
    compartimentos: [
      { x: 0, y: 0, w: 2, h: 2, piezas: [{ ing: "arroz", rot: 0, ox: 0, oy: 0 }] },
      {
        x: 2, y: 0, w: 3, h: 2,
        piezas: [
          { ing: "onigiri", rot: 3, ox: 0, oy: 0 },
          { ing: "onigiri", rot: 1, ox: 1, oy: 0 },
        ],
      },
      { x: 5, y: 0, w: 1, h: 3, piezas: [{ ing: "salmon", rot: 1, ox: 0, oy: 0 }] },
      { x: 6, y: 0, w: 2, h: 2, piezas: [{ ing: "karaage", rot: 0, ox: 0, oy: 0 }] },
      { x: 0, y: 2, w: 3, h: 1, piezas: [{ ing: "salmon", rot: 0, ox: 0, oy: 0 }] },
      { x: 3, y: 2, w: 2, h: 2, piezas: [{ ing: "arroz", rot: 0, ox: 0, oy: 0 }] },
      { x: 6, y: 2, w: 2, h: 1, piezas: [{ ing: "tamagoyaki", rot: 0, ox: 0, oy: 0 }] },
      { x: 0, y: 3, w: 2, h: 2, piezas: [{ ing: "karaage", rot: 0, ox: 0, oy: 0 }] },
      { x: 2, y: 3, w: 1, h: 2, piezas: [{ ing: "edamame", rot: 1, ox: 0, oy: 0 }] },
      { x: 5, y: 3, w: 1, h: 2, piezas: [{ ing: "tamagoyaki", rot: 1, ox: 0, oy: 0 }] },
      { x: 6, y: 3, w: 2, h: 1, piezas: [{ ing: "edamame", rot: 0, ox: 0, oy: 0 }] },
      { x: 3, y: 4, w: 2, h: 1, piezas: [{ ing: "takuan", rot: 0, ox: 0, oy: 0 }] },
      {
        x: 6, y: 4, w: 2, h: 1,
        piezas: [
          { ing: "cherry", rot: 0, ox: 0, oy: 0 },
          { ing: "maki", rot: 0, ox: 1, oy: 0 },
        ],
      },
    ],
  },
  {
    id: 14,
    nombre: "El gran cuadrado",
    subtitulo: "Siete por siete sin fallos",
    cols: 7,
    rows: 7,
    tiempo: 230,
    pistas: 4,
    pedido: [
      { tipo: "ingrediente", id: "salmon", n: 3 },
      { tipo: "color", color: "negro", n: 1 },
    ],
    compartimentos: [
      { x: 0, y: 0, w: 2, h: 2, piezas: [{ ing: "arroz", rot: 0, ox: 0, oy: 0 }] },
      {
        x: 2, y: 0, w: 3, h: 2,
        piezas: [
          { ing: "onigiri", rot: 3, ox: 0, oy: 0 },
          { ing: "onigiri", rot: 1, ox: 1, oy: 0 },
        ],
      },
      { x: 5, y: 0, w: 2, h: 2, piezas: [{ ing: "karaage", rot: 0, ox: 0, oy: 0 }] },
      {
        x: 0, y: 2, w: 2, h: 2,
        piezas: [
          { ing: "tempura", rot: 1, ox: 0, oy: 0 },
          { ing: "cherry", rot: 0, ox: 0, oy: 0 },
        ],
      },
      { x: 2, y: 2, w: 3, h: 1, piezas: [{ ing: "salmon", rot: 0, ox: 0, oy: 0 }] },
      { x: 5, y: 2, w: 2, h: 2, piezas: [{ ing: "arroz", rot: 0, ox: 0, oy: 0 }] },
      { x: 2, y: 3, w: 3, h: 1, piezas: [{ ing: "salmon", rot: 0, ox: 0, oy: 0 }] },
      { x: 0, y: 4, w: 3, h: 1, piezas: [{ ing: "salmon", rot: 0, ox: 0, oy: 0 }] },
      { x: 3, y: 4, w: 2, h: 2, piezas: [{ ing: "karaage", rot: 0, ox: 0, oy: 0 }] },
      { x: 5, y: 4, w: 2, h: 1, piezas: [{ ing: "tamagoyaki", rot: 0, ox: 0, oy: 0 }] },
      { x: 0, y: 5, w: 2, h: 2, piezas: [{ ing: "arroz", rot: 0, ox: 0, oy: 0 }] },
      { x: 2, y: 5, w: 1, h: 2, piezas: [{ ing: "edamame", rot: 1, ox: 0, oy: 0 }] },
      { x: 5, y: 5, w: 2, h: 1, piezas: [{ ing: "takuan", rot: 0, ox: 0, oy: 0 }] },
      {
        x: 3, y: 6, w: 2, h: 1,
        piezas: [
          { ing: "maki", rot: 0, ox: 0, oy: 0 },
          { ing: "umeboshi", rot: 0, ox: 1, oy: 0 },
        ],
      },
      {
        x: 5, y: 6, w: 2, h: 1,
        piezas: [
          { ing: "brocoli", rot: 0, ox: 0, oy: 0 },
          { ing: "zanahoria", rot: 0, ox: 1, oy: 0 },
        ],
      },
    ],
  },
  {
    id: 15,
    nombre: "Banquete de barrio",
    subtitulo: "Cuarenta y ocho celdas",
    cols: 8,
    rows: 6,
    tiempo: 255,
    pistas: 4,
    pedido: [
      { tipo: "ingrediente", id: "salmon", n: 4 },
      { tipo: "ingrediente", id: "maki", n: 1 },
    ],
    compartimentos: [
      { x: 0, y: 0, w: 2, h: 2, piezas: [{ ing: "arroz", rot: 0, ox: 0, oy: 0 }] },
      {
        x: 2, y: 0, w: 3, h: 2,
        piezas: [
          { ing: "onigiri", rot: 3, ox: 0, oy: 0 },
          { ing: "onigiri", rot: 1, ox: 1, oy: 0 },
        ],
      },
      { x: 5, y: 0, w: 1, h: 3, piezas: [{ ing: "salmon", rot: 1, ox: 0, oy: 0 }] },
      { x: 6, y: 0, w: 2, h: 2, piezas: [{ ing: "karaage", rot: 0, ox: 0, oy: 0 }] },
      { x: 0, y: 2, w: 3, h: 1, piezas: [{ ing: "salmon", rot: 0, ox: 0, oy: 0 }] },
      { x: 3, y: 2, w: 2, h: 2, piezas: [{ ing: "arroz", rot: 0, ox: 0, oy: 0 }] },
      { x: 6, y: 2, w: 2, h: 2, piezas: [{ ing: "karaage", rot: 0, ox: 0, oy: 0 }] },
      { x: 0, y: 3, w: 3, h: 1, piezas: [{ ing: "salmon", rot: 0, ox: 0, oy: 0 }] },
      { x: 5, y: 3, w: 1, h: 3, piezas: [{ ing: "salmon", rot: 1, ox: 0, oy: 0 }] },
      { x: 0, y: 4, w: 2, h: 2, piezas: [{ ing: "arroz", rot: 0, ox: 0, oy: 0 }] },
      { x: 2, y: 4, w: 3, h: 1, piezas: [{ ing: "salmon", rot: 0, ox: 0, oy: 0 }] },
      { x: 6, y: 4, w: 2, h: 1, piezas: [{ ing: "tamagoyaki", rot: 0, ox: 0, oy: 0 }] },
      {
        x: 2, y: 5, w: 3, h: 1,
        piezas: [
          { ing: "takuan", rot: 0, ox: 0, oy: 0 },
          { ing: "maki", rot: 0, ox: 2, oy: 0 },
        ],
      },
      {
        x: 6, y: 5, w: 2, h: 1,
        piezas: [
          { ing: "cherry", rot: 0, ox: 0, oy: 0 },
          { ing: "brocoli", rot: 0, ox: 1, oy: 0 },
        ],
      },
    ],
  },
  {
    id: 16,
    nombre: "Bento del maestro",
    subtitulo: "La obra final: 56 celdas",
    cols: 8,
    rows: 7,
    tiempo: 290,
    pistas: 4,
    pedido: [
      { tipo: "ingrediente", id: "onigiri", n: 4 },
      { tipo: "ingrediente", id: "salmon", n: 4 },
    ],
    compartimentos: [
      { x: 0, y: 0, w: 2, h: 2, piezas: [{ ing: "arroz", rot: 0, ox: 0, oy: 0 }] },
      {
        x: 2, y: 0, w: 3, h: 2,
        piezas: [
          { ing: "onigiri", rot: 3, ox: 0, oy: 0 },
          { ing: "onigiri", rot: 1, ox: 1, oy: 0 },
        ],
      },
      {
        x: 5, y: 0, w: 3, h: 2,
        piezas: [
          { ing: "onigiri", rot: 3, ox: 0, oy: 0 },
          { ing: "onigiri", rot: 1, ox: 1, oy: 0 },
        ],
      },
      { x: 0, y: 2, w: 2, h: 2, piezas: [{ ing: "karaage", rot: 0, ox: 0, oy: 0 }] },
      { x: 2, y: 2, w: 3, h: 1, piezas: [{ ing: "salmon", rot: 0, ox: 0, oy: 0 }] },
      { x: 5, y: 2, w: 3, h: 1, piezas: [{ ing: "salmon", rot: 0, ox: 0, oy: 0 }] },
      { x: 2, y: 3, w: 3, h: 1, piezas: [{ ing: "salmon", rot: 0, ox: 0, oy: 0 }] },
      { x: 5, y: 3, w: 3, h: 1, piezas: [{ ing: "salmon", rot: 0, ox: 0, oy: 0 }] },
      { x: 0, y: 4, w: 2, h: 2, piezas: [{ ing: "arroz", rot: 0, ox: 0, oy: 0 }] },
      { x: 2, y: 4, w: 2, h: 2, piezas: [{ ing: "karaage", rot: 0, ox: 0, oy: 0 }] },
      {
        x: 4, y: 4, w: 2, h: 2,
        piezas: [
          { ing: "tempura", rot: 0, ox: 0, oy: 0 },
          { ing: "cherry", rot: 0, ox: 1, oy: 0 },
        ],
      },
      { x: 6, y: 4, w: 2, h: 2, piezas: [{ ing: "arroz", rot: 0, ox: 0, oy: 0 }] },
      { x: 0, y: 6, w: 2, h: 1, piezas: [{ ing: "tamagoyaki", rot: 0, ox: 0, oy: 0 }] },
      { x: 2, y: 6, w: 2, h: 1, piezas: [{ ing: "takuan", rot: 0, ox: 0, oy: 0 }] },
      { x: 4, y: 6, w: 2, h: 1, piezas: [{ ing: "edamame", rot: 0, ox: 0, oy: 0 }] },
      {
        x: 6, y: 6, w: 2, h: 1,
        piezas: [
          { ing: "maki", rot: 0, ox: 0, oy: 0 },
          { ing: "umeboshi", rot: 0, ox: 1, oy: 0 },
        ],
      },
    ],
  },
];

/** Definición compacta de un reto con semilla fija. */
interface RetoSemilla {
  id: number;
  ronda: number;
  semilla: number;
  nombre: string;
  subtitulo: string;
  tiempo: number;
  pistas: number;
  /** Tope de columnas; la temporada final llega a 9. */
  maxCols?: number;
}

/**
 * Retos del 17 al 72. Cada semilla fue elegida entre miles para que la
 * caja tenga el tamaño propio de su temporada, incluya los cinco colores
 * goshiki y presente un diseño distinto al de todas las demás.
 */
const RETOS: RetoSemilla[] = [
  { id: 17, ronda: 7, semilla: 1116, nombre: "Sello del chef", subtitulo: "El primer reto de Mochi", tiempo: 195, pistas: 3 },
  { id: 18, ronda: 8, semilla: 2125, nombre: "Mercado nocturno", subtitulo: "Luces, aromas y precision", tiempo: 210, pistas: 3 },
  { id: 19, ronda: 8, semilla: 3113, nombre: "Jardin de ume", subtitulo: "Cincuenta y seis celdas en flor", tiempo: 225, pistas: 3 },
  { id: 20, ronda: 10, semilla: 4103, nombre: "Laca imperial", subtitulo: "Siete bloques de arroz", tiempo: 235, pistas: 3 },
  { id: 21, ronda: 9, semilla: 5105, nombre: "Hora punta", subtitulo: "Veinte piezas, un solo ritmo", tiempo: 245, pistas: 2 },
  { id: 22, ronda: 12, semilla: 6102, nombre: "Cocina de Kioto", subtitulo: "Equilibrio entre trece espacios", tiempo: 255, pistas: 2 },
  { id: 23, ronda: 13, semilla: 7100, nombre: "Festival de faroles", subtitulo: "Una mesa dorada al anochecer", tiempo: 265, pistas: 2 },
  { id: 24, ronda: 14, semilla: 8102, nombre: "La mesa de Mochi", subtitulo: "El desafio final del raton chef", tiempo: 285, pistas: 2 },
  { id: 25, ronda: 7, semilla: 22500, nombre: "Brisa de primavera", subtitulo: "Los cerezos abren la temporada", tiempo: 225, pistas: 3 },
  { id: 26, ronda: 7, semilla: 22922, nombre: "Mercado de Nishiki", subtitulo: "Puestos llenos de color", tiempo: 225, pistas: 3 },
  { id: 27, ronda: 8, semilla: 23301, nombre: "Té de la mañana", subtitulo: "Un bento ligero y ordenado", tiempo: 225, pistas: 3 },
  { id: 28, ronda: 8, semilla: 23714, nombre: "Picnic de hanami", subtitulo: "Bajo las ramas rosadas", tiempo: 225, pistas: 3 },
  { id: 29, ronda: 7, semilla: 76122, nombre: "Caligrafía", subtitulo: "Trazos limpios, encajes limpios", tiempo: 225, pistas: 3 },
  { id: 30, ronda: 8, semilla: 77063, nombre: "Arrozal en calma", subtitulo: "El verde se asoma al borde", tiempo: 225, pistas: 3 },
  { id: 31, ronda: 7, semilla: 77993, nombre: "Linterna de papel", subtitulo: "Luz suave sobre la laca", tiempo: 225, pistas: 3 },
  { id: 32, ronda: 8, semilla: 79323, nombre: "Puente de piedra", subtitulo: "Dos orillas, una caja", tiempo: 225, pistas: 3 },
  { id: 33, ronda: 8, semilla: 26567, nombre: "Sol de verano", subtitulo: "La cocina se calienta", tiempo: 251, pistas: 3 },
  { id: 34, ronda: 8, semilla: 26991, nombre: "Puerto de Hakata", subtitulo: "Pescado recién llegado", tiempo: 251, pistas: 3 },
  { id: 35, ronda: 8, semilla: 81509, nombre: "Festival de agua", subtitulo: "Bullicio entre compartimentos", tiempo: 251, pistas: 3 },
  { id: 36, ronda: 8, semilla: 82446, nombre: "Sandía fría", subtitulo: "Dulzura entre el salado", tiempo: 251, pistas: 3 },
  { id: 37, ronda: 8, semilla: 83539, nombre: "Cigarras al mediodía", subtitulo: "Ritmo constante y preciso", tiempo: 251, pistas: 3 },
  { id: 38, ronda: 8, semilla: 84549, nombre: "Playa de Enoshima", subtitulo: "Arena, sal y orden", tiempo: 251, pistas: 3 },
  { id: 39, ronda: 8, semilla: 85127, nombre: "Fuegos de verano", subtitulo: "Chispas en cada encaje", tiempo: 251, pistas: 3 },
  { id: 40, ronda: 8, semilla: 86848, nombre: "Noche templada", subtitulo: "El servicio no afloja", tiempo: 251, pistas: 3 },
  { id: 41, ronda: 9, semilla: 30502, nombre: "Hojas de arce", subtitulo: "El otoño tiñe la bandeja", tiempo: 286, pistas: 2 },
  { id: 42, ronda: 9, semilla: 30900, nombre: "Cosecha de arroz", subtitulo: "Los graneros rebosan", tiempo: 286, pistas: 2 },
  { id: 43, ronda: 10, semilla: 31304, nombre: "Luna de otoño", subtitulo: "Contemplación y precisión", tiempo: 286, pistas: 2 },
  { id: 44, ronda: 10, semilla: 31707, nombre: "Castañas asadas", subtitulo: "Calor en cada hueco", tiempo: 286, pistas: 2 },
  { id: 45, ronda: 11, semilla: 32103, nombre: "Templo de Kiyomizu", subtitulo: "Equilibrio sobre la ladera", tiempo: 286, pistas: 2 },
  { id: 46, ronda: 11, semilla: 32501, nombre: "Camino de montaña", subtitulo: "Subida exigente", tiempo: 286, pistas: 2 },
  { id: 47, ronda: 12, semilla: 32907, nombre: "Bruma de la mañana", subtitulo: "Formas que aparecen despacio", tiempo: 286, pistas: 2 },
  { id: 48, ronda: 12, semilla: 33304, nombre: "Última cosecha", subtitulo: "Nada puede sobrar", tiempo: 286, pistas: 2 },
  { id: 49, ronda: 11, semilla: 34507, nombre: "Primera nieve", subtitulo: "Blanco sobre la laca", tiempo: 286, pistas: 2 },
  { id: 50, ronda: 11, semilla: 34903, nombre: "Hogar con brasero", subtitulo: "Refugio entre compartimentos", tiempo: 286, pistas: 2 },
  { id: 51, ronda: 12, semilla: 35303, nombre: "Año nuevo", subtitulo: "Osechi en orden perfecto", tiempo: 286, pistas: 2 },
  { id: 52, ronda: 12, semilla: 35716, nombre: "Jardín helado", subtitulo: "Formas rígidas y exactas", tiempo: 286, pistas: 2 },
  { id: 53, ronda: 13, semilla: 36101, nombre: "Mercado de invierno", subtitulo: "Prisa entre el frío", tiempo: 286, pistas: 2 },
  { id: 54, ronda: 13, semilla: 36506, nombre: "Ramen de medianoche", subtitulo: "Vapor y concentración", tiempo: 286, pistas: 2 },
  { id: 55, ronda: 14, semilla: 36903, nombre: "Montaña nevada", subtitulo: "Cumbre de doce huecos", tiempo: 286, pistas: 2 },
  { id: 56, ronda: 14, semilla: 37334, nombre: "Ventisca", subtitulo: "Ni un solo resquicio", tiempo: 286, pistas: 2 },
  { id: 57, ronda: 12, semilla: 38503, nombre: "Aprendiz de maestro", subtitulo: "Empieza la maestría", tiempo: 286, pistas: 2 },
  { id: 58, ronda: 12, semilla: 38964, nombre: "Cuchillo afilado", subtitulo: "Cortes de precisión", tiempo: 286, pistas: 2 },
  { id: 59, ronda: 13, semilla: 39332, nombre: "Caja de trece", subtitulo: "Trece espacios, cero errores", tiempo: 286, pistas: 2 },
  { id: 60, ronda: 13, semilla: 39712, nombre: "Pulso firme", subtitulo: "La mano no tiembla", tiempo: 286, pistas: 2 },
  { id: 61, ronda: 14, semilla: 40137, nombre: "Receta secreta", subtitulo: "Solo para expertos", tiempo: 286, pistas: 2 },
  { id: 62, ronda: 14, semilla: 40557, nombre: "Inspección del maestro", subtitulo: "Nada escapa a su ojo", tiempo: 286, pistas: 2 },
  { id: 63, ronda: 15, semilla: 40930, nombre: "Banquete imperial", subtitulo: "La mesa más exigente", tiempo: 286, pistas: 2 },
  { id: 64, ronda: 15, semilla: 41309, nombre: "Sello de oro", subtitulo: "Casi una leyenda", tiempo: 286, pistas: 2 },
  { id: 65, ronda: 14, semilla: 42504, nombre: "Leyenda del bento", subtitulo: "Sesenta y tres celdas", tiempo: 317, pistas: 1, maxCols: 9 },
  { id: 66, ronda: 14, semilla: 42901, nombre: "Gran salón", subtitulo: "La caja más ancha", tiempo: 317, pistas: 1, maxCols: 9 },
  { id: 67, ronda: 15, semilla: 43301, nombre: "Mil grullas", subtitulo: "Paciencia infinita", tiempo: 317, pistas: 1, maxCols: 9 },
  { id: 68, ronda: 15, semilla: 43705, nombre: "Dragón de laca", subtitulo: "Nueve columnas de fuego", tiempo: 317, pistas: 1, maxCols: 9 },
  { id: 69, ronda: 16, semilla: 44105, nombre: "Monte Fuji", subtitulo: "La cima del juego", tiempo: 317, pistas: 1, maxCols: 9 },
  { id: 70, ronda: 16, semilla: 44507, nombre: "Maestro del goshiki", subtitulo: "Los cinco colores perfectos", tiempo: 317, pistas: 1, maxCols: 9 },
  { id: 71, ronda: 17, semilla: 44901, nombre: "Último servicio", subtitulo: "El turno definitivo", tiempo: 317, pistas: 1, maxCols: 9 },
  { id: 72, ronda: 17, semilla: 45302, nombre: "La gran mesa de Mochi", subtitulo: "El bento legendario", tiempo: 317, pistas: 1, maxCols: 9 },
];

/** Construye el nivel de un reto a partir de su semilla. */
function construirReto(reto: RetoSemilla): NivelDef {
  const generado = generarNivelCarrera({
    ronda: reto.ronda,
    semilla: reto.semilla,
    maxCols: reto.maxCols ?? 8,
  });
  return {
    ...generado,
    id: reto.id,
    nombre: reto.nombre,
    subtitulo: reto.subtitulo,
    tiempo: reto.tiempo,
    pistas: reto.pistas,
  };
}

/** Número total de niveles de la campaña. */
export const TOTAL_NIVELES = NIVELES_ARTESANALES.length + RETOS.length;

/** Caché de retos ya construidos: cada semilla se genera una sola vez. */
const cacheRetos = new Map<number, NivelDef>();

/** Temporadas con las que se agrupa la carta del día. */
export const TEMPORADAS: { titulo: string; desde: number; hasta: number }[] = [
  { titulo: "Primera temporada", desde: 1, hasta: 8 },
  { titulo: "Segunda temporada", desde: 9, hasta: 16 },
  { titulo: "Retos del chef", desde: 17, hasta: 24 },
  { titulo: "Sabores de primavera", desde: 25, hasta: 32 },
  { titulo: "Verano en la costa", desde: 33, hasta: 40 },
  { titulo: "Otoño dorado", desde: 41, hasta: 48 },
  { titulo: "Invierno de nieve", desde: 49, hasta: 56 },
  { titulo: "Camino de maestría", desde: 57, hasta: 64 },
  { titulo: "Leyenda del bento", desde: 65, hasta: 72 },
];

/** Devuelve el nivel por id (1-based), generándolo solo si hace falta. */
export function nivelPorId(id: number): NivelDef {
  const seguro = Math.min(Math.max(Math.round(id), 1), TOTAL_NIVELES);
  if (seguro <= NIVELES_ARTESANALES.length) return NIVELES_ARTESANALES[seguro - 1];
  const enCache = cacheRetos.get(seguro);
  if (enCache) return enCache;
  const nivel = construirReto(RETOS[seguro - NIVELES_ARTESANALES.length - 1]);
  cacheRetos.set(seguro, nivel);
  return nivel;
}

/** Metadatos ligeros para pintar la carta sin construir todas las cajas. */
export interface ResumenNivel {
  id: number;
  nombre: string;
  subtitulo: string;
}

/** Resumen de los 72 niveles: nombre y subtítulo, sin generar nada. */
export function resumenNiveles(): ResumenNivel[] {
  return [
    ...NIVELES_ARTESANALES.map((n) => ({
      id: n.id,
      nombre: n.nombre,
      subtitulo: n.subtitulo,
    })),
    ...RETOS.map((r) => ({ id: r.id, nombre: r.nombre, subtitulo: r.subtitulo })),
  ];
}
