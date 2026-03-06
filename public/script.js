const $ = (id) => document.getElementById(id);

const els = {
  company: $("company"),
  yearsExperience: $("yearsExperience"),
  motivation: $("motivation"),
  recipient: $("recipient"),
  verifyBtn: $("verifyBtn"),
  pipelineBtn: $("pipelineBtn"),
  startBtn: $("startBtn"),
  ttsBtn: $("ttsBtn"),
  emailBtn: $("emailBtn"),
  status: $("status"),
  checks: $("checks"),
  hero: $("hero"),
  splashTitle: $("splashTitle"),
  whyHire: $("whyHire"),
  stackList: $("stackList"),
  alignment: $("alignment"),
  report: $("report"),
  jingle: $("jingle"),
  narration: $("narration"),
  story: $("story")
};

const state = {
  summary: null,
  voice: null,
  autoScrollTimer: null
};

function setStatus(message, isError = false) {
  els.status.textContent = message;
  els.status.style.color = isError ? "#fca5a5" : "#bbf7d0";
}

async function api(path, payload = {}) {
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const body = await response.json();
  if (!response.ok || body.ok === false) {
    throw new Error(body.error || `Request failed for ${path}`);
  }
  return body;
}

function currentInput() {
  return {
    company: els.company.value.trim() || "Easy Pay Direct",
    yearsExperience: els.yearsExperience.value.trim() || "10+",
    motivation: els.motivation.value.trim() || "Let's build something beautiful, reliable, and revenue-driving together.",
    recipient: els.recipient.value.trim()
  };
}

function fillStory(summary) {
  const { company, yearsExperience, motivation, report, voice } = summary;

  els.splashTitle.textContent = company;
  els.whyHire.textContent = `I have been building and shipping automation systems for ${yearsExperience}. This beta proves I can take an opportunity from concept to delivered assets and live deployment quickly.`;
  els.alignment.textContent = `${company} needs speed, trust, and operational precision. My workflow aligns by combining production-ready automation, rapid creative generation, and direct delivery with verification at each step. ${motivation}`;
  els.report.textContent = report.report;

  const stack = [
    "Opportunity analysis and narrative generation",
    "Stable Horde hero image generation",
    "Sonauto jingle generation (local fallback enabled)",
    `Maximilian narration voice (${voice.engine}/${voice.model}/${voice.voice})`,
    "Interactive presentation rendering with auto-scroll",
    "Brevo email delivery",
    "GitHub + Vercel deployment"
  ];

  els.stackList.innerHTML = "";
  stack.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    els.stackList.appendChild(li);
  });
}

function setMedia(summary) {
  if (summary?.image?.url) {
    els.hero.src = summary.image.url;
  }

  if (summary?.jingle?.url) {
    els.jingle.src = summary.jingle.url;
  }

  if (summary?.narration?.url) {
    els.narration.src = summary.narration.url;
  }
}

function stopAutoScroll() {
  if (state.autoScrollTimer) {
    clearInterval(state.autoScrollTimer);
    state.autoScrollTimer = null;
  }
}

function startAutoScroll() {
  stopAutoScroll();
  const target = els.story;
  target.scrollTop = 0;

  state.autoScrollTimer = setInterval(() => {
    target.scrollTop += 1.2;
    const atBottom = target.scrollTop + target.clientHeight >= target.scrollHeight - 3;
    if (atBottom) {
      stopAutoScroll();
    }
  }, 24);
}

async function verify() {
  setStatus("Verifying toolchain...");
  els.checks.textContent = "";
  const result = await api("/api/verify");
  els.checks.textContent = JSON.stringify(result.checks, null, 2);
  setStatus(result.ok ? "All checks passed." : "Some checks failed.", !result.ok);
}

async function runPipeline() {
  const input = currentInput();
  setStatus("Running full beta pipeline. This can take up to a few minutes...");
  const result = await api("/api/pipeline", input);
  state.summary = result.summary;
  state.voice = result.summary.voice;

  fillStory(result.summary);
  setMedia(result.summary);

  const maybeFallback = result.summary?.jingle?.error ? ` (${result.summary.jingle.error})` : "";
  setStatus(`Pipeline complete. Voice=${result.summary.voice.voice}${maybeFallback}`);
}

