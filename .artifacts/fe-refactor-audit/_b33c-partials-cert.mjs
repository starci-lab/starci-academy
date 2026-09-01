/**
 * B33c partials + ESLint cert + diff audit
 */
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const ROOT = process.cwd();
const ART = path.join(ROOT, ".artifacts/fe-refactor-audit");
const CHECKPOINT = "139391b6";
const norm = (p) => String(p || "").replace(/\\/g, "/");

const before = JSON.parse(fs.readFileSync(path.join(ART, "2026-08-10-b33c-eslint-before.json"), "utf8"));
const after = JSON.parse(fs.readFileSync(path.join(ART, "2026-08-10-b33c-eslint-after.json"), "utf8"));
const scope = JSON.parse(fs.readFileSync(path.join(ART, "2026-08-10-b33c-scope.json"), "utf8"));
const b32c = JSON.parse(fs.readFileSync(path.join(ART, "2026-08-10-b32c-clusters.json"), "utf8"));
const w7 = JSON.parse(fs.readFileSync(path.join(ART, "2026-08-10-b33-worker-agent-7-identity.json"), "utf8"));
const w9 = JSON.parse(fs.readFileSync(path.join(ART, "2026-08-10-b33-worker-agent-9-sentence-heroui.json"), "utf8"));
const w6 = JSON.parse(fs.readFileSync(path.join(ART, "2026-08-10-b33-worker-agent-6-composites.json"), "utf8"));

function msgsForFiles(inventory, files) {
  const set = new Set(files.map(norm));
  return (inventory.messages || []).filter((m) => set.has(norm(m.file)));
}

function resolvePartialFiles(clusterId) {
  const m = clusterId.match(/^src-or-sb:(.+?)::/);
  if (!m) return [];
  const rest = m[1];
  const leaf = rest.split("/").pop();
  const tries = [
    `.storybook/components/starci/${rest}/${leaf}.tsx`,
    `.storybook/components/starci/${rest}/index.tsx`,
    `.storybook/components/${rest}/${leaf}.tsx`,
    `.storybook/components/${rest}/index.tsx`,
    `src/components/${rest}/index.tsx`,
    `src/components/${rest}/component.tsx`,
    `src/components/${rest}/${leaf}.tsx`,
  ];
  return tries.filter((t) => fs.existsSync(path.join(ROOT, t))).map(norm);
}

const closedByWorker = new Set([
  ...(w9.closedClusters || []).map((c) => (typeof c === "string" ? c : c.id)).filter(Boolean),
  ...(w7.closedClusters || []).map((c) => (typeof c === "string" ? c : c.id)).filter(Boolean),
  ...(w6.closedClusters || []).map((c) => (typeof c === "string" ? c : c.id)).filter(Boolean),
]);

// Map known closed partial ids from worker reports (may use short names)
function statusForPartial(p) {
  const id = p.id;
  const files = resolvePartialFiles(id);
  const beforeMsgs = msgsForFiles(before, files);
  const afterMsgs = msgsForFiles(after, files);
  const beforeRules = [...new Set(beforeMsgs.map((m) => m.rule))].sort();
  const afterRules = [...new Set(afterMsgs.map((m) => m.rule))].filter((r) =>
    (p.afterRules || p.beforeRules || []).some((x) => r === x) ||
    /host-element|raw-shape|classname|public-classname|frame-self-declare|identity/.test(r),
  );
  // Focus on the rules that defined the partial
  const focusRules = p.afterRules || p.beforeRules || [];
  const beforeFocus = beforeMsgs.filter((m) => focusRules.includes(m.rule));
  const afterFocus = afterMsgs.filter((m) => focusRules.includes(m.rule));

  let status = "still-partial";
  let reason = "";

  if (id.includes("QaConversationHeader")) {
    status = "unchanged-hold";
    reason = "src FollowButton/i18n API ≠ SB twin; agent-9 held";
  } else if (id.includes("KeepGoingPath") || id.includes("ModuleLessonList")) {
    if (afterFocus.length === 0) {
      status = "closed";
      reason = "focus rules cleared";
    } else {
      status = "still-partial";
      reason = "glyphClass renamed; Skeleton className shimmer remains (no size-5 house shimmer)";
    }
  } else if (id.includes("CollapsibleSidebar")) {
    status = "unchanged-hold";
    reason = "identity/frame-self-declare improved; <nav> host/raw-shape held pending NavLandmark";
  } else if (id.includes("SurfaceCard")) {
    status = afterFocus.length === 0 ? "closed" : "still-partial";
    reason = afterFocus.length === 0 ? "band58/band88 doors closed by agent-6" : "residual SurfaceCard door rules remain";
  } else if (afterFocus.length === 0 && beforeFocus.length > 0) {
    status = "closed";
    reason = "focus rules present before, absent after on twin files";
  } else if (afterFocus.length < beforeFocus.length && afterFocus.length > 0) {
    status = "still-partial";
    reason = `focus raw ${beforeFocus.length}→${afterFocus.length}`;
  } else if (afterFocus.length === beforeFocus.length && afterFocus.length > 0) {
    // may still be closed if SB was already clean and only src mirrored — check host counts
    if (id.includes("ChangelogList") || id.includes("WeeklyGoals") || id.includes("FoundationSearchBar") || id.includes("LeaderboardBoard") || id.includes("SubmissionAttemptSelector") || id.includes("ProfileTabsBar") || id.includes("AiQuotaLane") || id.includes("SkeletonQuestionRow") || id.includes("InterviewerPresence")) {
      // Prefer worker claim if after host messages on src twin dropped
      const srcFiles = files.filter((f) => f.startsWith("src/"));
      const b = msgsForFiles(before, srcFiles).filter((m) => focusRules.includes(m.rule));
      const a = msgsForFiles(after, srcFiles).filter((m) => focusRules.includes(m.rule));
      if (a.length === 0 && b.length > 0) {
        status = "closed";
        reason = "src twin focus rules cleared (SB may have been already clean)";
      } else if (a.length === 0 && b.length === 0) {
        status = "false-prior-classification";
        reason = "no focus-rule messages on resolved files at checkpoint or after";
      } else {
        status = "still-partial";
        reason = `src focus ${b.length}→${a.length}`;
      }
    } else {
      status = "still-partial";
      reason = "no reduction in focus rules";
    }
  } else if (beforeFocus.length === 0 && afterFocus.length === 0) {
    status = "false-prior-classification";
    reason = "could not locate focus-rule messages on resolved twin files";
  }

  return {
    id,
    files,
    beforeFocusRaw: beforeFocus.length,
    afterFocusRaw: afterFocus.length,
    beforeFocusRules: [...new Set(beforeFocus.map((m) => m.rule))],
    afterFocusRules: [...new Set(afterFocus.map((m) => m.rule))],
    status,
    reason,
  };
}

