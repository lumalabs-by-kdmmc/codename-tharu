"use client";

import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LangToggle } from "@/components/lang-toggle";
import { cn } from "@/lib/utils";

type Lang = "en" | "si";

const UI: Record<Lang, Record<string, string>> = {
  en: { back: "← Back", title: "Palm reading", sub: "Upload a clear photo of your palm for a fun reading.", choose: "Choose palm photo", submit: "Read my palm", loading: "Reading your palm…", retake: "Please retake", err: "Something went wrong. Please try again.", disc: "Just for fun ✨ Palmistry is entertainment, not prediction, and not medical, financial or legal advice." },
  si: { back: "← ආපසු", title: "හස්ත රේඛා කියවීම", sub: "විනෝදජනක කියවීමක් සඳහා ඔබේ අත්ලේ පැහැදිලි ඡායාරූපයක් උඩුගත කරන්න.", choose: "අත්ලේ ඡායාරූපය තෝරන්න", submit: "මගේ අත්ල කියවන්න", loading: "අත්ල කියවමින්…", retake: "නැවත ගන්න", err: "දෝෂයක් ඇතිවිය. නැවත උත්සාහ කරන්න.", disc: "විනෝදය සඳහා පමණි ✨ හස්ත රේඛා යනු විනෝදයක් මිස අනාවැකියක් හෝ වෛද්‍ය, මූල්‍ය හෝ නීති උපදෙස් නොවේ." },
};

function resize(file: File, max = 1024, q = 0.85): Promise<string> {
  return new Promise((res, rej) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let w = img.width, h = img.height;
      if (w > h && w > max) { h = Math.round((h * max) / w); w = max; }
      else if (h > max) { w = Math.round((w * max) / h); h = max; }
      const c = document.createElement("canvas");
      c.width = w; c.height = h;
      c.getContext("2d")!.drawImage(img, 0, 0, w, h);
      res(c.toDataURL("image/jpeg", q));
    };
    img.onerror = rej;
    img.src = url;
  });
}

export default function Palm() {
  const [lang, setLang] = useState<Lang>("si");
  const t = (k: string) => UI[lang][k];
  const [preview, setPreview] = useState("");
  const [dataUrl, setDataUrl] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [out, setOut] = useState<any>(null);
  const [outLang, setOutLang] = useState<Lang>("si");

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    try { const du = await resize(f); setDataUrl(du); setPreview(du); setOut(null); setStatus("idle"); }
    catch { setStatus("error"); }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!dataUrl) { setStatus("error"); return; }
    setStatus("loading"); setOut(null);
    try {
      const r = await fetch("/api/palm", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ image: dataUrl, lang }) });
      const d = await r.json().catch(() => ({}));
      if (r.ok && d.ok) { setOut(d.out); setOutLang(lang); setStatus("done"); } else setStatus("error");
    } catch { setStatus("error"); }
  }

  const good = out && out.is_palm && out.quality_ok;

  return (
    <div data-lang={lang} className="mx-auto max-w-[640px] px-6 pb-20 pt-9">
      <div className="mb-2.5 flex items-center justify-between">
        <a href="/" className="text-sm text-muted no-underline hover:text-gold-soft">{t("back")}</a>
        <LangToggle value={lang} onChange={(v) => setLang(v as Lang)} options={[{ code: "si", label: "සිං" }, { code: "en", label: "EN" }]} />
      </div>
      <h1 className="mb-1.5 font-serif text-[clamp(1.7rem,4vw,2.4rem)] font-bold text-gold-soft">{t("title")}</h1>
      <p className="mb-5 text-muted">{t("sub")}</p>

      <Card>
        <form onSubmit={submit} className="space-y-4">
          <label className={cn(buttonVariants({ variant: "outline", size: "sm" }), "cursor-pointer")}>
            {t("choose")}
            <input type="file" accept="image/*" capture="environment" onChange={onFile} className="hidden" />
          </label>
          {preview && <img src={preview} alt="palm" className="my-2.5 max-w-full rounded-xl border border-gold/20" />}
          <Button type="submit" className="w-full" disabled={status === "loading" || !dataUrl}>{status === "loading" ? t("loading") : t("submit")}</Button>
          {status === "error" && <p className="text-center text-sm text-red-300">{t("err")}</p>}
        </form>
      </Card>

      {status === "done" && out && (good ? (
        <Card className="mt-5">
          <div className="mb-2.5 flex justify-end">
            <LangToggle value={outLang} onChange={(v) => setOutLang(v as Lang)} options={[{ code: "si", label: "සිං" }, { code: "en", label: "EN" }]} />
          </div>
          <h2 className="mb-3 font-serif text-2xl text-white">{outLang === "si" ? out.headline_si : out.headline_en}</h2>
          <p className="whitespace-pre-line leading-8">{outLang === "si" ? out.reading_si : out.reading_en}</p>
          <p className="mt-4 text-center text-xs text-muted">{t("disc")}</p>
        </Card>
      ) : (
        <Card className="mt-5">
          <div className="mb-2 font-serif text-xl text-gold-soft">{t("retake")}</div>
          <p className="leading-7">{outLang === "si" ? (out.retake_si || out.retake_en) : (out.retake_en || out.retake_si)}</p>
        </Card>
      ))}
    </div>
  );
}
