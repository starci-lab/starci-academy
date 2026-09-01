/**
 * B35c semantic cluster reconstruction from before/after ESLint + commit manifest.
 * Clusters by twin family / exported component folder under allowed StarCi + shared paths.
 */
import fs from "node:fs"

const before = JSON.parse(
  fs.readFileSync(".artifacts/fe-refactor-audit/2026-08-10-b35c-eslint-before.json", "utf8"),
)
const after = JSON.parse(
  fs.readFileSync(".artifacts/fe-refactor-audit/2026-08-10-b35c-eslint-after.json", "utf8"),
)
const scope = JSON.parse(
  fs.readFileSync(".artifacts/fe-refactor-audit/2026-08-10-b35c-scope.json", "utf8"),
)

const ARCH = new Set([
  "starci-fe/no-host-element-at-sentence-tier",
  "starci-fe/no-raw-shape-at-sentence-tier",
  "starci-fe/no-classname-at-sentence-tier",
  "starci-fe/no-cn-above-vocabulary",
  "starci-fe/no-public-classname-prop",
  "starci-fe/require-identity-root",
  "starci-fe/require-frame-self-declare",
  "starci-fe/no-heroui-outside-vocabulary",
  "starci-fe/no-frame-fragment-item",
  "starci-fe/page-folder-two-files-only",
])

const LOCKED = [
  "MockInterviewSession",
  "QuizSession",
  "LearnLoopScroll",
  "ContentAiChat",
  "ArchitectureScene",
  "BlockAnatomy",
]

const norm = (p) => p.replace(/\\/g, "/")

function familyKey(filePath) {
  let rel = norm(filePath).split("/starci-academy/").pop()
  // Strip detached worktree prefix from checkpoint remasure
  rel = rel.replace(/^\.artifacts\/_b35c-worktree-[^/]+\//, "")
  const parts = rel.split("/")
  for (let i = parts.length - 2; i >= 0; i--) {
    const seg = parts[i]
    if (/^[A-Z]/.test(seg) && seg !== "src" && seg !== "components") return seg
  }
  return rel
}

function fileRel(filePath) {
  let rel = norm(filePath).split("/starci-academy/").pop()
  return rel.replace(/^\.artifacts\/_b35c-worktree-[^/]+\//, "")
}

function collect(raw) {
  /** @type {Map<string, {files:Set<string>, rules:Map<string,number>, count:number}>} */
  const map = new Map()
  for (const f of raw) {
    const rel = fileRel(f.filePath)
    const msgs = (f.messages || []).filter((m) => m.severity !== 2 && ARCH.has(m.ruleId))
    if (!msgs.length) continue
    const key = familyKey(f.filePath)
    if (!map.has(key)) map.set(key, { files: new Set(), rules: new Map(), count: 0 })
    const c = map.get(key)
    c.files.add(rel)
    c.count += msgs.length
    for (const m of msgs) c.rules.set(m.ruleId, (c.rules.get(m.ruleId) || 0) + 1)
  }
  return map
}

const B = collect(before)
const A = collect(after)
const commitSet = new Set(scope.commitManifest)

const LOCKED_SET = new Set(LOCKED)
const clusters = []

const allKeys = new Set([...B.keys(), ...A.keys()])
for (const key of [...allKeys].sort()) {
  const b = B.get(key) || { files: new Set(), rules: new Map(), count: 0 }
  const a = A.get(key) || { files: new Set(), rules: new Map(), count: 0 }
  const touched = [...b.files, ...a.files].some((f) => commitSet.has(f) || [...commitSet].some((c) => c.includes(`/${key}/`) || c.endsWith(`/${key}`)))
  const locked = LOCKED_SET.has(key)
  let status
  let reason
  if (locked && a.count > 0) {
    status = "locked"
    reason = "product lock — not burned in B35"
  } else if (b.count > 0 && a.count === 0) {
    status = "fully closed"
    reason = "architectural focus diagnostics absent after"
  } else if (b.count > 0 && a.count > 0 && a.count < b.count && touched) {
    status = "partially closed"
    reason = `focus ${b.count} → ${a.count}`
  } else if (b.count > 0 && a.count >= b.count && touched) {
    status = a.count > b.count ? "regression" : "unchanged actionable"
    reason = `focus ${b.count} → ${a.count}`
  } else if (b.count > 0 && a.count > 0 && !touched) {
    status = "unchanged actionable"
    reason = "not in B35 commit manifest"
  } else if (b.count === 0 && a.count > 0 && touched) {
    status = "regression"
    reason = "new architectural findings on touched family"
  } else {
    continue
  }

  clusters.push({
    id: key,
    status,
    reason,
    beforeFocus: b.count,
    afterFocus: a.count,
    beforeRules: Object.fromEntries(b.rules),
    afterRules: Object.fromEntries(a.rules),
    filesBefore: [...b.files].sort(),
    filesAfter: [...a.files].sort(),
    touchedByB35: touched,
  })
}

const counts = {
  fullyClosed: clusters.filter((c) => c.status === "fully closed").length,
  partiallyClosed: clusters.filter((c) => c.status === "partially closed").length,
  unchangedActionable: clusters.filter((c) => c.status === "unchanged actionable").length,
  locked: clusters.filter((c) => c.status === "locked").length,
  forbiddenConsumerHold: clusters.filter((c) => c.status === "forbidden-consumer hold").length,
  missingContractHold: clusters.filter((c) => c.status === "missing-contract hold").length,
  falsePositive: clusters.filter((c) => c.status === "false positive").length,
  regression: clusters.filter((c) => c.status === "regression").length,
}

const out = {
  batch: "B35c",
  checkpoint: "02011807",
  method:
    "Family key = nearest PascalCase path segment; focus = architectural high-frequency rules only; fully closed = focus count 0 after with before>0",
  counts,
  claims: {
    closedClusterWarnings: clusters
      .filter((c) => c.status === "fully closed")
      .reduce((s, c) => s + c.afterFocus, 0),
    regressions: counts.regression,
  },
  clusters: clusters.sort((a, b) => a.status.localeCompare(b.status) || a.id.localeCompare(b.id)),
}

fs.writeFileSync(".artifacts/fe-refactor-audit/2026-08-10-b35c-clusters.json", JSON.stringify(out, null, 2))
console.log(JSON.stringify({ counts, fullyClosedSample: out.clusters.filter((c) => c.status === "fully closed").slice(0, 15).map((c) => c.id), regressionSample: out.clusters.filter((c) => c.status === "regression").slice(0, 20) }, null, 2))
