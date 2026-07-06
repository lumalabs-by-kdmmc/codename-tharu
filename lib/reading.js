// Extract key facts from a Prokerala kundli/advanced response and turn them into a
// warm, grounded reading. Uses an LLM when OPENAI_API_KEY is set; otherwise a
// deterministic template built from the real chart facts. Output is English + Sinhala.

const RASI_ALIAS = {
  Mesha: "Mesha", Vrishabha: "Vrishabha", Vrushabha: "Vrishabha", Vrisabha: "Vrishabha",
  Mithuna: "Mithuna", Mithun: "Mithuna", Karka: "Karka", Kataka: "Karka",
  Simha: "Simha", Sinha: "Simha", Kanya: "Kanya", Tula: "Tula", Thula: "Tula",
  Vrischika: "Vrischika", Vruschika: "Vrischika", Vrishchika: "Vrischika",
  Dhanu: "Dhanu", Dhanus: "Dhanu", Makara: "Makara", Makar: "Makara",
  Kumbha: "Kumbha", Kumbh: "Kumbha", Meena: "Meena", Meen: "Meena",
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

const DASHA_ALIAS = {
  Sun: "Sun", Ravi: "Sun", Surya: "Sun", Moon: "Moon", Chandra: "Moon",
  Mars: "Mars", Kuja: "Mars", Mangala: "Mars", Mangal: "Mars",
  Mercury: "Mercury", Budha: "Mercury", Jupiter: "Jupiter", Guru: "Jupiter", Brihaspati: "Jupiter",
  Venus: "Venus", Shukra: "Venus", Sukra: "Venus", Saturn: "Saturn", Shani: "Saturn", Sani: "Saturn",
  Rahu: "Rahu", Ketu: "Ketu",
};

const DASHA_LORD = {
  Sun: { en: "a period of visibility, leadership and self-confidence — a time to step into your own authority", si: "දෘශ්‍යතාව, නායකත්වය හා ආත්ම විශ්වාසයේ කාලයකි — ඔබේම බලයට පිවිසීමට කාලයයි" },
  Moon: { en: "an emotionally rich, nurturing phase — good for family, care and inner growth", si: "හැඟීම්බර, පෝෂණීය අවධියකි — පවුල, රැකවරණය හා අභ්‍යන්තර වර්ධනයට සුබයි" },
  Mars: { en: "a phase of drive, courage and action — channel your energy into focused effort", si: "ධෛර්යය, නිර්භීතකම හා ක්‍රියාවේ අවධියකි — ඔබේ ශක්තිය නිශ්චිත උත්සාහයකට යොමු කරන්න" },
  Mercury: { en: "a sharp, communicative period — favourable for learning, business and clever ideas", si: "තියුණු, සන්නිවේදනශීලී කාලයකි — ඉගෙනීම, ව්‍යාපාර හා දක්ෂ අදහස්වලට හිතකරයි" },
  Jupiter: { en: "a fortunate, expansive period — growth, wisdom, mentors and good opportunities tend to arrive", si: "වාසනාවන්ත, පුළුල් වන කාලයකි — වර්ධනය, ප්‍රඥාව, ගුරුවරු හා හොඳ අවස්ථා පැමිණේ" },
  Venus: { en: "a period of love, comfort and creativity — relationships and the finer things flourish", si: "ආදරය, සුවපහසුව හා නිර්මාණශීලීත්වයේ කාලයකි — සබඳතා හා ජීවිතයේ මිහිරි දේ දියුණු වේ" },
  Saturn: { en: "a period of discipline and hard-earned reward — patience now builds foundations that last", si: "විනය හා මහන්සියෙන් උපයන ප්‍රතිඵලවල කාලයකි — දැන් දක්වන ඉවසීම ස්ථිර අත්තිවාරම් ගොඩනඟයි" },
  Rahu: { en: "an ambitious, unconventional phase — big desires and sudden changes; stay grounded", si: "අභිලාෂකාමී, අසාමාන්‍ය අවධියකි — විශාල ආශාවන් හා හදිසි වෙනස්කම්; භූමිගතව සිටින්න" },
  Ketu: { en: "a reflective, spiritual phase — a time to let go, look inward and seek deeper meaning", si: "මෙනෙහි කිරීමේ, අධ්‍යාත්මික අවධියකි — අත්හැරීමට, ඇතුළට බැලීමට හා ගැඹුරු අර්ථයක් සෙවීමට කාලයයි" },
};

function canonRasi(name) { return name ? (RASI_ALIAS[name] || name) : null; }
function canonDasha(name) { return name ? (DASHA_ALIAS[name] || name) : null; }

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
  const rk = canonRasi(facts.moon_rasi);
  const dk = canonDasha(facts.dasha_current);
  const trait = (rk && RASI_TRAITS[rk]) || null;
  const dasha = (dk && DASHA_LORD[dk]) || null;
  const who = name ? name : null;

  const nakEn = facts.nakshatra ? `${facts.nakshatra}${facts.nakshatra_pada ? ` (pada ${facts.nakshatra_pada})` : ""}` : "your birth star";
  const enParts = [];
  enParts.push(`${who ? who + ", your" : "Your"} birth star is ${nakEn}, with the Moon in ${facts.moon_rasi || "your moon sign"} and the Sun in ${facts.sun_rasi || "your sun sign"}.`);
  if (trait) enParts.push(`With the Moon in ${facts.moon_rasi}, you are ${trait.en}.`);
  if (dasha) enParts.push(`Right now you are moving through your ${facts.dasha_current} main period — ${dasha.en}.`);
  enParts.push(`Let the stars guide you rather than decide for you — your effort and kindness shape what comes next.`);

  const nakSi = facts.nakshatra ? `${facts.nakshatra}${facts.nakshatra_pada ? ` (${facts.nakshatra_pada} පාදය)` : ""}` : "ඔබේ නැකත";
  const siParts = [];
  siParts.push(`${who ? who + ", ඔබේ" : "ඔබේ"} උපන් නැකත ${nakSi} වන අතර, චන්ද්‍රයා ${facts.moon_rasi || "ඔබේ රාශිය"} හි සහ රවි ${facts.sun_rasi || "ඔබේ රාශිය"} හි පිහිටා ඇත.`);
  if (trait) siParts.push(`චන්ද්‍රයා ${facts.moon_rasi} හි පිහිටීමෙන්, ඔබ ${trait.si}.`);
  if (dasha) siParts.push(`දැනට ඔබ ${facts.dasha_current} මහා දශාව හරහා ගමන් කරයි — ${dasha.si}.`);
  siParts.push(`ග්‍රහයන්ට ඔබ වෙනුවෙන් තීරණය කිරීමට ඉඩ නොදී, ඔවුන්ගෙන් මඟපෙන්වීම ලබාගන්න — ඉදිරියට වන දේ හැඩගස්වන්නේ ඔබේ උත්සාහය හා කරුණාවයි.`);

  return {
    source: "template",
    model: "template-v1",
    headline_en: who ? `${who}, your Moon is in ${facts.moon_rasi || "your sign"}` : `Your Moon is in ${facts.moon_rasi || "your sign"}`,
    headline_si: `ඔබේ චන්ද්‍ර රාශිය ${facts.moon_rasi || ""}`.trim(),
    reading_en: enParts.join(" "),
    reading_si: siParts.join(" "),
  };
}

