import config from "@/data/config.json";
import fetes from "@/data/fetes.json";
import annonces from "@/data/annonces.json";

/**
 * Calendrier de commande du Chabbat, en heure de Paris.
 * - Heure limite : data/config.json (jeudi 20 h par défaut) ; passé ce délai, la commande vise le Chabbat suivant.
 * - Pendant Chabbat et les jours de fête (data/fetes.json), aucune commande : le site affiche un message.
 * - Allumage des bougies = coucher du soleil à Marseille − 18 min ; sortie = coucher + 50 min (indicatif).
 */

const TZ = config.timezone;
export type Ymd = string; // AAAA-MM-JJ

const pad = (n: number) => String(n).padStart(2, "0");

/** Date et heure de Paris d'un instant. */
export function parisParts(t: Date) {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23", weekday: "short" })
      .formatToParts(t)
      .map((x) => [x.type, x.value]),
  );
  const dow = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(p.weekday);
  return { ymd: `${p.year}-${p.month}-${p.day}` as Ymd, hm: `${p.hour}:${p.minute}`, dow };
}

/** Décale une date AAAA-MM-JJ de n jours. */
export function addDays(ymd: Ymd, n: number): Ymd {
  const [y, m, d] = ymd.split("-").map(Number);
  const t = new Date(Date.UTC(y, m - 1, d + n));
  return `${t.getUTCFullYear()}-${pad(t.getUTCMonth() + 1)}-${pad(t.getUTCDate())}`;
}

export const dowOf = (ymd: Ymd) => new Date(`${ymd}T12:00:00Z`).getUTCDay();

/** Instant correspondant à une date et une heure de Paris. */
export function parisTime(ymd: Ymd, hm: string): Date {
  const [y, m, d] = ymd.split("-").map(Number);
  const [h, mi] = hm.split(":").map(Number);
  const guess = Date.UTC(y, m - 1, d, h, mi);
  const p = parisParts(new Date(guess));
  const [py, pm, pd] = p.ymd.split("-").map(Number);
  const [ph, pmi] = p.hm.split(":").map(Number);
  const offset = Date.UTC(py, pm - 1, pd, ph, pmi) - guess;
  return new Date(guess - offset);
}

/** Coucher du soleil (algorithme de l'Almanac for Computers, précision ± 2 min). */
export function sunset(ymd: Ymd, lat = config.geo.lat, lng = config.geo.lng): Date {
  const [y, m, d] = ymd.split("-").map(Number);
  const rad = Math.PI / 180;
  const N = Math.floor((Date.UTC(y, m - 1, d) - Date.UTC(y, 0, 0)) / 86_400_000);
  const lngHour = lng / 15;
  const t = N + (18 - lngHour) / 24;
  const M = 0.9856 * t - 3.289;
  const L = (((M + 1.916 * Math.sin(M * rad) + 0.02 * Math.sin(2 * M * rad) + 282.634) % 360) + 360) % 360;
  let RA = ((Math.atan(0.91764 * Math.tan(L * rad)) / rad) % 360 + 360) % 360;
  RA = (RA + Math.floor(L / 90) * 90 - Math.floor(RA / 90) * 90) / 15;
  const sinDec = 0.39782 * Math.sin(L * rad);
  const cosDec = Math.cos(Math.asin(sinDec));
  const cosH = (Math.cos(90.833 * rad) - sinDec * Math.sin(lat * rad)) / (cosDec * Math.cos(lat * rad));
  const H = Math.acos(cosH) / rad / 15;
  const T = H + RA - 0.06571 * t - 6.622;
  const UT = (((T - lngHour) % 24) + 24) % 24;
  return new Date(Date.UTC(y, m - 1, d) + UT * 3_600_000);
}

const minutes = (n: number) => n * 60_000;
export const candleTime = (ymd: Ymd) => new Date(sunset(ymd).getTime() - minutes(config.candleMinutesBeforeSunset));
export const endTime = (ymd: Ymd) => new Date(sunset(ymd).getTime() + minutes(config.havdalahMinutesAfterSunset));

