/**
 * Petites illustrations au trait (stroke 1.2, extrémités rondes), dessinées pour le site :
 * bougies de Chabbat, hallah tressée, coupe de kiddouch, plats, et pictos des engagements et des événements.
 * Elles prennent la couleur du texte (currentColor).
 */
type P = { className?: string };
const s = { fill: "none", stroke: "currentColor", strokeWidth: 1.2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };

export const Candles = ({ className = "h-10 w-10" }: P) => (
  <svg viewBox="0 0 48 48" className={className} {...s}>
    <path d="M17 44V20h6v24M25 44V20h6v24" />
    <path d="M20 20v-2.5M28 20v-2.5" />
    <path d="M20 17.5c-2-2.2-1.6-5 0-7.5 1.6 2.5 2 5.3 0 7.5ZM28 17.5c-2-2.2-1.6-5 0-7.5 1.6 2.5 2 5.3 0 7.5Z" />
    <path d="M13 44h22" />
  </svg>
);

export const Hallah = ({ className = "h-10 w-10" }: P) => (
  <svg viewBox="0 0 48 48" className={className} {...s}>
    <path d="M6 28c0-4 3-7 7-7 2-3 5-4 8-3 2-2 6-2 8 0 3-1 6 0 8 3 4 0 7 3 7 7s-3 6-7 6H13c-4 0-7-2-7-6Z" />
    <path d="M13 21c2 3 2 9 0 13M21 18c2 4 2 12 0 16M29 18c-2 4-2 12 0 16M37 21c-2 3-2 9 0 13" />
  </svg>
);

export const Kiddush = ({ className = "h-10 w-10" }: P) => (
  <svg viewBox="0 0 48 48" className={className} {...s}>
    <path d="M14 8h20c0 10-4 17-10 17S14 18 14 8Z" />
    <path d="M15 14h18" />
    <path d="M24 25v12M17 41h14M19 37h10" />
  </svg>
);

export const SaladBowl = ({ className = "h-10 w-10" }: P) => (
  <svg viewBox="0 0 48 48" className={className} {...s}>
    <path d="M6 24h36c0 9-8 15-18 15S6 33 6 24Z" />
    <path d="M18 39l-1 3h14l-1-3" />
    <path d="M14 24c0-4 3-7 6-7M22 24c0-6 4-10 8-10M31 24c1-3 3-5 6-5" />
  </svg>
);

export const Pot = ({ className = "h-10 w-10" }: P) => (
  <svg viewBox="0 0 48 48" className={className} {...s}>
    <path d="M10 22h28v12c0 4-3 7-7 7H17c-4 0-7-3-7-7V22Z" />
    <path d="M6 24h4M38 24h4M9 22h30" />
    <path d="M20 18c0-2 2-3 4-3s4 1 4 3" />
    <path d="M18 11c-1-2 1-3 0-5M24 11c-1-2 1-3 0-5M30 11c-1-2 1-3 0-5" />
  </svg>
);

export const Tart = ({ className = "h-10 w-10" }: P) => (
  <svg viewBox="0 0 48 48" className={className} {...s}>
    <ellipse cx="24" cy="26" rx="17" ry="7" />
    <path d="M7 26v4c0 4 8 7 17 7s17-3 17-7v-4" />
    <path d="M13 31v4M19 32.5v4M24 33v4M29 32.5v4M35 31v4" />
    <circle cx="19" cy="25" r="2" />
    <circle cx="27" cy="23.5" r="2" />
    <circle cx="25" cy="28" r="2" />
  </svg>
);

/** Sceau : cacherout */
export const Seal = ({ className = "h-9 w-9" }: P) => (
  <svg viewBox="0 0 48 48" className={className} {...s}>
    <circle cx="24" cy="22" r="13" />
    <circle cx="24" cy="22" r="9" />
    <path d="m20 22 3 3 5-6" />
    <path d="m17 33-3 10 6-3 4 4M31 33l3 10-6-3-4 4" />
  </svg>
);