async function regenerateNarration() {
  const input = currentInput();
  setStatus("Generating narration...");
  const result = await api("/api/tts", input);
  if (!state.summary) {
    state.summary = {
      company: input.company,
      yearsExperience: input.yearsExperience,
      motivation: input.motivation,
      report: { report: "Run full pipeline to generate full report." },
      image: {},
      jingle: {},
      narration: {},
      voice: result.voice
    };
  }

  state.summary.narration = result.narration;
  state.summary.voice = result.voice;
  els.narration.src = result.narration.url;

  fillStory(state.summary);
  setStatus(`Narration ready with ${result.voice.model}/${result.voice.voice}.`);
}

async function sendEmail() {
  const input = currentInput();
  if (!input.recipient) {
    throw new Error("Recipient email is required.");
  }

  const summary = state.summary;
  const appLink = window.location.origin;
  const imageLink = summary?.image?.url ? `${window.location.origin}${summary.image.url}` : "pending";
  const narrationLink = summary?.narration?.url ? `${window.location.origin}${summary.narration.url}` : "pending";
  const reportLink = summary?.report?.reportUrl ? `${window.location.origin}${summary.report.reportUrl}` : "pending";

  const subject = `${input.company} x Frank Sharpe | Opportunity Automation Beta`;
  const body = [
    `Hi ${input.company} team,`,
    "",
    "I built a live automation beta that demonstrates how I can turn opportunity analysis into deployable presentation assets quickly.",
    "",
    `Live beta: ${appLink}`,
    `Report: ${reportLink}`,
    `Hero image: ${imageLink}`,
    `Narration: ${narrationLink}`,
    "",
    "Core stack:",
    "- Stable Horde (image generation)",
    "- Sonauto (jingle) with fallback",
    "- Local Maximilian voice narration",
    "- Brevo API for direct delivery",
    "- GitHub + Vercel deployment",
    "",
    `Motivation: ${input.motivation}`,
    "",
    "Best,",
    "Frank Sharpe"
  ].join("\n");

  setStatus("Sending Brevo email...");
  const result = await api("/api/email", {
    to: input.recipient,
    subject,
    text: body
  });

  setStatus(`Email sent. Message ID: ${result.result.MESSAGE_ID || "unknown"}`);
}

async function startPresentation() {
  if (!els.jingle.src && !els.narration.src) {
    setStatus("Generate assets first (Run Beta Pipeline).", true);
    return;
  }

  setStatus("Presentation started: jingle + narration + auto-scroll.");
  startAutoScroll();

  try {
    if (els.jingle.src) {
      els.jingle.currentTime = 0;
      await els.jingle.play();
      await new Promise((resolve) => {
        els.jingle.onended = resolve;
        els.jingle.onerror = resolve;
      });
    }

    if (els.narration.src) {
      els.narration.currentTime = 0;
      await els.narration.play();
    }
  } catch {
    setStatus("Autoplay blocked by browser. Press play on audio controls.", true);
  }
}

async function loadHealth() {
  const response = await fetch("/api/health");
  const body = await response.json();
  els.company.value = body.defaultCompany || els.company.value;
  if (body.defaultRecipient) {
    els.recipient.value = body.defaultRecipient;
  }
  state.voice = body.tts;
  setStatus(`Ready. Voice: ${body.tts.model}/${body.tts.voice}`);
}

els.verifyBtn.addEventListener("click", () => verify().catch((error) => setStatus(error.message, true)));
els.pipelineBtn.addEventListener("click", () => runPipeline().catch((error) => setStatus(error.message, true)));
els.ttsBtn.addEventListener("click", () => regenerateNarration().catch((error) => setStatus(error.message, true)));
els.emailBtn.addEventListener("click", () => sendEmail().catch((error) => setStatus(error.message, true)));
els.startBtn.addEventListener("click", () => startPresentation().catch((error) => setStatus(error.message, true)));

loadHealth().catch((error) => setStatus(error.message, true));
