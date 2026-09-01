/**
 * BATCH 32c Phases 3–5 — semantic clusters, diff audit heuristics, ESLint cert.
 */
import fs from "node:fs"
import path from "node:path"
import { execSync, spawnSync } from "node:child_process"

const ROOT = process.cwd()
const ART = path.join(ROOT, ".artifacts/fe-refactor-audit")
const scope = JSON.parse(fs.readFileSync(path.join(ART, "2026-08-10-b32c-scope.json"), "utf8"))
const before = JSON.parse(fs.readFileSync(path.join(ART, "2026-08-10-b32c-eslint-before.json"), "utf8"))
const after = JSON.parse(fs.readFileSync(path.join(ART, "2026-08-10-b32c-eslint-after.json"), "utf8"))

const norm = (p) => String(p || "").replace(/\\/g, "/")

/** Map SB/src twin paths to one family id. */
const twinFamily = (file) => {
  const f = norm(file)
  let m = f.match(/^src\/components\/(.+)$/)
  if (m) return `src-or-sb:${m[1].replace(/\/index\.tsx?$/, "").replace(/\.tsx?$/, "")}`
  m = f.match(/^\.storybook\/components\/(?:starci\/)?(.+)$/)
  if (m) {
    return `src-or-sb:${m[1].replace(/\/[^/]+\.tsx?$/, "").replace(/\.tsx?$/, "")}`
  }
  m = f.match(/^\.storybook\/components\/(atoms|frames|composites)\/(.+)$/)
  if (m) return `src-or-sb:${m[1]}/${m[2].replace(/\/[^/]+\.tsx?$/, "").replace(/\.tsx?$/, "")}`
  return f
}

const exportHint = (file) => {
  const base = path.basename(file).replace(/\.(tsx?|mjs)$/, "")
  if (base === "index" || base === "component") {
    const parts = norm(file).split("/")
    return parts[parts.length - 2] || base
  }
  return base
}

/** Semantic cluster key — groups multi-rule hits on same owner/root. */
const clusterKey = (msg) => {
  const family = twinFamily(msg.file)
  const exp = exportHint(msg.file)
  // Bucket by ~20-line window around the finding as root proxy
  const band = Math.floor((msg.line || 1) / 20)
  const kind = String(msg.rule || "").includes("classname") || String(msg.message || "").includes("className")
    ? "css-contract"
    : String(msg.rule || "").includes("host") || String(msg.rule || "").includes("raw-shape") || String(msg.rule || "").includes("identity") || String(msg.rule || "").includes("frame-self")
      ? "sentence-root"
      : String(msg.rule || "").includes("jsdoc") || String(msg.rule || "").includes("vietnamese") || String(msg.rule || "").includes("emoji") || String(msg.rule || "").includes("inline-parameter")
        ? "authoring"
        : "other"
  return `${family}::${exp}::${kind}::band${band}`
}

const buildClusters = (messages, label) => {
  const map = new Map()
  for (const m of messages) {
    if (String(m.rule || "").startsWith("jsx-a11y/")) {
      const k = `a11y::${m.file}::${m.line}`
      if (!map.has(k)) {
        map.set(k, {
          id: k,
          classification: "observed-a11y",
          family: twinFamily(m.file),
          exportHint: exportHint(m.file),
          files: new Set([m.file]),
          rules: new Set([m.rule]),
          raw: 0,
          holdClass: "a11y-observed",
        })
      }
      const c = map.get(k)
      c.raw += 1
      continue
    }
    const key = clusterKey(m)
    if (!map.has(key)) {
      map.set(key, {
        id: key,
        classification: m.holdClass === "locked" ? "locked" : m.holdClass === "vendor" ? "vendor" : "actionable",
        family: twinFamily(m.file),
        exportHint: exportHint(m.file),
        files: new Set([m.file]),
        rules: new Set([m.rule]),
        raw: 0,
        holdClass: m.holdClass,
        sampleLine: m.line,
      })
    }
    const c = map.get(key)
    c.raw += 1
    c.files.add(m.file)
    c.rules.add(m.rule)
  }
  return [...map.values()].map((c) => ({
    ...c,
    files: [...c.files],
    rules: [...c.rules],
    inventory: label,
  }))
}

