/**
 * BATCH 32 — refill agent-9 and expand thin manifests from cluster JSON.
 * Keeps existing assignments; only adds unowned files. Re-proves disjointness.
 */
import fs from "node:fs"
import path from "node:path"

const ART = path.join(process.cwd(), ".artifacts/fe-refactor-audit")
const manifestsPath = path.join(ART, "2026-08-10-b32-manifests.json")
const invPath = path.join(ART, "2026-08-10-b32-inventory.json")
const rawPath = path.join(ART, "_b32-eslint-raw.json")

const manifests = JSON.parse(fs.readFileSync(manifestsPath, "utf8"))
const inv = JSON.parse(fs.readFileSync(invPath, "utf8"))
const raw = JSON.parse(fs.readFileSync(rawPath, "utf8"))

const norm = (p) => String(p || "").replace(/\\/g, "/")
const rel = (abs) => {
  const n = norm(abs)
  const i = Math.max(n.indexOf("/src/"), n.indexOf("/.storybook/"), n.indexOf("/plugins/"))
  if (i >= 0) return n.slice(i + 1)
  return n.replace(/^.*starci-academy\//, "")
}

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
]

const owned = new Set(Object.values(manifests.agents).flat())

const fileMsgs = new Map()
for (const file of raw) {
  const f = rel(file.filePath)
  if (LOCKED_RE.some((re) => re.test(f))) continue
  if (owned.has(f)) continue
  const msgs = (file.messages || []).filter((m) => m.ruleId && m.ruleId.startsWith("starci-fe/"))
  if (!msgs.length) continue
  fileMsgs.set(f, msgs.length)
}

const AUTHORING = new Set([
  "starci-fe/no-inline-parameter-type",
  "starci-fe/no-emoji-in-source",
  "starci-fe/no-vietnamese-in-source-authoring",
  "starci-fe/prefer-arrow-export",
  "starci-fe/require-export-jsdoc",
  "starci-fe/handler-on-prefix",
  "starci-fe/export-matches-folder",
])

const pick = (pred, limit) => {
  const out = []
  for (const [f, n] of [...fileMsgs.entries()].sort((a, b) => a[1] - b[1])) {
    if (owned.has(f)) continue
    if (!pred(f)) continue
    if (n > 20) continue
    out.push(f)
    owned.add(f)
    if (out.length >= limit) break
  }
  return out
}

// Agent 9: app/modules/hooks with authoring debt
const a9 = pick(
  (f) => f.startsWith("src/app/") || f.startsWith("src/modules/") || f.startsWith("src/hooks/"),
  50,
)
manifests.agents["agent-9-app-modules"].push(...a9)

// Agent 2: more frames if underfilled
const a2need = 40 - manifests.agents["agent-2-frames"].length
if (a2need > 0) {
  manifests.agents["agent-2-frames"].push(
    ...pick((f) => f.includes("/components/frames/"), a2need),
  )
}

// Agent 10: add test files that exist
const oracle = [
  "plugins/eslint/public-contracts.test.mjs",
  "plugins/eslint/sentence-hosts.test.mjs",
  "plugins/eslint/frame-items.test.mjs",
  "plugins/eslint/sentence-tier.test.mjs",
  ".storybook/test-runner/principle-style.test.mjs",
  ".storybook/test-runner/semantic-contracts.test.mjs",
]
for (const f of oracle) {
  if (fs.existsSync(path.join(process.cwd(), f)) && !owned.has(f)) {
    manifests.agents["agent-10-eslint-oracle"].push(f)
    owned.add(f)
  }
}

// Prove disjoint
const seen = new Map()
const overlap = []
for (const [agent, files] of Object.entries(manifests.agents)) {
  for (const f of files) {
    if (seen.has(f)) overlap.push({ file: f, a: seen.get(f), b: agent })
    else seen.set(f, agent)
  }
}

manifests.frozenAt = new Date().toISOString()
manifests.overlapOk = overlap.length === 0
manifests.overlap = overlap
manifests.refill = { agent9: a9.length, agent2Added: Math.max(0, a2need) }

fs.writeFileSync(manifestsPath, JSON.stringify(manifests, null, 2))

// update inventory manifests section
inv.manifests = Object.fromEntries(
  Object.entries(manifests.agents).map(([k, files]) => [k, { fileCount: files.length, files }]),
)
inv.overlapOk = overlap.length === 0
inv.overlap = overlap
fs.writeFileSync(invPath, JSON.stringify(inv, null, 2))

console.log(
  JSON.stringify(
    {
      sizes: Object.fromEntries(Object.entries(manifests.agents).map(([k, v]) => [k, v.length])),
      overlapOk: overlap.length === 0,
      agent9Sample: a9.slice(0, 5),
    },
    null,
    2,
  ),
)
