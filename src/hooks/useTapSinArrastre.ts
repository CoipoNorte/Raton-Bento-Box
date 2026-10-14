/**
 * useTapSinArrastre — El anti-bug del gesto doble, versión seria.
 *
 * El bug original: drag + onTap de Framer Motion disparan AMBOS gestos
 * al soltar. La solución definitiva es no usar `drag` en absoluto:
 * aquí UN SOLO flujo de puntero decide — o es arrastre, o es tap,
 * nunca los dos. Además convive con el SCROLL NATIVO de la bandeja:
 *
 * - Cada pieza lleva `touch-action: pan-x|pan-y` según el eje de la
 *   bandeja. Un gesto a lo largo del eje lo captura el navegador para
 *   hacer scroll y nos llega `pointercancel`: cancelamos limpios.
 * - Un gesto hacia la caja (perpendicular al eje) supera el umbral y
 *   se convierte en arrastre: ahí sí capturamos el puntero.
 * - Soltar sin arrastrar = tap (rotar). Una sola decisión por gesto.
 * - La limpieza de escuchas ocurre en la misma macrotarea del `up`:
 *   el siguiente gesto siempre nace con la casa ordenada.
 */
import { useCallback, useEffect, useRef } from "react";

export interface Punto {
  x: number;
  y: number;
}

interface Opciones {
  /** Eje de scroll de la bandeja: el arrastre exige dominancia perpendicular. */
  ejeBandeja: "x" | "y";
  umbral?: number;
  alIniciarArrastre: (uid: string, punto: Punto) => void;
  alMover: (punto: Punto) => void;
  alSoltar: (punto: Punto) => void;
  alCancelar: () => void;
  alTap: (uid: string) => void;
}

interface Gesto {
  uid: string;
  idPuntero: number;
  el: HTMLElement;
  inicio: Punto;
  ultima: Punto;
  arrastrando: boolean;
  /** Solo el táctil compite con el scroll; el ratón arrastra libre. */
  tactil: boolean;
  /** ¿La bandeja puede desplazarse de verdad en su eje? */
  bandejaDesplazable: boolean;
}

interface Manejadores {
  mover: (e: PointerEvent) => void;
  soltar: (e: PointerEvent) => void;
  cancelar: (e: PointerEvent) => void;
}

export function useTapSinArrastre({
  ejeBandeja,
  umbral = 8,
  alIniciarArrastre,
  alMover,
  alSoltar,
  alCancelar,
  alTap,
}: Opciones) {
  const gesto = useRef<Gesto | null>(null);
  // Callbacks y ajustes siempre frescos, escuchas registradas una sola vez.
  const cb = useRef({ ejeBandeja, umbral, alIniciarArrastre, alMover, alSoltar, alCancelar, alTap });
  cb.current = { ejeBandeja, umbral, alIniciarArrastre, alMover, alSoltar, alCancelar, alTap };

  // Manejadores perezosos: se crean una vez y leen siempre cb.current.
  const manejadores = useRef<Manejadores | null>(null);
  if (!manejadores.current) {
    const quitarEscuchas = () => {
      const m = manejadores.current;
      if (!m) return;
      window.removeEventListener("pointermove", m.mover);
      window.removeEventListener("pointerup", m.soltar);
      window.removeEventListener("pointercancel", m.cancelar);
    };
    const cerrar = (e: PointerEvent, fin: (g: Gesto) => void) => {
      const g = gesto.current;
      if (!g || e.pointerId !== g.idPuntero) return;
      quitarEscuchas();
      gesto.current = null;
      fin(g);
    };
    manejadores.current = {
      mover: (e) => {
        const g = gesto.current;
        if (!g || e.pointerId !== g.idPuntero) return;
        g.ultima = { x: e.clientX, y: e.clientY };
        if (!g.arrastrando) {
          const dx = Math.abs(e.clientX - g.inicio.x);
          const dy = Math.abs(e.clientY - g.inicio.y);
          if (Math.max(dx, dy) < cb.current.umbral) return;
          // Solo disputamos el gesto al scroll si de verdad hay scroll
          // táctil en juego. Con ratón, o con la bandeja sin desplazar,
          // cualquier dirección vale: arrastrar en diagonal funciona.
          if (g.tactil && g.bandejaDesplazable) {
            const paralelo = cb.current.ejeBandeja === "x" ? dx : dy;
            const perpendicular = cb.current.ejeBandeja === "x" ? dy : dx;
            // Margen generoso (0.7): no exige un gesto perfectamente recto.
            if (perpendicular < paralelo * 0.7) return;
          }
          g.arrastrando = true;
          try {
            g.el.setPointerCapture(g.idPuntero);
          } catch {
            /* el puntero ya no existe: seguimos por ventana */
          }
          cb.current.alIniciarArrastre(g.uid, g.ultima);
        }
        cb.current.alMover(g.ultima);
      },
      soltar: (e) =>
        cerrar(e, (g) => {
          if (g.arrastrando) {
            cb.current.alSoltar(g.ultima);
            return;
          }
          // Tap SOLO si el recorrido total fue minúsculo: un barrido
          // largo sin arrastre (p. ej. desplazar la bandeja con el
          // ratón) no debe rotar la pieza por accidente.
          const recorrido = Math.max(
            Math.abs(g.ultima.x - g.inicio.x),
            Math.abs(g.ultima.y - g.inicio.y),
          );
          if (recorrido < cb.current.umbral) cb.current.alTap(g.uid);
        }),
      cancelar: (e) =>
        cerrar(e, (g) => {
          if (g.arrastrando) cb.current.alCancelar();
        }),
    };
  }

  /** Conectar al onPointerDown de cada pieza de la bandeja. */
  const bajar = useCallback((uid: string, e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    if (gesto.current) return; // un gesto a la vez, la calma primero
    const m = manejadores.current;
    if (!m) return;
    // ¿Hay scroll real en la bandeja? Si no, nada compite con el arrastre.
    const contenedor = e.currentTarget.parentElement;
    const desplazable = contenedor
      ? cb.current.ejeBandeja === "x"
        ? contenedor.scrollWidth - contenedor.clientWidth > 4
        : contenedor.scrollHeight - contenedor.clientHeight > 4
      : false;
    gesto.current = {
      uid,
      idPuntero: e.pointerId,
      el: e.currentTarget,
      inicio: { x: e.clientX, y: e.clientY },
      ultima: { x: e.clientX, y: e.clientY },
      arrastrando: false,
      tactil: e.pointerType !== "mouse",
      bandejaDesplazable: desplazable,
    };
    window.addEventListener("pointermove", m.mover);
    window.addEventListener("pointerup", m.soltar);
    window.addEventListener("pointercancel", m.cancelar);
  }, []);

  // Limpieza al desmontar.
  useEffect(
    () => () => {
      const m = manejadores.current;
      if (!m) return;
      window.removeEventListener("pointermove", m.mover);
      window.removeEventListener("pointerup", m.soltar);
      window.removeEventListener("pointercancel", m.cancelar);
    },
    [],
  );

  return { bajar };
}
