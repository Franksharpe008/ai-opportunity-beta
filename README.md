# AI Opportunity Beta

Interactive local beta for a hiring-company presentation pipeline:

1. Verify tools (Stable Horde, Sonauto, Brevo, TTS, GitHub, Vercel)
2. Generate report, hero image, jingle, and narration
3. Run splash + auto-scroll presentation
4. Send delivery email through Brevo

## Quick start

```bash
cd "/Users/franksharpe/Documents/New project/ai-opportunity-beta"
npm install
cp .env.example .env
npm start
```

Open: <http://localhost:8790>

## Required keys

Set in `.env`:

- `STABLE_HORDE_API_KEY`
- `SONAUTO_API_KEY`

Brevo send uses your existing script path (`SEND_EMAIL_SCRIPT`) and OpenClaw-backed credentials when available.

## Notes

- Narration engine uses local Supertonic voice stack.
- Sonauto jingle has automatic local tone fallback if generation fails.
- Assets are saved under `data/generated/` and exposed at `/generated/*`.
