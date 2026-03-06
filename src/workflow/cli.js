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

function printHelp() {
  console.log(`frank-workflow commands:

  frank-workflow generate "<company>" --template fintech [--motivation "..."] [--years "..."] [--use-pinned-jingle]
  frank-workflow preview <run-selector> [--port 8877]
  frank-workflow approve <run-selector>
  frank-workflow deploy <run-selector> [--project epd-beta]
  frank-workflow send <run-selector> --to <email> [--dry-run]
  frank-workflow ask <run-selector> --question "<text>"
  frank-workflow explain <run-selector>
  frank-workflow report <run-selector>
  frank-workflow list
`);
}

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

async function main() {
  const [, , command, ...rest] = process.argv;
  if (!command || command === "help" || command === "--help") {
    printHelp();
    return;
  }

  const { positional, options } = parseArgv(rest);

  if (command === "generate") {
    const company = positional.join(" ").trim();
    if (!company) {
      throw new Error("Usage: frank-workflow generate \"<company>\" --template fintech");
    }

    const manifest = await generateRun({
      company,
      template: options.template || "fintech",
      motivation: options.motivation,
      yearsExperience: options.years,
      usePinnedJingle: Boolean(options["use-pinned-jingle"])
    });

    console.log("status=generated");
    printManifestSummary(manifest);
    console.log("next=frank-workflow preview <run-selector>");
    return;
  }

  if (command === "preview") {
    const selector = positional[0] || "";
    const { manifest, url } = await previewRun(selector, { port: options.port || 8877 });
    console.log(`status=preview-ready`);
    printManifestSummary(manifest);
    console.log(`url=${url}`);
    console.log("note=Press Ctrl+C to stop preview server.");
    return new Promise(() => {});
  }

  if (command === "approve") {
    const selector = positional[0] || "";
    const manifest = await approveRun(selector);
    console.log("status=approved");
    printManifestSummary(manifest);
    return;
  }

  if (command === "deploy") {
    const selector = positional[0] || "";
    const { manifest, deployedUrl } = await deployRun(selector, { project: options.project });
    console.log("status=deployed");
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
      console.log("status=dry-run");
      printManifestSummary(result.manifest);
      console.log(`to=${result.request.to}`);
      console.log(`subject=${result.request.subject}`);
      return;
    }

    console.log("status=sent");
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
      console.log("status=empty");
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

  throw new Error(`Unknown command: ${command}`);
}

main().catch((error) => {
  console.error(`error=${error.message}`);
  process.exit(1);
});
