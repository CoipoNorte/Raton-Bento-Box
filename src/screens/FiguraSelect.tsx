/**
 * FiguraSelect — El álbum de figuras.
 * Siluetas agrupadas por temática, con vista previa dibujada
 * directamente desde el arte ASCII (no hace falta teselar nada).
 */
import { motion } from "framer-motion";
import { ChevronLeft, Lock, Star } from "lucide-react";
import { useMemo } from "react";
import { TEMAS_FIGURAS, TOTAL_FIGURAS, mascaraDe, tamanoFigura } from "../game/figuras";
import type { FiguraDef } from "../game/figuras";
import type { Progreso } from "../game/types";
import { Fondo } from "../components/Fondo";
import { Mascot } from "../components/Mascot";
import { useViewport } from "../hooks/useViewport";

interface Props {
  progreso: Progreso;
  onElegir: (figuraId: string) => void;
  onVolver: () => void;
}

/** Miniatura de la silueta: cuadraditos sobre papel. */
function Silueta({
  figura,
  color,
  hecha,
}: {
  figura: FiguraDef;
  color: string;
  hecha: boolean;
}) {
  const { cols, rows, celdas } = useMemo(() => mascaraDe(figura), [figura]);
  return (
    <div
      className="flex w-full items-center justify-center rounded-xl bg-[#f7f0dd] p-2"
      style={{ aspectRatio: "1 / 1" }}
    >
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gap: 1,
          width: cols >= rows ? "100%" : `${(cols / rows) * 100}%`,
          aspectRatio: `${cols}/${rows}`,
        }}
      >
        {celdas.map((dentro, i) => (
          <div
            key={i}
            style={{
              borderRadius: 2,
              background: dentro ? (hecha ? color : "#d6c9ae") : "transparent",
              boxShadow: dentro ? "inset 0 1px 1px rgba(255,255,255,.4)" : undefined,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function FiguraSelect({ progreso, onElegir, onVolver }: Props) {
  const vp = useViewport();
  const hechas = progreso.figuras ?? {};
  const completadas = Object.values(hechas).filter((e) => e > 0).length;
  const ancho = vp.ancho < 420 ? 128 : vp.bajaAltura ? 132 : 158;

  // Cada tema se abre al completar 2 figuras del anterior: así se
  // descubren poco a poco sin bloquear a nadie mucho tiempo.
  const temaAbierto = (indice: number) => {
    if (indice === 0) return true;
    const previas = TEMAS_FIGURAS[indice - 1].figuras;
    return previas.filter((f) => (hechas[f.id] ?? 0) > 0).length >= 2;
  };

  return (
    <div className="relative flex h-dvh flex-col overflow-hidden">
      <Fondo />

      <div className="relative z-10 flex shrink-0 items-center gap-3 px-3 pt-3 pb-2">
        <button
          onClick={onVolver}
          aria-label="Volver"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#d8c8a4] bg-[#fdf9ef]/85 text-[#6d5a3a] shadow backdrop-blur transition-transform active:scale-90"
        >
          <ChevronLeft size={22} strokeWidth={2.6} />
        </button>
        {!vp.bajaAltura && vp.ancho >= 360 && (
          <div className="shrink-0">
            <Mascot humor="feliz" size={46} />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-lg font-black text-[#4a3b22]">Álbum de figuras</h2>
          <p className="truncate text-[11px] font-semibold text-[#8a7a5c]">
            Bentos con forma, por temáticas
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-[#e2cf9c] bg-[#f2c14e]/25 px-3 py-1.5">
          <Star size={15} className="fill-[#f2c14e] text-[#b8860b]" />
          <span className="text-sm font-black tabular-nums text-[#b8860b]">
            {completadas}
            <span className="text-[11px] text-[#c0a861]">/{TOTAL_FIGURAS}</span>
          </span>
        </div>
      </div>

      <div className="relative z-10 min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-6">
        {TEMAS_FIGURAS.map((tema, ti) => {
          const abierto = temaAbierto(ti);
          const hechasTema = tema.figuras.filter((f) => (hechas[f.id] ?? 0) > 0).length;
          return (
            <section key={tema.id} className={ti === 0 ? "" : "mt-5"}>
              <div className="mb-2 flex items-center gap-2">
                <span className="text-base">{tema.emoji}</span>
                <span
                  className="text-[10px] font-black tracking-[0.2em] uppercase"
                  style={{ color: tema.color }}
                >
                  {tema.titulo}
                </span>
                <span className="h-px flex-1" style={{ background: `${tema.color}66` }} />
                <span className="text-[10px] font-black text-[#8a7a5c]">
                  {hechasTema}/{tema.figuras.length}
                </span>
              </div>

              {!abierto ? (
                <div className="flex items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-[#d8c8a4] bg-[#efe8d5]/50 px-4 py-5 text-center">
                  <Lock size={16} className="text-[#b3a586]" />
                  <span className="text-xs font-bold text-[#8a7a5c]">
                    Completa 2 figuras de {TEMAS_FIGURAS[ti - 1].titulo} para abrir esta temática
                  </span>
                </div>
              ) : (
                <div
                  className="grid gap-2.5"
                  style={{
                    gridTemplateColumns: `repeat(auto-fill, minmax(min(100%, ${ancho}px), 1fr))`,
                  }}
                >
                  {tema.figuras.map((figura, i) => {
                    const estrellas = hechas[figura.id] ?? 0;
                    const hecha = estrellas > 0;
                    return (
                      <motion.button
                        key={figura.id}
                        onClick={() => onElegir(figura.id)}
                        className={`relative flex flex-col gap-1.5 rounded-3xl border-2 p-2.5 shadow-[0_6px_18px_-8px_rgba(90,60,20,0.35)] transition-shadow ${
                          hecha
                            ? "border-[#e2d5b4] bg-[#fdf9ef]"
                            : "border-[#e2d5b4]/70 bg-[#fdf9ef]/85 hover:shadow-lg"
                        }`}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: Math.min(i * 0.03, 0.25),
                          type: "spring",
                          stiffness: 220,
                          damping: 20,
                        }}
                        whileHover={{ y: -4 }}
                        whileTap={{ scale: 0.96 }}
                      >
                        <Silueta figura={figura} color={tema.color} hecha={hecha} />
                        <div className="min-w-0">
                          <p className="truncate text-[13px] font-black text-[#4a3b22]">
                            {figura.nombre}
                          </p>
                          <p className="truncate text-[10px] font-semibold text-[#8a7a5c]">
                            {tamanoFigura(figura)} celdas
                          </p>
                        </div>
                        <div className="flex items-center justify-center gap-0.5">
                          {[1, 2, 3].map((n) => (
                            <Star
                              key={n}
                              size={14}
                              className={
                                n <= estrellas
                                  ? "fill-[#f2c14e] text-[#b8860b]"
                                  : "fill-[#eae0ca] text-[#d6cbb0]"
                              }
                            />
                          ))}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