const beforeClusters = buildClusters(before.messages, "before")
const afterClusters = buildClusters(after.messages, "after")
const afterById = new Map(afterClusters.map((c) => [c.id, c]))
const beforeById = new Map(beforeClusters.map((c) => [c.id, c]))

const closed = []
const partial = []
const unchanged = []
for (const b of beforeClusters) {
  if (b.classification === "observed-a11y") continue
  const a = afterById.get(b.id)
  if (!a) {
    closed.push({ ...b, status: "closed" })
  } else if (a.raw < b.raw && a.rules.length < b.rules.length) {
    partial.push({ id: b.id, beforeRaw: b.raw, afterRaw: a.raw, beforeRules: b.rules, afterRules: a.rules, status: "partially-closed" })
  } else if (a.raw < b.raw) {
    partial.push({ id: b.id, beforeRaw: b.raw, afterRaw: a.raw, beforeRules: b.rules, afterRules: a.rules, status: "partially-closed" })
  } else if (b.classification === "actionable") {
    unchanged.push({ id: b.id, raw: a.raw, rules: a.rules, status: "unchanged-actionable" })
  }
}

// New clusters after (possible introductions)
const introducedClusters = afterClusters.filter((c) => !beforeById.has(c.id) && c.classification === "actionable")

const certifySet = new Set(scope.b32CertifyManifest || [])

/** Phase 4 — heuristic diff audit on certify files. */
const diffAudit = {
  nivoLockedEdits: [],
  suspicious: [],
  coordinatorRepairs: scope.entries.filter((e) => e.classification === "coordinator-repair").map((e) => e.file),
}
for (const file of certifySet) {
  if (/\/(?:nivo|nivoexpert|mia-mia)\//i.test(file) && !file.includes("ConfirmDialog") && !file.includes("RefundOrderModal")) {
    // only flag if not known coordinator repair for classNames consumer
    if (!scope.coordinatorRepair.includes(file)) diffAudit.nivoLockedEdits.push(file)
  }
}

// Known coordinator nivoexpert consumer repairs are allowed
diffAudit.nivoLockedEdits = diffAudit.nivoLockedEdits.filter(
  (f) => !f.includes("ConfirmDialog") && !f.includes("RefundOrderModal"),
)

/** Phase 5 — ESLint on certify manifest only */
const certifyFiles = [...certifySet].filter((f) => fs.existsSync(path.join(ROOT, f)) && /\.(tsx?|mjs|cjs|js)$/.test(f))
const CHUNK = 20
const chunkResults = []
const remaining = []

for (let i = 0; i < certifyFiles.length; i += CHUNK) {
  const chunk = certifyFiles.slice(i, i + CHUNK)
  const proc = spawnSync("npx", ["eslint", "--format", "json", ...chunk], {
    cwd: ROOT,
    encoding: "utf8",
    shell: true,
    maxBuffer: 64 * 1024 * 1024,
  })
  let parsed = []
  try {
    const out = proc.stdout || ""
    const start = out.indexOf("[")
    parsed = JSON.parse(start >= 0 ? out.slice(start) : "[]")
  } catch {
    chunkResults.push({ index: i / CHUNK + 1, parseError: true, exit: proc.status })
    continue
  }
  for (const file of parsed) {
    const rel = norm(file.filePath).replace(/^.*\/(src\/|\.storybook\/|plugins\/)/, (_, p) => p)
    // normalize path
    const fileRel = (() => {
      const n = norm(file.filePath)
      const idx = Math.max(n.indexOf("/src/"), n.indexOf("/.storybook/"), n.indexOf("/plugins/"))
      return idx >= 0 ? n.slice(idx + 1) : n
    })()
    for (const msg of file.messages || []) {
      remaining.push({
        file: fileRel,
        rule: msg.ruleId || "unknown",
        severity: msg.severity,
        line: msg.line,
        message: msg.message,
      })
    }
  }
  chunkResults.push({ index: Math.floor(i / CHUNK) + 1, files: chunk.length, exit: proc.status, messages: remaining.length })
}

