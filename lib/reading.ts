// Extract key facts from a Prokerala kundli/advanced response and turn them into a
// warm, grounded reading (English + Sinhala). Uses the LLM when OPENAI_API_KEY is set,
// otherwise a deterministic template. A Sinhala glossary keeps astrology terms correct.

import { chatJSON, hasLLM } from './llm';
import { siGraha, siRasi } from './glossary';

const RASI_ALIAS = {
  Mesha: "Mesha", Vrishabha: "Vrishabha", Vrushabha: "Vrishabha",
  Mithuna: "Mithuna", Karka: "Karka", Kataka: "Karka", Simha: "Simha",
  Kanya: "Kanya", Tula: "Tula", Thula: "Tula", Vrischika: "Vrischika", Vruschika: "Vrischika",
  Dhanu: "Dhanu", Makara: "Makara", Kumbha: "Kumbha", Meena: "Meena",
};
const DASHA_ALIAS = {
  Sun: "Sun", Ravi: "Sun", Moon: "Moon", Chandra: "Moon", Mars: "Mars", Kuja: "Mars", Mangala: "Mars",
  Mercury: "Mercury", Budha: "Mercury", Jupiter: "Jupiter", Guru: "Jupiter",
  Venus: "Venus", Shukra: "Venus", Saturn: "Saturn", Shani: "Saturn", Rahu: "Rahu", Ketu: "Ketu",
};

