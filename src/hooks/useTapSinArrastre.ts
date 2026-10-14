/**
 * useTapSinArrastre — Motor de gestos de la bandeja.
 *
 * Un solo flujo de puntero decide ENTRE TRES cosas, nunca dos a la vez:
 *   · tap      → rotar la pieza
 *   · arrastre → sacarla hacia la caja
 *   · scroll   → recorrer la bandeja
 *
 * Por qué NO usamos `touch-action: pan-x/pan-y` en las piezas:
 * el navegador se quedaba con cualquier gesto que tuviera algo de
 * componente paralelo y nos mandaba `pointercancel`. Resultado: la
 * pieza no se movía y el siguiente toque la rotaba sin querer. Ahora
 * las piezas llevan `touch-action: none` y el scroll de la bandeja lo
 * hacemos nosotros a mano cuando el gesto va claramente a lo largo
 * del eje. Así el arrastre SIEMPRE responde, incluso en diagonal.
 */
import { useCallback, useEffect, useRef } from "react";

export interface Punto {
  x: number;
  y: number;
}

/** Celda de la pieza que el dedo ha agarrado (en unidades de celda). */
export interface Agarre {
  fx: number;
  fy: number;
}

type Modo = "indeciso" | "arrastre" | "scroll";

interface Opciones {
  /** Eje de scroll de la bandeja. */
  ejeBandeja: "x" | "y";
  /** Distancia en px que convierte un toque en gesto. */
  umbral?: number;
  /** Contenedor desplazable de la bandeja. */
  contenedorRef: React.RefObject<HTMLElement | null>;
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
  contenedor: HTMLElement | null;
  inicio: Punto;
  ultima: Punto;
  scrollInicial: number;
  margenScroll: number;
  modo: Modo;
  tactil: boolean;
}

interface Manejadores {
  mover: (e: PointerEvent) => void;
  soltar: (e: PointerEvent) => void;
  cancelar: (e: PointerEvent) => void;
}

export function useTapSinArrastre({
  ejeBandeja,
  umbral = 7,
  contenedorRef,
  alIniciarArrastre,
  alMover,
  alSoltar,
  alCancelar,
  alTap,
}: Opciones) {
  const gesto = useRef<Gesto | null>(null);
  // Callbacks y ajustes siempre frescos; las escuchas se crean una vez.
  const cb = useRef({
    ejeBandeja,
    umbral,
    contenedorRef,
    alIniciarArrastre,
    alMover,
    alSoltar,
    alCancelar,
    alTap,
  });
  cb.current = {
    ejeBandeja,
    umbral,
    contenedorRef,
    alIniciarArrastre,
    alMover,
    alSoltar,
    alCancelar,
    alTap,
  };

  const manejadores = useRef<Manejadores | null>(null);
  if (!manejadores.current) {
    const quitarEscuchas = () => {
      const m = manejadores.current;
      if (!m) return;
      window.removeEventListener("pointermove", m.mover);
      window.removeEventListener("pointerup", m.soltar);
      window.removeEventListener("pointercancel", m.cancelar);
    };

    /** Cierra el gesto vivo pase lo que pase (incluye limpieza de estado). */
    const abortar = () => {
      const g = gesto.current;
      if (!g) return;
      quitarEscuchas();
      gesto.current = null;
      if (g.modo === "arrastre") cb.current.alCancelar();
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
        const dx = e.clientX - g.inicio.x;
        const dy = e.clientY - g.inicio.y;
        const adx = Math.abs(dx);
        const ady = Math.abs(dy);

        if (g.modo === "indeciso") {
          if (Math.max(adx, ady) < cb.current.umbral) return;
          const paralelo = cb.current.ejeBandeja === "x" ? adx : ady;
          const perpendicular = cb.current.ejeBandeja === "x" ? ady : adx;
          // El gesto solo cuenta como scroll si es MUY claramente a lo
          // largo del eje y además hay recorrido que desplazar. En
          // cualquier otro caso manda el arrastre: sacar la pieza es
          // la acción principal y nunca debe fallar.
          const esScroll =
            g.tactil && g.margenScroll > 0 && paralelo > perpendicular * 1.5;
          if (esScroll) {
            g.modo = "scroll";
          } else {
            g.modo = "arrastre";
            try {
              g.el.setPointerCapture(g.idPuntero);
            } catch {
              /* seguimos escuchando en window */
            }
            cb.current.alIniciarArrastre(g.uid, g.ultima);
          }
        }

        if (g.modo === "arrastre") {
          cb.current.alMover(g.ultima);
        } else if (g.modo === "scroll" && g.contenedor) {
          // Scroll manual: el navegador ya no nos roba el gesto.
          if (cb.current.ejeBandeja === "x") {
            g.contenedor.scrollLeft = g.scrollInicial - dx;
          } else {
            g.contenedor.scrollTop = g.scrollInicial - dy;
          }
        }
      },

      soltar: (e) =>
        cerrar(e, (g) => {
          if (g.modo === "arrastre") {
            cb.current.alSoltar(g.ultima);
            return;
          }
          if (g.modo === "scroll") return;
          // Tap solo si el dedo apenas se movió: un intento de arrastre
          // que se quedó corto JAMÁS debe acabar rotando la pieza.
          const recorrido = Math.max(
            Math.abs(g.ultima.x - g.inicio.x),
            Math.abs(g.ultima.y - g.inicio.y),
          );
          if (recorrido < cb.current.umbral) cb.current.alTap(g.uid);
        }),

      cancelar: (e) =>
        cerrar(e, (g) => {
          if (g.modo === "arrastre") cb.current.alCancelar();
        }),
    };

    // Guardamos `abortar` para poder reutilizarlo desde `bajar`.
    (manejadores.current as Manejadores & { abortar: () => void }).abortar = abortar;
  }

  /** Conectar al onPointerDown de cada pieza de la bandeja. */
  const bajar = useCallback((uid: string, e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const m = manejadores.current as (Manejadores & { abortar: () => void }) | null;
    if (!m) return;
    // Si quedó un gesto huérfano (un pointerup perdido, una pieza que
    // se desmontó a medias…), lo cerramos: nunca debe bloquear el
    // siguiente arrastre.
    if (gesto.current) m.abortar();

    const contenedor = cb.current.contenedorRef.current ?? e.currentTarget.parentElement;
    const margenScroll = contenedor
      ? cb.current.ejeBandeja === "x"
        ? contenedor.scrollWidth - contenedor.clientWidth
        : contenedor.scrollHeight - contenedor.clientHeight
      : 0;

    gesto.current = {
      uid,
      idPuntero: e.pointerId,
      el: e.currentTarget,
      contenedor,
      inicio: { x: e.clientX, y: e.clientY },
      ultima: { x: e.clientX, y: e.clientY },
      scrollInicial: contenedor
        ? cb.current.ejeBandeja === "x"
          ? contenedor.scrollLeft
          : contenedor.scrollTop
        : 0,
      margenScroll: Math.max(0, margenScroll - 4),
      modo: "indeciso",
      tactil: e.pointerType !== "mouse",
    };
    window.addEventListener("pointermove", m.mover);
    window.addEventListener("pointerup", m.soltar);
    window.addEventListener("pointercancel", m.cancelar);
  }, []);

  // Limpieza al desmontar.
  useEffect(() => {
    const m = manejadores.current as (Manejadores & { abortar: () => void }) | null;
    return () => m?.abortar();
  }, []);

  return { bajar };
}