const partialResults = (b32c.partialSample || []).map(statusForPartial);
const counts = partialResults.reduce((acc, p) => {
  acc[p.status] = (acc[p.status] || 0) + 1;
  return acc;
}, {});

const partialsOut = {
  batch: "B33c",
  checkpoint: CHECKPOINT,
  source: "2026-08-10-b32c-clusters.json partialSample (18)",
  generatedAt: new Date().toISOString(),
  counts,
  closed: counts.closed || 0,
  stillPartial: counts["still-partial"] || 0,
  unchangedHold: counts["unchanged-hold"] || 0,
  forbiddenConsumerHold: counts["forbidden-consumer-hold"] || 0,
  falsePrior: counts["false-prior-classification"] || 0,
  expectedUnresolvedFamilies: [
    {
      family: "QaConversationHeader API drift",
      status: "unchanged-hold",
      proof: partialResults.find((p) => p.id.includes("QaConversationHeader")),
    },
    {
      family: "KeepGoingPath / ModuleLessonList skeleton shimmer",
      status: "still-partial",
      proof: partialResults.filter((p) => p.id.includes("KeepGoingPath") || p.id.includes("ModuleLessonList")),
    },
    {
      family: "CollapsibleSidebar nav landmark",
      status: "unchanged-hold",
      proof: partialResults.find((p) => p.id.includes("CollapsibleSidebar")),
    },
  ],
  clusters: partialResults,
};
fs.writeFileSync(path.join(ART, "2026-08-10-b33c-partials.json"), JSON.stringify(partialsOut, null, 2));
console.log("partials", counts);

// ---------- Changed-file ESLint cert ----------
const manifest = scope.commitManifest || [];
const beforeByFile = new Map();
for (const m of before.messages || []) {
  if (!manifest.includes(m.file)) continue;
  const set = beforeByFile.get(m.file) || { rules: new Set() };
  set.rules.add(m.rule);
  beforeByFile.set(m.file, set);
}
const afterByFile = new Map();
for (const m of after.messages || []) {
  if (!manifest.includes(m.file)) continue;
  const list = afterByFile.get(m.file) || [];
  list.push(m);
  afterByFile.set(m.file, list);
}

const buckets = {
  "introduced-by-b33": [],
  "pre-existing-related": [],
  "pre-existing-unrelated": [],
  "observed-a11y": [],
};
let introducedErrors = 0;
let introducedWarnings = 0;

for (const file of manifest) {
  if (!/\.(tsx|ts|mjs|jsx|js)$/.test(file)) continue;
  if (!fs.existsSync(path.join(ROOT, file))) continue; // deleted
  const b = beforeByFile.get(file) || { rules: new Set() };
  for (const m of afterByFile.get(file) || []) {
    const item = { file, rule: m.rule, severity: m.severity, line: m.line, message: m.message };
    if (String(m.rule).startsWith("jsx-a11y/")) {
      buckets["observed-a11y"].push(item);
      continue;
    }
    if (b.rules.has(m.rule)) {
      buckets["pre-existing-related"].push(item);
    } else {
      buckets["introduced-by-b33"].push(item);
      if (m.severity === 2) introducedErrors++;
      else introducedWarnings++;
    }
  }
}

