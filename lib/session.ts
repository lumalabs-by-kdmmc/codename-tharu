import { auth } from "@/lib/auth";
import { neon } from "@neondatabase/serverless";

// Resolve the signed-in user's id from the request (validates the Better Auth session).
export async function getUserId(req: Request): Promise<string | null> {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    return (session && (session as any).user?.id) || null;
  } catch {
    return null;
  }
}

// Best-effort: save a reading to the user's history. Never throws.
export async function saveReading(row: {
  userId: string | null;
  kind: string;
  titleEn?: string | null;
  titleSi?: string | null;
  contentEn?: string | null;
  contentSi?: string | null;
  data?: any;
  model?: string | null;
}): Promise<void> {
  try {
    if (!process.env.DATABASE_URL || !row.userId) return;
    const sql = neon(process.env.DATABASE_URL);
    await sql`
      INSERT INTO readings (user_id, kind, title_en, title_si, content_en, content_si, data, model)
      VALUES (${row.userId}, ${row.kind}, ${row.titleEn ?? null}, ${row.titleSi ?? null}, ${row.contentEn ?? null}, ${row.contentSi ?? null}, ${JSON.stringify(row.data ?? {})}::jsonb, ${row.model ?? null})`;
  } catch {
    // best-effort persistence
  }
}
