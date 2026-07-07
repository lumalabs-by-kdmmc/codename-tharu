"use client";

import { useState } from "react";
import { CITIES } from "@/lib/cities";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { LangToggle } from "@/components/lang-toggle";
import { GatedSubmit } from "@/components/gated-submit";

type Lang = "en" | "si";

const UI: Record<Lang, Record<string, string>> = {
  en: { back: "← Back", title: "Your birth chart reading", sub: "Enter your birth details for a personal Vedic reading.", name: "Name (optional)", date: "Birth date", time: "Birth time", unknown: "I don't know my birth time", place: "Birth place", lang: "Reading language", submit: "Get my reading", loading: "Reading the stars…", nak: "Nakshatra", moon: "Moon sign", sun: "Sun sign", dasha: "Current period", disclaimer: "For guidance and entertainment only. Not medical, legal or financial advice.", err: "Something went wrong. Please check your details and try again.", pick: "Select your city" },
  si: { back: "← ආපසු", title: "ඔබේ හඳහන් කියවීම", sub: "පෞද්ගලික වෛදික කියවීමක් සඳහා ඔබේ උපන් තොරතුරු ඇතුළත් කරන්න.", name: "නම (අත්‍යවශ්‍ය නොවේ)", date: "උපන් දිනය", time: "උපන් වේලාව", unknown: "මගේ උපන් වේලාව නොදනී", place: "උපන් ස්ථානය", lang: "කියවීමේ භාෂාව", submit: "මගේ කියවීම ලබාගන්න", loading: "තරු කියවමින්…", nak: "නැකත", moon: "චන්ද්‍ර රාශිය", sun: "රවි රාශිය", dasha: "වත්මන් දශාව", disclaimer: "මඟපෙන්වීම හා විනෝදය සඳහා පමණි. වෛද්‍ය, නීති හෝ මූල්‍ය උපදෙස් නොවේ.", err: "දෝෂයක් ඇතිවිය. ඔබේ තොරතුරු පරීක්ෂා කර නැවත උත්සාහ කරන්න.", pick: "ඔබේ නගරය තෝරන්න" },
};

export default function Reading() {
  const [lang, setLang] = useState<Lang>("si");
  const t = (k: string) => UI[lang][k];
  const [form, setForm] = useState({ name: "", date: "", time: "", timeKnown: true, cityIdx: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [result, setResult] = useState<any>(null);
  const [outLang, setOutLang] = useState<Lang>("si");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const city = CITIES[Number(form.cityIdx)];
    if (!form.date || !city) { setStatus("error"); return; }
    setStatus("loading"); setResult(null);
    try {
      const res = await fetch("/api/reading", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name || null, date: form.date, time: form.time, timeKnown: form.timeKnown, place: city.name, lat: city.lat, lon: city.lon, lang }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) { setResult(data); setOutLang(lang); setStatus("done"); } else setStatus("error");
    } catch { setStatus("error"); }
  }

  const facts = result?.facts;
  const reading = result?.reading;

  return (
    <div data-lang={lang} className="mx-auto max-w-[640px] px-6 pb-20 pt-9">
      <div className="mb-2.5 flex items-center justify-between">
        <a href="/" className="text-sm text-muted no-underline hover:text-gold-soft">{t("back")}</a>
        <LangToggle value={lang} onChange={(v) => setLang(v as Lang)} options={[{ code: "si", label: "සිං" }, { code: "en", label: "EN" }]} />
      </div>
      <h1 className="mb-1.5 font-serif text-[clamp(1.7rem,4vw,2.4rem)] font-bold text-gold-soft">{t("title")}</h1>
      <p className="mb-6 text-muted">{t("sub")}</p>

      <Card>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label>{t("name")}</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <Label>{t("date")}</Label>
              <Input type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <div>
              <Label>{t("time")}</Label>
              <Input type="time" value={form.time} disabled={!form.timeKnown} onChange={(e) => setForm({ ...form, time: e.target.value })} />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-muted">
            <input type="checkbox" className="h-4 w-4 accent-gold" checked={!form.timeKnown} onChange={(e) => setForm({ ...form, timeKnown: !e.target.checked })} />
            {t("unknown")}
          </label>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <Label>{t("place")}</Label>
              <Select required value={form.cityIdx} onChange={(e) => setForm({ ...form, cityIdx: e.target.value })}>
                <option value="" disabled>{t("pick")}</option>
                {CITIES.map((c, i) => <option key={i} value={i}>{c.name}</option>)}
              </Select>
            </div>
            <div>
              <Label>{t("lang")}</Label>
              <Select value={lang} onChange={(e) => setLang(e.target.value as Lang)}>
                <option value="si">සිංහල</option>
                <option value="en">English</option>
              </Select>
            </div>
          </div>
          <GatedSubmit loading={status === "loading"} lang={lang}>
            {status === "loading" ? t("loading") : t("submit")}
          </GatedSubmit>
          {status === "error" && <p className="text-center text-sm text-red-300">{t("err")}</p>}
        </form>
      </Card>

      {status === "done" && reading && (
        <Card className="mt-5">
          <div className="mb-2.5 flex justify-end">
            <LangToggle value={outLang} onChange={(v) => setOutLang(v as Lang)} options={[{ code: "si", label: "සිං" }, { code: "en", label: "EN" }]} />
          </div>
          <h2 className="mb-3.5 font-serif text-2xl text-white">{outLang === "si" ? reading.headline_si : reading.headline_en}</h2>
          <div className="mb-4 flex flex-wrap gap-2">
            {[[t("nak"), facts.nakshatra], [t("moon"), facts.moon_rasi], [t("sun"), facts.sun_rasi], [t("dasha"), facts.dasha_current]].map(([k, v], i) =>
              v ? <span key={i} className="rounded-md border border-gold/20 px-2 py-0.5 text-xs text-gold-2">{k}: {v}</span> : null
            )}
          </div>
          <p className="whitespace-pre-line leading-8">{outLang === "si" ? reading.reading_si : reading.reading_en}</p>
          <p className="mt-4 text-center text-xs text-muted">{t("disclaimer")}</p>
        </Card>
      )}
    </div>
  );
}
