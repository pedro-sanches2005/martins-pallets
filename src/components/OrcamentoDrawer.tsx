"use client";
import { useEffect, useRef, useState } from "react";
import { SITE } from "@/data/site";
import { limpar, mudarQtd, remover, useOrcamento } from "@/lib/orcamento";

const maskPhone = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 3)} ${d.slice(3, 7)}-${d.slice(7)}`;
};
const qtdValida = (v: string) => Math.min(9999, Math.max(1, parseInt(v, 10) || 1));

export default function OrcamentoDrawer() {
  const itens = useOrcamento();
  const total = itens.reduce((n, i) => n + i.qtd, 0);
  const [aberto, setAberto] = useState(false);
  const [modo, setModo] = useState<"entrega" | "retirada">("entrega");
  const [tel, setTel] = useState("");
  const [enviado, setEnviado] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!aberto) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setAberto(false);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", esc);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", esc); };
  }, [aberto]);
  useEffect(() => () => clearTimeout(timer.current), []);

  function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const linhas = itens
      .map((i) => `• ${i.qtd}x ${i.nome}${/\d/.test(i.medida) ? ` (${i.medida} m)` : ""}`)
      .join("\n");
    const texto =
      `Olá, Martins Pallets! Vim pelo site e gostaria de um orçamento.\n\n` +
      `*PALLETS (${total} un.)*\n${linhas}\n\n` +
      `*${modo === "entrega" ? "ENTREGA" : "RETIRADA"}*\n` +
      `${modo === "entrega" ? `Endereço: ${f.get("endereco")}` : "Vou retirar no local"}\n\n` +
      `*MEUS DADOS*\nNome: ${f.get("nome")}\nTelefone: ${f.get("telefone")}` +
      `${f.get("email") ? `\nEmail: ${f.get("email")}` : ""}` +
      `${f.get("mensagem") ? `\n\n*OBSERVAÇÕES*\n${f.get("mensagem")}` : ""}`;
    window.open(`${SITE.whatsapp}?text=${encodeURIComponent(texto)}`, "_blank", "noopener,noreferrer");
    setEnviado(true);
    timer.current = window.setTimeout(() => { limpar(); setEnviado(false); setTel(""); setAberto(false); }, 1800);
  }

  return (
    <>
      <button type="button" className={`oc-fab${total ? " on" : ""}`} onClick={() => setAberto(true)}
        aria-label={`Abrir meu orçamento: ${total} pallets`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M9 4h6l1 2h3v15H5V6h3z" /><path d="M9 12h6M9 16h4" />
        </svg>
        Meu orçamento <b key={total}>{total}</b>
      </button>

      {aberto && (
        <div className="oc-overlay" onClick={() => setAberto(false)}>
          <aside className="oc-sheet" role="dialog" aria-modal="true" aria-label="Meu orçamento" onClick={(e) => e.stopPropagation()}>
            <div className="oc-head">
              <h3>Meu orçamento <small>{total} {total === 1 ? "pallet" : "pallets"}</small></h3>
              <button type="button" className="oc-x" onClick={() => setAberto(false)} aria-label="Fechar">×</button>
            </div>

            {enviado ? (
              <div className="oc-vazio"><h3>Abrindo o WhatsApp…</h3><p>É só tocar em enviar.</p></div>
            ) : itens.length === 0 ? (
              <div className="oc-vazio">
                <h3>Nenhum pallet ainda</h3>
                <p>Escolha os modelos e toque em “Adicionar ao orçamento”.</p>
                <a className="btn btn-wood" href="#tamanhos" onClick={() => setAberto(false)}>Ver tamanhos</a>
              </div>
            ) : (
              <form className="oc-form" onSubmit={enviar}>
                <div className="oc-body">
                  <ul className="oc-list">
                    {itens.map((i) => (
                      <li key={i.id} className="oc-item">
                        <div><strong>{i.nome}</strong><small>{/\d/.test(i.medida) ? `${i.medida} m` : i.medida}</small></div>
                        <button type="button" className="oc-rm" onClick={() => remover(i.id)} aria-label={`Remover ${i.nome}`}>×</button>
                        <div className="oc-qty">
                          <button type="button" onClick={() => mudarQtd(i.id, i.qtd - 1)} aria-label="Diminuir">−</button>
                          <input type="number" min={1} max={9999} inputMode="numeric" value={i.qtd}
                            onChange={(e) => mudarQtd(i.id, qtdValida(e.target.value))} aria-label={`Quantidade de ${i.nome}`} />
                          <button type="button" onClick={() => mudarQtd(i.id, Math.min(9999, i.qtd + 1))} aria-label="Aumentar">+</button>
                          <button type="button" className="mais10" onClick={() => mudarQtd(i.id, Math.min(9999, i.qtd + 10))}>+10</button>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="oc-seg" role="group" aria-label="Entrega ou retirada">
                    <button type="button" aria-pressed={modo === "entrega"} onClick={() => setModo("entrega")}>Quero entrega</button>
                    <button type="button" aria-pressed={modo === "retirada"} onClick={() => setModo("retirada")}>Vou retirar</button>
                  </div>

                  <label>Nome *<input name="nome" required autoComplete="name" placeholder="Seu nome" /></label>
                  <label>Telefone *<input name="telefone" type="tel" inputMode="tel" required autoComplete="tel" value={tel}
                    onChange={(e) => setTel(maskPhone(e.target.value))} placeholder="(11) 9 0000-0000" /></label>
                  {modo === "entrega" && (
                    <label>Endereço de entrega *<input name="endereco" required autoComplete="street-address" placeholder="Rua, número, bairro, cidade" /></label>
                  )}
                  <label>Email (opcional)<input name="email" type="email" autoComplete="email" placeholder="voce@email.com" /></label>
                  <label>Observações (opcional)<textarea name="mensagem" rows={3} placeholder="Prazo, tipo de uso, dúvidas…" /></label>
                </div>
                <div className="oc-foot">
                  <button type="submit" className="oc-send">Enviar {total} {total === 1 ? "pallet" : "pallets"} pelo WhatsApp</button>
                  <button type="button" className="oc-limpar" onClick={() => limpar()}>Esvaziar orçamento</button>
                </div>
              </form>
            )}
          </aside>
        </div>
      )}
    </>
  );
}