import { chatJSON, hasLLM } from '../../../lib/llm';
import { getUserId, saveReading } from '../../../lib/session';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export async function POST(req) {
  let b;
  try { b = await req.json(); } catch { return Response.json({ ok: false, error: 'bad_request' }, { status: 400 }); }
  const { dream } = b || {};
  if (!dream || typeof dream !== 'string' || dream.trim().length < 3) {
    return Response.json({ ok: false, error: 'invalid_input' }, { status: 400 });
  }
  if (!hasLLM()) return Response.json({ ok: false, error: 'not_configured' }, { status: 503 });

  try {
    const sys = "You are a thoughtful Sri Lankan dream interpreter (sihina palapala). Interpret the user's dream with cultural sensitivity, warmth and balance — reflective and gentle, never alarming, predictive or fatalistic. Not medical or psychological advice. Return STRICT JSON: headline_en, meaning_en, headline_si, meaning_si. Each ~90-130 words. The Sinhala must be natural, fluent Sinhala.";
    const out = await chatJSON([{ role: 'system', content: sys }, { role: 'user', content: "Dream: " + dream.slice(0, 1500) }]);
    const userId = await getUserId(req);
    await saveReading({ userId, kind: 'dream', titleEn: out.headline_en, titleSi: out.headline_si, contentEn: out.meaning_en, contentSi: out.meaning_si, data: { dream: dream.slice(0, 1500) }, model: process.env.LLM_MODEL || 'gpt-4o-mini' });
    return Response.json({ ok: true, out });
  } catch {
    return Response.json({ ok: false, error: 'reading_failed' }, { status: 500 });
  }
}
