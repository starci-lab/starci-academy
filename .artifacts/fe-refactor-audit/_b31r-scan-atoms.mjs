import fs from "fs"
import path from "path"

function walk(d, acc = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name)
    if (e.isDirectory()) {
      if (["node_modules", ".next", ".artifacts"].includes(e.name)) continue
      walk(p, acc)
    } else if (/\.tsx$/.test(e.name)) acc.push(p)
  }
  return acc
}

const shelves = [
  "src/components/atoms/display",
  "src/components/atoms/navigation",
  "src/components/atoms/overlay",
  "src/components/atoms/forms",
  "src/components/atoms/feedback",
  "src/components/atoms/buttons",
  "src/components/atoms/chips",
  "src/components/atoms/text",
]

const out = []
for (const shelf of shelves) {
  if (!fs.existsSync(shelf)) continue
  for (const f of walk(shelf)) {
    const s = fs.readFileSync(f, "utf8")
    const rel = f.replace(/\\/g, "/")
    const evidence = {
      path: rel,
      hasReactNode: /\bReactNode\b/.test(s),
      hasChildrenProp: /\bchildren\s*\?/.test(s) || /\bchildren:/.test(s),
      hasIconProp: /\bicon\s*[?:]/.test(s) || /\bicon:/.test(s),
      hasComponentType: /\bComponentType\b/.test(s),
      hasIsSkeleton: /\bisSkeleton\b/.test(s),
      placesIconInChrome: /icon/.test(s) && /className=/.test(s) && (/flex/.test(s) || /items-center/.test(s)),
      fallbackBranch: /showImage|onError|failed|fallback/.test(s),
    }
    const score =
      Number(evidence.hasReactNode) +
      Number(evidence.hasChildrenProp) +
      Number(evidence.hasIconProp) +
      Number(evidence.hasComponentType) +
      Number(evidence.placesIconInChrome) +
      Number(evidence.fallbackBranch)
    if (score >= 2 || evidence.hasIconProp || evidence.hasChildrenProp) {
      out.push({ ...evidence, score })
    }
  }
}
out.sort((a, b) => b.score - a.score)
fs.writeFileSync(
  ".artifacts/fe-refactor-audit/_b31r-atom-candidate-scan.json",
  JSON.stringify(out, null, 2),
)
console.log("candidates", out.length)
console.log(out.slice(0, 40).map((c) => `${c.score} ${c.path}`).join("\n"))
