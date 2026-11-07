/**
 * BentoPopScreen — Bento Pop: la caja que crece contrarreloj.
 *
 * Arrancas en 2×2 con 2:59 en el reloj. Cada línea de extremo a extremo
 * suma 15 s y acerca la ampliación; el cuadro dorado central suma 2 s.
 * Al cubrir el cupo de líneas, la caja gana una fila y una columna por
 * cada lado (2→4→6→8) y lo colocado se recentra.
 */
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  Crown,
  Gamepad2,
  Grid3X3,
  Keyboard,
  Maximize2,
  RotateCw,
  Sparkles,
} from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { BentoPopBoard, ladoCajaPop, margenPop, HUECO_POP } from "../components/BentoPopBoard";
import type { FantasmaPop } from "../components/BentoPopBoard";
import { Fondo } from "../components/Fondo";
import { FoodSVG } from "../components/FoodSVG";
import { Mascot } from "../components/Mascot";
import {
  BONUS_TIEMPO_CENTRO,
  BONUS_TIEMPO_LINEA,
  TAM_MAX,
  TAM_MIN,
  TIEMPO_INICIAL,
  ampliarTablero,
  colocarPop,
  crearBandejaPop,
  cupoAmpliacion,
  dimensionesPiezaPop,
  hayMovimientoPop,
  puedeColocarPop,
  puntosAmpliacion,
  puntosPop,
  tableroPopVacio,
} from "../game/bentoPop";
import type { PiezaPop, TableroPop } from "../game/bentoPop";
import { INGREDIENTES } from "../game/ingredients";
import * as snd from "../game/sound";
import { useTapSinArrastre } from "../hooks/useTapSinArrastre";
import type { Punto } from "../hooks/useTapSinArrastre";
import { useViewport } from "../hooks/useViewport";

type Fase = "tutorial" | "jugando" | "fin";

interface ArrastrePop {
  pieza: PiezaPop;
  punto: Punto;
  fx: number;
  fy: number;
}

interface Props {
  mejor: number;
  onSalir: () => void;
  onFin: (puntos: number) => void;
}

/** Mayor celda cuya caja completa cabe en el área disponible. */
function calcularCeldaPop(w: number, h: number, tam: number) {
  for (let c = 96; c >= 18; c--) {
    const lado = ladoCajaPop(c, tam);
    if (lado <= w && lado <= h) return c;
  }
  return 18;
}

const reloj = (s: number) =>
  `${Math.floor(Math.max(0, s) / 60)}:${String(Math.max(0, Math.floor(s % 60))).padStart(2, "0")}`;

