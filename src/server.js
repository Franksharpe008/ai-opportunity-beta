import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFile as _execFile } from "node:child_process";
import { promisify } from "node:util";
import dotenv from "dotenv";
import express from "express";

dotenv.config();

const execFile = promisify(_execFile);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const PUBLIC_DIR = path.join(ROOT, "public");
const GENERATED_DIR = path.join(ROOT, "data", "generated");

const PORT = Number(process.env.PORT || 8790);
const APP_URL = process.env.APP_URL || `http://localhost:${PORT}`;
const DEFAULT_COMPANY = process.env.DEFAULT_COMPANY || "Easy Pay Direct";
const DEFAULT_RECIPIENT = process.env.DEFAULT_RECIPIENT || "";

const STABLE_HORDE_API_KEY = process.env.STABLE_HORDE_API_KEY || "";
const SONAUTO_API_KEY = process.env.SONAUTO_API_KEY || "";

const SUPERTONIC_BIN = process.env.SUPERTONIC_BIN || "/Users/franksharpe/clawd/discord-voice-assistant/.venv312/bin/supertonic";
const SUPERTONIC_MODEL = process.env.SUPERTONIC_MODEL || "supertonic-2";
const SUPERTONIC_VOICE = process.env.SUPERTONIC_VOICE || "M2";
const SUPERTONIC_LANG = process.env.SUPERTONIC_LANG || "en";
const SUPERTONIC_STEPS = String(process.env.SUPERTONIC_STEPS || 10);
const SUPERTONIC_SPEED = String(process.env.SUPERTONIC_SPEED || 1.0);

const SEND_EMAIL_SCRIPT = process.env.SEND_EMAIL_SCRIPT || "/Users/franksharpe/clawd/scripts/send-email-now";
const MAIL_HUB_SCRIPT = process.env.MAIL_HUB_SCRIPT || "/Users/franksharpe/clawd/scripts/mail-hub";
const TONE_SCRIPT = process.env.TONE_SCRIPT || "/Users/franksharpe/clawd/scripts/generate-tone-track.py";

const COMPANY_PROFILES = {
  "easy pay direct": {
    name: "Easy Pay Direct",
    facts: [
      "Operating since 2000 with over 20 years in payment processing.",
      "Supports 30+ business categories and complex/high-risk merchant needs.",
      "Publishes 99.99% uptime claims for payment operations.",
      "Advertises 24-hour onboarding for qualified merchant accounts."
    ],
    alignment: [
      "A high-trust payment brand benefits from fast, repeatable communications and launch pipelines.",
      "Cross-functional teams can reduce time-to-market with automated asset generation and delivery.",
      "A proof-first process matches payment-industry expectations for reliability."
    ],
    source: "https://www.easypaydirect.com/"
  }
};

const app = express();
app.use(express.json({ limit: "2mb" }));
app.use(express.static(PUBLIC_DIR));
app.use("/generated", express.static(GENERATED_DIR));

async function ensureDirs() {
  await fs.mkdir(GENERATED_DIR, { recursive: true });
}

function safeName(text) {
  return String(text || "asset")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 42) || "asset";
}

function nowIso() {
  return new Date().toISOString();
}

async function runCmd(command, args, timeout = 120000) {
  const { stdout, stderr } = await execFile(command, args, {
    timeout,
    maxBuffer: 10 * 1024 * 1024
  });

  return { stdout: String(stdout || ""), stderr: String(stderr || "") };
}

async function writeJsonArtifact(name, data) {
  const file = path.join(GENERATED_DIR, `${name}.json`);
  await fs.writeFile(file, JSON.stringify(data, null, 2), "utf8");
  return file;
}

