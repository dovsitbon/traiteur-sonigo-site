"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import carte from "@/data/carte.json";
import formules from "@/data/formules.json";
import type { Locale } from "@/lib/locales";

/** Une ligne de commande : un article de la carte (avec accompagnement pour les plats) ou une formule. */
export type Line = { key: string; kind: "item" | "formule"; id: string; side?: string; qty: number };

type Named = { id: string; name: Record<Locale, string> };
const items = new Map<string, Named & { price: number | null; cat: string }>();
for (const c of carte.categories) for (const i of c.items) items.set(i.id, { ...i, price: c.price, cat: c.id });
const sides = carte.categories.find((c) => c.id === "accompagnements")!.items as Named[];

export const sideName = (id: string | undefined, lang: Locale) => sides.find((s) => s.id === id)?.name[lang] ?? "";

/** Libellé et prix unitaire d'une ligne. */
export function describe(line: Line, lang: Locale, personsLabel: (n: number) => string) {
  if (line.kind === "formule") {
    const f = formules.items.find((x) => x.id === line.id)!;
    return { name: personsLabel(f.persons), price: f.price, side: "" };
  }
  const i = items.get(line.id)!;
  return { name: i.name[lang], price: i.price ?? 0, side: sideName(line.side, lang) };
}

type Cart = {
  lines: Line[];
  count: number;
  add: (l: Omit<Line, "key" | "qty">) => void;
  setQty: (key: string, qty: number) => void;
  clear: () => void;
  open: boolean;
  setOpen: (v: boolean) => void;
};

const CartContext = createContext<Cart | null>(null);
const KEY = "sonigo-cart";

export function useCart() {
  const v = useContext(CartContext);
  if (!v) throw new Error("useCart hors de CartProvider");
  return v;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<Line[]>([]);
  const [open, setOpen] = useState(false);

  // Panier gardé dans le navigateur pendant 3 jours (on revient souvent le lendemain pour finaliser)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as { at: number; lines: Line[] };
      const valid = saved.lines.filter((l) => (l.kind === "formule" ? formules.items.some((f) => f.id === l.id) : items.has(l.id)));
      // eslint-disable-next-line react-hooks/set-state-in-effect -- restauration du panier au montage
      if (Date.now() - saved.at < 3 * 86_400_000) setLines(valid);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ at: Date.now(), lines }));
    } catch {}
    document.documentElement.classList.toggle("has-cart", lines.length > 0);
  }, [lines]);

  const add = useCallback((l: Omit<Line, "key" | "qty">) => {
    const key = `${l.kind}:${l.id}:${l.side ?? ""}`;
    setLines((cur) => {
      const found = cur.find((x) => x.key === key);
      if (found) return cur.map((x) => (x.key === key ? { ...x, qty: Math.min(30, x.qty + 1) } : x));
      return [...cur, { ...l, key, qty: 1 }];
    });
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setLines((cur) => (qty <= 0 ? cur.filter((x) => x.key !== key) : cur.map((x) => (x.key === key ? { ...x, qty: Math.min(30, qty) } : x))));
  }, []);

  const clear = useCallback(() => setLines([]), []);
  const count = lines.reduce((n, l) => n + l.qty, 0);

  const value = useMemo(() => ({ lines, count, add, setQty, clear, open, setOpen }), [lines, count, add, setQty, clear, open]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

/** Ouvre la commande (bouton « Commander pour Chabbat » partout sur le site). */
export function OrderButton({ className = "btn btn-night", children }: { className?: string; children: ReactNode }) {
  const { setOpen } = useCart();
  return (
    <button type="button" className={className} onClick={() => setOpen(true)}>
      {children}
    </button>
  );
}
