import site from "@/data/site.json";
import { InstagramIcon, PhoneIcon, WhatsAppIcon } from "@/components/icons";
import { LogoSeal } from "@/components/Logo";
import type { Dict, Locale } from "@/lib/i18n";
import { telLink, waLink } from "@/lib/wa";

export function Footer({ lang, d }: { lang: Locale; d: Dict }) {
  return (
    <footer id="contact" className="on-dark bg-night text-paper">
      <div className="wrap grid gap-12 py-16 md:grid-cols-[auto_1fr_1fr] md:gap-16 md:py-20">
        <div className="flex flex-col items-start gap-5">
          <LogoSeal className="h-32 w-32 text-gold" />
          <p className="max-w-[16rem] text-[0.95rem] text-paper/80">{d.footer.tagline}</p>
        </div>

        <div>
          <h2 className="text-[1.5rem] text-paper">{d.footer.contact}</h2>
          <ul className="mt-5 space-y-3 text-[1rem]">
            <li>
              <a href={telLink} className="num inline-flex min-h-11 items-center gap-3 hover:text-gold" dir="ltr">
                <PhoneIcon />
                {site.phone.display}
              </a>
            </li>
            <li>
              <a href={waLink()} target="_blank" rel="noopener" className="inline-flex min-h-11 items-center gap-3 hover:text-gold">
                <WhatsAppIcon className="h-[18px] w-[18px]" />
                {d.footer.whatsapp} <span className="sr-only">{d.a11y.newTab}</span>
              </a>
            </li>
            <li>
              <a href={site.instagram} target="_blank" rel="noopener" className="inline-flex min-h-11 items-center gap-3 hover:text-gold">
                <InstagramIcon />
                <span dir="ltr">{site.instagramHandle}</span> <span className="sr-only">{d.a11y.newTab}</span>
              </a>
            </li>
          </ul>
        </div>

        <div className="space-y-6 text-[0.95rem]">
          <div>
            <h2 className="text-[1.5rem] text-paper">{d.footer.area}</h2>
            <p className="mt-3 text-paper/80">{d.footer.areaValue}</p>
          </div>
          <p className="text-gold">{d.footer.cacherout}</p>
        </div>
      </div>
      <div className="border-t border-paper/15">
        <div className="wrap flex flex-wrap items-center justify-between gap-3 py-5 text-[0.85rem] text-paper/65">
          <p>
            © {new Date().getFullYear()} {site.fullName}. {d.footer.rights}
          </p>
          <a href={`/${lang}/mentions-legales`} className="inline-flex min-h-11 items-center underline-offset-4 hover:underline">
            {d.footer.legal}
          </a>
        </div>
      </div>
    </footer>
  );
}
