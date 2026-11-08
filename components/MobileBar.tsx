"use client";

import { PhoneIcon, WhatsAppIcon } from "@/components/icons";
import { Candles } from "@/components/line";
import { useLocale } from "@/components/providers";
import { useCart } from "@/components/cart";
import { telLink, waLink } from "@/lib/wa";

/** Barre fixée en bas de l'écran sur mobile : « Commander pour Chabbat » toujours à portée de pouce. */
export function MobileBar() {
  const { d } = useLocale();
  const { setOpen } = useCart();
  const item = "flex flex-col items-center justify-center gap-1 text-[0.75rem] font-medium";
  return (
    <nav aria-label={d.nav.contact} className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/97 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
      <div className="grid h-[4.25rem] grid-cols-[1fr_2fr_1fr] items-stretch">
        <a href={telLink} className={`${item} text-night`}>
          <PhoneIcon className="h-5 w-5" />
          {d.mobileBar.call}
        </a>
        <button type="button" onClick={() => setOpen(true)} className={`${item} bg-night text-[0.88rem] text-paper`}>
          <Candles className="h-6 w-6 text-gold" />
          {d.mobileBar.order}
        </button>
        <a href={waLink()} target="_blank" rel="noopener" className={`${item} text-night`}>
          <WhatsAppIcon className="h-5 w-5" />
          WhatsApp
        </a>
      </div>
    </nav>
  );
}
