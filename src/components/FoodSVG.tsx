/**
 * FoodSVG — Comida 100 % procedural en SVG.
 * Cada ingrediente tiene silueta, color y textura propios (sésamo en el
 * arroz, vetas en el salmón, espiral del tamagoyaki, nori del onigiri…).
 * Las piezas llenan su espacio: nada de iconos diminutos.
 */
import { useId } from "react";
import { rotarForma } from "../game/logic";
import { INGREDIENTES } from "../game/ingredients";
import type { Celda, IngredienteId } from "../game/types";

interface Props {
  id: IngredienteId;
  /** Tamaño de celda en px (la pieza puede ocupar varias). */
  celda: number;
  rotacion?: number;
  className?: string;
}

/** Celdas acolchadas: rect redondeado por celda que se rozan entre sí. */
function Base({ celdas, fill, stroke }: { celdas: Celda[]; fill: string; stroke: string }) {
  return (
    <>
      {celdas.map(([x, y], i) => (
        <rect
          key={i}
          x={x * 100 + 5}
          y={y * 100 + 5}
          width={90}
          height={90}
          rx={30}
          fill={fill}
          stroke={stroke}
          strokeWidth={3}
        />
      ))}
    </>
  );
}

/** Semillas de sésamo deterministas (ángulos y posiciones fijas). */
const SESAMO: [number, number, number][] = [
  [30, 34, -30],
  [62, 26, 20],
  [46, 58, 65],
  [24, 70, 10],
  [70, 66, -55],
];

function Sesamo({ celdas }: { celdas: Celda[] }) {
  return (
    <>
      {celdas.flatMap(([cx, cy], i) =>
        SESAMO.slice(0, 4).map(([dx, dy, r], j) => (
          <ellipse
            key={`${i}-${j}`}
            cx={cx * 100 + dx}
            cy={cy * 100 + dy}
            rx={4.5}
            ry={2.6}
            fill={j % 2 ? "#3a352c" : "#8b8375"}
            transform={`rotate(${r} ${cx * 100 + dx} ${cy * 100 + dy})`}
            opacity={0.85}
          />
        )),
      )}
    </>
  );
}

