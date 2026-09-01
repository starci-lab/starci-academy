/**
 * BATCH 23 — classify no-public-classname-prop hits for ratchet preparation.
 * Does not change the ESLint rule or vendor allowlist.
 */
import fs from "node:fs"
import path from "node:path"

const ROOT = process.cwd()
const ART = path.join(ROOT, ".artifacts/fe-refactor-audit")
const hits = JSON.parse(fs.readFileSync(path.join(ART, "_b23-classname-raw.json"), "utf8"))

const norm = (p) => String(p).replace(/\\/g, "/")
const rel = (abs) => {
  const n = norm(abs)
  const i = Math.max(n.indexOf("/src/"), n.indexOf("/.storybook/"))
  return i >= 0 ? n.slice(i + 1) : n.replace(/^.*starci-academy\//, "")
}

const LOCKED_RE = [
  /\/BlockAnatomy\b/i,
  /\/MockInterviewSession\b/,
  /\/QuizSession\b/,
  /\/LearnLoopScroll\b/,
  /\/ContentAiChat\b/,
  /\/ArchitectureScene\b/,
  /\/resources\//,
]

const TEACHER_PRODUCT_RE = [
  /\/(?:nivo|nivoexpert)\//i,
  /\/mia-mia\//i,
]

const VENDOR_ALLOWLIST = [
  "components/frames/Box",
  "components/atoms/**/Modal|Drawer|Popover|Tooltip|Select|ListBox|Table|AlertDialog|ButtonGroup",
]

const isLocked = (p) => LOCKED_RE.some((r) => r.test("/" + p))
const isTeacherProduct = (p) => TEACHER_PRODUCT_RE.some((r) => r.test("/" + p))

const buckets = {
  "vendor-boundary": [],
  locked: [],
  "teacher-hold": [],
  "live-api": [],
  ambiguous: [],
  "ratchet-ready": [],
}

for (const h of hits) {
  const file = rel(h.file)
  const msg = h.msg
  const isDecl =
    /Public house component prop/.test(msg) ||
    /WithClassNames/.test(msg)
  const isUse = /Do not pass/.test(msg)

  let bucket = "ambiguous"
  if (isLocked(file)) {
    bucket = "locked"
  } else if (isTeacherProduct(file)) {
    bucket = "teacher-hold"
  } else if (isDecl) {
    bucket = "live-api"
  } else if (isUse) {
    bucket = "ratchet-ready"
  }

  buckets[bucket].push({
    file,
    line: h.line,
    kind: isDecl ? "declaration" : isUse ? "usage" : "other",
    message: msg.slice(0, 180),
    bucket,
  })
}

const summary = Object.fromEntries(
  Object.entries(buckets).map(([k, v]) => [k, { hits: v.length, files: new Set(v.map((x) => x.file)).size }]),
)

// Vendor paths are exempted by the rule visitor — they produce zero hits by design.
summary["vendor-boundary"] = {
  hits: 0,
  files: 0,
  note: "Rule skips vendor-boundary files; allowlist unchanged. Paths listed in handoff.",
}

const liveApiFiles = [...new Set(buckets["live-api"].map((r) => r.file))].sort()
const teacherFiles = [...new Set(buckets["teacher-hold"].map((r) => r.file))].sort()
const lockedFiles = [...new Set(buckets.locked.map((r) => r.file))].sort()

const out = {
  generatedAt: new Date().toISOString(),
  scope: ["src/components/**", ".storybook/components/**"],
  rule: "starci-fe/no-public-classname-prop",
  totalHits: hits.length,
  totalFiles: new Set(hits.map((h) => rel(h.file))).size,
  summary,
  vendorAllowlistUnchanged: VENDOR_ALLOWLIST,
  nivoHitsInScope: hits.filter((h) => /\/(?:nivo|nivoexpert)\//i.test(norm(h.file))).length,
  lockedFiles,
  teacherHoldFilesSample: teacherFiles.slice(0, 40),
  liveApiFilesSample: liveApiFiles.slice(0, 60),
  ratchetReadySample: buckets["ratchet-ready"].slice(0, 40).map((r) => `${r.file}:${r.line}`),
  note: [
    "vendor-boundary = allowlisted Box + HeroUI overlay wrappers; zero eslint hits because the rule does not visit them.",
    "locked = BlockAnatomy / LearnLoopScroll / QuizSession / MockInterviewSession / ContentAiChat / ArchitectureScene / resources.",
    "teacher-hold = mia-mia (+ nivo/nivoexpert if any classname hits appear).",
    "live-api = public className/classNames/WithClassNames declarations still on house components.",
    "ratchet-ready = call-site usages outside locked/teacher trees — migrate after live-api doors close; NOT safe to error-ratchet while live-api > 0.",
    "ambiguous = residual unclassified message shapes.",
  ],
  buckets: {
    locked: buckets.locked.slice(0, 25),
    "teacher-hold": buckets["teacher-hold"].slice(0, 25),
    "live-api": buckets["live-api"].slice(0, 40),
    ambiguous: buckets.ambiguous.slice(0, 20),
    "ratchet-ready": buckets["ratchet-ready"].slice(0, 40),
  },
}

fs.writeFileSync(path.join(ART, "2026-08-09-b23-css-door-inventory.json"), JSON.stringify(out, null, 2))

const md = `# BATCH 23 — CSS-door inventory (\`no-public-classname-prop\`)

**Scope:** \`src/components/**\`, \`.storybook/components/**\`  
**Total:** ${hits.length} hits / ${out.totalFiles} files  
**Rule change this batch:** none (allowlist untouched; severity not raised)

## Buckets

| Bucket | Hits | Files |
|---|---:|---:|
| \`vendor-boundary\` | 0 (by design) | allowlisted, not visited |
| \`locked\` | ${summary.locked.hits} | ${summary.locked.files} |
| \`teacher-hold\` | ${summary["teacher-hold"].hits} | ${summary["teacher-hold"].files} |
| \`live-api\` | ${summary["live-api"].hits} | ${summary["live-api"].files} |
| \`ratchet-ready\` | ${summary["ratchet-ready"].hits} | ${summary["ratchet-ready"].files} |
| \`ambiguous\` | ${summary.ambiguous.hits} | ${summary.ambiguous.files} |

## Ratchet readiness

- **Not ready** to flip \`no-public-classname-prop\` to \`error\` while \`live-api\` declarations remain (${summary["live-api"].hits} hits / ${summary["live-api"].files} files).
- \`ratchet-ready\` (${summary["ratchet-ready"].hits} hits) are call-sites that become migrate-or-delete work after owning doors close.
- Do not add eslint-disable to hide debt.
- Vendor allowlist stays for Box + HeroUI Modal/Drawer/Popover/Tooltip/Select/ListBox/Table/AlertDialog/ButtonGroup.
- Nivo/Nivoexpert classname hits in this inventory: **${out.nivoHitsInScope}** (product trees still out of house CSS-door batches).

## Locked files (${lockedFiles.length})

${lockedFiles.map((f) => `- \`${f}\``).join("\n")}

## Live API sample (first 40)

${liveApiFiles.slice(0, 40).map((f) => `- \`${f}\``).join("\n")}
`

fs.writeFileSync(path.join(ART, "2026-08-09-b23-css-door-inventory.md"), md)
console.log(JSON.stringify(summary, null, 2))
console.log("nivoHits", out.nivoHitsInScope)
console.log("wrote inventory")
