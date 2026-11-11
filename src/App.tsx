/**
 * App — Orquestador: portada → carta de niveles → mesa de juego,
 * más el MODO CARRERA con cajas procedurales encadenadas.
 * Conserva progreso y preferencias, e inicializa el audio al primer
 * gesto del usuario (requisito de los navegadores).
 */
import { useCallback, useEffect, useMemo, useState } from "react";

import { generarNivelCarrera } from "./game/generator";
import { TOTAL_FIGURAS, nivelDeFigura } from "./game/figuras";
import { TOTAL_NIVELES, nivelPorId } from "./game/levels";
import {
  guardarPreferencias,
  obtenerPreferencias,
  obtenerProgreso,
  registrarCarrera,
  registrarBentoPop,
  registrarFigura,
  registrarEstrellas,
} from "./game/storage";
import { ambiente, inicializarAudio, setSilencio } from "./game/sound";
import * as snd from "./game/sound";
import type { Preferencias, Progreso } from "./game/types";

import { CareerEnd } from "./screens/CareerEnd";
import { BentoPopScreen } from "./screens/BentoPopScreen";
import { FiguraSelect } from "./screens/FiguraSelect";
import { GameScreen } from "./screens/GameScreen";
import { LevelSelect } from "./screens/LevelSelect";
import { StartScreen } from "./screens/StartScreen";

/** Segundos de regalo por cada caja servida en Carrera. */
const BONUS_TIEMPO_BASE = 18;

type Pantalla =
  | { tipo: "inicio" }
  | { tipo: "niveles" }
  | { tipo: "juego"; nivelId: number }
  | { tipo: "carrera" }
  | { tipo: "bentoPop" }
  | { tipo: "figuras" }
  | { tipo: "figura"; figuraId: string }
  | { tipo: "carreraFin"; rondas: number; puntos: number; esRecord: boolean };

/** Estado vivo de una partida de Carrera. */
interface PartidaCarrera {
  ronda: number;
  puntos: number;
  tiempo: number;
  semilla: number;
}

