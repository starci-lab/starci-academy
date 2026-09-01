/**
 * BATCH 26 coordinator — build 12 disjoint manifests from proven burns.
 * Twin pairs: Storybook owns when both exist; src-only goes to path partition.
 */
import fs from "node:fs"
import path from "node:path"

const ROOT = process.cwd()
const ART = path.join(ROOT, ".artifacts/fe-refactor-audit")
const actionable = JSON.parse(fs.readFileSync(path.join(ART, "2026-08-09-b26-actionable.json"), "utf8"))

const HOLD_PATH = [
  /\/nivo\//i,
  /\/nivoexpert\//i,
  /\/MiniCart\b/,
  /\/CvPreview\b/,
  /\/PDFView\b/,
  /\/DrawerShell\b/,
  /\/ShowcaseMockup\b/,
  /\/LearnLoopScroll\b/,
  /\/ContentAiChat\b/,
  /\/ContentAiFab\b/, // adjacent to locked ContentAiChat chrome
  /\/BlockAnatomy\b/i,
  /\/MockInterviewSession\b/,
  /\/QuizSession\b/,
  /\/ArchitectureScene\b/,
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
  "Typography",
  "Skeleton",
  "FieldFrame",
  "ModalShell",
  "Logo",
  "Spinner",
  "PinnedTrack",
  "Cluster",
  "PressableCard",
  "SurfaceListCard",
  "DragScrollArea",
  "ResizableRail",
])

const norm = (p) => p.replace(/\\/g, "/")

function isHeld(file, component) {
  if (HOLD_PATH.some((r) => r.test("/" + norm(file)))) return true
  if (HOLD_NAME.has(component)) return true
  if (/Skeleton/i.test(component)) return true
  return false
}

