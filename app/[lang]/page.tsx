import Image from "next/image";
import { notFound } from "next/navigation";
import site from "@/data/site.json";
import realisations from "@/data/realisations.json";
import avis from "@/data/avis.json";
import { getDict, isLocale, altOf, fill, type Dict } from "@/lib/i18n";
import { img } from "@/lib/media";
import { homeJsonLd } from "@/lib/jsonld";
import { parisParts } from "@/lib/chabbat";
import { waLink } from "@/lib/wa";
import { OrderButton } from "@/components/cart";
import { Carte, Formules } from "@/components/Carte";
import { QuoteForm } from "@/components/QuoteForm";
import { Fetes } from "@/components/Fetes";
import { Reveal } from "@/components/Reveal";
import { LogoSeal } from "@/components/Logo";
import { ArrowIcon, WhatsAppIcon } from "@/components/icons";
import { Bag, Bubble, Candles, Chuppah, Cradle, Kiddush, Platter, Pomegranate, Pot, Rings, SaladBowl, Scroll, Seal, Tart, Toque } from "@/components/line";

// Régénérée chaque jour : le calendrier des fêtes et les annonces restent à jour sans redéploiement
export const revalidate = 86400;

const HERO = img("/media/evenements/buffet-salle.jpg");
const BEET = img("/media/salades/carpaccio-betterave.jpg");
const PLATEAUX = img("/media/galerie/buffet-plateaux.jpg");

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const d = getDict(lang);

  return (
    <main id="main">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd(lang)) }} />

      {/* ===== Hero ===== */}
      <section className="wrap grid items-center gap-10 pb-16 pt-8 md:grid-cols-[1.1fr_0.9fr] md:gap-16 md:pb-24 md:pt-14">
        <div>
          <p className="kicker kicker-caps">{d.hero.kicker}</p>
          <h1 className="h-display mt-6">{d.hero.title}</h1>
          <p className="mt-6 max-w-[34rem] text-[1.12rem] leading-relaxed text-ink/90">{d.hero.lead}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <OrderButton className="btn btn-night">{d.hero.order}</OrderButton>
            <a href="#devis" className="btn btn-line">
              {d.hero.quote}
            </a>
          </div>
          <a href="#cacherout" className="mt-9 flex max-w-max items-center gap-4 rounded-xl border border-line px-4 py-3 transition-colors hover:border-gold">
            <Seal className="h-10 w-10 shrink-0 text-gold-deep" />
            <span>
              <span className="block font-medium text-night">{d.hero.badge}</span>
              <span className="block text-[0.88rem] text-muted">{d.hero.badgeNote}</span>
            </span>
          </a>
        </div>
        <figure className="relative mx-auto w-full max-w-[26rem] md:max-w-none">
          <Image src={HERO.src} alt={altOf(d, HERO.src)} width={HERO.width} height={HERO.height} priority sizes="(min-width: 768px) 40vw, 90vw" className="aspect-[4/5] w-full rounded-[1.25rem] object-cover" />
          <figcaption className="mt-3 flex items-center gap-2 text-[0.85rem] text-muted">
            <span aria-hidden="true" className="h-px w-6 bg-gold-deep" />
            {d.hero.photoCaption}
          </figcaption>
        </figure>
      </section>

      {/* ===== Tuiles de catégories ===== */}
      <nav aria-label={d.tiles.label} className="wrap">
        <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-5">
          {(
            [
              ["chabbat", "#chabbat", Candles],
              ["salades", "#carte-salades", SaladBowl],
              ["plats", "#carte-plats", Pot],
              ["desserts", "#carte-desserts", Tart],
              ["events", "#evenements", Kiddush],
            ] as const
          ).map(([k, href, Art], i) => (
            <li key={k} className={`bg-paper ${i === 0 ? "col-span-2 md:col-span-1" : ""}`}>
              <a href={href} className="group flex h-full flex-col gap-3 p-6 transition-colors hover:bg-cream">
                <Art className="h-10 w-10 text-gold-deep" />
                <span className="font-[family-name:var(--font-display)] text-[1.45rem] leading-tight text-night">{d.tiles[k].title}</span>
                <span className="num text-[0.9rem] text-muted">{d.tiles[k].text}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* ===== Engagements (4 pictos) ===== */}
      <section aria-label={d.services.label} className="wrap py-16 md:py-20">
        <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {d.services.items.map((s, i) => {
            const Art = [Seal, Toque, Bag, Bubble][i];
            return (
              <li key={s.title} className="flex gap-4">
                <Art className="h-9 w-9 shrink-0 text-olive" />
                <div>
                  <h2 className="font-[family-name:var(--font-body)] text-[1rem] font-medium text-night">{s.title}</h2>
                  <p className="mt-1 text-[0.92rem] text-muted">{s.text}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* ===== Chabbat : formules familles ===== */}
      <section id="chabbat" className="bg-cream py-20 md:py-28">
        <div className="wrap">
          <Reveal className="max-w-2xl">
            <p className="kicker">{d.carte.kicker}</p>
            <h2 className="h-section mt-5">{d.carte.formulesTitle}</h2>
            <p className="mt-5 text-[1.05rem]">{d.carte.formulesLead}</p>
          </Reveal>
          <div className="mt-12">
            <Formules />
          </div>
          <p className="mt-6 text-[0.9rem] text-muted">{d.carte.lamb}</p>
        </div>
      </section>

      {/* ===== La carte ===== */}
      <section id="carte" className="wrap py-20 md:py-28">
        <div className="max-w-2xl">
          <h2 className="h-section">{d.carte.title}</h2>
          <p className="mt-5 text-[1.05rem]">{d.carte.lead}</p>
        </div>
        <div className="mt-10">
          <Carte />
        </div>
      </section>

      {/* ===== Blocs alternés ===== */}
      <div className="wrap space-y-24 pb-24 md:space-y-32 md:pb-32">
        <Alt
          kicker={d.blocks.home.kicker}
          title={d.blocks.home.title}
          text={d.blocks.home.text}
          cta={{ href: "#carte", label: d.blocks.home.cta }}
          media={<Image src={BEET.src} alt={altOf(d, BEET.src)} width={BEET.width} height={BEET.height} sizes="(min-width: 768px) 45vw, 90vw" className="aspect-[4/5] w-full rounded-[1.25rem] object-cover" />}
        />
        <Alt
          id="cacherout"
          flip
          kicker={d.blocks.cacherout.kicker}
          title={d.blocks.cacherout.title}
          text={d.blocks.cacherout.text}
          cta={{ href: waLink(d.blocks.cacherout.askWa), label: d.blocks.cacherout.ask, external: true }}
          media={<Certificate d={d} />}
        />
        <Alt
          kicker={d.blocks.events.kicker}
          title={d.blocks.events.title}
          text={d.blocks.events.text}
          cta={{ href: "#devis", label: d.blocks.events.cta }}
          media={<Image src={PLATEAUX.src} alt={altOf(d, PLATEAUX.src)} width={PLATEAUX.width} height={PLATEAUX.height} sizes="(min-width: 768px) 45vw, 90vw" className="aspect-[4/3] w-full rounded-[1.25rem] object-cover" />}
        />
      </div>

      {/* ===== Événements ===== */}
      <section id="evenements" className="on-dark bg-night py-20 text-paper md:py-28">
        <div className="wrap">
          <Reveal className="max-w-2xl">
            <p className="kicker">{d.events.kicker}</p>
            <h2 className="h-section mt-5 text-paper">{d.events.title}</h2>
            <p className="mt-5 text-[1.05rem] text-paper/85">{d.events.lead}</p>
          </Reveal>
          <ul className="mt-12 grid gap-px overflow-hidden rounded-2xl bg-paper/15 sm:grid-cols-2 lg:grid-cols-3">
            {(
              [
                ["brit-mila", Cradle],
                ["bar-mitsva", Scroll],
                ["chabbat-hatan", Chuppah],
                ["fiancailles", Rings],
                ["fetes", Pomegranate],
                ["entreprise", Platter],
              ] as const
            ).map(([k, Art]) => (
              <li key={k} className="flex gap-5 bg-night p-7">
                <Art className="h-10 w-10 shrink-0 text-gold" />
                <div>
                  <h3 className="text-[1.4rem] leading-tight text-paper">{d.events.types[k].title}</h3>
                  <p className="mt-1.5 text-[0.95rem] text-paper/75">{d.events.types[k].text}</p>
                </div>
              </li>
            ))}
          </ul>

          <h3 className="mt-20 text-[1.8rem] text-paper">{d.events.realisations}</h3>
          <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {realisations.items.map((r) => {
              const p = img(r.photo);
              return (
                <li key={r.id}>
                  <figure>
                    <Image src={p.src} alt={altOf(d, p.src)} width={p.width} height={p.height} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw" className="aspect-[4/3] w-full rounded-xl object-cover" />
                    <figcaption className="mt-3">
                      <span className="block text-paper">{r.title[lang]}</span>
                      <span className="block text-[0.88rem] text-paper/65">{r.guests ? fill(d.events.guests, { n: r.guests }) : d.events.guestsTbc}</span>
                    </figcaption>
                  </figure>
                </li>
              );
            })}
            <li className="flex aspect-[4/3] items-center justify-center rounded-xl border border-dashed border-paper/25 p-6 text-center text-[0.95rem] text-paper/60">{d.events.more}</li>
          </ul>
        </div>
      </section>

      {/* ===== Devis ===== */}
      <section id="devis" className="bg-cream py-20 md:py-28">
        <div className="wrap grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="kicker">{d.blocks.events.kicker}</p>
            <h2 className="h-section mt-5">{d.quote.title}</h2>
            <p className="mt-5 text-[1.05rem]">{d.events.lead}</p>
            <a href={waLink()} target="_blank" rel="noopener" className="mt-8 inline-flex min-h-11 items-center gap-3 text-night">
              <WhatsAppIcon className="h-5 w-5 text-olive" />
              <span className="num" dir="ltr">
                {site.phone.display}
              </span>
              <span className="sr-only">{d.a11y.newTab}</span>
            </a>
          </div>
          <QuoteForm />
        </div>
      </section>

      {/* ===== Calendrier des fêtes ===== */}
      <section id="fetes" className="wrap py-20 md:py-28">
        <Reveal className="max-w-2xl">
          <p className="kicker">{d.fetes.kicker}</p>
          <h2 className="h-section mt-5">{d.fetes.title}</h2>
          <p className="mt-5 text-[1.05rem]">{d.fetes.lead}</p>
        </Reveal>
        <div className="mt-12">
          <Fetes initialToday={parisParts(new Date()).ymd} />
        </div>
        <p className="mt-4 text-[0.85rem] text-muted">{d.fetes.note}</p>
      </section>

      {/* ===== Comment ça marche ===== */}
      <section id="comment" className="border-y border-line bg-paper py-20 md:py-28">
        <div className="wrap">
          <p className="kicker">{d.how.kicker}</p>
          <h2 className="h-section mt-5">{d.how.title}</h2>
          <ol className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {d.how.steps.map((s, i) => (
              <li key={s.title}>
                <span className="num font-[family-name:var(--font-display)] text-[2.6rem] leading-none text-gold-deep">{i + 1}</span>
                <h3 className="mt-4 font-[family-name:var(--font-body)] text-[1.05rem] font-medium">{s.title}</h3>
                <p className="mt-2 text-[0.95rem] text-muted">{s.text}</p>
              </li>
            ))}
          </ol>
          <div className="mt-12">
            <OrderButton className="btn btn-night">{d.nav.order}</OrderButton>
          </div>
        </div>
      </section>

      {/* ===== Avis (vrais avis uniquement, section masquée tant que data/avis.json est vide) ===== */}
      <div hidden dangerouslySetInnerHTML={{ __html: "<!-- À REMPLIR avec de vrais avis clients (data/avis.json) -->" }} />
      {avis.items.length > 0 && (
        <section id="avis" className="wrap py-20 md:py-28">
          <p className="kicker">{d.reviews.kicker}</p>
          <h2 className="h-section mt-5">{d.reviews.title}</h2>
        </section>
      )}

      {/* ===== FAQ ===== */}
      <section id="faq" className="wrap grid gap-10 py-20 md:grid-cols-[0.8fr_1.2fr] md:py-28">
        <div>
          <p className="kicker">{d.faq.kicker}</p>
          <h2 className="h-section mt-5">{d.faq.title}</h2>
        </div>
        <div className="border-t border-line">
          {d.faq.items.map((f) => (
            <details key={f.q} className="border-b border-line">
              <summary className="flex min-h-16 items-center justify-between gap-6 py-4 text-[1.08rem] text-night">
                {f.q}
                <span aria-hidden="true" className="faq-plus text-[1.5rem] font-light leading-none text-gold-deep">
                  +
                </span>
              </summary>
              <p className="pb-6 pe-10 text-[1rem] leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}

function Alt({ id, flip, kicker, title, text, cta, media }: { id?: string; flip?: boolean; kicker: string; title: string; text: string; cta: { href: string; label: string; external?: boolean }; media: React.ReactNode }) {
  return (
    <section id={id} className="grid items-center gap-10 md:grid-cols-2 md:gap-20">
      <Reveal className={flip ? "md:order-2" : ""}>{media}</Reveal>
      <div>
        <p className="kicker">{kicker}</p>
        <h2 className="h-section mt-5">{title}</h2>
        <p className="mt-5 max-w-[32rem] text-[1.05rem] leading-relaxed">{text}</p>
        <a href={cta.href} {...(cta.external ? { target: "_blank", rel: "noopener" } : {})} className="btn btn-line mt-8">
          {cta.label}
          <ArrowIcon />
        </a>
      </div>
    </section>
  );
}

function Certificate({ d }: { d: Dict }) {
  const c = d.blocks.cacherout;
  return (
    <div className="on-dark rounded-[1.25rem] bg-night p-8 text-paper sm:p-10">
      <div className="flex items-center gap-6">
        <LogoSeal className="h-28 w-28 shrink-0 text-gold" />
        <dl className="space-y-3 text-[0.95rem]">
          <div>
            <dt className="text-paper/60">{c.authority}</dt>
            <dd className="text-[1.1rem]">{site.bethDin}</dd>
          </div>
          <div>
            <dt className="text-paper/60">{c.level}</dt>
            <dd className="text-[1.1rem]">{c.levelValue}</dd>
          </div>
        </dl>
      </div>
      {/* Certificat : déposer l'image dans public/media/cacherout/ et renseigner data/site.json → certificate */}
      {site.certificate ? (
        <Image src={site.certificate} alt={c.certificate} width={800} height={1100} className="mt-8 w-full rounded-lg" />
      ) : (
        <p className="mt-8 border-t border-paper/15 pt-6 text-[0.95rem] text-paper/80">
          <span className="block font-medium text-gold">{c.certificate}</span>
          {c.certificatePending}
        </p>
      )}
    </div>
  );
}
