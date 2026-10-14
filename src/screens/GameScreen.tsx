/**
 * GameScreen — La mesa de trabajo.
 * Tres layouts (vertical, horizontal/tablet, celular horizontal denso),
 * arrastre magnético con fantasma, rotación (toque, botón, tecla R),
 * pistas, temporizador de servicio y el botón CERRAR BENTO.
 *
 * Reglas de oro:
 *  · LA CAJA ES SIEMPRE LO MÁS GRANDE DE LA PANTALLA.
 *  · Ningún panel desborda su recuadro: todo se mide y se recorta.
 */
import { AnimatePresence, motion } from "framer-motion";
import {
  Eraser,
  Hand,
  Lightbulb,
  MousePointerClick,
  Play,
  RotateCw,
  Undo2,
} from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";

import { BentoBox } from "../components/BentoBox";
import type { Destello, Fantasma } from "../components/BentoBox";
import { ColorMeter } from "../components/ColorMeter";
import { Fondo } from "../components/Fondo";
import { FoodSVG } from "../components/FoodSVG";
import { HUD } from "../components/HUD";
import { Mascot } from "../components/Mascot";
import type { Humor } from "../components/Mascot";
import { OrderCard } from "../components/OrderCard";
import { PieceTray } from "../components/PieceTray";
import type { Punto } from "../components/PieceTray";
import { ResultScreen } from "./ResultScreen";

import { puntuar } from "../game/balance";
import { INGREDIENTES } from "../game/ingredients";
import { calcularCelda, medidasCaja } from "../game/layout";
import { nivelPorId } from "../game/levels";
import {
  cajaLlena,
  celdasDe,
  celdasPista,
  coloresPresentes,
  compartimentosCompletos,
  construirNivel,
  evaluarPedido,
  mejorAnclaje,
  recalcularOcupacion,
} from "../game/logic";
import * as snd from "../game/sound";
import type { Celda, Preferencias, PiezaInst, Resultado } from "../game/types";
import { useViewport } from "../hooks/useViewport";

type Fase = "tutorial" | "jugando" | "pausa" | "completado" | "tiempo";

interface Accion {
  uid: string;
  tipo: "colocar" | "quitar";
  x: number;
  y: number;
}

/** Gesto en curso: pieza, agarre fraccional dentro de la pieza y puntero. */
interface Arrastre {
  uid: string;
  /** Posición del dedo dentro de la pieza, en unidades de celda. */
  fx: number;
  fy: number;
  punto: Punto;
}

interface Props {
  nivelId: number;
  prefs: Preferencias;
  totalNiveles: number;
  onSalir: () => void;
  onCompletado: (nivelId: number, estrellas: number, puntos: number) => void;
  onSiguiente: () => void;
  onAlternarSonido: () => void;
}

