/**
 * Logo redessiné d'après celui de ses affiches (toque, couverts croisés, « TRAITEUR SONIGO », « CACHER »).
 * - compact : version de l'en-tête, pastille + mot « SONIGO » / « TRAITEUR ».
 * - seal : version ronde complète avec « BETH DIN DE MARSEILLE » en arc (pied de page, ouverture).
 * Pour le remplacer par le fichier officiel : changer ce composant et app/icon.svg.
 */
export function LogoMark({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="24" cy="24" r="22.5" strokeWidth="1" />
      <circle cx="24" cy="24" r="19.5" strokeWidth="0.6" opacity="0.6" />
      {/* Toque */}
      <path d="M18 23v4.5h12V23" strokeWidth="1.2" />
      <path d="M18 23c-2.6 0-4.2-1.6-4.2-3.7s1.7-3.7 3.8-3.7c.6-2.3 2.9-4 6.4-4s5.8 1.7 6.4 4c2.1 0 3.8 1.6 3.8 3.7S32.6 23 30 23H18Z" strokeWidth="1.2" />
      {/* Couverts croisés */}
      <path d="M16.5 37.5 31.5 29M31.5 37.5 16.5 29" strokeWidth="1.1" />
      <path d="M30.6 28.2l2.2-1.2M15.4 28.2l-2.2-1.2" strokeWidth="1.1" />
    </svg>
  );
}

export function Logo({ compact = false, className = "" }: { compact?: boolean; className?: string }) {
  if (compact) {
    return (
      <span className={`flex items-center gap-2.5 ${className}`} dir="ltr">
        <LogoMark className="h-10 w-10 text-gold-deep" />
        <span className="flex flex-col leading-none">
          <span className="font-[family-name:var(--font-fraunces)] text-[1.35rem] tracking-[0.14em] text-night">SONIGO</span>
          <span className="mt-1 font-[family-name:var(--font-jost)] text-[0.6rem] tracking-[0.42em] text-muted">TRAITEUR</span>
        </span>
      </span>
    );
  }
  return <LogoSeal className={className} />;
}

/** Version ronde complète. */
export function LogoSeal({ className = "h-36 w-36" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} fill="none" aria-hidden="true">
      <defs>
        <path id="seal-arc" d="M40 112a60 60 0 0 0 120 0" />
      </defs>
      <circle cx="100" cy="100" r="96" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="100" cy="100" r="88" stroke="currentColor" strokeWidth="0.6" opacity="0.6" />
      <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" transform="translate(76 20) scale(1)">
        <path d="M12 24v8h24v-8" />
        <path d="M12 24c-5 0-8-3-8-7s3-7 7-7c1-4 6-8 13-8s12 4 13 8c4 0 7 3 7 7s-3 7-8 7H12Z" />
        <path d="M10 44l28-12M38 44 10 32" />
      </g>
      <text x="100" y="84" textAnchor="middle" fontFamily="var(--font-jost), sans-serif" fontSize="9.5" letterSpacing="4.5" fill="currentColor">
        TRAITEUR
      </text>
      <text x="100" y="110" textAnchor="middle" fontFamily="var(--font-fraunces), Georgia, serif" fontSize="25" letterSpacing="3" fill="currentColor">
        SONIGO
      </text>
      <text x="100" y="126" textAnchor="middle" fontFamily="var(--font-jost), sans-serif" fontSize="8" letterSpacing="3.5" fill="currentColor" opacity="0.8">
        CACHER
      </text>
      <text fontFamily="var(--font-jost), sans-serif" fontSize="7.4" letterSpacing="2.6" fill="currentColor" opacity="0.85">
        <textPath href="#seal-arc" startOffset="50%" textAnchor="middle">
          BETH DIN DE MARSEILLE
        </textPath>
      </text>
    </svg>
  );
}
