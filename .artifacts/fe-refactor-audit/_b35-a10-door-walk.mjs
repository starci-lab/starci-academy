/**
 * Walk-based consumer scan for shared CSS doors (no shell rg escaping).
 */
import fs from "node:fs"
import path from "node:path"

const ROOT = process.cwd()
const ART = path.join(ROOT, ".artifacts/fe-refactor-audit")
const FORBIDDEN_RE = /(^|\/)(nivo|nivoexpert|mia-mia)(\/|$)/i

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name === "node_modules" || ent.name === ".artifacts" || ent.name === ".next")
      continue
    const p = path.join(dir, ent.name)
    if (ent.isDirectory()) walk(p, out)
    else if (/\.(tsx|ts)$/.test(ent.name)) out.push(p)
  }
  return out
}

const files = [
  ...walk(path.join(ROOT, "src")),
  ...walk(path.join(ROOT, ".storybook")),
]

const DOORS = [
  {
    id: "Avatar.classNames",
    def: [
      "src/components/atoms/display/Avatar/AvatarBase.tsx",
      ".storybook/components/atoms/display/Avatar/AvatarBase.tsx",
    ],
    // JSX open tag Avatar ... classNames=
    test: (text) => /<Avatar\b[\s\S]{0,400}?classNames\s*=/.test(text),
  },
  {
    id: "Alert.classNames",
    def: [
      "src/components/atoms/feedback/Alert/index.tsx",
      ".storybook/components/atoms/feedback/Alert/Alert.tsx",
    ],
    test: (text) => /<Alert\b[\s\S]{0,400}?classNames\s*=/.test(text),
  },
  {
    id: "Divider.className",
    def: [
      "src/components/atoms/display/Divider/index.tsx",
      ".storybook/components/atoms/display/Divider/Divider.tsx",
    ],
    test: (text) => /<Divider\b[\s\S]{0,400}?className\s*=/.test(text),
  },
  {
    id: "Flex.classNames",
    def: [
      "src/components/frames/Flex/index.tsx",
      ".storybook/components/frames/Flex/Flex.tsx",
    ],
    test: (text) => /<Flex\b[\s\S]{0,400}?classNames\s*=/.test(text),
  },
  {
    id: "Container.classNames",
    def: [
      "src/components/frames/Container/index.tsx",
      ".storybook/components/frames/Container/Container.tsx",
    ],
    test: (text) => /<Container\b[\s\S]{0,400}?classNames\s*=/.test(text),
  },
  {
    id: "Cluster.classNames",
    def: [
      "src/components/frames/Cluster/index.tsx",
      ".storybook/components/frames/Cluster/Cluster.tsx",
    ],
    test: (text) => /<Cluster\b[\s\S]{0,400}?classNames\s*=/.test(text),
  },
  {
    id: "Chip.classNames",
    def: [
      "src/components/atoms/chips/Chip/ChipBase.tsx",
      ".storybook/components/atoms/chips/Chip/ChipBase.tsx",
    ],
    test: (text) => /<Chip\b[\s\S]{0,400}?classNames\s*=/.test(text),
  },
  {
    id: "Typography.classNames",
    def: [
      "src/components/atoms/text/Typography/index.tsx",
      ".storybook/components/atoms/text/Typography/Typography.tsx",
    ],
    test: (text) => /<Typography\b[\s\S]{0,400}?classNames\s*=/.test(text),
  },
  {
    id: "Button.classNames",
    def: [
      "src/components/atoms/buttons/Button/ButtonBase.tsx",
      ".storybook/components/atoms/buttons/Button/ButtonBase.tsx",
    ],
    test: (text) =>
      /<Button\b[\s\S]{0,500}?classNames\s*=/.test(text) &&
      (/atoms\/buttons\/Button/.test(text) ||
        /@\/components\/atoms\/buttons\/Button/.test(text) ||
        /@sb-components\/atoms\/buttons\/Button/.test(text)),
  },
  {
    id: "Stack.classNames",
    def: [
      "src/components/frames/Stack/index.tsx",
      ".storybook/components/frames/Stack/Stack.tsx",
    ],
    test: (text) => /<Stack[VH]?\b[\s\S]{0,400}?classNames\s*=/.test(text),
  },
  {
    id: "TitledText.classNames",
    def: [
      "src/components/composites/text/TitledText/index.tsx",
      ".storybook/components/composites/text/TitledText/TitledText.tsx",
    ],
    test: (text) => /<TitledText\b[\s\S]{0,400}?classNames\s*=/.test(text),
  },
  {
    id: "TabsExtended.classNames",
    def: [
      "src/components/atoms/navigation/Tabs/TabsExtended.tsx",
      ".storybook/components/atoms/navigation/Tabs/TabsExtended.tsx",
    ],
    test: (text) => /<TabsExtended\b[\s\S]{0,400}?classNames\s*=/.test(text),
  },
]

const results = []
for (const door of DOORS) {
  const defSet = new Set(door.def.map((f) => f.replaceAll("\\", "/")))
  const consumers = []
  for (const abs of files) {
    const rel = path.relative(ROOT, abs).replaceAll("\\", "/")
    if (defSet.has(rel)) continue
    let text
    try {
      text = fs.readFileSync(abs, "utf8")
    } catch {
      continue
    }
    if (!door.test(text)) continue
    consumers.push({
      file: rel,
      bucket: FORBIDDEN_RE.test(rel) ? "forbidden" : "allowed",
    })
  }
  const forbidden = consumers.filter((c) => c.bucket === "forbidden")
  results.push({
    id: door.id,
    consumerCount: consumers.length,
    forbiddenCount: forbidden.length,
    forbidden: forbidden.map((c) => c.file),
    allowed: consumers.filter((c) => c.bucket === "allowed").map((c) => c.file),
    decision:
      consumers.length === 0
        ? "BURN"
        : forbidden.length > 0
          ? "RETAIN-locked-consumer"
          : "RETAIN-or-migrate-allowed",
  })
}

fs.writeFileSync(
  path.join(ART, "_b35-a10-door-walk.json"),
  JSON.stringify({ generatedAt: new Date().toISOString(), results }, null, 2),
)
for (const r of results) {
  console.log(
    `${r.id}: ${r.consumerCount} consumers, forbidden=${r.forbiddenCount} => ${r.decision}`,
  )
  if (r.consumerCount > 0 && r.consumerCount <= 12) {
    for (const f of r.allowed) console.log("  A", f)
    for (const f of r.forbidden) console.log("  F", f)
  } else if (r.consumerCount > 12) {
    console.log("  …", r.allowed.slice(0, 8).join(", "))
  }
}
