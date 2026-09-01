/**
 * BATCH 25 deep scan — principles, ambiguous tokens, duplicates, dead doors.
 */
import fs from "node:fs"
import path from "node:path"

const ROOT = process.cwd()
const ART = path.join(ROOT, ".artifacts/fe-refactor-audit")
const hits = JSON.parse(fs.readFileSync(path.join(ART, "_b25-classname-raw.json"), "utf8"))

const TARGET = new Set([
  "Typography",
  "Skeleton",
  "ProgressMeter",
  "UserAvatar",
  "TitledText",
  "EnumChip",
  "EmptyState",
  "SimpleEmptyState",
  "LabeledAccordionCard",
  "SurfaceListCard",
  "ProfileSectionGuard",
])

const HOLD = new Set([
  "DrawerShell",
  "ShowcaseMockup",
  "SurfaceCard",
  "MiniCart",
  "CvPreview",
  "PDFView",
  "Box",
  "ModalShell",
  "Button",
  "Chip",
  "StackH",
  "StackV",
  "Grid",
  "Nivo",
  "NivoExpert",
])

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

const norm = (p) => String(p).replace(/\\/g, "/")
const isLocked = (p) => LOCKED_RE.some((r) => r.test("/" + norm(p)))

const byComp = {}
const ambiguous = []
const AMBIG_TOKENS = new Set(["w-full", "flex-1", "shrink-0", "w-1/2", "min-w-0", "self-start", "self-end", "self-center"])

for (const h of hits) {
  const m = h.msg && h.msg.match(/house component `(\w+)`/)
  if (!m) continue
  const c = m[1]
  byComp[c] = (byComp[c] || 0) + 1
  if (!TARGET.has(c)) continue
  if (isLocked(h.file)) continue
  ambiguous.push({
    file: norm(h.file),
    line: h.line,
    component: c,
    msg: h.msg,
  })
}

