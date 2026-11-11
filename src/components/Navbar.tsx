"use client";
import { useEffect, useRef, useState } from "react";

const LINKS = [
  { href: "#sobre", t: "Sobre" }, { href: "#servicos", t: "Serviços" }, { href: "#tamanhos", t: "Tamanhos" },
  { href: "#instagram", t: "Instagram" }, { href: "#contato", t: "Contato" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [ativo, setAtivo] = useState("");
  const barra = useRef<HTMLDivElement>(null);

  useEffect(() => { // barra de progresso de leitura
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      barra.current?.style.setProperty("--p", String(max > 0 ? window.scrollY / max : 0));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);

  useEffect(() => { // link da seção atual (IntersectionObserver)
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setAtivo(`#${e.target.id}`)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    LINKS.forEach((l) => { const el = document.querySelector(l.href); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", esc);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", esc); };
  }, [open]);

  return (
    <div className="nav">
      <div className="nav-progress" ref={barra} aria-hidden="true" />
      <div className="wrap">
        <a className="logo" href="#" onClick={() => setOpen(false)}>Martins <b>Pallets</b></a>
        <nav className="nav-desk" aria-label="Principal">
          {LINKS.map((l) => <a key={l.href} href={l.href} className={ativo === l.href ? "on" : ""}>{l.t}</a>)}
        </nav>
        <button type="button" className={`burger${open ? " open" : ""}`} aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open} aria-controls="menu-mobile" onClick={() => setOpen((v) => !v)}>
          <span /><span /><span />
        </button>
      </div>
      <div id="menu-mobile" className={`nav-panel${open ? " open" : ""}`}>
        <ul>
          {LINKS.map((l) => (
            <li key={l.href}><a href={l.href} className={ativo === l.href ? "on" : ""} onClick={() => setOpen(false)}>{l.t}</a></li>
          ))}
        </ul>
      </div>
    </div>
  );
}