type Lang = "fr" | "en" | "he";
export type Pause = { reason: "chabbat" | "fete" | "fermeture"; until: Date; name?: Record<Lang, string> };

/** Commande suspendue en ce moment ? (Chabbat, jour de fête, fermeture) */
export function pauseAt(now: Date): Pause | null {
  const { ymd, dow } = parisParts(now);
  const t = now.getTime();
  const found: Pause[] = [];
  // Chabbat : du vendredi (bougies) au samedi (sortie)
  const fri = dow === 5 ? ymd : dow === 6 ? addDays(ymd, -1) : null;
  if (fri && t >= candleTime(fri).getTime() && t < endTime(addDays(fri, 1)).getTime()) found.push({ reason: "chabbat", until: endTime(addDays(fri, 1)) });
  for (const f of fetes.items) {
    for (const p of f.yomTov) {
      if (t >= candleTime(p.from).getTime() && t < endTime(p.to).getTime()) {
        // Si le Chabbat suit directement la fête, on prolonge jusqu'à la sortie du Chabbat
        found.push({ reason: "fete", until: dowOf(p.to) === 5 ? endTime(addDays(p.to, 1)) : endTime(p.to), name: f.name });
      }
    }
  }
  for (const c of annonces.fermetures as { from: Ymd; to: Ymd; text: Record<Lang, string> }[]) {
    if (ymd >= c.from && ymd <= c.to) found.push({ reason: "fermeture", until: parisTime(addDays(c.to, 1), "08:00"), name: c.text });
  }
  // Fête et Chabbat qui se suivent (Roch Hachana un samedi…) : on garde la reprise la plus tardive, la fête en priorité
  if (!found.length) return null;
  const until = new Date(Math.max(...found.map((p) => p.until.getTime())));
  return { ...(found.find((p) => p.reason !== "chabbat") ?? found[0]), until };
}

/**
 * Chabbat visé par une commande passée maintenant : le vendredi qui vient, ou celui d'après
 * si l'heure limite (jeudi 20 h) est passée.
 */
export function targetShabbat(now: Date) {
  const { ymd, dow } = parisParts(now);
  let friday = addDays(ymd, (5 - dow + 7) % 7);
  if (dow === 6) friday = addDays(ymd, 6);
  const deadlineOf = (f: Ymd) => parisTime(addDays(f, config.deadline.day - 5), config.deadline.time);
  if (now.getTime() > deadlineOf(friday).getTime()) friday = addDays(friday, 7);
  return { friday, deadline: deadlineOf(friday), candles: candleTime(friday), end: endTime(addDays(friday, 1)) };
}

export type Mode = "pickup" | "delivery";

/** Jours et créneaux possibles pour un Chabbat donné (avant l'allumage, après maintenant). */
export function serviceDays(friday: Ymd, mode: Mode, now: Date) {
  const table = config.slots[mode] as Record<string, string[]>;
  return Object.keys(table)
    .map(Number)
    .map((day) => {
      const date = addDays(friday, day - 5);
      const slots = table[String(day)].filter((s) => {
        const start = parisTime(date, s.slice(0, 5));
        return start.getTime() > now.getTime() + minutes(60) && start.getTime() < candleTime(friday).getTime();
      });
      return { date, slots };
    })
    .filter((x) => x.slots.length);
}

/** Fêtes dont la fin n'est pas passée, dans l'ordre. */
export function upcomingFetes(now: Date) {
  const { ymd } = parisParts(now);
  return fetes.items.filter((f) => f.end >= ymd);
}

/** Formats d'affichage */
export function fmtDay(ymd: Ymd, locale: string, opts: Intl.DateTimeFormatOptions = { weekday: "long", day: "numeric", month: "long" }) {
  return new Intl.DateTimeFormat(locale, { ...opts, timeZone: "UTC" }).format(new Date(`${ymd}T12:00:00Z`));
}
export function fmtTime(t: Date, locale: string) {
  return new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit", timeZone: TZ }).format(t);
}
export function fmtWhen(t: Date, locale: string) {
  return new Intl.DateTimeFormat(locale, { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit", timeZone: TZ }).format(t);
}
