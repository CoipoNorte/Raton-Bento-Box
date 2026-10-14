/**
 * App — Orquestador: portada → carta de niveles → mesa de juego.
 * Conserva progreso y preferencias, e inicializa el audio al primer
 * gesto del usuario (requisito de los navegadores).
 */
import { useCallback, useEffect, useState } from "react";

import { NIVELES } from "./game/levels";
import {
  guardarPreferencias,
  obtenerPreferencias,
  obtenerProgreso,
  registrarEstrellas,
} from "./game/storage";
import { ambiente, inicializarAudio, setSilencio } from "./game/sound";
import type { Preferencias, Progreso } from "./game/types";

import { GameScreen } from "./screens/GameScreen";
import { LevelSelect } from "./screens/LevelSelect";
import { StartScreen } from "./screens/StartScreen";

type Pantalla =
  | { tipo: "inicio" }
  | { tipo: "niveles" }
  | { tipo: "juego"; nivelId: number };

export default function App() {
  const [pantalla, setPantalla] = useState<Pantalla>({ tipo: "inicio" });
  const [progreso, setProgreso] = useState<Progreso>(obtenerProgreso);
  const [prefs, setPrefs] = useState<Preferencias>(obtenerPreferencias);

  // Los navegadores exigen un gesto antes de crear el AudioContext.
  useEffect(() => {
    const despertar = () => inicializarAudio();
    window.addEventListener("pointerdown", despertar, { once: true });
    return () => window.removeEventListener("pointerdown", despertar);
  }, []);

  // Aplica y persiste las preferencias sonoras.
  useEffect(() => {
    setSilencio(!prefs.sonido);
    guardarPreferencias(prefs);
  }, [prefs]);

  useEffect(() => {
    ambiente(prefs.ambiente && prefs.sonido);
  }, [prefs.ambiente, prefs.sonido]);

  const actualizarPrefs = useCallback((p: Preferencias) => setPrefs(p), []);

  const cuandoCompleta = useCallback(
    (nivelId: number, estrellas: number, puntos: number) => {
      setProgreso(registrarEstrellas(nivelId, estrellas, puntos, NIVELES.length));
    },
    [],
  );

  const estrellasTotales = Object.values(progreso.estrellas).reduce(
    (a, b) => a + b,
    0,
  );
  const servicioDesbloqueado = progreso.nivelMax >= 4;

  return (
    <div className="h-dvh w-full overflow-hidden bg-[#f7f1e3] font-sans">
      {pantalla.tipo === "inicio" && (
        <StartScreen
          prefs={prefs}
          estrellasTotales={estrellasTotales}
          servicioDesbloqueado={servicioDesbloqueado}
          onJugar={() => setPantalla({ tipo: "niveles" })}
          onPreferencias={actualizarPrefs}
        />
      )}

      {pantalla.tipo === "niveles" && (
        <LevelSelect
          progreso={progreso}
          onElegir={(nivelId) => setPantalla({ tipo: "juego", nivelId })}
          onVolver={() => setPantalla({ tipo: "inicio" })}
        />
      )}

      {pantalla.tipo === "juego" && (
        <GameScreen
          key={`${pantalla.nivelId}-${prefs.modo}`}
          nivelId={pantalla.nivelId}
          prefs={prefs}
          totalNiveles={NIVELES.length}
          onSalir={() => setPantalla({ tipo: "niveles" })}
          onCompletado={cuandoCompleta}
          onSiguiente={() =>
            setPantalla({
              tipo: "juego",
              nivelId: Math.min(pantalla.nivelId + 1, NIVELES.length),
            })
          }
          onAlternarSonido={() => setPrefs((p) => ({ ...p, sonido: !p.sonido }))}
        />
      )}
    </div>
  );
}
