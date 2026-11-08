"use client";

import { useState } from "react";
import { WhatsAppIcon } from "@/components/icons";
import { useLocale } from "@/components/providers";
import { fill } from "@/lib/i18n";
import { recap, waLink } from "@/lib/wa";

const TYPES = ["brit-mila", "bar-mitsva", "chabbat-hatan", "fiancailles", "fetes", "entreprise", "autre"] as const;
const FORMATS = ["buffet", "servi", "plateaux"] as const;

/** Demande de devis événement : récapitulatif envoyé sur WhatsApp, dans la langue de la page. */
export function QuoteForm() {
  const { d } = useLocale();
  const t = d.quote;
  const [f, setF] = useState({ type: "", date: "", time: "", place: "", guests: "", format: "", budget: "", name: "", phone: "", message: "" });
  const [error, setError] = useState("");
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF((x) => ({ ...x, [k]: e.target.value }));
  const typeLabel = (k: string) => (k === "autre" ? t.typeOther : d.events.types[k as keyof typeof d.events.types].title);

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const missing = [!f.type && t.type, !f.date && t.date, !f.guests && t.guests, !f.name.trim() && t.name, !f.phone.trim() && t.phone].filter(Boolean);
    if (missing.length) {
      setError(fill(t.required, { fields: missing.join(", ") }));
      return;
    }
    setError("");
    const date = f.date ? new Date(`${f.date}T12:00:00Z`).toLocaleDateString(document.documentElement.lang, { timeZone: "UTC", day: "numeric", month: "long", year: "numeric" }) : "";
    const text = recap(t.wa.title, [
      [t.type, typeLabel(f.type)],
      [t.date, [date, f.time].filter(Boolean).join(", ")],
      [t.place, f.place],
      [t.guests, f.guests],
      [t.format, f.format ? t.formats[f.format as keyof typeof t.formats] : ""],
      [t.budget, f.budget ? `${f.budget} €` : ""],
      [t.name, f.name],
      [t.phone, f.phone],
      [t.message, f.message],
    ]);
    window.open(waLink(text), "_blank", "noopener");
  };

  const today = new Date().toISOString().slice(0, 10);

  return (
    <form onSubmit={send} noValidate className="rounded-2xl bg-paper p-6 shadow-[0_1px_0_var(--color-line)] sm:p-9">
      <h3 className="text-[1.8rem] leading-tight">{t.title}</h3>
      <p className="mt-1 text-[0.95rem] text-muted">{t.lead}</p>

      <fieldset className="mt-6">
        <legend className="field mb-2">{t.type}</legend>
        <div className="flex flex-wrap gap-2">
          {TYPES.map((k) => (
            <label key={k}>
              <input type="radio" name="type" value={k} checked={f.type === k} onChange={set("type")} className="sr-only" />
              <span className="chip">{typeLabel(k)}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="field">
          {t.date}
          <input className="input" type="date" min={today} value={f.date} onChange={set("date")} />
        </label>
        <label className="field">
          {t.time}
          <input className="input" type="time" value={f.time} onChange={set("time")} />
        </label>
        <label className="field">
          {t.place}
          <input className="input" value={f.place} onChange={set("place")} placeholder={t.placeHint} />
        </label>
        <label className="field">
          {t.guests}
          <input className="input num" type="number" min={1} inputMode="numeric" value={f.guests} onChange={set("guests")} />
        </label>
      </div>

      <fieldset className="mt-5">
        <legend className="field mb-2">{t.format}</legend>
        <div className="flex flex-wrap gap-2">
          {FORMATS.map((k) => (
            <label key={k}>
              <input type="radio" name="format" value={k} checked={f.format === k} onChange={set("format")} className="sr-only" />
              <span className="chip">{t.formats[k]}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="field">
          {t.budget}
          <input className="input num" type="number" min={0} inputMode="decimal" value={f.budget} onChange={set("budget")} placeholder={t.budgetHint} />
        </label>
        <label className="field">
          {t.phone}
          <input className="input" type="tel" inputMode="tel" dir="ltr" autoComplete="tel" value={f.phone} onChange={set("phone")} />
        </label>
        <label className="field sm:col-span-2">
          {t.name}
          <input className="input" autoComplete="name" value={f.name} onChange={set("name")} />
        </label>
        <label className="field sm:col-span-2">
          {t.message}
          <textarea className="input" rows={3} value={f.message} onChange={set("message")} placeholder={t.messageHint} />
        </label>
      </div>

      {error && (
        <p role="alert" className="mt-4 text-[0.95rem] font-medium text-[#9b2c1f]">
          {error}
        </p>
      )}
      <button type="submit" className="btn btn-night mt-6 w-full sm:w-auto">
        <WhatsAppIcon className="h-5 w-5" />
        {t.send}
      </button>
    </form>
  );
}