export function GameScreen({
  nivelId,
  prefs,
  totalNiveles,
  onSalir,
  onCompletado,
  onSiguiente,
  onAlternarSonido,
}: Props) {
  const vp = useViewport();
  const nivel = useMemo(() => nivelPorId(nivelId), [nivelId]);
  const build = useMemo(() => construirNivel(nivel), [nivel]);

  /* ------------------------------ estado ------------------------------ */
  const [piezas, setPiezas] = useState<PiezaInst[]>(() =>
    build.piezas.map((p) => ({ ...p, x: null, y: null, rotacion: 0 })),
  );
  const [fantasma, setFantasma] = useState<Fantasma | null>(null);
  const [seleccionada, setSeleccionada] = useState<string | null>(null);
  const [historial, setHistorial] = useState<Accion[]>([]);
  const [perfectos, setPerfectos] = useState(0);
  const [elegante, setElegante] = useState(true);
  const [fase, setFase] = useState<Fase>("tutorial");
  const [tiempo, setTiempo] = useState(nivel.tiempo);
  const [pistasRestantes, setPistasRestantes] = useState(nivel.pistas);
  const [pistaUid, setPistaUid] = useState<string | null>(null);
  const [pistaCeldas, setPistaCeldas] = useState<Celda[] | null>(null);
  const [destellos, setDestellos] = useState<Destello[]>([]);
  const [sacudidas, setSacudidas] = useState(0);
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [humorExtra, setHumorExtra] = useState<Humor | null>(null);
  const [arrastreUi, setArrastreUi] = useState<{ uid: string; punto: Punto } | null>(null);

  const tableroRef = useRef<HTMLDivElement | null>(null);
  const zonaTableroRef = useRef<HTMLDivElement | null>(null);
  const arrastre = useRef<Arrastre | null>(null);
  const evDestello = useRef(0);
  const humorTimer = useRef<number | null>(null);

  /* --------------------------- derivados puros ------------------------ */
  const ocupacion = useMemo(
    () => recalcularOcupacion(build.modelo, piezas),
    [build.modelo, piezas],
  );
  const llena = cajaLlena(ocupacion);
  const cumplidos = useMemo(() => evaluarPedido(nivel.pedido, piezas), [nivel.pedido, piezas]);
  const pedidoOk = cumplidos.every(Boolean);
  const colores = useMemo(() => coloresPresentes(piezas), [piezas]);
  const enBandeja = piezas.filter((p) => p.x === null);
  const esServicio = prefs.modo === "servicio";

  /* --------------------- medición: la caja manda ---------------------- */
  const denso = vp.bajaAltura && !vp.retrato;
  const [area, setArea] = useState({ w: 320, h: 320 });

  useLayoutEffect(() => {
    const el = zonaTableroRef.current;
    if (!el) return;
    const obs = new ResizeObserver((entradas) => {
      const r = entradas[0].contentRect;
      setArea((prev) =>
        Math.abs(prev.w - r.width) < 1 && Math.abs(prev.h - r.height) < 1
          ? prev
          : { w: r.width, h: r.height },
      );
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, [vp.retrato, vp.bajaAltura]);

  // Celda = la mayor cuya caja COMPLETA (marco incluido) cabe en el área.
  const celdaPx = useMemo(
    () => calcularCelda(area.w - 4, area.h - 4, build.modelo.cols, build.modelo.rows),
    [area.w, area.h, build.modelo.cols, build.modelo.rows],
  );
  const medidas = useMemo(
    () => medidasCaja(celdaPx, build.modelo.cols, build.modelo.rows),
    [celdaPx, build.modelo.cols, build.modelo.rows],
  );

  // Bandeja: celda de referencia y alto reservado (sin robar sitio a la caja).
  const celdaBandeja = denso ? 24 : vp.retrato ? (vp.ancho < 360 ? 28 : 32) : 38;
  const altoBandeja = Math.round(celdaBandeja * 2.4 + Math.max(8, celdaBandeja * 0.26) + 20);

  /* --------------------------- temporizador --------------------------- */
  useEffect(() => {
    if (!esServicio || fase !== "jugando") return;
    const id = window.setInterval(() => setTiempo((t) => Math.max(0, t - 1)), 1000);
    return () => window.clearInterval(id);
  }, [esServicio, fase]);

  useEffect(() => {
    if (esServicio && fase === "jugando" && tiempo === 0) {
      setFase("tiempo");
      snd.invalido();
    }
  }, [tiempo, esServicio, fase]);

  /* ------------------------------ humor ------------------------------- */
  useEffect(
    () => () => {
      if (humorTimer.current) window.clearTimeout(humorTimer.current);
    },
    [],
  );
  const celebrarUnRato = useCallback(() => {
    setHumorExtra("feliz");
    if (humorTimer.current) window.clearTimeout(humorTimer.current);
    humorTimer.current = window.setTimeout(() => setHumorExtra(null), 1600);
  }, []);

  const humor: Humor =
    fase === "tiempo"
      ? "preocupado"
      : (humorExtra ?? (fantasma && !fantasma.valido ? "preocupado" : "neutro"));

  /* ------------------------- geometría del drag ------------------------ */
  /**
   * Fantasma magnético: del puntero sale un anclaje ideal y el imán
   * busca el hueco válido más cercano. Colocar NO exige puntería exacta.
   */
  const fantasmaDe = useCallback(
    (pieza: PiezaInst, punto: Punto): Fantasma | null => {
      const el = tableroRef.current;
      const g = arrastre.current;
      if (!el || !g) return null;
      const r = el.getBoundingClientRect();
      // Zona de captación: la caja más un margen generoso de una celda.
      const holgura = celdaPx;
      if (
        punto.x < r.left - holgura ||
        punto.x > r.right + holgura ||
        punto.y < r.top - holgura ||
        punto.y > r.bottom + holgura
      ) {
        return null;
      }
      const celdas = celdasDe(pieza);
      const bw = Math.max(...celdas.map(([x]) => x)) + 1;
      const bh = Math.max(...celdas.map(([, y]) => y)) + 1;
      // Anclaje ideal con redondeo: el centro de la celda es el objetivo.
      const relX = (punto.x - r.left - medidas.margen) / celdaPx - g.fx;
      const relY = (punto.y - r.top - medidas.margen) / celdaPx - g.fy;
      const ax = Math.min(Math.max(Math.round(relX), 0), build.modelo.cols - bw);
      const ay = Math.min(Math.max(Math.round(relY), 0), build.modelo.rows - bh);
      // Imán: si hay un encaje válido a un paso, la pieza salta a él.
      const iman = mejorAnclaje(build.modelo, pieza, ax, ay, ocupacion, 1);
      if (iman) return { uid: pieza.uid, x: iman.x, y: iman.y, valido: true };
      return { uid: pieza.uid, x: ax, y: ay, valido: false };
    },
    [build.modelo, celdaPx, medidas.margen, ocupacion],
  );

  /* ----------------------------- acciones ----------------------------- */
  const colocar = useCallback(
    (uid: string, ax: number, ay: number) => {
      const pieza = piezas.find((p) => p.uid === uid);
      if (!pieza) return;
      const nuevas = piezas.map((p) => (p.uid === uid ? { ...p, x: ax, y: ay } : p));
      setPiezas(nuevas);
      setHistorial((h) => [...h, { uid, tipo: "colocar", x: ax, y: ay }]);
      if (pistaUid === uid) {
        setPistaUid(null);
        setPistaCeldas(null);
      }
      // ¿Se completó algún compartimento? → destello + campanita + combo.
      const antes = new Set(compartimentosCompletos(build.modelo, ocupacion));
      const nuevaOcup = recalcularOcupacion(build.modelo, nuevas);
      const nuevosComp = compartimentosCompletos(build.modelo, nuevaOcup).filter(
        (c) => !antes.has(c),
      );
      if (nuevosComp.length > 0) {
        evDestello.current += 1;
        const ev = evDestello.current;
        setDestellos((d) => [...d, ...nuevosComp.map((comp) => ({ comp, ev }))]);
        window.setTimeout(() => setDestellos((d) => d.filter((x) => x.ev !== ev)), 1000);
        setPerfectos((n) => n + nuevosComp.length);
        snd.perfecto();
        celebrarUnRato();
      } else {
        snd.colocar(INGREDIENTES[pieza.ingrediente].sonido);
      }
    },
    [build.modelo, ocupacion, piezas, pistaUid, celebrarUnRato],
  );

  const quitar = useCallback(
    (uid: string) => {
      if (fase !== "jugando") return;
      const pieza = piezas.find((p) => p.uid === uid);
      if (!pieza || pieza.x === null || pieza.y === null) return;
      setHistorial((h) => [...h, { uid, tipo: "quitar", x: pieza.x!, y: pieza.y! }]);
      setPiezas((prev) => prev.map((p) => (p.uid === uid ? { ...p, x: null, y: null } : p)));
      setElegante(false);
      snd.quitar();
    },
    [fase, piezas],
  );

  const deshacer = useCallback(() => {
    if (fase !== "jugando") return;
    const ultima = historial[historial.length - 1];
    if (!ultima) return;
    setHistorial((h) => h.slice(0, -1));
    if (ultima.tipo === "colocar") {
      setPiezas((prev) => prev.map((p) => (p.uid === ultima.uid ? { ...p, x: null, y: null } : p)));
    } else {
      setPiezas((prev) =>
        prev.map((p) => (p.uid === ultima.uid ? { ...p, x: ultima.x, y: ultima.y } : p)),
      );
    }
    setElegante(false);
    snd.rotar();
  }, [fase, historial]);

  const vaciar = useCallback(() => {
    if (fase !== "jugando") return;
    setPiezas((prev) => prev.map((p) => ({ ...p, x: null, y: null })));
    setHistorial([]);
    setElegante(false);
    snd.quitar();
  }, [fase]);

  const rotarPieza = useCallback(
    (uid: string) => {
      if (fase !== "jugando") return;
      const pieza = piezas.find((p) => p.uid === uid);
      if (!pieza || pieza.x !== null) return;
      const rotada: PiezaInst = { ...pieza, rotacion: (pieza.rotacion + 1) % 4 };
      setSeleccionada(uid);
      setPiezas((prev) => prev.map((p) => (p.uid === uid ? rotada : p)));
      snd.rotar();
      // Si se está arrastrando, refresca el fantasma con la nueva forma.
      if (arrastre.current?.uid === uid) {
        setFantasma(fantasmaDe(rotada, arrastre.current.punto));
      }
    },
    [fase, piezas, fantasmaDe],
  );

  const pedirPista = useCallback(() => {
    if (fase !== "jugando" || pistasRestantes <= 0) return;
    const candidata = piezas.find((p) => p.x === null);
    if (!candidata) return;
    const pista = celdasPista(build.modelo, candidata.uid);
    if (!pista) return;
    setPistasRestantes((n) => n - 1);
    setPistaUid(candidata.uid);
    setPistaCeldas(pista.celdas);
    setSeleccionada(candidata.uid);
    snd.perfecto();
  }, [fase, pistasRestantes, piezas, build.modelo]);

  const cerrarBento = useCallback(() => {
    if (fase !== "jugando" || !llena) return;
    if (!pedidoOk) {
      // Falta algo del pedido: aviso suave, sin castigo.
      setSacudidas((n) => n + 1);
      snd.invalido();
      return;
    }
    const res = puntuar(
      { perfectos, goshikiCompleto: colores.size === 5, elegante },
      build.modelo.rects.length,
    );
    setResultado(res);
    setFase("completado");
    onCompletado(nivel.id, res.estrellas, res.puntos);
    // La coreografía sonora vive en ResultScreen para no duplicarse.
  }, [fase, llena, pedidoOk, perfectos, colores, elegante, build.modelo, nivel.id, onCompletado]);

  const reiniciar = useCallback(() => {
    setPiezas(build.piezas.map((p) => ({ ...p, x: null, y: null, rotacion: 0 })));
    setHistorial([]);
    setPerfectos(0);
    setElegante(true);
    setFantasma(null);
    setPistaUid(null);
    setPistaCeldas(null);
    setDestellos([]);
    setPistasRestantes(nivel.pistas);
    setTiempo(nivel.tiempo);
    setResultado(null);
    setFase("tutorial");
  }, [build.piezas, nivel.pistas, nivel.tiempo]);

  /* --------------------- gestos de arrastre (propios) ------------------ */
  const alIniciarArrastre = useCallback(
    (uid: string, punto: Punto) => {
      const pieza = piezas.find((p) => p.uid === uid);
      if (!pieza) return;
      const celdas = celdasDe(pieza);
      const bw = Math.max(...celdas.map(([x]) => x)) + 1;
      const bh = Math.max(...celdas.map(([, y]) => y)) + 1;
      // Agarre FRACCIONAL (en celdas) sobre el dibujo real de la bandeja:
      // así la pieza no «salta» al pasar a la escala del tablero.
      const el = document.querySelector<HTMLElement>(`[data-comida="${uid}"]`);
      const r = el?.getBoundingClientRect();
      const fx = r && r.width > 0 ? ((punto.x - r.left) / r.width) * bw : bw / 2;
      const fy = r && r.height > 0 ? ((punto.y - r.top) / r.height) * bh : bh / 2;
      arrastre.current = {
        uid,
        fx: Math.min(Math.max(fx, 0), bw),
        fy: Math.min(Math.max(fy, 0), bh),
        punto,
      };
      setArrastreUi({ uid, punto });
      setSeleccionada(uid);
      setFantasma(fantasmaDe(pieza, punto));
    },
    [piezas, fantasmaDe],
  );

  const alMoverArrastre = useCallback(
    (punto: Punto) => {
      const g = arrastre.current;
      if (!g) return;
      g.punto = punto;
      setArrastreUi((prev) => (prev ? { ...prev, punto } : prev));
      const pieza = piezas.find((p) => p.uid === g.uid);
      setFantasma(pieza ? fantasmaDe(pieza, punto) : null);
    },
    [fantasmaDe, piezas],
  );

  const alSoltarArrastre = useCallback(
    (punto: Punto) => {
      const g = arrastre.current;
      const pieza = g ? piezas.find((p) => p.uid === g.uid) : undefined;
      // El fantasma se calcula ANTES de limpiar: necesita el agarre.
      const f = pieza ? fantasmaDe(pieza, punto) : null;
      setArrastreUi(null);
      setFantasma(null);
      arrastre.current = null;
      if (fase !== "jugando" || !pieza || !g) return;
      if (f && f.valido) {
        colocar(g.uid, f.x, f.y);
      } else if (f) {
        // Error de puntería: aviso suave, nada más.
        setSacudidas((n) => n + 1);
        snd.invalido();
      }
    },
    [fase, piezas, fantasmaDe, colocar],
  );

  const alCancelarArrastre = useCallback(() => {
    setArrastreUi(null);
    setFantasma(null);
    arrastre.current = null;
  }, []);

  /* ----------------------------- teclado ------------------------------- */
  useEffect(() => {
    const alPulsar = (e: KeyboardEvent) => {
      if (e.key === "r" || e.key === "R") {
        const objetivo = arrastre.current?.uid ?? seleccionada ?? enBandeja[0]?.uid;
        if (objetivo) rotarPieza(objetivo);
      } else if (e.key === "Escape") {
        // Con pieza en vuelo, Escape la cancela antes que pausar.
        if (arrastre.current) {
          alCancelarArrastre();
          return;
        }
        setFase((f) => (f === "jugando" ? "pausa" : f === "pausa" ? "jugando" : f));
      } else if ((e.ctrlKey && e.key === "z") || e.key === "u") {
        deshacer();
      }
    };
    window.addEventListener("keydown", alPulsar);
    return () => window.removeEventListener("keydown", alPulsar);
  }, [seleccionada, enBandeja, rotarPieza, deshacer, alCancelarArrastre]);

  /* ------------------------- controles visuales ------------------------ */
  const jugando = fase === "jugando";
  const ladoBoton = denso ? 40 : 44;

  const BotonControl = ({
    icono,
    label,
    onClick,
    desactivado = false,
    insignia,
  }: {
    icono: ReactNode;
    label: string;
    onClick: () => void;
    desactivado?: boolean;
    insignia?: number;
  }) => (
    <button
      onClick={onClick}
      disabled={desactivado || !jugando}
      aria-label={label}
      title={label}
      style={{ width: ladoBoton, height: ladoBoton }}
      className="relative flex shrink-0 items-center justify-center rounded-2xl border-2 border-[#d8c8a4] bg-[#fdf9ef]/90 text-[#6d5a3a] shadow transition-transform active:scale-90 disabled:opacity-35"
    >
      {icono}
      {insignia !== undefined && insignia > 0 && (
        <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#a03127] text-[10px] font-black text-white">
          {insignia}
        </span>
      )}
    </button>
  );

  const tamIcono = denso ? 17 : 19;
  const controles = (
    <>
      <BotonControl
        icono={<RotateCw size={tamIcono} />}
        label="Rotar pieza (R)"
        onClick={() => {
          const objetivo = seleccionada ?? enBandeja[0]?.uid;
          if (objetivo) rotarPieza(objetivo);
        }}
        desactivado={enBandeja.length === 0}
      />
      <BotonControl
        icono={<Undo2 size={tamIcono} />}
        label="Deshacer"
        onClick={deshacer}
        desactivado={historial.length === 0}
      />
      <BotonControl
        icono={<Eraser size={tamIcono} />}
        label="Vaciar caja"
        onClick={vaciar}
        desactivado={enBandeja.length === piezas.length}
      />
      <BotonControl
        icono={<Lightbulb size={tamIcono} />}
        label="Pista"
        onClick={pedirPista}
        desactivado={pistasRestantes === 0 || enBandeja.length === 0}
        insignia={pistasRestantes}
      />
    </>
  );

  const botonCerrar = (
    <motion.button
      onClick={cerrarBento}
      disabled={!llena || !jugando}
      style={{ height: denso ? 42 : 50 }}
      className={`flex w-full min-w-0 items-center justify-center gap-2 overflow-hidden rounded-2xl px-3 text-sm font-black tracking-wide uppercase transition-colors ${
        llena
          ? "bg-[#5c9a4e] text-[#f4fbf0] shadow-[0_12px_26px_-8px_rgba(92,154,78,0.7)]"
          : "bg-[#e7ddc6] text-[#a89878]"
      }`}
      animate={llena && jugando ? { scale: [1, 1.03, 1] } : { scale: 1 }}
      transition={llena ? { duration: 1.6, repeat: Infinity } : { duration: 0.2 }}
      whileTap={llena ? { scale: 0.94 } : {}}
    >
      <span className="truncate">Cerrar bento</span>
    </motion.button>
  );

  /* ------------------------------- JSX --------------------------------- */
  return (
    <div className="relative h-dvh w-full overflow-hidden text-[#4a3b22]">
      <Fondo />

      {/* Barra de tiempo del servicio: 5 px, pegada al borde */}
      {esServicio && (
        <div className="absolute inset-x-0 top-0 z-50 h-[5px] bg-black/10">
          <motion.div
            className="h-full"
            style={{
              width: `${(tiempo / nivel.tiempo) * 100}%`,
              background: tiempo <= 10 ? "#c0392b" : "#a03127",
            }}
            animate={tiempo <= 10 && jugando ? { opacity: [1, 0.4, 1] } : { opacity: 1 }}
            transition={{ duration: 0.8, repeat: tiempo <= 10 ? Infinity : 0 }}
          />
        </div>
      )}

      <HUD
        titulo={`${nivel.id}. ${nivel.nombre}`}
        modo={prefs.modo}
        sonidoActivo={prefs.sonido}
        compacto={denso || vp.ancho < 420}
        onVolver={onSalir}
        onPausa={() => setFase((f) => (f === "jugando" ? "pausa" : f))}
        onAlternarSonido={onAlternarSonido}
      />

      {/* ============ LAYOUT ============ */}
      {vp.retrato ? (
        /* ---- Celular vertical: apilado ---- */
        <div className="relative z-10 flex h-full flex-col gap-1.5 px-2 pt-13 pb-2">
          <div className="flex shrink-0 flex-wrap items-center justify-center gap-x-2 gap-y-1">
            <OrderCard pedido={nivel.pedido} cumplidos={cumplidos} compacto />
            <ColorMeter activos={colores} compacto />
          </div>

          <div ref={zonaTableroRef} className="flex min-h-0 flex-1 items-center justify-center">
            <BentoBox
              modelo={build.modelo}
              piezas={piezas}
              celda={celdaPx}
              fantasma={fantasma}
              pista={pistaCeldas}
              destellos={destellos}
              sacudidas={sacudidas}
              tableroRef={tableroRef}
              onQuitar={quitar}
            />
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            {controles}
            <div className="min-w-0 flex-1">{botonCerrar}</div>
          </div>

          <div
            className="shrink-0 overflow-hidden rounded-2xl border border-[#e2d5b4]/80 bg-[#efe6cf]/70 backdrop-blur-sm"
            style={{ height: altoBandeja }}
          >
            <PieceTray
              piezas={enBandeja}
              celda={celdaBandeja}
              vertical={false}
              seleccionada={seleccionada}
              pistaUid={pistaUid}
              arrastrandoUid={arrastreUi?.uid ?? null}
              bloqueado={!jugando}
              onIniciarArrastre={alIniciarArrastre}
              onMoverArrastre={alMoverArrastre}
              onSoltarArrastre={alSoltarArrastre}
              onCancelarArrastre={alCancelarArrastre}
              onTapPieza={rotarPieza}
            />
          </div>
        </div>
      ) : (
        /* ---- Horizontal / tablet / escritorio: tres columnas ---- */
        <div
          className="relative z-10 grid h-full gap-2 px-2 pt-13 pb-2"
          style={{
            gridTemplateColumns: denso
              ? "clamp(104px,13vw,140px) minmax(0,1fr) clamp(118px,15vw,160px)"
              : "clamp(136px,16vw,210px) minmax(0,1fr) clamp(150px,18vw,230px)",
          }}
        >
          {/* Pedido a la izquierda */}
          <div
            className={`flex min-h-0 min-w-0 flex-col items-center gap-2 overflow-x-hidden overflow-y-auto rounded-2xl border border-[#e2d5b4]/80 bg-[#f7f0dd]/80 backdrop-blur-sm ${
              denso ? "p-1.5" : "p-2.5"
            }`}
          >
            {!denso && <Mascot humor={humor} size={vp.alto < 620 ? 64 : 80} />}
            <OrderCard pedido={nivel.pedido} cumplidos={cumplidos} compacto={denso} />
            <ColorMeter activos={colores} compacto />
          </div>

          {/* Caja al centro: toda la altura */}
          <div
            ref={zonaTableroRef}
            className="flex min-h-0 min-w-0 items-center justify-center overflow-hidden"
          >
            <BentoBox
              modelo={build.modelo}
              piezas={piezas}
              celda={celdaPx}
              fantasma={fantasma}
              pista={pistaCeldas}
              destellos={destellos}
              sacudidas={sacudidas}
              tableroRef={tableroRef}
              onQuitar={quitar}
            />
          </div>

          {/* Bandeja a la derecha */}
          <div className="flex min-h-0 min-w-0 flex-col gap-1.5">
            <div className="flex shrink-0 flex-wrap items-center justify-center gap-1.5">
              {controles}
            </div>
            <div className="min-h-0 flex-1 overflow-hidden rounded-2xl border border-[#e2d5b4]/80 bg-[#efe6cf]/70 backdrop-blur-sm">
              <PieceTray
                piezas={enBandeja}
                celda={celdaBandeja}
                vertical
                seleccionada={seleccionada}
                pistaUid={pistaUid}
                arrastrandoUid={arrastreUi?.uid ?? null}
                bloqueado={!jugando}
                onIniciarArrastre={alIniciarArrastre}
                onMoverArrastre={alMoverArrastre}
                onSoltarArrastre={alSoltarArrastre}
                onCancelarArrastre={alCancelarArrastre}
                onTapPieza={rotarPieza}
              />
            </div>
            <div className="shrink-0">{botonCerrar}</div>
          </div>
        </div>
      )}

      {/* ======= Pieza en vuelo: imantada al fantasma ======= */}
      {arrastreUi &&
        (() => {
          const pieza = piezas.find((p) => p.uid === arrastreUi.uid);
          const g = arrastre.current;
          if (!pieza || !g) return null;
          let ox = arrastreUi.punto.x - g.fx * celdaPx;
          let oy = arrastreUi.punto.y - g.fy * celdaPx;
          const el = tableroRef.current;
          const encajada = Boolean(fantasma?.valido && el);
          if (encajada && el && fantasma) {
            const r = el.getBoundingClientRect();
            ox = r.left + medidas.margen + fantasma.x * celdaPx;
            oy = r.top + medidas.margen + fantasma.y * celdaPx;
          }
          return (
            <motion.div
              className="pointer-events-none fixed top-0 left-0 z-[70]"
              initial={{ x: ox, y: oy, scale: 1.04, opacity: 0.98 }}
              animate={{ x: ox, y: oy, scale: encajada ? 1 : 1.06 }}
              transition={
                encajada ? { type: "spring", stiffness: 620, damping: 30 } : { duration: 0 }
              }
              style={{ filter: "drop-shadow(0 14px 18px rgba(60,30,10,0.35))" }}
            >
              <FoodSVG id={pieza.ingrediente} celda={celdaPx} rotacion={pieza.rotacion} />
            </motion.div>
          );
        })()}

      {/* ============ OVERLAYS ============ */}
      <AnimatePresence>
        {fase === "tutorial" && (
          <motion.div
            key="tutorial"
            className="absolute inset-0 z-40 flex items-center justify-center overflow-y-auto bg-[#4a3b22]/45 p-3 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="my-auto flex w-full max-w-sm flex-col items-center gap-2.5 rounded-3xl border border-[#e2d5b4] bg-[#fdf9ef] p-4 text-center shadow-2xl"
              initial={{ scale: 0.85, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <Mascot humor="feliz" size={vp.bajaAltura ? 58 : 76} />
              <h3 className="text-base font-black">{nivel.nombre}</h3>
              <p className="text-xs font-semibold text-[#8a7a5c]">{nivel.subtitulo}</p>
              <div className="grid w-full gap-1.5 text-left">
                {[
                  { icono: <Hand size={17} />, texto: "Arrastra los ingredientes a la caja" },
                  { icono: <RotateCw size={17} />, texto: "Toca una pieza de la bandeja para rotarla" },
                  { icono: <MousePointerClick size={17} />, texto: "Toca una colocada para devolverla" },
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5 rounded-2xl bg-[#f4ecd9] px-2.5 py-2">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-[#a03127] shadow-sm">
                      {f.icono}
                    </span>
                    <span className="text-[11px] leading-snug font-bold text-[#5c4a2e]">{f.texto}</span>
                  </div>
                ))}
              </div>
              {/* El tutorial congela TODOS los relojes: empieza al pulsar */}
              <motion.button
                onClick={() => setFase("jugando")}
                className="mt-0.5 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#a03127] font-black text-[#fdf6ea] shadow-lg"
                whileTap={{ scale: 0.95 }}
              >
                <Play size={18} className="fill-current" /> ¡Empezar!
              </motion.button>
            </motion.div>
          </motion.div>
        )}

        {fase === "pausa" && (
          <motion.div
            key="pausa"
            className="absolute inset-0 z-40 flex items-center justify-center overflow-y-auto bg-[#4a3b22]/45 p-3 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="my-auto flex w-full max-w-xs flex-col items-center gap-2.5 rounded-3xl border border-[#e2d5b4] bg-[#fdf9ef] p-4 text-center shadow-2xl"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
            >
              <Mascot humor="neutro" size={vp.bajaAltura ? 56 : 72} />
              <h3 className="text-base font-black">Pausa zen</h3>
              <p className="text-xs font-semibold text-[#8a7a5c]">El bento te espera sin prisa.</p>
              <button
                onClick={() => setFase("jugando")}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#a03127] font-black text-[#fdf6ea]"
              >
                <Play size={18} className="fill-current" /> Reanudar
              </button>
              <div className="flex w-full gap-2">
                <button
                  onClick={reiniciar}
                  className="h-11 flex-1 rounded-2xl border-2 border-[#d8c8a4] text-sm font-bold text-[#6d5a3a]"
                >
                  Reiniciar
                </button>
                <button
                  onClick={onSalir}
                  className="h-11 flex-1 rounded-2xl border-2 border-[#d8c8a4] text-sm font-bold text-[#6d5a3a]"
                >
                  Salir
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {fase === "tiempo" && (
          <motion.div
            key="tiempo"
            className="absolute inset-0 z-40 flex items-center justify-center overflow-y-auto bg-[#4a3b22]/45 p-3 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="my-auto flex w-full max-w-xs flex-col items-center gap-2.5 rounded-3xl border border-[#e2d5b4] bg-[#fdf9ef] p-4 text-center shadow-2xl"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
            >
              <Mascot humor="preocupado" size={vp.bajaAltura ? 56 : 74} />
              <h3 className="text-base font-black">¡Se acabó el servicio!</h3>
              <p className="text-xs font-semibold text-[#8a7a5c]">
                Sin pena: el próximo bento saldrá perfecto.
              </p>
              <button
                onClick={reiniciar}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#a03127] font-black text-[#fdf6ea]"
              >
                <RotateCw size={18} /> Reintentar
              </button>
              <button
                onClick={onSalir}
                className="h-11 w-full rounded-2xl border-2 border-[#d8c8a4] text-sm font-bold text-[#6d5a3a]"
              >
                Volver a la carta
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Momento ASMR del cierre */}
      {resultado && (
        <ResultScreen
          resultado={resultado}
          nombreNivel={nivel.nombre}
          esUltimo={nivel.id >= totalNiveles}
          onSiguiente={onSiguiente}
          onRepetir={reiniciar}
          onSalir={onSalir}
        />
      )}
    </div>
  );
}
