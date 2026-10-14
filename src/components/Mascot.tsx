/**
 * Mascot — «Mochi», el RATÓN chef.
 * Dibujado en SVG y reactivo en vivo: orejas grandes, dientecito,
 * cola con lazo, parpadeo natural, celebración y preocupación.
 */
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

export type Humor = "neutro" | "feliz" | "preocupado" | "celebrando";

interface Props {
  humor: Humor;
  size?: number;
  className?: string;
}

export function Mascot({ humor, size = 96, className }: Props) {
  const reduce = useReducedMotion();
  const [parpado, setParpado] = useState(false);

  // Parpadeo natural: intervalos ligeramente aleatorios.
  useEffect(() => {
    let t1: number, t2: number;
    const ciclo = () => {
      t1 = window.setTimeout(() => {
        setParpado(true);
        t2 = window.setTimeout(() => setParpado(false), 140);
        ciclo();
      }, 2200 + Math.random() * 2400);
    };
    ciclo();
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  const ojosCerrados = parpado || humor === "feliz" || humor === "celebrando";

  const animacion = reduce
    ? {}
    : humor === "celebrando"
      ? { y: [0, -12, 0], rotate: [0, -5, 5, 0] }
      : humor === "preocupado"
        ? { x: [0, -1.5, 1.5, 0] }
        : { y: [0, -3.5, 0] };
  const transicion = reduce
    ? { duration: 0 }
    : humor === "celebrando"
      ? { duration: 0.7, repeat: Infinity, ease: "easeInOut" as const }
      : { duration: 2.8, repeat: Infinity, ease: "easeInOut" as const };

  return (
    <motion.svg
      viewBox="0 0 120 124"
      width={size}
      height={(size * 124) / 120}
      className={className}
      animate={animacion}
      transition={transicion}
      role="img"
      aria-label="Mochi, el ratón chef"
    >
      {/* cola con lazo, por detrás del cuerpo */}
      <path
        d="M 22 112 C 2 112 -2 92 12 86"
        stroke="#c9b3a2"
        strokeWidth={7}
        strokeLinecap="round"
        fill="none"
      />
      <circle cx={12} cy={86} r={4.5} fill="#e8a0b4" />

      {/* orejas grandes de ratón */}
      <circle cx={29} cy={26} r={18} fill="#e4d6c6" stroke="#c3ad96" strokeWidth={2.5} />
      <circle cx={91} cy={26} r={18} fill="#e4d6c6" stroke="#c3ad96" strokeWidth={2.5} />
      <circle cx={30} cy={27} r={10.5} fill="#f3b8c4" />
      <circle cx={90} cy={27} r={10.5} fill="#f3b8c4" />

      {/* cuerpo-cabeza redondito */}
      <ellipse cx={60} cy={72} rx={41} ry={44} fill="#f4ece1" stroke="#d9c8b2" strokeWidth={3} />

      {/* hachimaki roja */}
      <path d="M 22 46 Q 60 32 98 46 L 98 55 Q 60 41 22 55 Z" fill="#c0392b" />
      <circle cx={60} cy={41.5} r={5.5} fill="#f7f1e3" />

      {/* hocico claro */}
      <ellipse cx={60} cy={80} rx={17} ry={13} fill="#faf3e7" />

      {/* bigotes: seis hilos finos */}
      <g stroke="#cbb8a0" strokeWidth={2.2} strokeLinecap="round">
        <path d="M 30 74 q -12 -4 -20 -8" />
        <path d="M 30 80 q -13 0 -22 2" />
        <path d="M 30 86 q -11 4 -18 9" />
        <path d="M 90 74 q 12 -4 20 -8" />
        <path d="M 90 80 q 13 0 22 2" />
        <path d="M 90 86 q 11 4 18 9" />
      </g>

      {/* ojos según humor */}
      {ojosCerrados ? (
        <g stroke="#3a332b" strokeWidth={3.4} strokeLinecap="round" fill="none">
          <path d="M 38 63 q 7 7 14 0" />
          <path d="M 68 63 q 7 7 14 0" />
        </g>
      ) : humor === "preocupado" ? (
        <g>
          <ellipse cx={45} cy={63} rx={5} ry={6.5} fill="#3a332b" />
          <ellipse cx={75} cy={63} rx={5} ry={6.5} fill="#3a332b" />
          <path d="M 37 53 q 8 -5 14 -2" stroke="#a08d72" strokeWidth={2.6} fill="none" strokeLinecap="round" />
          <path d="M 83 53 q -8 -5 -14 -2" stroke="#a08d72" strokeWidth={2.6} fill="none" strokeLinecap="round" />
        </g>
      ) : (
        <g>
          <ellipse cx={45} cy={63} rx={5.2} ry={6.8} fill="#3a332b" />
          <ellipse cx={75} cy={63} rx={5.2} ry={6.8} fill="#3a332b" />
          <circle cx={47} cy={60.5} r={1.8} fill="#fff" />
          <circle cx={77} cy={60.5} r={1.8} fill="#fff" />
        </g>
      )}

      {/* nariz rosa con brillo */}
      <circle cx={60} cy={74} r={4.6} fill="#e58e96" />
      <circle cx={58.4} cy={72.4} r={1.4} fill="#f7c3c8" />

      {/* boca + dientecito de ratón */}
      {humor === "celebrando" ? (
        <g>
          <path d="M 52 81 q 8 10 16 0 q -2 12 -8 12 q -6 0 -8 -12 Z" fill="#c96f6f" stroke="#3a332b" strokeWidth={2.4} strokeLinejoin="round" />
          <rect x={57.2} y={81.5} width={5.6} height={5} rx={1.4} fill="#ffffff" stroke="#d8cfc0" strokeWidth={1} />
        </g>
      ) : humor === "preocupado" ? (
        <g>
          <path d="M 53 85 q 3.5 -3.5 7 0 q 3.5 3.5 7 0" stroke="#3a332b" strokeWidth={2.6} fill="none" strokeLinecap="round" />
          <rect x={57.4} y={86} width={5.2} height={4.4} rx={1.3} fill="#ffffff" stroke="#d8cfc0" strokeWidth={1} opacity={0.85} />
        </g>
      ) : (
        <g>
          <path d="M 54 82 q 3 3.5 6 3.5 q 3 0 6 -3.5" stroke="#3a332b" strokeWidth={2.6} fill="none" strokeLinecap="round" />
          <rect x={57.4} y={85} width={5.2} height={4.8} rx={1.3} fill="#ffffff" stroke="#d8cfc0" strokeWidth={1} />
        </g>
      )}

      {/* rubor */}
      <ellipse cx={35} cy={76} rx={6.5} ry={3.6} fill="#f3b8c4" opacity={0.7} />
      <ellipse cx={85} cy={76} rx={6.5} ry={3.6} fill="#f3b8c4" opacity={0.7} />

      {/* delantal de chef */}
      <path d="M 40 105 Q 60 97 80 105 L 78 122 L 42 122 Z" fill="#f2ead8" stroke="#dcc9a4" strokeWidth={2.5} />
      <path d="M 50 113 h 20" stroke="#dcc9a4" strokeWidth={2.5} strokeLinecap="round" />

      {/* patitas: arriba al celebrar */}
      {humor === "celebrando" ? (
        <g fill="#f4ece1" stroke="#d9c8b2" strokeWidth={2.5}>
          <circle cx={15} cy={50} r={9} />
          <circle cx={105} cy={50} r={9} />
        </g>
      ) : (
        <g fill="#f4ece1" stroke="#d9c8b2" strokeWidth={2.5}>
          <ellipse cx={30} cy={113} rx={10} ry={7} />
          <ellipse cx={90} cy={113} rx={10} ry={7} />
        </g>
      )}
    </motion.svg>
  );
}
