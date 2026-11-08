"use client";

import { useEffect, useRef, useState } from "react";
import site from "@/data/site.json";
import { CloseIcon, InstagramIcon, MenuIcon, PhoneIcon } from "@/components/icons";
import { LangSwitch } from "@/components/LangSwitch";
import { Logo } from "@/components/Logo";
import { useLocale } from "@/components/providers";
import { OrderButton } from "@/components/cart";
import { telLink } from "@/lib/wa";

export function Header() {
  const { lang, d } = useLocale();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [panelTop, setPanelTop] = useState(0);
  const headerRef = useRef<HTMLElement>(null);
  const home = `/${lang}`;

  const links = [
    { href: `${home}#chabbat`, label: d.nav.chabbat },
    { href: `${home}#carte`, label: d.nav.carte },
    { href: `${home}#evenements`, label: d.nav.events },
    { href: `${home}#cacherout`, label: d.nav.cacherout },
    { href: `${home}#contact`, label: d.nav.contact },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
     
    setPanelTop(headerRef.current?.getBoundingClientRect().bottom ?? 0);
  }, [open]);

  return (
    <header ref={headerRef} className={`sticky top-0 z-50 transition-[background-color,box-shadow] duration-300 ${open ? "bg-paper shadow-[0_1px_0_var(--color-line)]" : scrolled ? "bg-paper/95 shadow-[0_1px_0_var(--color-line)] backdrop-blur" : "bg-paper"}`}>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:start-3 focus:top-3 focus:z-[60] focus:rounded focus:bg-paper focus:px-3 focus:py-2">
        {d.a11y.skip}
      </a>
      <div className="wrap flex h-[4.5rem] items-center gap-4">
        <a href={home} className="shrink-0" aria-label={site.fullName}>
          <Logo compact />
        </a>

        <nav aria-label={d.nav.carte} className="hidden flex-1 justify-center lg:flex">
          <ul className="flex items-center gap-6 whitespace-nowrap text-[0.95rem] text-night">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="inline-flex min-h-11 items-center underline-offset-[6px] hover:underline">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ms-auto flex items-center gap-1.5 lg:ms-0">
          <LangSwitch lang={lang} label={d.a11y.lang} className="hidden text-night xl:flex" />
          <a href={site.instagram} target="_blank" rel="noopener" className="hidden h-11 w-11 items-center justify-center text-night xl:flex" aria-label={`${d.nav.instagram} ${d.a11y.newTab}`}>
            <InstagramIcon />
          </a>
          <a href={telLink} className="num hidden items-center gap-2 whitespace-nowrap px-2 text-[0.92rem] text-night md:flex lg:hidden xl:flex" dir="ltr">
            <PhoneIcon className="h-4 w-4" />
            {site.phone.display}
          </a>
          <OrderButton className="btn btn-night btn-sm hidden md:inline-flex">{d.nav.order}</OrderButton>
          <a href={telLink} className="flex h-11 w-11 items-center justify-center text-night md:hidden" aria-label={`${d.nav.call} ${site.phone.display}`}>
            <PhoneIcon />
          </a>
          <button type="button" className="flex h-11 w-11 items-center justify-center text-night lg:hidden" aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? d.a11y.closeMenu : d.a11y.openMenu} onClick={() => setOpen((v) => !v)}>
            {open ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-nav" style={{ top: panelTop }} className="fade-in fixed inset-x-0 bottom-0 overflow-y-auto overscroll-contain bg-paper lg:hidden">
          <nav aria-label={d.nav.carte} className="wrap flex flex-col gap-8 py-8">
            <ul className="flex flex-col">
              {links.map((l) => (
                <li key={l.href} className="border-b border-line">
                  <a href={l.href} onClick={() => setOpen(false)} className="flex min-h-14 items-center font-[family-name:var(--font-display)] text-[1.7rem] text-night">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between text-night">
              <LangSwitch lang={lang} label={d.a11y.lang} />
              <a href={site.instagram} target="_blank" rel="noopener" className="flex h-11 items-center gap-2" aria-label={`${d.nav.instagram} ${d.a11y.newTab}`}>
                <InstagramIcon />
                <span dir="ltr">{site.instagramHandle}</span>
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
