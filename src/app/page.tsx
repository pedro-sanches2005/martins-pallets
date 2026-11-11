import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Reveal from "@/components/Reveal";
import TamanhosGrid from "@/components/TamanhosGrid";
import InstagramShortcut from "@/components/InstagramShortcut";
import Footer from "@/components/Footer";
import OrcamentoDrawer from "@/components/OrcamentoDrawer";
import { FAIXA, SERVICOS, SITE, STEPS, tel, waLink } from "@/data/site";

export default function Home() {
  const faixa = [...FAIXA, ...FAIXA, ...FAIXA, ...FAIXA];
  return (
    <>
      <Navbar />
      <Hero />

      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">{faixa.map((t, i) => <span key={i}><em>{t}</em></span>)}</div>
      </div>

      <section id="sobre">
        <div className="wrap">
          <Reveal>
            <span className="eyebrow">Sobre nós</span>
            <h2>Desde {SITE.desde} na logística das empresas</h2>
            <p style={{ maxWidth: "68ch", color: "var(--muted)" }}>
              A Martins Pallets está desde o ano {SITE.desde} nesse mercado, sempre buscando evolução e agilidade na
              parte logística das empresas. Mantendo a mesma qualidade e o melhor preço da região, fornecemos
              diversos modelos e medidas de pallets de madeira.
            </p>
          </Reveal>
        </div>
      </section>

      <section id="servicos" style={{ background: "var(--bg-2)" }}>
        <div className="wrap">
          <Reveal><span className="eyebrow">O que fazemos</span><h2>Serviços</h2></Reveal>
          <div className="grid g4">
            {SERVICOS.map((s, i) => (
              <Reveal key={s.t} delay={i * 100}>
                <div className="card"><h3>{s.t}</h3><p>{s.d}</p></div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="como">
        <div className="wrap">
          <Reveal><span className="eyebrow">Simples assim</span><h2>Como pedir</h2></Reveal>
          <div className="steps">
            {STEPS.map((s, i) => (
              <Reveal key={s.t} delay={i * 120}>
                <div className="step"><b>{i + 1}</b><h3>{s.t}</h3><p>{s.d}</p></div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="tamanhos" style={{ background: "var(--bg-2)" }}>
        <div className="wrap">
          <Reveal><span className="eyebrow">Pallets de madeira</span><h2>Tamanhos disponíveis</h2></Reveal>
          <TamanhosGrid />
        </div>
      </section>

      <InstagramShortcut />

      <section id="contato">
        <div className="wrap contact">
          <Reveal>
            <span className="eyebrow">Fale com a gente</span>
            <h2>Contato</h2>
            <ul>
              <li><b>Telefones</b>{SITE.telefones.map((n, i) => (
                <span key={n}>{i > 0 && " · "}<a className="lnk" href={tel(n)}>{n}</a></span>
              ))}</li>
              <li><b>E-mail</b><a className="lnk" href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
              <li><b>Endereço</b>{SITE.endereco}</li>
            </ul>
            <a className="btn btn-wood" href={waLink()} target="_blank" rel="noopener noreferrer">Tire sua dúvida no WhatsApp</a>
            <a className="btn btn-ghost" href={SITE.rota} target="_blank" rel="noopener noreferrer">Como chegar</a>
          </Reveal>
          <Reveal delay={150}>
            <iframe src={SITE.mapa} loading="lazy" title="Mapa da Martins Pallets" />
          </Reveal>
        </div>
      </section>

      <Footer />
      <OrcamentoDrawer />
      <a className="wa-fixed" href={waLink()} target="_blank" rel="noopener noreferrer">WhatsApp</a>
    </>
  );
}