/**
 * CareerEnd — Cierre de una partida del modo Carrera.
 * Muestra rondas servidas, puntuación y récord personal.
 */
import { motion } from "framer-motion";
import { Home, RotateCw, Trophy, UtensilsCrossed } from "lucide-react";
import { Fondo } from "../components/Fondo";
import { Mascot } from "../components/Mascot";
import { Sakura } from "../components/Sakura";

interface Props {
  rondas: number;
  puntos: number;
  mejorRonda: number;
  mejorPuntos: number;
  esRecord: boolean;
  onReintentar: () => void;
  onSalir: () => void;
}

export function CareerEnd({
  rondas,
  puntos,
  mejorRonda,
  mejorPuntos,
  esRecord,
  onReintentar,
  onSalir,
}: Props) {
  return (
    <div className="relative flex h-dvh w-full items-center justify-center overflow-y-auto p-4">
      <Fondo />
      {esRecord && <Sakura cantidad={24} />}

      <motion.div
        className="relative z-10 my-auto w-full max-w-sm rounded-3xl border border-[#e2d5b4] bg-[#fdf9ef]/95 p-5 text-center shadow-[0_24px_60px_-20px_rgba(90,60,20,0.45)] backdrop-blur"
        initial={{ opacity: 0, scale: 0.88, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 20 }}
      >
        <div className="mx-auto w-fit">
          <Mascot humor={esRecord ? "celebrando" : "preocupado"} size={84} />
        </div>

        <p className="mt-1 text-[11px] font-bold tracking-[0.25em] text-[#8a7a5c] uppercase">
          Fin del servicio
        </p>

        {esRecord && (
          <motion.div
            className="mx-auto mt-1 flex w-fit items-center gap-1.5 rounded-full bg-[#f2c14e]/30 px-3 py-1 text-xs font-black text-[#b8860b]"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 380, damping: 12 }}
          >
            <Trophy size={14} className="fill-current" /> ¡Nuevo récord!
          </motion.div>
        )}

        {/* Marcador principal */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-2xl border-2 border-[#e2d5b4] bg-white/70 p-3">
            <div className="flex items-center justify-center gap-1.5 text-[#a03127]">
              <UtensilsCrossed size={16} />
              <span className="text-2xl font-black tabular-nums">{rondas}</span>
            </div>
            <p className="text-[10px] font-bold tracking-wider text-[#8a7a5c] uppercase">
              Bentos servidos
            </p>
          </div>
          <div className="rounded-2xl border-2 border-[#e2d5b4] bg-white/70 p-3">
            <span className="block text-2xl font-black tabular-nums text-[#5c9a4e]">
              {puntos.toLocaleString("es")}
            </span>
            <p className="text-[10px] font-bold tracking-wider text-[#8a7a5c] uppercase">
              Puntos
            </p>
          </div>
        </div>

        {/* Récords */}
        <div className="mt-2 flex items-center justify-center gap-3 rounded-2xl bg-[#f4ecd9] px-3 py-2 text-xs font-bold text-[#6d5a3a]">
          <span>Récord: {mejorRonda} bentos</span>
          <span className="text-[#cbbfa2]">|</span>
          <span>{mejorPuntos.toLocaleString("es")} pts</span>
        </div>

        {/* Acciones */}
        <div className="mt-4 flex items-center justify-center gap-2">
          <button
            onClick={onSalir}
            className="flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-[#d8c8a4] bg-white text-[#6d5a3a] transition-transform active:scale-90"
            aria-label="Volver al inicio"
          >
            <Home size={20} />
          </button>
          <motion.button
            onClick={onReintentar}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-[#a03127] px-5 font-black text-[#fdf6ea] shadow-[0_10px_24px_-8px_rgba(160,49,39,0.65)]"
            whileTap={{ scale: 0.95 }}
          >
            <RotateCw size={18} /> Otra ronda
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
