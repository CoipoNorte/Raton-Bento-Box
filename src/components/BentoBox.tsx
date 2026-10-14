/**
 * BentoBox — La caja bento: SIEMPRE el elemento más grande de la pantalla.
 * Rejilla con compartimentos, piezas colocadas (spring + squash),
 * fantasma translúcido verde/rojo, pistas y destellos dorados.
 *
 * Su tamaño sale de `medidasCaja`, la misma función que usa GameScreen
 * para elegir la celda: así la caja NUNCA se sale de su recuadro.
 */
import { AnimatePresence, motion, useAnimationControls, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";
import { medidasCaja } from "../game/layout";
import { celdasDe, celdasEn } from "../game/logic";
import type { ModeloCaja } from "../game/logic";
import type { Celda, PiezaInst } from "../game/types";
import { FoodSVG } from "./FoodSVG";

export interface Fantasma {
  uid: string;
  x: number;
  y: number;
  valido: boolean;
}

export interface Destello {
  comp: number;
  ev: number; // contador que re-dispara la animación
}

interface Props {
  modelo: ModeloCaja;
  piezas: PiezaInst[];
  celda: number;
  fantasma: Fantasma | null;
  pista: Celda[] | null;
  destellos: Destello[];
  /** Se incrementa para sacudir suavemente la caja (movimiento inválido). */
  sacudidas: number;
  tableroRef: React.RefObject<HTMLDivElement | null>;
  onQuitar: (uid: string) => void;
}

/** Tonos de papel alternos por compartimento (separadores visibles). */
const TINTES = ["#f5eeda", "#efe6cf", "#f2ead6", "#ece2c8"];

export function BentoBox({
  modelo,
  piezas,
  celda,
  fantasma,
  pista,
  destellos,
  sacudidas,
  tableroRef,
  onQuitar,
}: Props) {
  const reduce = useReducedMotion();
  const controles = useAnimationControls();
  const primeraSacudida = useRef(true);

  // Sacudida suave al fallar: avisa sin castigar.
  useEffect(() => {
    if (primeraSacudida.current) {
      primeraSacudida.current = false;
      return;
    }
    void controles.start({ x: [0, -7, 7, -4, 4, 0], transition: { duration: 0.35 } });
  }, [sacudidas, controles]);

  const { borde, margen, ancho, alto } = medidasCaja(celda, modelo.cols, modelo.rows);
  const radioMarco = Math.round(celda * 0.34) + borde;
  const radioCubeta = Math.max(8, Math.round(celda * 0.2));

  const piezasColocadas = piezas.filter((p) => p.x !== null && p.y !== null);
  const piezaFantasma = fantasma ? piezas.find((p) => p.uid === fantasma.uid) : undefined;
  const celdasFantasma: Celda[] =
    fantasma && piezaFantasma ? celdasEn(piezaFantasma, fantasma.x, fantasma.y) : [];

  return (
    <motion.div
      animate={controles}
      className="relative shrink-0 select-none"
      style={{ width: ancho, height: alto }}
    >
      {/* Marco de laca */}
      <div
        className="h-full w-full shadow-[0_18px_40px_-12px_rgba(60,20,10,0.45),inset_0_2px_0_rgba(255,255,255,0.15)]"
        style={{
          padding: borde,
          borderRadius: radioMarco,
          background: "linear-gradient(160deg, #7c241d 0%, #a03127 45%, #6d1f18 100%)",
        }}
      >
        {/* Cubeta interior */}
        <div
          ref={tableroRef}
          className="relative h-full w-full shadow-[inset_0_3px_10px_rgba(80,50,20,0.25)]"
          style={{
            background: "#e6dcc4",
            padding: margen,
            borderRadius: radioCubeta,
          }}
        >
          {/* Compartimentos */}
          {modelo.rects.map((r, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                left: margen + r.x * celda + 2,
                top: margen + r.y * celda + 2,
                width: r.w * celda - 4,
                height: r.h * celda - 4,
                borderRadius: Math.max(5, Math.round(celda * 0.14)),
                background: TINTES[i % TINTES.length],
                boxShadow:
                  "inset 0 2px 6px rgba(120,90,40,0.22), inset 0 -1px 0 rgba(255,255,255,0.6), 0 1px 2px rgba(120,90,40,0.18)",
              }}
            />
          ))}

          {/* Destellos dorados al completar compartimentos */}
          {destellos.map((d) => {
            const r = modelo.rects[d.comp];
            if (!r) return null;
            return (
              <motion.div
                key={`${d.comp}-${d.ev}`}
                className="pointer-events-none absolute rounded-[10px]"
                style={{
                  left: margen + r.x * celda,
                  top: margen + r.y * celda,
                  width: r.w * celda,
                  height: r.h * celda,
                  background:
                    "radial-gradient(circle, rgba(255,214,110,0.95) 0%, rgba(255,190,60,0.35) 60%, transparent 100%)",
                }}
                initial={{ opacity: 0.9, scale: 0.7 }}
                animate={{ opacity: 0, scale: 1.25 }}
                transition={{ duration: reduce ? 0.01 : 0.9, ease: "easeOut" }}
              />
            );
          })}

          {/* Fantasma de encaje */}
          {celdasFantasma.map(([x, y], i) => (
            <div
              key={`f${i}`}
              className="pointer-events-none absolute"
              style={{
                left: margen + x * celda + 2,
                top: margen + y * celda + 2,
                width: celda - 4,
                height: celda - 4,
                borderRadius: Math.max(5, Math.round(celda * 0.14)),
                background: fantasma?.valido ? "rgba(110,190,115,0.45)" : "rgba(224,90,90,0.45)",
                border: `2.5px dashed ${fantasma?.valido ? "#3f9e4d" : "#c23a3a"}`,
              }}
            />
          ))}

          {/* Pista: hueco sugerido */}
          {pista?.map(([x, y], i) => (
            <motion.div
              key={`pi${i}`}
              className="pointer-events-none absolute"
              style={{
                left: margen + x * celda + 2,
                top: margen + y * celda + 2,
                width: celda - 4,
                height: celda - 4,
                borderRadius: Math.max(5, Math.round(celda * 0.14)),
                border: "3px solid #f2a93b",
                background: "rgba(242,169,59,0.22)",
              }}
              animate={reduce ? {} : { opacity: [0.35, 1, 0.35] }}
              transition={{ duration: 1.1, repeat: Infinity }}
            />
          ))}

          {/* Piezas colocadas: entran con muelle y salen con pop */}
          <AnimatePresence>
            {piezasColocadas.map((p) => {
              const celdas = celdasDe(p);
              const bw = Math.max(...celdas.map(([x]) => x)) + 1;
              const bh = Math.max(...celdas.map(([, y]) => y)) + 1;
              return (
                <motion.div
                  key={p.uid}
                  className="absolute cursor-pointer"
                  style={{
                    left: margen + (p.x ?? 0) * celda,
                    top: margen + (p.y ?? 0) * celda,
                    width: bw * celda,
                    height: bh * celda,
                    zIndex: 5,
                    touchAction: "manipulation",
                  }}
                  initial={{ scale: reduce ? 1 : 0.35, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: reduce ? 1 : 0.2, opacity: 0, y: -12 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 520, damping: 15 }}
                  onTap={() => onQuitar(p.uid)}
                  title="Tocar para devolver a la bandeja"
                >
                  <FoodSVG id={p.ingrediente} celda={celda} rotacion={p.rotacion} />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
