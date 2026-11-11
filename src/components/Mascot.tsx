/**
 * Mascot — «Mochi», el ratoncito chef. (｡•ᴗ•｡)
 *
 * Proporción chibi: cabeza grande, cuerpecito pequeño. Orejas redondas
 * siempre visibles, gorrito de chef ladeado, ojos enormes con doble
 * brillo, nariz de corazón, boquita «w», mejillas sonrojadas, colita en
 * espiral y patitas que amasan. Todo procedural en SVG.
 */
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

export type Humor = "neutro" | "feliz" | "preocupado" | "celebrando";

interface Props {
  humor: Humor;
  size?: number;
  className?: string;
}

const PELO_SOMBRA = "#e6d8c6";
const ROSA = "#f7bcca";
const ROSA_FUERTE = "#ef93ad";
const OSCURO = "#473c34";

export function Mascot({ humor, size = 96, className }: Props) {
  const reduce = useReducedMotion();
  const [parpado, setParpado] = useState(false);

  // Parpadeo natural con intervalos irregulares.
  useEffect(() => {
    let t1: number, t2: number;
    const ciclo = () => {
      t1 = window.setTimeout(
        () => {
          setParpado(true);
          t2 = window.setTimeout(() => setParpado(false), 130);
          ciclo();
        },
        2400 + Math.random() * 2600,
      );
    };
    ciclo();
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  const feliz = humor === "feliz" || humor === "celebrando";
  const ojosCerrados = parpado || feliz;

  const animCuerpo = reduce
    ? {}
    : humor === "celebrando"
      ? { y: [0, -10, 0], rotate: [0, -4, 4, 0] }
      : humor === "preocupado"
        ? { x: [0, -1.6, 1.6, 0] }
        : { y: [0, -3, 0] };

  const transCuerpo = reduce
    ? { duration: 0 }
    : humor === "celebrando"
      ? { duration: 0.65, repeat: Infinity, ease: "easeInOut" as const }
      : humor === "preocupado"
        ? { duration: 0.5, repeat: Infinity, ease: "easeInOut" as const }
        : { duration: 3, repeat: Infinity, ease: "easeInOut" as const };

  return (
    <motion.svg
      viewBox="0 0 132 140"
      width={size}
      height={(size * 140) / 132}
      className={className}
      animate={animCuerpo}
      transition={transCuerpo}
      role="img"
      aria-label="Mochi, el ratoncito chef"
      style={{ overflow: "visible" }}
    >
      <defs>
        <radialGradient id="mochiPelo" cx="38%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#fffdf8" />
          <stop offset="100%" stopColor="#f6ece0" />
        </radialGradient>
        <radialGradient id="mochiOreja" cx="50%" cy="42%" r="62%">
          <stop offset="0%" stopColor="#fdd9e2" />
          <stop offset="100%" stopColor={ROSA} />
        </radialGradient>
      </defs>

      {/* ---------- CUERPECITO (detrás de la cabeza) ---------- */}
      {/* Colita en espiral */}
      <motion.path
        d="M 96 120 C 116 124 124 108 112 102 C 104 98 100 106 105 110"
        stroke={PELO_SOMBRA}
        strokeWidth={5}
        strokeLinecap="round"
        fill="none"
        animate={reduce ? {} : { rotate: [0, 7, -7, 0] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "96px 120px" }}
      />
      <ellipse cx={66} cy={110} rx={30} ry={25} fill="url(#mochiPelo)" stroke={PELO_SOMBRA} strokeWidth={3} />

      {/* Piececitos, siempre abajo */}
      <g fill="url(#mochiPelo)" stroke={PELO_SOMBRA} strokeWidth={2.6}>
        <ellipse cx={53} cy={131} rx={10} ry={6.5} />
        <ellipse cx={79} cy={131} rx={10} ry={6.5} />
      </g>

      {/* Manitas: arriba al celebrar, amasando en reposo */}
      {humor === "celebrando" ? (
        <g fill="url(#mochiPelo)" stroke={PELO_SOMBRA} strokeWidth={2.6}>
          <motion.circle
            cx={24}
            cy={72}
            r={9.5}
            animate={reduce ? {} : { y: [0, -7, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
          <motion.circle
            cx={108}
            cy={72}
            r={9.5}
            animate={reduce ? {} : { y: [0, -7, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, delay: 0.25 }}
          />
        </g>
      ) : (
        <g fill="url(#mochiPelo)" stroke={PELO_SOMBRA} strokeWidth={2.6}>
          <motion.circle
            cx={36}
            cy={105}
            r={9}
            animate={reduce ? {} : { y: [0, -3.5, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.circle
            cx={96}
            cy={105}
            r={9}
            animate={reduce ? {} : { y: [0, -3.5, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
          />
        </g>
      )}

      {/* Delantal redondeado con bolsillo de corazón */}
      <path
        d="M 48 96 Q 66 90 84 96 Q 88 116 80 128 Q 66 134 52 128 Q 44 116 48 96 Z"
        fill="#fbf5e6"
        stroke="#e3d3ad"
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
      <path
        d="M 66 112 c -2.6 -3.4 -7.6 -2.6 -7.6 1.3 c 0 3 4.3 5.1 7.6 7.3 c 3.3 -2.2 7.6 -4.3 7.6 -7.3 c 0 -3.9 -5 -4.7 -7.6 -1.3 Z"
        fill={ROSA}
        opacity={0.75}
      />

      {/* ---------- OREJAS (visibles, nada las tapa) ---------- */}
      <motion.g
        animate={reduce ? {} : { rotate: feliz ? [-5, 5, -5] : [-1.5, 1.5, -1.5] }}
        transition={{ duration: feliz ? 0.8 : 3.4, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "26px 40px" }}
      >
        <circle cx={24} cy={34} r={19} fill="url(#mochiPelo)" stroke={PELO_SOMBRA} strokeWidth={3} />
        <circle cx={25} cy={35} r={11.5} fill="url(#mochiOreja)" />
      </motion.g>
      <motion.g
        animate={reduce ? {} : { rotate: feliz ? [5, -5, 5] : [1.5, -1.5, 1.5] }}
        transition={{ duration: feliz ? 0.8 : 3.4, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "106px 40px" }}
      >
        <circle cx={108} cy={34} r={19} fill="url(#mochiPelo)" stroke={PELO_SOMBRA} strokeWidth={3} />
        <circle cx={107} cy={35} r={11.5} fill="url(#mochiOreja)" />
      </motion.g>

      {/* ---------- CABEZA GRANDE ---------- */}
      <ellipse cx={66} cy={62} rx={41} ry={37} fill="url(#mochiPelo)" stroke={PELO_SOMBRA} strokeWidth={3} />

      {/* Gorrito de chef ladeado, apoyado entre las orejas */}
      <g transform="rotate(-9 66 28)">
        <path
          d="M 48 34 C 41 34 38 26 44 22 C 42 14 51 9 57 13 C 61 6 73 6 77 13 C 84 9 92 15 90 22 C 96 26 92 34 86 34 Z"
          fill="#fffdf7"
          stroke="#e4dac6"
          strokeWidth={2.5}
          strokeLinejoin="round"
        />
        <rect x={47} y={32} width={40} height={9} rx={4.5} fill="#c0392b" />
        <circle cx={67} cy={36.5} r={3.6} fill="#fdf6ea" />
      </g>

      {/* Hocico claro */}
      <ellipse cx={66} cy={74} rx={18} ry={13} fill="#fffdf9" />

      {/* Bigotes */}
      <g stroke="#dccab4" strokeWidth={2} strokeLinecap="round">
        <path d="M 34 66 q -12 -4 -21 -8" />
        <path d="M 34 73 q -13 1 -22 4" />
        <path d="M 98 66 q 12 -4 21 -8" />
        <path d="M 98 73 q 13 1 22 4" />
      </g>

      {/* ---------- OJOS ENORMES ---------- */}
      {ojosCerrados ? (
        <g stroke={OSCURO} strokeWidth={4} strokeLinecap="round" fill="none">
          <path d="M 42 60 q 8.5 -9.5 17 0" />
          <path d="M 73 60 q 8.5 -9.5 17 0" />
        </g>
      ) : humor === "preocupado" ? (
        <g>
          <ellipse cx={50} cy={62} rx={8.5} ry={10} fill={OSCURO} />
          <ellipse cx={82} cy={62} rx={8.5} ry={10} fill={OSCURO} />
          <circle cx={53} cy={58} r={3.2} fill="#fff" />
          <circle cx={85} cy={58} r={3.2} fill="#fff" />
          <path d="M 41 47 q 9 -4 16 0" stroke="#bda98f" strokeWidth={2.8} fill="none" strokeLinecap="round" />
          <path d="M 91 47 q -9 -4 -16 0" stroke="#bda98f" strokeWidth={2.8} fill="none" strokeLinecap="round" />
        </g>
      ) : (
        <g>
          <ellipse cx={50} cy={62} rx={10} ry={11.5} fill={OSCURO} />
          <ellipse cx={82} cy={62} rx={10} ry={11.5} fill={OSCURO} />
          {/* Doble brillo: el truco del uwu */}
          <circle cx={53.5} cy={57.5} r={3.8} fill="#ffffff" />
          <circle cx={85.5} cy={57.5} r={3.8} fill="#ffffff" />
          <circle cx={47} cy={66} r={2} fill="#ffffff" opacity={0.85} />
          <circle cx={79} cy={66} r={2} fill="#ffffff" opacity={0.85} />
        </g>
      )}

      {/* Naricita de corazón, algo más pequeña para dejar sitio a la boca */}
      <path
        d="M 66 70 c -2.4 -3.2 -7.1 -2.4 -7.1 1.2 c 0 2.8 4 4.8 7.1 6.8 c 3.1 -2 7.1 -4 7.1 -6.8 c 0 -3.6 -4.7 -4.4 -7.1 -1.2 Z"
        fill={ROSA_FUERTE}
      />
      <circle cx={63.2} cy={71.6} r={1.4} fill="#fff" opacity={0.8} />

      {/* Boquita: el dientecito va DEBAJO para no tapar la sonrisa */}
      {humor === "celebrando" ? (
        <g>
          <path
            d="M 57 82 q 9 12 18 0 q -1 12 -9 12 q -8 0 -9 -12 Z"
            fill="#d9848f"
            stroke={OSCURO}
            strokeWidth={2.4}
            strokeLinejoin="round"
          />
          <rect x={63} y={82.5} width={6} height={4.6} rx={1.5} fill="#fff" />
        </g>
      ) : humor === "preocupado" ? (
        <path
          d="M 57 87 q 4.5 -5 9 0 q 4.5 5 9 0"
          stroke={OSCURO}
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        // Boquita «w» de ratoncito, limpia y bien visible
        <path
          d="M 56 82 q 5 7 10 0 q 5 7 10 0"
          stroke={OSCURO}
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}

      {/* Mejillas sonrojadas */}
      <ellipse cx={34} cy={76} rx={9} ry={5.5} fill={ROSA} opacity={0.8} />
      <ellipse cx={98} cy={76} rx={9} ry={5.5} fill={ROSA} opacity={0.8} />

      {/* Chispitas al celebrar */}
      {humor === "celebrando" && !reduce && (
        <g>
          {[
            [16, 20, 0],
            [116, 18, 0.3],
            [120, 88, 0.6],
          ].map(([x, y, d], i) => (
            <motion.path
              key={i}
              d={`M ${x} ${y - 6} l 1.8 4.6 l 4.6 1.8 l -4.6 1.8 l -1.8 4.6 l -1.8 -4.6 l -4.6 -1.8 l 4.6 -1.8 Z`}
              fill="#f7cf5a"
              animate={{ scale: [0, 1.15, 0], opacity: [0, 1, 0] }}
              transition={{ duration: 1.1, repeat: Infinity, delay: d as number }}
              style={{ transformOrigin: `${x}px ${y}px` }}
            />
          ))}
        </g>
      )}
    </motion.svg>
  );
}
