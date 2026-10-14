/**
 * levels.ts — Campaña de 24 niveles.
 * Las dos primeras temporadas son artesanales. La tercera usa semillas
 * fijas del generador procedural: cada reto conserva siempre la misma
 * caja y sigue siendo resoluble por construcción.
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

/**
 * Tercera temporada: cajas expertas elegidas entre cientos de semillas.
 * Todas aportan los cinco colores goshiki y se validan junto a la campaña.
 */
const RETOS_DEL_CHEF = [
  {
    id: 17,
    ronda: 7,
    semilla: 1116,
    nombre: "Sello del chef",
    subtitulo: "El primer reto de Mochi",
    tiempo: 195,
  },
  {
    id: 18,
    ronda: 8,
    semilla: 2125,
    nombre: "Mercado nocturno",
    subtitulo: "Luces, aromas y precisión",
    tiempo: 210,
  },
  {
    id: 19,
    ronda: 8,
    semilla: 3113,
    nombre: "Jardín de ume",
    subtitulo: "Cincuenta y seis celdas en flor",
    tiempo: 225,
  },
  {
    id: 20,
    ronda: 10,
    semilla: 4103,
    nombre: "Laca imperial",
    subtitulo: "Siete bloques de arroz",
    tiempo: 235,
  },
  {
    id: 21,
    ronda: 9,
    semilla: 5105,
    nombre: "Hora punta",
    subtitulo: "Veinte piezas, un solo ritmo",
    tiempo: 245,
  },
  {
    id: 22,
    ronda: 12,
    semilla: 6102,
    nombre: "Cocina de Kioto",
    subtitulo: "Equilibrio entre trece espacios",
    tiempo: 255,
  },
  {
    id: 23,
    ronda: 13,
    semilla: 7100,
    nombre: "Festival de faroles",
    subtitulo: "Una mesa dorada al anochecer",
    tiempo: 265,
  },
  {
    id: 24,
    ronda: 14,
    semilla: 8102,
    nombre: "La mesa de Mochi",
    subtitulo: "El desafío final del ratón chef",
    tiempo: 285,
  },
] as const;

const NIVELES_EXPERTOS: NivelDef[] = RETOS_DEL_CHEF.map((reto) => {
  const generado = generarNivelCarrera({
    ronda: reto.ronda,
    semilla: reto.semilla,
  });
  return {
    ...generado,
    id: reto.id,
    nombre: reto.nombre,
    subtitulo: reto.subtitulo,
    tiempo: reto.tiempo,
    pistas: reto.id < 21 ? 3 : 2,
  };
});

export const NIVELES: NivelDef[] = [
  ...NIVELES_ARTESANALES,
  ...NIVELES_EXPERTOS,
];

/** Devuelve el nivel por id (1-based). */
export function nivelPorId(id: number): NivelDef {
  return NIVELES[Math.min(Math.max(id - 1, 0), NIVELES.length - 1)];
}
