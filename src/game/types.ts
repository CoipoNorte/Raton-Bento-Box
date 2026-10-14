/**
 * types.ts — Tipos centrales de Bento Box Master.
 * Piezas (poliominós), cajas, compartimentos, pedidos y resultados.
 */

/** Los cinco colores sagrados del bento (goshiki). */
export type ColorGoshiki = "blanco" | "rojo" | "amarillo" | "verde" | "negro";

/** Orden fijo para pintar el medidor de colores. */
export const ORDEN_GOSHIKI: ColorGoshiki[] = [
  "rojo",
  "amarillo",
  "verde",
  "blanco",
  "negro",
];

/** Una celda como coordenada [x, y] (x → derecha, y → abajo). */
export type Celda = [number, number];

/** Identificadores de ingredientes disponibles en el catálogo. */
export type IngredienteId =
  | "arroz"
  | "onigiri"
  | "tamagoyaki"
  | "salmon"
  | "karaage"
  | "tempura"
  | "brocoli"
  | "cherry"
  | "edamame"
  | "maki"
  | "takuan"
  | "zanahoria"
  | "umeboshi";

/** Familia de sonido ASMR de cada ingrediente. */
export type TipoSonido = "granular" | "crujiente" | "pop" | "blando";

/** Definición estática de un ingrediente (catálogo). */
export interface Ingrediente {
  id: IngredienteId;
  nombre: string;
  /** Forma base (rotación 0) como lista de celdas normalizadas. */
  forma: Celda[];
  /** Colores goshiki que aporta al medidor. */
  colores: ColorGoshiki[];
  /** Color principal para HUD / tarjetas. */
  colorPrincipal: string;
  sonido: TipoSonido;
}

/** Pieza instanciada en un nivel (vive en la bandeja o en la caja). */
export interface PiezaInst {
  uid: string;
  ingrediente: IngredienteId;
  rotacion: number; // 0..3, pasos de 90°
  /** Posición anclada en la caja; null si está en la bandeja. */
  x: number | null;
  y: number | null;
}

/** Pieza colocada en la solución de un nivel (para pistas). */
export interface PiezaNivel {
  ing: IngredienteId;
  rot: number;
  /** Desplazamiento dentro del compartimento. */
  ox: number;
  oy: number;
}

/** Compartimento rectangular de la caja. */
export interface CompartimentoDef {
  x: number;
  y: number;
  w: number;
  h: number;
  piezas: PiezaNivel[];
}

/** Requisito del pedido del cliente (se muestra con iconos). */
export type PedidoItem =
  | { tipo: "ingrediente"; id: IngredienteId; n: number }
  | { tipo: "color"; color: ColorGoshiki; n: number };

/** Definición de un nivel. */
export interface NivelDef {
  id: number;
  nombre: string;
  subtitulo: string;
  cols: number;
  rows: number;
  compartimentos: CompartimentoDef[];
  pedido: PedidoItem[];
  /** Segundos para el modo «Servicio del día». */
  tiempo: number;
  /** Pistas disponibles en este nivel. */
  pistas: number;
}

/** Resultado al cerrar el bento. */
export interface Resultado {
  puntos: number;
  estrellas: 1 | 2 | 3;
  bonusSinHuecos: number;
  bonusGoshiki: number;
  bonusElegancia: number;
  bonusCombo: number;
  perfectos: number;
}

/** Estado de progreso persistido. */
export interface Progreso {
  estrellas: Record<number, number>;
  nivelMax: number;
  puntosTotales: number;
  /** Récords del modo Carrera. */
  mejorRondaCarrera: number;
  mejorPuntosCarrera: number;
}

/** Modos de juego disponibles. */
export type ModoJuego = "zen" | "servicio" | "carrera";

/** Preferencias de sonido y modo. */
export interface Preferencias {
  sonido: boolean;
  ambiente: boolean;
  modo: "zen" | "servicio";
}
