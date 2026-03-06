import fs from "node:fs/promises";
import path from "node:path";
import http from "node:http";
import { execFile as _execFile } from "node:child_process";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

const execFile = promisify(_execFile);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "../..");
const DATA_DIR = path.join(ROOT, "data");
const GENERATED_DIR = path.join(DATA_DIR, "generated");
const RUNS_DIR = path.join(DATA_DIR, "runs");
const DEPLOY_DIR = path.join(ROOT, "deploy");
const CONFIG_DIR = path.join(ROOT, "config");

const DEFAULT_APP_URL = process.env.APP_URL || "http://localhost:8790";
const DEFAULT_VERCEL_PROJECT = process.env.VERCEL_PROJECT || "epd-beta";
const DEFAULT_SEND_EMAIL_SCRIPT = process.env.SEND_EMAIL_SCRIPT || "/Users/franksharpe/clawd/scripts/send-email-now";

function nowIso() {
  return new Date().toISOString();
}

function runStamp() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const h = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  const s = String(d.getSeconds()).padStart(2, "0");
  return `${y}${m}${day}-${h}${min}${s}`;
}

export function slugify(text) {
  return String(text || "asset")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64) || "asset";
}

async function pathExists(target) {
  try {
    await fs.access(target);
    return true;
  } catch {
    return false;
  }
}

async function readJson(file) {
  const raw = await fs.readFile(file, "utf8");
  return JSON.parse(raw);
}

async function writeJson(file, value) {
  await fs.writeFile(file, JSON.stringify(value, null, 2), "utf8");
}

async function runCmd(command, args, cwd = ROOT, timeout = 300000) {
  const { stdout, stderr } = await execFile(command, args, {
    cwd,
    timeout,
    maxBuffer: 20 * 1024 * 1024
  });
  return { stdout: String(stdout || ""), stderr: String(stderr || "") };
}

async function postJson(url, payload) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const body = await res.json();
  if (!res.ok || body.ok === false) {
    throw new Error(body.error || `Request failed: ${url}`);
  }
  return body;
}

async function getJson(url) {
  const res = await fetch(url);
  const body = await res.json();
  if (!res.ok || body.ok === false) {
    throw new Error(body.error || `Request failed: ${url}`);
  }
  return body;
}

async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else if (entry.isFile()) {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

function parseGeneratedUrl(urlPath) {
  return String(urlPath || "").replace(/^\/generated\//, "");
}

function extractRunId(summary) {
  const imageName = parseGeneratedUrl(summary?.image?.url);
  const imageMatch = imageName.match(/^(.+)-splash\.[a-z0-9]+$/i);
  if (imageMatch?.[1]) {
    return imageMatch[1];
  }

  const jingleName = parseGeneratedUrl(summary?.jingle?.url);
  const jingleMatch = jingleName.match(/^(.+)-jingle-[a-z0-9-]+\.[a-z0-9]+$/i);
  if (jingleMatch?.[1]) {
    return jingleMatch[1];
  }

  throw new Error("Unable to determine run id from pipeline summary.");
}

async function loadTemplates() {
  const file = path.join(CONFIG_DIR, "workflow-templates.json");
  return readJson(file);
}

async function loadProfile() {
  const file = path.join(CONFIG_DIR, "builder-profile.json");
  return readJson(file);
}

async function ensureWorkflowDirs() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.mkdir(GENERATED_DIR, { recursive: true });
  await fs.mkdir(RUNS_DIR, { recursive: true });
}

function buildDefaultMotivation(template, profile) {
  const personal = profile.personalNarrative ? `${profile.personalNarrative} ` : "";
  return `${personal}${template.cta} ${profile.positioningStatement}`;
}

async function copyGeneratedAsset(urlPath, assetsDir) {
  if (!urlPath) {
    return null;
  }

  const name = parseGeneratedUrl(urlPath);
  const src = path.join(GENERATED_DIR, name);
  if (!(await pathExists(src))) {
    return null;
  }

  const dest = path.join(assetsDir, name);
  await fs.copyFile(src, dest);
  return dest;
}

async function listRunManifests() {
  await ensureWorkflowDirs();
  const entries = await fs.readdir(RUNS_DIR, { withFileTypes: true });
  const manifests = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }
    const manifestPath = path.join(RUNS_DIR, entry.name, "manifest.json");
    if (!(await pathExists(manifestPath))) {
      continue;
    }

    try {
      const manifest = await readJson(manifestPath);
      manifests.push({ manifestPath, manifest });
    } catch {
      // Skip malformed manifest.
    }
  }

  manifests.sort((a, b) => {
    const at = new Date(a.manifest.generatedAt || 0).getTime();
    const bt = new Date(b.manifest.generatedAt || 0).getTime();
    return bt - at;
  });

  return manifests;
}

