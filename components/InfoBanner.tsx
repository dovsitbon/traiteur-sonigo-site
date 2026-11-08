"use client";

import { useEffect, useState } from "react";
import annonces from "@/data/annonces.json";
import { CloseIcon } from "@/components/icons";
import { useLocale } from "@/components/providers";
import { useShabbat } from "@/components/useShabbat";
import { fill, intlLocale } from "@/lib/i18n";
import { fmtDay, fmtTime, fmtWhen, parisParts } from "@/lib/chabbat";

const KEY = "sonigo-banner";

/** Bandeau d'infos qu'on peut fermer : heure limite du Chabbat, bougies, annonce active (data/annonces.json). */
export function InfoBanner() {
  const { lang, d } = useLocale();
  const s = useShabbat();
  const [note, setNote] = useState<string | null>(null);
  const loc = intlLocale[lang];

  useEffect(() => {
    const today = parisParts(new Date()).ymd;
    const a = annonces.items.find((x) => x.active && x.from <= today && today <= x.to);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- annonce du jour, connue seulement côté navigateur
    setNote(a ? a.text[lang] : null);
  }, [lang]);

  const close = () => {
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {}
    document.documentElement.classList.add("banner-closed");
  };

  let main = " ";
  let candles = "";
  if (s) {
    if (s.pause) main = fill(d.banner.paused, { until: fmtWhen(s.pause.until, loc) });
    else {
      main = fill(d.banner.deadline, {
        friday: fmtDay(s.target.friday, loc, { day: "numeric", month: "long" }),
        deadline: fmtWhen(s.target.deadline, loc).replace(/:00$/, lang === "fr" ? " h" : ":00"),
      });
      candles = fill(d.banner.candles, { time: fmtTime(s.target.candles, loc) });
    }
  }

  return (
    <aside aria-label={d.banner.label} className="info-banner relative z-40 bg-night text-paper">
      <div className="wrap flex min-h-11 items-center py-2 pe-12 text-[0.88rem] md:justify-center">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
          <span className="num">{main}</span>
          {candles && (
            <>
              <span aria-hidden="true" className="text-gold">
                ·
              </span>
              <span className="num text-paper/85">{candles}</span>
            </>
          )}
          {note && (
            <span className="hidden items-center gap-x-3 sm:inline-flex">
              <span aria-hidden="true" className="text-gold">
                ·
              </span>
              <span className="text-paper/85">{note}</span>
            </span>
          )}
        </p>
        <button type="button" onClick={close} className="absolute end-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center opacity-80 hover:opacity-100" aria-label={d.banner.close}>
          <CloseIcon className="h-4 w-4" />
        </button>
      </div>
    </aside>
  );
}
