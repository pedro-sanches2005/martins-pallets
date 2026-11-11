export type Tamanho = {
  nome: string;
  medida: string;
  img: string;
  tipo?: "madeira" | "chapa" | "plastico";
};

export const SITE = {
  nome: "Martins Pallets & Transportes",
  desde: 2000,
  endereco: "R. Luiz Bruno Filho, 145 - Jd Emicol, Itu - SP, 13312-823",
  telefones: ["(11) 94294-7962", "(11) 97491-4840"],
  whatsapp: "https://wa.me/5511942947962",
  email: "martins.pallet@gmail.com",
  instagram: "https://www.instagram.com/accounts/login/?next=https%3A%2F%2Fwww.instagram.com%2F_martinspallets%3Fdlrf%3DMWJ5YXF0OGR3bDkybQ%253D%253D&is_from_rle",
  instagramHandle: "@_martinspallets",
  mapa: "https://www.google.com/maps?q=R.+Luiz+Bruno+Filho,+145,+Itu+-+SP&output=embed",
  rota: "https://www.google.com/maps/dir/?api=1&destination=R.+Luiz+Bruno+Filho,+145,+Itu+-+SP",
};

export const SERVICOS = [
  { t: "Pronta-entrega", d: "Retire seus pallets no mesmo dia ou receba o mais rápido possível, conforme nossa disponibilidade." },
  { t: "Reforma de pallets", d: "Entregamos pallets reformados e coletamos os quebrados, reduzindo seus custos e agilizando a logística." },
  { t: "Recolhimento", d: "Limpeza na sua empresa: retiramos pallets sem serventia e descartamos corretamente em empresas de biomassa, transformando a madeira em energia sustentável." },
];

export const TAMANHOS: Tamanho[] = [
  { nome: "Pallet (Descartável)", medida: "1,20 x 1,00", img: "p120-descartavel.png" },
  { nome: "Pallet (PBR)", medida: "1,20 x 1,00", img: "p120-pbr.png" },
  { nome: "Pallet (Capelinha)", medida: "1,20 x 1,00", img: "p120-capelinha.png" },
  { nome: "Pallet (PBR 2)", medida: "1,25 x 1,05", img: "p125-pbr2.png" },
  { nome: "Pallet", medida: "1,10 x 1,10", img: "p110.png" },
  { nome: "Pallet", medida: "1,15 x 1,15", img: "p115.png" },
  { nome: "Pallet", medida: "1,30 x 1,10", img: "p130.png" },
  { nome: "Pallet", medida: "0,95 x 0,95", img: "p095.png" },
  { nome: "Pallet plástico", medida: "1,20 x 1,00", img: "plastico.png", tipo: "plastico" },
  { nome: "Chapatex", medida: "1,00 x 1,20", img: "chapatex.png", tipo: "chapa" },
  { nome: "Banco de pallet", medida: "Móveis", img: "banco.png" },
];

// Coloque aqui as fotos do Instagram (ex.: "ig1.png") dentro de public/pallets/. Vazio = só o cartão do perfil.
export const IG_FOTOS: string[] = [];

export const waLink = (t = "Olá, Martins Pallets! Vim pelo site e gostaria de um orçamento.") =>
  `${SITE.whatsapp}?text=${encodeURIComponent(t)}`;
export const tel = (n: string) => `tel:+55${n.replace(/\D/g, "")}`;

export const FAIXA = ["Pronta-entrega", "Melhor preço da região", "Reforma de pallets", "Recolhimento", "Descarte sustentável", "Itu e região", "Desde 2000"];

export const STEPS = [
  { t: "Escolha os modelos", d: "Veja os tamanhos e toque em “Adicionar ao orçamento” em cada pallet que você precisa. Dá para juntar vários." },
  { t: "Fale com a gente", d: "Seu pedido chega pronto no nosso WhatsApp, com a lista de pallets, as quantidades e o endereço de entrega." },
  { t: "Retire ou receba", d: "Pronta-entrega: retire no mesmo dia ou entregamos o mais rápido possível, conforme nossa disponibilidade." },
];