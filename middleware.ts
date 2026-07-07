import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Protects the AI endpoints: an anonymous request (no session cookie) is rejected
// with 401 before it can spend OpenAI / Prokerala credits. The route handlers can
// still re-validate the session against the DB when they need the user.
export function middleware(req: NextRequest) {
  const cookie = getSessionCookie(req);
  if (!cookie) {
    return NextResponse.json({ ok: false, error: "auth_required" }, { status: 401 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/reading", "/api/porondam", "/api/palm", "/api/dreams", "/api/nekath"],
};
