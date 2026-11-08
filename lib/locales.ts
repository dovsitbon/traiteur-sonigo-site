// Langues du site, sans les textes : importable côté client sans embarquer les dictionnaires.
export const locales = ["fr", "en", "he"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fr";

export const isLocale = (v: string): v is Locale => (locales as readonly string[]).includes(v);
export const dirOf = (lang: Locale) => (lang === "he" ? "rtl" : "ltr");

export const ogLocale: Record<Locale, string> = { fr: "fr_FR", en: "en_GB", he: "he_IL" };
export const intlLocale: Record<Locale, string> = { fr: "fr-FR", en: "en-GB", he: "he-IL" };
