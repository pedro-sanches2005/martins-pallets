"use client";
import dynamic from "next/dynamic";
import { SITE } from "@/data/site";

const TruckScene = dynamic(() => import("./TruckScene"), { ssr: false });

export default function Hero() {
  return (
    <header className="hero">
      <div className="wrap">
        <div>
          <span className="eyebrow">Itu - SP · desde {SITE.desde}</span>
          <h1>Pallets de <em>madeira</em> com entrega rápida</h1>
          <p>Venda, fabricação sob encomenda, reforma e recolhimento. Melhor preço da região e pronta-entrega para a sua logística não parar.</p>
          <div className="cta">
            <a className="btn btn-wood" href={SITE.whatsapp} target="_blank" rel="noopener">Pedir orçamento</a>
            <a className="btn btn-ghost" href="#tamanhos">Ver tamanhos</a>
          </div>
          <div className="badges">
            <div><strong>+{new Date().getFullYear() - SITE.desde}</strong><span>anos de mercado</span></div>
            <div><strong>5,0 ★</strong><span>no Google</span></div>
          </div>
        </div>
        <TruckScene />
      </div>
    </header>
  );
}