/** Toque et cuillère : fait maison */
export const Toque = ({ className = "h-9 w-9" }: P) => (
  <svg viewBox="0 0 48 48" className={className} {...s}>
    <path d="M15 30v8h18v-8" />
    <path d="M15 30c-5 0-8-3-8-7s3-7 7-7c1-4 5-7 10-7s9 3 10 7c4 0 7 3 7 7s-3 7-8 7H15Z" />
    <path d="M15 34h18" />
  </svg>
);

/** Sac et maison : retrait ou livraison */
export const Bag = ({ className = "h-9 w-9" }: P) => (
  <svg viewBox="0 0 48 48" className={className} {...s}>
    <path d="M11 17h26l-2 24H13l-2-24Z" />
    <path d="M18 20v-6a6 6 0 0 1 12 0v6" />
    <path d="M20 31h8" />
  </svg>
);

/** Bulle de discussion : WhatsApp */
export const Bubble = ({ className = "h-9 w-9" }: P) => (
  <svg viewBox="0 0 48 48" className={className} {...s}>
    <path d="M8 22c0-8 7-14 16-14s16 6 16 14-7 14-16 14c-2 0-4 0-6-1l-8 4 2-7c-3-3-4-6-4-10Z" />
    <path d="M17 20h14M17 26h9" />
  </svg>
);

/** Berceau : brit mila */
export const Cradle = ({ className = "h-9 w-9" }: P) => (
  <svg viewBox="0 0 48 48" className={className} {...s}>
    <path d="M8 22h32c0 8-7 13-16 13S8 30 8 22Z" />
    <path d="M10 22c0-7 6-12 14-12" />
    <path d="M14 41c3-3 6-5 10-5s7 2 10 5" />
  </svg>
);

/** Rouleau de la Torah : bar-mitsva */
export const Scroll = ({ className = "h-9 w-9" }: P) => (
  <svg viewBox="0 0 48 48" className={className} {...s}>
    <path d="M12 8v32M36 8v32" />
    <path d="M10 8h4M10 40h4M34 8h4M34 40h4" />
    <path d="M12 12c4-1 8-1 12 0s8 1 12 0v24c-4 1-8 1-12 0s-8-1-12 0V12Z" />
    <path d="M18 19h12M18 24h12M18 29h8" />
  </svg>
);

/** Houppa : chabbat hatan */
export const Chuppah = ({ className = "h-9 w-9" }: P) => (
  <svg viewBox="0 0 48 48" className={className} {...s}>
    <path d="M6 14c6 3 12 4 18 4s12-1 18-4" />
    <path d="M9 15.5V42M39 15.5V42" />
    <path d="M6 14l3-4h30l3 4" />
    <path d="M20 30a4 4 0 1 0 8 0 4 4 0 1 0-8 0" />
  </svg>
);

/** Deux anneaux : fiançailles */
export const Rings = ({ className = "h-9 w-9" }: P) => (
  <svg viewBox="0 0 48 48" className={className} {...s}>
    <circle cx="19" cy="28" r="10" />
    <circle cx="30" cy="28" r="10" />
    <path d="m16 14 3-4 3 4-3 3-3-3Z" />
  </svg>
);

/** Grenade : fêtes */
export const Pomegranate = ({ className = "h-9 w-9" }: P) => (
  <svg viewBox="0 0 48 48" className={className} {...s}>
    <path d="M24 13c9 0 15 7 15 15s-6 14-15 14S9 36 9 28s6-15 15-15Z" />
    <path d="m19 13 1-5 4 3 4-3 1 5" />
    <path d="M19 28c2 3 8 3 10 0" />
  </svg>
);

/** Plateau : entreprise */
export const Platter = ({ className = "h-9 w-9" }: P) => (
  <svg viewBox="0 0 48 48" className={className} {...s}>
    <path d="M6 34h36" />
    <path d="M9 34c0-9 7-15 15-15s15 6 15 15" />
    <path d="M24 19v-3M21 16h6" />
    <path d="M10 38h28" />
  </svg>
);

/** Petit filet décoratif (séparateur) */
export const Flourish = ({ className = "h-3 w-24" }: P) => (
  <svg viewBox="0 0 96 12" className={className} {...s} strokeWidth={1}>
    <path d="M2 6h36M58 6h36" />
    <path d="M48 2l4 4-4 4-4-4 4-4Z" />
  </svg>
);
