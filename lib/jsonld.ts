import site from "@/data/site.json";
import carte from "@/data/carte.json";
import formules from "@/data/formules.json";
import { getDict, type Locale } from "@/lib/i18n";

/** Données structurées : traiteur (FoodEstablishment) à Marseille, carte avec prix, deux services et FAQ. */
export function homeJsonLd(lang: Locale) {
  const d = getDict(lang);
  const id = `${site.url}/#traiteur`;
  const area = [{ "@type": "City", name: "Marseille" }, { "@type": "AdministrativeArea", name: "Bouches-du-Rhône" }];
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["FoodEstablishment", "LocalBusiness"],
        "@id": id,
        name: site.fullName,
        alternateName: ["Traiteur Sonigo", "Traiteur Yonathan", "Traiteur Jonas Sonigo"],
        description: d.meta.description,
        url: `${site.url}/${lang}`,
        image: [`${site.url}/og.jpg`, `${site.url}/media/evenements/buffet-salle.jpg`],
        logo: `${site.url}/icon.svg`,
        telephone: site.phone.intl.replace(/\s/g, ""),
        servesCuisine: ["Kosher", "Jewish", "Moroccan", "French"],
        priceRange: "€€",
        address: { "@type": "PostalAddress", addressLocality: "Marseille", addressRegion: site.region, addressCountry: "FR" },
        areaServed: area,
        sameAs: [site.instagram],
        knowsAbout: ["Kosher catering", "Shabbat meals", "Brit milah", "Bar mitzvah", "Shabbat chatan"],
        amenityFeature: [{ "@type": "LocationFeatureSpecification", name: "Kosher Mehadrin (Beth Din de Marseille)", value: true }],
        hasMenu: {
          "@type": "Menu",
          name: d.carte.kicker,
          url: `${site.url}/${lang}#carte`,
          hasMenuSection: carte.categories.map((c) => ({
            "@type": "MenuSection",
            name: d.carte.tabs[c.id as keyof typeof d.carte.tabs],
            hasMenuItem: c.items.map((i) => ({
              "@type": "MenuItem",
              name: i.name[lang],
              ...(c.price !== null && { offers: { "@type": "Offer", price: c.price, priceCurrency: "EUR" } }),
            })),
          })),
        },
      },
      {
        "@type": "Service",
        name: d.order.title,
        serviceType: "Kosher Shabbat meals to order",
        provider: { "@id": id },
        areaServed: area,
        offers: formules.items.map((f) => ({ "@type": "Offer", name: `${d.carte.formulesTitle} – ${f.persons}`, price: f.price, priceCurrency: "EUR" })),
      },
      {
        "@type": "Service",
        name: d.events.title,
        serviceType: "Kosher event catering",
        provider: { "@id": id },
        areaServed: area,
      },
      {
        "@type": "FAQPage",
        mainEntity: d.faq.items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
    ],
  };
}