/** Brillo superior izquierdo: vida y apetito. */
function Brillo({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return <ellipse cx={cx - r * 0.32} cy={cy - r * 0.38} rx={r * 0.34} ry={r * 0.2} fill="#ffffff" opacity={0.5} />;
}

/**
 * Dibujo de cada ingrediente dentro de su caja delimitadora.
 * `rot` permite que los detalles con dirección (surcos del arroz, capas
 * del tamagoyaki, vetas del salmón, cola del langostino) acompañen al
 * giro de la pieza. El sentido es el mismo que el de la lógica:
 * antihorario, de ahí el signo negativo.
 */
function Arte({
  id,
  celdas,
  bw,
  bh,
  rot,
}: {
  id: IngredienteId;
  celdas: Celda[];
  bw: number;
  bh: number;
  rot: number;
}) {
  const W = bw * 100;
  const H = bh * 100;
  const cx = W / 2;
  const cy = H / 2;
  /** Transform para girar un detalle alrededor de un punto. */
  const giro = (gx: number, gy: number) => `rotate(${-rot * 90} ${gx} ${gy})`;

  switch (id) {
    case "arroz":
      return (
        <>
          <Base celdas={celdas} fill="#fbf7ec" stroke="#e6dcc4" />
          {/* surcos de arroz amontonado, siguiendo el giro de la pieza */}
          {celdas.map(([x, y], i) => (
            <path
              key={i}
              d={`M ${x * 100 + 24} ${y * 100 + 40} q 26 -12 52 0 M ${x * 100 + 24} ${y * 100 + 62} q 26 -12 52 0`}
              stroke="#eae2cd"
              strokeWidth={5}
              fill="none"
              strokeLinecap="round"
              transform={giro(x * 100 + 50, y * 100 + 50)}
            />
          ))}
          <Sesamo celdas={celdas} />
        </>
      );

    case "onigiri": {
      // Arroz CELDA A CELDA (nunca invade la celda vecina de la L) y un
      // triángulo de nori en la celda «cabeza»: se reconoce de un vistazo.
      const cabeza = celdas.reduce((mejor, c) =>
        c[1] < mejor[1] || (c[1] === mejor[1] && c[0] < mejor[0]) ? c : mejor,
      );
      const hx = cabeza[0] * 100 + 50;
      const hy = cabeza[1] * 100 + 50;
      return (
        <>
          <Base celdas={celdas} fill="#f9f5e9" stroke="#e2dac2" />
          {/* triángulo de nori: el emblema del onigiri */}
          <path
            d={`M ${hx} ${hy - 30} Q ${hx} ${hy - 36} ${hx + 6} ${hy - 26}
                L ${hx + 30} ${hy + 22} Q ${hx + 33} ${hy + 30} ${hx + 24} ${hy + 30}
                L ${hx - 24} ${hy + 30} Q ${hx - 33} ${hy + 30} ${hx - 30} ${hy + 22}
                L ${hx - 6} ${hy - 26} Z`}
            fill="#2e2b26"
            stroke="#1b1916"
            strokeWidth={2.5}
            strokeLinejoin="round"
          />
          {/* carita de arroz dentro del nori */}
          <ellipse cx={hx} cy={hy + 6} rx={15} ry={12} fill="#f9f5e9" />
          <Sesamo celdas={celdas.filter((c) => c !== cabeza)} />
        </>
      );
    }

    case "tamagoyaki":
      return (
        <>
          <Base celdas={celdas} fill="#f6c945" stroke="#dfa417" />
          {/* capas del enrollado, perpendiculares al eje de la pieza */}
          {celdas.map(([x, y], i) => (
            <path
              key={i}
              d={`M ${x * 100 + 18} ${y * 100 + 34} h 64 M ${x * 100 + 18} ${y * 100 + 50} h 64 M ${x * 100 + 18} ${y * 100 + 66} h 64`}
              stroke="#e9b530"
              strokeWidth={6}
              strokeLinecap="round"
              fill="none"
              transform={giro(x * 100 + 50, y * 100 + 50)}
            />
          ))}
          {/* espiral del extremo */}
          <circle cx={celdas[celdas.length - 1][0] * 100 + 50} cy={celdas[celdas.length - 1][1] * 100 + 50} r={16} fill="none" stroke="#fff3cf" strokeWidth={5} />
          <circle cx={celdas[celdas.length - 1][0] * 100 + 50} cy={celdas[celdas.length - 1][1] * 100 + 50} r={6} fill="#fff3cf" />
        </>
      );

    case "salmon":
      return (
        <>
          <Base celdas={celdas} fill="#f5825f" stroke="#e2683f" />
          {/* vetas de grasa, orientadas con el lomo del sashimi */}
          {celdas.map(([x, y], i) => (
            <path
              key={i}
              d={`M ${x * 100 + 14} ${y * 100 + 26} q 30 12 56 44 M ${x * 100 + 34} ${y * 100 + 14} q 30 14 50 48`}
              stroke="#fbc0a4"
              strokeWidth={7}
              strokeLinecap="round"
              fill="none"
              opacity={0.9}
              transform={giro(x * 100 + 50, y * 100 + 50)}
            />
          ))}
          <Brillo cx={cx} cy={cy} r={W / 3} />
        </>
      );

    case "karaage": {
      // Racimo de bocados fritos con piel crujiente irregular.
      const bocados: [number, number, number][] = [
        [cx - 28, cy - 20, 34],
        [cx + 24, cy - 26, 30],
        [cx - 6, cy + 18, 36],
        [cx + 34, cy + 12, 26],
        [cx - 38, cy + 8, 24],
      ];
      return (
        <g transform={giro(cx, cy)}>
          {bocados.map(([x, y, r], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r={r} fill="#d8983c" stroke="#a96f24" strokeWidth={3} />
              <circle cx={x - r * 0.3} cy={y - r * 0.3} r={r * 0.22} fill="#ecc06b" />
              <circle cx={x + r * 0.28} cy={y + r * 0.22} r={r * 0.14} fill="#b57e2c" />
              <circle cx={x + r * 0.05} cy={y - r * 0.44} r={r * 0.1} fill="#8f5e1e" />
            </g>
          ))}
        </g>
      );
    }

    case "tempura": {
      // Langostino rebozado en L: cola rosada y rebozado dorado.
      const [primera] = celdas;
      const tailX = primera[0] * 100 + 50;
      const tailY = primera[1] * 100 + 44;
      return (
        <>
          {/* La pieza entera lleva fondo: nada de celdas huecas */}
          <Base celdas={celdas} fill="#e3a94f" stroke="#c08a35" />
          {/* cola del langostino: gira con la pieza */}
          <g transform={giro(tailX, tailY)}>
            <path
              d={`M ${tailX - 22} ${tailY - 6} q -20 -22 4 -26 q 6 14 18 16 q 14 -12 22 2 q -14 6 -18 18 q 2 16 -14 18 q -12 -12 -12 -28 Z`}
              fill="#e2603f"
              stroke="#c24c2f"
              strokeWidth={3}
              strokeLinejoin="round"
            />
            <path d={`M ${tailX - 14} ${tailY - 18} l 10 10 M ${tailX + 2} ${tailY - 20} l 8 12`} stroke="#f4a488" strokeWidth={4} strokeLinecap="round" />
          </g>
          {celdas.slice(1).map(([x, y], i) => (
            <g key={i} transform={giro(x * 100 + 50, y * 100 + 50)}>
              <path d={`M ${x * 100 + 24} ${y * 100 + 34} q 24 -14 50 2 M ${x * 100 + 26} ${y * 100 + 58} q 22 -12 46 0`} stroke="#c98f38" strokeWidth={5} fill="none" strokeLinecap="round" />
              {[0, 1, 2].map((k) => (
                <circle key={k} cx={x * 100 + 30 + k * 18} cy={y * 100 + 76} r={4} fill="#f4d08a" />
              ))}
            </g>
          ))}
        </>
      );
    }

    case "brocoli":
      return (
        <>
          <path d={`M ${cx - 10} ${cy + 34} h 20 l -4 -20 h -12 Z`} fill="#b7d3a2" stroke="#93b87e" strokeWidth={2} />
          {([
            [cx, cy - 14, 30],
            [cx - 24, cy, 22],
            [cx + 24, cy, 22],
            [cx - 10, cy + 10, 20],
            [cx + 12, cy + 12, 18],
          ] as [number, number, number][]).map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r} fill={i % 2 ? "#4e8f43" : "#5da24e"} stroke="#3d7234" strokeWidth={2.5} />
          ))}
          <circle cx={cx - 8} cy={cy - 22} r={5} fill="#8bc177" />
          <circle cx={cx + 16} cy={cy - 8} r={4} fill="#8bc177" />
        </>
      );

    case "cherry":
      return (
        <>
          <path d={`M ${cx} ${cy - 18} q 4 -16 16 -20`} stroke="#3f7d3a" strokeWidth={5} fill="none" strokeLinecap="round" />
          <path d={`M ${cx + 8} ${cy - 30} q 12 -6 18 2 q -12 6 -18 -2 Z`} fill="#4f8f47" />
          <circle cx={cx} cy={cy + 4} r={30} fill="#e84b4b" stroke="#c23a3a" strokeWidth={3} />
          <Brillo cx={cx} cy={cy + 4} r={30} />
        </>
      );

    case "edamame": {
      // Vaina continua que respeta la orientación de la pieza.
      const horizontal = W >= H;
      return (
        <>
          {horizontal ? (
            <rect x={10} y={H / 2 - 30} width={W - 20} height={60} rx={30} fill="#79a95c" stroke="#5c8a44" strokeWidth={4} />
          ) : (
            <rect x={W / 2 - 30} y={10} width={60} height={H - 20} rx={30} fill="#79a95c" stroke="#5c8a44" strokeWidth={4} />
          )}
          {celdas.map(([x, y], i) => (
            <g key={i}>
              <circle cx={x * 100 + 50} cy={y * 100 + 50} r={20} fill="#8fbf6f" />
              <circle cx={x * 100 + 44} cy={y * 100 + 44} r={7} fill="#c2e0a6" />
            </g>
          ))}
          {horizontal ? (
            <path d={`M 16 ${H / 2 - 20} q ${W / 2} -22 ${W - 32} 0`} stroke="#a4cc8b" strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.8} />
          ) : (
            <path d={`M ${W / 2 - 20} 16 q -22 ${H / 2} 0 ${H - 32}`} stroke="#a4cc8b" strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.8} />
          )}
        </>
      );
    }

    case "maki":
      return (
        <>
          <circle cx={cx} cy={cy} r={40} fill="#332f2a" stroke="#201d19" strokeWidth={3} />
          <circle cx={cx} cy={cy} r={29} fill="#f6f1e3" />
          {/* textura de arroz */}
          {[0, 1, 2, 3, 4, 5].map((k) => {
            const a = (k * Math.PI) / 3 + 0.4;
            return <circle key={k} cx={cx + Math.cos(a) * 21} cy={cy + Math.sin(a) * 21} r={3.4} fill="#e6dec9" />;
          })}
          <circle cx={cx} cy={cy} r={16} fill="#f2765c" stroke="#d95f43" strokeWidth={3} />
          <circle cx={cx - 5} cy={cy - 5} r={4.5} fill="#f9a98f" />
        </>
      );

    case "takuan":
      return (
        <>
          {celdas.map(([x, y], i) => (
            <g key={i}>
              <circle cx={x * 100 + 50} cy={y * 100 + 50} r={36} fill="#eec63f" stroke="#c9a227" strokeWidth={4} />
              <circle cx={x * 100 + 50} cy={y * 100 + 50} r={24} fill="none" stroke="#f8e08a" strokeWidth={5} />
              <circle cx={x * 100 + 50} cy={y * 100 + 50} r={9} fill="#dfae2c" />
              <circle cx={x * 100 + 38} cy={y * 100 + 36} r={6} fill="#ffffff" opacity={0.45} />
            </g>
          ))}
        </>
      );

    case "zanahoria": {
      // Flor tallada: cinco pétalos naranjas y corazón dorado.
      const petalos: [number, number][] = [0, 1, 2, 3, 4].map((k) => {
        const a = (k * 2 * Math.PI) / 5 - Math.PI / 2;
        return [cx + Math.cos(a) * 22, cy + Math.sin(a) * 22];
      });
      return (
        <>
          {petalos.map(([x, y], i) => (
            <ellipse key={i} cx={x} cy={y} rx={17} ry={13} fill="#f18f3b" stroke="#d97325" strokeWidth={2.5}
              transform={`rotate(${(i * 360) / 5} ${x} ${y})`} />
          ))}
          <circle cx={cx} cy={cy} r={13} fill="#f6c945" stroke="#dfa417" strokeWidth={3} />
          <circle cx={cx - 4} cy={cy - 4} r={4} fill="#ffffff" opacity={0.5} />
        </>
      );
    }

    case "umeboshi":
      return (
        <>
          <circle cx={cx} cy={cy} r={32} fill="#b3364a" stroke="#8a2737" strokeWidth={3} />
          {/* arrugas del encurtido */}
          <path
            d={`M ${cx - 18} ${cy - 8} q 10 6 4 16 M ${cx + 4} ${cy - 20} q 12 4 8 18 M ${cx + 16} ${cy + 2} q -8 8 -2 18 M ${cx - 8} ${cy + 10} q 10 4 6 14`}
            stroke="#7e2433"
            strokeWidth={4}
            fill="none"
            strokeLinecap="round"
          />
          <Brillo cx={cx} cy={cy} r={32} />
        </>
      );

    default:
      return <Base celdas={celdas} fill="#ddd" stroke="#bbb" />;
  }
}

