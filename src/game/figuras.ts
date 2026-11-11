/**
 * figuras.ts — Modo Figuras: bentos con silueta libre.
 *
 * Cada figura se dibuja como ARTE ASCII (`#` = celda de la caja,
 * `.` = fuera). Añadir una figura nueva es añadir un dibujo al
 * catálogo: nada de tocar la lógica.
 *
 * El teselado de una silueta arbitraria se resuelve con backtracking
 * sobre las celdas libres. Como el catálogo incluye piezas 1×1,
 * CUALQUIER silueta tiene solución garantizada; el orden de búsqueda
 * (grandes → medianas → dobles → unitarias) hace que salgan bonitas,
 * con pocas piezas sueltas.
 */
import { INGREDIENTES } from "./ingredients";
import { mulberry32 } from "./generator";
import { rotarForma } from "./logic";
import type { Celda, IngredienteId, NivelDef, PedidoItem, PiezaNivel } from "./types";

/* ------------------------------ catálogo ------------------------------ */

export interface FiguraDef {
  id: string;
  nombre: string;
  /** Arte ASCII: '#' celda jugable, '.' hueco. Filas de igual longitud. */
  patron: string[];
}

export interface TemaFiguras {
  id: string;
  titulo: string;
  emoji: string;
  /** Color de acento del tema, para la carta de selección. */
  color: string;
  figuras: FiguraDef[];
}

