/**
 * LevelSelect — La carta del día.
 * Tarjetas con miniatura de cada caja, estrellas y candados.
 */
import { motion } from "framer-motion";
import { ChevronLeft, Lock, Star } from "lucide-react";
import { NIVELES } from "../game/levels";
import type { Progreso } from "../game/types";
import { Fondo } from "../components/Fondo";

interface Props {
  progreso: Progreso;
  onElegir: (nivelId: number) => void;
  onVolver: () => void;
}

const TINTES = ["#f0c46c", "#e58aa8", "#8fbf6f", "#f5825f", "#eec63f", "#a9c7e8", "#d9a66c", "#c9b8e8"];

export function LevelSelect({ progreso, onElegir, onVolver }: Props) {
  return (
    <div className="relative flex h-dvh flex-col overflow-hidden">
      <Fondo />
      <div className="relative z-10 flex shrink-0 items-center gap-3 p-3">
        <button
          onClick={onVolver}
          aria-label="Volver"
          className="flex h-11 w-11 min-h-11 min-w-11 items-center justify-center rounded-full border border-[#d8c8a4] bg-[#fdf9ef]/85 text-[#6d5a3a] shadow backdrop-blur transition-transform active:scale-90"
        >
          <ChevronLeft size={22} strokeWidth={2.6} />
        </button>
        <div>
          <h2 className="text-xl font-black text-[#4a3b22]">La carta del día</h2>
          <p className="text-xs font-semibold text-[#8a7a5c]">Elige una caja para preparar</p>
        </div>
      </div>

      <div
        className="relative z-10 grid min-h-0 flex-1 content-start gap-2.5 overflow-y-auto p-3 pt-1"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 150px), 1fr))" }}
      >
        {NIVELES.map((nivel, i) => {
          const bloqueado = nivel.id > progreso.nivelMax;
          const estrellas = progreso.estrellas[nivel.id] ?? 0;
          const hueco = Math.max(...nivel.compartimentos.map((c) => c.w * c.h));
          return (
            <motion.button
              key={nivel.id}
              disabled={bloqueado}
              onClick={() => onElegir(nivel.id)}
              className={`group relative flex min-w-0 flex-col items-center gap-1.5 overflow-hidden rounded-3xl border-2 p-2.5 text-left shadow transition-transform ${
                bloqueado
                  ? "border-[#ddd2b8] bg-[#efe8d5]/60"
                  : "border-[#e2d5b4] bg-[#fdf9ef] hover:-translate-y-1 hover:shadow-lg active:scale-95"
              }`}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, type: "spring", stiffness: 200, damping: 18 }}
            >
              {/* Miniatura de la caja */}
              <div
                className="grid w-full overflow-hidden rounded-xl border-2 border-[#7c241d]"
                style={{
                  gridTemplateColumns: `repeat(${nivel.cols}, 1fr)`,
                  aspectRatio: `${nivel.cols}/${nivel.rows}`,
                  background: "#e6dcc4",
                }}
              >
                {Array.from({ length: nivel.cols * nivel.rows }).map((_, celda) => {
                  const x = celda % nivel.cols;
                  const y = Math.floor(celda / nivel.cols);
                  const idx = nivel.compartimentos.findIndex(
                    (c) => x >= c.x && x < c.x + c.w && y >= c.y && y < c.y + c.h,
                  );
                  return (
                    <div
                      key={celda}
                      style={{
                        background: bloqueado
                          ? "#d9d0ba"
                          : TINTES[(idx * 2 + 1) % TINTES.length],
                        margin: hueco > 4 ? 1 : 0.5,
                        borderRadius: 2,
                        opacity: bloqueado ? 0.5 : 0.92,
                      }}
                    />
                  );
                })}
              </div>
              <div className="w-full min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[11px] font-black text-[#a03127]">N.º {nivel.id}</span>
                  {bloqueado && <Lock size={13} className="shrink-0 text-[#b3a586]" />}
                </div>
                <p className="truncate text-[13px] font-black text-[#4a3b22]">{nivel.nombre}</p>
                <p className="truncate text-[10px] font-semibold text-[#8a7a5c]">
                  {nivel.subtitulo}
                </p>
              </div>
              <div className="flex gap-0.5">
                {[1, 2, 3].map((n) => (
                  <Star
                    key={n}
                    size={15}
                    className={
                      n <= estrellas
                        ? "fill-[#f2c14e] text-[#b8860b]"
                        : "fill-[#e7ddc6] text-[#d8cdb2]"
                    }
                  />
                ))}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
