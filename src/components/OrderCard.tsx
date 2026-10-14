/**
 * OrderCard — La tarjeta del pedido del cliente.
 * Solo iconos: naranja lo que falta, verde lo que ya cuadra.
 * Nada de leer ni contar: el color manda.
 */
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { ColorGoshiki, PedidoItem } from "../game/types";
import { FoodSVG } from "./FoodSVG";

export const HEX_GOSHIKI: Record<ColorGoshiki, string> = {
  rojo: "#e34a4a",
  amarillo: "#f2c14e",
  verde: "#7fb069",
  blanco: "#faf7ef",
  negro: "#2e2a26",
};

interface Props {
  pedido: PedidoItem[];
  cumplidos: boolean[];
  compacto?: boolean;
}

export function OrderCard({ pedido, cumplidos, compacto = false }: Props) {
  return (
    <div
      className={
        compacto
          ? "flex min-w-0 items-center justify-center gap-2"
          : "flex w-full min-w-0 flex-col items-center gap-1.5"
      }
    >
      {!compacto && (
        <p className="text-center text-[10px] font-bold tracking-[0.18em] text-[#8a7a5c] uppercase">
          Pedido
        </p>
      )}
      <div className="flex max-w-full flex-wrap items-center justify-center gap-1.5">
        {pedido.map((item, i) => {
          const ok = cumplidos[i];
          return (
            <motion.div
              key={i}
              className="relative flex shrink-0 items-center gap-1 rounded-2xl px-2 py-1"
              style={{
                background: ok ? "rgba(127,176,105,0.22)" : "rgba(242,169,59,0.18)",
                border: `2px solid ${ok ? "#7fb069" : "#f2a93b"}`,
                minHeight: 40,
              }}
              animate={ok ? { scale: [1.15, 1] } : {}}
              transition={{ type: "spring", stiffness: 400, damping: 12 }}
              layout
            >
              {item.tipo === "ingrediente" ? (
                <FoodSVG id={item.id} celda={compacto ? 13 : 16} />
              ) : (
                <span
                  className="inline-block h-5 w-5 rounded-full"
                  style={{
                    background: HEX_GOSHIKI[item.color],
                    border: "2px solid rgba(0,0,0,0.2)",
                  }}
                />
              )}
              {item.n > 1 && (
                <span className="text-xs font-black text-[#5c4a2e]">×{item.n}</span>
              )}
              {ok && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#5c9a4e]">
                  <Check size={11} strokeWidth={3.5} className="text-white" />
                </span>
              )}
              {!ok && (
                <motion.span
                  className="h-2.5 w-2.5 rounded-full bg-[#f2a93b]"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.4, repeat: Infinity }}
                />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