const RASI_TRAITS = {
  Mesha: { en: "bold, energetic and pioneering — you lead from the front and thrive on new beginnings", si: "නිර්භීත, ශක්තිමත් හා නායකත්ව ගුණයෙන් යුක්ත — නව ආරම්භ ඔබට ජීවය ගෙන දෙයි" },
  Vrishabha: { en: "steady, patient and grounded — you value comfort, loyalty and lasting security", si: "ස්ථාවර, ඉවසිලිවන්ත හා භූමිගත — සුවපහසුව, විශ්වාසවන්තකම හා ස්ථිර සුරක්ෂිතභාවය ඔබ අගය කරයි" },
  Mithuna: { en: "curious, quick-witted and communicative — your mind is lively and adaptable", si: "කුතුහලයෙන් යුත්, දක්ෂ හා සන්නිවේදනශීලී — ඔබේ මනස ජීවමාන හා අනුවර්තනශීලීයි" },
  Karka: { en: "caring, intuitive and deeply emotional — home and loved ones are your anchor", si: "රැකබලා ගන්නා, අභ්‍යන්තර හැඟීමෙන් යුත් හා හැඟීම්බර — නිවස හා ආදරණීයයන් ඔබේ රුකුලයි" },
  Simha: { en: "warm, confident and generous — you shine naturally and inspire those around you", si: "උණුසුම්, විශ්වාසවන්ත හා ත්‍යාගශීලී — ඔබ ස්වභාවිකව බැබළෙන අතර අවට අයට ආදර්ශයක් වේ" },
  Kanya: { en: "practical, precise and thoughtful — you notice details others miss and quietly improve things", si: "ප්‍රායෝගික, නිරවුල් හා කල්පනාශීලී — අන් අයට මඟහැරෙන කුඩා දේ ඔබ දකින අතර නිහඬව දේවල් වැඩිදියුණු කරයි" },
  Tula: { en: "graceful, fair-minded and relational — you seek balance, beauty and harmony in all things", si: "අලංකාර, සාධාරණ හා සබඳතාවලට ඇල්මක් දක්වන — සියල්ලෙහි සමතුලිතතාව, සුන්දරත්වය හා සමගිය ඔබ සොයයි" },
  Vrischika: { en: "intense, determined and perceptive — you feel deeply and transform through life's challenges", si: "තීව්‍ර, අධිෂ්ඨානශීලී හා තියුණු අවබෝධයෙන් යුත් — ඔබ ගැඹුරින් දැනෙන අතර ජීවිතයේ අභියෝග හරහා පරිවර්තනය වේ" },
  Dhanu: { en: "optimistic, adventurous and philosophical — you love freedom, truth and far horizons", si: "ශුභවාදී, වික්‍රමාන්විත හා දාර්ශනික — නිදහස, සත්‍යය හා දුර ක්ෂිතිජ ඔබ ප්‍රිය කරයි" },
  Makara: { en: "disciplined, ambitious and enduring — you build steadily and achieve through patience", si: "විනයගරුක, අභිලාෂකාමී හා ඔරොත්තු දෙන — ඔබ සෙමින් ගොඩනඟන අතර ඉවසීමෙන් සාර්ථකත්වය ලබයි" },
  Kumbha: { en: "independent, original and humane — you think ahead of your time and value community", si: "ස්වාධීන, නව්‍ය හා මානුෂීය — ඔබ ඔබේ කාලයට වඩා ඉදිරියෙන් සිතන අතර ප්‍රජාව අගය කරයි" },
  Meena: { en: "compassionate, imaginative and spiritual — you feel the world deeply and dream vividly", si: "කරුණාවන්ත, පරිකල්පනශීලී හා අධ්‍යාත්මික — ඔබ ලෝකය ගැඹුරින් දැනෙන අතර විචිත්‍රව සිහින දකියි" },
};
const DASHA_LORD = {
  Sun: { en: "a period of visibility, leadership and self-confidence", si: "දෘශ්‍යතාව, නායකත්වය හා ආත්ම විශ්වාසයේ කාලයකි" },
  Moon: { en: "an emotionally rich, nurturing phase — good for family and inner growth", si: "හැඟීම්බර, පෝෂණීය අවධියකි — පවුල හා අභ්‍යන්තර වර්ධනයට සුබයි" },
  Mars: { en: "a phase of drive, courage and action", si: "ධෛර්යය, නිර්භීතකම හා ක්‍රියාවේ අවධියකි" },
  Mercury: { en: "a sharp, communicative period — favourable for learning and business", si: "තියුණු, සන්නිවේදනශීලී කාලයකි — ඉගෙනීම හා ව්‍යාපාරවලට හිතකරයි" },
  Jupiter: { en: "a fortunate, expansive period — growth, wisdom and good opportunities", si: "වාසනාවන්ත, පුළුල් වන කාලයකි — වර්ධනය, ප්‍රඥාව හා හොඳ අවස්ථා" },
  Venus: { en: "a period of love, comfort and creativity", si: "ආදරය, සුවපහසුව හා නිර්මාණශීලීත්වයේ කාලයකි" },
  Saturn: { en: "a period of discipline and hard-earned, lasting reward", si: "විනය හා මහන්සියෙන් උපයන ස්ථිර ප්‍රතිඵලවල කාලයකි" },
  Rahu: { en: "an ambitious, unconventional phase — big desires and sudden change", si: "අභිලාෂකාමී, අසාමාන්‍ය අවධියකි — විශාල ආශාවන් හා හදිසි වෙනස්කම්" },
  Ketu: { en: "a reflective, spiritual phase — a time to look inward", si: "මෙනෙහි කිරීමේ, අධ්‍යාත්මික අවධියකි — ඇතුළට බැලීමට කාලයයි" },
};

const canonRasi = (n) => (n ? RASI_ALIAS[n] || n : null);
const canonDasha = (n) => (n ? DASHA_ALIAS[n] || n : null);

function currentDasha(periods) {
  if (!Array.isArray(periods) || periods.length === 0) return null;
  const now = Date.now();
  for (const p of periods) {
    const s = Date.parse(p.start), e = Date.parse(p.end);
    if (!isNaN(s) && !isNaN(e) && s <= now && now < e) return p.name || p.lord || null;
  }
  return periods[0].name || periods[0].lord || null;
}

export function extractFacts(kundli) {
  const d = (kundli && kundli.data) || {};
  const nd = d.nakshatra_details || {};
  const nak = nd.nakshatra || {};
  return {
    nakshatra: nak.name || null,
    nakshatra_pada: nak.pada || null,
    moon_rasi: (nd.chandra_rasi || {}).name || null,
    sun_rasi: (nd.soorya_rasi || {}).name || null,
    zodiac: (nd.zodiac || {}).name || null,
    dasha_current: currentDasha(d.dasha_periods),
  };
}

