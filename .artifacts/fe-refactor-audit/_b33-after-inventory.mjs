/**
 * B33 after inventory — does not touch B32c artifacts.
 */
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const ROOT = process.cwd();
const ART = path.join(ROOT, ".artifacts/fe-refactor-audit");
const LOCKED_RE = [
  /\/BlockAnatomy\b/i,
  /\/MockInterviewSession\b/,
  /\/QuizSession\b/,
  /\/LearnLoopScroll\b/,
  /\/ContentAiChat\b/,
  /\/ArchitectureScene\b/,
  /\/resources\//,
  /\/(?:nivo|nivoexpert)\//i,
  /\/mia-mia\//i,
];
const norm = (p) => String(p || "").replace(/\\/g, "/");
const rel = (abs) => {
  const n = norm(abs);
  const i = Math.max(n.indexOf("/src/"), n.indexOf("/.storybook/"), n.indexOf("/plugins/"));
  if (i >= 0) return n.slice(i + 1);
  return n;
};
const pathFamily = (file) => {
  const f = norm(file);
  if (f.startsWith("src/components/atoms/")) return "src-atoms";
  if (f.startsWith("src/components/frames/")) return "src-frames";
  if (f.startsWith("src/components/composites/")) return "src-composites";
  if (f.startsWith("src/components/blocks/")) return "src-blocks";
  if (f.startsWith("src/components/pages/")) return "src-pages";
  if (f.startsWith("src/components/layouts/")) return "src-layouts";
  if (f.startsWith("src/components/overlays/")) return "src-overlays";
  if (f.startsWith("src/modules/")) return "src-modules";
  if (f.startsWith(".storybook/components/atoms/")) return "sb-atoms";
  if (f.startsWith(".storybook/components/frames/")) return "sb-frames";
  if (f.startsWith(".storybook/components/composites/")) return "sb-composites";
  if (f.startsWith(".storybook/components/starci/")) return "sb-starci";
  if (f.startsWith(".storybook/components/nivo/")) return "sb-nivo";
  if (f.startsWith(".storybook/components/nivoexpert/")) return "sb-nivoexpert";
  if (f.startsWith(".storybook/components/mia-mia/")) return "sb-mia-mia";
  if (f.startsWith(".storybook/")) return "sb-other";
  return "other";
};
const classifyHold = (file, rule) => {
  if (!rule) return "unknown";
  if (rule.startsWith("jsx-a11y/")) return "a11y-observed";
  if (LOCKED_RE.some((re) => re.test(file))) return "locked";
  return "actionable";
};

const proc = spawnSync(
  "npx",
  ["eslint", "--format", "json", "--no-error-on-unmatched-pattern", "src", ".storybook"],
  { cwd: ROOT, encoding: "buffer", maxBuffer: 256 * 1024 * 1024, shell: true },
);
const out = proc.stdout.toString("utf8");
const start = out.indexOf("[");
const results = JSON.parse(out.slice(start));
const messages = [];
for (const file of results) {
  const fileRel = rel(file.filePath);
  for (const msg of file.messages || []) {
    messages.push({
      file: fileRel,
      rule: msg.ruleId || "unknown",
      severity: msg.severity,
      line: msg.line,
      message: msg.message,
      family: pathFamily(fileRel),
      holdClass: classifyHold(fileRel, msg.ruleId),
    });
  }
}
const byRule = {};
const byFamily = {};
const byHold = {};
const byFile = {};
for (const m of messages) {
  byRule[m.rule] = (byRule[m.rule] || 0) + 1;
  byFamily[m.family] = (byFamily[m.family] || 0) + 1;
  byHold[m.holdClass] = (byHold[m.holdClass] || 0) + 1;
  byFile[m.file] = (byFile[m.file] || 0) + 1;
}
const after = {
  checkpoint: "139391b6",
  batch: "B33",
  command: "npx eslint --format json --no-error-on-unmatched-pattern src .storybook",
  rawMessages: messages.length,
  affectedFiles: Object.keys(byFile).length,
  errors: messages.filter((m) => m.severity === 2).length,
  warnings: messages.filter((m) => m.severity === 1).length,
  starciMessages: messages.filter((m) => String(m.rule).startsWith("starci-fe/")).length,
  a11yMessages: messages.filter((m) => String(m.rule).startsWith("jsx-a11y/")).length,
  byRule,
  byFamily,
  byHoldClass: byHold,
  messages,
  generatedAt: new Date().toISOString(),
};
fs.writeFileSync(path.join(ART, "2026-08-10-b33-eslint-after.json"), JSON.stringify(after));
const before = { raw: 7136, files: 1260, errors: 0, a11y: 11 };
const delta = {
  before,
  after: {
    raw: after.rawMessages,
    files: after.affectedFiles,
    errors: after.errors,
    a11y: after.a11yMessages,
  },
  delta: {
    raw: after.rawMessages - before.raw,
    files: after.affectedFiles - before.files,
    errors: after.errors - before.errors,
  },
};
fs.writeFileSync(path.join(ART, "2026-08-10-b33-eslint-delta.json"), JSON.stringify(delta, null, 2));
console.log(JSON.stringify(delta));
