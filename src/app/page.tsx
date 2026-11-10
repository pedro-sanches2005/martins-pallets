import Hero from "@/components/Hero";
import Reveal from "@/components/Reveal";
import InstagramShortcut from "@/components/InstagramShortcut";
import { SERVICOS, SITE, TAMANHOS } from "@/data/site";

export default function Home() {
  return (
    <>
      <div className="nav">
        <div className="wrap">
          <a className="logo" href="#">Martins <b>Pallets</b></a>
          <nav>
            <a href="#sobre">Sobre</a><a href="#servicos">Serviços</a>
            <a href="#tamanhos">Tamanhos</a><a href="#instagram">Instagram</a><a href="#contato">Contato</a>
          </nav>
        </div>
      </div>

      <Hero />

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

      <section id="tamanhos">
        <div className="wrap">
          <Reveal><span className="eyebrow">Pallets de madeira</span><h2>Tamanhos disponíveis</h2></Reveal>
          <div className="grid g3">
            {TAMANHOS.map((t, i) => (
              <Reveal key={t.nome + t.medida} delay={(i % 3) * 100}>
                <div className="card size">
                  <img src={`/pallets/${t.img}`} alt={`${t.nome} ${t.medida}`} loading="lazy" />
                  <div><h3>{t.nome}</h3><span>Medida: {t.medida}</span></div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <InstagramShortcut />

      <section id="contato">
        <div className="wrap contact">
          <Reveal>
            <span className="eyebrow">Fale com a gente</span>
            <h2>Contato</h2>
            <ul>
              <li><b>Telefones</b>{SITE.telefones.join(" · ")}</li>
              <li><b>E-mail</b>{SITE.email}</li>
              <li><b>Endereço</b>{SITE.endereco}</li>
            </ul>
            <a className="btn btn-wood" href={SITE.whatsapp} target="_blank" rel="noopener">Tire sua dúvida no WhatsApp</a>
          </Reveal>
          <Reveal delay={150}>
            <iframe src={SITE.mapa} loading="lazy" title="Mapa da Martins Pallets" />
          </Reveal>
        </div>
      </section>

      <footer>© {new Date().getFullYear()} {SITE.nome}</footer>
      <a className="wa-fixed" href={SITE.whatsapp} target="_blank" rel="noopener">WhatsApp</a>
    </>
  );
}