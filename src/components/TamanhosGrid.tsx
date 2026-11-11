"use client";
import { useState } from "react";
import { TAMANHOS, type Tamanho } from "@/data/site";
import PalletCard from "./PalletCard";
import Reveal from "./Reveal";

const dims = (m: string): [number, number] | null => {
  const p = m.split(/x/i).map((v) => parseFloat(v.trim().replace(",", ".")));
  return p.length === 2 && p.every(Number.isFinite) ? [p[0], p[1]] : null;
};
const madeira = (t: Tamanho) => !t.tipo || t.tipo === "madeira";

const FILTROS: { id: string; t: string; ok: (t: Tamanho) => boolean }[] = [
  { id: "todos", t: "Todos", ok: () => true },
  { id: "120", t: "1,20 × 1,00", ok: (t) => madeira(t) && t.medida === "1,20 x 1,00" },
  { id: "quad", t: "Quadrados", ok: (t) => { const d = dims(t.medida); return madeira(t) && !!d && d[0] === d[1]; } },
  { id: "gr", t: "Maiores", ok: (t) => { const d = dims(t.medida); return madeira(t) && !!d && Math.max(...d) >= 1.25; } },
  { id: "pl", t: "Plástico", ok: (t) => t.tipo === "plastico" },
  { id: "ch", t: "Chapatex", ok: (t) => t.tipo === "chapa" },
  { id: "mov", t: "Móveis", ok: (t) => !dims(t.medida) },
];

export default function TamanhosGrid() {
  const [f, setF] = useState("todos");
  const filtro = FILTROS.find((x) => x.id === f)!;
  const lista = TAMANHOS.filter(filtro.ok);
  return (
    <>
      <div className="chips" role="group" aria-label="Filtrar por tamanho">
        {FILTROS.map((x) => (
          <button key={x.id} type="button" className="chip" aria-pressed={f === x.id} onClick={() => setF(x.id)}>
            {x.t} <small>{TAMANHOS.filter(x.ok).length}</small>
          </button>
        ))}
      </div>
      <div className="grid g3" key={f}>
        {lista.map((t, i) => (
          <Reveal key={t.nome + t.medida} delay={(i % 3) * 90}><PalletCard t={t} /></Reveal>
        ))}
      </div>
    </>
  );
}