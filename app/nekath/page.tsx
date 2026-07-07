"use client";

import { useState } from "react";
import { CITIES } from "@/lib/cities";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { LangToggle } from "@/components/lang-toggle";
import { GatedSubmit } from "@/components/gated-submit";

type Lang = "en" | "si";

const UI: Record<Lang, Record<string, string>> = {
  en: { back: "← Back", title: "Nekath — auspicious times", sub: "Find auspicious periods for a chosen day.", date: "Date", city: "Place", pick: "Select city", submit: "Find nekath", loading: "Finding…", none: "No periods returned for this day.", err: "Something went wrong. Please try again.", disc: "For guidance only." },
  si: { back: "← ආපසු", title: "නැකත් — සුබ මොහොත", sub: "තෝරාගත් දිනයකට සුබ මොහොත සොයන්න.", date: "දිනය", city: "ස්ථානය", pick: "නගරය තෝරන්න", submit: "නැකත් සොයන්න", loading: "සොයමින්…", none: "මෙම දිනයට මොහොත් නොමැත.", err: "දෝෂයක් ඇතිවිය. නැවත උත්සාහ කරන්න.", disc: "මඟපෙන්වීම සඳහා පමණි." },
};

function fmt(s: string) {
  try { return new Date(s).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Colombo" }); }
  catch { return s; }
}

export default function Nekath() {
  const [lang, setLang] = useState<Lang>("si");
  const t = (k: string) => UI[lang][k];
  const [date, setDate] = useState("");
  const [cityIdx, setCityIdx] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [rows, setRows] = useState<any[]>([]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const c = CITIES[Number(cityIdx)];
    if (!date || !c) { setStatus("error"); return; }
    setStatus("loading"); setRows([]);
    try {
      const r = await fetch("/api/nekath", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ date, lat: c.lat, lon: c.lon }) });
      const d = await r.json().catch(() => ({}));
      if (r.ok && d.ok) { setRows(d.muhurat || []); setStatus("done"); } else setStatus("error");
    } catch { setStatus("error"); }
  }

  return (
    <div data-lang={lang} className="mx-auto max-w-[640px] px-6 pb-20 pt-9">
      <div className="mb-2.5 flex items-center justify-between">
        <a href="/" className="text-sm text-muted no-underline hover:text-gold-soft">{t("back")}</a>
        <LangToggle value={lang} onChange={(v) => setLang(v as Lang)} options={[{ code: "si", label: "සිං" }, { code: "en", label: "EN" }]} />
      </div>
      <h1 className="mb-1.5 font-serif text-[clamp(1.7rem,4vw,2.4rem)] font-bold text-gold-soft">{t("title")}</h1>
      <p className="mb-6 text-muted">{t("sub")}</p>

      <Card>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <Label>{t("date")}</Label>
              <Input type="date" required value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div>
              <Label>{t("city")}</Label>
              <Select required value={cityIdx} onChange={(e) => setCityIdx(e.target.value)}>
                <option value="" disabled>{t("pick")}</option>
                {CITIES.map((c, i) => <option key={i} value={i}>{c.name}</option>)}
              </Select>
            </div>
          </div>
          <GatedSubmit loading={status === "loading"} lang={lang}>{status === "loading" ? t("loading") : t("submit")}</GatedSubmit>
          {status === "error" && <p className="text-center text-sm text-red-300">{t("err")}</p>}
        </form>
      </Card>

      {status === "done" && (
        <div className="mt-5 space-y-3">
          {rows.length === 0 ? (
            <p className="text-muted">{t("none")}</p>
          ) : (
            rows.map((m, i) => (
              <Card key={i} className="p-5">
                <div className="flex items-center justify-between">
                  <div className="font-serif text-xl text-gold-soft">{m.name}</div>
                  <span className="rounded-md border border-gold/20 px-2 py-0.5 text-xs text-gold-2">{m.type}</span>
                </div>
                <div className="mt-1.5 text-[0.95rem] text-muted">
                  {(m.period || []).map((p: any, j: number) => <div key={j}>{fmt(p.start)} – {fmt(p.end)}</div>)}
                </div>
              </Card>
            ))
          )}
          <p className="text-center text-xs text-muted">{t("disc")}</p>
        </div>
      )}
    </div>
  );
}
