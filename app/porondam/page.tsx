"use client";

import { useState } from "react";
import { CITIES } from "@/lib/cities";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { LangToggle } from "@/components/lang-toggle";

type Lang = "en" | "si";

const UI: Record<Lang, Record<string, string>> = {
  en: { back: "← Back", title: "Porondam — compatibility", sub: "Check marriage compatibility between two horoscopes.", bride: "Bride", groom: "Groom", date: "Birth date", time: "Birth time", unknown: "Time unknown", city: "Birth place", pick: "Select city", submit: "Check compatibility", loading: "Matching charts…", score: "Guna Milan", err: "Something went wrong. Check the details and try again.", disc: "For guidance and entertainment only. Not a substitute for a full consultation." },
  si: { back: "← ආපසු", title: "පොරොන්දම් — ගැලපීම", sub: "හඳහන් දෙකක් අතර විවාහ පොරොන්දම් පරීක්ෂා කරන්න.", bride: "කන්‍යාව", groom: "පිරිමියා", date: "උපන් දිනය", time: "උපන් වේලාව", unknown: "වේලාව නොදනී", city: "උපන් ස්ථානය", pick: "නගරය තෝරන්න", submit: "පොරොන්දම් බලන්න", loading: "හඳහන් ගළපමින්…", score: "ගුණ මිලාන", err: "දෝෂයක් ඇතිවිය. විස්තර පරීක්ෂා කර නැවත උත්සාහ කරන්න.", disc: "මඟපෙන්වීම හා විනෝදය සඳහා පමණි. සම්පූර්ණ උපදේශනයකට ආදේශකයක් නොවේ." },
};

type Person = { date: string; time: string; timeKnown: boolean; cityIdx: string };

function PersonFields({ t, label, v, set }: { t: (k: string) => string; label: string; v: Person; set: (p: Person) => void }) {
  return (
    <Card className="mb-3.5">
      <div className="mb-2.5 font-serif text-xl text-gold-soft">{label}</div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <Label>{t("date")}</Label>
          <Input type="date" required value={v.date} onChange={(e) => set({ ...v, date: e.target.value })} />
        </div>
        <div>
          <Label>{t("time")}</Label>
          <Input type="time" value={v.time} disabled={!v.timeKnown} onChange={(e) => set({ ...v, time: e.target.value })} />
        </div>
      </div>
      <label className="my-3 flex items-center gap-2 text-sm text-muted">
        <input type="checkbox" className="h-4 w-4 accent-gold" checked={!v.timeKnown} onChange={(e) => set({ ...v, timeKnown: !e.target.checked })} />
        {t("unknown")}
      </label>
      <div>
        <Label>{t("city")}</Label>
        <Select required value={v.cityIdx} onChange={(e) => set({ ...v, cityIdx: e.target.value })}>
          <option value="" disabled>{t("pick")}</option>
          {CITIES.map((c, i) => <option key={i} value={i}>{c.name}</option>)}
        </Select>
      </div>
    </Card>
  );
}

export default function Porondam() {
  const [lang, setLang] = useState<Lang>("si");
  const t = (k: string) => UI[lang][k];
  const empty: Person = { date: "", time: "", timeKnown: true, cityIdx: "" };
  const [bride, setBride] = useState<Person>({ ...empty });
  const [groom, setGroom] = useState<Person>({ ...empty });
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [result, setResult] = useState<any>(null);
  const [outLang, setOutLang] = useState<Lang>("si");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const bc = CITIES[Number(bride.cityIdx)], gc = CITIES[Number(groom.cityIdx)];
    if (!bride.date || !groom.date || !bc || !gc) { setStatus("error"); return; }
    setStatus("loading"); setResult(null);
    try {
      const r = await fetch("/api/porondam", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          girl: { date: bride.date, time: bride.time, timeKnown: bride.timeKnown, lat: bc.lat, lon: bc.lon },
          boy: { date: groom.date, time: groom.time, timeKnown: groom.timeKnown, lat: gc.lat, lon: gc.lon },
          lang,
        }),
      });
      const d = await r.json().catch(() => ({}));
      if (r.ok && d.ok) { setResult(d); setOutLang(lang); setStatus("done"); } else setStatus("error");
    } catch { setStatus("error"); }
  }

  const f = result?.facts;
  const it = result?.interp;

  return (
    <div data-lang={lang} className="mx-auto max-w-[640px] px-6 pb-20 pt-9">
      <div className="mb-2.5 flex items-center justify-between">
        <a href="/" className="text-sm text-muted no-underline hover:text-gold-soft">{t("back")}</a>
        <LangToggle value={lang} onChange={(v) => setLang(v as Lang)} options={[{ code: "si", label: "සිං" }, { code: "en", label: "EN" }]} />
      </div>
      <h1 className="mb-1.5 font-serif text-[clamp(1.7rem,4vw,2.4rem)] font-bold text-gold-soft">{t("title")}</h1>
      <p className="mb-6 text-muted">{t("sub")}</p>

      <form onSubmit={submit}>
        <PersonFields t={t} label={t("bride")} v={bride} set={setBride} />
        <PersonFields t={t} label={t("groom")} v={groom} set={setGroom} />
        <Button type="submit" className="w-full" disabled={status === "loading"}>{status === "loading" ? t("loading") : t("submit")}</Button>
        {status === "error" && <p className="mt-2 text-center text-sm text-red-300">{t("err")}</p>}
      </form>

      {status === "done" && f && (
        <Card className="mt-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="font-serif text-2xl text-gold-soft">{t("score")}: {f.total != null ? `${f.total} / ${f.max}` : "—"}</div>
            <LangToggle value={outLang} onChange={(v) => setOutLang(v as Lang)} options={[{ code: "si", label: "සිං" }, { code: "en", label: "EN" }]} />
          </div>
          {it ? (
            <>
              <h2 className="mb-2.5 font-serif text-xl text-white">{outLang === "si" ? it.headline_si : it.headline_en}</h2>
              <p className="whitespace-pre-line leading-8">{outLang === "si" ? it.verdict_si : it.verdict_en}</p>
            </>
          ) : (
            <p className="leading-8">{f.verdict || "—"}</p>
          )}
          <p className="mt-4 text-center text-xs text-muted">{t("disc")}</p>
        </Card>
      )}
    </div>
  );
}
