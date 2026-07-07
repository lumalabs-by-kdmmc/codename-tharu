import { visionJSON, hasLLM } from '../../../lib/llm';

export const dynamic = 'force-dynamic';
export const maxDuration = 45;

export async function POST(req) {
  let b;
  try { b = await req.json(); } catch { return Response.json({ ok: false, error: 'bad_request' }, { status: 400 }); }
  const { image } = b || {};
  if (!image || typeof image !== 'string' || !image.startsWith('data:image')) {
    return Response.json({ ok: false, error: 'invalid_image' }, { status: 400 });
  }
  if (!hasLLM()) return Response.json({ ok: false, error: 'not_configured' }, { status: 503 });

  try {
    const prompt = [
      "You are a friendly palmistry entertainer for a Sri Lankan audience.",
      "First decide if the image clearly shows a human palm with visible lines, reasonably lit and in focus.",
      "Return STRICT JSON with keys: is_palm (boolean), quality_ok (boolean), retake_en, retake_si, headline_en, reading_en, headline_si, reading_si.",
      "If it is NOT a clear palm, set is_palm/quality_ok=false, put a short friendly retake tip in retake_en and retake_si, and leave the reading fields as empty strings.",
      "If it IS a clear palm, give a fun, warm reading of the major lines (heart, head, life) and hand shape — headline + ~110-150 words in English (reading_en) and natural fluent Sinhala (reading_si).",
      "Frame everything as light entertainment and self-reflection, NOT prediction, and never medical, legal or financial advice.",
    ].join(" ");
    const out = await visionJSON(prompt, image);
    return Response.json({ ok: true, out });
  } catch (e) {
    return Response.json({ ok: false, error: 'reading_failed', detail: String((e && e.message) || e).slice(0, 160) }, { status: 500 });
  }
}
