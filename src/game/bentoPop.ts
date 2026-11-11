/**
 * bentoPop.ts — Lógica pura del modo Bento Pop.
 *
 * Caja que CRECE: empiezas en 2×2 y la caja gana una fila y una columna
 * por cada lado (2→4→6→8) conforme sirves líneas de extremo a extremo.
 * Al llegar a 8×8 ya no crece y empieza la supervivencia pura.
 *
 * NOTA DE DISEÑO — por qué la ampliación se mide en líneas:
 * las líneas completas se sirven en el instante en que se completan, así
 * que nunca puede quedar una fila llena en el tablero. Eso implica que
 * cada fila y cada columna tienen siempre al menos un hueco, y para
 * «llenar» un 4×4 haría falta una pieza que tapara 4 filas y 4 columnas
 * a la vez (la mayor cubre 2×2). Es imposible por construcción. Por eso
 * la caja crece al completar su CUPO de líneas, y además se amplía al
 * instante si de verdad llenas el tablero, cosa que sí ocurre en 2×2.
 */
import { INGREDIENTES } from "./ingredients";
import { rotarForma } from "./logic";
import type { Celda, IngredienteId } from "./types";

/* ----------------------------- constantes ----------------------------- */

export const TAM_MIN = 2;
export const TAM_MAX = 8;

/** La partida arranca con 2:59 en el reloj. */
export const TIEMPO_INICIAL = 179;
/** Cada línea de extremo a extremo regala 15 s. */
export const BONUS_TIEMPO_LINEA = 15;
/** Vaciar el cuadro dorado central regala 2 s. */
export const BONUS_TIEMPO_CENTRO = 2;

/** Líneas que hay que servir para que la caja crezca a la talla siguiente. */
export function cupoAmpliacion(tam: number): number {
  return tam >= TAM_MAX ? Infinity : tam;
}

/* ------------------------------- modelo ------------------------------- */

export interface CeldaPop {
  uid: string;
  ingrediente: IngredienteId;
}

/** El tablero lleva su propia talla: todo se calcula a partir de ella. */
export interface TableroPop {
  tam: number;
  celdas: Array<CeldaPop | null>;
}

export interface PiezaPop {
  uid: string;
  ingrediente: IngredienteId;
  rotacion: number;
}

export interface ResultadoColocacionPop {
  tablero: TableroPop;
  filas: number[];
  columnas: number[];
  zonaEspecial: boolean;
  /** Índices servidos, para el destello. */
  liberadas: number[];
  /** El tablero quedó completamente lleno: amplía al instante. */
  cajaLlena: boolean;
}

const CATALOGO: IngredienteId[] = [
  "arroz",
  "onigiri",
  "tamagoyaki",
  "salmon",
  "karaage",
  "tempura",
  "edamame",
  "takuan",
  "brocoli",
  "cherry",
  "maki",
  "zanahoria",
  "umeboshi",
];

let secuenciaUid = 0;

export function tableroPopVacio(tam: number = TAM_MIN): TableroPop {
  return { tam, celdas: new Array<CeldaPop | null>(tam * tam).fill(null) };
}

/** Las cuatro celdas doradas del centro, siempre en mitad de la caja. */
export function zonaEspecial(tam: number): Celda[] {
  const a = Math.floor(tam / 2) - 1;
  const b = a + 1;
  return [
    [a, a],
    [b, a],
    [a, b],
    [b, b],
  ];
}

export function celdasPiezaPop(pieza: PiezaPop): Celda[] {
  return rotarForma(INGREDIENTES[pieza.ingrediente].forma, pieza.rotacion);
}

export function dimensionesPiezaPop(pieza: PiezaPop) {
  const celdas = celdasPiezaPop(pieza);
  return {
    w: Math.max(...celdas.map(([x]) => x)) + 1,
    h: Math.max(...celdas.map(([, y]) => y)) + 1,
  };
}

/** ¿Cabe este ingrediente en una caja de esta talla, en alguna rotación? */
export function cabeEnCaja(ingrediente: IngredienteId, tam: number): boolean {
  for (let rotacion = 0; rotacion < 4; rotacion++) {
    const { w, h } = dimensionesPiezaPop({ uid: "", ingrediente, rotacion });
    if (w <= tam && h <= tam) return true;
  }
  return false;
}

export function puedeColocarPop(
  tablero: TableroPop,
  pieza: PiezaPop,
  ax: number,
  ay: number,
): boolean {
  const { tam, celdas } = tablero;
  for (const [dx, dy] of celdasPiezaPop(pieza)) {
    const x = ax + dx;
    const y = ay + dy;
    if (x < 0 || y < 0 || x >= tam || y >= tam) return false;
    if (celdas[y * tam + x]) return false;
  }
  return true;
}

export function buscarHuecoPop(
  tablero: TableroPop,
  pieza: PiezaPop,
): { x: number; y: number; rotacion: number } | null {
  for (let rotacion = 0; rotacion < 4; rotacion++) {
    const candidata = { ...pieza, rotacion };
    const { w, h } = dimensionesPiezaPop(candidata);
    if (w > tablero.tam || h > tablero.tam) continue;
    for (let y = 0; y <= tablero.tam - h; y++) {
      for (let x = 0; x <= tablero.tam - w; x++) {
        if (puedeColocarPop(tablero, candidata, x, y)) return { x, y, rotacion };
      }
    }
  }
  return null;
}

