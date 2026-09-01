/**
 * BATCH 26 — prove dead doors / redundant call sites with consumer search.
 */
import fs from "node:fs"
import path from "node:path"

const ROOT = process.cwd()
const ART = path.join(ROOT, ".artifacts/fe-refactor-audit")

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
const HOLD_NAME = new Set([
  "Button",
  "Chip",
  "Stack",
  "StackH",
  "StackV",
  "Grid",
  "GridItem",
  "Box",
  "SurfaceCard",
  "DrawerShell",
  "ShowcaseMockup",
  "MiniCart",
  "CvPreview",
  "PDFView",
  "ModalShell",
  "FieldFrame",
  "Typography",
  "Skeleton",
  "Avatar",
  "UserAvatar",
  "PinnedTrack",
  "Cluster",
])

const norm = (p) => String(p).replace(/\\/g, "/")
const isLocked = (p) => LOCKED_RE.some((r) => r.test("/" + norm(p)))

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name)
    if (ent.isDirectory()) {
      if (["node_modules", "dist", ".next"].includes(ent.name)) continue
      walk(p, out)
    } else if (/\.(tsx|ts)$/.test(ent.name)) out.push(p)
  }
  return out
}

const allTsx = [
  ...walk(path.join(ROOT, "src")),
  ...walk(path.join(ROOT, ".storybook")),
].filter((p) => /\.(tsx|ts)$/.test(p) && !p.includes("node_modules"))

const product = [
  ...walk(path.join(ROOT, "src/components")),
  ...walk(path.join(ROOT, ".storybook/components")),
].filter((p) => /\.(tsx|ts)$/.test(p) && !p.includes(".stories."))

function relOf(abs) {
  const n = norm(abs)
  const i = Math.max(n.indexOf("/src/"), n.indexOf("/.storybook/"))
  return i >= 0 ? n.slice(i + 1) : n
}

function componentName(abs) {
  const base = path.basename(abs)
  if (base === "index.tsx" || base === "index.ts") return path.basename(path.dirname(abs))
  return base.replace(/\.(tsx|ts)$/, "")
}

/** Does the implementation consume className/classNames? */
function consumesProp(text, prop) {
  // strip types/interfaces/comments roughly
  let body = text
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/.*$/gm, "")
  // Remove type/interface blocks
  body = body.replace(/export\s+interface\s+\w+[^{]*\{[\s\S]*?\n\}/g, "")
  body = body.replace(/interface\s+\w+[^{]*\{[\s\S]*?\n\}/g, "")
  body = body.replace(/export\s+type\s+\w+[^=]*=[\s\S]*?;/g, "")
  body = body.replace(/type\s+\w+[^=]*=[\s\S]*?;/g, "")

  // usages that indicate consumption
  const patterns = [
    new RegExp(`cn\\([^)]*\\b${prop}\\b`),
    new RegExp(`twMerge\\([^)]*\\b${prop}\\b`),
    new RegExp(`clsx\\([^)]*\\b${prop}\\b`),
    new RegExp(`${prop}\\s*\\?\\?`),
    new RegExp(`${prop}\\s*&&`),
    new RegExp(`\\.\\.\\.${prop}`),
    new RegExp(`\\[\\s*\\.\\.\\.${prop}`),
    new RegExp(`className=\\{[^}]*\\b${prop}\\b`),
    new RegExp(`classNames=\\{[^}]*\\b${prop}\\b`),
    new RegExp(`\\{\\s*\\.\\.\\.[^}]*\\b${prop}\\b`),
    new RegExp(`,\\s*${prop}\\s*[,)}]`),
    new RegExp(`\\(${prop}\\)`),
    new RegExp(`${prop}\\.join`),
    new RegExp(`Array\\.isArray\\(${prop}\\)`),
  ]
  if (patterns.some((re) => re.test(body))) return true

  // count remaining identifier uses after removing destructure lines
  const withoutDest = body.replace(
    new RegExp(`\\([^)]*\\b${prop}\\b[^)]*\\)\\s*(?:=>|:|\\{)`, "g"),
    "()",
  )
  const count = (withoutDest.match(new RegExp(`\\b${prop}\\b`, "g")) || []).length
  return count >= 1
}

function declaresDoor(text) {
  const hasClassNames =
    /WithClassNames/.test(text) ||
    /\bclassNames\??\s*:/.test(text) ||
    /\bclassNames\s*,/.test(text) ||
    /\bclassNames\s*\}/.test(text)
  const hasClassName =
    /WithClassNames/.test(text) ||
    /\bclassName\??\s*:/.test(text) ||
    /\bclassName\s*,/.test(text) ||
    /\bclassName\s*\}/.test(text)
  return { hasClassNames, hasClassName }
}

/** Find JSX consumers: <Comp ... className= or classNames= */
function findConsumers(compName, prop) {
  const consumers = []
  // open tag Comp with prop nearby (same tag roughly — scan files)
  const tagRe = new RegExp(`<${compName}\\b[^>]{0,400}${prop}\\s*=`, "g")
  const multiRe = new RegExp(`<${compName}\\b[\\s\\S]{0,300}?${prop}\\s*=`, "g")
  for (const abs of allTsx) {
    const rel = relOf(abs)
    if (isLocked(rel)) continue
    // skip the component's own file
    if (componentName(abs) === compName && /\/components\//.test(rel)) {
      // still allow if it's a different path - skip definition files by checking export
      const t = fs.readFileSync(abs, "utf8")
      if (new RegExp(`export\\s+(const|function)\\s+${compName}\\b`).test(t)) continue
    }
    const text = fs.readFileSync(abs, "utf8")
    if (!text.includes(`<${compName}`)) continue
    if (!new RegExp(`${prop}\\s*=`).test(text)) continue
    // multiline-aware crude check
    multiRe.lastIndex = 0
    let m
    while ((m = multiRe.exec(text))) {
      // ensure no other component open tag between
      const chunk = m[0]
      if ((chunk.match(/</g) || []).length > 1) {
        // might have nested — still count as candidate for human verify
      }
      consumers.push({
        file: rel,
        line: text.slice(0, m.index).split("\n").length,
        snippet: chunk.replace(/\s+/g, " ").slice(0, 160),
      })
      if (consumers.length > 20) return consumers
    }
  }
  return consumers
}

