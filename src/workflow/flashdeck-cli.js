import {
  askRun,
  approveRun,
  deployRun,
  explainRun,
  generateRun,
  listRuns,
  previewRun,
  reportRun,
  sendRun
} from "./core.js";

function parseArgv(argv) {
  const positional = [];
  const options = {};

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith("--")) {
      positional.push(token);
      continue;
    }

    const key = token.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) {
      options[key] = true;
      continue;
    }

    options[key] = next;
    i += 1;
  }

  return { positional, options };
}

function printHelp() {
  console.log(`flashdeck commands:

  flashdeck ignite "<company>" --template fintech [--motivation "..."] [--years "..."] [--use-pinned-jingle]
  flashdeck show <run-selector> [--port 8877]
  flashdeck greenlight <run-selector>
  flashdeck launch <run-selector> [--project epd-beta]
  flashdeck broadcast <run-selector> --to <email> [--dry-run]
  flashdeck ask <run-selector> --question "<text>"
  flashdeck explain <run-selector>
  flashdeck intel <run-selector>
  flashdeck vault

Classic aliases are also available:
  generate preview approve deploy send ask explain report list
`);
}

function printManifestSummary(manifest) {
  console.log(`runId=${manifest.runId}`);
  console.log(`company=${manifest.company}`);
  console.log(`template=${manifest.template}`);
  console.log(`status=${manifest.status}`);
  console.log(`approved=${manifest.approved}`);
  if (manifest.deployedUrl) {
    console.log(`deployedUrl=${manifest.deployedUrl}`);
  }
  if (manifest.destinationEmail) {
    console.log(`destinationEmail=${manifest.destinationEmail}`);
  }
  console.log(`manifest=${manifest.paths.manifestPath}`);
}

function normalizeCommand(command) {
  const map = {
    ignite: "generate",
    show: "preview",
    greenlight: "approve",
    launch: "deploy",
    broadcast: "send",
    reflect: "ask",
    decode: "explain",
    intel: "report",
    vault: "list"
  };

  return map[command] || command;
}

async function main() {
  const [, , rawCommand, ...rest] = process.argv;
  const command = normalizeCommand(rawCommand || "");

  if (!command || command === "help" || command === "--help") {
    printHelp();
    return;
  }

  const { positional, options } = parseArgv(rest);

  if (command === "generate") {
    const company = positional.join(" ").trim();
    if (!company) {
      throw new Error("Usage: flashdeck ignite \"<company>\" --template fintech");
    }

    const manifest = await generateRun({
      company,
      template: options.template || "fintech",
      motivation: options.motivation,
      yearsExperience: options.years,
      usePinnedJingle: Boolean(options["use-pinned-jingle"])
    });

    console.log("status=ignited");
    printManifestSummary(manifest);
    console.log("next=flashdeck show <run-selector>");
    return;
  }

  if (command === "preview") {
    const selector = positional[0] || "";
    const { manifest, url } = await previewRun(selector, { port: options.port || 8877 });
    console.log("status=preview-ready");
    printManifestSummary(manifest);
    console.log(`url=${url}`);
    console.log("note=Press Ctrl+C to stop preview server.");
    return new Promise(() => {});
  }

  if (command === "approve") {
    const selector = positional[0] || "";
    const manifest = await approveRun(selector);
    console.log("status=greenlit");
    printManifestSummary(manifest);
    return;
  }

  if (command === "deploy") {
    const selector = positional[0] || "";
    const { manifest, deployedUrl } = await deployRun(selector, { project: options.project });
    console.log("status=launched");
    printManifestSummary(manifest);
    console.log(`url=${deployedUrl}`);
    return;
  }

  if (command === "send") {
    const selector = positional[0] || "";
    const result = await sendRun(selector, {
      to: options.to,
      dryRun: Boolean(options["dry-run"])
    });

    if (result.dryRun) {
      console.log("status=broadcast-dry-run");
      printManifestSummary(result.manifest);
      console.log(`to=${result.request.to}`);
      console.log(`subject=${result.request.subject}`);
      return;
    }

    console.log("status=broadcast-sent");
    printManifestSummary(result.manifest);
    console.log(`messageId=${result.result.MESSAGE_ID || "unknown"}`);
    return;
  }

  if (command === "ask") {
    const selector = positional[0] || "";
    const question = String(options.question || "").trim();
    const result = await askRun(selector, question);
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  if (command === "explain") {
    const selector = positional[0] || "";
    const result = await explainRun(selector);
    console.log(JSON.stringify(result, null, 2));
    return;
  }

  if (command === "report") {
    const selector = positional[0] || "";
    const manifest = await reportRun(selector);
    console.log(JSON.stringify(manifest, null, 2));
    return;
  }

  if (command === "list") {
    const runs = await listRuns();
    if (!runs.length) {
      console.log("status=empty-vault");
      return;
    }

    for (const run of runs) {
      const parts = [
        run.runId,
        run.company,
        run.template,
        run.status,
        run.approved ? "approved" : "not-approved",
        run.deployedUrl || "no-deploy"
      ];
      console.log(parts.join(" | "));
    }
    return;
  }

  throw new Error(`Unknown command: ${rawCommand}`);
}

main().catch((error) => {
  console.error(`error=${error.message}`);
  process.exit(1);
});
