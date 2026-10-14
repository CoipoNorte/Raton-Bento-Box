/**
 * layout.ts — Geometría de la caja: ÚNICA fuente de verdad.
 *
 * El bug clásico: el componente dibuja marco + margen interior, pero el
 * cálculo del tamaño de celda los ignoraba → la caja se salía de su
 * recuadro. Aquí se define de una vez el tamaño REAL que ocupa una caja
 * y se elige la celda más grande que de verdad cabe.
 */

export interface MedidasCaja {
  /** Grosor del marco de laca (cada lado). */
  borde: number;
  /** Margen interior de la cubeta (cada lado). */
  margen: number;
  /** Ancho total ocupado, marco incluido. */
  ancho: number;
  /** Alto total ocupado, marco incluido. */
  alto: number;
}

/** Medidas exactas de una caja de cols×rows con celdas de `celda` px. */
export function medidasCaja(celda: number, cols: number, rows: number): MedidasCaja {
  const borde = Math.max(9, Math.round(celda * 0.28));
  const margen = Math.max(4, Math.round(celda * 0.11));
  return {
    borde,
    margen,
    ancho: cols * celda + 2 * margen + 2 * borde,
    alto: rows * celda + 2 * margen + 2 * borde,
  };
}

/**
 * Mayor tamaño de celda cuya caja COMPLETA cabe en el área disponible.
 * Busca de grande a pequeño con las medidas reales: cero desbordes.
 */
export function calcularCelda(
  anchoDisp: number,
  altoDisp: number,
  cols: number,
  rows: number,
  min = 16,
  max = 116,
): number {
  const w = Math.max(0, anchoDisp);
  const h = Math.max(0, altoDisp);
  for (let c = max; c > min; c--) {
    const m = medidasCaja(c, cols, rows);
    if (m.ancho <= w && m.alto <= h) return c;
  }
  return min;
}