async function resolveRun(selector) {
  const runs = await listRunManifests();
  if (!runs.length) {
    throw new Error("No runs found. Use generate first.");
  }

  if (!selector) {
    return runs[0];
  }

  const q = String(selector).toLowerCase();
  const matched = runs.find(({ manifest }) => {
    const companySlug = slugify(manifest.company || "");
    return (
      String(manifest.runId || "").toLowerCase().includes(q) ||
      String(manifest.slug || "").toLowerCase() === q ||
      String(manifest.template || "").toLowerCase() === q ||
      companySlug === q
    );
  });

  if (!matched) {
    throw new Error(`Run not found for selector: ${selector}`);
  }

  return matched;
}

async function saveManifest(manifestPath, manifest) {
  manifest.updatedAt = nowIso();
  await writeJson(manifestPath, manifest);
}

function getUrlFromOutput(output) {
  const matches = String(output || "").match(/https:\/\/[^\s]+/g) || [];
  const vercelApp = matches.find((url) => url.includes(".vercel.app"));
  return vercelApp || matches[0] || "";
}

function parseKvOutput(raw) {
  const lines = String(raw || "").split(/\r?\n/).filter(Boolean);
  return Object.fromEntries(lines.map((line) => {
    const idx = line.indexOf("=");
    if (idx === -1) {
      return [line, true];
    }
    return [line.slice(0, idx), line.slice(idx + 1)];
  }));
}

async function loadRunContext(selector) {
  const { manifest } = await resolveRun(selector);
  const analysisPath = manifest?.paths?.analysisJson;
  if (!analysisPath || !(await pathExists(analysisPath))) {
    throw new Error("Run analysis artifact is missing.");
  }

  const analysis = await readJson(analysisPath);
  return { manifest, analysis };
}

function toConfidence(value) {
  return Number(value.toFixed(2));
}

function deriveTopOpportunity(manifest, analysis) {
  const alignment = analysis?.companyProfile?.alignment || [];
  if (alignment.length) {
    return alignment[0];
  }

  const templateOpportunity = manifest?.templateConfig?.opportunityLanguage;
  if (templateOpportunity) {
    return templateOpportunity;
  }

  return "Automated campaign and presentation delivery with approval-gated execution.";
}

export async function generateRun(options) {
  await ensureWorkflowDirs();

  const company = String(options.company || "").trim();
  if (!company) {
    throw new Error("Company is required for generate.");
  }

  const templates = await loadTemplates();
  const profile = await loadProfile();
  const templateName = String(options.template || "fintech").trim().toLowerCase();
  const template = templates[templateName];
  if (!template) {
    throw new Error(`Unknown template: ${templateName}`);
  }

  await getJson(`${DEFAULT_APP_URL}/api/health`);

  const yearsExperience = String(
    options.yearsExperience || process.env.BUILDER_EXPERIENCE || "hands-on builder experience"
  );

  const motivation = String(
    options.motivation || buildDefaultMotivation(template, profile)
  );

  const pipelineBody = {
    company,
    yearsExperience,
    motivation,
    template: templateName,
    usePinnedJingle: options.usePinnedJingle === true
  };

  const pipelineResult = await postJson(`${DEFAULT_APP_URL}/api/pipeline`, pipelineBody);
  const summary = pipelineResult.summary;
  const runId = extractRunId(summary);

  const pipelineJson = path.join(GENERATED_DIR, `${runId}-pipeline.json`);
  if (!(await pathExists(pipelineJson))) {
    throw new Error(`Pipeline artifact missing: ${pipelineJson}`);
  }

  await runCmd("node", ["scripts/export-showcase.mjs"], ROOT, 240000);

  const runFolderName = `${runStamp()}_${slugify(company)}_${runId.slice(-8)}`;
  const runDir = path.join(RUNS_DIR, runFolderName);
  const assetsDir = path.join(runDir, "assets");
  const presentationDir = path.join(runDir, "presentation");

  await fs.mkdir(assetsDir, { recursive: true });
  await fs.mkdir(presentationDir, { recursive: true });

  const imageAsset = await copyGeneratedAsset(summary?.image?.url, assetsDir);
  const jingleAsset = await copyGeneratedAsset(summary?.jingle?.url, assetsDir);
  const narrationAsset = await copyGeneratedAsset(summary?.narration?.url, assetsDir);
  const reportAsset = await copyGeneratedAsset(summary?.report?.reportUrl, assetsDir);

  await fs.copyFile(pipelineJson, path.join(runDir, "analysis.json"));
  await copyDir(DEPLOY_DIR, presentationDir);

  const manifest = {
    runId,
    slug: slugify(company),
    company,
    template: templateName,
    status: "generated",
    generatedAt: nowIso(),
    approved: false,
    approvedAt: null,
    deployedUrl: null,
    deployedAt: null,
    sent: false,
    sentAt: null,
    destinationEmail: null,
    providerConfig: {
      image: summary?.image?.provider || "unknown",
      music: summary?.jingle?.provider || "unknown",
      tts: summary?.voice?.engine || "unknown",
      ttsVoice: summary?.voice?.voice || "unknown"
    },
    templateConfig: template,
    profile,
    input: {
      yearsExperience,
      motivation
    },
    paths: {
      runDir,
      manifestPath: path.join(runDir, "manifest.json"),
      analysisJson: path.join(runDir, "analysis.json"),
      presentationDir,
      imageAsset,
      jingleAsset,
      narrationAsset,
      reportAsset
    }
  };

  await saveManifest(manifest.paths.manifestPath, manifest);
  return manifest;
}

