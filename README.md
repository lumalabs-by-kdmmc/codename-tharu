# Tharā — Waitlist Landing (Phase 0)

A trilingual (Sinhala / English, Tamil coming soon) landing page and waitlist for **Tharā** — an AI-powered Vedic astrology, palmistry, and dream-reading platform for Sri Lanka. Built with Next.js (App Router). Waitlist signups are stored in Neon Postgres.

> "Tharā" is a working name.

## Tech
- Next.js 14 (App Router, JavaScript)
- `@neondatabase/serverless` (HTTP driver — works on Vercel serverless)
- No build step for styling: plain CSS in `app/globals.css`

## Project structure
```
app/
  layout.js            # <html>, fonts, metadata
  globals.css          # all styles (celestial theme)
  page.js              # the landing page + language toggle + waitlist form
  api/waitlist/route.js# POST endpoint -> inserts a signup into Neon
```

## The database
The `waitlist` table already exists in the Neon project **vedic-astro**:
```sql
CREATE TABLE waitlist (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email text, phone text, name text, language text, interest text,
  source text DEFAULT 'landing', user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);
-- unique index on lower(email)
```

## Environment variable
The app needs one env var:

| Name | Value |
|---|---|
| `DATABASE_URL` | The **pooled** Neon connection string for the `vedic-astro` project |

Copy it from the Neon console → project **vedic-astro** → **Connection string** (choose the pooled option). Locally, put it in a `.env` file (see `.env.example`). Never commit `.env`.

## Run locally
```bash
npm install
cp .env.example .env    # then paste your DATABASE_URL
npm run dev             # http://localhost:3000
```

## Deploy on Vercel
1. Push this repo to GitHub.
2. On [vercel.com](https://vercel.com): **Add New → Project → Import** this repository.
3. Framework preset auto-detects **Next.js** — leave defaults.
4. Under **Environment Variables**, add `DATABASE_URL` (paste the pooled Neon connection string).
5. **Deploy.** You'll get a `*.vercel.app` URL. Add a custom domain later under the project's **Domains** tab.

## Phase 1: birth-chart reading (`/reading`)
Collects birth details and returns a personal Vedic reading (English + Sinhala), grounded in a real Prokerala chart. Saves to the Neon `profiles` and `readings` tables.

### Additional environment variables
| Name | Required | Purpose |
|---|---|---|
| `PROKERALA_CLIENT_ID` | Yes (for /reading) | Prokerala API client id (production) |
| `PROKERALA_CLIENT_SECRET` | Yes (for /reading) | Prokerala API client secret (production) |
| `OPENAI_API_KEY` | Optional | Enables AI-written readings; without it, a grounded template is used |
| `LLM_MODEL` | Optional | OpenAI model (default `gpt-4o-mini`) |

## Notes
- Porondam, palm reading, dream and nekath features come next.
- Sinhala copy should be reviewed by a native speaker before wide sharing.