async function checkStableHorde() {
  if (!STABLE_HORDE_API_KEY) {
    return { ok: false, detail: "Missing STABLE_HORDE_API_KEY" };
  }

  const res = await fetch("https://stablehorde.net/api/v2/find_user", {
    headers: {
      apikey: STABLE_HORDE_API_KEY,
      "Client-Agent": "magnus:opportunity-beta:1.0"
    }
  });

  const body = await res.json();
  return {
    ok: res.ok && Boolean(body?.id),
    detail: body?.username || body?.message || `HTTP ${res.status}`,
    kudos: body?.kudos ?? null
  };
}

async function checkSonauto() {
  if (!SONAUTO_API_KEY) {
    return { ok: false, detail: "Missing SONAUTO_API_KEY" };
  }

  const res = await fetch("https://api.sonauto.ai/v1/credits/balance", {
    headers: {
      Authorization: `Bearer ${SONAUTO_API_KEY}`
    }
  });

  const body = await res.json();
  return {
    ok: res.ok && typeof body?.num_credits === "number",
    detail: res.ok ? `credits=${body?.num_credits}` : `HTTP ${res.status}`,
    credits: body?.num_credits ?? null
  };
}

async function checkBrevo() {
  try {
    const { stdout } = await runCmd(MAIL_HUB_SCRIPT, ["status"], 90000);
    const ok = stdout.includes("MAIL_HUB=READY") && stdout.includes("BREVO_SEND=OK");
    return { ok, detail: ok ? "mail-hub ready" : "mail-hub not ready", raw: stdout.trim() };
  } catch (error) {
    return { ok: false, detail: error.message };
  }
}

async function checkTts() {
  try {
    const verifyOut = path.join(GENERATED_DIR, `verify-tts-${Date.now()}.wav`);
    await runCmd(
      SUPERTONIC_BIN,
      [
        "tts",
        "Tool check complete. The voice stack is live.",
        "-o",
        verifyOut,
        "--model",
        SUPERTONIC_MODEL,
        "--lang",
        SUPERTONIC_LANG,
        "--voice",
        SUPERTONIC_VOICE,
        "--steps",
        SUPERTONIC_STEPS,
        "--speed",
        SUPERTONIC_SPEED
      ],
      120000
    );

    await fs.access(verifyOut);
    return {
      ok: true,
      detail: `${SUPERTONIC_MODEL}/${SUPERTONIC_VOICE}`,
      sample: `/generated/${path.basename(verifyOut)}`
    };
  } catch (error) {
    return { ok: false, detail: error.message };
  }
}

async function checkGh() {
  try {
    const { stdout, stderr } = await runCmd("gh", ["auth", "status"]);
    const output = `${stdout}\n${stderr}`;
    return { ok: /Logged in to github.com/.test(output), detail: output.trim().split("\n")[0] || "gh auth" };
  } catch (error) {
    return { ok: false, detail: error.message };
  }
}

async function checkVercel() {
  try {
    const { stdout } = await runCmd("vercel", ["whoami"]);
    return { ok: Boolean(stdout.trim()), detail: stdout.trim() || "not logged in" };
  } catch (error) {
    return { ok: false, detail: error.message };
  }
}

async function makeNarration(text, runId) {
  const outWav = path.join(GENERATED_DIR, `${runId}-narration.wav`);
  await runCmd(
    SUPERTONIC_BIN,
    [
      "tts",
      text,
      "-o",
      outWav,
      "--model",
      SUPERTONIC_MODEL,
      "--lang",
      SUPERTONIC_LANG,
      "--voice",
      SUPERTONIC_VOICE,
      "--steps",
      SUPERTONIC_STEPS,
      "--speed",
      SUPERTONIC_SPEED
    ],
    180000
  );

  return {
    path: outWav,
    url: `/generated/${path.basename(outWav)}`
  };
}