export async function approveRun(selector) {
  const { manifestPath, manifest } = await resolveRun(selector);
  manifest.approved = true;
  manifest.approvedAt = nowIso();
  manifest.status = "approved";
  await saveManifest(manifestPath, manifest);
  return manifest;
}

export async function deployRun(selector, options = {}) {
  const { manifestPath, manifest } = await resolveRun(selector);
  if (!manifest.approved) {
    throw new Error("Run is not approved. Use approve before deploy.");
  }

  const project = String(options.project || DEFAULT_VERCEL_PROJECT);
  const presentationDir = manifest?.paths?.presentationDir;
  if (!presentationDir || !(await pathExists(presentationDir))) {
    throw new Error("Presentation directory missing for run.");
  }

  await runCmd("vercel", ["link", "--project", project, "--yes"], presentationDir, 180000);
  const { stdout, stderr } = await runCmd("vercel", ["deploy", "--prod", "-y"], presentationDir, 300000);
  const deployedUrl = getUrlFromOutput(`${stdout}\n${stderr}`);
  if (!deployedUrl) {
    throw new Error("Deploy completed but no URL was detected.");
  }

  manifest.deployedUrl = deployedUrl;
  manifest.deployedAt = nowIso();
  manifest.status = "deployed";
  await saveManifest(manifestPath, manifest);

  return { manifest, deployedUrl, output: `${stdout}\n${stderr}` };
}

export async function sendRun(selector, options = {}) {
  const { manifestPath, manifest } = await resolveRun(selector);
  if (!manifest.approved) {
    throw new Error("Run is not approved. Use approve before send.");
  }

  if (!manifest.deployedUrl) {
    throw new Error("Run has no deployed URL. Use deploy before send.");
  }

  const profile = await loadProfile();
  const to = String(options.to || profile.email || "").trim();
  if (!to) {
    throw new Error("Recipient email is required. Use --to.");
  }

  const subject = `${manifest.company} | Opportunity Report Engine`;
  const text = [
    `Hi ${manifest.company} team,`,
    "",
    "Sharing the approved opportunity presentation.",
    `Live presentation: ${manifest.deployedUrl}`,
    "",
    "Built by Frank Sharpe.",
    `Website: ${profile.website}`,
    `Contact: ${profile.email} | ${profile.phone}`
  ].join("\n");

  if (options.dryRun) {
    return {
      manifest,
      dryRun: true,
      request: { to, subject, text }
    };
  }

  const args = ["--to", to, "--subject", subject, "--text", text];
  if (process.env.BREVO_FROM_NAME) {
    args.push("--from-name", process.env.BREVO_FROM_NAME);
  }

  const { stdout } = await runCmd(DEFAULT_SEND_EMAIL_SCRIPT, args, ROOT, 120000);
  const parsed = parseKvOutput(stdout);
  if (parsed.STATUS !== "SUCCESS") {
    throw new Error(`Email send failed: ${stdout.trim()}`);
  }

  manifest.sent = true;
  manifest.sentAt = nowIso();
  manifest.destinationEmail = to;
  manifest.status = "sent";
  await saveManifest(manifestPath, manifest);

  return { manifest, result: parsed };
}

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".html") return "text/html; charset=utf-8";
  if (ext === ".css") return "text/css; charset=utf-8";
  if (ext === ".js") return "application/javascript; charset=utf-8";
  if (ext === ".json") return "application/json; charset=utf-8";
  if (ext === ".png") return "image/png";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".webp") return "image/webp";
  if (ext === ".wav") return "audio/wav";
  if (ext === ".mp3") return "audio/mpeg";
  return "application/octet-stream";
}

