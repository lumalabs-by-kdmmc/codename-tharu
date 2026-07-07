// Server-side Prokerala Astrology API v2 client (OAuth2 client credentials).
// Reads PROKERALA_CLIENT_ID / PROKERALA_CLIENT_SECRET from the environment.

const BASE = "https://api.prokerala.com";

let _token = null;
let _exp = 0;

async function getToken() {
  const now = Date.now();
  if (_token && now < _exp) return _token;
  const id = process.env.PROKERALA_CLIENT_ID;
  const secret = process.env.PROKERALA_CLIENT_SECRET;
  if (!id || !secret) {
    const err: any = new Error("Prokerala credentials are not configured");
    err.code = "NO_PROKERALA_CREDS";
    throw err;
  }
  const body = new URLSearchParams({ grant_type: "client_credentials", client_id: id, client_secret: secret });
  const r = await fetch(BASE + "/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!r.ok) throw new Error("Prokerala token request failed: " + r.status);
  const j = await r.json();
  _token = j.access_token;
  _exp = now + ((j.expires_in || 3600) * 1000) - 60000;
  return _token;
}

async function apiGet(path, params) {
  const token = await getToken();
  const qs = new URLSearchParams(params);
  const r = await fetch(BASE + path + "?" + qs.toString(), {
    headers: { Authorization: "Bearer " + token },
  });
  if (!r.ok) {
    const text = await r.text().catch(() => "");
    throw new Error("Prokerala " + path + " failed: " + r.status + " " + text.slice(0, 300));
  }
  return r.json();
}

export function getKundliAdvanced({ datetime, coordinates, ayanamsa = 1, la = "en" }) {
  return apiGet("/v2/astrology/kundli/advanced", { ayanamsa: String(ayanamsa), coordinates, datetime, la });
}

export function getKundliMatching({ girl_dob, girl_coordinates, boy_dob, boy_coordinates, ayanamsa = 1, la = "en" }) {
  return apiGet("/v2/astrology/kundli-matching", {
    ayanamsa: String(ayanamsa), girl_coordinates, girl_dob, boy_coordinates, boy_dob, la,
  });
}

export function getAuspiciousPeriod({ datetime, coordinates, ayanamsa = 1, la = "en" }) {
  return apiGet("/v2/astrology/auspicious-period", { ayanamsa: String(ayanamsa), coordinates, datetime, la });
}

export function getPanchang({ datetime, coordinates, ayanamsa = 1, la = "en" }) {
  return apiGet("/v2/astrology/panchang", { ayanamsa: String(ayanamsa), coordinates, datetime, la });
}