async function generateStableHordeImage(prompt, runId) {
  if (!STABLE_HORDE_API_KEY) {
    throw new Error("STABLE_HORDE_API_KEY is missing");
  }

  const payload = {
    prompt: `${prompt}###blurry, watermark, logo, text artifacts, low quality`,
    params: {
      width: 1024,
      height: 576,
      steps: 25,
      cfg_scale: 7,
      n: 1
    },
    nsfw: false,
    trusted_workers: false,
    models: ["stable_diffusion"],
    r2: true
  };

  const start = await fetch("https://stablehorde.net/api/v2/generate/async", {
    method: "POST",
    headers: {
      apikey: STABLE_HORDE_API_KEY,
      "Client-Agent": "magnus:opportunity-beta:1.0",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const startBody = await start.json();
  if (!start.ok || !startBody?.id) {
    throw new Error(startBody?.message || `Stable Horde start failed: HTTP ${start.status}`);
  }

  const statusUrl = `https://stablehorde.net/api/v2/generate/status/${startBody.id}`;
  const deadline = Date.now() + 210000;
  let lastStatus = null;

  while (Date.now() < deadline) {
    const poll = await fetch(statusUrl, {
      headers: {
        apikey: STABLE_HORDE_API_KEY,
        "Client-Agent": "magnus:opportunity-beta:1.0"
      }
    });

    const pollBody = await poll.json();
    lastStatus = pollBody;

    if (poll.ok && pollBody?.done && Array.isArray(pollBody?.generations) && pollBody.generations.length > 0) {
      const imageUrl = pollBody.generations[0]?.img;
      if (!imageUrl) {
        throw new Error("Stable Horde returned done=true but no image URL.");
      }

      const imgRes = await fetch(imageUrl);
      if (!imgRes.ok) {
        throw new Error(`Failed to download image: HTTP ${imgRes.status}`);
      }

      const ct = (imgRes.headers.get("content-type") || "").toLowerCase();
      const ext = ct.includes("png") ? "png" : ct.includes("jpeg") ? "jpg" : ct.includes("webp") ? "webp" : "png";
      const fileName = `${runId}-splash.${ext}`;
      const outPath = path.join(GENERATED_DIR, fileName);
      const bytes = Buffer.from(await imgRes.arrayBuffer());
      await fs.writeFile(outPath, bytes);

      await writeJsonArtifact(`${runId}-stable-horde`, {
        createdAt: nowIso(),
        request: payload,
        start: startBody,
        status: pollBody,
        imageUrl
      });

      return {
        path: outPath,
        url: `/generated/${fileName}`,
        provider: "stable_horde",
        kudos: startBody?.kudos ?? null
      };
    }

    await new Promise((resolve) => setTimeout(resolve, 3500));
  }

  throw new Error(`Stable Horde timeout. Last status: ${JSON.stringify(lastStatus)}`);
}

async function generateFallbackJingle(runId) {
  const outWav = path.join(GENERATED_DIR, `${runId}-jingle-fallback.wav`);
  await runCmd("python3", [TONE_SCRIPT, "--out", outWav, "--duration", "6"], 90000);

  return {
    path: outWav,
    url: `/generated/${path.basename(outWav)}`,
    provider: "local_tone_fallback"
  };
}

async function generateSonautoJingle(runId, prompt) {
  if (!SONAUTO_API_KEY) {
    throw new Error("SONAUTO_API_KEY is missing");
  }

  const createPayload = {
    prompt,
    instrumental: true,
    num_songs: 1,
    output_format: "mp3"
  };

  const createRes = await fetch("https://api.sonauto.ai/v1/generations/v2", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SONAUTO_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(createPayload)
  });

  const createBody = await createRes.json();
  const taskId = createBody?.task_id;
  if (!createRes.ok || !taskId) {
    throw new Error(createBody?.error_message || `Sonauto create failed: HTTP ${createRes.status}`);
  }

  const deadline = Date.now() + 210000;
  let detail = null;

  while (Date.now() < deadline) {
    const statusRes = await fetch(`https://api.sonauto.ai/v1/generations/status/${taskId}`, {
      headers: { Authorization: `Bearer ${SONAUTO_API_KEY}` }
    });

    const statusText = await statusRes.text();
    let status;
    try {
      status = JSON.parse(statusText);
    } catch {
      status = statusText;
    }

    if (typeof status === "string" && /FAILED|ERROR/i.test(status)) {
      throw new Error(`Sonauto status=${status}`);
    }

    const detailRes = await fetch(`https://api.sonauto.ai/v1/generations/${taskId}`, {
      headers: { Authorization: `Bearer ${SONAUTO_API_KEY}` }
    });
    detail = await detailRes.json();

    if (Array.isArray(detail?.song_paths) && detail.song_paths.length > 0) {
      const songUrl = detail.song_paths[0];
      const sourceRes = await fetch(songUrl);
      if (!sourceRes.ok) {
        throw new Error(`Sonauto song download failed: HTTP ${sourceRes.status}`);
      }

      const fullPath = path.join(GENERATED_DIR, `${runId}-jingle-full.mp3`);
      await fs.writeFile(fullPath, Buffer.from(await sourceRes.arrayBuffer()));

      const clipPath = path.join(GENERATED_DIR, `${runId}-jingle-clip.mp3`);
      await runCmd(
        "ffmpeg",
        ["-y", "-i", fullPath, "-t", "6", "-acodec", "libmp3lame", "-q:a", "4", clipPath],
        90000
      );

      await writeJsonArtifact(`${runId}-sonauto`, {
        createdAt: nowIso(),
        createPayload,
        createBody,
        detail
      });

      return {
        path: clipPath,
        url: `/generated/${path.basename(clipPath)}`,
        provider: "sonauto",
        taskId,
        fullTrack: `/generated/${path.basename(fullPath)}`
      };
    }

    await new Promise((resolve) => setTimeout(resolve, 4000));
  }

  throw new Error(`Sonauto timeout. Last detail status: ${detail?.status || "unknown"}`);
}

function buildNarrationText(company, yearsExperience, motivation) {
  const profile = COMPANY_PROFILES[company.toLowerCase()];
  const companyFact = profile?.facts?.[0] || `${company} is positioned for scalable growth.`;

  return [
    `Hi ${company} team.`,
    "I build production-ready automation systems that turn ideas into deployable assets fast.",
    `I have been building and shipping for ${yearsExperience}, with a practical focus on reliability and measurable business outcomes.`,
    companyFact,
    "In this live beta, I automate research, media generation, narration, web presentation, deployment, and direct delivery.",
    "The result is a repeatable pipeline your team can use to launch campaigns and executive-ready presentations in minutes.",
    `${motivation}`
  ].join(" ");
}

function buildOpportunityReport({ company, yearsExperience, motivation }) {
  const now = new Date();
  const date = now.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const profile = COMPANY_PROFILES[company.toLowerCase()];
  const companyTitle = profile?.name || company;
  const companyFacts = profile?.facts || [
    `${company} has clear opportunity for faster media-to-deployment workflows.`,
    "Automation can reduce manual work and compress delivery cycles."
  ];
  const companyAlignment = profile?.alignment || [
    "Your team can benefit from faster cross-channel asset delivery.",
    "A repeatable stack improves quality and lowers execution risk."
  ];
  const source = profile?.source || "Internal research + user-provided context";

  const lines = [
    `# ${companyTitle} Opportunity Presentation (Beta)` ,
    "",
    `Generated: ${date}`,
    "",
    "## Why Hire Frank Sharpe",
    `- ${yearsExperience} of practical builder experience with end-to-end delivery ownership.`,
    "- Proven ability to ship AI automation pipelines that combine creative output and business operations.",
    "- Focus on systems that reduce cycle time, lower costs, and increase execution confidence.",
    "",
    `## Company Snapshot (${companyTitle})`,
    ...companyFacts.map((fact) => `- ${fact}`),
    "",
    `## Alignment With ${companyTitle}`,
    ...companyAlignment.map((line) => `- ${line}`),
    "",
    "## Automation Stack Used In This Beta",
    "1. Opportunity report generation from structured company inputs.",
    "2. Hero image generation via Stable Horde.",
    "3. Jingle generation via Sonauto (with local fallback).",
    "4. Local Maximilian narration generation (Supertonic voice stack).",
    "5. Interactive splash page and auto-scrolling presentation flow.",
    "6. GitHub version control push and Vercel beta deployment.",
    "7. Brevo delivery email with direct links and summary.",
    "",
    "## Partnership Vision",
    `- ${motivation}`,
    "- Build once, iterate fast, and deploy repeatedly with transparent artifacts.",
    "- Create a repeatable system for recruiting, marketing, and stakeholder communication.",
    "",
    `## Research Source`,
    `- ${source}`
  ];

  return lines.join("\n");
}

function requireString(value, field) {
  const text = String(value || "").trim();
  if (!text) {
    throw new Error(`${field} is required.`);
  }
  return text;
}

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    appUrl: APP_URL,
    defaultCompany: DEFAULT_COMPANY,
    defaultRecipient: DEFAULT_RECIPIENT,
    tts: {
      engine: "supertonic",
      model: SUPERTONIC_MODEL,
      voice: SUPERTONIC_VOICE,
      lang: SUPERTONIC_LANG
    }
  });
});

