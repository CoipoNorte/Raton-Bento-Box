/**
 * PieceTray — La tabla de preparación.
 * Sin `drag` de Framer: gesto propio (useTapSinArrastre) donde el SCROLL
 * NATIVO manda a lo largo del eje de la bandeja y el arrastre nace al
 * moverse hacia la caja. Tocar sin arrastrar rota (rotación animada).
 *
 * Cada pieza se ESCALA para caber en un slot uniforme: una pieza de 3
 * celdas nunca deforma la bandeja ni se sale de su recuadro.
 */
import { motion } from "framer-motion";
import { useLayoutEffect, useRef, useState } from "react";
import { celdasDe } from "../game/logic";
import type { PiezaInst } from "../game/types";
import { useTapSinArrastre } from "../hooks/useTapSinArrastre";
import type { Punto } from "../hooks/useTapSinArrastre";
import { FoodSVG } from "./FoodSVG";

export type { Punto };

interface Props {
  piezas: PiezaInst[]; // solo las que están en la bandeja
  /** Tamaño de celda de referencia para la bandeja. */
  celda: number;
  /** true: columna (escritorio); false: fila deslizable (móvil vertical). */
  vertical: boolean;
  seleccionada: string | null;
  pistaUid: string | null;
  /** Pieza que viaja en el overlay de arrastre (se atenúa en su casilla). */
  arrastrandoUid?: string | null;
  /** true congela la bandeja (tutorial, pausa, resultados). */
  bloqueado?: boolean;
  onIniciarArrastre: (uid: string, punto: Punto) => void;
  onMoverArrastre: (punto: Punto) => void;
  onSoltarArrastre: (punto: Punto) => void;
  onCancelarArrastre: () => void;
  onTapPieza: (uid: string) => void;
}

/** Lado máximo de un slot, en múltiplos de celda: mantiene la fila regular. */
const EXTENSION_MAX = 2.4;

export function PieceTray({
  piezas,
  celda,
  vertical,
  seleccionada,
  pistaUid,
  arrastrandoUid = null,
  bloqueado = false,
  onIniciarArrastre,
  onMoverArrastre,
  onSoltarArrastre,
  onCancelarArrastre,
  onTapPieza,
}: Props) {
  const { bajar } = useTapSinArrastre({
    ejeBandeja: vertical ? "y" : "x",
    umbral: 8,
    alIniciarArrastre: onIniciarArrastre,
    alMover: onMoverArrastre,
    alSoltar: onSoltarArrastre,
    alCancelar: onCancelarArrastre,
    alTap: onTapPieza,
  });

  // Slot cuadrado y uniforme: la bandeja se ve ordenada en cualquier tamaño.
  const relleno = Math.max(8, Math.round(celda * 0.26));
  const slot = Math.round(celda * EXTENSION_MAX) + relleno;

  // ¿La bandeja desborda? Si NO hay scroll que proteger, el dedo queda
  // libre para arrastrar en cualquier dirección (touch-action: none).
  const contenedorRef = useRef<HTMLDivElement | null>(null);
  const [desplazable, setDesplazable] = useState(false);
  useLayoutEffect(() => {
    const el = contenedorRef.current;
    if (!el) return;
    const medir = () => {
      const sobra = vertical
        ? el.scrollHeight - el.clientHeight
        : el.scrollWidth - el.clientWidth;
      setDesplazable(sobra > 4);
    };
    medir();
    const obs = new ResizeObserver(medir);
    obs.observe(el);
    return () => obs.disconnect();
  }, [vertical, piezas.length, celda]);

  const accionTactil = bloqueado ? "none" : !desplazable ? "none" : vertical ? "pan-y" : "pan-x";

  return (
    <div
      ref={contenedorRef}
      className={
        vertical
          ? "flex h-full w-full flex-col items-center gap-2 overflow-x-hidden overflow-y-auto p-2 [scrollbar-width:thin]"
          : "flex h-full w-full flex-row items-center gap-2 overflow-x-auto overflow-y-hidden p-2 [scrollbar-width:thin]"
      }
      style={{ WebkitOverflowScrolling: "touch" }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {piezas.map((p) => {
        const celdas = celdasDe(p);
        const bw = Math.max(...celdas.map(([x]) => x)) + 1;
        const bh = Math.max(...celdas.map(([, y]) => y)) + 1;
        // Escala para que la pieza quepa entera en el slot.
        const celdaPieza = Math.floor(
          Math.min(celda, (celda * EXTENSION_MAX) / Math.max(bw, bh)),
        );
        const enVuelo = arrastrandoUid === p.uid;
        return (
          <motion.div
            key={p.uid}
            data-pieza={p.uid}
            className="relative flex shrink-0 cursor-grab items-center justify-center rounded-2xl select-none active:cursor-grabbing"
            style={{
              width: slot,
              height: slot,
              background: "rgba(255,252,244,0.85)",
              border:
                seleccionada === p.uid
                  ? "2.5px solid #d97706"
                  : "2px solid rgba(150,120,70,0.25)",
              boxShadow: "0 3px 8px rgba(90,60,20,0.12)",
              // El eje de la bandeja se lo dejamos al scroll nativo…
              // salvo que no haya nada que desplazar.
              touchAction: accionTactil,
              opacity: enVuelo ? 0.25 : 1,
            }}
            animate={{ scale: enVuelo ? 0.92 : 1 }}
            transition={{ type: "spring", stiffness: 420, damping: 24 }}
            whileHover={bloqueado ? {} : { scale: 1.04 }}
            onPointerDown={bloqueado ? undefined : (e) => bajar(p.uid, e)}
            title="Arrastrar hacia la caja · Tocar para rotar"
          >
            {/* La rotación se ve animada gracias a este envoltorio */}
            <motion.div
              data-comida={p.uid}
              className="flex items-center justify-center"
              animate={{ rotate: p.rotacion * 90 }}
              transition={{ type: "spring", stiffness: 380, damping: 22 }}
            >
              <motion.div
                animate={pistaUid === p.uid ? { scale: [1, 1.12, 1] } : { scale: 1 }}
                transition={
                  pistaUid === p.uid ? { duration: 0.9, repeat: Infinity } : { duration: 0.2 }
                }
              >
                <FoodSVG id={p.ingrediente} celda={celdaPieza} />
              </motion.div>
            </motion.div>
          </motion.div>
        );
      })}
      {piezas.length === 0 && (
        <div className="flex h-full w-full min-w-24 items-center justify-center p-2 text-center text-[11px] leading-tight font-semibold text-[#9c8a68]">
          Bandeja vacía… ¡orden perfecto!
        </div>
      )}
    </div>
  );
}
