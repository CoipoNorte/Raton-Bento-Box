/**
 * ResultScreen — EL MOMENTO ASMR.
 * 1) La tapa baja y encaja (clic). 2) La goma se estira y suelta (pluck).
 * 3) El furoshiki envuelve la caja. 4) Pétalos de sakura + puntuación.
 * Se puede saltar con un toque.
 */
import { motion, useReducedMotion } from "framer-motion";
import { Home, RotateCcw, SkipForward, Star, StepForward } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { arpegioCompletado, furoshiki, goma, tapa } from "../game/sound";
import type { Resultado } from "../game/types";
import { Mascot } from "../components/Mascot";
import { Sakura } from "../components/Sakura";

interface Props {
  resultado: Resultado;
  nombreNivel: string;
  esUltimo: boolean;
  onSiguiente: () => void;
  onRepetir: () => void;
  onSalir: () => void;
}

export function ResultScreen({
  resultado,
  nombreNivel,
  esUltimo,
  onSiguiente,
  onRepetir,
  onSalir,
}: Props) {
  const reduce = useReducedMotion();
  const [etapa, setEtapa] = useState(0);
  const [puntosVistos, setPuntosVistos] = useState(0);
  const cronometros = useRef<number[]>([]);

  // Coreografía: tapa → goma → furoshiki → revelación.
  useEffect(() => {
    tapa();
    cronometros.current = [
      window.setTimeout(() => {
        setEtapa(1);
        goma();
      }, 650),
      window.setTimeout(() => {
        setEtapa(2);
        furoshiki();
      }, 1350),
      window.setTimeout(() => {
        setEtapa(3);
        arpegioCompletado();
      }, 2150),
    ];
    return () => cronometros.current.forEach((t) => window.clearTimeout(t));
  }, []);

  // Cuenta ascendente de puntos al revelar.
  useEffect(() => {
    if (etapa !== 3) return;
    if (reduce) {
      setPuntosVistos(resultado.puntos);
      return;
    }
    const inicio = performance.now();
    let raf = 0;
    const paso = (t: number) => {
      const p = Math.min(1, (t - inicio) / 1100);
      setPuntosVistos(Math.round(resultado.puntos * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(paso);
    };
    raf = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(raf);
  }, [etapa, resultado.puntos, reduce]);

  const saltar = () => {
    cronometros.current.forEach((t) => window.clearTimeout(t));
    if (etapa !== 3) {
      setEtapa(3);
      arpegioCompletado();
    }
  };

  const bonusFilas: [string, number][] = [
    ["Sin huecos", resultado.bonusSinHuecos],
    ["Goshiki completo", resultado.bonusGoshiki],
    ["Elegancia zen", resultado.bonusElegancia],
    [`Encajes perfectos ×${resultado.perfectos}`, resultado.bonusCombo],
  ];

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-[#f7f1e3] py-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onTap={saltar}
    >
      {etapa === 3 && <Sakura cantidad={34} />}

      {/* Escena del cierre: en flujo, encoge según la altura disponible */}
      <div
        className="flex w-full max-w-md shrink items-center justify-center px-4"
        style={{ height: etapa === 3 ? "clamp(90px, 22dvh, 190px)" : "clamp(140px, 42dvh, 300px)" }}
      >
        <svg viewBox="0 0 340 260" className="h-full w-auto max-w-full overflow-visible">
          {/* Base de la caja con un guiño de comida */}
          <g>
            <rect x={60} y={110} width={220} height={110} rx={18} fill="#6d1f18" />
            <g opacity={etapa === 0 ? 1 : 0}>
              <rect x={78} y={126} width={56} height={40} rx={8} fill="#faf7ef" />
              <rect x={142} y={126} width={56} height={40} rx={8} fill="#f2765c" />
              <rect x={206} y={126} width={56} height={40} rx={8} fill="#7fb069" />
              <rect x={78} y={172} width={88} height={34} rx={8} fill="#f2c14e" />
              <rect x={174} y={172} width={88} height={34} rx={8} fill="#d99a3d" />
            </g>
          </g>
          {/* Tapa de laca roja */}
          {etapa >= 1 && (
            <motion.g
              initial={{ y: -260, rotate: -8 }}
              animate={{ y: 0, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 16 }}
            >
              <rect x={52} y={96} width={236} height={34} rx={15} fill="#a03127" />
              <rect x={52} y={96} width={236} height={34} rx={15} fill="none" stroke="#d9a62e" strokeWidth={2.5} opacity={0.7} />
            </motion.g>
          )}
          {/* Goma elástica */}
          {etapa >= 2 && (
            <motion.g
              initial={{ scaleX: 0.2, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 14 }}
              style={{ transformOrigin: "170px 130px" }}
            >
              <rect x={50} y={121} width={240} height={9} rx={4.5} fill="#2e6f5e" />
            </motion.g>
          )}
          {/* Furoshiki */}
          {etapa >= 3 && (
            <motion.g
              initial={{ scale: 0.55, opacity: 0, rotate: 12 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 16 }}
              style={{ transformOrigin: "170px 150px" }}
            >
              <rect x={52} y={88} width={236} height={140} rx={26} fill="#e58aa8" />
              <rect x={52} y={88} width={236} height={140} rx={26} fill="none" stroke="#f6c6d4" strokeWidth={5} />
              {[0, 1, 2, 3, 4, 5].map((k) => (
                <circle key={k} cx={86 + (k % 3) * 62} cy={112 + Math.floor(k / 3) * 60} r={9} fill="#fbe3ea" opacity={0.85} />
              ))}
              {/* Lazo */}
              <path d="M170 84 C150 60 128 62 124 78 C120 94 150 96 168 88 Z" fill="#d96f92" />
              <path d="M172 84 C192 60 214 62 218 78 C222 94 192 96 174 88 Z" fill="#d96f92" />
              <circle cx={171} cy={86} r={9} fill="#c25a7e" />
            </motion.g>
          )}
        </svg>
      </div>

      {/* Botón de saltar */}
      {etapa < 3 && (
        <div className="absolute bottom-6 flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-center text-[11px] font-bold text-[#8a7a5c] shadow backdrop-blur">
          <SkipForward size={14} className="shrink-0" /> Toca para saltar
        </div>
      )}

      {/* Revelación de puntuación */}
      {etapa === 3 && (
        <motion.div
          className="flex w-full min-h-0 flex-1 flex-col items-center gap-2 overflow-y-auto px-3 pt-1 pb-4"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, type: "spring", stiffness: 200, damping: 20 }}
        >
          <div className="my-auto w-full max-w-sm rounded-3xl border border-[#e2d5b4] bg-[#fdf9ef]/95 p-4 text-center shadow-[0_20px_50px_-15px_rgba(90,60,20,0.35)] backdrop-blur">
            <div className="mx-auto mb-1 w-fit">
              <Mascot humor="celebrando" size={64} />
            </div>
            <p className="text-xs font-bold tracking-[0.25em] text-[#8a7a5c] uppercase">Bento cerrado</p>
            <h2 className="text-xl font-black text-[#4a3b22]">{nombreNivel}</h2>
            {/* Estrellas */}
            <div className="mt-1 flex items-center justify-center gap-2">
              {[1, 2, 3].map((n) => (
                <motion.span
                  key={n}
                  initial={{ scale: 0, rotate: -120 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 1 + n * 0.22, type: "spring", stiffness: 380, damping: 13 }}
                >
                  <Star
                    size={n === 2 ? 42 : 34}
                    className={
                      n <= resultado.estrellas
                        ? "fill-[#f2c14e] text-[#b8860b] drop-shadow-[0_2px_6px_rgba(242,193,78,0.6)]"
                        : "fill-[#e7ddc6] text-[#cbbfa2]"
                    }
                  />
                </motion.span>
              ))}
            </div>
            <p className="mt-1 text-3xl font-black tabular-nums text-[#a03127]">
              {puntosVistos.toLocaleString("es")}
            </p>
            <div className="mx-auto mt-2 grid max-w-[260px] gap-1">
              {bonusFilas.map(([etiqueta, valor]) => (
                <div key={etiqueta} className="flex items-center justify-between text-xs font-semibold text-[#6d5a3a]">
                  <span>{etiqueta}</span>
                  <span className={valor > 0 ? "text-[#5c9a4e]" : "text-[#b3a586]"}>
                    {valor > 0 ? `+${valor}` : "—"}
                  </span>
                </div>
              ))}
            </div>
            {/* Acciones */}
            <div className="mt-3 flex items-center justify-center gap-2">
              <button
                onClick={onSalir}
                className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-[#d8c8a4] bg-white text-[#6d5a3a] transition-transform active:scale-90"
                aria-label="Volver a niveles"
              >
                <Home size={20} />
              </button>
              <button
                onClick={onRepetir}
                className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-[#d8c8a4] bg-white text-[#6d5a3a] transition-transform active:scale-90"
                aria-label="Repetir nivel"
              >
                <RotateCcw size={20} />
              </button>
              {!esUltimo && (
                <button
                  onClick={onSiguiente}
                  className="flex h-12 items-center gap-1.5 rounded-2xl bg-[#a03127] px-5 font-black text-[#fdf6ea] shadow-[0_8px_20px_-6px_rgba(160,49,39,0.6)] transition-transform active:scale-95"
                >
                  Siguiente <StepForward size={18} />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
