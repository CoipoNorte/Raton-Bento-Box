/**
 * balance.ts — Puntuación, bonus y estrellas.
 * Todos los números mágicos viven aquí para ajustar el juego sin
 * tocar la lógica ni la interfaz.
 */
import type { Resultado } from "./types";

export const PUNTOS_BASE_COMPLETADO = 1000;
export const BONUS_SIN_HUECOS = 500;
export const BONUS_GOSHIKI = 250;
export const BONUS_ELEGANCIA = 300; // sin deshacer ni quitar piezas
export const PUNTOS_POR_ENCAJE_PERFECTO = 120;

/** Umbrales de estrellas (proporción de la puntuación máxima teórica). */
const UMBRAL_2_ESTRELLAS = 0.55;
const UMBRAL_3_ESTRELLAS = 0.8;

export interface EntradaPuntuacion {
  perfectos: number; // encajes de compartimento encadenados
  goshikiCompleto: boolean;
  elegante: boolean; // true si no hubo deshacer ni retiradas
}

/** Calcula la puntuación máxima teórica de un nivel (para estrellas). */
export function puntuacionMaxima(perfectosMax: number): number {
  return (
    PUNTOS_BASE_COMPLETADO +
    BONUS_SIN_HUECOS +
    BONUS_GOSHIKI +
    BONUS_ELEGANCIA +
    perfectosMax * PUNTOS_POR_ENCAJE_PERFECTO
  );
}

/**
 * Puntúa un bento cerrado. Generoso por diseño: completar ya da
 * una estrella; la maestría (sin tocar nada, con combos) da dos y tres.
 */
export function puntuar(
  entrada: EntradaPuntuacion,
  perfectosMax: number,
): Resultado {
  const bonusCombo = entrada.perfectos * PUNTOS_POR_ENCAJE_PERFECTO;
  const bonusSinHuecos = BONUS_SIN_HUECOS;
  const bonusGoshiki = entrada.goshikiCompleto ? BONUS_GOSHIKI : 0;
  const bonusElegancia = entrada.elegante ? BONUS_ELEGANCIA : 0;
  const puntos =
    PUNTOS_BASE_COMPLETADO + bonusSinHuecos + bonusGoshiki + bonusElegancia + bonusCombo;

  const max = puntuacionMaxima(perfectosMax);
  const ratio = puntos / max;
  const estrellas = ratio >= UMBRAL_3_ESTRELLAS ? 3 : ratio >= UMBRAL_2_ESTRELLAS ? 2 : 1;

  return {
    puntos,
    estrellas,
    bonusSinHuecos,
    bonusGoshiki,
    bonusElegancia,
    bonusCombo,
    perfectos: entrada.perfectos,
  };
}
