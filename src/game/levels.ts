/**
 * levels.ts — Definición de niveles.
 * Cada caja se construye con compartimentos rectangulares y cada uno
 * lleva su teselación exacta de piezas: la bandeja nace de la solución,
 * así que TODO nivel es resoluble por construcción.
 */
import type { NivelDef } from "./types";

export const NIVELES: NivelDef[] = [
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
        x: 0, y: 5, w: 3, h: 1,
        piezas: [
          { ing: "takuan", rot: 0, ox: 0, oy: 0 },
          { ing: "maki", rot: 0, ox: 2, oy: 0 },
        ],
      },
      { x: 4, y: 5, w: 1, h: 1, piezas: [{ ing: "brocoli", rot: 0, ox: 0, oy: 0 }] },
      { x: 5, y: 5, w: 2, h: 1, piezas: [{ ing: "takuan", rot: 0, ox: 0, oy: 0 }] },
    ],
  },
];

/** Devuelve el nivel por id (1-based). */
export function nivelPorId(id: number): NivelDef {
  return NIVELES[Math.min(Math.max(id - 1, 0), NIVELES.length - 1)];
}
