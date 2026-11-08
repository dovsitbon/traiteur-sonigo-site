"use client";

import { useEffect, useState } from "react";

const KEY = "sonigo-intro";

/**
 * Ouverture (1,5 s max, une fois par session) : fond blanc cassé, deux bougies se dessinent au trait,
 * leurs flammes s'allument, « SONIGO » puis « TRAITEUR » apparaissent, fondu sur le hero.
 * Masquée d'office (script dans <head>) si déjà vue ou si l'utilisateur réduit les animations ; tout est en CSS.
 */
export function Intro({ skipLabel }: { skipLabel: string }) {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    if (html.classList.contains("intro-seen")) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- état lu dans le DOM au montage
      setGone(true);
      return;
    }
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {}
    const t = setTimeout(() => {
      html.classList.add("intro-seen");
      setGone(true);
    }, 1500);
    return () => clearTimeout(t);
  }, []);

  if (gone) return null;

  const skip = () => {
    document.documentElement.classList.add("intro-seen");
    setGone(true);
  };

  return (
    <div className="intro">
      <div className="intro-stage" aria-hidden="true">
        <svg viewBox="0 0 48 64" className="intro-svg" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
          <path className="intro-candle" d="M14 62V30h7v32M10 62h11" />
          <path className="intro-candle intro-candle-2" d="M27 62V30h7v32M27 62h11" />
          <path className="intro-candle" d="M17.5 30v-3M30.5 30v-3" />
          <path className="intro-flame" d="M17.5 26.5c-2.6-2.8-2-6.4 0-9.5 2 3.1 2.6 6.7 0 9.5Z" fill="var(--color-gold)" stroke="var(--color-gold-deep)" />
          <path className="intro-flame intro-flame-2" d="M30.5 26.5c-2.6-2.8-2-6.4 0-9.5 2 3.1 2.6 6.7 0 9.5Z" fill="var(--color-gold)" stroke="var(--color-gold-deep)" />
        </svg>
        <p className="intro-word">SONIGO</p>
        <p className="intro-latin">TRAITEUR</p>
      </div>
      <button type="button" onClick={skip} className="intro-skip">
        {skipLabel}
      </button>
    </div>
  );
}
