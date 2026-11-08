import site from "@/data/site.json";

/** Lien WhatsApp vers Yonathan avec message pré-rempli. */
export const waLink = (text?: string) => `https://wa.me/${site.phone.wa}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
export const telLink = `tel:${site.phone.intl.replace(/\s/g, "")}`;

/** Bloc de message : titre en gras puis une ligne « • clé : valeur » par champ rempli. */
export function recap(title: string, rows: [string, string | number | undefined | null][]) {
  const lines = rows.filter(([, v]) => v !== undefined && v !== null && String(v).trim() !== "").map(([k, v]) => `• ${k} : ${v}`);
  return [...(title ? [`*${title}*`] : []), ...lines].join("\n");
}
