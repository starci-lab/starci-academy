/**
 * Accurate shared CSS-door consumer scan for B35 A10 Mission B.
 */
import fs from "node:fs"
import path from "node:path"
import { execSync } from "node:child_process"

const ROOT = process.cwd()
const ART = path.join(ROOT, ".artifacts/fe-refactor-audit")

const FORBIDDEN_RE = /(^|\/)(nivo|nivoexpert|mia-mia)(\/|$)/i

function rg(pattern, globs = ["*.tsx", "*.ts"]) {
  const globArgs = globs.map((g) => `--glob ${JSON.stringify(g)}`).join(" ")
  try {
    return execSync(
      `rg -n --no-heading ${globArgs} --glob "!.artifacts/**" --glob "!**/node_modules/**" -e ${JSON.stringify(pattern)} src .storybook`,
      { cwd: ROOT, encoding: "utf8", maxBuffer: 40_000_000, shell: true },
    )
  } catch (e) {
    return e.stdout || ""
  }
}

function classify(file) {
  const n = file.replaceAll("\\", "/")
  if (FORBIDDEN_RE.test(n)) return "forbidden"
  return "allowed"
}

/** Parse rg -n lines into {file,line,text} */
function parseHits(out) {
  return out
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      // path:line:text — Windows paths have drive colon
      const m = l.match(/^(.*?):(\d+):(.*)$/)
      if (!m) return null
      return {
        file: m[1].replaceAll("\\", "/"),
        line: Number(m[2]),
        text: m[3],
      }
    })
    .filter(Boolean)
}

const DEFINITIONS = new Set(
  [
    "src/components/atoms/buttons/Button/ButtonBase.tsx",
    ".storybook/components/atoms/buttons/Button/ButtonBase.tsx",
    "src/components/atoms/chips/Chip/ChipBase.tsx",
    ".storybook/components/atoms/chips/Chip/ChipBase.tsx",
    "src/components/atoms/display/Avatar/AvatarBase.tsx",
    ".storybook/components/atoms/display/Avatar/AvatarBase.tsx",
    "src/components/atoms/feedback/Alert/index.tsx",
    ".storybook/components/atoms/feedback/Alert/Alert.tsx",
    "src/components/atoms/display/Divider/index.tsx",
    ".storybook/components/atoms/display/Divider/Divider.tsx",
    "src/components/atoms/text/Typography/index.tsx",
    ".storybook/components/atoms/text/Typography/Typography.tsx",
    "src/components/atoms/navigation/Tabs/TabsExtended.tsx",
    ".storybook/components/atoms/navigation/Tabs/TabsExtended.tsx",
    "src/components/frames/Stack/index.tsx",
    ".storybook/components/frames/Stack/Stack.tsx",
    "src/components/frames/Flex/index.tsx",
    ".storybook/components/frames/Flex/Flex.tsx",
    "src/components/frames/Container/index.tsx",
    ".storybook/components/frames/Container/Container.tsx",
    "src/components/frames/Cluster/index.tsx",
    ".storybook/components/frames/Cluster/Cluster.tsx",
    "src/components/composites/text/TitledText/index.tsx",
    ".storybook/components/composites/text/TitledText/TitledText.tsx",
    "src/components/composites/layout/Page/index.tsx",
    ".storybook/components/composites/layout/Page/Page.tsx",
    "src/components/composites/form/Form/index.tsx",
    ".storybook/components/composites/form/Form/Form.tsx",
    "src/components/composites/cards/SurfaceCard/index.tsx",
    ".storybook/components/composites/cards/SurfaceCard/SurfaceCard.tsx",
    "src/components/composites/chips/RemovableToken/index.tsx",
    "src/components/composites/data/KeyValue/index.tsx",
    "src/components/composites/navigation/Toolbar/index.tsx",
  ].map((f) => f.replaceAll("\\", "/")),
)

function summarize(id, hits, isDefinitionLine) {
  const consumers = []
  const byFile = new Map()
  for (const h of hits) {
    const file = h.file.replaceAll("\\", "/")
    if (DEFINITIONS.has(file) && isDefinitionLine(h)) continue
    if (DEFINITIONS.has(file) && /classNames\??\s*:/.test(h.text) && !/=/.test(h.text))
      continue
    const bucket = classify(file)
    const list = byFile.get(file) || []
    list.push(h)
    byFile.set(file, list)
    consumers.push({ ...h, file, bucket })
  }
  const files = [...byFile.keys()]
  const forbidden = files.filter((f) => FORBIDDEN_RE.test(f))
  const allowed = files.filter((f) => !FORBIDDEN_RE.test(f))
  return {
    id,
    hitCount: consumers.length,
    fileCount: files.length,
    forbiddenCount: forbidden.length,
    forbidden,
    allowedSample: allowed.slice(0, 20),
    allowedCount: allowed.length,
    decision:
      files.length === 0
        ? "burn-candidate-dead"
        : forbidden.length > 0
          ? "retain-locked-consumer"
          : "migrate-allowed-then-recheck",
  }
}

const scans = []

