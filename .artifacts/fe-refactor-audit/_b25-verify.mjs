/**
 * Verify APPLIABLE burns: Typography w-1/2 duplicates, LabeledAccordionCard dead door,
 * ProfileSectionGuard partial ignore, dead wrappers that ignore passed classes.
 */
import fs from "node:fs"
import path from "node:path"

const ROOT = process.cwd()
const ART = path.join(ROOT, ".artifacts/fe-refactor-audit")

const norm = (p) => String(p).replace(/\\/g, "/")

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

function findTagProps(text, tag) {
  // crude JSX opener finder for <Tag ...>
  const results = []
  const re = new RegExp(`<${tag}\\b`, "g")
  let m
  while ((m = re.exec(text))) {
    let i = m.index + m[0].length
    let depth = 0
    let end = -1
    for (; i < text.length; i++) {
      const ch = text[i]
      if (ch === "{") depth++
      else if (ch === "}") depth--
      else if (depth === 0 && (ch === ">" || (ch === "/" && text[i + 1] === ">"))) {
        end = i
        break
      }
    }
    if (end < 0) continue
    const props = text.slice(m.index, end)
    const line = text.slice(0, m.index).split("\n").length
    results.push({ line, props })
  }
  return results
}

const typographyDupes = []
const typographyW12Live = [] // w-1/2 without isSkeleton — NOT duplicate of skeleton default
const titledMinW0 = []
const emptyBlock = []
const userAvatarRounded = []
const simpleEmptyDup = []
const labeledAccordionConsumers = []
const profileGuardConsumers = []
const surfaceListConsumers = []

const files = [...walk(path.join(ROOT, "src")), ...walk(path.join(ROOT, ".storybook/components"))]