export const TEMAS_FIGURAS: TemaFiguras[] = [
  {
    id: "geometria",
    titulo: "Geometría",
    emoji: "🔷",
    color: "#7fa8d9",
    figuras: [
      {
        id: "rectangulo",
        nombre: "Rectángulo",
        patron: ["######", "######", "######", "######"],
      },
      {
        id: "escalera",
        nombre: "Escalera",
        patron: ["##....", "####..", "######", "######"],
      },
      {
        id: "triangulo",
        nombre: "Triángulo",
        patron: ["...##...", "..####..", ".######.", "########"],
      },
      {
        id: "rombo",
        nombre: "Rombo",
        patron: ["...#...", "..###..", ".#####.", "#######", ".#####.", "..###..", "...#..."],
      },
      {
        id: "circulo",
        nombre: "Círculo",
        patron: ["..##..", ".####.", "######", "######", ".####.", "..##.."],
      },
      {
        id: "hexagono",
        nombre: "Hexágono",
        patron: ["..###..", ".#####.", "#######", "#######", ".#####.", "..###.."],
      },
      {
        id: "cruz",
        nombre: "Cruz",
        patron: ["..###..", "..###..", "#######", "#######", "#######", "..###..", "..###.."],
      },
      {
        id: "estrella",
        nombre: "Estrella",
        patron: [
          "....#....",
          "...###...",
          ".#######.",
          ".#######.",
          "..#####..",
          "..##.##..",
          ".##...##.",
        ],
      },
    ],
  },
  {
    id: "naturaleza",
    titulo: "Naturaleza",
    emoji: "🌿",
    color: "#7fb069",
    figuras: [
      {
        id: "brote",
        nombre: "Brote",
        patron: ["..##..", ".####.", "######", "..##..", "..##.."],
      },
      {
        id: "sol",
        nombre: "Sol",
        patron: ["...#...", ".#####.", ".#####.", "#######", ".#####.", ".#####.", "...#..."],
      },
      {
        id: "hoja",
        nombre: "Hoja",
        patron: ["..###..", ".#####.", "#######", "#######", ".#####.", "..###..", "...#..."],
      },
      {
        id: "flor",
        nombre: "Flor",
        patron: [".##.##.", "#######", "#######", ".#####.", "..###..", "...#...", "...#..."],
      },
      {
        id: "nube",
        nombre: "Nube",
        patron: ["...###...", ".#######.", "#########", "#########", ".#######."],
      },
      {
        id: "pino",
        nombre: "Pino",
        patron: ["...#...", "..###..", ".#####.", ".#####.", "#######", "#######", "...#...", "...#..."],
      },
      {
        id: "montana",
        nombre: "Montaña",
        patron: ["....#....", "...###...", "..#####..", ".#######.", "#########", "#########"],
      },
      {
        id: "sakura",
        nombre: "Sakura",
        patron: [
          "..##.##..",
          ".#######.",
          "#########",
          "###...###",
          "#########",
          ".#######.",
          "..##.##..",
        ],
      },
    ],
  },
  {
    id: "animales",
    titulo: "Animales",
    emoji: "🐾",
    color: "#e8a05c",
    figuras: [
      {
        id: "huevo",
        nombre: "Huevo",
        patron: ["..##..", ".####.", "######", "######", "######", ".####."],
      },
      {
        id: "pajaro",
        nombre: "Pájaro",
        patron: [".##....", "####...", "#####..", ".######", ".#####.", "..###..", "..#.#.."],
      },
      {
        id: "pez",
        nombre: "Pez",
        patron: ["..####.##", ".#######.", "#########", ".#######.", "..####.##"],
      },
      {
        id: "gatito",
        nombre: "Gatito",
        patron: ["#.....#", "##...##", "#######", "#######", "#######", ".#####.", "..###.."],
      },
      {
        id: "conejo",
        nombre: "Conejo",
        patron: [".#...#.", ".#...#.", ".##.##.", ".#####.", "#######", "#######", "#######", ".#####."],
      },
      {
        id: "perrito",
        nombre: "Perrito",
        patron: [".##..##.", "########", "########", "########", ".######.", "..####..", "...##..."],
      },
      {
        id: "mariposa",
        nombre: "Mariposa",
        patron: ["##.....##", "####.####", "#########", "...###...", "#########", "####.####", "##.....##"],
      },
      {
        id: "dinosaurio",
        nombre: "Dinosaurio",
        patron: [
          ".......###",
          ".......###",
          ".......##.",
          "..########",
          ".#########",
          ".#########",
          "..##..##..",
          "..##..##..",
        ],
      },
    ],
  },
  {
    id: "festival",
    titulo: "Festival",
    emoji: "🎐",
    color: "#e8759b",
    figuras: [
      {
        id: "regalo",
        nombre: "Regalo",
        patron: [".##..##.", "########", "..####..", "########", "########", "########"],
      },
      {
        id: "farolillo",
        nombre: "Farolillo",
        patron: ["..##..", "######", "######", "######", "######", "######", ".####.", "..##.."],
      },
      {
        id: "abanico",
        nombre: "Abanico",
        patron: ["#########", ".#######.", "..#####..", "...###...", "...###...", "....#...."],
      },
      {
        id: "corazon",
        nombre: "Corazón",
        patron: [".##..##.", "########", "########", "########", ".######.", "..####..", "...##..."],
      },
      {
        id: "cometa",
        nombre: "Cometa",
        patron: ["...#...", "..###..", ".#####.", "#######", ".#####.", "..###..", "...#...", "...#..."],
      },
      {
        id: "campana",
        nombre: "Campana",
        patron: ["..##..", ".####.", "######", "######", "######", "######", "######", "..##.."],
      },
      {
        id: "fuego",
        nombre: "Fuego artificial",
        patron: ["..#.#..", ".#####.", "#######", ".#####.", "..###..", "...#...", "...#..."],
      },
    ],
  },
  {
    id: "japon",
    titulo: "Japón",
    emoji: "⛩️",
    color: "#c0392b",
    figuras: [
      {
        id: "onigiri-gigante",
        nombre: "Onigiri gigante",
        patron: ["...#...", "..###..", ".#####.", "#######", "#######", "#######"],
      },
      {
        id: "daruma",
        nombre: "Daruma",
        patron: ["..###..", ".#####.", ".#####.", "#######", "#######", "#######", ".#####."],
      },
      {
        id: "torii",
        nombre: "Torii",
        patron: ["#########", "#########", ".#######.", "..#...#..", "..#...#..", "..#...#..", ".##...##."],
      },
      {
        id: "fuji",
        nombre: "Monte Fuji",
        patron: ["...###...", "..#.#.#..", "..#####..", ".#######.", "#########", "#########"],
      },
      {
        id: "pagoda",
        nombre: "Pagoda",
        patron: ["...#...", "#######", ".#####.", "#######", ".#####.", "#######", "..###..", "..###.."],
      },
      {
        id: "koinobori",
        nombre: "Koinobori",
        patron: ["..######.", ".########", "#########", ".########", "..######."],
      },
      {
        id: "bonsai",
        nombre: "Bonsái",
        patron: ["..#####..", ".#######.", "#########", "...###...", "...###...", ".#######.", "#########"],
      },
    ],
  },
  {
    id: "mandalas",
    titulo: "Mandalas",
    emoji: "🪷",
    color: "#a78bc9",
    figuras: [
      {
        id: "anillo",
        nombre: "Anillo",
        patron: ["..####..", ".######.", "########", "##....##", "##....##", "########", ".######.", "..####.."],
      },
      {
        id: "rueda",
        nombre: "Rueda",
        patron: ["..###..", ".#####.", "###.###", "##...##", "###.###", ".#####.", "..###.."],
      },
      {
        id: "mandala-cruz",
        nombre: "Mandala cruz",
        patron: [
          "...###...",
          "...###...",
          "...###...",
          "#########",
          "#########",
          "#########",
          "...###...",
          "...###...",
          "...###...",
        ],
      },
      {
        id: "loto",
        nombre: "Loto",
        patron: [
          "...###...",
          "..#####..",
          ".#######.",
          "###...###",
          "##.....##",
          "###...###",
          ".#######.",
          "..#####..",
          "...###...",
        ],
      },
      {
        id: "copo",
        nombre: "Copo",
        patron: ["...###...", "...###...", ".#######.", "#########", ".#######.", "...###...", "...###..."],
      },
      {
        id: "laberinto",
        nombre: "Laberinto",
        patron: [
          "#########",
          "#.......#",
          "#.#####.#",
          "#.#...#.#",
          "#.#####.#",
          "#.......#",
          "#########",
        ],
      },
    ],
  },
];

