// Sinhala Jyotish terminology glossary — maps the English/Sanskrit names Prokerala
// returns to their proper Sinhala terms, so the LLM (and templates) never transliterate
// e.g. "Mercury" -> "බුධ" (not "මර්කියුරි"), "Tula" -> "තුලා".

export const GRAHA_SI = {
  Sun: "රවි", Moon: "චන්ද්‍ර", Mars: "කුජ", Mercury: "බුධ", Jupiter: "ගුරු",
  Venus: "ශුක්‍ර", Saturn: "ශනි", Rahu: "රාහු", Ketu: "කේතු",
};

export const RASI_SI = {
  Mesha: "මේෂ", Vrishabha: "වෘෂභ", Vrushabha: "වෘෂභ", Mithuna: "මිථුන",
  Karka: "කටක", Kataka: "කටක", Simha: "සිංහ", Kanya: "කන්‍යා", Tula: "තුලා", Thula: "තුලා",
  Vrischika: "වෘශ්චික", Vruschika: "වෘශ්චික", Dhanu: "ධනු", Makara: "මකර",
  Kumbha: "කුම්භ", Meena: "මීන",
};

export const siGraha = (n) => (n && GRAHA_SI[n]) || n || null;
export const siRasi = (n) => (n && RASI_SI[n]) || n || null;
