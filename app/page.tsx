"use client";

import { useState } from "react";
import { Sparkles, Hand, Heart, Moon, Sun, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LangToggle } from "@/components/lang-toggle";
import { AuthButton } from "@/components/auth-button";

type Lang = "en" | "si" | "ta";

const T: Record<string, Record<string, string>> = {
  en: {
    ta_soon: "தமிழ் பதிப்பு விரைவில் வரும் — Tamil version coming soon.",
    nav_cta: "Get a reading",
    hero_title: "Your stars, your palm, your dreams — guided by AI, rooted in Sri Lankan tradition.",
    hero_sub: "Authentic Vedic astrology (handahana), palm reading, porondam matching, dream meanings and nekath — all in one place, in your language.",
    hero_cta: "Get your free reading",
    hero_trust: "Built for Sri Lanka · Sinhala, Tamil & English",
    feat_eyebrow: "The experience",
    feat_title: "What you can do",
    f1_tag: "Core", f1_t: "Your birth chart & future", f1_d: "A personal Vedic handahana, plus an AI you can ask about love, career and life — grounded in your real chart.",
    f2_tag: "Snap & share", f2_t: "Palm reading", f2_d: "Snap a photo of your palm and get an instant reading of your lines — clear, visual and fun to share.",
    f3_tag: "Most loved", f3_t: "Porondam matching", f3_d: "Check marriage compatibility between two charts, the way it's done in Sri Lanka.",
    f4_t: "Dream meanings", f4_d: "Tell us your dream and discover what it may signify (sihina palapala).",
    f5_t: "Nekath (auspicious times)", f5_d: "Know the right moments for new beginnings — journeys, work and ceremonies.",
    open: "Open",
    why_eyebrow: "Why us", why_title: "Why Tharā",
    why_1: "Rooted in authentic Sri Lankan Vedic tradition — not generic Western sun-signs.",
    why_2: "In your language — Sinhala, Tamil and English.",
    why_3: "Private and personal — your details stay yours.",
    footer_disclaimer: "For guidance and entertainment only. Not a substitute for professional medical, legal or financial advice.",
    footer_name_note: "“Tharā” is a working name.",
  },
  si: {
    ta_soon: "தமிழ் பதிப்பு விரைவில் வரும் — Tamil version coming soon.",
    nav_cta: "කියවීමක් ලබාගන්න",
    hero_title: "ඔබේ තරු, ඔබේ අත්ල, ඔබේ සිහින — AI තාක්ෂණයෙන්, ශ්‍රී ලාංකික සම්ප්‍රදායට අනුව.",
    hero_sub: "සැබෑ වෛදික ජ්‍යෝතිෂය (හඳහන), හස්ත රේඛා, පොරොන්දම්, සිහින පලාපල සහ නැකත් — සියල්ල එකම තැනක, ඔබේ භාෂාවෙන්.",
    hero_cta: "ඔබේ නොමිලේ කියවීම ලබාගන්න",
    hero_trust: "ශ්‍රී ලංකාව සඳහා · සිංහල, දෙමළ සහ ඉංග්‍රීසි",
    feat_eyebrow: "අත්දැකීම",
    feat_title: "ඔබට කළ හැකි දේ",
    f1_tag: "ප්‍රධාන", f1_t: "ඔබේ හඳහන සහ අනාගතය", f1_d: "පෞද්ගලික වෛදික හඳහනක්, සහ ඔබේ සැබෑ හඳහන මත පදනම්ව ආදරය, රැකියාව සහ ජීවිතය ගැන ඇසිය හැකි AI සහායකයෙක්.",
    f2_tag: "ඡායාරූප", f2_t: "හස්ත රේඛා කියවීම", f2_d: "ඔබේ අත්ලේ ඡායාරූපයක් ගෙන ඔබේ රේඛා පිළිබඳ ක්ෂණික කියවීමක් ලබාගන්න.",
    f3_tag: "වඩාත් ප්‍රියතම", f3_t: "පොරොන්දම් ගැලපීම", f3_d: "හඳහන් දෙකක් අතර විවාහ පොරොන්දම් ශ්‍රී ලාංකික ක්‍රමයට පරීක්ෂා කරන්න.",
    f4_t: "සිහින පලාපල", f4_d: "ඔබේ සිහිනය කියන්න, එහි අර්ථය සොයාගන්න.",
    f5_t: "නැකත්", f5_d: "නව ආරම්භ සඳහා සුබ මොහොත — ගමන්, කටයුතු සහ උත්සව.",
    open: "විවෘත කරන්න",
    why_eyebrow: "ඇයි අපි", why_title: "ඇයි තරු?",
    why_1: "සැබෑ ශ්‍රී ලාංකික වෛදික සම්ප්‍රදාය මත පදනම්ව — සාමාන්‍ය බටහිර රාශි නොවේ.",
    why_2: "ඔබේ භාෂාවෙන් — සිංහල, දෙමළ සහ ඉංග්‍රීසි.",
    why_3: "පෞද්ගලික සහ ආරක්ෂිතයි — ඔබේ තොරතුරු ඔබටම.",
    footer_disclaimer: "මඟපෙන්වීම සහ විනෝදය සඳහා පමණි. වෘත්තීය වෛද්‍ය, නීති හෝ මූල්‍ය උපදෙස් සඳහා ආදේශකයක් නොවේ.",
    footer_name_note: "“තරු” යනු තාවකාලික නාමයකි.",
  },
};

