import { getKundliMatching } from '../../../lib/prokerala';
import { chatJSON, hasLLM } from '../../../lib/llm';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

const isDate = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s || '');
const isTime = (s) => /^\d{2}:\d{2}$/.test(s || '');
const dt = (date, time, known) => `${date}T${known && isTime(time) ? time : '12:00'}:00+05:30`;

export async function POST(req) {
  let b;
  try { b = await req.json(); } catch { return Response.json({ ok: false, error: 'bad_request' }, { status: 400 }); }
  const { girl, boy } = b || {};
  if (!girl || !boy || !isDate(girl.date) || !isDate(boy.date)) return Response.json({ ok: false, error: 'invalid_input' }, { status: 400 });
  if (typeof girl.lat !== 'number' || typeof boy.lat !== 'number') return Response.json({ ok: false, error: 'invalid_location' }, { status: 400 });

  let data;
  try {
    const res = await getKundliMatching({
      girl_dob: dt(girl.date, girl.time, girl.timeKnown), girl_coordinates: `${girl.lat},${girl.lon}`,
      boy_dob: dt(boy.date, boy.time, boy.timeKnown), boy_coordinates: `${boy.lat},${boy.lon}`, la: 'en',
    });
    data = res.data || {};
  } catch (e) {
    const nc = e && e.code === 'NO_PROKERALA_CREDS';
    return Response.json({ ok: false, error: nc ? 'not_configured' : 'astrology_failed', detail: String((e && e.message) || e).slice(0, 200) }, { status: nc ? 500 : 502 });
  }

  const gm = data.guna_milan || {};
  const msg = data.message || {};
  const facts = {
    total: gm.total_points, max: gm.maximum_points,
    verdict: msg.description, type: msg.type,
    girlNakshatra: (data.girl_info || {}).nakshatra && data.girl_info.nakshatra.name,
    boyNakshatra: (data.boy_info || {}).nakshatra && data.boy_info.nakshatra.name,
  };

  let interp = null;
  if (hasLLM()) {
    try {
      const sys = "You are a warm Sri Lankan astrologer explaining a porondam (marriage compatibility) result. Be balanced and kind — compatibility is guidance, not a judgement on the people, and never deterministic. Do not give medical/legal/financial advice. Return STRICT JSON: headline_en, verdict_en, headline_si, verdict_si. Each ~70-110 words. The Sinhala must be natural, fluent Sinhala using proper Sinhala terms.";
      interp = await chatJSON([{ role: 'system', content: sys }, { role: 'user', content: "Porondam result: " + JSON.stringify(facts) }]);
    } catch { /* interpretation optional */ }
  }

  return Response.json({ ok: true, facts, interp });
}