// Extract actual classNames values near those lines from source
function extractClassNear(file, line) {
  if (!fs.existsSync(file)) return null
  const lines = fs.readFileSync(file, "utf8").split(/\r?\n/)
  const start = Math.max(0, line - 8)
  const end = Math.min(lines.length, line + 12)
  const window = lines.slice(start, end).join("\n")
  const m1 = window.match(/classNames=\{\s*(\[[^\]]*\]|"[^"]*"|'[^']*'|[^\s}]+)/)
  const m2 = window.match(/className=\{?\s*(?:"([^"]*)"|'([^']*)'|`([^`]*)`|(\[[^\]]*\]))/)
  return {
    snippet: window.replace(/\s+/g, " ").slice(0, 280),
    classNames: m1 ? m1[1] : null,
    className: m2 ? m2[1] || m2[2] || m2[3] || m2[4] : null,
  }
}

const enriched = []
for (const a of ambiguous) {
  const file = a.file.startsWith("D:") || a.file.startsWith("/") ? a.file : path.join(ROOT, a.file)
  const ext = extractClassNear(file, a.line)
  enriched.push({ ...a, ...ext })
}

// Group by class token patterns for targets
const tokenGroups = {}
for (const e of enriched) {
  const raw = e.classNames || e.className || ""
  const tokens = [...String(raw).matchAll(/["'`]([a-z0-9:/\[\]%-]+)["'`]/g)].map((x) => x[1])
  const key = tokens.filter((t) => AMBIG_TOKENS.has(t)).sort().join(" ") || "(other)"
  if (!tokenGroups[key]) tokenGroups[key] = []
  tokenGroups[key].push({
    file: e.file.replace(/\\/g, "/").replace(norm(ROOT) + "/", ""),
    line: e.line,
    component: e.component,
    tokens,
    raw: String(raw).slice(0, 80),
  })
}

// Scan pages for Typography/Skeleton classNames with placement-only tokens
function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name)
    if (ent.isDirectory()) {
      if (["node_modules", "dist", ".next"].includes(ent.name)) continue
      walk(p, out)
    } else if (/\.(tsx|ts)$/.test(ent.name) && !ent.name.includes(".stories.")) out.push(p)
  }
  return out
}

const pageRoots = [
  path.join(ROOT, "src/components/pages"),
  path.join(ROOT, "src/components/atoms"),
  path.join(ROOT, "src/components/composites"),
  path.join(ROOT, "src/components/blocks"),
]

const placementRe =
  /<(Typography|Skeleton|ProgressMeter|UserAvatar|TitledText|EnumChip|EmptyState|SimpleEmptyState|LabeledAccordionCard|SurfaceListCard|ProfileSectionGuard)\b[\s\S]{0,400}?(classNames=\{\s*(\[[^\]]*\])\s*\}|className=\{?\s*(?:"([^"]*)"|'([^']*)'|(\[[^\]]*\])))/g

const pageHits = []
for (const abs of pageRoots.flatMap((r) => walk(r))) {
  const n = norm(abs)
  if (isLocked(n)) continue
  const text = fs.readFileSync(abs, "utf8")
  let m
  placementRe.lastIndex = 0
  while ((m = placementRe.exec(text))) {
    const line = text.slice(0, m.index).split("\n").length
    const cls = m[3] || m[4] || m[5] || m[6] || ""
    const tokens = [...String(cls).matchAll(/["'`]?([a-z0-9:/\[\]%-]+)["'`]?/g)]
      .map((x) => x[1])
      .filter((t) => /^[a-z]/.test(t) && t.length > 1)
    const ambig = tokens.filter((t) => AMBIG_TOKENS.has(t))
    pageHits.push({
      file: n.replace(norm(ROOT) + "/", ""),
      line,
      component: m[1],
      cls: String(cls).slice(0, 100),
      ambig,
      onlyAmbig: ambig.length > 0 && tokens.every((t) => AMBIG_TOKENS.has(t) || t === "[" || t === "]"),
    })
  }
}

// Look for literal duplicate of defaults: Typography skeleton w-1/2, UserAvatar rounded-full, SimpleEmptyState text-sm text-muted, ProgressMeter content-row internal
const duplicateCandidates = []
const DEFAULTS = [
  { component: "UserAvatar", tokens: ["rounded-full"], note: "UserAvatar already applies rounded-full" },
  { component: "SimpleEmptyState", tokens: ["text-sm", "text-muted"], note: "SimpleEmptyState already applies text-sm text-muted" },
  { component: "Typography", tokens: [], note: "skeleton branch already has inline-block w-1/2 rounded" },
  { component: "TitledText", tokens: ["min-w-0"], note: "TitledText already prepends min-w-0" },
  { component: "EmptyState", tokens: ["block"], note: "EmptyState root already has block" },
]

for (const abs of [...walk(path.join(ROOT, "src")), ...walk(path.join(ROOT, ".storybook/components"))]) {
  const n = norm(abs)
  if (isLocked(n)) continue
  if (/\.stories\./.test(n)) continue
  const text = fs.readFileSync(abs, "utf8")
  const rel = n.replace(norm(ROOT) + "/", "")

  // UserAvatar className="rounded-full" or classNames with only rounded-full
  {
    const re = /<UserAvatar\b[^>]*className=\{?\s*["'`]([^"'`]+)["'`]/g
    let m
    while ((m = re.exec(text))) {
      const toks = m[1].trim().split(/\s+/)
      if (toks.every((t) => t === "rounded-full")) {
        duplicateCandidates.push({
          file: rel,
          line: text.slice(0, m.index).split("\n").length,
          component: "UserAvatar",
          change: "remove className (duplicate of internal rounded-full)",
          evidence: "UserAvatar applies cn(\"rounded-full\", className)",
        })
      }
    }
  }

  // TitledText classNames including only min-w-0 or leading with min-w-0 alone
  {
    const re = /<TitledText\b[\s\S]{0,300}?classNames=\{\s*\[([^\]]*)\]\s*\}/g
    let m
    while ((m = re.exec(text))) {
      const toks = [...m[1].matchAll(/["'`]([^"'`]+)["'`]/g)].map((x) => x[1])
      if (toks.length === 1 && toks[0] === "min-w-0") {
        duplicateCandidates.push({
          file: rel,
          line: text.slice(0, m.index).split("\n").length,
          component: "TitledText",
          change: "remove classNames={[\"min-w-0\"]} (TitledText already prepends min-w-0)",
          evidence: "TitledText: rootClassNames = [\"min-w-0\", ...(classNames ?? [])]",
        })
      }
    }
  }

  // Typography isSkeleton with classNames w-1/2 only
  {
    const re = /<Typography\b[\s\S]{0,350}?classNames=\{\s*\[([^\]]*)\]\s*\}/g
    let m
    while ((m = re.exec(text))) {
      const chunk = m[0]
      const toks = [...m[1].matchAll(/["'`]([^"'`]+)["'`]/g)].map((x) => x[1])
      if (toks.length === 1 && toks[0] === "w-1/2" && /isSkeleton/.test(chunk)) {
        duplicateCandidates.push({
          file: rel,
          line: text.slice(0, m.index).split("\n").length,
          component: "Typography",
          change: "remove classNames={[\"w-1/2\"]} on isSkeleton (default already inline-block w-1/2 rounded)",
          evidence: "Typography skeleton: cn(\"inline-block w-1/2 rounded\", SKEL_H[size], classNames)",
        })
      }
    }
  }

  // SimpleEmptyState with only text-sm / text-muted
  {
    const re = /<SimpleEmptyState\b[^>]*className=\{?\s*["'`]([^"'`]+)["'`]/g
    let m
    while ((m = re.exec(text))) {
      const toks = m[1].trim().split(/\s+/)
      if (toks.every((t) => t === "text-sm" || t === "text-muted") && toks.length > 0) {
        duplicateCandidates.push({
          file: rel,
          line: text.slice(0, m.index).split("\n").length,
          component: "SimpleEmptyState",
          change: `remove className="${m[1]}" (duplicate of internal defaults)`,
          evidence: 'SimpleEmptyState: cn("text-sm text-muted", className)',
        })
      }
    }
  }

  // EmptyState classNames={["block"]} only
  {
    const re = /<EmptyState\b[\s\S]{0,350}?classNames=\{\s*\[([^\]]*)\]\s*\}/g
    let m
    while ((m = re.exec(text))) {
      const toks = [...m[1].matchAll(/["'`]([^"'`]+)["'`]/g)].map((x) => x[1])
      if (toks.length === 1 && toks[0] === "block") {
        duplicateCandidates.push({
          file: rel,
          line: text.slice(0, m.index).split("\n").length,
          component: "EmptyState",
          change: 'remove classNames={["block"]} (EmptyState already applies block)',
          evidence: 'EmptyState: className={cn("block", classNames)}',
        })
      }
    }
  }
}

// Verify dead passthrough candidates carefully
const dead = JSON.parse(fs.readFileSync(path.join(ART, "2026-08-09-b25-dead-passthrough.json"), "utf8"))

function verifyDead(file, prop) {
  const abs = path.join(ROOT, file)
  if (!fs.existsSync(abs)) return { file, prop, status: "missing-file" }
  const text = fs.readFileSync(abs, "utf8")
  // Find all identifier uses in expression positions (not types)
  const stripped = text
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/.*$/gm, "")
  const uses = []
  const re = new RegExp(`\\b${prop}\\b`, "g")
  let m
  while ((m = re.exec(stripped))) {
    const before = stripped.slice(Math.max(0, m.index - 40), m.index)
    const after = stripped.slice(m.index, m.index + 60)
    uses.push({ before: before.replace(/\s+/g, " "), after: after.replace(/\s+/g, " ") })
  }
  // Consumers: search for <Comp className or classNames across src
  return { file, prop, mentionCount: uses.length, uses: uses.slice(0, 12) }
}

const deadVerified = dead.deadPassthrough.map((d) => verifyDead(d.file, d.prop))

// Consumer search for dead-door wrappers
function findConsumers(componentName, prop) {
  const consumers = []
  const re = new RegExp(`<${componentName}\\b[\\s\\S]{0,400}?\\b${prop}=`, "g")
  for (const abs of walk(path.join(ROOT, "src"))) {
    const text = fs.readFileSync(abs, "utf8")
    let m
    while ((m = re.exec(text))) {
      consumers.push({
        file: norm(abs).replace(norm(ROOT) + "/", ""),
        line: text.slice(0, m.index).split("\n").length,
        snippet: m[0].replace(/\s+/g, " ").slice(0, 160),
      })
    }
  }
  return consumers
}

const deadConsumerReport = []
const nameFromFile = (f) => {
  // Cluster/index.tsx -> Cluster; Logo/index.tsx -> Logo
  const parts = f.replace(/\\/g, "/").split("/")
  const idx = parts.lastIndexOf("index.tsx")
  if (idx > 0) return parts[idx - 1]
  return path.basename(f, path.extname(f))
}

for (const d of dead.deadPassthrough) {
  const name = nameFromFile(d.file)
  // skip storybook twins when src twin exists — report both
  const consumers = findConsumers(name, d.prop)
  deadConsumerReport.push({
    file: d.file,
    prop: d.prop,
    componentGuess: name,
    consumers: consumers.slice(0, 20),
    consumerCount: consumers.length,
  })
}

const out = {
  generatedAt: new Date().toISOString(),
  hitCountsByTarget: Object.fromEntries([...TARGET].map((c) => [c, byComp[c] || 0])),
  allCompTop: Object.entries(byComp)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 40),
  tokenGroups: Object.fromEntries(
    Object.entries(tokenGroups).map(([k, v]) => [k, { count: v.length, sample: v.slice(0, 15) }]),
  ),
  pageHitsOnlyAmbig: pageHits.filter((h) => h.onlyAmbig || h.ambig.length),
  pageHitsSample: pageHits.slice(0, 40),
  pageHitsCount: pageHits.length,
  duplicateCandidates,
  deadVerified,
  deadConsumerReport,
}

fs.writeFileSync(path.join(ART, "2026-08-09-b25-deep-scan.json"), JSON.stringify(out, null, 2))
console.log(
  JSON.stringify(
    {
      hitCountsByTarget: out.hitCountsByTarget,
      tokenGroupKeys: Object.keys(tokenGroups).map((k) => [k, tokenGroups[k].length]),
      pageHits: pageHits.length,
      pageHitsAmbig: pageHits.filter((h) => h.ambig.length).length,
      duplicates: duplicateCandidates.length,
      duplicateSample: duplicateCandidates.slice(0, 30),
      deadConsumers: deadConsumerReport.map((d) => ({
        file: d.file,
        prop: d.prop,
        consumers: d.consumerCount,
      })),
    },
    null,
    2,
  ),
)