// Button.classNames — JSX usage of classNames= on house Button is hard; count all classNames= in files that import house Button
{
  const importHits = parseHits(
    rg(
      String.raw`from ["'](@/components/atoms/buttons/Button|@sb-components/atoms/buttons/Button)`,
    ),
  )
  const files = [...new Set(importHits.map((h) => h.file.replaceAll("\\", "/")))]
  const consumers = []
  for (const file of files) {
    if (DEFINITIONS.has(file)) continue
    const text = fs.readFileSync(path.join(ROOT, file), "utf8")
    // crude: classNames= appearing in file that imports Button
    if (!/\bclassNames\s*=/.test(text)) continue
    // exclude if only other components use classNames — still count as potential; refine by line
    const lines = text.split(/\n/)
    lines.forEach((line, i) => {
      if (!/\bclassNames\s*=/.test(line)) return
      // skip if clearly Stack/Flex/Typography only on same line — still ambiguous
      consumers.push({ file, line: i + 1, text: line.trim().slice(0, 160), bucket: classify(file) })
    })
  }
  const byFile = [...new Set(consumers.map((c) => c.file))]
  const forbidden = byFile.filter((f) => FORBIDDEN_RE.test(f))
  scans.push({
    id: "Button.classNames (import-scoped heuristic)",
    hitCount: consumers.length,
    fileCount: byFile.length,
    forbiddenCount: forbidden.length,
    forbidden: forbidden.slice(0, 15),
    allowedCount: byFile.length - forbidden.length,
    allowedSample: byFile.filter((f) => !FORBIDDEN_RE.test(f)).slice(0, 20),
    decision:
      byFile.length === 0
        ? "burn-candidate-dead"
        : forbidden.length > 0
          ? "retain-locked-consumer"
          : "migrate-allowed-then-recheck",
    note: "Heuristic over-counts files that import Button and use classNames on other components.",
  })
}

scans.push(
  summarize(
    "Typography.classNames JSX",
    parseHits(rg(String.raw`<Typography[\s\S]{0,200}?classNames\s*=`)),
    () => false,
  ),
)

// simpler single-line patterns
for (const [id, pattern] of [
  ["Avatar classNames=", String.raw`<Avatar[^>\n]*classNames\s*=`],
  ["Alert classNames=", String.raw`<Alert[^>\n]*classNames\s*=`],
  ["Divider className=", String.raw`<Divider[^>\n]*className\s*=`],
  ["Flex classNames=", String.raw`<Flex[^>\n]*classNames\s*=`],
  ["Container classNames=", String.raw`<Container[^>\n]*classNames\s*=`],
  ["Cluster classNames=", String.raw`<Cluster[^>\n]*classNames\s*=`],
  ["Chip classNames=", String.raw`<Chip[^>\n]*classNames\s*=`],
  ["TitledText classNames=", String.raw`<TitledText[^>\n]*classNames\s*=`],
  ["StackV/H classNames=", String.raw`<Stack[VH]?[^>\n]*classNames\s*=`],
  ["Page* className=", String.raw`<Page\.[A-Za-z]+[^>\n]*className\s*=`],
  ["Form* className=", String.raw`<Form\.[A-Za-z]+[^>\n]*className\s*=`],
  ["RemovableToken className=", String.raw`<RemovableToken[^>\n]*className\s*=`],
  ["KeyValue className=", String.raw`<KeyValue[^>\n]*className\s*=`],
  ["Toolbar className=", String.raw`<Toolbar[^>\n]*className\s*=`],
  ["SurfaceCard* className=", String.raw`<SurfaceCard(\.[A-Za-z]+)?[^>\n]*className(s)?\s*=`],
  ["Tabs classNames=", String.raw`<Tabs[^>\n]*classNames\s*=`],
]) {
  scans.push(
    summarize(id, parseHits(rg(pattern)), (h) => /classNames\??\s*:/.test(h.text) && !/=/.test(h.text)),
  )
}

// Also check multiline classNames for Avatar/Alert/Flex via broader file search
for (const [id, openTag] of [
  ["Avatar multiline classNames", "Avatar"],
  ["Alert multiline classNames", "Alert"],
  ["Flex multiline classNames", "Flex"],
  ["Divider multiline className", "Divider"],
]) {
  const hits = parseHits(rg(String.raw`<${openTag}\b`))
  const consumers = []
  const seen = new Set()
  for (const h of hits) {
    const file = h.file.replaceAll("\\", "/")
    if (DEFINITIONS.has(file)) continue
    if (seen.has(file + ":" + h.line)) continue
    const text = fs.readFileSync(path.join(ROOT, file), "utf8")
    // find tag starting at line and look ahead ~15 lines for className(s)=
    const lines = text.split(/\n/)
    const start = h.line - 1
    let chunk = ""
    let closed = false
    for (let i = start; i < Math.min(lines.length, start + 20); i++) {
      chunk += lines[i] + "\n"
      if (lines[i].includes(">")) {
        closed = true
        break
      }
    }
    if (!closed) continue
    if (!/\bclassNames?\s*=/.test(chunk)) continue
    seen.add(file + ":" + h.line)
    consumers.push({ file, line: h.line, bucket: classify(file), snippet: chunk.trim().slice(0, 200) })
  }
  const files = [...new Set(consumers.map((c) => c.file))]
  const forbidden = files.filter((f) => FORBIDDEN_RE.test(f))
  scans.push({
    id,
    hitCount: consumers.length,
    fileCount: files.length,
    forbiddenCount: forbidden.length,
    forbidden,
    allowedCount: files.length - forbidden.length,
    allowedSample: files.filter((f) => !FORBIDDEN_RE.test(f)).slice(0, 15),
    samples: consumers.slice(0, 8),
    decision:
      files.length === 0
        ? "burn-candidate-dead"
        : forbidden.length > 0
          ? "retain-locked-consumer"
          : "migrate-allowed-then-recheck",
  })
}

fs.writeFileSync(
  path.join(ART, "_b35-a10-door-scan2.json"),
  JSON.stringify({ generatedAt: new Date().toISOString(), scans }, null, 2),
)
console.log(
  scans
    .map(
      (s) =>
        `${s.id}: files=${s.fileCount} forbidden=${s.forbiddenCount} => ${s.decision}`,
    )
    .join("\n"),
)