export function hayMovimientoPop(tablero: TableroPop, piezas: PiezaPop[]): boolean {
  return piezas.some((pieza) => buscarHuecoPop(tablero, pieza) !== null);
}

/** Coloca y sirve filas, columnas y cuadro central completos. */
export function colocarPop(
  tablero: TableroPop,
  pieza: PiezaPop,
  ax: number,
  ay: number,
): ResultadoColocacionPop | null {
  if (!puedeColocarPop(tablero, pieza, ax, ay)) return null;
  const { tam } = tablero;
  const puesto = [...tablero.celdas];
  for (const [dx, dy] of celdasPiezaPop(pieza)) {
    puesto[(ay + dy) * tam + ax + dx] = {
      uid: pieza.uid,
      ingrediente: pieza.ingrediente,
    };
  }

  // La caja llena se comprueba ANTES de servir: es la ampliación exprés.
  const cajaLlena = puesto.every(Boolean);

  const filas: number[] = [];
  const columnas: number[] = [];
  for (let y = 0; y < tam; y++) {
    let completa = true;
    for (let x = 0; x < tam; x++) if (!puesto[y * tam + x]) { completa = false; break; }
    if (completa) filas.push(y);
  }
  for (let x = 0; x < tam; x++) {
    let completa = true;
    for (let y = 0; y < tam; y++) if (!puesto[y * tam + x]) { completa = false; break; }
    if (completa) columnas.push(x);
  }
  const centro = zonaEspecial(tam);
  const zonaLlena = centro.every(([x, y]) => puesto[y * tam + x]);

  const liberar = new Set<number>();
  filas.forEach((y) => {
    for (let x = 0; x < tam; x++) liberar.add(y * tam + x);
  });
  columnas.forEach((x) => {
    for (let y = 0; y < tam; y++) liberar.add(y * tam + x);
  });
  if (zonaLlena) centro.forEach(([x, y]) => liberar.add(y * tam + x));

  const resultado = [...puesto];
  liberar.forEach((i) => (resultado[i] = null));

  return {
    tablero: { tam, celdas: resultado },
    filas,
    columnas,
    zonaEspecial: zonaLlena,
    liberadas: [...liberar],
    cajaLlena,
  };
}

/**
 * Amplía la caja una fila y una columna POR CADA LADO, conservando lo ya
 * colocado y recentrándolo (desplazamiento +1, +1).
 */
export function ampliarTablero(tablero: TableroPop): TableroPop {
  const nuevoTam = Math.min(tablero.tam + 2, TAM_MAX);
  if (nuevoTam === tablero.tam) return tablero;
  const celdas = new Array<CeldaPop | null>(nuevoTam * nuevoTam).fill(null);
  for (let y = 0; y < tablero.tam; y++) {
    for (let x = 0; x < tablero.tam; x++) {
      celdas[(y + 1) * nuevoTam + (x + 1)] = tablero.celdas[y * tablero.tam + x];
    }
  }
  return { tam: nuevoTam, celdas };
}

function nuevaPieza(ingrediente: IngredienteId): PiezaPop {
  return {
    uid: `pop-${Date.now().toString(36)}-${secuenciaUid++}`,
    ingrediente,
    rotacion: 0,
  };
}

/**
 * Tres piezas que QUEPAN en la caja actual (en 2×2 no aparece el salmón).
 * Si todavía existe algún movimiento, garantiza al menos una utilizable:
 * nunca se pierde por una bandeja injusta.
 */
export function crearBandejaPop(
  tablero: TableroPop,
  azar: () => number = Math.random,
): PiezaPop[] {
  const admitidas = CATALOGO.filter((id) => cabeEnCaja(id, tablero.tam));
  const piezas = Array.from({ length: 3 }, () =>
    nuevaPieza(admitidas[Math.floor(azar() * admitidas.length)]),
  );
  if (hayMovimientoPop(tablero, piezas)) return piezas;

  const posibles = admitidas.filter(
    (id) => buscarHuecoPop(tablero, nuevaPieza(id)) !== null,
  );
  if (posibles.length) {
    piezas[Math.floor(azar() * piezas.length)] = nuevaPieza(
      posibles[Math.floor(azar() * posibles.length)],
    );
  }
  return piezas;
}

/** Puntos de una colocación: generosa con líneas simultáneas y combos. */
export function puntosPop(
  pieza: PiezaPop,
  resultado: ResultadoColocacionPop,
  combo: number,
): number {
  const base = celdasPiezaPop(pieza).length * 10;
  const lineas = resultado.filas.length + resultado.columnas.length;
  const multiplicador = Math.max(1, combo);
  const porLineas = lineas * 120 * multiplicador;
  const simultaneas = lineas > 1 ? (lineas - 1) * 100 : 0;
  const centro = resultado.zonaEspecial ? 250 * multiplicador : 0;
  return base + porLineas + simultaneas + centro;
}

/** Premio por ampliar la caja: crecer es el objetivo del modo. */
export function puntosAmpliacion(nuevoTam: number): number {
  return nuevoTam * 250;
}
