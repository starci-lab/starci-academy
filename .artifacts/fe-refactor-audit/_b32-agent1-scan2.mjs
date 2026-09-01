import fs from "fs"
import { execSync } from "child_process"

const manifest = JSON.parse(
  fs.readFileSync("./.artifacts/fe-refactor-audit/2026-08-10-b32-manifests.json", "utf8"),
).agents["agent-1-atoms"]
const manifestSet = new Set(manifest.map((p) => p.replace(/\\/g, "/")))

// Real JSX tag names (export aliases) + doors to prove dead
const targets = [
  { tags: ["ButtonBase", "Button"], doors: ["className", "classNames"], defHints: ["ButtonBase", "Button/"] },
  { tags: ["ChipBase", "Chip"], doors: ["className", "classNames", "dotClassName"], defHints: ["ChipBase", "Chip/"] },
  { tags: ["AvatarBase", "Avatar"], doors: ["className", "classNames"], defHints: ["AvatarBase", "Avatar/"] },
  { tags: ["Badge"], doors: ["className", "classNames"], defHints: ["/Badge"] },
  { tags: ["Divider"], doors: ["className", "classNames"], defHints: ["/Divider"] },
  { tags: ["IconTile"], doors: ["className", "classNames"], defHints: ["/IconTile"] },
  { tags: ["Logo"], doors: ["className", "classNames"], defHints: ["/Logo"] },
  { tags: ["Spinner"], doors: ["className", "classNames"], defHints: ["/Spinner"] },
  { tags: ["Alert"], doors: ["className", "classNames"], defHints: ["/Alert"] },
  { tags: ["QRCode"], doors: ["className", "classNames"], defHints: ["/QRCode"] },
  { tags: ["Accordion"], doors: ["className", "classNames"], defHints: ["/Accordion"] },
  { tags: ["Breadcrumbs"], doors: ["className", "classNames"], defHints: ["/Breadcrumbs"] },
  { tags: ["LinkBack"], doors: ["className", "classNames"], defHints: ["LinkBack"] },
  { tags: ["LinkSeeMore"], doors: ["className", "classNames"], defHints: ["LinkSeeMore"] },
  { tags: ["Pagination"], doors: ["className", "classNames"], defHints: ["/Pagination"] },
  { tags: ["TabsBase", "Tabs"], doors: ["className", "classNames"], defHints: ["TabsBase", "Tabs/"] },
  { tags: ["TabsExtended"], doors: ["className", "classNames"], defHints: ["TabsExtended"] },
  { tags: ["Menu"], doors: ["className", "classNames"], defHints: ["/Menu"] },
  { tags: ["Typography"], doors: ["className", "classNames"], defHints: ["/Typography"] },
  { tags: ["Progress"], doors: ["className", "classNames"], defHints: ["/Progress"] },
]

function rg(args) {
  try {
    return execSync(`rg ${args}`, { encoding: "utf8", maxBuffer: 50e6, shell: true })
  } catch (e) {
    if (e.status === 1) return ""
    throw e
  }
}

function findUsages(tag, door) {
  const pattern = `<${tag}\\b[\\s\\S]{0,1000}?\\b${door}\\s*=`
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

function isDef(file, hints) {
  const n = file.replace(/\\/g, "/")
  // definition + twin definition
  if (hints.some((h) => n.includes(h) && (n.endsWith(".tsx") || n.endsWith("/index.tsx")))) {
    // only treat as def if path is under atoms/... matching the component folder
    if (n.includes("/atoms/") && hints.some((h) => n.includes(h.replace(/^\//, "")))) return true
  }
  return false
}

const summary = []
for (const t of targets) {
  for (const door of t.doors) {
    const all = new Map()
    for (const tag of t.tags) {
      for (const [file, lines] of findUsages(tag, door)) {
        if (!all.has(file)) all.set(file, [])
        all.get(file).push(...lines.map((l) => ({ tag, line: l })))
      }
    }
    const consumers = [...all.entries()]
      .filter(([file]) => !isDef(file, t.defHints))
      .map(([file, hits]) => ({
        file,
        inManifest: manifestSet.has(file),
        hits: hits.slice(0, 5),
      }))
    const out = consumers.filter((c) => !c.inManifest)
    summary.push({
      tags: t.tags.join("|"),
      door,
      consumers: consumers.length,
      outOfManifest: out.length,
      outSample: out.slice(0, 10).map((c) => c.file),
      inSample: consumers.filter((c) => c.inManifest).slice(0, 5).map((c) => c.file),
      actionable: out.length === 0,
    })
  }
}

fs.writeFileSync(
  "./.artifacts/fe-refactor-audit/_b32-agent1-consumer-scan2.json",
  JSON.stringify(summary, null, 2),
)

console.log("ACTIONABLE:")
for (const r of summary.filter((s) => s.actionable)) {
  console.log(`${r.tags} ${r.door} consumers=${r.consumers}`)
}
console.log("\nHELD:")
for (const r of summary.filter((s) => !s.actionable)) {
  console.log(`${r.tags} ${r.door} out=${r.outOfManifest} sample=${r.outSample.slice(0, 5).join(", ")}`)
}
