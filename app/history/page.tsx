import { headers } from "next/headers";
import { neon } from "@neondatabase/serverless";
import { auth } from "@/lib/auth";
import { HistoryList } from "@/components/history-list";
import { AuthButton } from "@/components/auth-button";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const session = (await auth.api.getSession({ headers: await headers() })) as any;
  const user = session && session.user;

  let rows: any[] = [];
  if (user && process.env.DATABASE_URL) {
    try {
      const sql = neon(process.env.DATABASE_URL);
      rows = (await sql`
        SELECT id, kind, title_en, title_si, content_en, content_si, created_at
        FROM readings
        WHERE user_id = ${user.id} AND (content_en IS NOT NULL OR content_si IS NOT NULL)
        ORDER BY created_at DESC
        LIMIT 100`) as any[];
    } catch {
      rows = [];
    }
  }

  return (
    <div className="mx-auto max-w-[680px] px-6 pb-20 pt-9">
      <div className="mb-6 flex items-center justify-between">
        <a href="/" className="text-sm text-muted no-underline hover:text-gold-soft">← Back</a>
        <AuthButton />
      </div>
      <h1 className="mb-6 font-serif text-[clamp(1.7rem,4vw,2.4rem)] font-bold text-gold-soft">My readings</h1>
      {!user ? (
        <div className="rounded-2xl border border-gold/15 bg-white/[0.045] p-8 text-center">
          <p className="mb-4 text-muted">Sign in to see your saved readings.</p>
          <div className="flex justify-center">
            <AuthButton label="Sign in with Google" />
          </div>
        </div>
      ) : (
        <HistoryList rows={rows} />
      )}
    </div>
  );
}
