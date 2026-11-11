/**
 * LevelSelect — La carta del día (72 niveles en nueve temporadas).
 *
 * Dos cuidados de rendimiento:
 *  · Las cajas con semilla solo se construyen si su temporada está
 *    desbloqueada; las futuras se muestran con un cartel cerrado.
 *  · Al abrir la carta hacemos scroll hasta el nivel en curso, para no
 *    obligar a recorrer decenas de tarjetas.
 */
import { motion } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";
import { ChevronLeft, Lock, Star } from "lucide-react";
import { TEMPORADAS, TOTAL_NIVELES, nivelPorId, resumenNiveles } from "../game/levels";
import type { NivelDef, Progreso } from "../game/types";
import { Fondo } from "../components/Fondo";
import { Mascot } from "../components/Mascot";
import { useViewport } from "../hooks/useViewport";

interface Props {
  progreso: Progreso;
  onElegir: (nivelId: number) => void;
  onVolver: () => void;
}

/** Paleta de relleno por compartimento: cada caja se ve apetecible. */
const TINTES = [
  "#f6c945",
  "#f2765c",
  "#7fb069",
  "#faf7ef",
  "#e8a0b4",
  "#d99a3d",
  "#9bc4e2",
  "#c9b8e8",
];

/** Miniatura fiel de la caja: marco de laca + compartimentos reales. */
function Miniatura({ nivel, apagado }: { nivel: NivelDef; apagado: boolean }) {
  return (
    <div
      className="relative w-full overflow-hidden rounded-xl p-[6px] shadow-inner"
      style={{
        aspectRatio: `${nivel.cols}/${nivel.rows}`,
        background: apagado
          ? "linear-gradient(160deg,#a99a86,#8d8070)"
          : "linear-gradient(160deg,#a03127,#6d1f18)",
      }}
    >
      <div className="relative h-full w-full rounded-md" style={{ background: "#e6dcc4" }}>
        {nivel.compartimentos.map((c, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${(c.x / nivel.cols) * 100}%`,
              top: `${(c.y / nivel.rows) * 100}%`,
              width: `${(c.w / nivel.cols) * 100}%`,
              height: `${(c.h / nivel.rows) * 100}%`,
              padding: 1.5,
            }}
          >
            <div
              className="h-full w-full rounded-[3px]"
              style={{
                background: apagado ? "#cfc5b2" : TINTES[i % TINTES.length],
                opacity: apagado ? 0.6 : 0.95,
                boxShadow: "inset 0 1px 2px rgba(120,90,40,0.25)",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function LevelSelect({ progreso, onElegir, onVolver }: Props) {
  const vp = useViewport();
  const resumen = useMemo(() => resumenNiveles(), []);
  const estrellasTotales = Object.values(progreso.estrellas).reduce((a, b) => a + b, 0);
  const maximoEstrellas = TOTAL_NIVELES * 3;

  // Tarjetas grandes: 2 columnas en móvil, más en pantallas anchas.
  const anchoTarjeta = vp.ancho < 420 ? 150 : vp.bajaAltura ? 160 : 190;

  // Al abrir la carta, saltamos al nivel en curso.
  const actualRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    const t = window.setTimeout(
      () => actualRef.current?.scrollIntoView({ block: "center", behavior: "auto" }),
      40,
    );
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div className="relative flex h-dvh flex-col overflow-hidden">
      <Fondo />

      {/* Cabecera fija */}
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
          <h2 className="truncate text-lg font-black text-[#4a3b22]">La carta del día</h2>
          <p className="truncate text-[11px] font-semibold text-[#8a7a5c]">
            {TOTAL_NIVELES} bentos · nivel {Math.min(progreso.nivelMax, TOTAL_NIVELES)}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-[#e2cf9c] bg-[#f2c14e]/25 px-3 py-1.5">
          <Star size={15} className="fill-[#f2c14e] text-[#b8860b]" />
          <span className="text-sm font-black tabular-nums text-[#b8860b]">
            {estrellasTotales}
            <span className="text-[11px] text-[#c0a861]">/{maximoEstrellas}</span>
          </span>
        </div>
      </div>

      {/* Zona scrolleable: aquí vive toda la carta */}
      <div className="relative z-10 min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-6">
        {TEMPORADAS.map((temp, ti) => {
          const ids = resumen.filter((n) => n.id >= temp.desde && n.id <= temp.hasta);
          // Temporada entera por descubrir: no construimos sus cajas.
          const cerrada = temp.desde > progreso.nivelMax;
          const estrellasTemp = ids.reduce(
            (a, n) => a + (progreso.estrellas[n.id] ?? 0),
            0,
          );

          return (
            <section key={temp.titulo} className={ti === 0 ? "" : "mt-5"}>
              <div className="mb-2 flex items-center gap-2">
                <span className="text-[10px] font-black tracking-[0.2em] text-[#a03127] uppercase">
                  {temp.titulo}
                </span>
                <span className="h-px flex-1 bg-[#d8c8a4]" />
                <span className="flex items-center gap-1 text-[10px] font-black text-[#b8860b]">
                  <Star size={11} className="fill-[#f2c14e] text-[#b8860b]" />
                  {estrellasTemp}/{ids.length * 3}
                </span>
              </div>

              {cerrada ? (
                <div className="flex items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-[#d8c8a4] bg-[#efe8d5]/50 px-4 py-5 text-center">
                  <Lock size={16} className="text-[#b3a586]" />
                  <span className="text-xs font-bold text-[#8a7a5c]">
                    Completa el nivel {temp.desde - 1} para abrir esta temporada
                  </span>
                </div>
              ) : (
                <div
                  className="grid gap-3"
                  style={{
                    gridTemplateColumns: `repeat(auto-fill, minmax(min(100%, ${anchoTarjeta}px), 1fr))`,
                  }}
                >
                  {ids.map((info, i) => {
                    const bloqueado = info.id > progreso.nivelMax;
                    const estrellas = progreso.estrellas[info.id] ?? 0;
                    const esSiguiente = info.id === progreso.nivelMax;
                    // La caja solo se construye si se va a ver de verdad.
                    const nivel = nivelPorId(info.id);
                    return (
                      <motion.button
                        key={info.id}
                        ref={esSiguiente ? actualRef : undefined}
                        disabled={bloqueado}
                        onClick={() => onElegir(info.id)}
                        className={`relative flex flex-col gap-2 rounded-3xl border-2 p-3 text-left shadow-[0_6px_18px_-8px_rgba(90,60,20,0.35)] transition-shadow ${
                          bloqueado
                            ? "border-[#ddd2b8] bg-[#efe8d5]/70"
                            : esSiguiente
                              ? "border-[#a03127] bg-[#fdf9ef] ring-2 ring-[#a03127]/25"
                              : "border-[#e2d5b4] bg-[#fdf9ef] hover:shadow-lg"
                        }`}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: Math.min(i * 0.03, 0.25),
                          type: "spring",
                          stiffness: 220,
                          damping: 20,
                        }}
                        whileHover={bloqueado ? {} : { y: -4 }}
                        whileTap={bloqueado ? {} : { scale: 0.96 }}
                      >
                        <span
                          className={`absolute -top-2 -left-2 z-10 flex h-7 min-w-7 items-center justify-center rounded-full px-1.5 text-xs font-black shadow ${
                            bloqueado ? "bg-[#c9bda4] text-white" : "bg-[#a03127] text-[#fdf6ea]"
                          }`}
                        >
                          {info.id}
                        </span>

                        {bloqueado && (
                          <span className="absolute -top-2 -right-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-[#b3a586] text-white shadow">
                            <Lock size={13} strokeWidth={2.8} />
                          </span>
                        )}
                        {esSiguiente && (
                          <motion.span
                            className="absolute -top-2 -right-2 z-10 rounded-full bg-[#5c9a4e] px-2 py-1 text-[9px] font-black tracking-wide text-white uppercase shadow"
                            animate={{ scale: [1, 1.08, 1] }}
                            transition={{ duration: 1.8, repeat: Infinity }}
                          >
                            Jugar
                          </motion.span>
                        )}

                        <Miniatura nivel={nivel} apagado={bloqueado} />

                        <div className="min-w-0">
                          <p className="truncate text-sm font-black text-[#4a3b22]">
                            {info.nombre}
                          </p>
                          <p className="truncate text-[11px] font-semibold text-[#8a7a5c]">
                            {nivel.cols}×{nivel.rows} · {nivel.compartimentos.length} huecos
                          </p>
                        </div>

                        <div className="flex items-center justify-center gap-1">
                          {[1, 2, 3].map((n) => (
                            <Star
                              key={n}
                              size={18}
                              className={
                                n <= estrellas
                                  ? "fill-[#f2c14e] text-[#b8860b] drop-shadow-[0_1px_2px_rgba(242,193,78,0.5)]"
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
