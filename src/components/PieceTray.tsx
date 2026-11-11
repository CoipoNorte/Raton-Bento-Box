/**
 * PieceTray — La tabla de preparación.
 *
 * Dos cuidados críticos aquí:
 *  1. SENTIDO DE GIRO. La lógica del juego (`rotarForma`) gira en
 *     sentido ANTIHORARIO. Si la vista previa girase con el `rotate`
 *     positivo de CSS (horario), el onigiri y la tempura se verían en
 *     una orientación distinta a la que se coloca. Por eso animamos
 *     con `-rotacion * 90`: lo que ves es exactamente lo que encaja.
 *  2. AGARRE. La celda agarrada se calcula desde el CENTRO del slot
 *     (que no rota ni se deforma), nunca midiendo el elemento girado.
 */
import { motion } from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { celdasDe } from "../game/logic";
import type { PiezaInst } from "../game/types";
import { useTapSinArrastre } from "../hooks/useTapSinArrastre";
import type { Agarre, Punto } from "../hooks/useTapSinArrastre";
import { FoodSVG } from "./FoodSVG";

export type { Agarre, Punto };

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
  onIniciarArrastre: (uid: string, punto: Punto, agarre: Agarre) => void;
  onMoverArrastre: (punto: Punto) => void;
  onSoltarArrastre: (punto: Punto) => void;
  onCancelarArrastre: () => void;
  onTapPieza: (uid: string) => void;
}

/** Lado máximo de un slot, en múltiplos de celda: mantiene la fila regular. */
const EXTENSION_MAX = 2.4;

/** Dimensiones de la pieza YA rotada y su escala dentro del slot. */
function metricas(pieza: PiezaInst, celda: number) {
  const celdas = celdasDe(pieza);
  const bw = Math.max(...celdas.map(([x]) => x)) + 1;
  const bh = Math.max(...celdas.map(([, y]) => y)) + 1;
  const celdaPieza = Math.floor(
    Math.min(celda, (celda * EXTENSION_MAX) / Math.max(bw, bh)),
  );
  return { bw, bh, celdaPieza };
}

const limitar = (v: number, min: number, max: number) =>
  Math.min(Math.max(v, min), max);

/**
 * Vista previa de una pieza en la bandeja.
 *
 * Dibuja el arte YA ROTADO (el mismo que usan el tablero y la pieza en
 * vuelo), así los detalles coinciden al píxel: el sésamo, el nori, las
 * capas del tamagoyaki o la cola del langostino salen igual que al
 * colocarla. El giro se sigue viendo animado: al cambiar la rotación,
 * la pieza entra desde +90° y cae en su sitio con muelle.
 */
function VistaPieza({
  pieza,
  celda,
  resaltada,
}: {
  pieza: PiezaInst;
  celda: number;
  resaltada: boolean;
}) {
  const anterior = useRef(pieza.rotacion);
  const giro = anterior.current !== pieza.rotacion;
  useEffect(() => {
    anterior.current = pieza.rotacion;
  }, [pieza.rotacion]);

  return (
    <motion.div
      key={pieza.rotacion}
      className="flex items-center justify-center"
      initial={giro ? { rotate: 90, scale: 0.88 } : false}
      animate={{ rotate: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 340, damping: 20 }}
    >
      <motion.div
        animate={resaltada ? { scale: [1, 1.12, 1] } : { scale: 1 }}
        transition={resaltada ? { duration: 0.9, repeat: Infinity } : { duration: 0.2 }}
      >
        <FoodSVG id={pieza.ingrediente} celda={celda} rotacion={pieza.rotacion} />
      </motion.div>
    </motion.div>
  );
}

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
  const contenedorRef = useRef<HTMLDivElement | null>(null);
  // Las piezas vivas se consultan desde el gesto sin recrear escuchas.
  const piezasRef = useRef(piezas);
  piezasRef.current = piezas;

  const { bajar } = useTapSinArrastre({
    ejeBandeja: vertical ? "y" : "x",
    umbral: 7,
    contenedorRef,
    alIniciarArrastre: (uid, punto) => {
      const pieza = piezasRef.current.find((p) => p.uid === uid);
      if (!pieza) return;
      const { bw, bh, celdaPieza } = metricas(pieza, celda);
      const slot = contenedorRef.current?.querySelector<HTMLElement>(
        `[data-pieza="${uid}"]`,
      );
      // Por defecto, agarre por el centro de la pieza.
      let fx = bw / 2;
      let fy = bh / 2;
      const r = slot?.getBoundingClientRect();
      if (r && celdaPieza > 0) {
        // El centro del slot es estable aunque haya hover o escala.
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const izq = cx - (bw * celdaPieza) / 2;
        const arr = cy - (bh * celdaPieza) / 2;
        fx = limitar((punto.x - izq) / celdaPieza, 0, bw);
        fy = limitar((punto.y - arr) / celdaPieza, 0, bh);
      }
      onIniciarArrastre(uid, punto, { fx, fy });
    },
    alMover: onMoverArrastre,
    alSoltar: onSoltarArrastre,
    alCancelar: onCancelarArrastre,
    alTap: onTapPieza,
  });

  // Slot cuadrado y uniforme: la bandeja se ve ordenada en cualquier tamaño.
  const relleno = Math.max(8, Math.round(celda * 0.26));
  const slot = Math.round(celda * EXTENSION_MAX) + relleno;

  // Pista visual: avisamos de que la bandeja se puede recorrer.
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

  return (
    <div
      ref={contenedorRef}
      className={
        vertical
          ? "flex h-full w-full flex-col items-center gap-2 overflow-x-hidden overflow-y-auto p-2 [scrollbar-width:thin]"
          : "flex h-full w-full flex-row items-center gap-2 overflow-x-auto overflow-y-hidden p-2 [scrollbar-width:thin]"
      }
      style={{
        WebkitOverflowScrolling: "touch",
        // Si hay recorrido, el gesto paralelo lo desplazamos a mano.
        scrollBehavior: "auto",
      }}
      onContextMenu={(e) => e.preventDefault()}
      title={desplazable ? "Desliza para ver más ingredientes" : undefined}
    >
      {piezas.map((p) => {
        const { celdaPieza } = metricas(p, celda);
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
              // Nada de pan-x/pan-y: el navegador ya no nos roba el
              // gesto. El scroll de la bandeja lo movemos nosotros.
              touchAction: "none",
              opacity: enVuelo ? 0.25 : 1,
            }}
            animate={{ scale: enVuelo ? 0.92 : 1 }}
            transition={{ type: "spring", stiffness: 420, damping: 24 }}
            whileHover={bloqueado ? {} : { scale: 1.04 }}
            onPointerDown={bloqueado ? undefined : (e) => bajar(p.uid, e)}
            title="Arrastrar hacia la caja · Tocar para rotar"
          >
            {/* Arte idéntico al del tablero: lo que ves es lo que colocas */}
            <VistaPieza pieza={p} celda={celdaPieza} resaltada={pistaUid === p.uid} />
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
