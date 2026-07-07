import { getAuspiciousPeriod } from '../../../lib/prokerala';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

const isDate = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s || '');

export async function POST(req) {
  let b;
  try { b = await req.json(); } catch { return Response.json({ ok: false, error: 'bad_request' }, { status: 400 }); }
  const { date, lat, lon } = b || {};
  if (!isDate(date)) return Response.json({ ok: false, error: 'invalid_date' }, { status: 400 });
  if (typeof lat !== 'number' || typeof lon !== 'number') return Response.json({ ok: false, error: 'invalid_location' }, { status: 400 });

  try {
    const res = await getAuspiciousPeriod({ datetime: `${date}T06:00:00+05:30`, coordinates: `${lat},${lon}`, la: 'en' });
    const muhurat = (res.data || {}).muhurat || [];
    return Response.json({ ok: true, muhurat });
  } catch (e) {
    const nc = e && e.code === 'NO_PROKERALA_CREDS';
    return Response.json({ ok: false, error: nc ? 'not_configured' : 'astrology_failed', detail: String((e && e.message) || e).slice(0, 200) }, { status: nc ? 500 : 502 });
  }
}
