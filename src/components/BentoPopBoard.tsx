/**
 * BentoPopBoard — La caja que crece (2×2 → 8×8).
 * Dibuja la rejilla de la talla actual, el cuadro dorado central,
 * el fantasma de colocación y el destello al servir.
 */
import { motion } from "framer-motion";
import type { RefObject } from "react";
import { celdasPiezaPop, zonaEspecial } from "../game/bentoPop";
import type { PiezaPop, TableroPop } from "../game/bentoPop";
import { FoodCellSVG } from "./FoodCellSVG";

export interface FantasmaPop {
  pieza: PiezaPop;
  x: number;
  y: number;
  valido: boolean;
}

interface Props {
  tablero: TableroPop;
  celda: number;
  tableroRef: RefObject<HTMLDivElement | null>;
  fantasma: FantasmaPop | null;
  teclado: FantasmaPop | null;
  destello: { indices: number[]; evento: number } | null;
}

export const HUECO_POP = 2;
export const margenPop = (celda: number) => Math.max(5, Math.round(celda * 0.1));
export const bordePop = (celda: number) => Math.max(10, Math.round(celda * 0.22));

/** Lado total que ocupa la caja, marco incluido: única fuente de verdad. */
export function ladoCajaPop(celda: number, tam: number): number {
  const interior = tam * celda + (tam - 1) * HUECO_POP + 2 * margenPop(celda);
  return interior + 2 * bordePop(celda);
}

export function BentoPopBoard({
  tablero,
  celda,
  tableroRef,
  fantasma,
  teclado,
  destello,
}: Props) {
  const { tam, celdas } = tablero;
  const borde = bordePop(celda);
  const margen = margenPop(celda);
  const interior = tam * celda + (tam - 1) * HUECO_POP + margen * 2;

  const centro = zonaEspecial(tam);
  const esEspecial = (x: number, y: number) =>
    centro.some(([zx, zy]) => zx === x && zy === y);

  const activo = fantasma ?? teclado;
  const indicesFantasma = new Set<number>();
  if (activo) {
    celdasPiezaPop(activo.pieza).forEach(([dx, dy]) => {
      const x = activo.x + dx;
      const y = activo.y + dy;
      if (x >= 0 && y >= 0 && x < tam && y < tam) indicesFantasma.add(y * tam + x);
    });
  }
  const destellos = new Set(destello?.indices ?? []);

  return (
    <motion.div
      className="shrink-0 rounded-[26px] shadow-[0_18px_40px_-12px_rgba(60,20,10,.45)]"
      style={{ padding: borde, background: "linear-gradient(155deg,#a4382c,#711f19)" }}
      // Al crecer la caja, un rebote celebra la ampliación.
      key={tam}
      initial={{ scale: 0.82 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
    >
      <div
        ref={tableroRef}
        className="relative grid rounded-[14px] bg-[#e4d7bd] shadow-inner"
        style={{
          width: interior,
          height: interior,
          gridTemplateColumns: `repeat(${tam}, ${celda}px)`,
          gridTemplateRows: `repeat(${tam}, ${celda}px)`,
          gap: HUECO_POP,
          padding: margen,
          touchAction: "none",
        }}
      >
        {celdas.map((ocupada, i) => {
          const x = i % tam;
          const y = Math.floor(i / tam);
          const ghost = indicesFantasma.has(i);
          const dorada = esEspecial(x, y);
          return (
            <div
              key={i}
              className="relative flex items-center justify-center overflow-hidden"
              style={{
                width: celda,
                height: celda,
                borderRadius: Math.max(5, celda * 0.14),
                background: dorada ? "#f4df9a" : "#f3ead7",
                boxShadow: dorada
                  ? "inset 0 0 0 2px rgba(190,137,27,.45), inset 0 2px 5px rgba(100,70,20,.12)"
                  : "inset 0 2px 5px rgba(100,70,20,.13)",
              }}
            >
              {ocupada && (
                <motion.div
                  initial={{ scale: 0.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 16 }}
                >
                  <FoodCellSVG id={ocupada.ingrediente} size={celda - 3} />
                </motion.div>
              )}
              {ghost && (
                <div
                  className="pointer-events-none absolute inset-[2px]"
                  style={{
                    borderRadius: Math.max(4, celda * 0.12),
                    background: activo?.valido
                      ? "rgba(72,170,87,.42)"
                      : "rgba(210,66,66,.42)",
                    border: `2px dashed ${activo?.valido ? "#3d9649" : "#bd3636"}`,
                  }}
                />
              )}
              {destellos.has(i) && (
                <motion.div
                  key={destello?.evento}
                  className="pointer-events-none absolute inset-0 bg-[#ffd86a]"
                  initial={{ opacity: 1, scale: 0.5 }}
                  animate={{ opacity: 0, scale: 1.3 }}
                  transition={{ duration: 0.75 }}
                />
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
