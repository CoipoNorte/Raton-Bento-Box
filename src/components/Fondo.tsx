/**
 * Fondo — Papel washi, madera clara y vaporcito lento.
 * Decoración pura: no captura eventos ni roba rendimiento.
 */
import { motion, useReducedMotion } from "framer-motion";

export function Fondo() {
  const reduce = useReducedMotion();
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Base de papel washi */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(1200px 700px at 20% -10%, #fff8ea 0%, transparent 55%)," +
            "radial-gradient(900px 600px at 110% 10%, #fdeef0 0%, transparent 50%)," +
            "radial-gradient(1000px 800px at 50% 120%, #e9f0e2 0%, transparent 55%)," +
            "linear-gradient(180deg, #f7f1e3 0%, #f3ead6 100%)",
        }}
      />
      {/* Fibra sutil del papel */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #8a7a5c 0 1px, transparent 1px 7px)," +
            "repeating-linear-gradient(-45deg, #8a7a5c 0 1px, transparent 1px 9px)",
        }}
      />
      {/* Círculos de bambú y sakura difusos */}
      <div className="absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-[#7fb069]/12 blur-3xl" />
      <div className="absolute -right-20 bottom-1/4 h-80 w-80 rounded-full bg-[#f2a9c2]/14 blur-3xl" />
      {/* Vapor lento */}
      {!reduce &&
        [0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute h-24 w-24 rounded-full bg-white/45 blur-2xl"
            style={{ left: `${14 + i * 34}%`, bottom: -40 }}
            animate={{ y: [0, -320], opacity: [0, 0.6, 0], x: [0, 22, -14, 0] }}
            transition={{
              duration: 11 + i * 3,
              repeat: Infinity,
              delay: i * 3.5,
              ease: "easeInOut",
            }}
          />
        ))}
    </div>
  );
}