for (const abs of files) {
  const rel = norm(abs).replace(norm(ROOT) + "/", "")
  const text = fs.readFileSync(abs, "utf8")

  for (const hit of findTagProps(text, "Typography")) {
    const cnMatch = hit.props.match(/classNames=\{\s*\[([^\]]*)\]/)
    if (!cnMatch) continue
    const toks = [...cnMatch[1].matchAll(/["'`]([^"'`]+)["'`]/g)].map((x) => x[1])
    if (toks.length === 1 && toks[0] === "w-1/2") {
      const hasSkel = /\bisSkeleton\b/.test(hit.props)
      const entry = { file: rel, line: hit.line, props: hit.props.replace(/\s+/g, " ").slice(0, 220) }
      if (hasSkel) typographyDupes.push(entry)
      else typographyW12Live.push(entry)
    }
  }

  for (const hit of findTagProps(text, "TitledText")) {
    const cnMatch = hit.props.match(/classNames=\{\s*\[([^\]]*)\]/)
    if (!cnMatch) continue
    const toks = [...cnMatch[1].matchAll(/["'`]([^"'`]+)["'`]/g)].map((x) => x[1])
    if (toks.length === 1 && toks[0] === "min-w-0") {
      titledMinW0.push({ file: rel, line: hit.line })
    }
  }

  for (const hit of findTagProps(text, "EmptyState")) {
    const cnMatch = hit.props.match(/classNames=\{\s*\[([^\]]*)\]/)
    if (!cnMatch) continue
    const toks = [...cnMatch[1].matchAll(/["'`]([^"'`]+)["'`]/g)].map((x) => x[1])
    if (toks.length === 1 && toks[0] === "block") {
      emptyBlock.push({ file: rel, line: hit.line })
    }
  }

  for (const hit of findTagProps(text, "UserAvatar")) {
    const m = hit.props.match(/className=\{?\s*["'`]([^"'`]+)["'`]/)
    if (!m) continue
    const toks = m[1].trim().split(/\s+/)
    if (toks.length === 1 && toks[0] === "rounded-full") {
      userAvatarRounded.push({ file: rel, line: hit.line })
    }
  }

  for (const hit of findTagProps(text, "SimpleEmptyState")) {
    const m = hit.props.match(/className=\{?\s*["'`]([^"'`]+)["'`]/)
    if (!m) continue
    const toks = m[1].trim().split(/\s+/)
    if (toks.every((t) => t === "text-sm" || t === "text-muted") && toks.length) {
      simpleEmptyDup.push({ file: rel, line: hit.line, className: m[1] })
    }
  }

  for (const hit of findTagProps(text, "LabeledAccordionCard")) {
    if (/\bclassName=/.test(hit.props) || /\bclassNames=/.test(hit.props)) {
      labeledAccordionConsumers.push({
        file: rel,
        line: hit.line,
        snippet: hit.props.replace(/\s+/g, " ").slice(0, 200),
      })
    }
  }

  for (const hit of findTagProps(text, "ProfileSectionGuard")) {
    if (/\bclassName=/.test(hit.props) || /\bclassNames=/.test(hit.props)) {
      profileGuardConsumers.push({
        file: rel,
        line: hit.line,
        snippet: hit.props.replace(/\s+/g, " ").slice(0, 200),
      })
    }
  }
}

// Verify dead-door wrappers: do they really never use the prop?
function inspectWrapper(file, prop) {
  const abs = path.join(ROOT, file)
  const text = fs.readFileSync(abs, "utf8")
  // Find destructure and whether prop appears in JSX/cn after
  const stripped = text
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/.*$/gm, "")
  // remove type/interface blocks
  const noTypes = stripped
    .replace(/export\s+(type|interface)\s+\w[\s\S]*?(?=\nexport|\nconst|\nfunction|\n\/\*\*)/g, "\n")
    .replace(/^(type|interface)\s+\w[\s\S]*?(?=\nexport|\nconst|\nfunction)/gm, "\n")

  const mentions = []
  const re = new RegExp(`\\b${prop}\\b`, "g")
  let m
  while ((m = re.exec(noTypes))) {
    mentions.push(noTypes.slice(Math.max(0, m.index - 30), m.index + 50).replace(/\s+/g, " "))
  }

  // Check if forwarded: className={className} or cn(..., className) etc
  const forwarded =
    new RegExp(`className=\\{[^}]*\\b${prop}\\b`).test(text) ||
    new RegExp(`classNames=\\{[^}]*\\b${prop}\\b`).test(text) ||
    new RegExp(`cn\\([^)]*\\b${prop}\\b`).test(text) ||
    new RegExp(`\\{\\.\\.\\.[^}]*\\b${prop}\\b`).test(text) ||
    new RegExp(`\\[\\.\\.\\.${prop}`).test(text) ||
    new RegExp(`\\[\\.\\.\\.\\(${prop}`).test(text)

  return { file, prop, forwarded, mentions: mentions.slice(0, 15), mentionCount: mentions.length }
}

const wrappers = [
  [".storybook/components/behaviors/DragScrollArea/DragScrollArea.tsx", "className"],
  [".storybook/components/behaviors/ResizableRail/ResizableRail.tsx", "className"],
  [".storybook/components/frames/Cluster/Cluster.tsx", "classNames"],
  [".storybook/components/frames/PinnedTrack/PinnedTrack.tsx", "classNames"],
  [".storybook/components/starci/layouts/InnerLayout/InnerLayout.tsx", "classNames"],
  ["src/components/behaviors/DragScrollArea/index.tsx", "className"],
  ["src/components/behaviors/ResizableRail/index.tsx", "className"],
  ["src/components/blocks/learn/LeaderboardCategoryRail/index.tsx", "className"],
  ["src/components/frames/Cluster/index.tsx", "classNames"],
  ["src/components/frames/PinnedTrack/index.tsx", "classNames"],
  ["src/components/svg/Logo/index.tsx", "className"],
  ["src/components/blocks/cards/LabeledAccordionCard/index.tsx", "className"],
]

const wrapperInspect = wrappers.map(([f, p]) => inspectWrapper(f, p))

// Consumers of each dead wrapper that PASS the prop
function consumersPassing(comp, prop) {
  const out = []
  for (const abs of walk(path.join(ROOT, "src"))) {
    const text = fs.readFileSync(abs, "utf8")
    for (const hit of findTagProps(text, comp)) {
      if (new RegExp(`\\b${prop}=`).test(hit.props)) {
        out.push({
          file: norm(abs).replace(norm(ROOT) + "/", ""),
          line: hit.line,
          snippet: hit.props.replace(/\s+/g, " ").slice(0, 180),
        })
      }
    }
  }
  return out
}

const consumerPassing = {
  Cluster_classNames: consumersPassing("Cluster", "classNames"),
  PinnedTrack_classNames: consumersPassing("PinnedTrack", "classNames"),
  DragScrollArea_className: consumersPassing("DragScrollArea", "className"),
  ResizableRail_className: consumersPassing("ResizableRail", "className"),
  LeaderboardCategoryRail_className: consumersPassing("LeaderboardCategoryRail", "className"),
  Logo_className: consumersPassing("Logo", "className"),
  InnerLayout_classNames: consumersPassing("InnerLayout", "classNames"),
  LabeledAccordionCard_className: consumersPassing("LabeledAccordionCard", "className"),
  ProfileSectionGuard_className: consumersPassing("ProfileSectionGuard", "className"),
}

// Also check ProgressMeter / EnumChip for duplicates of internals
const progressHits = []
const enumHits = []
for (const abs of files) {
  const rel = norm(abs).replace(norm(ROOT) + "/", "")
  const text = fs.readFileSync(abs, "utf8")
  for (const hit of findTagProps(text, "ProgressMeter")) {
    if (/classNames=|className=/.test(hit.props)) {
      progressHits.push({ file: rel, line: hit.line, props: hit.props.replace(/\s+/g, " ").slice(0, 220) })
    }
  }
  for (const hit of findTagProps(text, "EnumChip")) {
    if (/classNames=|className=/.test(hit.props)) {
      enumHits.push({ file: rel, line: hit.line, props: hit.props.replace(/\s+/g, " ").slice(0, 220) })
    }
  }
}

const out = {
  typographyDupesCount: typographyDupes.length,
  typographyDupes,
  typographyW12LiveCount: typographyW12Live.length,
  typographyW12Live: typographyW12Live.slice(0, 30),
  titledMinW0,
  emptyBlock,
  userAvatarRounded,
  simpleEmptyDup,
  labeledAccordionConsumers,
  profileGuardConsumers,
  wrapperInspect,
  consumerPassing: Object.fromEntries(
    Object.entries(consumerPassing).map(([k, v]) => [k, { count: v.length, sample: v.slice(0, 10) }]),
  ),
  progressHits,
  enumHits,
}

fs.writeFileSync(path.join(ART, "2026-08-09-b25-verify.json"), JSON.stringify(out, null, 2))
console.log(
  JSON.stringify(
    {
      typographyDupes: typographyDupes.length,
      typographyW12Live: typographyW12Live.length,
      titledMinW0: titledMinW0.length,
      emptyBlock: emptyBlock.length,
      userAvatarRounded: userAvatarRounded.length,
      simpleEmptyDup: simpleEmptyDup.length,
      labeledAccordionConsumers: labeledAccordionConsumers.length,
      profileGuardConsumers: profileGuardConsumers.length,
      wrappers: wrapperInspect.map((w) => ({ file: w.file, prop: w.prop, forwarded: w.forwarded, mentions: w.mentionCount })),
      consumerPassing: Object.fromEntries(Object.entries(consumerPassing).map(([k, v]) => [k, v.length])),
      progressHits: progressHits.length,
      enumHits: enumHits.length,
      progressSample: progressHits.slice(0, 8),
      enumSample: enumHits.slice(0, 8),
      typographyDupeFiles: [...new Set(typographyDupes.map((d) => d.file))],
    },
    null,
    2,
  ),
)
