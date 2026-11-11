import { useSyncExternalStore } from "react";

export type Item = { id: string; nome: string; medida: string; qtd: number };

const KEY = "martins-orcamento";
const EMPTY: Item[] = [];
let itens: Item[] = EMPTY;
let carregado = false;
const ouvintes = new Set<() => void>();

function carregar() {
  if (carregado || typeof window === "undefined") return;
  carregado = true;
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || "[]");
    itens = Array.isArray(v) ? v : EMPTY;
  } catch { itens = EMPTY; }
}
function salvar(novo: Item[]) {
  itens = novo;
  try { localStorage.setItem(KEY, JSON.stringify(itens)); } catch { /* sem storage */ }
  ouvintes.forEach((f) => f());
}

export function useOrcamento() {
  return useSyncExternalStore(
    (cb) => { ouvintes.add(cb); return () => { ouvintes.delete(cb); }; },
    () => { carregar(); return itens; },
    () => EMPTY
  );
}

export function adicionar(p: Omit<Item, "qtd">, qtd = 1) {
  carregar();
  const existe = itens.some((x) => x.id === p.id);
  salvar(existe ? itens.map((x) => (x.id === p.id ? { ...x, qtd: x.qtd + qtd } : x)) : [...itens, { ...p, qtd }]);
}
export function mudarQtd(id: string, qtd: number) {
  carregar();
  salvar(qtd <= 0 ? itens.filter((x) => x.id !== id) : itens.map((x) => (x.id === id ? { ...x, qtd } : x)));
}
export const remover = (id: string) => mudarQtd(id, 0);
export function limpar() { carregar(); salvar(EMPTY); }