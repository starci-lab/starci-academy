/**
 * BATCH 24 — revalidate provenDead: require ZERO className AND classNames JSX consumers
 * for every export alias (including Namespace.Child).
 */
import fs from "node:fs"
import path from "node:path"

const ROOT = process.cwd()
const ART = path.join(ROOT, ".artifacts/fe-refactor-audit")
const proof = JSON.parse(fs.readFileSync(path.join(ART, "2026-08-09-b24-dead-proof.json"), "utf8"))

const norm = (p) => p.replace(/\\/g, "/")

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name)
    if (ent.isDirectory()) {
      if (ent.name === "node_modules") continue
      walk(p, out)
    } else if (/\.(tsx|ts)$/.test(ent.name)) out.push(p)
  }
  return out
}

const files = [...walk(path.join(ROOT, "src")), ...walk(path.join(ROOT, ".storybook"))]
const texts = files.map((abs) => {
  const n = norm(abs)
  const i = Math.max(n.indexOf("/src/"), n.indexOf("/.storybook/"))
  return { abs, rel: i >= 0 ? n.slice(i + 1) : n, text: fs.readFileSync(abs, "utf8") }
})

function consumersOf(names, prop, defineFile) {
  const found = []
  for (const f of texts) {
    if (f.rel === defineFile) continue
    // skip twin definition of same component folder for signature-only
    for (const name of names) {
      if (!f.text.includes(name)) continue
      // Match <Name ... prop= and <Foo.Name ... prop=
      const openRe = new RegExp(`<(?:[\\w]+\\.)?${name}\\b`, "g")
      let m
      while ((m = openRe.exec(f.text))) {
        const slice = f.text.slice(m.index, m.index + 500)
        const gt = slice.indexOf(">")
        const window = gt >= 0 ? slice.slice(0, Math.min(gt + 1, 500)) : slice
        if (new RegExp(`\\b${prop}\\s*=`).test(window)) {
          found.push(f.rel)
          break
        }
      }
      if (found.includes(f.rel)) break
    }
  }
  return [...new Set(found)]
}

const SKIP_PATH = [
  /\/_/, // shared internals
  /types\.ts$/,
  /SurfaceCard/,
  /DrawerShell/,
  /ModalShell/,
  /ShowcaseMockup/,
  /MiniCart/,
  /CvPreview/,
  /PDFView/,
  /Box\//,
  /\/nivo\//i,
  /\/nivoexpert\//i,
]

const HOLD_COMP = new Set(["Button", "Chip", "Avatar", "Divider", "Typography", "StackH", "StackV", "Grid", "Form"])

const verified = []
const demoted = []

for (const d of proof.provenDead) {
  if (SKIP_PATH.some((r) => r.test(d.file))) {
    demoted.push({ ...d, reason: "skip-path" })
    continue
  }
  if (HOLD_COMP.has(d.component)) {
    demoted.push({ ...d, reason: "high-traffic-hold" })
    continue
  }
  if (d.prop === "WithClassNames") {
    demoted.push({ ...d, reason: "withclassname-manual" })
    continue
  }

  const names = d.aliases?.length ? d.aliases : [d.component]
  // Filter to plausible JSX component names (PascalCase)
  const jsxNames = names.filter((n) => /^[A-Z][A-Za-z0-9]*$/.test(n))
  const cn = consumersOf(jsxNames, "classNames", d.file)
  const c1 = consumersOf(jsxNames, "className", d.file)

  if (cn.length === 0 && c1.length === 0 && d.prop === "classNames") {
    verified.push({ ...d, revalidate: { classNames: 0, className: 0 } })
  } else if (cn.length === 0 && c1.length === 0 && d.prop === "className") {
    verified.push({ ...d, revalidate: { classNames: 0, className: 0 } })
  } else {
    demoted.push({
      ...d,
      reason: "has-consumers",
      classNamesConsumers: cn.slice(0, 8),
      classNameConsumers: c1.slice(0, 8),
    })
  }
}

// Pair SB ↔ src twins for classNames doors
function twinOf(file) {
  const f = norm(file)
  if (f.startsWith(".storybook/components/") && f.endsWith(`/${path.basename(path.dirname(f))}.tsx`)) {
    // .storybook/components/atoms/.../Name/Name.tsx → src/components/atoms/.../Name/index.tsx
    const rest = f.replace(/^\.storybook\/components\//, "")
    const dir = rest.replace(/\/[^/]+\.tsx$/, "")
    return `src/components/${dir}/index.tsx`
  }
  if (f.startsWith(".storybook/components/") && /Base\.tsx$/.test(f)) {
    const rest = f.replace(/^\.storybook\/components\//, "").replace(/\/[^/]+Base\.tsx$/, "")
    return `src/components/${rest}/index.tsx`
  }
  if (f.startsWith("src/components/") && f.endsWith("/index.tsx")) {
    const rest = f.replace(/^src\/components\//, "").replace(/\/index\.tsx$/, "")
    const name = rest.split("/").at(-1)
    return `.storybook/components/${rest}/${name}.tsx`
  }
  return null
}

const withTwins = verified.map((d) => {
  const twin = twinOf(d.file)
  const twinExists = twin ? fs.existsSync(path.join(ROOT, twin)) : false
  return { ...d, twin, twinExists }
})

fs.writeFileSync(
  path.join(ART, "2026-08-09-b24-verified-dead.json"),
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      verified: withTwins.length,
      demoted: demoted.length,
      withTwin: withTwins.filter((d) => d.twinExists).length,
      sbOnly: withTwins.filter((d) => d.file.startsWith(".storybook/") && !d.twinExists),
      items: withTwins,
      demotedSample: demoted.slice(0, 40),
    },
    null,
    2,
  ),
)

console.log(
  JSON.stringify(
    {
      verified: withTwins.length,
      withTwin: withTwins.filter((d) => d.twinExists).length,
      demoted: demoted.length,
      byWorker: withTwins.reduce((a, d) => ((a[d.worker] = (a[d.worker] || 0) + 1), a), {}),
      sample: withTwins.slice(0, 25).map((d) => `${d.file} twin=${d.twinExists}`),
    },
    null,
    2,
  ),
)
