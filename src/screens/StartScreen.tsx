/**
 * StartScreen — Portada acogedora.
 * Título, Mochi saludando, modo Zen/Servicio y preferencias de sonido.
 */
import { motion } from "framer-motion";
import {
  CloudRain,
  Infinity as IconoInfinito,
  Grid3X3,
  Lock as IconoCandado,
  Play,
  Shapes,
  Star,
  Timer,
  Volume2,
  VolumeX,
  Waves,
} from "lucide-react";
import { useViewport } from "../hooks/useViewport";
import type { Preferencias } from "../game/types";
import { Fondo } from "../components/Fondo";
import { Mascot } from "../components/Mascot";
import { Sakura } from "../components/Sakura";

interface Props {
  prefs: Preferencias;
  estrellasTotales: number;
  servicioDesbloqueado: boolean;
  carreraDesbloqueada: boolean;
  mejorRondaCarrera: number;
  popDesbloqueado: boolean;
  mejorPuntosPop: number;
  figurasDesbloqueadas: boolean;
  figurasHechas: number;
  totalFiguras: number;
  onJugar: () => void;
  onCarrera: () => void;
  onBentoPop: () => void;
  onFiguras: () => void;
  onPreferencias: (p: Preferencias) => void;
}

export function StartScreen({
  prefs,
  estrellasTotales,
  servicioDesbloqueado,
  carreraDesbloqueada,
  mejorRondaCarrera,
  popDesbloqueado,
  mejorPuntosPop,
  figurasDesbloqueadas,
  figurasHechas,
  totalFiguras,
  onJugar,
  onCarrera,
  onBentoPop,
  onFiguras,
  onPreferencias,
}: Props) {
  const vp = useViewport();

  const compacto = vp.bajaAltura || vp.alto < 600;

  return (
    <div className="relative flex h-dvh flex-col items-center justify-center overflow-y-auto px-4 py-4">
      <Fondo />
      <Sakura cantidad={18} />

      <motion.div
        className="relative z-10 my-auto flex w-full max-w-md flex-col items-center gap-2 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 16 }}
      >
        <Mascot humor="feliz" size={compacto ? 76 : 120} />
        {!compacto && (
          <p className="text-xs font-bold tracking-[0.35em] text-[#a03127] uppercase">
            Itadakimasu
          </p>
        )}
        <h1
          className="font-black tracking-tight text-[#4a3b22]"
          style={{ fontSize: "clamp(1.9rem, 8vw, 3rem)", lineHeight: 1.1 }}
        >
          Ratón Bento <span className="text-[#a03127]">Box</span>
        </h1>
        {!compacto && (
          <p className="max-w-xs text-sm font-semibold text-[#8a7a5c]">
            Ordena, encaja y cierra la tapa con ese <em>clic</em> perfecto.
          </p>
        )}

        {/* Selector de modo */}
        <div className="mt-1 flex max-w-full flex-wrap justify-center rounded-full border-2 border-[#d8c8a4] bg-[#fdf9ef] p-1 shadow-inner">
          {(
            [
              { id: "zen", icono: <Waves size={16} />, texto: "Zen" },
              { id: "servicio", icono: <Timer size={16} />, texto: "Servicio" },
            ] as const
          ).map((m) => {
            const activo = prefs.modo === m.id;
            const bloqueado = m.id === "servicio" && !servicioDesbloqueado;
            return (
              <button
                key={m.id}
                disabled={bloqueado}
                onClick={() => onPreferencias({ ...prefs, modo: m.id })}
                className={`flex min-h-11 items-center gap-1.5 rounded-full px-4 text-sm font-black transition-all ${
                  activo
                    ? "bg-[#a03127] text-[#fdf6ea] shadow"
                    : bloqueado
                      ? "text-[#c3b596]"
                      : "text-[#8a7a5c]"
                }`}
                title={bloqueado ? "Complétalo en Zen hasta el nivel 3" : undefined}
              >
                {m.icono}
                {m.texto}
                {bloqueado && <span className="text-[10px]">nv.3</span>}
              </button>
            );
          })}
        </div>

        <motion.button
          onClick={onJugar}
          className="mt-1 flex h-14 items-center gap-2 rounded-full bg-[#a03127] px-10 text-lg font-black text-[#fdf6ea] shadow-[0_14px_30px_-8px_rgba(160,49,39,0.65)]"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.94 }}
        >
          <Play size={22} className="fill-current" /> Jugar
        </motion.button>

        {/* Modos infinitos */}
        <div className="flex max-w-full flex-wrap justify-center gap-2">
          <motion.button
            onClick={carreraDesbloqueada ? onCarrera : undefined}
            disabled={!carreraDesbloqueada}
            className={`flex h-12 items-center gap-2 rounded-full border-2 px-4 text-xs font-black transition-colors ${
              carreraDesbloqueada
                ? "border-[#5c9a4e] bg-[#5c9a4e]/15 text-[#44752f]"
                : "border-[#d8c8a4] bg-white/50 text-[#b3a586]"
            }`}
            whileHover={carreraDesbloqueada ? { scale: 1.04 } : {}}
            whileTap={carreraDesbloqueada ? { scale: 0.94 } : {}}
            title={carreraDesbloqueada ? "Cajas infinitas contrarreloj" : "Completa el nivel 2"}
          >
            <IconoInfinito size={17} strokeWidth={2.8} /> Carrera
            {carreraDesbloqueada && mejorRondaCarrera > 0 && (
              <span className="rounded-full bg-[#44752f] px-2 py-0.5 text-[9px] text-white">{mejorRondaCarrera}</span>
            )}
            {!carreraDesbloqueada && <IconoCandado size={13} />}
          </motion.button>

          <motion.button
            onClick={popDesbloqueado ? onBentoPop : undefined}
            disabled={!popDesbloqueado}
            className={`flex h-12 items-center gap-2 rounded-full border-2 px-4 text-xs font-black transition-colors ${
              popDesbloqueado
                ? "border-[#d99a3d] bg-[#f2c14e]/18 text-[#9a651c]"
                : "border-[#d8c8a4] bg-white/50 text-[#b3a586]"
            }`}
            whileHover={popDesbloqueado ? { scale: 1.04 } : {}}
            whileTap={popDesbloqueado ? { scale: 0.94 } : {}}
            title={popDesbloqueado ? "Sirve líneas de comida" : "Completa el nivel 3"}
          >
            <Grid3X3 size={17} /> Bento Pop
            {popDesbloqueado && mejorPuntosPop > 0 && (
              <span className="rounded-full bg-[#b8860b] px-2 py-0.5 text-[9px] text-white">{mejorPuntosPop.toLocaleString("es")}</span>
            )}
            {!popDesbloqueado && <IconoCandado size={13} />}
          </motion.button>

          {/* Modo Figuras: bentos con silueta, por temáticas */}
          <motion.button
            onClick={figurasDesbloqueadas ? onFiguras : undefined}
            disabled={!figurasDesbloqueadas}
            className={`flex h-12 items-center gap-2 rounded-full border-2 px-4 text-xs font-black transition-colors ${
              figurasDesbloqueadas
                ? "border-[#a78bc9] bg-[#a78bc9]/18 text-[#6f52a0]"
                : "border-[#d8c8a4] bg-white/50 text-[#b3a586]"
            }`}
            whileHover={figurasDesbloqueadas ? { scale: 1.04 } : {}}
            whileTap={figurasDesbloqueadas ? { scale: 0.94 } : {}}
            title={figurasDesbloqueadas ? "Bentos con forma" : "Completa el nivel 4"}
          >
            <Shapes size={17} /> Figuras
            {figurasDesbloqueadas && (
              <span className="rounded-full bg-[#6f52a0] px-2 py-0.5 text-[9px] text-white">
                {figurasHechas}/{totalFiguras}
              </span>
            )}
            {!figurasDesbloqueadas && <IconoCandado size={13} />}
          </motion.button>
        </div>

        {estrellasTotales > 0 && (
          <div className="flex items-center gap-1.5 rounded-full bg-[#f2c14e]/25 px-3 py-1 text-sm font-black text-[#b8860b]">
            <Star size={15} className="fill-current" /> {estrellasTotales}
          </div>
        )}

        {/* Sonido */}
        <div className="mt-0.5 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => onPreferencias({ ...prefs, sonido: !prefs.sonido })}
            className="flex min-h-11 items-center gap-2 rounded-full border border-[#d8c8a4]/70 bg-white/70 px-4 text-xs font-bold text-[#6d5a3a] backdrop-blur"
          >
            {prefs.sonido ? <Volume2 size={16} /> : <VolumeX size={16} />}
            Sonido {prefs.sonido ? "ON" : "OFF"}
          </button>
          <button
            onClick={() => onPreferencias({ ...prefs, ambiente: !prefs.ambiente })}
            className="flex min-h-11 items-center gap-2 rounded-full border border-[#d8c8a4]/70 bg-white/70 px-4 text-xs font-bold text-[#6d5a3a] backdrop-blur"
          >
            <CloudRain size={16} />
            Lluvia {prefs.ambiente ? "ON" : "OFF"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
