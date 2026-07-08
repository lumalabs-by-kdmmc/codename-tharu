"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { LangToggle } from "@/components/lang-toggle";

const KIND_LABEL: Record<string, { en: string; si: string }> = {
  birth: { en: "Birth chart", si: "හඳහන" },
  porondam: { en: "Porondam", si: "පොරොන්දම්" },
  palm: { en: "Palm", si: "හස්ත රේඛා" },
  dream: { en: "Dream", si: "සිහිනය" },
};

export function HistoryList({ rows }: { rows: any[] }) {
  const [lang, setLang] = useState("si");

  if (!rows || rows.length === 0) {
    return (
      <p className="text-muted">
        {lang === "si" ? "තවම කියවීම් නැත. මුල් පිටුවෙන් එකක් උත්සාහ කරන්න." : "No readings yet — try one from the home page."}
      </p>
    );
  }

  return (
    <div data-lang={lang} className="space-y-4">
      <div className="flex justify-end">
        <LangToggle value={lang} onChange={setLang} options={[{ code: "si", label: "සිං" }, { code: "en", label: "EN" }]} />
      </div>
      {rows.map((r) => {
        const kind = KIND_LABEL[r.kind] || { en: r.kind, si: r.kind };
        const title = lang === "si" ? r.title_si || r.title_en : r.title_en || r.title_si;
        const content = lang === "si" ? r.content_si || r.content_en : r.content_en || r.content_si;
        return (
          <Card key={r.id}>
            <div className="mb-2 flex items-center justify-between">
              <span className="rounded-md border border-gold/20 px-2 py-0.5 text-xs text-gold-2">{lang === "si" ? kind.si : kind.en}</span>
              <span className="text-xs text-muted">{new Date(r.created_at).toLocaleDateString("en-GB")}</span>
            </div>
            {title ? <h3 className="mb-2 font-serif text-xl text-white">{title}</h3> : null}
            <p className="whitespace-pre-line leading-8">{content}</p>
          </Card>
        );
      })}
    </div>
  );
}