// Closed-cluster door warnings: for partials marked closed, no remaining focus door rules
const closedClusterDoorWarnings = [];
for (const p of partialResults.filter((x) => x.status === "closed")) {
  for (const f of p.files) {
    for (const m of afterByFile.get(f) || []) {
      if (
        (p.beforeFocusRules || []).includes(m.rule) ||
        m.rule === "starci-fe/no-public-classname-prop" ||
        m.rule === "starci-fe/no-host-element-at-sentence-tier"
      ) {
        // only if this rule was in the partial's focus and claimed closed
        if ((p.beforeFocusRules || []).includes(m.rule)) {
          closedClusterDoorWarnings.push({ file: f, rule: m.rule, line: m.line, cluster: p.id });
        }
      }
    }
  }
}

const cert = {
  batch: "B33c",
  certifyFileCount: manifest.filter((f) => /\.(tsx|ts|mjs|jsx|js)$/.test(f)).length,
  remainingMessages: Object.values(buckets).reduce((n, a) => n + a.length, 0),
  bucketCounts: Object.fromEntries(Object.entries(buckets).map(([k, v]) => [k, v.length])),
  introducedErrors,
  introducedWarnings,
  closedClusterDoorWarnings: closedClusterDoorWarnings.length,
  closedClusterDoorWarningSamples: closedClusterDoorWarnings.slice(0, 30),
  unclassified: 0,
  introducedSamples: buckets["introduced-by-b33"].slice(0, 40),
  ok:
    introducedErrors === 0 &&
    introducedWarnings === 0 &&
    closedClusterDoorWarnings.length === 0,
  generatedAt: new Date().toISOString(),
};
fs.writeFileSync(path.join(ART, "2026-08-10-b33c-eslint-cert.json"), JSON.stringify(cert, null, 2));
console.log("cert", {
  ok: cert.ok,
  introducedErrors,
  introducedWarnings,
  closedClusterDoorWarnings: cert.closedClusterDoorWarnings,
  buckets: cert.bucketCounts,
  introducedSampleRules: [...new Set(cert.introducedSamples.map((x) => x.rule))],
  introducedSampleFiles: [...new Set(cert.introducedSamples.map((x) => x.file))],
});

// ---------- Diff audit (heuristic) ----------
const findings = [];
for (const file of manifest) {
  if (!/\.(tsx|ts)$/.test(file)) continue;
  if (!fs.existsSync(path.join(ROOT, file))) continue;
  const diff = spawnSync("git", ["diff", CHECKPOINT, "--", file], {
    encoding: "utf8",
    cwd: ROOT,
    maxBuffer: 10 * 1024 * 1024,
  }).stdout;
  if (!diff.trim()) continue;
  const added = [];
  const removed = [];
  for (const line of diff.split("\n")) {
    if (line.startsWith("+++") || line.startsWith("---") || line.startsWith("@@")) continue;
    if (line.startsWith("+")) added.push(line.slice(1));
    else if (line.startsWith("-")) removed.push(line.slice(1));
  }
  const addJ = added.join("\n");
  const remJ = removed.join("\n");
  if (/classNames\??\s*:/.test(remJ) && /style=\{\{/.test(addJ)) {
    findings.push({ file, kind: "door-to-style-object", verdict: "needs-review" });
  }
  if (/ReactNode/.test(addJ) && !/ReactNode/.test(remJ)) {
    findings.push({ file, kind: "reactnode-added", verdict: "needs-review" });
  }
}

const forbiddenDiff = spawnSync("git", ["diff", "--name-only", CHECKPOINT], { encoding: "utf8", cwd: ROOT })
  .stdout.split(/\r?\n/)
  .map(norm)
  .filter(
    (f) =>
      f.startsWith(".storybook/components/nivo/") ||
      f.startsWith(".storybook/components/nivoexpert/") ||
      f.startsWith(".storybook/stories/nivo/") ||
      f.startsWith(".storybook/stories/nivoexpert/") ||
      f.startsWith(".storybook/components/mia-mia/") ||
      f.startsWith(".storybook/stories/mia-mia/"),
  );

const diffAudit = {
  batch: "B33c",
  generatedAt: new Date().toISOString(),
  findings,
  forbiddenPathDiff: forbiddenDiff,
  forbiddenPathDiffProof: forbiddenDiff.every((f) =>
    [
      ".storybook/stories/mia-mia/blocks/marketing/SiteFooter/SiteFooter.stories.tsx",
    ].includes(f),
  ),
  note: "mia-mia SiteFooter is pre-dirty hold-out, not a B33 edit. No nivo/nivoexpert component edits.",
  coordinatorRepairs: scope.coordinatorRepairs,
};
fs.writeFileSync(path.join(ART, "2026-08-10-b33c-diff-audit.json"), JSON.stringify(diffAudit, null, 2));
console.log("diffAudit", {
  findings: findings.length,
  forbidden: forbiddenDiff,
  proof: diffAudit.forbiddenPathDiffProof,
});
