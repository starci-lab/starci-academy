/**
 * B35 A10 — scan shared CSS-door consumers for Mission B.
 * Classifies each consumer as allowed / forbidden / self.
 */
import fs from "node:fs"
import path from "node:path"
import { execSync } from "node:child_process"

const ROOT = process.cwd()
const ART = path.join(ROOT, ".artifacts/fe-refactor-audit")
const manifests = JSON.parse(
  fs.readFileSync(path.join(ART, "2026-08-10-b35-manifests.json"), "utf8"),
)
const myFiles = new Set(
  manifests.manifests["shared-consumer-chains-coordinator"].files.map((f) =>
    f.replaceAll("\\", "/"),
  ),
)

const FORBIDDEN_RE = /(^|\/)(nivo|nivoexpert|mia-mia)(\/|$)/i

/** Shared doors owned by this agent (SB + src pairs). */
const DOORS = [
  {
    id: "Button.classNames",
    files: [
      "src/components/atoms/buttons/Button/ButtonBase.tsx",
      ".storybook/components/atoms/buttons/Button/ButtonBase.tsx",
    ],
    // house Button usage: import { Button } from house path + classNames=
    rg: String.raw`classNames=\{`,
    filter: (file, text) =>
      /from ["']@\/components\/atoms\/buttons\/Button/.test(text) ||
      /from ["']@sb-components\/atoms\/buttons\/Button/.test(text) ||
      /atoms\/buttons\/Button/.test(text),
  },
  {
    id: "Typography.classNames",
    files: [
      "src/components/atoms/text/Typography/index.tsx",
      ".storybook/components/atoms/text/Typography/Typography.tsx",
    ],
    rg: String.raw`<Typography[^>]*classNames=`,
    filter: null,
  },
  {
    id: "Chip.classNames",
    files: [
      "src/components/atoms/chips/Chip/ChipBase.tsx",
      ".storybook/components/atoms/chips/Chip/ChipBase.tsx",
    ],
    rg: String.raw`<Chip[^>]*classNames=`,
    filter: null,
  },
  {
    id: "Avatar.classNames",
    files: [
      "src/components/atoms/display/Avatar/AvatarBase.tsx",
      ".storybook/components/atoms/display/Avatar/AvatarBase.tsx",
    ],
    rg: String.raw`<Avatar[^>]*classNames=`,
    filter: null,
  },
  {
    id: "Alert.classNames",
    files: [
      "src/components/atoms/feedback/Alert/index.tsx",
      ".storybook/components/atoms/feedback/Alert/Alert.tsx",
    ],
    rg: String.raw`<Alert[^>]*classNames=`,
    filter: null,
  },
  {
    id: "Divider.className",
    files: [
      "src/components/atoms/display/Divider/index.tsx",
      ".storybook/components/atoms/display/Divider/Divider.tsx",
    ],
    rg: String.raw`<Divider[^>]*className=`,
    filter: null,
  },
  {
    id: "Stack.classNames",
    files: [
      "src/components/frames/Stack/index.tsx",
      ".storybook/components/frames/Stack/Stack.tsx",
    ],
    rg: String.raw`<(Stack[VH]?|Stack)[^>]*classNames=`,
    filter: null,
  },
  {
    id: "Flex.classNames",
    files: [
      "src/components/frames/Flex/index.tsx",
      ".storybook/components/frames/Flex/Flex.tsx",
    ],
    rg: String.raw`<Flex[^>]*classNames=`,
    filter: null,
  },
  {
    id: "Container.classNames",
    files: [
      "src/components/frames/Container/index.tsx",
      ".storybook/components/frames/Container/Container.tsx",
    ],
    rg: String.raw`<Container[^>]*classNames=`,
    filter: null,
  },
  {
    id: "Cluster.classNames",
    files: [
      "src/components/frames/Cluster/index.tsx",
      ".storybook/components/frames/Cluster/Cluster.tsx",
    ],
    rg: String.raw`<Cluster[^>]*classNames=`,
    filter: null,
  },
  {
    id: "TitledText.classNames",
    files: [
      "src/components/composites/text/TitledText/index.tsx",
      ".storybook/components/composites/text/TitledText/TitledText.tsx",
    ],
    rg: String.raw`<TitledText[^>]*classNames=`,
    filter: null,
  },
  {
    id: "Page.className",
    files: [
      "src/components/composites/layout/Page/index.tsx",
      ".storybook/components/composites/layout/Page/Page.tsx",
    ],
    rg: String.raw`<Page(\.[A-Za-z]+)?[^>]*className(s)?=`,
    filter: null,
  },
  {
    id: "Form.className",
    files: [
      "src/components/composites/form/Form/index.tsx",
      ".storybook/components/composites/form/Form/Form.tsx",
    ],
    rg: String.raw`<Form(\.[A-Za-z]+)?[^>]*className(s)?=`,
    filter: null,
  },
  {
    id: "RemovableToken.className",
    files: ["src/components/composites/chips/RemovableToken/index.tsx"],
    rg: String.raw`<RemovableToken[^>]*className(s)?=`,
    filter: null,
  },
  {
    id: "KeyValue.className",
    files: ["src/components/composites/data/KeyValue/index.tsx"],
    rg: String.raw`<KeyValue[^>]*className(s)?=`,
    filter: null,
  },
  {
    id: "Toolbar.className",
    files: ["src/components/composites/navigation/Toolbar/index.tsx"],
    rg: String.raw`<Toolbar[^>]*className(s)?=`,
    filter: null,
  },
  {
    id: "SurfaceCard.classNames",
    files: [
      "src/components/composites/cards/SurfaceCard/index.tsx",
      ".storybook/components/composites/cards/SurfaceCard/SurfaceCard.tsx",
    ],
    rg: String.raw`<SurfaceCard(\.[A-Za-z]+)?[^>]*className(s)?=`,
    filter: null,
  },
]

function rgFiles(pattern) {
  try {
    const out = execSync(
      `rg -l --glob "*.tsx" --glob "*.ts" --glob "!.artifacts/**" --glob "!**/node_modules/**" -e ${JSON.stringify(pattern)} src .storybook`,
      { cwd: ROOT, encoding: "utf8", maxBuffer: 30_000_000, shell: true },
    )
    return out
      .split(/\r?\n/)
      .map((s) => s.trim().replaceAll("\\", "/"))
      .filter(Boolean)
  } catch (e) {
    const out = e.stdout || ""
    return out
      .split(/\r?\n/)
      .map((s) => s.trim().replaceAll("\\", "/"))
      .filter(Boolean)
  }
}

function classify(file) {
  const n = file.replaceAll("\\", "/")
  if (FORBIDDEN_RE.test(n)) return "forbidden"
  if (myFiles.has(n)) return "in-manifest"
  if (n.startsWith("src/") || n.startsWith(".storybook/")) return "other-allowed"
  return "other"
}

const results = []
for (const door of DOORS) {
  const files = rgFiles(door.rg)
  const consumers = []
  for (const file of files) {
    // skip the door definition files themselves when they only declare the prop
    if (door.files.some((f) => file.endsWith(f) || file === f)) continue
    let text = ""
    try {
      text = fs.readFileSync(path.join(ROOT, file), "utf8")
    } catch {
      continue
    }
    if (door.filter && !door.filter(file, text)) continue
    // ensure the prop actually appears (rg can over-match multiline)
    if (!/classNames?\s*=/.test(text)) continue
    consumers.push({ file, bucket: classify(file) })
  }
  const buckets = consumers.reduce((a, c) => {
    a[c.bucket] = (a[c.bucket] || 0) + 1
    return a
  }, {})
  const forbidden = consumers.filter((c) => c.bucket === "forbidden")
  const decision =
    consumers.length === 0
      ? "burn-candidate-dead"
      : forbidden.length > 0
        ? "retain-locked-consumer"
        : "migrate-then-burn-if-zero"
  results.push({
    id: door.id,
    consumerCount: consumers.length,
    buckets,
    forbiddenCount: forbidden.length,
    forbiddenSample: forbidden.slice(0, 8).map((c) => c.file),
    allowedSample: consumers
      .filter((c) => c.bucket !== "forbidden")
      .slice(0, 12)
      .map((c) => c.file),
    decision,
  })
}

fs.writeFileSync(
  path.join(ART, "_b35-a10-door-scan.json"),
  JSON.stringify({ generatedAt: new Date().toISOString(), results }, null, 2),
)
console.log(
  results
    .map(
      (r) =>
        `${r.id}: n=${r.consumerCount} forbidden=${r.forbiddenCount} => ${r.decision} ${JSON.stringify(r.buckets)}`,
    )
    .join("\n"),
)
