import fr from "@/locales/fr.json";
import en from "@/locales/en.json";
import he from "@/locales/he.json";
import type { Locale } from "@/lib/locales";

export { defaultLocale, dirOf, intlLocale, isLocale, locales, ogLocale, type Locale } from "@/lib/locales";
export type Dict = typeof fr;

const dictionaries: Record<Locale, Dict> = { fr, en, he };

export const getDict = (lang: Locale): Dict => dictionaries[lang];

export function fill(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
}

/** Prix en euros à la française / anglaise / hébraïque. */
export function euro(n: number, lang: Locale) {
  const locale = { fr: "fr-FR", en: "en-GB", he: "he-IL" }[lang];
  return new Intl.NumberFormat(locale, { style: "currency", currency: "EUR", minimumFractionDigits: n % 1 ? 2 : 0 }).format(n);
}

/** Texte alternatif d'une image de public/media, d'après son nom de fichier. */
export function altOf(d: Dict, src: string) {
  const key = src.split("/").pop()!.replace(/\.\w+$/, "") as keyof Dict["alt"];
  return d.alt[key] ?? "";
}
