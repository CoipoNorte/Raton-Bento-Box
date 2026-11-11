/**
 * sound.ts — Motor ASMR 100 % sintetizado con WebAudio.
 * Sin archivos de audio: cada ingrediente tiene su sonido reconocible.
 * Todo va envuelto en try/catch: el silencio nunca rompe el juego.
 */
import type { TipoSonido } from "./types";

let ctx: AudioContext | null = null;
let maestro: GainNode | null = null;
let silenciado = false;
let nodoAmbiente: { src: AudioBufferSourceNode; gain: GainNode } | null = null;

/** Crea (o reanuda) el contexto. Llamar tras un gesto del usuario. */
export function inicializarAudio(): void {
  try {
    if (!ctx) {
      const AC =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!AC) return;
      ctx = new AC();
      maestro = ctx.createGain();
      maestro.gain.value = silenciado ? 0 : 0.9;
      maestro.connect(ctx.destination);
    }
    if (ctx.state === "suspended") void ctx.resume();
  } catch {
    /* sin audio */
  }
}

export function setSilencio(valor: boolean): void {
  silenciado = valor;
  try {
    if (maestro && ctx) {
      maestro.gain.setTargetAtTime(valor ? 0 : 0.9, ctx.currentTime, 0.03);
    }
  } catch {
    /* sin audio */
  }
}

export function estaSilenciado(): boolean {
  return silenciado;
}

/* --------------------------- utilidades --------------------------- */

function ahora(): number {
  return ctx ? ctx.currentTime : 0;
}

/** Búfer de ruido blanco reutilizable. */
let bufferRuido: AudioBuffer | null = null;
function ruido(): AudioBuffer | null {
  if (!ctx) return null;
  try {
    if (!bufferRuido) {
      const len = ctx.sampleRate;
      bufferRuido = ctx.createBuffer(1, len, ctx.sampleRate);
      const datos = bufferRuido.getChannelData(0);
      for (let i = 0; i < len; i++) datos[i] = Math.random() * 2 - 1;
    }
    return bufferRuido;
  } catch {
    return null;
  }
}

/** Envoltura de ruido filtrado (chispas, crujientes, whooshes). */
function golpeRuido(opts: {
  duracion: number;
  frecuencia: number;
  q?: number;
  tipo?: BiquadFilterType;
  volumen: number;
  frecuenciaFin?: number;
  retardo?: number;
}): void {
  if (!ctx || !maestro) return;
  try {
    const t = ahora() + (opts.retardo ?? 0);
    const src = ctx.createBufferSource();
    const buf = ruido();
    if (!buf) return;
    src.buffer = buf;
    src.loop = true;
    const filtro = ctx.createBiquadFilter();
    filtro.type = opts.tipo ?? "bandpass";
    filtro.frequency.setValueAtTime(opts.frecuencia, t);
    if (opts.frecuenciaFin) {
      filtro.frequency.exponentialRampToValueAtTime(
        Math.max(40, opts.frecuenciaFin),
        t + opts.duracion,
      );
    }
    filtro.Q.value = opts.q ?? 1;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(opts.volumen, t + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + opts.duracion);
    src.connect(filtro).connect(gain).connect(maestro);
    src.start(t);
    src.stop(t + opts.duracion + 0.05);
  } catch {
    /* sin audio */
  }
}

/** Tono con envolvente exponencial (pops, golpes graves, cuerdas). */
function tono(opts: {
  frecuencia: number;
  frecuenciaFin?: number;
  duracion: number;
  tipo?: OscillatorType;
  volumen: number;
  retardo?: number;
}): void {
  if (!ctx || !maestro) return;
  try {
    const t = ahora() + (opts.retardo ?? 0);
    const osc = ctx.createOscillator();
    osc.type = opts.tipo ?? "sine";
    osc.frequency.setValueAtTime(opts.frecuencia, t);
    if (opts.frecuenciaFin) {
      osc.frequency.exponentialRampToValueAtTime(
        Math.max(30, opts.frecuenciaFin),
        t + opts.duracion,
      );
    }
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(opts.volumen, t + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + opts.duracion);
    osc.connect(gain).connect(maestro);
    osc.start(t);
    osc.stop(t + opts.duracion + 0.05);
  } catch {
    /* sin audio */
  }
}

/* --------------------------- sonidos ASMR --------------------------- */

/** Sonido al colocar cada familia de ingrediente. */
export function colocar(familia: TipoSonido): void {
  switch (familia) {
    case "granular": // arroz: ráfaga granular suave y mate
      golpeRuido({ duracion: 0.14, frecuencia: 900, q: 0.7, volumen: 0.32 });
      golpeRuido({ duracion: 0.1, frecuencia: 500, q: 1.2, volumen: 0.2, retardo: 0.02 });
      break;
    case "crujiente": // tempura / karaage: chispa brillante rapidísima
      golpeRuido({ duracion: 0.07, frecuencia: 4200, q: 0.6, volumen: 0.3 });
      golpeRuido({ duracion: 0.05, frecuencia: 6500, q: 0.8, volumen: 0.22, retardo: 0.03 });
      tono({ frecuencia: 180, frecuenciaFin: 90, duracion: 0.08, volumen: 0.2 });
      break;
    case "pop": // edamame / cherry: blip con envolvente de tono
      tono({ frecuencia: 620, frecuenciaFin: 940, duracion: 0.09, volumen: 0.34 });
      tono({ frecuencia: 1240, duracion: 0.05, volumen: 0.12, retardo: 0.015 });
      break;
    case "blando": // salmón / tamagoyaki: golpe grave y corto
      tono({ frecuencia: 220, frecuenciaFin: 120, duracion: 0.12, tipo: "triangle", volumen: 0.42 });
      golpeRuido({ duracion: 0.05, frecuencia: 300, q: 1, volumen: 0.12 });
      break;
  }
}

