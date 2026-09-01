import fs from "fs"
import path from "path"

const ROOTS = [".storybook", "src"]
const manifest = JSON.parse(
  fs.readFileSync("./.artifacts/fe-refactor-audit/2026-08-10-b32-manifests.json", "utf8"),
).agents["agent-1-atoms"]
const manifestSet = new Set(manifest.map((p) => p.replace(/\\/g, "/")))

const targets = [
  { key: "Button", tags: ["ButtonBase", "Button"], doors: ["className", "classNames"], atomPath: "/atoms/buttons/Button/" },
  { key: "Chip", tags: ["ChipBase", "Chip"], doors: ["className", "classNames", "dotClassName"], atomPath: "/atoms/chips/Chip/" },
  { key: "Avatar", tags: ["AvatarBase", "Avatar"], doors: ["className", "classNames"], atomPath: "/atoms/display/Avatar/" },
  { key: "Badge", tags: ["Badge"], doors: ["className", "classNames"], atomPath: "/atoms/display/Badge" },
  { key: "Divider", tags: ["Divider"], doors: ["className", "classNames"], atomPath: "/atoms/display/Divider" },
  { key: "IconTile", tags: ["IconTile"], doors: ["className", "classNames"], atomPath: "/atoms/display/IconTile" },
  { key: "Logo", tags: ["Logo"], doors: ["className", "classNames"], atomPath: "/atoms/display/Logo" },
  { key: "Spinner", tags: ["Spinner"], doors: ["className", "classNames"], atomPath: "/atoms/display/Spinner" },
  { key: "Alert", tags: ["Alert"], doors: ["className", "classNames"], atomPath: "/atoms/feedback/Alert" },
  { key: "QRCode", tags: ["QRCode"], doors: ["className", "classNames"], atomPath: "/atoms/media/QRCode" },
  { key: "Accordion", tags: ["Accordion"], doors: ["className", "classNames"], atomPath: "/atoms/navigation/Accordion" },
  { key: "Breadcrumbs", tags: ["Breadcrumbs"], doors: ["className", "classNames"], atomPath: "/atoms/navigation/Breadcrumbs" },
  { key: "LinkBack", tags: ["LinkBack"], doors: ["className", "classNames"], atomPath: "/atoms/navigation/Link/LinkBack" },
  { key: "LinkSeeMore", tags: ["LinkSeeMore"], doors: ["className", "classNames"], atomPath: "/atoms/navigation/Link/LinkSeeMore" },
  { key: "Pagination", tags: ["Pagination"], doors: ["className", "classNames"], atomPath: "/atoms/navigation/Pagination" },
  { key: "TabsBase", tags: ["TabsBase", "Tabs"], doors: ["className", "classNames"], atomPath: "/atoms/navigation/Tabs/TabsBase" },
  { key: "TabsExtended", tags: ["TabsExtended"], doors: ["className", "classNames"], atomPath: "/atoms/navigation/Tabs/TabsExtended" },
  { key: "Menu", tags: ["Menu"], doors: ["className", "classNames"], atomPath: "/atoms/overlay/Menu" },
  { key: "Typography", tags: ["Typography"], doors: ["className", "classNames"], atomPath: "/atoms/text/Typography" },
  { key: "Progress", tags: ["Progress"], doors: ["className", "classNames"], atomPath: "/atoms/display/Progress" },
]

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name)
    if (ent.isDirectory()) {
      if (ent.name === "node_modules" || ent.name === ".next") continue
      walk(p, out)
    } else if (/\.(tsx|ts)$/.test(ent.name)) out.push(p)
  }
  return out
}

const files = ROOTS.flatMap((r) => walk(r)).map((p) => p.replace(/\\/g, "/"))

function findDoorUsages(content, tag, door) {
  const re = new RegExp(`<${tag}\\b[\\s\\S]{0,1200}?\\b${door}\\s*=`, "g")
  const hits = []
  let m
  while ((m = re.exec(content))) {
    const before = content.slice(0, m.index)
    const line = before.split(/\n/).length
    hits.push(line)
    if (hits.length > 50) break
  }
  return hits
}

const report = {}
for (const t of targets) {
  report[t.key] = {}
  for (const door of t.doors) {
    const consumers = []
    for (const file of files) {
      if (file.includes(t.atomPath)) continue // definition
      const content = fs.readFileSync(file, "utf8")
      const hits = []
      for (const tag of t.tags) {
        // Avoid matching HeroUI etc wrongly for generic names? Still ok for proof.
        hits.push(...findDoorUsages(content, tag, door).map((line) => ({ tag, line })))
      }
      if (!hits.length) continue
      consumers.push({
        file,
        inManifest: manifestSet.has(file),
        hits: hits.slice(0, 8),
      })
    }
    const out = consumers.filter((c) => !c.inManifest)
    report[t.key][door] = {
      consumers: consumers.length,
      actionable: out.length === 0,
      outOfManifest: out.slice(0, 20).map((c) => ({ file: c.file, hits: c.hits })),
      inManifest: consumers.filter((c) => c.inManifest).map((c) => c.file),
    }
  }
}

fs.writeFileSync(
  "./.artifacts/fe-refactor-audit/_b32-agent1-consumer-scan3.json",
  JSON.stringify(report, null, 2),
)

console.log("ACTIONABLE (remove door):")
for (const [k, doors] of Object.entries(report)) {
  for (const [door, info] of Object.entries(doors)) {
    if (info.actionable) console.log(`  ${k}.${door} consumers=${info.consumers}`)
  }
}
console.log("\nHELD (out-of-manifest):")
for (const [k, doors] of Object.entries(report)) {
  for (const [door, info] of Object.entries(doors)) {
    if (!info.actionable)
      console.log(
        `  ${k}.${door} out=${info.outOfManifest.length} e.g. ${info.outOfManifest
          .slice(0, 3)
          .map((x) => x.file)
          .join(", ")}`,
      )
  }
}
