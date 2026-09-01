import fs from "node:fs";

const art = `${process.cwd()}/.artifacts/fe-refactor-audit`;
const scope = JSON.parse(fs.readFileSync(`${art}/2026-08-10-b32c-scope.json`, "utf8"));
const before = JSON.parse(fs.readFileSync(`${art}/2026-08-10-b32c-eslint-before.json`, "utf8"));
const afterDoc = JSON.parse(fs.readFileSync(`${art}/2026-08-10-b32c-eslint-after.json`, "utf8"));
const clusters = JSON.parse(fs.readFileSync(`${art}/2026-08-10-b32c-clusters.json`, "utf8"));

const manifest = new Set(
  (scope.b32CertifyManifest || [])
    .filter((f) => /\.(tsx|ts|mjs|jsx|js)$/.test(f))
    .map((f) => f.replace(/\\/g, "/")),
);

function norm(p) {
  return String(p || "")
    .replace(/\\/g, "/")
    .replace(/^.*\/(src\/|.storybook\/|plugins\/)/, "$1");
}

const beforeByFile = new Map();
for (const m of before.messages || []) {
  const file = norm(m.file);
  if (!manifest.has(file)) continue;
  const set = beforeByFile.get(file) || { rules: new Set() };
  set.rules.add(m.rule);
  beforeByFile.set(file, set);
}

const afterByFile = new Map();
for (const f of afterDoc.results || []) {
  const file = norm(f.filePath);
  if (!manifest.has(file)) continue;
  afterByFile.set(
    file,
    (f.messages || []).map((m) => ({
      ruleId: m.ruleId || "(none)",
      severity: m.severity,
      line: m.line,
      message: m.message,
    })),
  );
}

const buckets = {
  "introduced-by-b32": [],
  "pre-existing-related": [],
  "pre-existing-unrelated": [],
  "observed-a11y": [],
};
let introducedErrors = 0;
let introducedWarnings = 0;

for (const file of manifest) {
  const b = beforeByFile.get(file) || { rules: new Set() };
  for (const m of afterByFile.get(file) || []) {
    const item = {
      file,
      ruleId: m.ruleId,
      severity: m.severity,
      line: m.line,
      message: m.message,
    };
    if (m.ruleId.startsWith("jsx-a11y/")) {
      buckets["observed-a11y"].push(item);
      continue;
    }
    if (b.rules.has(m.ruleId)) {
      if (m.ruleId.startsWith("starci-fe/") || m.ruleId.startsWith("@")) {
        buckets["pre-existing-related"].push(item);
      } else {
        buckets["pre-existing-unrelated"].push(item);
      }
    } else {
      buckets["introduced-by-b32"].push(item);
      if (m.severity === 2) introducedErrors++;
      else introducedWarnings++;
    }
  }
}

const closedFiles = new Set();
for (const c of clusters.closedSample || []) {
  for (const f of c.files || []) closedFiles.add(f);
}
const closedClusterDoorWarnings = [];
for (const file of closedFiles) {
  for (const m of afterByFile.get(file) || []) {
    if (
      m.ruleId === "starci-fe/no-public-classname-prop" ||
      m.ruleId === "starci-fe/no-per-part-classname-prop"
    ) {
      closedClusterDoorWarnings.push({
        file,
        ruleId: m.ruleId,
        line: m.line,
        message: m.message,
      });
    }
  }
}

const out = {
  batch: "B32c",
  phase: 5,
  generatedAt: new Date().toISOString(),
  method:
    "pre-existing if same ruleId existed on file before (message template changes ignored)",
  certifyFileCount: manifest.size,
  remainingMessages: Object.values(buckets).reduce((n, a) => n + a.length, 0),
  bucketCounts: Object.fromEntries(
    Object.entries(buckets).map(([k, v]) => [k, v.length]),
  ),
  introducedErrors,
  introducedWarnings,
  closedClusterDoorWarnings: closedClusterDoorWarnings.length,
  closedClusterDoorWarningSamples: closedClusterDoorWarnings.slice(0, 20),
  unclassified: 0,
  introducedSamples: buckets["introduced-by-b32"].slice(0, 40),
  ok:
    introducedErrors === 0 &&
    introducedWarnings === 0 &&
    closedClusterDoorWarnings.length === 0,
};
fs.writeFileSync(`${art}/2026-08-10-b32c-eslint-cert.json`, JSON.stringify(out, null, 2));
console.log(
  JSON.stringify(
    {
      ok: out.ok,
      bucketCounts: out.bucketCounts,
      introducedErrors,
      introducedWarnings,
      closedClusterDoorWarnings: out.closedClusterDoorWarnings,
      introducedSamples: out.introducedSamples,
    },
    null,
    2,
  ),
);
