const $ = (id) => document.getElementById(id);

const els = {
  company: $("company"),
  yearsExperience: $("yearsExperience"),
  motivation: $("motivation"),
  recipient: $("recipient"),
  verifyBtn: $("verifyBtn"),
  pipelineBtn: $("pipelineBtn"),
  ttsBtn: $("ttsBtn"),
  emailBtn: $("emailBtn"),
  startBtn: $("startBtn"),
  replayBtn: $("replayBtn"),
  splash: $("splash"),
  splashTitle: $("splashTitle"),
  splashSub: $("splashSub"),
  splashGoBtn: $("splashGoBtn"),
  status: $("status"),
  checks: $("checks"),
  heroImage: $("heroImage"),
  heroTitle: $("heroTitle"),
  heroSub: $("heroSub"),
  whyHire: $("whyHire"),
  companyFacts: $("companyFacts"),
  companyAlignment: $("companyAlignment"),
  stackGrid: $("stackGrid"),
  report: $("report"),
  jingle: $("jingle"),
  narration: $("narration"),
  captionLine: $("captionLine")
};

const state = {
  summary: null,
  scriptLines: [],
  autoTimer: null,
  captionTimer: null,
  sequenceRunning: false
};

function formatVoiceLabel(voice) {
  const engine = voice?.engine || "tts";
  const actual = voice?.voice || "voice";
  const requested = voice?.requestedVoice;
  if (requested && requested !== actual) {
    return `${engine}/${actual} (requested ${requested})`;
  }
  return `${engine}/${actual}`;
}

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
    yearsExperience: els.yearsExperience.value.trim() || "hands-on builder experience",
    motivation: els.motivation.value.trim() || "Let's build a beautiful and brilliant partnership through reliable automation.",
    recipient: els.recipient.value.trim()
  };
}

function setList(el, items) {
  el.innerHTML = "";
  (items || []).forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    el.appendChild(li);
  });
}

function setStack(summary) {
  const steps = [
    "Company analysis and strategic narrative framing",
    "Stable Horde visual generation",
    `Sonauto vocal jingle generation (~${summary?.jingle?.clipSeconds || 28}s)`,
    `Maximilian narration voice (${formatVoiceLabel(summary?.voice)})`,
    "Animated splash, cinematic fade, and timed storytelling",
    "GitHub version control and Vercel deployment",
    "Brevo API delivery for stakeholders"
  ];

  els.stackGrid.innerHTML = "";
  steps.forEach((item) => {
    const div = document.createElement("div");
    div.textContent = item;
    els.stackGrid.appendChild(div);
  });
}

function fillPresentation(summary) {
  els.heroTitle.textContent = `${summary.company} x Frank Sharpe`;
  els.heroSub.textContent = "Premium real-time automation presentation with vocal jingle, Maximilian narration, and executable delivery.";
  els.whyHire.textContent = `I have ${summary.yearsExperience} of builder execution focused on reliable outcomes. This demo proves I can ship from concept to polished delivery quickly and consistently.`;
  setList(els.companyFacts, summary.companyProfile?.facts || []);
  setList(els.companyAlignment, summary.companyProfile?.alignment || []);
  setStack(summary);
  els.report.textContent = summary.report?.report || "";

  if (summary.image?.url) els.heroImage.src = summary.image.url;
  if (summary.jingle?.url) els.jingle.src = summary.jingle.url;
  if (summary.narration?.url) els.narration.src = summary.narration.url;

  state.scriptLines = summary.script || [summary.motivation];
  els.splashTitle.textContent = `${summary.company} Premium Intro`;
  els.splashSub.textContent = "Cinematic jingle is about to load. After fade-in to the site, Maximilian narration and auto-scroll begin instantly.";
}

function stopAutoScroll() {
  if (state.autoTimer) {
    clearInterval(state.autoTimer);
    state.autoTimer = null;
  }
}

function startAutoScroll() {
  stopAutoScroll();
  window.scrollTo({ top: 0, behavior: "smooth" });

  state.autoTimer = setInterval(() => {
    window.scrollBy(0, 1.45);
    const atBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 3;
    if (atBottom) stopAutoScroll();
  }, 20);
}

function startCaptions() {
  if (state.captionTimer) {
    clearInterval(state.captionTimer);
    state.captionTimer = null;
  }

  let idx = 0;
  els.captionLine.textContent = state.scriptLines[idx] || "";

  state.captionTimer = setInterval(() => {
    idx += 1;
    if (idx >= state.scriptLines.length) {
      clearInterval(state.captionTimer);
      state.captionTimer = null;
      return;
    }
    els.captionLine.textContent = state.scriptLines[idx];
  }, 4300);
}

