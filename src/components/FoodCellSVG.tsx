/**
 * FoodCellSVG — Bocado procedural para una celda de Bento Pop.
 * Conserva los rasgos del FoodSVG grande, pero legible a 24–70 px.
 */
import { useId } from "react";
import type { IngredienteId } from "../game/types";

interface Props {
  id: IngredienteId;
  size: number;
}

export function FoodCellSVG({ id, size }: Props) {
  const uid = useId().replace(/:/g, "");
  const base: Record<IngredienteId, string> = {
    arroz: "#faf7ef",
    onigiri: "#f8f4e8",
    tamagoyaki: "#f6c945",
    salmon: "#f5825f",
    karaage: "#d8983c",
    tempura: "#e3a94f",
    brocoli: "#5c9a4e",
    cherry: "#e84b4b",
    edamame: "#79a95c",
    maki: "#332f2a",
    takuan: "#eec63f",
    zanahoria: "#f18f3b",
    umeboshi: "#b3364a",
  };

  const detalle = () => {
    switch (id) {
      case "arroz":
        return <><path d="M18 36q14-9 28 0M17 50q15-8 30 0" stroke="#e3dbc8" strokeWidth="5" fill="none" strokeLinecap="round"/><ellipse cx="24" cy="25" rx="4" ry="2" fill="#5c5144" transform="rotate(-25 24 25)"/><ellipse cx="43" cy="43" rx="4" ry="2" fill="#8d806d" transform="rotate(30 43 43)"/></>;
      case "onigiri":
        return <><path d="M32 13L51 49Q54 55 47 55H17Q10 55 13 49L32 13Z" fill="#fffdf6" stroke="#ded4bf" strokeWidth="3"/><rect x="24" y="39" width="16" height="18" rx="4" fill="#2e2b26"/></>;
      case "tamagoyaki":
        return <><path d="M13 24h38M13 34h38M13 44h38" stroke="#dfaa29" strokeWidth="5" strokeLinecap="round"/><circle cx="46" cy="34" r="9" fill="none" stroke="#fff0b8" strokeWidth="4"/></>;
      case "salmon":
        return <><path d="M12 17l35 34M22 11l32 31M10 35l20 19" stroke="#ffc1a5" strokeWidth="6" strokeLinecap="round"/><ellipse cx="24" cy="20" rx="10" ry="5" fill="#fff" opacity=".28" transform="rotate(-25 24 20)"/></>;
      case "karaage":
        return <>{[[22,22,13],[42,23,12],[25,43,14],[44,43,11]].map(([x,y,r],i)=><g key={i}><circle cx={x} cy={y} r={r} fill={i%2?"#c7832f":"#e0a14b"}/><circle cx={x-4} cy={y-4} r={3} fill="#f0c36e"/><circle cx={x+4} cy={y+3} r={2.5} fill="#9c6421"/></g>)}</>;
      case "tempura":
        return <><path d="M22 50Q31 31 41 15" stroke="#f0c36e" strokeWidth="17" strokeLinecap="round"/><path d="M42 17q11-12 13 2q-8 2-9 10" fill="#e2603f" stroke="#c24c2f" strokeWidth="2"/><path d="M22 48l7-5M27 37l8-4M32 28l8-3" stroke="#bd7f28" strokeWidth="4" strokeLinecap="round"/></>;
      case "brocoli":
        return <><path d="M27 52h12l-3-20h-6z" fill="#b7d3a2"/><circle cx="32" cy="24" r="15" fill="#4f8f43"/><circle cx="19" cy="32" r="11" fill="#579a49"/><circle cx="45" cy="32" r="11" fill="#437d3b"/><circle cx="27" cy="19" r="4" fill="#8bc177"/></>;
      case "cherry":
        return <><path d="M32 22q2-11 12-14" stroke="#477d3d" strokeWidth="4" fill="none" strokeLinecap="round"/><path d="M40 10q10-5 14 1q-9 6-14-1" fill="#5c9a4e"/><circle cx="31" cy="38" r="19" fill="#e84b4b" stroke="#bd3636" strokeWidth="3"/><circle cx="24" cy="31" r="6" fill="#fff" opacity=".38"/></>;
      case "edamame":
        return <><path d="M11 36q21-25 42 0q-21 25-42 0" fill="#79a95c" stroke="#54833e" strokeWidth="3"/><circle cx="21" cy="37" r="8" fill="#9bc57b"/><circle cx="36" cy="31" r="8" fill="#90bc70"/><circle cx="48" cy="38" r="7" fill="#86b467"/></>;
      case "maki":
        return <><circle cx="32" cy="32" r="24" fill="#27241f"/><circle cx="32" cy="32" r="17" fill="#faf5e8"/><circle cx="32" cy="32" r="10" fill="#f2765c"/><circle cx="28" cy="28" r="3" fill="#ffd1bd"/></>;
      case "takuan":
        return <><circle cx="32" cy="32" r="23" fill="#eec63f" stroke="#c39b22" strokeWidth="3"/><circle cx="32" cy="32" r="14" fill="none" stroke="#f9e490" strokeWidth="5"/><circle cx="32" cy="32" r="5" fill="#d9a92a"/></>;
      case "zanahoria":
        return <>{[0,72,144,216,288].map((r)=><ellipse key={r} cx="32" cy="19" rx="10" ry="16" fill="#f18f3b" stroke="#d87325" strokeWidth="2" transform={`rotate(${r} 32 32)`}/>) }<circle cx="32" cy="32" r="9" fill="#f6c945"/></>;
      case "umeboshi":
        return <><circle cx="32" cy="32" r="22" fill="#b3364a" stroke="#842637" strokeWidth="3"/><path d="M20 25q8 3 4 11M36 17q7 5 3 12M39 38q-6 6-2 12M22 42q7 2 4 8" stroke="#7e2433" strokeWidth="4" fill="none" strokeLinecap="round"/><circle cx="24" cy="24" r="5" fill="#fff" opacity=".25"/></>;
    }
  };

  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-label={id}>
      <defs><filter id={uid}><feDropShadow dx="0" dy="2" stdDeviation="1.5" floodOpacity=".2"/></filter></defs>
      <rect x="4" y="4" width="56" height="56" rx="18" fill={base[id]} stroke="rgba(70,50,25,.22)" strokeWidth="2.5" filter={`url(#${uid})`}/>
      {detalle()}
    </svg>
  );
}