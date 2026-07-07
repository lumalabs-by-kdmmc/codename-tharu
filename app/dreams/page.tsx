"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { LangToggle } from "@/components/lang-toggle";
import { GatedSubmit } from "@/components/gated-submit";

type Lang = "en" | "si";

const UI: Record<Lang, Record<string, string>> = {
  en: { back: "← Back", title: "Dream meanings", sub: "Tell us your dream and discover what it may signify.", ph: "Describe your dream…", submit: "Interpret my dream", loading: "Interpreting…", err: "Something went wrong. Please try again.", disc: "For reflection and entertainment only. Not medical or psychological advice." },
  si: { back: "← ආපසු", title: "සිහින පලාපල", sub: "ඔබේ සිහිනය කියන්න, එහි අර්ථය සොයාගන්න.", ph: "ඔබේ සිහිනය විස්තර කරන්න…", submit: "සිහිනය විග්‍රහ කරන්න", loading: "විග්‍රහ කරමින්…", err: "දෝෂයක් ඇතිවිය. නැවත උත්සාහ කරන්න.", disc: "මෙනෙහි කිරීම හා විනෝදය සඳහා පමණි. වෛද්‍ය හෝ මනෝවිද්‍යා උපදෙස් නොවේ." },
};

export default function Dreams() {
  const [lang, setLang] = useState<Lang>("si");
  const t = (k: string) => UI[lang][k];
  const [dream, setDream] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [out, setOut] = useState<any>(null);
  const [outLang, setOutLang] = useState<Lang>("si");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (dream.trim().length < 3) { setStatus("error"); return; }
    setStatus("loading"); setOut(null);
    try {
      const r = await fetch("/api/dreams", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ dream, lang }) });
      const d = await r.json().catch(() => ({}));
      if (r.ok && d.ok) { setOut(d.out); setOutLang(lang); setStatus("done"); } else setStatus("error");
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
          <Textarea rows={5} value={dream} onChange={(e) => setDream(e.target.value)} placeholder={t("ph")} />
          <GatedSubmit loading={status === "loading"} lang={lang}>{status === "loading" ? t("loading") : t("submit")}</GatedSubmit>
          {status === "error" && <p className="text-center text-sm text-red-300">{t("err")}</p>}
        </form>
      </Card>

      {status === "done" && out && (
        <Card className="mt-5">
          <div className="mb-2.5 flex justify-end">
            <LangToggle value={outLang} onChange={(v) => setOutLang(v as Lang)} options={[{ code: "si", label: "සිං" }, { code: "en", label: "EN" }]} />
          </div>
          <h2 className="mb-3 font-serif text-2xl text-white">{outLang === "si" ? out.headline_si : out.headline_en}</h2>
          <p className="whitespace-pre-line leading-8">{outLang === "si" ? out.meaning_si : out.meaning_en}</p>
          <p className="mt-4 text-center text-xs text-muted">{t("disc")}</p>
        </Card>
      )}
    </div>
  );
}