export default function App() {
  const [pantalla, setPantalla] = useState<Pantalla>({ tipo: "inicio" });
  const [progreso, setProgreso] = useState<Progreso>(obtenerProgreso);
  const [prefs, setPrefs] = useState<Preferencias>(obtenerPreferencias);
  const [carrera, setCarrera] = useState<PartidaCarrera | null>(null);

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
      setProgreso(registrarEstrellas(nivelId, estrellas, puntos, TOTAL_NIVELES));
    },
    [],
  );

  /* --------------------------- modo Carrera --------------------------- */

  const empezarCarrera = useCallback(() => {
    const semilla = Math.floor(Math.random() * 1_000_000);
    const primera = generarNivelCarrera({ ronda: 1, semilla });
    setCarrera({ ronda: 1, puntos: 0, tiempo: primera.tiempo, semilla });
    setPantalla({ tipo: "carrera" });
  }, []);

  /** Figura en juego: se tesela una vez y queda memorizada. */
  const nivelFigura = useMemo(
    () => (pantalla.tipo === "figura" ? nivelDeFigura(pantalla.figuraId) : null),
    [pantalla],
  );

  /** Caja procedural de la ronda actual (estable mientras no cambie). */
  const nivelCarrera = useMemo(
    () =>
      carrera
        ? generarNivelCarrera({
            ronda: carrera.ronda,
            semilla: carrera.semilla + carrera.ronda * 104729,
          })
        : null,
    [carrera],
  );

  /** Caja servida: suma puntos, regala tiempo y entra el siguiente pedido. */
  const carreraCompletada = useCallback(
    (tiempoRestante: number, puntos: number) => {
      setCarrera((c) => {
        if (!c) return c;
        // El tiempo sobrante se hereda, más un bonus que mengua con las rondas.
        const bonus = Math.max(9, BONUS_TIEMPO_BASE - Math.floor(c.ronda / 2));
        const siguiente = generarNivelCarrera({
          ronda: c.ronda + 1,
          semilla: c.semilla + (c.ronda + 1) * 104729,
        });
        return {
          ...c,
          ronda: c.ronda + 1,
          puntos: c.puntos + puntos + tiempoRestante * 5,
          // Nunca por debajo del tiempo propio de la caja nueva.
          tiempo: Math.max(siguiente.tiempo, tiempoRestante + bonus),
        };
      });
    },
    [],
  );

  /**
   * Se acabó el reloj: guarda el récord y muestra el resumen.
   * Los efectos van fuera de cualquier updater para no duplicarse
   * con la doble invocación de React en modo estricto.
   */
  const carreraFin = useCallback(() => {
    if (!carrera) return;
    const rondas = carrera.ronda - 1;
    const esRecord =
      carrera.puntos > (progreso.mejorPuntosCarrera ?? 0) ||
      rondas > (progreso.mejorRondaCarrera ?? 0);
    setProgreso(registrarCarrera(rondas, carrera.puntos));
    setPantalla({ tipo: "carreraFin", rondas, puntos: carrera.puntos, esRecord });
    setCarrera(null);
    snd.invalido();
  }, [carrera, progreso.mejorPuntosCarrera, progreso.mejorRondaCarrera]);

  /* ------------------------------ render ------------------------------ */

  const estrellasTotales = Object.values(progreso.estrellas).reduce((a, b) => a + b, 0);
  const servicioDesbloqueado = progreso.nivelMax >= 4;
  const carreraDesbloqueada = progreso.nivelMax >= 3;
  const popDesbloqueado = progreso.nivelMax >= 4;
  const figurasDesbloqueadas = progreso.nivelMax >= 5;

  return (
    <div className="h-dvh w-full overflow-hidden bg-[#f7f1e3] font-sans">
      {pantalla.tipo === "inicio" && (
        <StartScreen
          prefs={prefs}
          estrellasTotales={estrellasTotales}
          servicioDesbloqueado={servicioDesbloqueado}
          carreraDesbloqueada={carreraDesbloqueada}
          mejorRondaCarrera={progreso.mejorRondaCarrera ?? 0}
          popDesbloqueado={popDesbloqueado}
          mejorPuntosPop={progreso.mejorPuntosPop ?? 0}
          figurasDesbloqueadas={figurasDesbloqueadas}
          figurasHechas={
            Object.values(progreso.figuras ?? {}).filter((e) => e > 0).length
          }
          totalFiguras={TOTAL_FIGURAS}
          onJugar={() => setPantalla({ tipo: "niveles" })}
          onCarrera={empezarCarrera}
          onBentoPop={() => setPantalla({ tipo: "bentoPop" })}
          onFiguras={() => setPantalla({ tipo: "figuras" })}
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
          nivel={nivelPorId(pantalla.nivelId)}
          prefs={prefs}
          modoJuego={prefs.modo}
          esUltimo={pantalla.nivelId >= TOTAL_NIVELES}
          onSalir={() => setPantalla({ tipo: "niveles" })}
          onCompletado={cuandoCompleta}
          onSiguiente={() =>
            setPantalla({
              tipo: "juego",
              nivelId: Math.min(pantalla.nivelId + 1, TOTAL_NIVELES),
            })
          }
          onAlternarSonido={() => setPrefs((p) => ({ ...p, sonido: !p.sonido }))}
        />
      )}

      {pantalla.tipo === "carrera" && carrera && nivelCarrera && (
        <GameScreen
          key={`carrera-${carrera.ronda}`}
          nivel={nivelCarrera}
          prefs={prefs}
          modoJuego="carrera"
          esUltimo={false}
          carrera={{
            ronda: carrera.ronda,
            puntos: carrera.puntos,
            tiempoInicial: carrera.tiempo,
            mejorRonda: progreso.mejorRondaCarrera ?? 0,
          }}
          onSalir={() => {
            setCarrera(null);
            setPantalla({ tipo: "inicio" });
          }}
          onCompletado={() => {}}
          onSiguiente={() => {}}
          onAlternarSonido={() => setPrefs((p) => ({ ...p, sonido: !p.sonido }))}
          onCarreraCompletada={carreraCompletada}
          onCarreraFin={carreraFin}
        />
      )}

      {pantalla.tipo === "carreraFin" && (
        <CareerEnd
          rondas={pantalla.rondas}
          puntos={pantalla.puntos}
          mejorRonda={progreso.mejorRondaCarrera ?? 0}
          mejorPuntos={progreso.mejorPuntosCarrera ?? 0}
          esRecord={pantalla.esRecord}
          onReintentar={empezarCarrera}
          onSalir={() => setPantalla({ tipo: "inicio" })}
        />
      )}

      {pantalla.tipo === "bentoPop" && (
        <BentoPopScreen
          mejor={progreso.mejorPuntosPop ?? 0}
          onSalir={() => setPantalla({ tipo: "inicio" })}
          onFin={(puntos) => setProgreso(registrarBentoPop(puntos))}
        />
      )}

      {pantalla.tipo === "figuras" && (
        <FiguraSelect
          progreso={progreso}
          onElegir={(figuraId) => setPantalla({ tipo: "figura", figuraId })}
          onVolver={() => setPantalla({ tipo: "inicio" })}
        />
      )}

      {pantalla.tipo === "figura" && nivelFigura && (
        <GameScreen
          key={`figura-${pantalla.figuraId}`}
          nivel={nivelFigura}
          prefs={prefs}
          // Las figuras son coleccionismo tranquilo: siempre sin reloj.
          modoJuego="zen"
          esUltimo
          onSalir={() => setPantalla({ tipo: "figuras" })}
          onCompletado={(_, estrellas, puntos) =>
            setProgreso(registrarFigura(pantalla.figuraId, estrellas, puntos))
          }
          onSiguiente={() => setPantalla({ tipo: "figuras" })}
          onAlternarSonido={() => setPrefs((p) => ({ ...p, sonido: !p.sonido }))}
        />
      )}
    </div>
  );
}
