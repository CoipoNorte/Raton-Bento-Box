/**
 * logic.ts — Lógica pura del puzzle.
 * Rotar, trasladar, validar colisiones, detectar compartimentos
 * completos y evaluar el pedido del cliente. Sin efectos secundarios.
 */
import { INGREDIENTES } from "./ingredients";
import type {
  Celda,
  ColorGoshiki,
  NivelDef,
  PedidoItem,
  PiezaInst,
} from "./types";

/** Normaliza una forma para que su esquina mínima quede en (0,0). */
export function normalizar(celdas: Celda[]): Celda[] {
  const minX = Math.min(...celdas.map(([x]) => x));
  const minY = Math.min(...celdas.map(([, y]) => y));
  return celdas
    .map(([x, y]): Celda => [x - minX, y - minY])
    .sort((a, b) => a[1] - b[1] || a[0] - b[0]);
}

/** Rota una forma 90° en sentido horario, `pasos` veces. */
export function rotarForma(celdas: Celda[], pasos: number): Celda[] {
  let forma = normalizar(celdas);
  for (let i = 0; i < pasos % 4; i++) {
    forma = normalizar(forma.map(([x, y]): Celda => [y, -x]));
  }
  return forma;
}

/** Celdas relativas de una pieza según su rotación actual. */
export function celdasDe(pieza: PiezaInst): Celda[] {
  return rotarForma(INGREDIENTES[pieza.ingrediente].forma, pieza.rotacion);
}

/** Celdas absolutas si la pieza se anclara en (ax, ay). */
export function celdasEn(pieza: PiezaInst, ax: number, ay: number): Celda[] {
  return celdasDe(pieza).map(([x, y]): Celda => [x + ax, y + ay]);
}

/** Modelo en tiempo de ejecución de una caja bento. */
export interface ModeloCaja {
  cols: number;
  rows: number;
  /** comp[i] = índice de compartimento de cada celda (fila-major). */
  comp: number[];
  /** Rectángulos de cada compartimento, para pintar paredes. */
  rects: { x: number; y: number; w: number; h: number }[];
  /** Celdas ocupadas por id de pieza ("" = vacía). */
  ocupacion: string[];
  /** Solución: celda → uid esperado, para las pistas. */
  solucion: Map<string, string>;
  /**
   * Modo Figuras: celdas que pertenecen a la silueta. Si falta, la caja
   * es rectangular y todas las celdas son jugables.
   */
  mascara?: boolean[];
}

/** ¿Esta celda forma parte de la caja? (siempre sí si no hay máscara). */
export function celdaJugable(modelo: ModeloCaja, x: number, y: number): boolean {
  if (x < 0 || y < 0 || x >= modelo.cols || y >= modelo.rows) return false;
  return modelo.mascara ? modelo.mascara[y * modelo.cols + x] : true;
}

export function clave(x: number, y: number): string {
  return `${x},${y}`;
}

/**
 * Construye el modelo de nivel: compartimentos, piezas de bandeja y
 * solución. Verifica la teselación y avisa por consola si un nivel
 * estuviera mal definido (nunca rompe el juego).
 */
