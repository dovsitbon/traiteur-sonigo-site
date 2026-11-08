"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import carte from "@/data/carte.json";
import formules from "@/data/formules.json";
import { CheckIcon, PlusIcon } from "@/components/icons";
import { Hallah, Pot, SaladBowl, Tart } from "@/components/line";
import { useLocale } from "@/components/providers";
import { useCart } from "@/components/cart";
import { altOf, euro, fill } from "@/lib/i18n";
import { img } from "@/lib/media";

const ART = { salades: SaladBowl, plats: Pot, accompagnements: Hallah, desserts: Tart } as const;
type CatId = keyof typeof ART;
const SIDES = carte.categories.find((c) => c.id === "accompagnements")!.items;

/** La carte du Chabbat : onglets, une ligne par article (nom, portion, prix, Ajouter), puis les formules familles. */
export function Carte() {
  const { d } = useLocale();
  const [tab, setTab] = useState<CatId>("salades");
  const tabsRef = useRef<HTMLDivElement>(null);
  const ids = carte.categories.map((c) => c.id as CatId);

  const onKey = (e: KeyboardEvent) => {
    const i = ids.indexOf(tab);
    const dir = document.documentElement.dir === "rtl" ? -1 : 1;
    const next = e.key === "ArrowRight" ? i + dir : e.key === "ArrowLeft" ? i - dir : e.key === "Home" ? 0 : e.key === "End" ? ids.length - 1 : null;
    if (next === null) return;
    e.preventDefault();
    const id = ids[(next + ids.length) % ids.length];
    setTab(id);
    tabsRef.current?.querySelector<HTMLButtonElement>(`#tab-${id}`)?.focus();
  };

  // Les tuiles de l'accueil pointent vers #carte-salades, #carte-plats… : on ouvre le bon onglet
  useEffect(() => {
    const sync = () => {
      const m = location.hash.match(/^#carte-(\w+)$/);
      if (m && ids.includes(m[1] as CatId)) {
        setTab(m[1] as CatId);
        document.getElementById("carte")?.scrollIntoView();
      }
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- ids est constant
  }, []);

  const cat = carte.categories.find((c) => c.id === tab)!;

  return (
    <div>
      <div ref={tabsRef} role="tablist" aria-label={d.carte.kicker} onKeyDown={onKey} className="no-scrollbar -mx-5 flex gap-1 overflow-x-auto border-b border-line px-5 md:mx-0 md:px-0">
        {ids.map((id) => (
          <button
            key={id}
            id={`tab-${id}`}
            role="tab"
            type="button"
            aria-selected={tab === id}
            aria-controls={`panel-${id}`}
            tabIndex={tab === id ? 0 : -1}
            onClick={() => setTab(id)}
            className={`-mb-px min-h-12 shrink-0 border-b-2 px-4 text-[1rem] transition-colors ${tab === id ? "border-night font-medium text-night" : "border-transparent text-muted hover:text-night"}`}
          >
            {d.carte.tabs[id]}
          </button>
        ))}
      </div>

      <CatPanel key={cat.id} id={cat.id as CatId} />
    </div>
  );
}

function CatPanel({ id }: { id: CatId }) {
  const { lang, d } = useLocale();
  const cat = carte.categories.find((c) => c.id === id)!;
  const Art = ART[id];
  const price = cat.price;
  return (
    <div id={`panel-${id}`} role="tabpanel" aria-labelledby={`tab-${id}`} tabIndex={0} className="fade-in pt-8 focus-visible:outline-offset-8">
      <div className="mb-6 flex items-center gap-4">
        <Art className="h-11 w-11 shrink-0 text-gold-deep" />
        <p className="text-[1rem] text-muted">
          {price !== null && <span className="num me-2 font-[family-name:var(--font-display)] text-[1.5rem] text-night">{euro(price, lang)}</span>}
          {cat.unit[lang]}
          {"_aRemplir" in cat && <span className="ms-1">({d.carte.portionTbc})</span>}
        </p>
      </div>
      {id === "accompagnements" && <p className="mb-6 max-w-xl text-[0.95rem]">{d.carte.includedSide}</p>}
      <ul className="grid gap-x-12 md:grid-cols-2">
        {cat.items.map((item) => (
          <ItemRow key={item.id} catId={id} item={item} price={price} />
        ))}
      </ul>
    </div>
  );
}

function ItemRow({ catId, item, price }: { catId: CatId; item: { id: string; name: Record<string, string>; photo?: string }; price: number | null }) {
  const { lang, d } = useLocale();
  const { add, lines } = useCart();
  const [side, setSide] = useState(SIDES[0].id);
  const [flash, setFlash] = useState(false);
  const orderable = price !== null;
  const inCart = lines.filter((l) => l.kind === "item" && l.id === item.id).reduce((n, l) => n + l.qty, 0);
  const name = item.name[lang as "fr"];

  const onAdd = () => {
    add({ kind: "item", id: item.id, side: catId === "plats" ? side : undefined });
    setFlash(true);
    setTimeout(() => setFlash(false), 1200);
  };

  return (
    <li className="flex items-center gap-4 border-b border-line py-4">
      {item.photo && (
        <Image src={item.photo} alt={altOf(d, item.photo)} width={img(item.photo).width} height={img(item.photo).height} sizes="64px" className="h-16 w-16 shrink-0 rounded-lg object-cover" />
      )}
      <div className="min-w-0 flex-1">
        <p className="text-[1.05rem] text-night">{name}</p>
        {inCart > 0 && <p className="num text-[0.82rem] text-olive">{fill(d.carte.inCart, { n: inCart })}</p>}
        {catId === "plats" && (
          <label className="mt-1.5 flex items-center gap-2 text-[0.85rem] text-muted">
            {d.carte.side}
            <select value={side} onChange={(e) => setSide(e.target.value)} className="min-h-9 rounded-md border border-line bg-white px-2 text-[0.85rem] text-ink">
              {SIDES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name[lang as "fr"]}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>
      {orderable && (
        <button type="button" onClick={onAdd} className={`btn btn-sm shrink-0 ${flash ? "bg-olive text-paper" : "btn-line"}`} aria-label={`${d.carte.add} : ${name}`}>
          {flash ? <CheckIcon /> : <PlusIcon />}
          <span className="hidden sm:inline">{flash ? d.carte.added : d.carte.add}</span>
        </button>
      )}
    </li>
  );
}

/** Formules familles (affiche « Formules familles ») + carte sur mesure. */
export function Formules() {
  const { lang, d } = useLocale();
  const { add, setOpen } = useCart();
  return (
    <ul className="grid gap-5 md:grid-cols-3">
      {formules.items.map((f) => (
        <li key={f.id} className="flex flex-col rounded-2xl border border-line bg-paper p-7">
          <p className="text-[0.95rem] text-muted">{d.carte.formulesTitle}</p>
          <h3 className="mt-1 text-[1.7rem] leading-tight">{fill(d.carte.persons, { n: f.persons })}</h3>
          <p className="num mt-3 font-[family-name:var(--font-display)] text-[2.4rem] leading-none text-night">{euro(f.price, lang)}</p>
          <ul className="mt-5 flex-1 space-y-2 text-[0.98rem]">
            {f.content[lang].map((c) => (
              <li key={c} className="flex gap-3">
                <span aria-hidden="true" className="mt-[0.6em] h-px w-3 shrink-0 bg-gold-deep" />
                {c}
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="btn btn-night mt-7"
            onClick={() => {
              add({ kind: "formule", id: f.id });
              setOpen(true);
            }}
          >
            <PlusIcon />
            {d.carte.add}
          </button>
        </li>
      ))}
      <li className="on-dark flex flex-col rounded-2xl bg-night p-7 text-paper">
        <p className="text-[0.95rem] text-paper/70">{d.carte.formulesTitle}</p>
        <h3 className="mt-1 text-[1.7rem] leading-tight text-paper">{d.carte.custom}</h3>
        <p className="mt-4 flex-1 text-[0.98rem] text-paper/85">{d.carte.customText}</p>
        <a href="#devis" className="btn btn-line mt-7">
          {d.carte.customCta}
        </a>
      </li>
    </ul>
  );
}
