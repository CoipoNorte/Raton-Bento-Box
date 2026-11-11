/**
 * ingredients.ts — Catálogo de ingredientes.
 * Cada uno define su forma como poliominó, sus colores goshiki,
 * su color principal y su familia de sonido ASMR.
 */
import type { Ingrediente, IngredienteId } from "./types";

export const INGREDIENTES: Record<IngredienteId, Ingrediente> = {
  arroz: {
    id: "arroz",
    nombre: "Bloque de arroz",
    forma: [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ],
    colores: ["blanco"],
    colorPrincipal: "#faf7ef",
    sonido: "granular",
  },
  onigiri: {
    id: "onigiri",
    nombre: "Onigiri",
    forma: [
      [0, 0],
      [0, 1],
      [1, 1],
    ],
    colores: ["blanco", "negro"],
    colorPrincipal: "#f4efe2",
    sonido: "granular",
  },
  tamagoyaki: {
    id: "tamagoyaki",
    nombre: "Tamagoyaki",
    forma: [
      [0, 0],
      [1, 0],
    ],
    colores: ["amarillo"],
    colorPrincipal: "#f2c14e",
    sonido: "blando",
  },
  salmon: {
    id: "salmon",
    nombre: "Sashimi de salmón",
    forma: [
      [0, 0],
      [1, 0],
      [2, 0],
    ],
    colores: ["rojo"],
    colorPrincipal: "#f2765c",
    sonido: "blando",
  },
  karaage: {
    id: "karaage",
    nombre: "Karaage",
    forma: [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ],
    colores: ["amarillo"],
    colorPrincipal: "#d99a3d",
    sonido: "crujiente",
  },
  tempura: {
    id: "tempura",
    nombre: "Tempura de langostino",
    forma: [
      [0, 0],
      [0, 1],
      [1, 1],
    ],
    colores: ["amarillo"],
    colorPrincipal: "#e0aa4e",
    sonido: "crujiente",
  },
  brocoli: {
    id: "brocoli",
    nombre: "Brócoli",
    forma: [[0, 0]],
    colores: ["verde"],
    colorPrincipal: "#5c9a4e",
    sonido: "pop",
  },
  cherry: {
    id: "cherry",
    nombre: "Tomate cherry",
    forma: [[0, 0]],
    colores: ["rojo"],
    colorPrincipal: "#e34a4a",
    sonido: "pop",
  },
  edamame: {
    id: "edamame",
    nombre: "Edamame",
    forma: [
      [0, 0],
      [1, 0],
    ],
    colores: ["verde"],
    colorPrincipal: "#7fb069",
    sonido: "pop",
  },
  maki: {
    id: "maki",
    nombre: "Maki",
    forma: [[0, 0]],
    colores: ["negro", "blanco"],
    colorPrincipal: "#2e2a26",
    sonido: "blando",
  },
  takuan: {
    id: "takuan",
    nombre: "Takuan",
    forma: [
      [0, 0],
      [1, 0],
    ],
    colores: ["amarillo"],
    colorPrincipal: "#e8c33f",
    sonido: "pop",
  },
  zanahoria: {
    id: "zanahoria",
    nombre: "Flor de zanahoria",
    forma: [[0, 0]],
    colores: ["rojo", "amarillo"],
    colorPrincipal: "#ee8b3a",
    sonido: "pop",
  },
  umeboshi: {
    id: "umeboshi",
    nombre: "Umeboshi",
    forma: [[0, 0]],
    colores: ["rojo"],
    colorPrincipal: "#b3364a",
    sonido: "blando",
  },
};

/** Devuelve el ingrediente del catálogo (atajo con tipado). */
export function ingrediente(id: IngredienteId): Ingrediente {
  return INGREDIENTES[id];
}
