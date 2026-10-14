/**
 * storage.ts — Progreso y preferencias.
 * - ÚNICA puerta de acceso a la persistencia: si mañana migramos a
 *   IndexedDB, solo cambia este archivo.
 * - Tolerante a modo incógnito / navegadores sin localStorage:
 *   cae a un almacén en memoria sin lanzar excepciones.
 */
import type { Preferencias, Progreso } from "./types";

const CLAVE_PROGRESO = "bento.progreso.v1";
const CLAVE_PREFS = "bento.prefs.v1";

/* ---------------- almacén con respaldo en memoria ---------------- */

const memoria = new Map<string, string>();

/** ¿localStorage realmente utilizable? (Safari privado lanza al escribir). */
const usaLocal = (() => {
  try {
    const k = "__bento_test__";
    window.localStorage.setItem(k, "1");
    window.localStorage.removeItem(k);
    return true;
  } catch {
    return false;
  }
})();

function leer(clave: string): string | null {
  try {
    if (usaLocal) return window.localStorage.getItem(clave);
    return memoria.get(clave) ?? null;
  } catch {
    return memoria.get(clave) ?? null;
  }
}

function escribir(clave: string, valor: string): void {
  try {
    if (usaLocal) {
      window.localStorage.setItem(clave, valor);
      return;
    }
  } catch {
    /* cae a memoria */
  }
  memoria.set(clave, valor);
}

function leerJSON<T>(clave: string, porDefecto: T): T {
  try {
    const crudo = leer(clave);
    if (!crudo) return porDefecto;
    return { ...porDefecto, ...(JSON.parse(crudo) as T) };
  } catch {
    return porDefecto;
  }
}

/* ------------------------------ API ------------------------------ */

const PROGRESO_INICIAL: Progreso = { estrellas: {}, nivelMax: 1, puntosTotales: 0 };
const PREFS_INICIALES: Preferencias = { sonido: true, ambiente: false, modo: "zen" };

export function obtenerProgreso(): Progreso {
  return leerJSON(CLAVE_PROGRESO, PROGRESO_INICIAL);
}

export function guardarProgreso(p: Progreso): void {
  escribir(CLAVE_PROGRESO, JSON.stringify(p));
}

/** Registra estrellas de un nivel (conserva el mejor resultado). */
export function registrarEstrellas(
  nivelId: number,
  estrellas: number,
  puntos: number,
  totalNiveles = 8,
): Progreso {
  const p = obtenerProgreso();
  const previas = p.estrellas[nivelId] ?? 0;
  p.estrellas[nivelId] = Math.max(previas, estrellas);
  p.nivelMax = Math.max(p.nivelMax, Math.min(nivelId + 1, totalNiveles));
  p.puntosTotales += puntos;
  guardarProgreso(p);
  return p;
}

export function obtenerPreferencias(): Preferencias {
  return leerJSON(CLAVE_PREFS, PREFS_INICIALES);
}

export function guardarPreferencias(prefs: Preferencias): void {
  escribir(CLAVE_PREFS, JSON.stringify(prefs));
}