app.post("/api/verify", async (_req, res) => {
  try {
    const [stableHorde, sonauto, brevo, tts, github, vercel] = await Promise.all([
      checkStableHorde(),
      checkSonauto(),
      checkBrevo(),
      checkTts(),
      checkGh(),
      checkVercel()
    ]);

    const checks = { stableHorde, sonauto, brevo, tts, github, vercel };
    const ok = Object.values(checks).every((item) => item.ok);

    await writeJsonArtifact(`verify-${Date.now()}`, { createdAt: nowIso(), checks });

    res.json({ ok, checks });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

app.post("/api/report", async (req, res) => {
  try {
    const company = String(req.body.company || DEFAULT_COMPANY).trim() || DEFAULT_COMPANY;
    const yearsExperience = String(req.body.yearsExperience || "10+").trim() || "10+";
    const motivation = String(req.body.motivation || "Let's build something that creates real momentum and measurable growth.").trim();

    const report = buildOpportunityReport({ company, yearsExperience, motivation });
    const fileName = `${Date.now()}-${safeName(company)}-report.md`;
    const filePath = path.join(GENERATED_DIR, fileName);
    await fs.writeFile(filePath, report, "utf8");

    res.json({ ok: true, report, reportUrl: `/generated/${fileName}` });
  } catch (error) {
    res.status(400).json({ ok: false, error: error.message });
  }
});

app.post("/api/image", async (req, res) => {
  try {
    const company = String(req.body.company || DEFAULT_COMPANY).trim() || DEFAULT_COMPANY;
    const prompt = String(
      req.body.prompt ||
        `${company} fintech payment operations dashboard, cinematic glass UI, premium motion design lighting, trustworthy enterprise atmosphere`
    ).trim();

    const runId = `${Date.now()}-${safeName(company)}-${crypto.randomUUID().slice(0, 8)}`;
    const image = await generateStableHordeImage(prompt, runId);

    res.json({ ok: true, image });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

app.post("/api/jingle", async (req, res) => {
  try {
    const company = String(req.body.company || DEFAULT_COMPANY).trim() || DEFAULT_COMPANY;
    const runId = `${Date.now()}-${safeName(company)}-${crypto.randomUUID().slice(0, 8)}`;
    const prompt = String(
      req.body.prompt || "short upbeat fintech jingle intro, corporate startup confidence, energetic clean synth"
    ).trim();

    let jingle;
    try {
      jingle = await generateSonautoJingle(runId, prompt);
    } catch (error) {
      jingle = await generateFallbackJingle(runId);
      jingle.error = `Sonauto failed, fallback used: ${error.message}`;
    }

    res.json({ ok: true, jingle });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

app.post("/api/tts", async (req, res) => {
  try {
    const company = String(req.body.company || DEFAULT_COMPANY).trim() || DEFAULT_COMPANY;
    const yearsExperience = String(req.body.yearsExperience || "10+").trim() || "10+";
    const motivation = String(req.body.motivation || "Let's build something that creates real momentum and measurable growth.").trim();
    const customText = String(req.body.text || "").trim();

    const narrationText = customText || buildNarrationText(company, yearsExperience, motivation);
    const runId = `${Date.now()}-${safeName(company)}-${crypto.randomUUID().slice(0, 8)}`;
    const narration = await makeNarration(narrationText, runId);

    res.json({
      ok: true,
      voice: {
        engine: "supertonic",
        model: SUPERTONIC_MODEL,
        voice: SUPERTONIC_VOICE,
        lang: SUPERTONIC_LANG
      },
      text: narrationText,
      narration
    });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

app.post("/api/email", async (req, res) => {
  try {
    const to = requireString(req.body.to, "to");
    const subject = requireString(req.body.subject, "subject");
    const text = requireString(req.body.text, "text");

    const args = ["--to", to, "--subject", subject, "--text", text];
    if (process.env.BREVO_FROM_NAME) {
      args.push("--from-name", process.env.BREVO_FROM_NAME);
    }

    const { stdout } = await runCmd(SEND_EMAIL_SCRIPT, args, 120000);
    const lines = stdout.split(/\r?\n/).filter(Boolean);
    const parsed = Object.fromEntries(lines.map((line) => {
      const idx = line.indexOf("=");
      if (idx === -1) {
        return [line, true];
      }
      return [line.slice(0, idx), line.slice(idx + 1)];
    }));

    res.json({ ok: parsed.STATUS === "SUCCESS", result: parsed, raw: stdout.trim() });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

app.post("/api/pipeline", async (req, res) => {
  try {
    const company = String(req.body.company || DEFAULT_COMPANY).trim() || DEFAULT_COMPANY;
    const yearsExperience = String(req.body.yearsExperience || "10+").trim() || "10+";
    const motivation = String(req.body.motivation || "Let's build something that creates real momentum and measurable growth.").trim();

    const report = buildOpportunityReport({ company, yearsExperience, motivation });
    const runBase = `${Date.now()}-${safeName(company)}-${crypto.randomUUID().slice(0, 8)}`;

    const reportFile = `${runBase}-report.md`;
    await fs.writeFile(path.join(GENERATED_DIR, reportFile), report, "utf8");

    const image = await generateStableHordeImage(
      `${company} payment processing visualization, polished fintech UI, executive presentation hero image`,
      runBase
    );

    let jingle;
    try {
      jingle = await generateSonautoJingle(runBase, "short upbeat fintech jingle intro, confident modern synth, no lyrics");
    } catch (error) {
      jingle = await generateFallbackJingle(runBase);
      jingle.error = `Sonauto failed, fallback used: ${error.message}`;
    }

    const narrationText = buildNarrationText(company, yearsExperience, motivation);
    const narration = await makeNarration(narrationText, runBase);

    const summary = {
      company,
      yearsExperience,
      motivation,
      report: {
        report,
        reportUrl: `/generated/${reportFile}`
      },
      image,
      jingle,
      narration,
      voice: {
        engine: "supertonic",
        model: SUPERTONIC_MODEL,
        voice: SUPERTONIC_VOICE,
        lang: SUPERTONIC_LANG
      },
      generatedAt: nowIso()
    };

    await writeJsonArtifact(`${runBase}-pipeline`, summary);

    res.json({ ok: true, summary });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, "index.html"));
});

await ensureDirs();

app.listen(PORT, () => {
  console.log(`ai-opportunity-beta running on ${APP_URL}`);
});