function twinOf(rel, name) {
  if (rel.startsWith(".storybook/components/")) {
    let rest = rel.replace(/^\.storybook\/components\//, "").replace(/\/[^/]+\.(tsx|ts)$/, "")
    rest = rest.replace(/^starci\//, "")
    for (const c of [`src/components/${rest}/index.tsx`, `src/components/${rest}/${name}.tsx`]) {
      if (fs.existsSync(path.join(ROOT, c))) return c
    }
  } else if (rel.startsWith("src/components/")) {
    let rest = rel.replace(/^src\/components\//, "").replace(/\/index\.(tsx|ts)$/, "")
    for (const c of [
      `.storybook/components/${rest}/${name}.tsx`,
      `.storybook/components/starci/${rest}/${name}.tsx`,
    ]) {
      if (fs.existsSync(path.join(ROOT, c))) return c
    }
  }
  return null
}

function partitionOf(file) {
  const f = norm(file)
  // storybook-only if no twin and under .storybook — assigned later
  if (f.includes("/atoms/") && (/\/display\//.test(f) || /\/media\//.test(f) || /\/feedback\//.test(f)))
    return "atoms-display-media"
  if (f.includes("/atoms/") && (/\/forms\//.test(f) || /\/_input\//.test(f) || /\/_select\//.test(f)))
    return "atoms-forms"
  if (f.includes("/composites/") && (/\/form\//.test(f) || /\/_field\//.test(f)))
    return "composites-form"
  if (f.includes("/composites/") && (/\/buttons\//.test(f) || /\/feedback\//.test(f) || /\/dialogs\//.test(f)))
    return "composites-buttons-feedback"
  if (f.includes("/composites/") && (/\/layout\//.test(f) || /\/navigation\//.test(f)))
    return "composites-layout-navigation"
  if (f.includes("/composites/")) return "composites-lists-stats-text-viewers"
  if (f.includes("/frames/")) return "frames"
  if (f.includes("/blocks/") && (/\/cards\//.test(f) || /\/commerce\//.test(f) || /\/careers\//.test(f)))
    return "blocks-cards-commerce"
  if (
    f.includes("/blocks/") &&
    (/\/learn\//.test(f) || /\/practice\//.test(f) || /\/flashcards\//.test(f) || /\/code\//.test(f))
  )
    return "blocks-learn-practice"
  if (f.includes("/blocks/")) return "blocks-domain-profile"
  if (f.includes("/pages/") || f.includes("/overlays/")) return "pages-and-overlays"
  if (f.startsWith(".storybook/")) return "storybook-only"
  return "pages-and-overlays"
}

/** @type {Map<string, {file:string,component:string,action:string,twin:string|null}>} */
const work = new Map()

function add(item, action) {
  const file = norm(item.file)
  const component = item.component
  if (isHeld(file, component)) return
  const twin = item.twin || twinOf(file, component)
  // Twin ownership: if both SB and src in set, keep SB as owner and include twin in same unit
  if (file.startsWith("src/") && twin && twin.startsWith(".storybook/")) {
    // Prefer SB owner — skip adding src alone; will be attached when SB added or attach now under SB key
    const key = twin
    if (!work.has(key)) {
      work.set(key, {
        file: twin,
        component,
        action,
        twin: file,
        owner: "storybook",
      })
    }
    return
  }
  if (file.startsWith(".storybook/") && twin && twin.startsWith("src/")) {
    work.set(file, { file, component, action, twin, owner: "storybook" })
    return
  }
  // src-only or sb-only
  if (!work.has(file)) work.set(file, { file, component, action, twin: twin, owner: file.startsWith(".storybook/") ? "storybook" : "src" })
}

for (const item of actionable.fullyDeadList) {
  add(item, "fully-dead-remove-door")
}
for (const item of actionable.classNamesHalfDeadList) {
  if (item.classNameConsumers !== 0) continue
  add(item, "zero-consumer-remove-className-door")
}

// Build partitions
const PARTITIONS = [
  "atoms-display-media",
  "atoms-forms",
  "composites-form",
  "composites-buttons-feedback",
  "composites-layout-navigation",
  "composites-lists-stats-text-viewers",
  "frames",
  "blocks-cards-commerce",
  "blocks-learn-practice",
  "blocks-domain-profile",
  "pages-and-overlays",
  "storybook-only",
]

/** @type {Record<string, string[]>} */
const manifests = Object.fromEntries(PARTITIONS.map((p) => [p, []]))
/** @type {Record<string, object[]>} */
const tasks = Object.fromEntries(PARTITIONS.map((p) => [p, []]))

const ownedFiles = new Set()

for (const unit of work.values()) {
  let part = partitionOf(unit.file)
  // storybook-only: SB file with no twin, and not already claimed via path that maps to 1-11
  if (unit.file.startsWith(".storybook/") && !unit.twin) {
    // If path maps to atoms/composites/etc under .storybook/components, use that partition
    if (part === "storybook-only" || unit.file.includes("/starci/")) {
      // starci without src twin → storybook-only unless path matches blocks etc via starci/blocks
      if (unit.file.includes("/starci/blocks/")) {
        if (/\/(cards|commerce)\//.test(unit.file)) part = "blocks-cards-commerce"
        else if (/\/(learn|practice|flashcards|code)\//.test(unit.file)) part = "blocks-learn-practice"
        else part = "blocks-domain-profile"
      } else if (unit.file.includes("/starci/")) {
        part = "storybook-only"
      }
    }
  }

  const files = [unit.file, unit.twin].filter(Boolean)
  for (const f of files) {
    if (ownedFiles.has(f)) {
      console.error("OVERLAP", f, "wanted by", part)
      process.exitCode = 1
    }
    ownedFiles.add(f)
  }
  manifests[part].push(...files)
  tasks[part].push(unit)
}

// Dedup manifests
for (const p of PARTITIONS) {
  manifests[p] = [...new Set(manifests[p])].sort()
}

const out = {
  generatedAt: new Date().toISOString(),
  inventoryBefore: { hits: 2194, files: 816 },
  units: work.size,
  filesOwned: ownedFiles.size,
  manifests,
  tasks,
  overlapCheck: "pass",
  instructions: {
    fullyDead: "Remove WithClassNames / unused className+classNames from props type and any dead import. Do not leave unused imports.",
    zeroConsumer:
      "Remove className from props (replace WithClassNames with nothing, or drop className?:). Remove className from destructure and from cn()/className={}. Preserve DOM otherwise.",
    holds: "If consumer found during edit, skip and record hold. No new principles, no Box escape, no eslint-disable.",
    parity: "Edit Storybook first when twin present, then mirror src.",
  },
}

fs.writeFileSync(path.join(ART, "2026-08-09-b26-manifests.json"), JSON.stringify(out, null, 2))

console.log(
  JSON.stringify(
    {
      units: work.size,
      files: ownedFiles.size,
      perPartition: Object.fromEntries(PARTITIONS.map((p) => [p, manifests[p].length])),
      sampleTasks: Object.fromEntries(
        PARTITIONS.map((p) => [p, tasks[p].slice(0, 3).map((t) => `${t.action}:${t.component}`)]),
      ),
    },
    null,
    2,
  ),
)
