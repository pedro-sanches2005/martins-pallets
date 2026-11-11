"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { SITE } from "@/data/site";
import s from "./PalletQuoteModal.module.css";

const maskPhone = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 3)} ${d.slice(3, 7)}-${d.slice(7)}`;
};

function WhatsIcon({ size = 22 }: { size?: number }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden fill="currentColor">
      <path d="M16.04 3C9.4 3 4 8.38 4 15c0 2.35.68 4.55 1.86 6.4L4 29l7.8-1.82A12 12 0 0 0 16.04 28C22.68 28 28 22.62 28 16S22.68 3 16.04 3Zm0 21.9c-1.5 0-2.9-.4-4.12-1.1l-.3-.17-4.63 1.08 1.1-4.5-.2-.32A9.8 9.8 0 0 1 6.2 15c0-5.42 4.4-9.8 9.84-9.8 5.42 0 9.76 4.38 9.76 9.8 0 5.4-4.34 9.9-9.76 9.9Zm5.4-7.36c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.88-.8-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.2-.24-.58-.48-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.5s1.07 2.9 1.22 3.1c.15.2 2.1 3.2 5.08 4.5.7.3 1.26.48 1.7.62.72.23 1.37.2 1.88.12.57-.08 1.76-.72 2-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z" />
    </svg>
  );
}

export default function PalletQuoteModal({ open, onClose, nome, medida }: {
  open: boolean; onClose: () => void; nome: string; medida: string;
}) {
  const [tel, setTel] = useState("");
  const [sent, setSent] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", esc);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", esc); };
  }, [open, onClose]);
  useEffect(() => () => clearTimeout(timer.current), []);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const texto =
      `Olá, Martins Pallets! Vim pelo site e gostaria de um orçamento.\n\n` +
      `*PALLET PEDIDO*\n${nome}${/\d/.test(medida) ? ` (${medida} m)` : ""}\n\n` +
      `*MEUS DADOS*\nNome: ${f.get("nome")}\nEmail: ${f.get("email")}\nTelefone: ${f.get("telefone")}\n\n` +
      `*MENSAGEM*\n${f.get("mensagem")}`;
    // SITE.whatsapp = https://wa.me/5511942947962 (+55 11 94294-7962)
    window.open(`${SITE.whatsapp}?text=${encodeURIComponent(texto)}`, "_blank", "noopener,noreferrer");
    setSent(true);
    timer.current = window.setTimeout(() => { setSent(false); setTel(""); onClose(); }, 1800);
  }

  if (!open) return null;
  return createPortal(
    <div className={s.overlay} onClick={onClose}>
      <div className={s.sheet} role="dialog" aria-modal="true" aria-label={`Orçamento: ${nome}`} onClick={(e) => e.stopPropagation()}>
        <button type="button" className={s.x} onClick={onClose} aria-label="Fechar">×</button>
        {sent ? (
          <div className={s.ok}>
            <WhatsIcon size={44} />
            <h4 className={s.titulo}>Abrindo o WhatsApp…</h4>
            <p>É só tocar em enviar.</p>
          </div>
        ) : (
          <form className={s.form} onSubmit={submit}>
            <span className="eyebrow">Orçamento</span>
            <h4 className={s.titulo}>{nome} {/\d/.test(medida) && <small>{medida} m</small>}</h4>
            <label>Nome *<input name="nome" required autoFocus autoComplete="name" placeholder="Seu nome" /></label>
            <label>Email *<input name="email" type="email" required autoComplete="email" placeholder="voce@email.com" /></label>
            <label>Telefone *<input name="telefone" type="tel" inputMode="tel" required autoComplete="tel" value={tel}
              onChange={(e) => setTel(maskPhone(e.target.value))} placeholder="(11) 9 0000-0000" /></label>
            <label>Mensagem *<textarea name="mensagem" required rows={4} placeholder="Quantidade, endereço de entrega, prazo…" /></label>
            <button className={s.send} type="submit"><WhatsIcon size={22} /> Enviar pelo WhatsApp</button>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
}
