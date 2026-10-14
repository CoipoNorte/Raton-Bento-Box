/**
 * HUD — Pastillas flotantes y mínimas sobre la escena.
 * Translúcidas, sin robar altura: el tablero manda.
 */
import { ChevronLeft, Pause, Timer, Volume2, VolumeX } from "lucide-react";
import type { ReactNode } from "react";

interface Props {
  titulo: string;
  modo: "zen" | "servicio";
  sonidoActivo: boolean;
  compacto?: boolean;
  onVolver: () => void;
  onPausa: () => void;
  onAlternarSonido: () => void;
}

function Pastilla({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-w-0 items-center gap-2 overflow-hidden rounded-full border border-[#d8c8a4]/60 bg-[#fdf9ef]/80 px-3 py-1.5 shadow-[0_4px_14px_rgba(90,60,20,0.15)] backdrop-blur-md">
      {children}
    </div>
  );
}

function BotonHUD({
  onClick,
  label,
  children,
}: {
  onClick: () => void;
  label: string;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className="flex h-11 w-11 min-h-11 min-w-11 items-center justify-center rounded-full border border-[#d8c8a4]/60 bg-[#fdf9ef]/80 text-[#6d5a3a] shadow-[0_4px_14px_rgba(90,60,20,0.15)] backdrop-blur-md transition-transform active:scale-90"
    >
      {children}
    </button>
  );
}

export function HUD({
  titulo,
  modo,
  sonidoActivo,
  compacto = false,
  onVolver,
  onPausa,
  onAlternarSonido,
}: Props) {
  return (
    <div className="pointer-events-none absolute inset-x-2 top-1.5 z-40 flex items-start justify-between gap-2">
      <div className="pointer-events-auto flex min-w-0 items-center gap-2">
        <BotonHUD onClick={onVolver} label="Volver a niveles">
          <ChevronLeft size={22} strokeWidth={2.6} />
        </BotonHUD>
        {!compacto && (
          <Pastilla>
            {/* El título se recorta: nunca empuja a los botones */}
            <span className="truncate text-sm font-bold text-[#5c4a2e]">{titulo}</span>
            {modo === "servicio" && <Timer size={15} className="shrink-0 text-[#c0392b]" />}
          </Pastilla>
        )}
      </div>
      <div className="pointer-events-auto flex shrink-0 items-center gap-2">
        <BotonHUD onClick={onAlternarSonido} label={sonidoActivo ? "Silenciar" : "Activar sonido"}>
          {sonidoActivo ? (
            <Volume2 size={20} strokeWidth={2.4} />
          ) : (
            <VolumeX size={20} strokeWidth={2.4} />
          )}
        </BotonHUD>
        <BotonHUD onClick={onPausa} label="Pausa">
          <Pause size={20} strokeWidth={2.4} />
        </BotonHUD>
      </div>
    </div>
  );
}
