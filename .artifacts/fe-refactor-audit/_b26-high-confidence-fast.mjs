/**
 * BATCH 26 — fast high-confidence scan using ripgrep for consumers.
 */
import fs from "node:fs"
import path from "node:path"
import { spawnSync } from "node:child_process"

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
  /\/MiniCart\b/,
  /\/CvPreview\b/,
  /\/PDFView\b/,
  /\/DrawerShell\b/,
  /\/ShowcaseMockup\b/,
]

const HOLD_COMP = new Set([
  "Button",
  "Chip",
  "Stack",
  "StackH",
  "StackV",
  "Grid",
  "GridItem",
  "Box",
  "SurfaceCard",
  "Typography",
  "Skeleton",
  "FieldFrame",
  "ModalShell",
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
    } else if (/\.(tsx|ts)$/.test(ent.name) && !ent.name.includes(".stories.")) out.push(p)
  }
  return out
}

function rgCount(pattern) {
  const r = spawnSync(
    "rg",
    ["-l", "--glob", "*.tsx", "--glob", "*.ts", "-e", pattern, "src", ".storybook"],
    { cwd: ROOT, encoding: "utf8", shell: true },
  )
  const files = (r.stdout || "").trim().split(/\r?\n/).filter(Boolean)
  return files
}

function rgContent(pattern) {
  const r = spawnSync(
    "rg",
    ["-n", "--glob", "*.tsx", "--glob", "*.ts", "-e", pattern, "src", ".storybook"],
    { cwd: ROOT, encoding: "utf8", shell: true },
  )
  return (r.stdout || "").trim().split(/\r?\n/).filter(Boolean)
}

const product = [
  ...walk(path.join(ROOT, "src/components")),
  ...walk(path.join(ROOT, ".storybook/components")),
]

const candidates = []

for (const abs of product) {
  const n = norm(abs)
  const i = Math.max(n.indexOf("/src/"), n.indexOf("/.storybook/"))
  const rel = i >= 0 ? n.slice(i + 1) : n
  if (isLocked(rel)) continue
  const text = fs.readFileSync(abs, "utf8")
  if (!/WithClassNames/.test(text) && !/\bclassNames\??\s*:/.test(text) && !/\bclassName\??\s*:/.test(text))
    continue

  const name =
    path.basename(rel) === "index.tsx" || path.basename(rel) === "index.ts"
      ? path.basename(path.dirname(rel))
      : path.basename(rel).replace(/\.(tsx|ts)$/, "")
  if (HOLD_COMP.has(name)) continue

  const exportFn =
    text.match(new RegExp(`export\\s+const\\s+${name}\\s*=\\s*(?:\\w+\\s*)?\\(\\s*\\{([^}]{0,1200})\\}`, "m")) ||
    text.match(new RegExp(`export\\s+function\\s+${name}\\s*\\(\\s*\\{([^}]{0,1200})\\}`, "m")) ||
    text.match(/export\s+const\s+\w+\s*=\s*\(\s*\{([^}]{0,1200})\}/)

  if (!exportFn) continue
  const dest = exportFn[1]
  const hasWith = /WithClassNames/.test(text)

  for (const prop of ["classNames", "className"]) {
    const typed =
      hasWith ||
      new RegExp(`\\b${prop}\\??\\s*:`).test(text) ||
      new RegExp(`\\b${prop}\\s*\\?`).test(text)
    if (!typed) continue
    // skip if prop never mentioned except maybe WithClassNames alone for the other
    if (!hasWith && !new RegExp(`\\b${prop}\\b`).test(text)) continue
    if (/\bclassNames\??\s*:/.test(text) === false && prop === "classNames" && !hasWith) continue
    if (/\bclassName\??\s*:/.test(text) === false && prop === "className" && !hasWith) continue

    const destHas = new RegExp(`\\b${prop}\\b`).test(dest)
    if (destHas) continue // actually destructured — not this pattern

    candidates.push({ file: rel, component: name, prop, dest: dest.replace(/\s+/g, " ").slice(0, 120) })
  }
}

console.log(`candidates not-destructured: ${candidates.length}`)

const deadDoors = []
const ignored = []

for (const c of candidates) {
  // Consumer search: files containing <Comp and className= or classNames=
  // Use rg for `<Comp` then filter
  const hits = rgContent(`<${c.component}\\b`)
  const consumerHits = []
  for (const line of hits) {
    const [filePart, ...rest] = line.split(":")
    const file = norm(filePart)
    // skip self
    if (file.replace(/\\/g, "/").endsWith(c.file.replace(/^\.\//, ""))) continue
    if (file.includes(c.file)) continue
    const content = rest.join(":")
    // Read a window around the line for multiline props
    const abs = path.isAbsolute(filePart) ? filePart : path.join(ROOT, filePart)
    let window = content
    try {
      const full = fs.readFileSync(abs, "utf8")
      const lineNo = Number(rest[0]) || 1
      const lines = full.split("\n")
      window = lines.slice(Math.max(0, lineNo - 1), Math.min(lines.length, lineNo + 12)).join("\n")
    } catch {}
    if (new RegExp(`\\b${c.prop}\\s*=`).test(window)) {
      // ensure we're still in the Comp tag — crude: no new `<Other` before prop... soft
      consumerHits.push({ file: norm(filePart), line: rest[0], snippet: window.replace(/\s+/g, " ").slice(0, 140) })
    }
  }

  // Dedup definition file false positives
  const filtered = consumerHits.filter((h) => {
    const hn = norm(h.file)
    return !hn.endsWith(c.file) && !hn.includes(`/${c.component}/`)
  })

  if (filtered.length === 0) {
    deadDoors.push({ ...c, kind: "dead-door", consumers: 0 })
  } else {
    ignored.push({ ...c, kind: "ignored-passthrough", consumers: filtered.length, consumerList: filtered.slice(0, 12) })
  }
}

fs.writeFileSync(
  path.join(ART, "2026-08-09-b26-high-confidence.json"),
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      candidateCount: candidates.length,
      deadDoors: deadDoors.length,
      ignoredPassthrough: ignored.length,
      deadDoorsList: deadDoors,
      ignoredList: ignored,
    },
    null,
    2,
  ),
)

console.log(
  JSON.stringify(
    {
      candidates: candidates.length,
      deadDoors: deadDoors.length,
      ignored: ignored.length,
      ignoredDetail: ignored,
      deadByArea: deadDoors.reduce((acc, d) => {
        const area = d.file.includes("/atoms/")
          ? "atoms"
          : d.file.includes("/composites/")
            ? "composites"
            : d.file.includes("/frames/")
              ? "frames"
              : d.file.includes("/blocks/")
                ? "blocks"
                : d.file.includes("/pages/") || d.file.includes("/overlays/")
                  ? "pages"
                  : "other"
        acc[area] = (acc[area] || 0) + 1
        return acc
      }, {}),
      deadSample: deadDoors.slice(0, 60).map((d) => `${d.component}.${d.prop} @ ${d.file}`),
    },
    null,
    2,
  ),
)
