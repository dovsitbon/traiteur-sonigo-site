"use client";

import { useEffect, useState } from "react";
import fetes from "@/data/fetes.json";
import { useLocale } from "@/components/providers";
import { euro, fill, intlLocale } from "@/lib/i18n";
import { fmtDay, parisParts } from "@/lib/chabbat";
import { waLink } from "@/lib/wa";

/** Calendrier des fêtes (data/fetes.json) : les fêtes passées disparaissent d'elles-mêmes. */
export function Fetes({ initialToday }: { initialToday: string }) {
  const { lang, d } = useLocale();
  const t = d.fetes;
  const loc = intlLocale[lang];
  const [today, setToday] = useState(initialToday);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- date du jour côté navigateur (la page est statique)
  useEffect(() => setToday(parisParts(new Date()).ymd), []);
  const list = fetes.items.filter((f) => f.end >= today).slice(0, 6);
  const short: Intl.DateTimeFormatOptions = { day: "numeric", month: "long" };

  return (
    <ul className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
      {list.map((f) => {
        const name = f.name[lang];
        const dates = f.start === f.end ? fmtDay(f.start, loc, { ...short, year: "numeric" }) : fill(t.dates, { start: fmtDay(f.start, loc, short), end: fmtDay(f.end, loc, { ...short, year: "numeric" }) });
        const menu = f.menu;
        return (
          <li key={f.id} className="flex flex-col bg-paper p-7">
            <h3 className="text-[1.6rem] leading-tight">{name}</h3>
            <p className="num mt-1 text-[0.92rem] text-muted">{dates}</p>
            <p className="num mt-4 text-[0.95rem] font-medium text-olive-deep">{fill(t.deadline, { date: fmtDay(f.deadline, loc, { weekday: "long", ...short }) })}</p>
            <p className="mt-2 flex-1 text-[0.95rem]">
              {menu ? (
                <>
                  {menu.content[lang]}{" "}
                  {menu.lastYear && <span className="text-muted">{fill(t.lastYear, { prices: menu.formules.map((x) => euro(x.price, lang)).join(" · ") })}</span>}
                </>
              ) : (
                <span className="text-muted">{t.soon}</span>
              )}
            </p>
            <a href={waLink(fill(t.askWa, { name }))} target="_blank" rel="noopener" className="mt-5 inline-flex min-h-11 items-center self-start text-[0.95rem] font-medium text-night underline underline-offset-4">
              {t.ask} <span className="sr-only">{d.a11y.newTab}</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