export async function previewRun(selector, options = {}) {
  const { manifest } = await resolveRun(selector);
  const root = manifest?.paths?.presentationDir;
  if (!root || !(await pathExists(root))) {
    throw new Error("Presentation directory missing for run.");
  }

  const port = Number(options.port || 8877);

  const server = http.createServer(async (req, res) => {
    try {
      const reqUrl = new URL(req.url || "/", `http://localhost:${port}`);
      const cleanPath = decodeURIComponent(reqUrl.pathname);
      const relative = cleanPath === "/" ? "index.html" : cleanPath.replace(/^\/+/, "");
      const resolved = path.resolve(root, relative);

      if (!resolved.startsWith(path.resolve(root))) {
        res.writeHead(403);
        res.end("Forbidden");
        return;
      }

      let target = resolved;
      if (!(await pathExists(target))) {
        target = path.join(root, "index.html");
      }

      const bytes = await fs.readFile(target);
      res.writeHead(200, { "Content-Type": getContentType(target) });
      res.end(bytes);
    } catch {
      res.writeHead(500);
      res.end("Preview server error");
    }
  });

  await new Promise((resolve) => server.listen(port, resolve));
  return { manifest, port, url: `http://localhost:${port}`, server };
}

export async function reportRun(selector) {
  const { manifest } = await resolveRun(selector);
  return manifest;
}

export async function listRuns() {
  const runs = await listRunManifests();
  return runs.map(({ manifest }) => manifest);
}

export async function askRun(selector, question) {
  const { manifest, analysis } = await loadRunContext(selector);
  const q = String(question || "").trim();
  if (!q) {
    throw new Error("Question is required. Use --question \"...\".");
  }

  const lower = q.toLowerCase();
  const facts = analysis?.companyProfile?.facts || [];
  const alignment = analysis?.companyProfile?.alignment || [];
  const source = analysis?.companyProfile?.source || "source not captured";
  const topOpportunity = deriveTopOpportunity(manifest, analysis);

  if (/(strongest|best|top).*(opportunity)|opportunity/.test(lower)) {
    return {
      question: q,
      answer: topOpportunity,
      confidence: toConfidence(facts.length ? 0.78 : 0.62),
      evidence: facts.slice(0, 2).map((fact) => `Company signal: ${fact}`),
      source
    };
  }

  if (/(weak|weakness|risk|gap)/.test(lower)) {
    return {
      question: q,
      answer: "This run is opportunity-focused and does not store explicit weakness scoring. Use revise/research before client delivery if risk analysis is required.",
      confidence: 0.55,
      evidence: alignment.slice(0, 2),
      source
    };
  }

  if (/(why|reason|recommend)/.test(lower)) {
    return {
      question: q,
      answer: `Recommendation is based on template framing (${manifest.template}) plus company signals from the run artifacts.`,
      confidence: toConfidence(facts.length ? 0.75 : 0.6),
      evidence: [...facts.slice(0, 1).map((fact) => `Company signal: ${fact}`), ...alignment.slice(0, 1)],
      source
    };
  }

  if (/(source|evidence|proof|citation)/.test(lower)) {
    return {
      question: q,
      answer: `Primary source reference: ${source}`,
      confidence: 0.9,
      evidence: facts.slice(0, 3),
      source
    };
  }

  if (/(automation|stack|pipeline)/.test(lower)) {
    return {
      question: q,
      answer: "Pipeline uses report generation, Stable Horde image generation, jingle generation, narration synthesis, presentation build, deployment, and optional email delivery.",
      confidence: 0.87,
      evidence: [
        `image=${manifest.providerConfig?.image || "unknown"}`,
        `music=${manifest.providerConfig?.music || "unknown"}`,
        `tts=${manifest.providerConfig?.tts || "unknown"}`
      ],
      source: "run manifest provider configuration"
    };
  }

  return {
    question: q,
    answer: "Question received. Current query mode supports opportunities, rationale, weaknesses/risks, sources, and automation stack topics.",
    confidence: 0.51,
    evidence: [manifest.paths.analysisJson],
    source
  };
}

export async function explainRun(selector) {
  const { manifest, analysis } = await loadRunContext(selector);
  const facts = analysis?.companyProfile?.facts || [];
  const topOpportunity = deriveTopOpportunity(manifest, analysis);
  const reason = facts[0]
    ? `Company signal: ${facts[0]}`
    : "Opportunity inferred from selected template framing and generated run metadata.";
  const source = analysis?.companyProfile?.source || "source not captured";

  return {
    company: manifest.company,
    runId: manifest.runId,
    topOpportunity,
    reason,
    confidence: toConfidence(facts.length ? 0.78 : 0.63),
    source
  };
}