export function construirNivel(nivel: NivelDef): {
  modelo: ModeloCaja;
  piezas: PiezaInst[];
} {
  // --- Modo Figuras: silueta libre con piezas de posición absoluta ---
  if (nivel.mascara && nivel.piezasFigura) {
    const { cols, rows, mascara } = nivel;
    const comp = new Array<number>(cols * rows).fill(-1);
    mascara.forEach((dentro, i) => {
      if (dentro) comp[i] = 0;
    });
    // Un único «compartimento»: la figura entera. El rect es su marco,
    // que sirve para el destello dorado al completarla.
    const xs: number[] = [];
    const ys: number[] = [];
    mascara.forEach((dentro, i) => {
      if (!dentro) return;
      xs.push(i % cols);
      ys.push(Math.floor(i / cols));
    });
    const rects = xs.length
      ? [
          {
            x: Math.min(...xs),
            y: Math.min(...ys),
            w: Math.max(...xs) - Math.min(...xs) + 1,
            h: Math.max(...ys) - Math.min(...ys) + 1,
          },
        ]
      : [];

    const piezas: PiezaInst[] = [];
    const solucion = new Map<string, string>();
    nivel.piezasFigura.forEach((p, i) => {
      const inst: PiezaInst = {
        uid: `f${i}`,
        ingrediente: p.ing,
        rotacion: p.rot,
        x: null,
        y: null,
      };
      // ox/oy ya son coordenadas absolutas en esta variante.
      celdasEn(inst, p.ox, p.oy).forEach(([x, y]) => solucion.set(clave(x, y), inst.uid));
      inst.rotacion = 0; // la bandeja siempre empieza sin rotar
      piezas.push(inst);
    });

    return {
      modelo: {
        cols,
        rows,
        comp,
        rects,
        ocupacion: new Array<string>(cols * rows).fill(""),
        solucion,
        mascara,
      },
      piezas,
    };
  }

  const { cols, rows } = nivel;
  const comp = new Array<number>(cols * rows).fill(-1);
  const rects: ModeloCaja["rects"] = [];
  const piezas: PiezaInst[] = [];
  const solucion = new Map<string, string>();
  let uid = 0;

  nivel.compartimentos.forEach((c, ci) => {
    rects.push({ x: c.x, y: c.y, w: c.w, h: c.h });
    for (let dy = 0; dy < c.h; dy++) {
      for (let dx = 0; dx < c.w; dx++) {
        const x = c.x + dx;
        const y = c.y + dy;
        if (x < cols && y < rows) comp[y * cols + x] = ci;
      }
    }
    c.piezas.forEach((p) => {
      const inst: PiezaInst = {
        uid: `p${uid++}`,
        ingrediente: p.ing,
        rotacion: p.rot,
        x: null,
        y: null,
      };
      // Registramos la posición esperada en la solución.
      celdasEn(inst, c.x + p.ox, c.y + p.oy).forEach(([x, y]) =>
        solucion.set(clave(x, y), inst.uid),
      );
      // Empiezan en la bandeja sin rotar: la calma de ordenarlas es tuya.
      inst.rotacion = 0;
      piezas.push(inst);
    });
  });

  // Diagnóstico en desarrollo: ¿la solución cubre todo sin solapes?
  if (solucion.size !== cols * rows) {
    console.warn(
      `[bento] El nivel ${nivel.id} tesela ${solucion.size}/${cols * rows} celdas. Revisa levels.ts.`,
    );
  }

  return {
    modelo: {
      cols,
      rows,
      comp,
      rects,
      ocupacion: new Array<string>(cols * rows).fill(""),
      solucion,
    },
    piezas,
  };
}

/** Recalcula la ocupación de la caja a partir de las piezas colocadas. */
export function recalcularOcupacion(
  modelo: ModeloCaja,
  piezas: PiezaInst[],
): string[] {
  const ocup = new Array<string>(modelo.cols * modelo.rows).fill("");
  for (const p of piezas) {
    if (p.x === null || p.y === null) continue;
    for (const [x, y] of celdasEn(p, p.x, p.y)) {
      if (x >= 0 && y >= 0 && x < modelo.cols && y < modelo.rows) {
        ocup[y * modelo.cols + x] = p.uid;
      }
    }
  }
  return ocup;
}

/** ¿Puede colocarse la pieza anclada en (ax, ay)? Dentro y sin solapes. */
export function puedeColocar(
  modelo: ModeloCaja,
  pieza: PiezaInst,
  ax: number,
  ay: number,
  ocupacion: string[],
): boolean {
  for (const [x, y] of celdasEn(pieza, ax, ay)) {
    // En el modo Figuras, fuera de la silueta no se puede colocar.
    if (!celdaJugable(modelo, x, y)) return false;
    const actual = ocupacion[y * modelo.cols + x];
    if (actual !== "" && actual !== pieza.uid) return false;
  }
  return true;
}

/**
 * IMÁN DE COLOCACIÓN: busca el anclaje válido más cercano al ideal.
 *
 * Colocar no debe exigir puntería de píxel. Si el hueco correcto está a
 * una celda del punto donde sueltas, la pieza «salta» a él. Se prueban
 * los candidatos en orden de distancia, así que siempre gana el más
 * cercano al gesto del jugador.
 */
