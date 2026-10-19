/**
 * generator.ts — Cajas bento procedurales para el MODO CARRERA.
 *
 * Garantía de diseño: toda caja generada ES RESOLUBLE, porque se
 * construye al revés que un puzzle normal:
 *   1. Se parte la rejilla en compartimentos rectangulares.
 *   2. Cada compartimento se tesela con piezas reales mediante
 *      backtracking (siempre hay 1×1 como último recurso).
 *   3. La bandeja nace de esa teselación.
 * Con la misma semilla sale exactamente la misma caja.
 */
import { INGREDIENTES } from "./ingredients";
import { rotarForma } from "./logic";
import type { Celda, CompartimentoDef, IngredienteId, NivelDef, PedidoItem, PiezaNivel } from "./types";

/* ------------------------- azar con semilla ------------------------- */

export function mulberry32(semilla: number) {
  let a = semilla >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Azar = () => number;

const entero = (r: Azar, min: number, max: number) =>
  min + Math.floor(r() * (max - min + 1));

function barajar<T>(r: Azar, lista: T[]): T[] {
  const a = [...lista];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* --------------------- catálogo por tamaño de pieza ------------------ */

/** Piezas grandes primero: generan cajas más interesantes. */
const GRANDES: IngredienteId[] = ["arroz", "karaage"];
const MEDIANAS: IngredienteId[] = ["onigiri", "tempura", "salmon"];
const DOBLES: IngredienteId[] = ["tamagoyaki", "edamame", "takuan"];
const UNITARIAS: IngredienteId[] = ["brocoli", "cherry", "maki", "zanahoria", "umeboshi"];

/* ----------------------- partición de la caja ------------------------ */

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * Divide un rectángulo recursivamente hasta que todos los trozos
 * quepan en el rango deseado. Produce compartimentos variados.
 */
function partir(r: Azar, rect: Rect, maxLado: number, profundidad: number): Rect[] {
  const area = rect.w * rect.h;
  const grande = rect.w > maxLado || rect.h > maxLado || area > maxLado * 2;
  // Paramos pronto a veces: así aparecen compartimentos amplios.
  if (!grande || profundidad > 4 || (area <= 6 && r() < 0.5)) return [rect];

  const puedeV = rect.w >= 3;
  const puedeH = rect.h >= 3;
  if (!puedeV && !puedeH) return [rect];
  const vertical = puedeV && (!puedeH || (rect.w >= rect.h ? r() < 0.75 : r() < 0.25));

  if (vertical) {
    const corte = entero(r, 1, rect.w - 1);
    return [
      ...partir(r, { ...rect, w: corte }, maxLado, profundidad + 1),
      ...partir(r, { x: rect.x + corte, y: rect.y, w: rect.w - corte, h: rect.h }, maxLado, profundidad + 1),
    ];
  }
  const corte = entero(r, 1, rect.h - 1);
  return [
    ...partir(r, { ...rect, h: corte }, maxLado, profundidad + 1),
    ...partir(r, { x: rect.x, y: rect.y + corte, w: rect.w, h: rect.h - corte }, maxLado, profundidad + 1),
  ];
}

/* ------------------- teselado exacto de un compartimento -------------- */

interface Candidata {
  ing: IngredienteId;
  rot: number;
  celdas: Celda[];
}

/** Todas las orientaciones únicas de un ingrediente. */
function orientaciones(ing: IngredienteId): Candidata[] {
  const vistas = new Set<string>();
  const salida: Candidata[] = [];
  for (let rot = 0; rot < 4; rot++) {
    const celdas = rotarForma(INGREDIENTES[ing].forma, rot);
    const clave = celdas.map(([x, y]) => `${x},${y}`).join("|");
    if (vistas.has(clave)) continue;
    vistas.add(clave);
    salida.push({ ing, rot, celdas });
  }
  return salida;
}

/**
 * Rellena un compartimento w×h con piezas reales, sin huecos ni solapes.
 * Backtracking sobre la primera celda libre; como existen piezas 1×1,
 * la búsqueda SIEMPRE encuentra solución.
 */
function teselar(r: Azar, w: number, h: number): PiezaNivel[] | null {
  const ocup = new Array<boolean>(w * h).fill(false);
  const salida: PiezaNivel[] = [];
  // Orden de preferencia: grandes → medianas → dobles → unitarias.
  const grupos = [
    barajar(r, GRANDES),
    barajar(r, MEDIANAS),
    barajar(r, DOBLES),
    barajar(r, UNITARIAS),
  ];
  const catalogo: Candidata[] = grupos.flatMap((g) => g.flatMap(orientaciones));

  const paso = (restantes: number): boolean => {
    if (restantes === 0) return true;
    const i = ocup.indexOf(false);
    const ax = i % w;
    const ay = Math.floor(i / w);
    for (const cand of catalogo) {
      // La primera celda de la forma debe caer justo en el hueco.
      const [px, py] = cand.celdas[0];
      const ox = ax - px;
      const oy = ay - py;
      let cabe = true;
      for (const [cx, cy] of cand.celdas) {
        const x = ox + cx;
        const y = oy + cy;
        if (x < 0 || y < 0 || x >= w || y >= h || ocup[y * w + x]) {
          cabe = false;
          break;
        }
      }
      if (!cabe) continue;
      cand.celdas.forEach(([cx, cy]) => (ocup[(oy + cy) * w + ox + cx] = true));
      salida.push({ ing: cand.ing, rot: cand.rot, ox, oy });
      if (paso(restantes - cand.celdas.length)) return true;
      salida.pop();
      cand.celdas.forEach(([cx, cy]) => (ocup[(oy + cy) * w + ox + cx] = false));
    }
    return false;
  };

  return paso(w * h) ? salida : null;
}

/* --------------------------- pedido del día --------------------------- */

function construirPedido(r: Azar, piezas: PiezaNivel[]): PedidoItem[] {
  const cuenta = new Map<IngredienteId, number>();
  piezas.forEach((p) => cuenta.set(p.ing, (cuenta.get(p.ing) ?? 0) + 1));
  const candidatos = [...cuenta.entries()].filter(([, n]) => n >= 1);
  if (!candidatos.length) return [];
  const elegido = candidatos[Math.floor(r() * candidatos.length)];
  const pedido: PedidoItem[] = [
    { tipo: "ingrediente", id: elegido[0], n: Math.min(elegido[1], entero(r, 1, 2)) },
  ];
  // Un segundo requisito de color, siempre alcanzable.
  const colores = new Set(piezas.flatMap((p) => INGREDIENTES[p.ing].colores));
  const lista = [...colores];
  if (lista.length) {
    pedido.push({ tipo: "color", color: lista[Math.floor(r() * lista.length)], n: 1 });
  }
  return pedido;
}

/* ------------------------- generación completa ------------------------ */

export interface OpcionesCarrera {
  /** Ronda actual (1, 2, 3…): escala el tamaño y el tiempo. */
  ronda: number;
  semilla: number;
  /** Tope de columnas (8 por defecto; la campaña final llega a 9). */
  maxCols?: number;
  /** Tope de filas (7 por defecto). */
  maxRows?: number;
}

/** Tamaño de caja según la ronda: crece con suavidad y se estabiliza. */
function dimensiones(
  r: Azar,
  ronda: number,
  maxCols: number,
  maxRows: number,
): { cols: number; rows: number } {
  const escalon = Math.min(Math.floor((ronda - 1) / 2), 6);
  const base = 4 + escalon; // 4..10
  const cols = Math.min(maxCols, base + (r() < 0.5 ? 0 : 1));
  const rows = Math.min(maxRows, Math.max(3, base - (r() < 0.5 ? 1 : 0)));
  return { cols, rows };
}

/**
 * Crea una caja bento procedural lista para jugar.
 * Reintenta con semillas derivadas si una partición resultara imposible
 * (en la práctica no ocurre, pero el juego nunca debe quedarse atascado).
 */
export function generarNivelCarrera({
  ronda,
  semilla,
  maxCols = 8,
  maxRows = 7,
}: OpcionesCarrera): NivelDef {
  for (let intento = 0; intento < 12; intento++) {
    const r = mulberry32(semilla + intento * 7919);
    const { cols, rows } = dimensiones(r, ronda, maxCols, maxRows);
    const maxLado = ronda < 4 ? 3 : 4;
    const rects = partir(r, { x: 0, y: 0, w: cols, h: rows }, maxLado, 0);

    const compartimentos: CompartimentoDef[] = [];
    let valido = true;
    for (const rect of rects) {
      const piezas = teselar(r, rect.w, rect.h);
      if (!piezas) {
        valido = false;
        break;
      }
      compartimentos.push({ x: rect.x, y: rect.y, w: rect.w, h: rect.h, piezas });
    }
    if (!valido) continue;

    const todas = compartimentos.flatMap((c) => c.piezas);
    // Tiempo: generoso al principio, exigente al avanzar.
    const celdas = cols * rows;
    const segundos = Math.max(28, Math.round(celdas * 3.2 - ronda * 1.5));

    return {
      id: 1000 + ronda,
      nombre: `Pedido ${ronda}`,
      subtitulo: `${cols}×${rows} · ${compartimentos.length} compartimentos`,
      cols,
      rows,
      compartimentos,
      pedido: construirPedido(r, todas),
      tiempo: segundos,
      pistas: ronda <= 3 ? 2 : 1,
    };
  }

  // Red de seguridad: caja mínima trivial (nunca debería alcanzarse).
  return {
    id: 1000 + ronda,
    nombre: `Pedido ${ronda}`,
    subtitulo: "Caja sencilla",
    cols: 2,
    rows: 2,
    compartimentos: [
      { x: 0, y: 0, w: 2, h: 2, piezas: [{ ing: "arroz", rot: 0, ox: 0, oy: 0 }] },
    ],
    pedido: [{ tipo: "ingrediente", id: "arroz", n: 1 }],
    tiempo: 45,
    pistas: 2,
  };
}