export function BentoPopScreen({ mejor, onSalir, onFin }: Props) {
  const vp = useViewport();
  const [fase, setFase] = useState<Fase>("tutorial");
  const [tablero, setTablero] = useState<TableroPop>(() => tableroPopVacio(TAM_MIN));
  const [bandeja, setBandeja] = useState<PiezaPop[]>(() =>
    crearBandejaPop(tableroPopVacio(TAM_MIN)),
  );
  const [puntos, setPuntos] = useState(0);
  const [combo, setCombo] = useState(0);
  const [tiempo, setTiempo] = useState(TIEMPO_INICIAL);
  const [lineasTalla, setLineasTalla] = useState(0);
  const [seleccionada, setSeleccionada] = useState<string | null>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [tecladoActivo, setTecladoActivo] = useState(false);
  const [arrastre, setArrastre] = useState<ArrastrePop | null>(null);
  const [fantasma, setFantasma] = useState<FantasmaPop | null>(null);
  const [destello, setDestello] = useState<{ indices: number[]; evento: number } | null>(null);
  const [aviso, setAviso] = useState<{ texto: string; id: number } | null>(null);

  const arrastreRef = useRef<ArrastrePop | null>(null);
  const evento = useRef(0);
  const registrado = useRef(false);
  const tableroRef = useRef<HTMLDivElement | null>(null);
  const zonaTableroRef = useRef<HTMLDivElement | null>(null);
  const bandejaRef = useRef<HTMLDivElement | null>(null);
  const [area, setArea] = useState({ w: 320, h: 320 });

  useLayoutEffect(() => {
    const el = zonaTableroRef.current;
    if (!el) return;
    const obs = new ResizeObserver(([e]) =>
      setArea({ w: e.contentRect.width, h: e.contentRect.height }),
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [vp.retrato, vp.bajaAltura]);

  const celda = useMemo(
    () => calcularCeldaPop(area.w - 4, area.h - 4, tablero.tam),
    [area.w, area.h, tablero.tam],
  );
  const cupo = cupoAmpliacion(tablero.tam);
  const piezaSeleccionada = bandeja.find((p) => p.uid === seleccionada) ?? bandeja[0] ?? null;

  useEffect(() => {
    if (!bandeja.length) return;
    if (!seleccionada || !bandeja.some((p) => p.uid === seleccionada)) {
      setSeleccionada(bandeja[0].uid);
    }
  }, [bandeja, seleccionada]);

  /* ------------------------------ reloj ------------------------------ */
  const terminar = useCallback(
    (score: number) => {
      setFase((f) => (f === "jugando" ? "fin" : f));
      snd.invalido();
      if (!registrado.current) {
        registrado.current = true;
        onFin(score);
      }
    },
    [onFin],
  );

  useEffect(() => {
    if (fase !== "jugando") return;
    const id = window.setInterval(() => {
      setTiempo((t) => {
        if (t <= 1) {
          window.clearInterval(id);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [fase]);

  useEffect(() => {
    if (fase === "jugando" && tiempo === 0) terminar(puntos);
  }, [fase, tiempo, puntos, terminar]);

  const mostrarAviso = useCallback((texto: string) => {
    evento.current++;
    setAviso({ texto, id: evento.current });
    window.setTimeout(() => setAviso((a) => (a?.texto === texto ? null : a)), 1400);
  }, []);

  /* --------------------------- colocación ---------------------------- */
  const fantasmaDe = useCallback(
    (pieza: PiezaPop, punto: Punto, fx: number, fy: number): FantasmaPop | null => {
      const el = tableroRef.current;
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const margen = margenPop(celda);
      const paso = celda + HUECO_POP;
      const holgura = celda * 0.9;
      if (
        punto.x < r.left - holgura ||
        punto.x > r.right + holgura ||
        punto.y < r.top - holgura ||
        punto.y > r.bottom + holgura
      ) {
        return null;
      }
      const { w, h } = dimensionesPiezaPop(pieza);
      const x = Math.min(Math.max(Math.round((punto.x - r.left - margen) / paso - fx), 0), tablero.tam - w);
      const y = Math.min(Math.max(Math.round((punto.y - r.top - margen) / paso - fy), 0), tablero.tam - h);
      return { pieza, x, y, valido: puedeColocarPop(tablero, pieza, x, y) };
    },
    [celda, tablero],
  );

  const colocar = useCallback(
    (pieza: PiezaPop, x: number, y: number) => {
      if (fase !== "jugando") return;
      const res = colocarPop(tablero, pieza, x, y);
      if (!res) {
        snd.invalido();
        return;
      }

      const lineas = res.filas.length + res.columnas.length;
      const nuevoCombo = res.liberadas.length ? combo + 1 : 0;
      let ganados = puntosPop(pieza, res, nuevoCombo);
      let extraTiempo = lineas * BONUS_TIEMPO_LINEA + (res.zonaEspecial ? BONUS_TIEMPO_CENTRO : 0);

      // ¿Toca ampliar? Por cupo de líneas o por llenar la caja entera.
      const lineasAcumuladas = lineasTalla + lineas;
      const amplia =
        tablero.tam < TAM_MAX && (res.cajaLlena || lineasAcumuladas >= cupo);

      let siguienteTablero = res.tablero;
      if (amplia) {
        siguienteTablero = ampliarTablero(res.tablero);
        ganados += puntosAmpliacion(siguienteTablero.tam);
        setLineasTalla(0);
        mostrarAviso(`¡Caja ${siguienteTablero.tam}×${siguienteTablero.tam}!`);
        snd.arpegioCompletado();
      } else {
        setLineasTalla(lineasAcumuladas);
      }

      const nuevosPuntos = puntos + ganados;
      setTablero(siguienteTablero);
      setPuntos(nuevosPuntos);
      setCombo(nuevoCombo);
      if (extraTiempo > 0) setTiempo((t) => t + extraTiempo);
      snd.colocar(INGREDIENTES[pieza.ingrediente].sonido);

      if (res.liberadas.length) {
        evento.current++;
        setDestello({ indices: res.liberadas, evento: evento.current });
        window.setTimeout(() => setDestello(null), 780);
        if (!amplia) snd.perfecto();
        if (lineas > 0 && !amplia) mostrarAviso(`+${lineas * BONUS_TIEMPO_LINEA}s`);
        else if (res.zonaEspecial && !amplia) mostrarAviso(`+${BONUS_TIEMPO_CENTRO}s`);
      }

      let resto = bandeja.filter((p) => p.uid !== pieza.uid);
      if (!resto.length || amplia) resto = crearBandejaPop(siguienteTablero);
      setBandeja(resto);
      setSeleccionada(resto[0]?.uid ?? null);

      if (!hayMovimientoPop(siguienteTablero, resto)) {
        window.setTimeout(() => terminar(nuevosPuntos), 420);
      }
    },
    [bandeja, combo, cupo, fase, lineasTalla, mostrarAviso, puntos, tablero, terminar],
  );

  const rotar = useCallback(
    (uid: string) => {
      if (fase !== "jugando") return;
      setBandeja((prev) =>
        prev.map((p) => (p.uid === uid ? { ...p, rotacion: (p.rotacion + 1) % 4 } : p)),
      );
      setSeleccionada(uid);
      snd.rotar();
    },
    [fase],
  );

  /* ---------------------------- arrastre ----------------------------- */
  const { bajar } = useTapSinArrastre({
    ejeBandeja: vp.retrato ? "x" : "y",
    umbral: 7,
    contenedorRef: bandejaRef,
    alIniciarArrastre: (uid, punto) => {
      const pieza = bandeja.find((p) => p.uid === uid);
      const comida = bandejaRef.current?.querySelector<HTMLElement>(`[data-pop-food="${uid}"]`);
      if (!pieza || !comida) return;
      const r = comida.getBoundingClientRect();
      const { w, h } = dimensionesPiezaPop(pieza);
      const fx = Math.min(Math.max(((punto.x - r.left) / r.width) * w, 0), w);
      const fy = Math.min(Math.max(((punto.y - r.top) / r.height) * h, 0), h);
      const vivo = { pieza, punto, fx, fy };
      arrastreRef.current = vivo;
      setArrastre(vivo);
      setSeleccionada(uid);
      setFantasma(fantasmaDe(pieza, punto, fx, fy));
    },
    alMover: (punto) => {
      const vivo = arrastreRef.current;
      if (!vivo) return;
      vivo.punto = punto;
      setArrastre({ ...vivo });
      setFantasma(fantasmaDe(vivo.pieza, punto, vivo.fx, vivo.fy));
    },
    alSoltar: (punto) => {
      const vivo = arrastreRef.current;
      const f = vivo ? fantasmaDe(vivo.pieza, punto, vivo.fx, vivo.fy) : null;
      arrastreRef.current = null;
      setArrastre(null);
      setFantasma(null);
      if (f?.valido) colocar(f.pieza, f.x, f.y);
      else if (f) snd.invalido();
    },
    alCancelar: () => {
      arrastreRef.current = null;
      setArrastre(null);
      setFantasma(null);
    },
    alTap: rotar,
  });

  /* ------------------------ teclado y mando -------------------------- */
  const rotarSeleccionada = useCallback(() => {
    if (piezaSeleccionada) rotar(piezaSeleccionada.uid);
  }, [piezaSeleccionada, rotar]);

  const colocarTeclado = useCallback(() => {
    if (!piezaSeleccionada) return;
    if (puedeColocarPop(tablero, piezaSeleccionada, cursor.x, cursor.y)) {
      colocar(piezaSeleccionada, cursor.x, cursor.y);
    } else snd.invalido();
  }, [colocar, cursor, piezaSeleccionada, tablero]);

  const moverCursor = useCallback(
    (dx: number, dy: number) => {
      setTecladoActivo(true);
      setCursor((c) => {
        const d = piezaSeleccionada ? dimensionesPiezaPop(piezaSeleccionada) : { w: 1, h: 1 };
        return {
          x: Math.min(Math.max(c.x + dx, 0), tablero.tam - d.w),
          y: Math.min(Math.max(c.y + dy, 0), tablero.tam - d.h),
        };
      });
    },
    [piezaSeleccionada, tablero.tam],
  );

  const elegirSiguiente = useCallback(
    (delta: number) => {
      if (!bandeja.length) return;
      const actual = Math.max(0, bandeja.findIndex((p) => p.uid === seleccionada));
      setSeleccionada(bandeja[(actual + delta + bandeja.length) % bandeja.length].uid);
      setTecladoActivo(true);
    },
    [bandeja, seleccionada],
  );

  // El cursor nunca queda fuera al rotar, cambiar pieza o crecer la caja.
  useEffect(() => {
    const d = piezaSeleccionada ? dimensionesPiezaPop(piezaSeleccionada) : { w: 1, h: 1 };
    setCursor((c) => ({
      x: Math.min(Math.max(c.x, 0), Math.max(0, tablero.tam - d.w)),
      y: Math.min(Math.max(c.y, 0), Math.max(0, tablero.tam - d.h)),
    }));
  }, [piezaSeleccionada, tablero.tam]);

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (fase !== "jugando") return;
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Enter", " "].includes(e.key)) {
        e.preventDefault();
      }
      if (e.key === "ArrowLeft") moverCursor(-1, 0);
      else if (e.key === "ArrowRight") moverCursor(1, 0);
      else if (e.key === "ArrowUp") moverCursor(0, -1);
      else if (e.key === "ArrowDown") moverCursor(0, 1);
      else if (e.key === "r" || e.key === "R" || e.key === " ") rotarSeleccionada();
      else if (e.key === "Enter") colocarTeclado();
      else if (e.key === "q" || e.key === "Q") elegirSiguiente(-1);
      else if (e.key === "e" || e.key === "E") elegirSiguiente(1);
      else if (/^[1-3]$/.test(e.key)) {
        const p = bandeja[Number(e.key) - 1];
        if (p) {
          setSeleccionada(p.uid);
          setTecladoActivo(true);
        }
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [bandeja, colocarTeclado, elegirSiguiente, fase, moverCursor, rotarSeleccionada]);

  useEffect(() => {
    if (fase !== "jugando") return;
    let raf = 0;
    let previo: boolean[] = [];
    const ciclo = () => {
      const pad = navigator.getGamepads?.()[0];
      if (pad) {
        const ahora = pad.buttons.map((b) => b.pressed);
        const pulso = (i: number) => ahora[i] && !previo[i];
        if (pulso(14)) moverCursor(-1, 0);
        if (pulso(15)) moverCursor(1, 0);
        if (pulso(12)) moverCursor(0, -1);
        if (pulso(13)) moverCursor(0, 1);
        if (pulso(0)) colocarTeclado();
        if (pulso(1)) rotarSeleccionada();
        if (pulso(4)) elegirSiguiente(-1);
        if (pulso(5)) elegirSiguiente(1);
        previo = ahora;
      }
      raf = requestAnimationFrame(ciclo);
    };
    raf = requestAnimationFrame(ciclo);
    return () => cancelAnimationFrame(raf);
  }, [colocarTeclado, elegirSiguiente, fase, moverCursor, rotarSeleccionada]);

  const tecladoFantasma = useMemo<FantasmaPop | null>(() => {
    if (!tecladoActivo || !piezaSeleccionada || fase !== "jugando") return null;
    return {
      pieza: piezaSeleccionada,
      x: cursor.x,
      y: cursor.y,
      valido: puedeColocarPop(tablero, piezaSeleccionada, cursor.x, cursor.y),
    };
  }, [cursor, fase, piezaSeleccionada, tablero, tecladoActivo]);

  const reiniciar = () => {
    const vacio = tableroPopVacio(TAM_MIN);
    const nuevas = crearBandejaPop(vacio);
    registrado.current = false;
    setTablero(vacio);
    setBandeja(nuevas);
    setSeleccionada(nuevas[0]?.uid ?? null);
    setPuntos(0);
    setCombo(0);
    setTiempo(TIEMPO_INICIAL);
    setLineasTalla(0);
    setCursor({ x: 0, y: 0 });
    setTecladoActivo(false);
    setFase("jugando");
  };

  const previewCelda = vp.bajaAltura ? 24 : 29;
  const apurado = tiempo <= 10;

  const bandejaUI = (
    <div
      ref={bandejaRef}
      className={
        vp.retrato
          ? "flex items-center justify-center gap-2"
          : "flex flex-col items-center justify-center gap-2"
      }
    >
      {bandeja.map((pieza, i) => {
        const { w, h } = dimensionesPiezaPop(pieza);
        const activa = pieza.uid === seleccionada;
        return (
          <motion.div
            key={pieza.uid}
            data-pop={pieza.uid}
            className="relative flex shrink-0 cursor-grab items-center justify-center rounded-2xl bg-[#fdf9ef]/90 active:cursor-grabbing"
            style={{
              width: Math.max(58, w * previewCelda + 14),
              height: Math.max(58, h * previewCelda + 14),
              border: activa ? "2.5px solid #d97706" : "2px solid rgba(150,120,70,.28)",
              touchAction: "none",
              opacity: arrastre?.pieza.uid === pieza.uid ? 0.25 : 1,
            }}
            whileHover={{ scale: 1.04 }}
            onPointerDown={fase === "jugando" ? (e) => bajar(pieza.uid, e) : undefined}
            title={`Pieza ${i + 1}: arrastrar o tocar para rotar`}
          >
            <div data-pop-food={pieza.uid} className="flex items-center justify-center">
              <FoodSVG id={pieza.ingrediente} celda={previewCelda} rotacion={pieza.rotacion} />
            </div>
            <span className="absolute top-1 left-1.5 text-[9px] font-black text-[#a89878]">
              {i + 1}
            </span>
          </motion.div>
        );
      })}
    </div>
  );

  /** Progreso hacia la siguiente talla. */
  const progreso =
    tablero.tam >= TAM_MAX ? null : (
      <div className="flex items-center gap-1.5">
        <Maximize2 size={13} className="text-[#a03127]" />
        <div className="flex gap-1">
          {Array.from({ length: cupo }, (_, i) => (
            <span
              key={i}
              className="h-2 w-4 rounded-full"
              style={{ background: i < lineasTalla ? "#5c9a4e" : "rgba(150,120,70,.25)" }}
            />
          ))}
        </div>
      </div>
    );

  return (
    <div className="relative h-dvh w-full overflow-hidden text-[#4a3b22]">
      <Fondo />

      {/* Barra de tiempo: 5 px pegada al borde, roja en los últimos 10 s */}
      <div className="absolute inset-x-0 top-0 z-40 h-[5px] bg-black/10">
        <motion.div
          className="h-full"
          style={{
            width: `${Math.min(100, (tiempo / TIEMPO_INICIAL) * 100)}%`,
            background: apurado ? "#c0392b" : "#a03127",
          }}
          animate={apurado && fase === "jugando" ? { opacity: [1, 0.4, 1] } : { opacity: 1 }}
          transition={{ duration: 0.8, repeat: apurado ? Infinity : 0 }}
        />
      </div>

      {/* Cabecera */}
      <div className="absolute inset-x-2 top-2 z-30 flex items-center justify-between gap-2">
        <button
          onClick={onSalir}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#d8c8a4] bg-[#fdf9ef]/85 shadow backdrop-blur"
          aria-label="Salir"
        >
          <ChevronLeft size={22} />
        </button>
        <motion.div
          className="flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 shadow backdrop-blur"
          style={{
            borderColor: apurado ? "#c0392b" : "#d8c8a4",
            background: apurado ? "rgba(192,57,43,.14)" : "rgba(253,249,239,.85)",
          }}
          animate={apurado ? { scale: [1, 1.06, 1] } : { scale: 1 }}
          transition={{ duration: 0.8, repeat: apurado ? Infinity : 0 }}
        >
          <span
            className="text-lg font-black tabular-nums"
            style={{ color: apurado ? "#c0392b" : "#4a3b22" }}
          >
            {reloj(tiempo)}
          </span>
        </motion.div>
        <div className="flex shrink-0 items-center gap-2 rounded-full border border-[#e2cf9c] bg-[#f2c14e]/25 px-3 py-2">
          <Crown size={15} className="text-[#b8860b]" />
          <span className="text-sm font-black tabular-nums">{puntos.toLocaleString("es")}</span>
        </div>
      </div>

      {/* Aviso flotante de bonus / ampliación */}
      <AnimatePresence>
        {aviso && (
          <motion.div
            key={aviso.id}
            className="pointer-events-none absolute top-16 left-1/2 z-40 -translate-x-1/2 rounded-full bg-[#5c9a4e] px-4 py-1.5 text-sm font-black text-white shadow-lg"
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -14 }}
          >
            {aviso.texto}
          </motion.div>
        )}
      </AnimatePresence>

      {vp.retrato ? (
        <div className="relative z-10 flex h-full flex-col gap-2 px-2 pt-15 pb-2">
          <div className="flex shrink-0 flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] font-bold text-[#8a7a5c]">
            <span className="rounded-full bg-[#fdf9ef]/80 px-2 py-0.5">
              Caja {tablero.tam}×{tablero.tam}
            </span>
            {progreso}
            {combo > 1 && <span className="text-[#d97706]">Combo ×{combo}</span>}
          </div>
          <div
            ref={zonaTableroRef}
            className="flex min-h-0 flex-1 items-center justify-center overflow-hidden"
          >
            <BentoPopBoard
              tablero={tablero}
              celda={celda}
              tableroRef={tableroRef}
              fantasma={fantasma}
              teclado={tecladoFantasma}
              destello={destello}
            />
          </div>
          <div className="shrink-0 rounded-3xl border border-[#e2d5b4] bg-[#efe6cf]/72 p-2 backdrop-blur">
            {bandejaUI}
          </div>
        </div>
      ) : (
        <div className="relative z-10 grid h-full grid-cols-[minmax(0,1fr)_clamp(124px,20vw,230px)] gap-3 px-3 pt-15 pb-3">
          <div
            ref={zonaTableroRef}
            className="flex min-h-0 min-w-0 items-center justify-center overflow-hidden"
          >
            <BentoPopBoard
              tablero={tablero}
              celda={celda}
              tableroRef={tableroRef}
              fantasma={fantasma}
              teclado={tecladoFantasma}
              destello={destello}
            />
          </div>
          <aside className="flex min-h-0 flex-col items-center justify-center gap-3 overflow-hidden rounded-3xl border border-[#e2d5b4] bg-[#efe6cf]/72 p-2 backdrop-blur">
            <div className="text-center">
              <p className="text-xl font-black text-[#a03127]">
                {tablero.tam}×{tablero.tam}
              </p>
              <p className="text-[10px] font-bold text-[#8a7a5c] uppercase">
                Récord {Math.max(mejor, puntos).toLocaleString("es")}
              </p>
            </div>
            {progreso}
            {bandejaUI}
            {combo > 1 && (
              <span className="rounded-full bg-[#f2c14e]/30 px-3 py-1 text-xs font-black text-[#b8860b]">
                Combo ×{combo}
              </span>
            )}
          </aside>
        </div>
      )}

      {/* Pieza en vuelo */}
      {arrastre && (
        <div
          className="pointer-events-none fixed top-0 left-0 z-50"
          style={{
            transform: `translate(${arrastre.punto.x - arrastre.fx * celda}px, ${
              arrastre.punto.y - arrastre.fy * celda
            }px)`,
            filter: "drop-shadow(0 14px 18px rgba(60,30,10,.35))",
          }}
        >
          <FoodSVG id={arrastre.pieza.ingrediente} celda={celda} rotacion={arrastre.pieza.rotacion} />
        </div>
      )}

      <AnimatePresence>
        {fase === "tutorial" && (
          <motion.div
            className="absolute inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#4a3b22]/45 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="my-auto w-full max-w-sm rounded-3xl border border-[#e2d5b4] bg-[#fdf9ef] p-5 text-center shadow-2xl"
              initial={{ scale: 0.88, y: 20 }}
              animate={{ scale: 1, y: 0 }}
            >
              <Mascot humor="feliz" size={74} className="mx-auto" />
              <h2 className="mt-1 text-xl font-black">Bento Pop</h2>
              <p className="text-xs font-semibold text-[#8a7a5c]">
                La caja crece… si eres rápido
              </p>
              <div className="mt-3 grid gap-2 text-left">
                <div className="flex items-center gap-3 rounded-2xl bg-[#f4ecd9] p-3">
                  <Grid3X3 size={26} className="shrink-0 text-[#a03127]" />
                  <span className="text-xs font-bold">
                    Completa líneas de extremo a extremo: se sirven y dan <b>+15 s</b>.
                  </span>
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-[#f4ecd9] p-3">
                  <Maximize2 size={26} className="shrink-0 text-[#5c9a4e]" />
                  <span className="text-xs font-bold">
                    Al llenar el cupo de líneas la caja crece: 2×2 → 4×4 → 6×6 → 8×8.
                  </span>
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-[#f4ecd9] p-3">
                  <Sparkles size={26} className="shrink-0 text-[#b8860b]" />
                  <span className="text-xs font-bold">
                    El cuadro dorado central se vacía solo y suma <b>+2 s</b>.
                  </span>
                </div>
                <div className="flex items-center gap-3 rounded-2xl bg-[#f4ecd9] p-3">
                  <span className="flex shrink-0 gap-1">
                    <Keyboard size={20} />
                    <Gamepad2 size={20} />
                  </span>
                  <span className="text-xs font-bold">
                    Arrastra y toca para rotar. Flechas + Enter, o D-pad + A.
                  </span>
                </div>
              </div>
              <button
                onClick={() => setFase("jugando")}
                className="mt-4 h-12 w-full rounded-2xl bg-[#a03127] font-black text-white shadow-lg"
              >
                ¡Empezar! · 2:59
              </button>
            </motion.div>
          </motion.div>
        )}

        {fase === "fin" && (
          <motion.div
            className="absolute inset-0 z-50 flex items-center justify-center bg-[#4a3b22]/45 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="w-full max-w-xs rounded-3xl border border-[#e2d5b4] bg-[#fdf9ef] p-5 text-center shadow-2xl"
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
            >
              <Mascot humor={puntos > mejor ? "celebrando" : "preocupado"} size={80} className="mx-auto" />
              <p className="text-[10px] font-bold tracking-[.2em] text-[#8a7a5c] uppercase">
                {tiempo === 0 ? "Se acabó el tiempo" : "No cabe nada más"}
              </p>
              <h2 className="text-2xl font-black text-[#a03127]">{puntos.toLocaleString("es")}</h2>
              <p className="mt-1 text-xs font-bold text-[#8a7a5c]">
                Caja alcanzada: {tablero.tam}×{tablero.tam}
              </p>
              {puntos > mejor && (
                <p className="mt-1 text-sm font-black text-[#b8860b]">¡Nuevo récord!</p>
              )}
              <div className="mt-4 flex gap-2">
                <button
                  onClick={onSalir}
                  className="h-12 flex-1 rounded-2xl border-2 border-[#d8c8a4] font-bold"
                >
                  Salir
                </button>
                <button
                  onClick={reiniciar}
                  className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-[#a03127] font-black text-white"
                >
                  <RotateCw size={18} />
                  Otra
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