/**
 * Dibuja un ingrediente completo (posiblemente multicelda) listo para
 * bandeja, caja o tarjeta de pedido.
 */
export function FoodSVG({ id, celda, rotacion = 0, className }: Props) {
  const celdas = rotarForma(INGREDIENTES[id].forma, rotacion);
  const bw = Math.max(...celdas.map(([x]) => x)) + 1;
  const bh = Math.max(...celdas.map(([, y]) => y)) + 1;
  // Recorte de seguridad: la comida NUNCA se sale de sus propias celdas.
  const idRecorte = `recorte-${useId().replace(/[:]/g, "")}`;
  return (
    <svg
      viewBox={`-2 -2 ${bw * 100 + 4} ${bh * 100 + 4}`}
      width={bw * celda}
      height={bh * celda}
      className={className}
      style={{ display: "block" }}
      aria-label={INGREDIENTES[id].nombre}
      role="img"
    >
      <defs>
        {/* Celdas exactas: la unión no deja pellizcos entre celdas vecinas */}
        <clipPath id={idRecorte}>
          {celdas.map(([x, y], i) => (
            <rect key={i} x={x * 100} y={y * 100} width={100} height={100} />
          ))}
        </clipPath>
      </defs>
      <g clipPath={`url(#${idRecorte})`}>
        <Arte id={id} celdas={celdas} bw={bw} bh={bh} rot={rotacion} />
      </g>
    </svg>
  );
}