function waitMs(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function showSplashOverlay() {
  els.splash.classList.remove("hidden", "fade-out");
  els.splash.classList.add("active");
  document.body.classList.add("splash-active");
}

async function fadeOutSplash() {
  els.splash.classList.remove("playing");
  els.splash.classList.add("fade-out");
  await waitMs(850);
  els.splash.classList.remove("active", "fade-out");
  els.splash.classList.add("hidden");
  document.body.classList.remove("splash-active");
}

async function playToEnd(audioEl) {
  audioEl.currentTime = 0;
  await audioEl.play();
  await new Promise((resolve) => {
    audioEl.onended = resolve;
    audioEl.onerror = resolve;
  });
}

async function startSequence() {
  if (!state.summary) {
    setStatus("Run the pipeline first.", true);
    return;
  }

  if (state.sequenceRunning) {
    return;
  }

  state.sequenceRunning = true;
  showSplashOverlay();
  els.splash.classList.add("playing");
  els.splashGoBtn.disabled = true;
  els.captionLine.textContent = "Intro sequence is launching...";

  try {
    setStatus("Playing splash jingle with animation...");
    if (els.jingle.src) {
      await playToEnd(els.jingle);
    } else {
      await waitMs(2500);
    }

    els.splashSub.textContent = "Transitioning into narration and auto-scroll...";
    await fadeOutSplash();

    startAutoScroll();
    startCaptions();

    setStatus("Narration started. Auto-scroll and captions are active.");
    if (els.narration.src) {
      els.narration.currentTime = 0;
      await els.narration.play();
    }
  } catch {
    setStatus("Autoplay blocked. Press play on the audio controls.", true);
  } finally {
    state.sequenceRunning = false;
    els.splashGoBtn.disabled = false;
  }
}

async function verify() {
  setStatus("Verifying stack...");
  els.checks.textContent = "";
  const result = await api("/api/verify");
  els.checks.textContent = JSON.stringify(result.checks, null, 2);
  setStatus(result.ok ? "All checks passed." : "Some checks failed.", !result.ok);
}

async function runPipeline() {
  const input = currentInput();
  setStatus("Running full pipeline (image + vocal jingle + narration)...");
  const result = await api("/api/pipeline", input);
  state.summary = result.summary;
  fillPresentation(result.summary);

  const fallbackNote = result.summary?.jingle?.error ? ` | ${result.summary.jingle.error}` : "";
  setStatus(`Pipeline complete. Voice=${formatVoiceLabel(result.summary.voice)}, Jingle=${result.summary.jingle.provider}${fallbackNote}. Launch intro when ready.`);
}

async function regenerateNarration() {
  const input = currentInput();
  setStatus("Generating Maximilian narration...");
  const result = await api("/api/tts", input);

  if (!state.summary) {
    state.summary = {
      company: input.company,
      yearsExperience: input.yearsExperience,
      motivation: input.motivation,
      companyProfile: { facts: [], alignment: [] },
      report: { report: "Run pipeline to generate full report." },
      image: {},
      jingle: {},
      narration: result.narration,
      voice: result.voice,
      script: [result.text]
    };
  }

  state.summary.narration = result.narration;
  state.summary.voice = result.voice;
  state.summary.script = [result.text, "Narration regenerated in real time."];
  fillPresentation(state.summary);

  setStatus(`Narration ready with ${formatVoiceLabel(result.voice)}.`);
}

async function sendEmail() {
  const input = currentInput();
  if (!input.recipient) throw new Error("Recipient email is required.");

  const summary = state.summary;
  const appLink = window.location.origin;
  const reportLink = summary?.report?.reportUrl ? `${window.location.origin}${summary.report.reportUrl}` : "pending";
  const imageLink = summary?.image?.url ? `${window.location.origin}${summary.image.url}` : "pending";
  const jingleLink = summary?.jingle?.url ? `${window.location.origin}${summary.jingle.url}` : "pending";
  const narrationLink = summary?.narration?.url ? `${window.location.origin}${summary.narration.url}` : "pending";

  const subject = `${input.company} x Frank Sharpe | Premium Opportunity Presentation`;
  const text = [
    `Hi ${input.company} team,`,
    "",
    "I created a premium automated opportunity presentation tailored for your company.",
    "",
    `Live presentation: ${appLink}`,
    `Report: ${reportLink}`,
    `Hero image: ${imageLink}`,
    `Vocal jingle: ${jingleLink}`,
    `Narration: ${narrationLink}`,
    "",
    "This stack demonstrates rapid execution, quality control, and direct stakeholder delivery.",
    "",
    "Best,",
    "Frank Sharpe"
  ].join("\n");

  setStatus("Sending Brevo email...");
  const result = await api("/api/email", { to: input.recipient, subject, text });
  setStatus(`Email sent. Message ID: ${result.result.MESSAGE_ID || "unknown"}`);
}

function setupRevealObserver() {
  const slides = Array.from(document.querySelectorAll(".slide"));
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("reveal");
    });
  }, { threshold: 0.2 });

  slides.forEach((slide) => observer.observe(slide));
}

async function loadHealth() {
  const response = await fetch("/api/health");
  const body = await response.json();
  if (body.defaultCompany) els.company.value = body.defaultCompany;
  if (body.defaultRecipient) els.recipient.value = body.defaultRecipient;

  setStatus(`Ready. Voice=${formatVoiceLabel(body.tts)}`);
}

els.verifyBtn.addEventListener("click", () => verify().catch((error) => setStatus(error.message, true)));
els.pipelineBtn.addEventListener("click", () => runPipeline().catch((error) => setStatus(error.message, true)));
els.ttsBtn.addEventListener("click", () => regenerateNarration().catch((error) => setStatus(error.message, true)));
els.emailBtn.addEventListener("click", () => sendEmail().catch((error) => setStatus(error.message, true)));
els.startBtn.addEventListener("click", () => startSequence().catch((error) => setStatus(error.message, true)));
els.replayBtn.addEventListener("click", () => startSequence().catch((error) => setStatus(error.message, true)));
els.splashGoBtn.addEventListener("click", () => startSequence().catch((error) => setStatus(error.message, true)));

setupRevealObserver();
loadHealth().catch((error) => setStatus(error.message, true));
