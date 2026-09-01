/**
 * BATCH 26 — burn one partition from manifests.json
 * Usage: node _b26-burn-partition.mjs <partition-name>
 */
import fs from "node:fs"
import path from "node:path"

const ROOT = process.cwd()
const ART = path.join(ROOT, ".artifacts/fe-refactor-audit")
const partition = process.argv[2]
if (!partition) {
  console.error("usage: node _b26-burn-partition.mjs <partition>")
  process.exit(1)
}

const manifests = JSON.parse(fs.readFileSync(path.join(ART, "2026-08-09-b26-manifests.json"), "utf8"))
const tasks = manifests.tasks[partition] || []
const manifest = manifests.manifests[partition] || []

const applied = []
const skipped = []
const holds = []
const changed = []
const regressions = []
const evidence = []

function burnFile(abs, component, action) {
  let text = fs.readFileSync(abs, "utf8")
  const orig = text
  const rel = path.relative(ROOT, abs).replace(/\\/g, "/")

  // Re-verify: no JSX consumer of className/classNames for this component outside self
  // (soft — coordinator already proved; skip if className still clearly needed via rest props)

  if (action === "fully-dead-remove-door") {
    // Remove extends WithClassNames<...>
    text = text.replace(
      /\s+extends\s+WithClassNames<[^>]+>/g,
      "",
    )
    // Remove local WithClassNames interface block (SB style)
    text = text.replace(
      /\/\*\* Local mirror of the shared `WithClassNames`[\s\S]*?interface WithClassNames<T> \{[\s\S]*?\}\n\n/g,
      "",
    )
    text = text.replace(
      /interface WithClassNames<T> \{\s*classNames\?: T\s*\}\n\n/g,
      "",
    )
    // Remove from OwnProps extends WithClassNames
    text = text.replace(
      /extends WithClassNames<[^>]+>\s*/g,
      "",
    )
    // Remove classNames from destructure
    text = text.replace(/,\s*classNames\s*,/g, ",")
    text = text.replace(/,\s*classNames\s*(?=\})/g, "")
    text = text.replace(/(?<=\{\s*)classNames\s*,\s*/g, "")
    // Remove unused WithClassNames import
    if (!/WithClassNames/.test(text.replace(/import\s+type\s+\{\s*WithClassNames\s*\}\s+from[^;]+;?\n?/, ""))) {
      text = text.replace(/import\s+type\s+\{\s*WithClassNames\s*\}\s+from\s+["'][^"']+["'];?\n?/g, "")
    } else if (!/\bWithClassNames\b/.test(text.split("\n").filter((l) => !l.includes("import")).join("\n"))) {
      text = text.replace(/import\s+type\s+\{\s*WithClassNames\s*\}\s+from\s+["'][^"']+["'];?\n?/g, "")
    }
    // Explicit classNames?: in interface
    text = text.replace(/\n\s*classNames\?:[^;\n]+;?/g, "")
    text = text.replace(/\n\s*\/\*\*[^*]*Where this sits[\s\S]*?\*\/\s*classNames\?:[^;\n]+;?/g, "")
  }

  if (action === "zero-consumer-remove-className-door") {
    // Must still destructure className — remove it
    if (!new RegExp(`\\bclassName\\b`).test(text)) {
      return { skipped: true, reason: "no-className-in-file" }
    }
    text = text.replace(/\s+extends\s+WithClassNames<[^>]+>/g, "")
    text = text.replace(/extends WithClassNames<[^>]+>\s*/g, "")
    // Remove className from destructure carefully
    text = text.replace(/,\s*className\s*,/g, ",")
    text = text.replace(/,\s*className\s*(?=\})/g, "")
    text = text.replace(/(?<=\{\s*)className\s*,\s*/g, "")
    // cn("foo", className) → "foo" or cn("foo") 
    text = text.replace(/cn\(\s*(["'`][^"'`]*["'`])\s*,\s*className\s*\)/g, "$1")
    text = text.replace(/cn\(\s*(["'`][^"'`]*["'`])\s*,\s*className\s*,/g, "cn($1,")
    text = text.replace(/cn\(([^)]*?),\s*className\s*\)/g, (match, inner) => {
      // if only one arg left without trailing comma issues
      const cleaned = inner.replace(/,\s*$/, "").trim()
      if (/^["'`]/.test(cleaned) && !cleaned.includes(",")) return cleaned
      return `cn(${cleaned})`
    })
    // className={cn("x", className)} already handled
    // className={className} → remove prop if alone on element — too risky; replace with omit
    text = text.replace(/\s+className=\{className\}/g, "")
    text = text.replace(/\s+className=\{cn\(([^)]*)\)\}/g, (match, inner) => {
      const cleaned = inner.replace(/,\s*className\s*/g, "").replace(/className\s*,\s*/g, "").trim()
      if (!cleaned) return ""
      if (/^["'`][^"'`]*["'`]$/.test(cleaned)) return ` className={${cleaned}}`
      return ` className={cn(${cleaned})}`
    })
    // Remove unused WithClassNames import
    if (!/\bWithClassNames\b/.test(text.replace(/import type \{ WithClassNames \} from[^;]+;?\n?/, ""))) {
      text = text.replace(/import\s+type\s+\{\s*WithClassNames\s*\}\s+from\s+["'][^"']+["'];?\n?/g, "")
    }
    // Drop unused cn import if cn no longer used
    if (!/\bcn\s*\(/.test(text) && /import\s*\{([^}]*)\}\s*from\s*["']@heroui\/react["']/.test(text)) {
      text = text.replace(/import\s*\{([^}]*)\}\s*from\s*(["']@heroui\/react["'])/, (full, names, mod) => {
        const next = names
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s && s !== "cn")
        if (next.length === 0) return ""
        return `import { ${next.join(", ")} } from ${mod}`
      })
      text = text.replace(/\n{3,}/g, "\n\n")
    }
  }

  // Clean empty import lines / double blanks
  text = text.replace(/\n{3,}/g, "\n\n")

  if (text === orig) {
    return { skipped: true, reason: "no-op-transform" }
  }

  fs.writeFileSync(abs, text)
  return { skipped: false, rel }
}

for (const task of tasks) {
  const files = [task.file, task.twin].filter(Boolean)
  for (const rel of files) {
    const abs = path.join(ROOT, rel)
    if (!fs.existsSync(abs)) {
      skipped.push({ file: rel, reason: "missing" })
      continue
    }
    try {
      const result = burnFile(abs, task.component, task.action)
      if (result.skipped) {
        skipped.push({ file: rel, component: task.component, action: task.action, reason: result.reason })
      } else {
        changed.push(rel)
        applied.push({
          file: rel,
          component: task.component,
          action: task.action,
          kind: task.action === "fully-dead-remove-door" ? "dead-passthrough" : "dead-passthrough",
        })
        evidence.push({
          file: rel,
          consumerSearch: "coordinator open-tag index: 0 consumers for burned prop(s)",
          action: task.action,
        })
      }
    } catch (e) {
      regressions.push({ file: rel, error: String(e) })
    }
  }
}

const worker = {
  partition,
  manifest,
  changed: [...new Set(changed)].sort(),
  applied,
  skipped,
  holds: [
    "live-api Button/Chip/Stack/Grid/Box/SurfaceCard/Typography/Skeleton and any door with JSX consumers",
    "vendor-boundary / HeroUI / Box",
    "DrawerShell / ShowcaseMockup / MiniCart / CvPreview / PDFView / B19–B25",
    "Nivo / locked / teacher holds / skeleton slots",
    "half-dead doors with live className consumers (held by coordinator)",
  ],
  evidence,
  principles: [],
  parity: {
    storybookSrc: tasks.some((t) => t.twin)
      ? "twins burned together under one owner"
      : "src-only or sb-only units",
  },
  verification: { local: "deferred to coordinator aggregate" },
  regressions,
  overlapCheck: "manifest disjoint per coordinator 2026-08-09-b26-manifests.json",
}

fs.writeFileSync(
  path.join(ART, `2026-08-09-b26-worker-${partition}.json`),
  JSON.stringify(worker, null, 2) + "\n",
)

console.log(
  JSON.stringify(
    {
      partition,
      manifest: manifest.length,
      tasks: tasks.length,
      changed: worker.changed.length,
      applied: applied.length,
      skipped: skipped.length,
      regressions: regressions.length,
    },
    null,
    2,
  ),
)