/** Rotar: clic de madera. */
export function rotar(): void {
  tono({ frecuencia: 1150, frecuenciaFin: 700, duracion: 0.035, tipo: "square", volumen: 0.12 });
  golpeRuido({ duracion: 0.03, frecuencia: 2400, q: 2.5, volumen: 0.16 });
}

/** Movimiento inválido: golpe sordo, nada estridente. */
export function invalido(): void {
  tono({ frecuencia: 140, frecuenciaFin: 80, duracion: 0.14, tipo: "sine", volumen: 0.3 });
}

/** Quitar pieza de la caja: pop ascendente suave. */
export function quitar(): void {
  tono({ frecuencia: 380, frecuenciaFin: 720, duracion: 0.1, tipo: "triangle", volumen: 0.28 });
}

/** Encaje perfecto de compartimento: campanita dorada. */
export function perfecto(): void {
  tono({ frecuencia: 1567.98, duracion: 0.35, tipo: "sine", volumen: 0.22 });
  tono({ frecuencia: 2093, duracion: 0.4, tipo: "sine", volumen: 0.16, retardo: 0.06 });
  golpeRuido({ duracion: 0.2, frecuencia: 8000, q: 0.4, volumen: 0.06 });
}

/** La tapa cae y encaja: clic seco + whoosh de aire. */
export function tapa(): void {
  golpeRuido({ duracion: 0.09, frecuencia: 1800, q: 3, volumen: 0.4 });
  tono({ frecuencia: 320, frecuenciaFin: 140, duracion: 0.09, tipo: "triangle", volumen: 0.34 });
  golpeRuido({ duracion: 0.3, frecuencia: 400, frecuenciaFin: 120, q: 0.8, volumen: 0.1, retardo: 0.02 });
}

/** La goma elástica: cuerda pulsada. */
export function goma(): void {
  tono({ frecuencia: 196, frecuenciaFin: 130, duracion: 0.28, tipo: "sawtooth", volumen: 0.2 });
  tono({ frecuencia: 392, frecuenciaFin: 260, duracion: 0.2, tipo: "triangle", volumen: 0.14, retardo: 0.01 });
}

/** El furoshiki se despliega: roce de tela. */
export function furoshiki(): void {
  golpeRuido({ duracion: 0.5, frecuencia: 2500, frecuenciaFin: 700, q: 0.5, volumen: 0.12 });
}

/** Arpegio pentatónico C–D–E–G–A tipo koto al completar el nivel. */
export function arpegioCompletado(): void {
  const notas = [523.25, 587.33, 659.25, 783.99, 880];
  notas.forEach((f, i) => {
    tono({ frecuencia: f, duracion: 0.5, tipo: "triangle", volumen: 0.24, retardo: i * 0.13 });
    tono({ frecuencia: f * 2, duracion: 0.3, tipo: "sine", volumen: 0.06, retardo: i * 0.13 });
  });
}

/** Clic de interfaz. */
export function clic(): void {
  golpeRuido({ duracion: 0.03, frecuencia: 2000, q: 3, volumen: 0.12 });
}

/* --------------------------- ambiente --------------------------- */

/** Lluvia suave / cocina lejana en bucle, muy bajito. */
export function ambiente(activo: boolean): void {
  try {
    if (activo) {
      inicializarAudio();
      if (!ctx || !maestro || nodoAmbiente) return;
      const src = ctx.createBufferSource();
      const buf = ruido();
      if (!buf) return;
      src.buffer = buf;
      src.loop = true;
      const filtro = ctx.createBiquadFilter();
      filtro.type = "lowpass";
      filtro.frequency.value = 700;
      const gain = ctx.createGain();
      gain.gain.value = 0.035;
      src.connect(filtro).connect(gain).connect(maestro);
      src.start();
      nodoAmbiente = { src, gain };
    } else if (nodoAmbiente && ctx) {
      const { src, gain } = nodoAmbiente;
      gain.gain.setTargetAtTime(0, ctx.currentTime, 0.2);
      setTimeout(() => {
        try {
          src.stop();
        } catch {
          /* ya parado */
        }
      }, 600);
      nodoAmbiente = null;
    }
  } catch {
    /* sin ambiente */
  }
}

/** Fanfarria de la goma + furoshiki completos (secuencia del cierre). */
export function secuenciaCierre(): void {
  tapa();
  setTimeout(() => goma(), 450);
  setTimeout(() => furoshiki(), 950);
  setTimeout(() => arpegioCompletado(), 1500);
}
