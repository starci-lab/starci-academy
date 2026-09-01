import fs from "fs"
import { execSync } from "child_process"

const manifest = JSON.parse(
  fs.readFileSync("./.artifacts/fe-refactor-audit/2026-08-10-b32-manifests.json", "utf8"),
).agents["agent-1-atoms"]
const manifestSet = new Set(manifest.map((p) => p.replace(/\\/g, "/")))

const targets = [
  { name: "ButtonBase", doors: ["className", "classNames"] },
  { name: "ChipBase", doors: ["className", "classNames", "dotClassName"] },
  { name: "AvatarBase", doors: ["className", "classNames"] },
  { name: "Badge", doors: ["className", "classNames"] },
  { name: "Divider", doors: ["className", "classNames"] },
  { name: "IconTile", doors: ["className", "classNames"] },
  { name: "Logo", doors: ["className", "classNames"] },
  { name: "Spinner", doors: ["className", "classNames"] },
  { name: "Alert", doors: ["className", "classNames"] },
  { name: "QRCode", doors: ["className", "classNames"] },
  { name: "Accordion", doors: ["className", "classNames"] },
  { name: "Breadcrumbs", doors: ["className", "classNames"] },
  { name: "LinkBack", doors: ["className", "classNames"] },
  { name: "LinkSeeMore", doors: ["className", "classNames"] },
  { name: "Pagination", doors: ["className", "classNames"] },
  { name: "TabsBase", doors: ["className", "classNames"] },
  { name: "TabsExtended", doors: ["className", "classNames"] },
  { name: "Menu", doors: ["className", "classNames"] },
  { name: "Typography", doors: ["className", "classNames"] },
  { name: "Progress", doors: ["className", "classNames"] },
]

function rg(args) {
  try {
    return execSync(`rg ${args}`, { encoding: "utf8", maxBuffer: 40e6, shell: true })
  } catch (e) {
    if (e.status === 1) return ""
    throw e
  }
}

function findUsages(comp, door) {
  const pattern = `<${comp}\\b[\\s\\S]{0,800}?\\b${door}\\s*=`
  const out = rg(
    `-U --multiline -n --glob "*.tsx" --glob "*.ts" ${JSON.stringify(pattern)} .storybook src`,
  )
  const files = new Map()
  for (const line of out.split(/\n/).filter(Boolean)) {
    const m = line.match(/^(.*?):(\d+):/)
    if (!m) continue
    const file = m[1].replace(/\\/g, "/").replace(/^\.\//, "")
    if (!files.has(file)) files.set(file, [])
    files.get(file).push(Number(m[2]))
  }
  return files
}

function isDefinitionFile(file, comp) {
  const n = file.replace(/\\/g, "/")
  return (
    n.endsWith(`/${comp}.tsx`) ||
    n.endsWith(`/${comp}/index.tsx`) ||
    (comp.endsWith("Base") && n.includes(`/${comp}.tsx`))
  )
}

const report = {}
for (const t of targets) {
  report[t.name] = {}
  for (const door of t.doors) {
    const files = findUsages(t.name, door)
    const entries = [...files.entries()].map(([file, lines]) => ({
      file,
      inManifest: manifestSet.has(file),
      isDef: isDefinitionFile(file, t.name),
      lines,
    }))
    const consumers = entries.filter((e) => !e.isDef)
    report[t.name][door] = {
      consumerFiles: consumers.length,
      inManifest: consumers.filter((e) => e.inManifest).map((e) => ({ file: e.file, lines: e.lines })),
      outOfManifest: consumers
        .filter((e) => !e.inManifest)
        .map((e) => ({ file: e.file, lines: e.lines })),
      actionable: consumers.every((e) => e.inManifest),
    }
  }
}

fs.writeFileSync(
  "./.artifacts/fe-refactor-audit/_b32-agent1-consumer-scan.json",
  JSON.stringify(report, null, 2),
)

// Summary: doors with zero out-of-manifest consumers
const actionable = []
const held = []
for (const [comp, doors] of Object.entries(report)) {
  for (const [door, info] of Object.entries(doors)) {
    const row = {
      comp,
      door,
      consumers: info.consumerFiles,
      out: info.outOfManifest.length,
      outFiles: info.outOfManifest.slice(0, 8).map((x) => x.file),
    }
    if (info.outOfManifest.length === 0) actionable.push(row)
    else held.push(row)
  }
}
console.log("ACTIONABLE (no out-of-manifest consumers):")
for (const r of actionable) console.log(JSON.stringify(r))
console.log("\nHELD (out-of-manifest consumers):")
for (const r of held) console.log(JSON.stringify(r))