const provenDead = []
const liveDoors = []
const ambiguousDoors = []

for (const abs of product) {
  const rel = relOf(abs)
  if (isLocked(rel)) continue
  const name = componentName(abs)
  if (HOLD_NAME.has(name)) continue
  if (name.endsWith("Base") || name.startsWith("_")) {
    // private helpers — still check
  }
  const text = fs.readFileSync(abs, "utf8")
  const doors = declaresDoor(text)
  if (!doors.hasClassName && !doors.hasClassNames) continue

  // Must be an exported component-ish file
  if (!/export\s+(const|function|type|interface)\s+/.test(text)) continue

  for (const prop of ["classNames", "className"]) {
    if (prop === "classNames" && !doors.hasClassNames) continue
    if (prop === "className" && !doors.hasClassName) continue
    // Skip if WithClassNames only provides the other
    if (!new RegExp(`\\b${prop}\\b`).test(text) && !/WithClassNames/.test(text)) continue

    const used = consumesProp(text, prop)
    const consumers = findConsumers(name, prop)

    const row = {
      file: rel,
      component: name,
      prop,
      consumedInImpl: used,
      consumerCount: consumers.length,
      consumers: consumers.slice(0, 8),
      twin: null,
    }

    // twin path
    if (rel.startsWith(".storybook/components/")) {
      const rest = rel.replace(/^\.storybook\/components\//, "").replace(/\/[^/]+\.tsx$/, "")
      const leaf = name
      const candidates = [
        `src/components/${rest}/index.tsx`,
        `src/components/${rest}/${leaf}.tsx`,
      ]
      // starci path mapping
      const starci = rest.replace(/^starci\//, "")
      candidates.push(`src/components/${starci}/index.tsx`)
      for (const c of candidates) {
        if (fs.existsSync(path.join(ROOT, c))) {
          row.twin = c
          break
        }
      }
    } else if (rel.startsWith("src/components/")) {
      const rest = rel.replace(/^src\/components\//, "").replace(/\/index\.tsx$/, "")
      const candidates = [
        `.storybook/components/${rest}/${name}.tsx`,
        `.storybook/components/starci/${rest}/${name}.tsx`,
      ]
      for (const c of candidates) {
        if (fs.existsSync(path.join(ROOT, c))) {
          row.twin = c
          break
        }
      }
    }

    if (!used && consumers.length === 0) {
      provenDead.push(row)
    } else if (used && consumers.length > 0) {
      liveDoors.push(row)
    } else if (!used && consumers.length > 0) {
      // ignored passthrough with live callers — call-site burn only
      provenDead.push({ ...row, kind: "ignored-passthrough-with-callers" })
    } else {
      // used but zero consumers — live API hold (potential future) OR burnable public door
      // B24 burned zero-consumer doors even if... wait B24 burned doors that weren't consumed AND zero JSX consumers.
      // If used in impl but zero consumers, the door is unused publicly — can burn prop AND simplify impl.
      // That's riskier. Classify as burnable-dead-public-api only if we can prove.
      if (used && consumers.length === 0) {
        provenDead.push({ ...row, kind: "zero-consumer-but-impl-uses" })
      } else {
        ambiguousDoors.push(row)
      }
    }
  }
}

// Filter: zero-consumer-but-impl-uses is NOT safe for B26 without carefully removing impl wiring —
// only burn if it's a pure dead declaration. Prefer ignored-passthrough and fully dead.

const appliable = provenDead.filter(
  (r) =>
    r.kind === "ignored-passthrough-with-callers" ||
    (!r.consumedInImpl && r.consumerCount === 0 && !r.kind),
)

const holdZeroConsumerImpl = provenDead.filter((r) => r.kind === "zero-consumer-but-impl-uses")

fs.writeFileSync(
  path.join(ART, "2026-08-09-b26-proven.json"),
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      appliableCount: appliable.length,
      appliable,
      holdZeroConsumerImplCount: holdZeroConsumerImpl.length,
      holdZeroConsumerImpl: holdZeroConsumerImpl.slice(0, 40),
      liveSample: liveDoors.slice(0, 20),
      note: "appliable = dead door (unused + 0 consumers) OR ignored passthrough with callers (call-site only)",
    },
    null,
    2,
  ),
)

console.log(
  JSON.stringify(
    {
      appliable: appliable.length,
      ignoredWithCallers: appliable.filter((a) => a.kind === "ignored-passthrough-with-callers").length,
      fullyDead: appliable.filter((a) => !a.kind).length,
      holdImplOnly: holdZeroConsumerImpl.length,
      sample: appliable.slice(0, 40).map((a) => ({
        file: a.file,
        prop: a.prop,
        kind: a.kind || "fully-dead",
        consumers: a.consumerCount,
        twin: a.twin,
      })),
    },
    null,
    2,
  ),
)