export function mejorAnclaje(
  modelo: ModeloCaja,
  pieza: PiezaInst,
  ax: number,
  ay: number,
  ocupacion: string[],
  radio = 1,
): { x: number; y: number } | null {
  let mejor: { x: number; y: number; d: number } | null = null;
  for (let dy = -radio; dy <= radio; dy++) {
    for (let dx = -radio; dx <= radio; dx++) {
      const x = ax + dx;
      const y = ay + dy;
      if (!puedeColocar(modelo, pieza, x, y, ocupacion)) continue;
      const d = dx * dx + dy * dy;
      if (!mejor || d < mejor.d) mejor = { x, y, d };
    }
  }
  return mejor ? { x: mejor.x, y: mejor.y } : null;
}

/** Índices de compartimentos que acaban de quedar llenos por completo. */
export function compartimentosCompletos(
  modelo: ModeloCaja,
  ocupacion: string[],
): number[] {
  const llenos = new Set<number>();
  const vistos = new Set<number>();
  for (let i = 0; i < ocupacion.length; i++) {
    const c = modelo.comp[i];
    if (c < 0 || vistos.has(c)) continue;
    vistos.add(c);
    let completo = true;
    for (let j = 0; j < ocupacion.length; j++) {
      // Las celdas fuera de la silueta no cuentan para completar.
      if (modelo.mascara && !modelo.mascara[j]) continue;
      if (modelo.comp[j] === c && ocupacion[j] === "") {
        completo = false;
        break;
      }
    }
    if (completo) llenos.add(c);
  }
  return [...llenos];
}

/** Porcentaje de relleno 0..100 (solo cuenta celdas jugables). */
export function porcentajeRelleno(modelo: ModeloCaja, ocupacion: string[]): number {
  let total = 0;
  let llenas = 0;
  for (let i = 0; i < ocupacion.length; i++) {
    if (modelo.mascara && !modelo.mascara[i]) continue;
    total++;
    if (ocupacion[i] !== "") llenas++;
  }
  return total === 0 ? 0 : Math.round((llenas / total) * 100);
}

/** ¿Está la caja al 100 % sin huecos? Ignora lo que está fuera de la silueta. */
export function cajaLlena(modelo: ModeloCaja, ocupacion: string[]): boolean {
  for (let i = 0; i < ocupacion.length; i++) {
    if (modelo.mascara && !modelo.mascara[i]) continue;
    if (ocupacion[i] === "") return false;
  }
  return true;
}

/** Colores goshiki presentes en las piezas colocadas. */
export function coloresPresentes(piezas: PiezaInst[]): Set<ColorGoshiki> {
  const set = new Set<ColorGoshiki>();
  for (const p of piezas) {
    if (p.x === null) continue;
    INGREDIENTES[p.ingrediente].colores.forEach((c) => set.add(c));
  }
  return set;
}

/** Evalúa cada requisito del pedido contra el estado actual. */
export function evaluarPedido(
  pedido: PedidoItem[],
  piezas: PiezaInst[],
): boolean[] {
  const colocadas = piezas.filter((p) => p.x !== null);
  return pedido.map((item) => {
    if (item.tipo === "ingrediente") {
      return (
        colocadas.filter((p) => p.ingrediente === item.id).length >= item.n
      );
    }
    // tipo color
    let n = 0;
    for (const p of colocadas) {
      if (INGREDIENTES[p.ingrediente].colores.includes(item.color)) n++;
    }
    return n >= item.n;
  });
}

/**
 * Pista: dada una pieza sin colocar, devuelve sus celdas solución
 * (ancla incluida) gracias al mapa de solución del modelo.
 */
export function celdasPista(
  modelo: ModeloCaja,
  uid: string,
): { ax: number; ay: number; celdas: Celda[] } | null {
  const celdas: Celda[] = [];
  for (const [k, id] of modelo.solucion) {
    if (id === uid) {
      const [x, y] = k.split(",").map(Number);
      celdas.push([x, y]);
    }
  }
  if (!celdas.length) return null;
  const minX = Math.min(...celdas.map(([x]) => x));
  const minY = Math.min(...celdas.map(([, y]) => y));
  return { ax: minX, ay: minY, celdas };
}
