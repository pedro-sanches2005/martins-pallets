"use client";
import { IG_FOTOS, SITE } from "@/data/site";
import Reveal from "./Reveal";

const tilt = (e: React.PointerEvent<HTMLElement>) => {
  const el = e.currentTarget, r = el.getBoundingClientRect();
  el.style.setProperty("--ry", `${((e.clientX - r.left) / r.width - 0.5) * 10}deg`);
  el.style.setProperty("--rx", `${-((e.clientY - r.top) / r.height - 0.5) * 10}deg`);
};
const reset = (e: React.PointerEvent<HTMLElement>) => {
  e.currentTarget.style.setProperty("--rx", "0deg");
  e.currentTarget.style.setProperty("--ry", "0deg");
};

export default function InstagramShortcut() {
  return (
    <section className="ig" id="instagram">
      <div className="wrap">
        <Reveal>
          <a className="ig-card tilt" href={SITE.instagram} target="_blank" rel="noopener noreferrer"
             onPointerMove={tilt} onPointerLeave={reset} aria-label={`Abrir ${SITE.instagramHandle} no Instagram`}>
            <span className="ig-ring"><span className="ig-avatar">MP</span></span>
            <span className="ig-info">
              <span className="eyebrow">Acompanhe nossa rotina</span>
              <strong className="ig-handle">{SITE.instagramHandle}</strong>
              <span className="ig-bio">Fotos dos pallets, entregas e novidades da Martins Pallets.</span>
            </span>
            <span className="btn ig-btn">Seguir no Instagram →</span>
          </a>
        </Reveal>
        {IG_FOTOS.length > 0 && (
          <div className="ig-grid" style={{ marginTop: 14 }}>
            {IG_FOTOS.map((f, i) => (
              <Reveal key={f} delay={i * 70}>
                <a className="ig-item" href={SITE.instagram} target="_blank" rel="noopener noreferrer"
                   onPointerMove={tilt} onPointerLeave={reset}>
                  <img src={`/pallets/${f}`} alt={`Foto ${i + 1} do Instagram da Martins Pallets`} loading="lazy" />
                </a>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}