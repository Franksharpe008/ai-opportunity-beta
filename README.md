# AI Opportunity Report Engine (Beta)

Reusable, approval-gated workflow for generating and delivering company opportunity presentations.

Core principle: `Trust -> Verify -> Execute`

## What this project does

1. Generates company analysis and assets (report, Stable Horde hero image, vocal jingle, narration)
2. Builds a premium interactive presentation (splash intro, jingle, narration, auto-scroll)
3. Stores versioned run artifacts under `data/runs/*`
4. Requires explicit approval before deploy/send
5. Deploys to Vercel and sends by email only after approval

## Builder profile policy

The workflow uses a factual profile from:

- `config/builder-profile.json`

Do not add unverified claims. LinkedIn/GitHub URLs remain configurable unless verified.

## Quick start

```bash
cd "/Users/franksharpe/Documents/New project/ai-opportunity-beta"
npm install
cp .env.example .env
npm start
```

Open app runner: <http://localhost:8790>

## Workflow CLI

Use the new CLI through npm:

```bash
npm run workflow -- generate "Easy Pay Direct" --template fintech
npm run workflow -- preview easy-pay-direct
npm run workflow -- approve easy-pay-direct
npm run workflow -- deploy easy-pay-direct
npm run workflow -- send easy-pay-direct --to franksharpe008@gmail.com
npm run workflow -- report easy-pay-direct
npm run workflow -- list
```

Commands are gated:

- `deploy` fails unless run is approved
- `send` fails unless run is approved and deployed

## Templates

Template definitions live in:

- `config/workflow-templates.json`

Current template keys:

- `fintech`
- `barbershop`
- `local-business`
- `saas`
- `restaurant`
- `creative-music`

## Pinned jingle mode

To keep the same approved high-energy track across runs:

```env
USE_PINNED_JINGLE=1
PINNED_JINGLE_FILE=/absolute/path/to/approved-jingle.mp3
```

When enabled, pipeline jingle generation is skipped and the pinned track is used.

## Environment keys

Required:

- `STABLE_HORDE_API_KEY`
- `SONAUTO_API_KEY`

Common:

- `VERCEL_PROJECT`
- `SEND_EMAIL_SCRIPT`
- `SUPERTONIC_*`
- `TTS_ENGINE`
- `BUILDER_EXPERIENCE`

## Artifact layout

Generated assets (pipeline-level):

- `data/generated/*`

Versioned workflow runs:

```text
data/runs/<run-folder>/
  manifest.json
  analysis.json
  assets/
  presentation/
```

Each `manifest.json` records:

- company
- template
- provider choices
- approval state
- deploy URL
- send status
- artifact paths