/* --------------------------- máscara y utilidades --------------------- */

export interface MascaraFigura {
  cols: number;
  rows: number;
  /** true = celda jugable. */
  celdas: boolean[];
}

/** Convierte el arte ASCII en una máscara booleana. */
export function mascaraDe(figura: FiguraDef): MascaraFigura {
  const rows = figura.patron.length;
  const cols = Math.max(...figura.patron.map((f) => f.length));
  const celdas = new Array<boolean>(cols * rows).fill(false);
  figura.patron.forEach((fila, y) => {
    for (let x = 0; x < cols; x++) {
      if (fila[x] && fila[x] !== "." && fila[x] !== " ") celdas[y * cols + x] = true;
    }
  });
  return { cols, rows, celdas };
}

/** Número de celdas jugables. */
export function tamanoFigura(figura: FiguraDef): number {
  return mascaraDe(figura).celdas.filter(Boolean).length;
}

/* ------------------------- teselado de la silueta --------------------- */

const GRANDES: IngredienteId[] = ["arroz", "karaage"];
const MEDIANAS: IngredienteId[] = ["onigiri", "tempura", "salmon"];
const DOBLES: IngredienteId[] = ["tamagoyaki", "edamame", "takuan"];
const UNITARIAS: IngredienteId[] = ["brocoli", "cherry", "maki", "zanahoria", "umeboshi"];

interface Candidata {
  ing: IngredienteId;
  rot: number;
  celdas: Celda[];
}

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