async function llmReading(facts, name, key) {
  const model = process.env.LLM_MODEL || "gpt-4o-mini";
  const sys = [
    "You are a warm, respectful Sri Lankan Vedic (Jyotish) astrologer writing for a general audience.",
    "Write a personal reading grounded STRICTLY in the chart facts provided — do not invent planets, houses or dates.",
    "Tone: warm, hopeful, empowering; never fatalistic or frightening. Frame it as guidance and reflection, not certainty.",
    "Do NOT give medical, legal or financial advice.",
    "Return STRICT JSON with keys: headline_en, reading_en, headline_si, reading_si.",
    "Each reading ~110-150 words. The Sinhala must be natural, fluent Sinhala (not a literal translation).",
  ].join(" ");
  const user = "Chart facts (JSON): " + JSON.stringify({ name: name || null, ...facts });
  const r = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "Bearer " + key },
    body: JSON.stringify({
      model,
      messages: [{ role: "system", content: sys }, { role: "user", content: user }],
      response_format: { type: "json_object" },
      temperature: 0.7,
    }),
  });
  if (!r.ok) throw new Error("LLM request failed: " + r.status);
  const j = await r.json();
  const content = j.choices?.[0]?.message?.content || "{}";
  const parsed = JSON.parse(content);
  return {
    source: "ai",
    model,
    headline_en: parsed.headline_en || "",
    reading_en: parsed.reading_en || "",
    headline_si: parsed.headline_si || "",
    reading_si: parsed.reading_si || "",
  };
}

export async function generateReading(facts, { name } = {}) {
  const key = process.env.OPENAI_API_KEY;
  if (key) {
    try {
      const out = await llmReading(facts, name, key);
      if (out.reading_en || out.reading_si) return out;
    } catch (e) {
      // fall back to template on any LLM error
    }
  }
  return templateReading(facts, name);
}
