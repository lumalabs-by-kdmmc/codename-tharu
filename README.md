# Tharā — AI Vedic astrology for Sri Lanka

A trilingual (Sinhala / English, Tamil coming soon) web app: Vedic astrology, palmistry, porondam, dream meanings and nekath — guided by AI. Built with Next.js (App Router). Data in Neon Postgres; charts via Prokerala; AI via OpenAI.

> "Tharā" is a working name.

## Features (English + Sinhala)
- **`/reading`** — birth chart (handahana) + AI reading, grounded in a real Prokerala chart
- **`/porondam`** — marriage compatibility (Guna Milan) from two charts + AI explanation
- **`/palm`** — palm reading from an uploaded photo (OpenAI vision + photo-quality gate)
- **`/dreams`** — dream interpretation (sihina palapala)
- **`/nekath`** — auspicious periods (muhurat) for a chosen day/place

## Tech
- Next.js 16 (App Router) + React 19, **TypeScript**
- **Tailwind CSS v4** + **shadcn/ui** components (`components/ui`)
- Neon Postgres (`@neondatabase/serverless`)
- Prokerala Astrology API v2 (OAuth2)
- OpenAI (readings, porondam explanation, dreams, palm vision)
- Sinhala terminology glossary (`lib/glossary.ts`) keeps astrology terms correct (e.g. බුධ, not a transliteration of "Mercury")

## Environment variables (set on Vercel)
| Name | Required | Purpose |
|---|---|---|
| `DATABASE_URL` | Yes | Neon **pooled** connection string (project `vedic-astro`) |
| `PROKERALA_CLIENT_ID` | Yes | Prokerala client id (production) |
| `PROKERALA_CLIENT_SECRET` | Yes | Prokerala client secret (production) |
| `OPENAI_API_KEY` | For AI | Powers AI reading, porondam, dreams, palm; without it readings use a template |
| `LLM_MODEL` | Optional | Default `gpt-4o-mini`; set `gpt-4o` for better Sinhala. Palm uses `gpt-4o` (vision) regardless |

## Database (Neon)
- `profiles` — submitted birth details
- `readings` — generated birth-chart readings
- A legacy `waitlist` table from the earlier waitlist phase remains but is no longer used by the app.

## Run locally
```bash
npm install
cp .env.example .env    # fill in the values
npm run dev             # http://localhost:3000
```

## Deploy
Push to GitHub → **Import** on [vercel.com](https://vercel.com) → set the env vars above → **Deploy**. Add a custom domain under the project's **Domains** tab.

## Notes
- Sinhala readings should be spot-checked by a native speaker before wide sharing.
- Next up: user accounts, saved reading history, and payments (PayHere).
