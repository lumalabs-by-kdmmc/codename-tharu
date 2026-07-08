import { getUserId, saveReading } from '../../../lib/session';
import { getKundliAdvanced } from '../../../lib/prokerala';
import { extractFacts, generateReading } from '../../../lib/reading';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

const isDate = (s) => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s);
const isTime = (s) => typeof s === 'string' && /^\d{2}:\d{2}$/.test(s);

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: 'bad_request' }, { status: 400 });
  }

  const { name, date, time, timeKnown, place, lat, lon, lang } = body || {};
  if (!isDate(date)) return Response.json({ ok: false, error: 'invalid_date' }, { status: 400 });
  if (typeof lat !== 'number' || typeof lon !== 'number') {
    return Response.json({ ok: false, error: 'invalid_location' }, { status: 400 });
  }

  const known = !!timeKnown && isTime(time);
  const datetime = `${date}T${known ? time : '12:00'}:00+05:30`;
  const coordinates = `${lat},${lon}`;

  let facts;
  try {
    const kundli = await getKundliAdvanced({ datetime, coordinates, la: 'en' });
    facts = extractFacts(kundli);
  } catch (e) {
    const msg = String((e && e.message) || e);
    const notConfigured = e && e.code === 'NO_PROKERALA_CREDS';
    return Response.json(
      { ok: false, error: notConfigured ? 'not_configured' : 'astrology_failed', detail: msg.slice(0, 200) },
      { status: notConfigured ? 500 : 502 },
    );
  }

  let reading;
  try {
    reading = await generateReading(facts, { name });
  } catch {
    return Response.json({ ok: false, error: 'reading_failed' }, { status: 500 });
  }

  const userId = await getUserId(req);
  await saveReading({
    userId,
    kind: 'birth',
    titleEn: reading.headline_en,
    titleSi: reading.headline_si,
    contentEn: reading.reading_en,
    contentSi: reading.reading_si,
    data: { facts, name: name || null, date, place: place || null },
    model: reading.model,
  });

  return Response.json({ ok: true, facts, reading });
}