function templateReading(facts, name) {
  const trait = RASI_TRAITS[canonRasi(facts.moon_rasi)];
  const dasha = DASHA_LORD[canonDasha(facts.dasha_current)];
  const who = name || null;
  const moonSi = siRasi(facts.moon_rasi), sunSi = siRasi(facts.sun_rasi), dashaSi = siGraha(facts.dasha_current);
  const nakEn = facts.nakshatra ? `${facts.nakshatra}${facts.nakshatra_pada ? ` (pada ${facts.nakshatra_pada})` : ""}` : "your birth star";

  const en = [
    `${who ? who + ", your" : "Your"} birth star is ${nakEn}, with the Moon in ${facts.moon_rasi || "your moon sign"} and the Sun in ${facts.sun_rasi || "your sun sign"}.`,
    trait ? `With the Moon in ${facts.moon_rasi}, you are ${trait.en}.` : "",
    dasha ? `Right now you are moving through your ${facts.dasha_current} main period — ${dasha.en}.` : "",
    `Let the stars guide you rather than decide for you — your effort and kindness shape what comes next.`,
  ].filter(Boolean).join(" ");

  const si = [
    `${who ? who + ", ඔබේ" : "ඔබේ"} උපන් නැකත ${facts.nakshatra || "නැකත"}${facts.nakshatra_pada ? ` (${facts.nakshatra_pada} පාදය)` : ""} වන අතර, චන්ද්‍රයා ${moonSi || "ඔබේ රාශිය"} හි සහ රවි ${sunSi || "ඔබේ රාශිය"} හි පිහිටා ඇත.`,
    trait ? `චන්ද්‍රයා ${moonSi} හි පිහිටීමෙන්, ඔබ ${trait.si}.` : "",
    dasha ? `දැනට ඔබ ${dashaSi} මහා දශාව හරහා ගමන් කරයි — ${dasha.si}.` : "",
    `ග්‍රහයන්ට ඔබ වෙනුවෙන් තීරණය කිරීමට ඉඩ නොදී, ඔවුන්ගෙන් මඟපෙන්වීම ලබාගන්න — ඉදිරියට වන දේ හැඩගස්වන්නේ ඔබේ උත්සාහය හා කරුණාවයි.`,
  ].filter(Boolean).join(" ");

  return {
    source: "template", model: "template-v2",
    headline_en: who ? `${who}, your Moon is in ${facts.moon_rasi || "your sign"}` : `Your Moon is in ${facts.moon_rasi || "your sign"}`,
    headline_si: `ඔබේ චන්ද්‍ර රාශිය ${moonSi || ""}`.trim(),
    reading_en: en, reading_si: si,
  };
}

export async function generateReading(facts: any, { name }: { name?: string } = {}) {
  if (hasLLM()) {
    try {
      const glossary = {
        moon_rasi_si: siRasi(facts.moon_rasi),
        sun_rasi_si: siRasi(facts.sun_rasi),
        dasha_current_si: siGraha(facts.dasha_current),
      };
      const sys = [
        "You are a warm, respectful Sri Lankan Vedic (Jyotish) astrologer writing for a general audience.",
        "Ground the reading STRICTLY in the chart facts provided — never invent planets, houses or dates.",
        "Tone: warm, hopeful, empowering; never fatalistic or frightening. It is guidance and reflection, not certainty.",
        "Do NOT give medical, legal or financial advice.",
        "In the SINHALA text, use proper Sinhala Jyotish terms and NEVER transliterate English planet/sign names.",
        "Use exactly these Sinhala terms for this chart: moon sign = " + glossary.moon_rasi_si + ", sun sign = " + glossary.sun_rasi_si + ", current dasha lord = " + glossary.dasha_current_si + ".",
        "Return STRICT JSON: headline_en, reading_en, headline_si, reading_si. Each reading ~110-150 words. The Sinhala must read as natural, fluent Sinhala.",
      ].join(" ");
      const user = "Chart facts (JSON): " + JSON.stringify({ name: name || null, ...facts, ...glossary });
      const out = await chatJSON([{ role: "system", content: sys }, { role: "user", content: user }]);
      if (out && (out.reading_en || out.reading_si)) {
        return {
          source: "ai", model: process.env.LLM_MODEL || "gpt-4o-mini",
          headline_en: out.headline_en || "", reading_en: out.reading_en || "",
          headline_si: out.headline_si || "", reading_si: out.reading_si || "",
        };
      }
    } catch (e) {
      // fall through to template
    }
  }
  return templateReading(facts, name);
}