const FEATURES = [
  { href: "/reading", Icon: Sparkles, tag: "f1_tag", t: "f1_t", d: "f1_d" },
  { href: "/palm", Icon: Hand, tag: "f2_tag", t: "f2_t", d: "f2_d" },
  { href: "/porondam", Icon: Heart, tag: "f3_tag", t: "f3_t", d: "f3_d" },
  { href: "/dreams", Icon: Moon, t: "f4_t", d: "f4_d" },
  { href: "/nekath", Icon: Sun, t: "f5_t", d: "f5_d" },
];

export default function Home() {
  const [lang, setLang] = useState<Lang>("en");
  const s = (k: string) => (T[lang] && T[lang][k] !== undefined ? T[lang][k] : T.en[k]);

  return (
    <div data-lang={lang}>
      {lang === "ta" && (
        <div className="border-b border-gold/20 bg-gold/10 py-2 text-center text-sm text-gold-soft">{s("ta_soon")}</div>
      )}

      <header className="sticky top-0 z-10 border-b border-gold/20 bg-ink/70 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5 font-serif text-2xl font-bold tracking-wide text-gold-soft">
            <Emblem className="h-7 w-7" />
            Tharā
          </div>
          <div className="flex items-center gap-3.5">
            <LangToggle value={lang} onChange={(v) => setLang(v as Lang)} options={[{ code: "en", label: "EN" }, { code: "si", label: "සිං" }, { code: "ta", label: "தமிழ்" }]} />
            <Button asChild size="sm" className="hidden sm:inline-flex">
              <a href="/reading">{s("nav_cta")}</a>
            </Button>
            <AuthButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6">
        <section className="pt-16 pb-10 text-center">
          <Emblem className="emblem-spin mx-auto mb-7 h-32 w-32 drop-shadow-[0_0_22px_rgba(232,197,131,0.45)]" big />
          <h1 className="mx-auto max-w-[16ch] bg-gradient-to-b from-white to-gold-soft bg-clip-text font-serif text-[clamp(2.1rem,5.4vw,3.7rem)] font-bold leading-[1.12] text-transparent">
            {s("hero_title")}
          </h1>
          <p className="mx-auto mt-5 max-w-[56ch] text-muted text-[clamp(1rem,2.2vw,1.22rem)]">{s("hero_sub")}</p>
          <div className="mt-8">
            <Button asChild size="default">
              <a href="/reading">{s("hero_cta")}</a>
            </Button>
          </div>
          <div className="mt-5 text-xs uppercase tracking-[1.5px] text-gold/85">{s("hero_trust")}</div>
        </section>

        <section className="py-13 md:py-16">
          <div className="mb-2.5 text-center text-xs uppercase tracking-[3px] text-gold">{s("feat_eyebrow")}</div>
          <h2 className="mb-8 text-center font-serif text-[clamp(1.7rem,4vw,2.6rem)] font-bold text-gold-soft">{s("feat_title")}</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <a key={f.href} href={f.href} className="group">
                <Card className="h-full transition-all group-hover:-translate-y-1 group-hover:border-gold/50 group-hover:bg-white/[0.07]">
                  <f.Icon className="mb-3.5 h-10 w-10 text-gold" strokeWidth={1.5} />
                  {f.tag && (
                    <div className="mb-3 inline-block rounded-md border border-gold/20 px-2 py-0.5 text-[0.68rem] font-bold uppercase tracking-wide text-gold-2">
                      {s(f.tag)}
                    </div>
                  )}
                  <h3 className="mb-1.5 font-serif text-2xl font-semibold text-white">{s(f.t)}</h3>
                  <p className="text-[0.96rem] text-muted">{s(f.d)}</p>
                  <div className="mt-3 flex items-center gap-1 text-sm font-semibold text-gold">
                    {s("open")} <ArrowRight className="h-4 w-4" />
                  </div>
                </Card>
              </a>
            ))}
          </div>
        </section>

        <section className="py-13 md:py-16">
          <div className="mb-2.5 text-center text-xs uppercase tracking-[3px] text-gold">{s("why_eyebrow")}</div>
          <h2 className="mb-8 text-center font-serif text-[clamp(1.7rem,4vw,2.6rem)] font-bold text-gold-soft">{s("why_title")}</h2>
          <div className="mx-auto grid max-w-3xl grid-cols-1 gap-3.5 md:grid-cols-3">
            {["why_1", "why_2", "why_3"].map((k) => (
              <div key={k} className="rounded-2xl border border-gold/15 bg-white/[0.045] p-5 text-center">
                <div className="text-2xl text-gold">✦</div>
                <p className="mt-2 text-muted">{s(k)}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="mt-8 border-t border-gold/20 px-6 py-12 text-center">
        <p className="mx-auto max-w-[60ch] text-[0.82rem] text-muted opacity-80">{s("footer_disclaimer")}</p>
        <p className="mx-auto mt-1.5 max-w-[60ch] text-[0.82rem] text-muted">{s("footer_name_note")}</p>
        <p className="mt-1.5 text-[0.82rem] text-muted">© {new Date().getFullYear()} Tharā</p>
      </footer>
    </div>
  );
}

function Emblem({ className, big = false }: { className?: string; big?: boolean }) {
  if (big) {
    return (
      <svg className={className} viewBox="0 0 200 200" aria-hidden="true">
        <defs>
          <radialGradient id="e" cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor="#f5e7c4" />
            <stop offset="100%" stopColor="#c9962f" />
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="70" fill="none" stroke="url(#e)" strokeWidth="1.3" opacity="0.85" />
        <circle cx="100" cy="100" r="86" fill="none" stroke="url(#e)" strokeWidth="1" opacity="0.4" />
        <g stroke="url(#e)" strokeWidth="1" opacity="0.6">
          <line x1="100" y1="30" x2="100" y2="170" />
          <line x1="30" y1="100" x2="170" y2="100" />
          <line x1="50" y1="50" x2="150" y2="150" />
          <line x1="150" y1="50" x2="50" y2="150" />
        </g>
        <path d="M100 60 L108 92 L140 100 L108 108 L100 140 L92 108 L60 100 L92 92 Z" fill="url(#e)" />
        <g fill="#f5e7c4">
          <circle cx="100" cy="30" r="2.4" /><circle cx="170" cy="100" r="2.4" /><circle cx="100" cy="170" r="2.4" /><circle cx="30" cy="100" r="2.4" />
        </g>
      </svg>
    );
  }
  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <radialGradient id="g" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f5e7c4" />
          <stop offset="100%" stopColor="#c9962f" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="30" fill="none" stroke="url(#g)" strokeWidth="1.4" />
      <circle cx="50" cy="50" r="42" fill="none" stroke="url(#g)" strokeWidth="1" opacity="0.5" />
      <path d="M50 30 L54 46 L70 50 L54 54 L50 70 L46 54 L30 50 L46 46 Z" fill="url(#g)" />
    </svg>
  );
}
