'use client';

import React from 'react';

const instagramPosts = [
  { 
    id: 1, 
    title: 'Fabricação própria e rigor no controle de qualidade', 
    url: 'https://www.instagram.com/_martinspallets?dlrf=MWJ5YXF0OGR3bDkybQ==' 
  },
  { 
    id: 2, 
    title: 'Pallets tratados e padronizados prontos para uso', 
    url: 'https://www.instagram.com/_martinspallets?dlrf=MWJ5YXF0OGR3bDkybQ==' 
  },
  { 
    id: 3, 
    title: 'Logística eficiente e agilidade nas entregas', 
    url: 'https://www.instagram.com/_martinspallets?dlrf=MWJ5YXF0OGR3bDkybQ==' 
  },
  { 
    id: 4, 
    title: 'Compromisso ecológico e reutilização de madeira', 
    url: 'https://www.instagram.com/_martinspallets?dlrf=MWJ5YXF0OGR3bDkybQ==' 
  },
  { 
    id: 5, 
    title: 'Estruturas personalizadas sob medida para empresas', 
    url: 'https://www.instagram.com/_martinspallets?dlrf=MWJ5YXF0OGR3bDkybQ==' 
  },
  { 
    id: 6, 
    title: 'Bastidores da produção na nossa fábrica', 
    url: 'https://www.instagram.com/_martinspallets?dlrf=MWJ5YXF0OGR3bDkybQ==' 
  },
];

const INSTAGRAM_PROFILE = "https://www.instagram.com/_martinspallets?dlrf=MWJ5YXF0OGR3bDkybQ==";

export default function InstagramShortcut() {
  return (
    <section className="ig">
      <div className="wrap">
        
        {/* Cabeçalho */}
        <div className="ig-head">
          <div>
            <span className="eyebrow">Acompanhe a nossa rotina</span>
            <h2>Veja no Instagram</h2>
          </div>
          <a
            href={INSTAGRAM_PROFILE}
            target="_blank"
            rel="noopener noreferrer"
            className="btn ig-btn"
          >
            @_martinspallets · Seguir no Instagram
          </a>
        </div>

        {/* Grelha de Cards com links individuais reais */}
        <div className="grid g3">
          {instagramPosts.map((post) => (
            <a
              key={post.id}
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="card"
              style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '160px', textDecoration: 'none' }}
            >
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--wood-2)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '8px' }}>
                  Publicação #{post.id} · Martins Pallets
                </span>
                <p style={{ color: 'var(--cream)', fontSize: '0.95rem', fontWeight: 500 }}>
                  {post.title}
                </p>
              </div>

              <div style={{ marginTop: '16px', fontSize: '0.85rem', color: 'var(--wood)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                Ver post no Instagram →
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}