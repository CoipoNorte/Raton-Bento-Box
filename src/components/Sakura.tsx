/**
 * Sakura — Lluvia de pétalos de cerezo.
 * Determinista por semilla, respeta prefers-reduced-motion reduciendo
 * la cantidad a un par de pétalos casi estáticos.
 */
import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";

interface Props {
  cantidad?: number;
  className?: string;
}

const TONOS = ["#f6c6d4", "#f2aec2", "#fbe3ea", "#ef9fb8"];

/** Generador pseudoaleatorio con semilla (estable entre renders). */
function mulberry32(semilla: number) {
  return () => {
    semilla |= 0;
    semilla = (semilla + 0x6d2b79f5) | 0;
    let t = Math.imul(semilla ^ (semilla >>> 15), 1 | semilla);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function Sakura({ cantidad = 26, className }: Props) {
  const reduce = useReducedMotion();
  const petalos = useMemo(() => {
    const n = reduce ? Math.min(4, cantidad) : cantidad;
    const rand = mulberry32(20250405);
    return Array.from({ length: n }, (_, i) => ({
      id: i,
      x: rand() * 100,
      retardo: rand() * 6,
      duracion: reduce ? 26 : 7 + rand() * 7,
      tam: 10 + rand() * 14,
      tono: TONOS[Math.floor(rand() * TONOS.length)],
      vaiven: 24 + rand() * 40,
      giro: 180 + rand() * 340,
    }));
  }, [cantidad, reduce]);

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ""}`} aria-hidden="true">
      {petalos.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{ left: `${p.x}%`, top: -30 }}
          animate={
            reduce
              ? { y: "18vh", opacity: [0, 0.8, 0] }
              : {
                  y: ["0vh", "112vh"],
                  x: [0, p.vaiven, -p.vaiven * 0.6, p.vaiven * 0.4],
                  rotate: [0, p.giro],
                  opacity: [0, 1, 1, 0.9],
                }
          }
          transition={{
            duration: p.duracion,
            delay: p.retardo,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <svg width={p.tam} height={p.tam} viewBox="0 0 20 20">
            <path
              d="M10 1 C14 4 18 7 17 12 C16 17 12 19 10 19 C8 19 4 17 3 12 C2 7 6 4 10 1 Z"
              fill={p.tono}
              opacity={0.92}
            />
            <path d="M10 3 L10 17" stroke="#e58aa8" strokeWidth={0.8} opacity={0.6} />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}
