"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import config from "@/data/config.json";
import { CloseIcon, MinusIcon, PlusIcon, WhatsAppIcon } from "@/components/icons";
import { useLocale } from "@/components/providers";
import { describe, useCart } from "@/components/cart";
import { useShabbat } from "@/components/useShabbat";
import { euro, fill, intlLocale } from "@/lib/i18n";
import { fmtDay, fmtWhen, serviceDays, type Mode } from "@/lib/chabbat";
import { recap, waLink } from "@/lib/wa";

export const plural = (tpl: string, n: number) => {
  const [one, many] = tpl.split("|");
  return fill(n === 1 ? one : (many ?? one), { n });
};

/** Barre flottante « Ma commande » (apparaît dès le premier article) + fenêtre de commande. */
export function OrderLayer() {
  const { d, lang } = useLocale();
  const { lines, count, open, setOpen } = useCart();
  const reduce = useReducedMotion();
  const total = lines.reduce((s, l) => s + describe(l, lang, () => "").price * l.qty, 0);

  return (
    <>
      <AnimatePresence>
        {count > 0 && !open && (
          <motion.div
            initial={reduce ? false : { y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { y: 24, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 0.61, 0.36, 1] }}
            className="fixed inset-x-0 bottom-[calc(4.25rem+env(safe-area-inset-bottom))] z-40 px-3 md:bottom-5"
          >
            <button type="button" onClick={() => setOpen(true)} className="mx-auto flex min-h-14 w-full max-w-md items-center justify-between gap-4 rounded-full bg-night px-6 text-paper shadow-[0_10px_30px_-12px_rgb(21_29_49/0.6)]">
              <span className="flex items-center gap-3">
                <span className="font-medium">{d.cart.open}</span>
                <span className="num hidden text-[0.9rem] text-paper/75 min-[400px]:inline">{plural(d.cart.count, count)}</span>
              </span>
              <span className="num flex items-center gap-3">
                {euro(total, lang)}
                <span className="whitespace-nowrap rounded-full bg-gold px-3 py-1 text-[0.85rem] font-medium text-night-deep">{d.cart.finish}</span>
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      {open && <OrderDialog onClose={() => setOpen(false)} total={total} />}
    </>
  );
}

function OrderDialog({ onClose, total }: { onClose: () => void; total: number }) {
  const { lang, d } = useLocale();
  const t = d.order;
  const loc = intlLocale[lang];
  const { lines, setQty } = useCart();
  const s = useShabbat();
  const [mode, setMode] = useState<Mode>("pickup");
  const [persons, setPersons] = useState("");
  const [address, setAddress] = useState("");
  const [day, setDay] = useState("");
  const [slot, setSlot] = useState("");
  const [choices, setChoices] = useState("");
  const [notes, setNotes] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const opener = useRef<Element | null>(null);

  const days = useMemo(() => (s ? serviceDays(s.target.friday, mode, s.now) : []), [s, mode]);
  const slots = useMemo(() => days.find((x) => x.date === day)?.slots ?? [], [days, day]);
  const hasFormule = lines.some((l) => l.kind === "formule");
  const personsLabel = (n: number) => fill(d.carte.formuleLine, { n });

  useEffect(() => {
    opener.current = document.activeElement;
    ref.current?.querySelector<HTMLElement>("button, input, select")?.focus();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      (opener.current as HTMLElement | null)?.focus?.();
    };
  }, [onClose]);

  // Jour et créneau par défaut : les premiers disponibles
  useEffect(() => {
    if (!days.length) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- valeur par défaut quand la liste change
    if (!days.some((x) => x.date === day)) setDay(days[0].date);
  }, [days, day]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- valeur par défaut quand la liste change
    if (!slots.includes(slot)) setSlot(slots[0] ?? "");
  }, [slots, slot]);

  const paused = s?.pause;
  const pausedText = paused
    ? fill(paused.reason === "chabbat" ? t.paused : paused.reason === "fete" ? t.pausedFete : t.pausedClosed, { until: fmtWhen(paused.until, loc), name: paused.name?.[lang] ?? "" })
    : "";

  const send = () => {
    if (!s || paused) return;
    const missing = [
      !lines.length && d.cart.open,
      !name.trim() && t.name,
      !phone.trim() && t.phone,
      mode === "delivery" && !address.trim() && t.address,
      !slot && t.slot,
    ].filter(Boolean);
    if (missing.length) {
      setError(fill(t.required, { fields: missing.join(", ") }));
      return;
    }
    setError("");
    const w = t.wa;
    const itemLines = lines.map((l) => {
      const x = describe(l, lang, personsLabel);
      return `${l.qty} × ${x.name}${x.side ? ` (${w.with} ${x.side})` : ""} – ${euro(x.price * l.qty, lang)}`;
    });
    const text = [
      `*${w.title}*`,
      `${w.shabbat} ${fmtDay(s.target.friday, loc)}`,
      "",
      `*${w.items}*`,
      ...itemLines,
      `${w.total} : ${euro(total, lang)}`,
      "",
      recap("", [
        [w.persons, persons],
        [w.mode, mode === "pickup" ? t.pickup : t.delivery],
        [w.address, mode === "delivery" ? address : ""],
        [w.when, `${fmtDay(day, loc)}, ${slot}`],
        [w.choices, hasFormule ? choices : ""],
        [w.notes, notes],
        [w.name, name],
        [w.phone, phone],
      ]),
    ].join("\n");
    window.open(waLink(text), "_blank", "noopener");
  };

  return (
    <div className="fade-in fixed inset-0 z-[70] flex items-end justify-center bg-night-deep/60 sm:items-center sm:p-6" onClick={onClose}>
      <div ref={ref} role="dialog" aria-modal="true" aria-labelledby="order-title" onClick={(e) => e.stopPropagation()} className="max-h-[94svh] w-full max-w-2xl overflow-y-auto overscroll-contain rounded-t-2xl bg-paper p-6 shadow-xl sm:rounded-2xl sm:p-9">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="order-title" className="text-[1.9rem] leading-tight">
              {t.title}
            </h2>
            {s && !paused && (
              <p className="num mt-2 text-[0.95rem] text-muted">
                <span className="font-medium text-ink">{fill(t.for, { friday: fmtDay(s.target.friday, loc) })}</span> · {fill(t.deadline, { deadline: fmtWhen(s.target.deadline, loc) })}
              </p>
            )}
          </div>
          <button type="button" onClick={onClose} className="-me-2 flex h-11 w-11 shrink-0 items-center justify-center text-night" aria-label={t.close}>
            <CloseIcon />
          </button>
        </div>

        {paused && (
          <p role="status" className="mt-5 rounded-xl bg-night px-5 py-4 text-paper">
            {pausedText}
          </p>
        )}
        {s && !paused && s.weekShifted && <p className="mt-4 rounded-xl border border-gold/60 bg-cream px-4 py-3 text-[0.95rem]">{t.nextWeek}</p>}

        {/* Panier */}
        {lines.length ? (
          <ul className="mt-6 divide-y divide-line border-y border-line">
            {lines.map((l) => {
              const x = describe(l, lang, personsLabel);
              return (
                <li key={l.key} className="flex items-center justify-between gap-4 py-3">
                  <div className="min-w-0">
                    <p className="font-medium text-night">{x.name}</p>
                    <p className="num text-sm text-muted">
                      {x.side ? `${d.carte.side} : ${x.side} · ` : ""}
                      {euro(x.price, lang)}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1" role="group" aria-label={`${d.cart.qty} – ${x.name}`}>
                    <button type="button" onClick={() => setQty(l.key, l.qty - 1)} className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-night" aria-label={l.qty === 1 ? d.cart.remove : d.cart.less}>
                      <MinusIcon />
                    </button>
                    <span className="num w-7 text-center font-medium" aria-live="polite">
                      {l.qty}
                    </span>
                    <button type="button" onClick={() => setQty(l.key, l.qty + 1)} className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-night" aria-label={d.cart.more}>
                      <PlusIcon />
                    </button>
                  </div>
                </li>
              );
            })}
            <li className="num flex items-center justify-between py-3 font-medium text-night">
              <span>{d.cart.estimated}</span>
              <span>{euro(total, lang)}</span>
            </li>
          </ul>
        ) : (
          <p className="mt-6 rounded-xl bg-cream px-5 py-4 text-[0.95rem]">
            {d.cart.empty}{" "}
            <a href="#carte" onClick={onClose} className="font-medium text-night underline underline-offset-4">
              {d.nav.carte}
            </a>
          </p>
        )}

        <fieldset disabled={!!paused} className="mt-6 grid gap-4 disabled:opacity-50 sm:grid-cols-2">
          <div className="field sm:col-span-2">
            <span id="mode-label">{t.mode}</span>
            <div role="radiogroup" aria-labelledby="mode-label" className="flex flex-wrap gap-2">
              {(["pickup", "delivery"] as const).map((m) =>
                m === "delivery" && !config.delivery.enabled ? null : (
                  <label key={m}>
                    <input type="radio" name="mode" value={m} checked={mode === m} onChange={() => setMode(m)} className="sr-only" />
                    <span className="chip">{m === "pickup" ? t.pickup : t.delivery}</span>
                  </label>
                ),
              )}
            </div>
          </div>
          {mode === "delivery" && (
            <label className="field sm:col-span-2">
              {t.address}
              <input className="input" value={address} onChange={(e) => setAddress(e.target.value)} placeholder={t.addressHint} autoComplete="street-address" />
              <span className="text-[0.85rem] font-normal text-muted">{t.deliveryNote}</span>
            </label>
          )}
          {days.length ? (
            <>
              <label className="field">
                {t.day}
                <select className="input" value={day} onChange={(e) => setDay(e.target.value)}>
                  {days.map((x) => (
                    <option key={x.date} value={x.date}>
                      {fmtDay(x.date, loc)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                {t.slot}
                <select className="input num" value={slot} onChange={(e) => setSlot(e.target.value)}>
                  {slots.map((x) => (
                    <option key={x} value={x}>
                      {x}
                    </option>
                  ))}
                </select>
              </label>
            </>
          ) : (
            s && !paused && <p className="text-[0.95rem] text-muted sm:col-span-2">{t.noSlots}</p>
          )}
          <label className="field">
            {t.persons}
            <input className="input num" type="number" min={1} max={200} inputMode="numeric" value={persons} onChange={(e) => setPersons(e.target.value)} />
          </label>
          <label className="field">
            {t.phone}
            <input className="input" name="tel" type="tel" inputMode="tel" dir="ltr" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" />
          </label>
          <label className="field sm:col-span-2">
            {t.name}
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} name="name" autoComplete="name" />
          </label>
          {hasFormule && (
            <label className="field sm:col-span-2">
              {t.choices}
              <textarea className="input" rows={2} value={choices} onChange={(e) => setChoices(e.target.value)} placeholder={t.choicesHint} />
            </label>
          )}
          <label className="field sm:col-span-2">
            {t.notes}
            <textarea className="input" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={t.notesHint} />
          </label>
        </fieldset>

        {error && (
          <p role="alert" className="mt-4 text-[0.95rem] font-medium text-[#9b2c1f]">
            {error}
          </p>
        )}
        <button type="button" onClick={send} disabled={!!paused || !s} className="btn btn-night mt-6 w-full disabled:opacity-50">
          <WhatsAppIcon className="h-5 w-5" />
          {t.send}
        </button>
        {/* Paiement en ligne : prévu, désactivé par défaut (data/config.json → payment) */}
        {config.payment.enabled && config.payment.paymentLink && !paused && (
          <a href={config.payment.paymentLink} target="_blank" rel="noopener" className="btn btn-line mt-3 w-full">
            {t.pay}
          </a>
        )}
        <p className="mt-3 text-center text-[0.85rem] text-muted">{t.after}</p>
      </div>
    </div>
  );
}
