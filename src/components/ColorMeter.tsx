/**
 * ColorMeter — Medidor goshiki: 5 puntitos que se encienden.
 * La capa táctica del bento: rojo, amarillo, verde, blanco y negro.
 * Al completarse, dorado y celebración.
 */
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { ORDEN_GOSHIKI } from "../game/types";
import type { ColorGoshiki } from "../game/types";
import { HEX_GOSHIKI } from "./OrderCard";

interface Props {
  activos: Set<ColorGoshiki>;
  compacto?: boolean;
}

export function ColorMeter({ activos, compacto = false }: Props) {
  const completo = ORDEN_GOSHIKI.every((c) => activos.has(c));
  return (
    <div className="flex min-w-0 shrink-0 items-center gap-2">
      <div
        className="flex items-center gap-1 rounded-full px-2.5 py-1.5"
        style={{
          background: completo ? "rgba(242,201,76,0.3)" : "rgba(255,252,244,0.75)",
          border: `2px solid ${completo ? "#d9a62e" : "rgba(150,120,70,0.25)"}`,
          boxShadow: completo ? "0 0 14px rgba(242,201,76,0.55)" : "none",
          minHeight: 40,
        }}
      >
        {ORDEN_GOSHIKI.map((c) => {
          const encendido = activos.has(c);
          return (
            <motion.span
              key={`${c}-${encendido}`}
              className="inline-block rounded-full"
              style={{
                width: compacto ? 13 : 16,
                height: compacto ? 13 : 16,
                background: encendido ? HEX_GOSHIKI[c] : "rgba(120,100,70,0.18)",
                border:
                  c === "blanco" && encendido
                    ? "2px solid rgba(0,0,0,0.25)"
                    : "2px solid transparent",
                boxShadow: encendido ? `0 0 8px ${HEX_GOSHIKI[c]}88` : "none",
              }}
              initial={encendido ? { scale: 0 } : false}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 14 }}
            />
          );
        })}
        {completo && (
          <motion.span
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 12 }}
          >
            <Sparkles size={compacto ? 14 : 17} className="text-[#b8860b]" />
          </motion.span>
        )}
      </div>
      {!compacto && (
        <span className="text-[10px] font-bold tracking-widest text-[#8a7a5c] uppercase">
          Goshiki
        </span>
      )}
    </div>
  );
}