function barajar<T>(r: () => number, lista: T[]): T[] {
  const a = [...lista];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Rellena la silueta con piezas reales. Devuelve posiciones ABSOLUTAS.
 * Siempre encuentra solución porque existen piezas de una sola celda.
 */
export function teselarFigura(
  mascara: MascaraFigura,
  azar: () => number,
): PiezaNivel[] | null {
  const { cols, rows, celdas } = mascara;
  const libre = [...celdas]; // true = queda por rellenar
  const salida: PiezaNivel[] = [];
  const catalogo: Candidata[] = [
    ...barajar(azar, GRANDES),
    ...barajar(azar, MEDIANAS),
    ...barajar(azar, DOBLES),
    ...barajar(azar, UNITARIAS),
  ].flatMap(orientaciones);

  let nodos = 0;
  const LIMITE = 250_000;

  const paso = (restantes: number): boolean => {
    if (restantes === 0) return true;
    if (++nodos > LIMITE) return false;
    const i = libre.indexOf(true);
    const ax = i % cols;
    const ay = Math.floor(i / cols);

    for (const cand of catalogo) {
      // La primera celda de la forma debe caer justo en el hueco.
      const [px, py] = cand.celdas[0];
      const ox = ax - px;
      const oy = ay - py;
      let cabe = true;
      for (const [cx, cy] of cand.celdas) {
        const x = ox + cx;
        const y = oy + cy;
        if (x < 0 || y < 0 || x >= cols || y >= rows || !libre[y * cols + x]) {
          cabe = false;
          break;
        }
      }
      if (!cabe) continue;
      cand.celdas.forEach(([cx, cy]) => (libre[(oy + cy) * cols + ox + cx] = false));
      salida.push({ ing: cand.ing, rot: cand.rot, ox, oy });
      if (paso(restantes - cand.celdas.length)) return true;
      salida.pop();
      cand.celdas.forEach(([cx, cy]) => (libre[(oy + cy) * cols + ox + cx] = true));
    }
    return false;
  };

  return paso(celdas.filter(Boolean).length) ? salida : null;
}

/* ------------------------- construcción del nivel --------------------- */

/** Semilla estable a partir del id: la misma figura sale siempre igual. */
function semillaDe(texto: string): number {
  let h = 2166136261;
  for (let i = 0; i < texto.length; i++) {
    h ^= texto.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function pedidoDeFigura(piezas: PiezaNivel[], azar: () => number): PedidoItem[] {
  const cuenta = new Map<IngredienteId, number>();
  piezas.forEach((p) => cuenta.set(p.ing, (cuenta.get(p.ing) ?? 0) + 1));
  const lista = [...cuenta.entries()];
  if (!lista.length) return [];
  const [id, n] = lista[Math.floor(azar() * lista.length)];
  const pedido: PedidoItem[] = [
    { tipo: "ingrediente", id, n: Math.min(n, 1 + Math.floor(azar() * 2)) },
  ];
  const colores = [...new Set(piezas.flatMap((p) => INGREDIENTES[p.ing].colores))];
  if (colores.length) {
    pedido.push({ tipo: "color", color: colores[Math.floor(azar() * colores.length)], n: 1 });
  }
  return pedido;
}

/** Caché: teselar una silueta cuesta trabajo, se hace una sola vez. */
const cacheFiguras = new Map<string, NivelDef>();

/** Índice plano de todas las figuras, en orden de tema. */
export const FIGURAS: { figura: FiguraDef; tema: TemaFiguras }[] = TEMAS_FIGURAS.flatMap(
  (tema) => tema.figuras.map((figura) => ({ figura, tema })),
);

export const TOTAL_FIGURAS = FIGURAS.length;

/** Busca la definición de una figura por su id. */
export function figuraDef(id: string): FiguraDef | undefined {
  return FIGURAS.find((f) => f.figura.id === id)?.figura;
}

/**
 * Construye el nivel jugable de una figura: máscara, piezas y pedido.
 * Se memoriza, así que abrir la carta de figuras no cuesta nada.
 */
export function nivelDeFigura(id: string): NivelDef | null {
  const enCache = cacheFiguras.get(id);
  if (enCache) return enCache;

  const entrada = FIGURAS.find((f) => f.figura.id === id);
  if (!entrada) return null;
  const { figura, tema } = entrada;
  const mascara = mascaraDe(figura);

  // Varias semillas por si una combinación concreta se atasca.
  let piezas: PiezaNivel[] | null = null;
  for (let intento = 0; intento < 8 && !piezas; intento++) {
    piezas = teselarFigura(mascara, mulberry32(semillaDe(id) + intento * 7919));
  }
  if (!piezas) return null;

  const azar = mulberry32(semillaDe(id) + 101);
  const nivel: NivelDef = {
    id: 9000 + FIGURAS.findIndex((f) => f.figura.id === id),
    nombre: figura.nombre,
    subtitulo: tema.titulo,
    cols: mascara.cols,
    rows: mascara.rows,
    compartimentos: [],
    pedido: pedidoDeFigura(piezas, azar),
    tiempo: Math.max(60, mascara.celdas.filter(Boolean).length * 6),
    pistas: 3,
    mascara: mascara.celdas,
    piezasFigura: piezas,
    figura: { id, tema: tema.id },
  };
  cacheFiguras.set(id, nivel);
  return nivel;
}
