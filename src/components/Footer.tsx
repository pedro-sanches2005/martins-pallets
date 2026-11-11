import { SITE, tel, waLink } from "@/data/site";

const NAV = [
  ["#sobre", "Sobre nós"], ["#servicos", "Serviços"], ["#como", "Como pedir"],
  ["#tamanhos", "Tamanhos"], ["#instagram", "Instagram"], ["#contato", "Contato"],
];
const PRODUTOS = ["Pallets de madeira", "Pallet plástico", "Chapatex", "Banco de pallet", "Reforma e recolhimento"];

export default function Footer() {
  return (
    <footer className="ft">
      <div className="wrap">
        <div className="ft-cta">
          <div>
            <span className="eyebrow">Pronta-entrega</span>
            <h2>Precisando de pallets hoje?</h2>
          </div>
          <div className="ft-cta-btns">
            <a className="btn btn-wood" href={waLink()} target="_blank" rel="noopener noreferrer">Chamar no WhatsApp</a>
            <a className="btn btn-ghost" href={tel(SITE.telefones[0])}>Ligar agora</a>
          </div>
        </div>

        <div className="ft-grid">
          <div className="ft-brand">
            <a className="logo" href="#">Martins <b>Pallets</b></a>
            <p>Pallets de madeira, plástico e chapatex em Itu e região. Venda, reforma e recolhimento desde {SITE.desde}.</p>
            <div className="ft-social">
              <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram da Martins Pallets">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r=".6" fill="currentColor" />
                </svg>
              </a>
            </div>
            <span className="ft-rate">★ 5,0 · 10 avaliações no Google</span>
          </div>

          <div>
            <h4>Navegação</h4>
            <ul>{NAV.map(([href, t]) => <li key={href}><a href={href}>{t}</a></li>)}</ul>
          </div>

          <div>
            <h4>Produtos</h4>
            <ul>{PRODUTOS.map((p) => <li key={p}><a href="#tamanhos">{p}</a></li>)}</ul>
          </div>

          <div>
            <h4>Contato</h4>
            <ul>
              {SITE.telefones.map((n) => <li key={n}><a href={tel(n)}>{n}</a></li>)}
              <li><a href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
              <li>{SITE.endereco}</li>
              <li><a className="lnk" href={SITE.rota} target="_blank" rel="noopener noreferrer">Como chegar →</a></li>
            </ul>
          </div>
        </div>

        <div className="ft-bar">
          <span>© {new Date().getFullYear()} {SITE.nome}. Todos os direitos reservados.</span>
          <a className="ft-top" href="#">Voltar ao topo ↑</a>
        </div>
      </div>
      <div className="ft-mark" aria-hidden="true">MARTINS PALLETS</div>
    </footer>
  );
}