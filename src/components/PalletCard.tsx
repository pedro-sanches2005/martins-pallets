"use client";
import { useEffect, useRef, useState } from "react";
import type { Tamanho } from "@/data/site";
import { adicionar, useOrcamento } from "@/lib/orcamento";
import s from "./PalletCard.module.css";

// "1,20 x 1,00" -> [1.2, 1]  (comprimento x largura, em metros)
function lerMedida(m: string): [number, number] | null {
  const p = m.split(/x/i).map((v) => parseFloat(v.trim().replace(",", ".")));
  return p.length === 2 && p.every((n) => Number.isFinite(n) && n > 0) ? [p[0], p[1]] : null;
}
const fmt = (n: number) => n.toFixed(2).replace(".", ",");

function Cota({ x1, y1, x2, y2, label, tx, ty, rot = 0 }: {
  x1: number; y1: number; x2: number; y2: number; label: string; tx: number; ty: number; rot?: number;
}) {
  const len = Math.hypot(x2 - x1, y2 - y1) || 1;
  const nx = (-(y2 - y1) / len) * 4, ny = ((x2 - x1) / len) * 4;
  return (
    <g>
      <g className={s.cota} stroke="var(--wood-2)" strokeWidth={1.5} fill="none">
        <line x1={x1} y1={y1} x2={x2} y2={y2} pathLength={1} />
        <line x1={x1 - nx} y1={y1 - ny} x2={x1 + nx} y2={y1 + ny} pathLength={1} />
        <line x1={x2 - nx} y1={y2 - ny} x2={x2 + nx} y2={y2 + ny} pathLength={1} />
      </g>
      <text className={s.rotulo} x={tx} y={ty} transform={`rotate(${rot} ${tx} ${ty})`} textAnchor="middle"
        fill="var(--cream)" style={{ fontFamily: "var(--font-display), sans-serif", fontWeight: 700, fontSize: 16 }}>
        {label}
      </text>
    </g>
  );
}

// Desenho técnico visto de cima, com as cotas de comprimento e largura
function Medidas({ comp, larg, nome, tipo = "madeira" }: { comp: number; larg: number; nome: string; tipo?: "madeira" | "chapa" | "plastico" }) {
  const sc = Math.min(210 / comp, 130 / larg);
  const W = comp * sc, H = larg * sc;
  const x0 = (320 - W) / 2 + 14, y0 = (220 - H) / 2 - 10;
  const bw = W * 0.15, gap = (W - 5 * bw) / 4; // 5 tábuas de cima
  return (
    <svg viewBox="0 0 320 220" className={s.svg} role="img"
      aria-label={`Desenho técnico do ${nome}: ${fmt(comp)} por ${fmt(larg)} metros`}>
      {tipo === "chapa" && (
        <rect x={x0} y={y0} width={W} height={H} rx={10} fill="#a9674a" stroke="#00000088" strokeWidth={1.2} />
      )}
      {tipo === "plastico" && (
        <>
          <defs>
            <pattern id="grade-plastico" width="10" height="10" patternUnits="userSpaceOnUse">
              <rect width="10" height="10" fill="#2b2b2b" />
              <path d="M0 0H10M0 0V10" stroke="#5a5a5a" strokeWidth="1.5" fill="none" />
            </pattern>
          </defs>
          <rect x={x0} y={y0} width={W} height={H} rx={4} fill="url(#grade-plastico)" stroke="#00000088" strokeWidth={1.2} />
        </>
      )}
      {tipo === "madeira" && [0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={x0 + i * (bw + gap)} y={y0} width={bw} height={H} fill="#c9965a" stroke="#00000088" strokeWidth={1.2} />
      ))}
      <Cota x1={x0} y1={y0 + H + 18} x2={x0 + W} y2={y0 + H + 18} label={`${fmt(comp)} m`} tx={x0 + W / 2} ty={y0 + H + 38} />
      <Cota x1={x0 - 18} y1={y0} x2={x0 - 18} y2={y0 + H} label={`${fmt(larg)} m`} tx={x0 - 26} ty={y0 + H / 2 + 5} rot={-90} />
      <text x={160} y={14} textAnchor="middle" fill="var(--muted)" style={{ fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase" }}>
        vista de cima · medidas em metros
      </text>
    </svg>
  );
}

export default function PalletCard({ t }: { t: Tamanho }) {
  const medida = lerMedida(t.medida); // "Banco de pallet" (Móveis) não tem medida numérica
  const [medidas, setMedidas] = useState(false);
  const [fase, setFase] = useState<"" | "sai" | "entra">("");
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const itens = useOrcamento();
  const id = `${t.nome}|${t.medida}`;
  const noOrcamento = itens.find((i) => i.id === id)?.qtd ?? 0;

  const alternar = () => {
    if (fase) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setMedidas((v) => !v); return; }
    setFase("sai");
    timers.current.push(window.setTimeout(() => {
      setMedidas((v) => !v);
      setFase("entra");
      timers.current.push(window.setTimeout(() => setFase(""), 240));
    }, 220));
  };

  const anim = fase === "sai" ? s.sai : fase === "entra" ? s.entra : "";

  return (
    <div className="card size">
      <figure className={`${s.stage}${medidas ? ` ${s.planta}` : ""}`}>
        {medidas && medida ? (
          <div className={anim} style={{ height: "100%", padding: 0 }}>
            <Medidas comp={medida[0]} larg={medida[1]} nome={`${t.nome} ${t.medida}`} tipo={t.tipo} />
          </div>
        ) : (
          <img className={anim} src={`/pallets/${t.img}`} alt={`${t.nome} ${t.medida}`} loading="lazy" />
        )}
        {medida && (
          <button type="button" className={s.ver} onClick={alternar} aria-pressed={medidas}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 17 17 3l4 4L7 21z" /><path d="m7 13 2 2M10 10l2 2M13 7l2 2" />
            </svg>
            {medidas ? "Ver foto" : "Ver medidas"}
          </button>
        )}
      </figure>
      <div>
        <h3>{t.nome}</h3><span>Medida: {t.medida}</span>
        {medida && (
          <ul className={s.dims}>
            <li><small>Comprim.</small><strong>{fmt(medida[0])}</strong></li>
            <li><small>Largura</small><strong>{fmt(medida[1])}</strong></li>
          </ul>
        )}
        <button type="button" className={`${s.quote}${noOrcamento ? " quote-added" : ""}`}
          onClick={() => adicionar({ id, nome: t.nome, medida: t.medida })}>
          {noOrcamento ? `✓ No orçamento (${noOrcamento}) · adicionar +1` : "+ Adicionar ao orçamento"}
        </button>
      </div>
    </div>
  );
}