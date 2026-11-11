/**
 * useViewport — Mide la ventana y expone orientación y densidad.
 * Girar el dispositivo a mitad de nivel reorganiza la mesa sin
 * perder la caja ni el progreso (el estado vive en GameScreen).
 */
import { useEffect, useState } from "react";

export interface Viewport {
  ancho: number;
  alto: number;
  /** true si alto >= ancho (celular vertical). */
  retrato: boolean;
  /** poca altura: celular horizontal → modo denso. */
  bajaAltura: boolean;
}

function medir(): Viewport {
  const ancho = window.innerWidth;
  const alto = window.innerHeight;
  return {
    ancho,
    alto,
    retrato: alto >= ancho,
    bajaAltura: alto < 470,
  };
}

export function useViewport(): Viewport {
  const [vp, setVp] = useState<Viewport>(medir);

  useEffect(() => {
    let raf = 0;
    const alCambiar = () => {
      // Agrupamos con rAF para no recalcular en cada píxel del giro.
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setVp(medir()));
    };
    window.addEventListener("resize", alCambiar);
    window.addEventListener("orientationchange", alCambiar);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", alCambiar);
      window.removeEventListener("orientationchange", alCambiar);
    };
  }, []);

  return vp;
}
