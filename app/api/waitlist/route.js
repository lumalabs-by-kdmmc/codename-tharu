import { neon } from '@neondatabase/serverless';

// Always run on the server at request time.
export const dynamic = 'force-dynamic';

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch (_) {
    return Response.json({ ok: false, error: 'bad_request' }, { status: 400 });
  }

  const { name, email, phone, language, interest, user_agent } = body || {};

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return Response.json({ ok: false, error: 'invalid_email' }, { status: 400 });
  }

  if (!process.env.DATABASE_URL) {
    return Response.json({ ok: false, error: 'not_configured' }, { status: 500 });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);
    try {
      await sql`
        INSERT INTO waitlist (email, phone, name, language, interest, source, user_agent)
        VALUES (${email.trim().toLowerCase()}, ${phone || null}, ${name || null}, ${language || null}, ${interest || null}, 'landing', ${user_agent || null})
      `;
    } catch (e) {
      // Duplicate email (unique index) -> already on the list, treat as success.
      const msg = String((e && e.message) || '');
      if ((e && e.code === '23505') || msg.includes('duplicate') || msg.includes('unique')) {
        return Response.json({ ok: true, already: true });
      }
      throw e;
    }
    return Response.json({ ok: true });
  } catch (e) {
    console.error('waitlist insert failed:', e);
    return Response.json({ ok: false, error: 'server_error' }, { status: 500 });
  }
}