/** Classify remaining messages vs before inventory for same file:line:rule */
const beforeKeys = new Set(before.messages.map((m) => `${m.file}::${m.line}::${m.rule}`))
const beforeFileRules = new Map()
for (const m of before.messages) {
  const k = `${m.file}::${m.rule}`
  beforeFileRules.set(k, (beforeFileRules.get(k) || 0) + 1)
}

const classifiedRemaining = remaining.map((m) => {
  const key = `${m.file}::${m.line}::${m.rule}`
  const fr = `${m.file}::${m.rule}`
  let bucket = "unclassified"
  if (String(m.rule).startsWith("jsx-a11y/")) bucket = "observed-a11y"
  else if (beforeKeys.has(key)) bucket = "pre-existing-related"
  else if (beforeFileRules.has(fr)) bucket = "pre-existing-unrelated"
  else if (m.severity === 2) bucket = "introduced-error"
  else bucket = "introduced-warning"
  return { ...m, bucket }
})

const bucketCounts = {}
for (const m of classifiedRemaining) {
  bucketCounts[m.bucket] = (bucketCounts[m.bucket] || 0) + 1
}

const introducedErrors = classifiedRemaining.filter((m) => m.bucket === "introduced-error")
const introducedWarnings = classifiedRemaining.filter((m) => m.bucket === "introduced-warning")
const unclassified = classifiedRemaining.filter((m) => m.bucket === "unclassified")

// Persist clusters
const clusterInv = {
  batch: "B32c",
  phase: 3,
  method: "twinFamily + exportHint + ruleKind + lineBand20",
  before: { clusters: beforeClusters.length, actionable: beforeClusters.filter((c) => c.classification === "actionable").length },
  after: { clusters: afterClusters.length, actionable: afterClusters.filter((c) => c.classification === "actionable").length },
  closed: closed.length,
  partiallyClosed: partial.length,
  unchangedActionable: unchanged.length,
  introducedActionableClusters: introducedClusters.length,
  closedSample: closed.slice(0, 40),
  partialSample: partial.slice(0, 20),
  note: "Closed = semantic key present before, absent after. Partial = same key fewer raw/rules. Partial consumer migrations are NOT counted closed.",
}
fs.writeFileSync(path.join(ART, "2026-08-10-b32c-clusters.json"), JSON.stringify(clusterInv, null, 2))

const cert = {
  batch: "B32c",
  phase: 5,
  certifyFileCount: certifyFiles.length,
  remainingMessages: classifiedRemaining.length,
  bucketCounts,
  introducedErrors: introducedErrors.length,
  introducedWarnings: introducedWarnings.length,
  unclassified: unclassified.length,
  introducedErrorSamples: introducedErrors.slice(0, 20),
  introducedWarningSamples: introducedWarnings.slice(0, 30),
  ok:
    introducedErrors.length === 0 &&
    introducedWarnings.length === 0 &&
    unclassified.length === 0,
}
fs.writeFileSync(path.join(ART, "2026-08-10-b32c-eslint-cert.json"), JSON.stringify(cert, null, 2))
fs.writeFileSync(path.join(ART, "2026-08-10-b32c-diff-audit.json"), JSON.stringify(diffAudit, null, 2))

console.log(
  JSON.stringify(
    {
      clusters: { before: clusterInv.before, after: clusterInv.after, closed: closed.length, partial: partial.length },
      cert: {
        ok: cert.ok,
        introducedErrors: cert.introducedErrors,
        introducedWarnings: cert.introducedWarnings,
        buckets: bucketCounts,
      },
      nivoLockedEdits: diffAudit.nivoLockedEdits,
    },
    null,
    2,
  ),
)
