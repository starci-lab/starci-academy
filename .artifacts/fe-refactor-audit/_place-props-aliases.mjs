/** Place extracted `type X =` aliases immediately after imports (CRLF-safe). */
import fs from "node:fs"

const files = [
  "src/components/pages/ArchitecturePage/ArchitectureRail/index.tsx",
  "src/components/pages/ArchitecturePage/ArchitectureRail/ArchitectureMobileNav/index.tsx",
  "src/components/pages/LandingPage/TalentMarketplace/index.tsx",
  "src/components/pages/CvGalleryPage/CvGallery/component.tsx",
  "src/components/pages/ProfileOverviewPage/ProfileJobReadiness/index.tsx",
  "src/components/pages/MindMapPage/component.tsx",
  "src/components/pages/ProfileProjectsPage/ProfilePinned/index.tsx",
  "src/components/pages/DashboardPage/ChangelogList/component.tsx",
  "src/components/pages/FlashcardsPage/FlashcardQuizResult/recapBlocks.tsx",
  "src/components/pages/PlaygroundPreparePage/component.tsx",
  "src/components/pages/ProfilePublicCvPage/index.tsx",
  "src/components/pages/FlashcardsPage/FlashcardQuizResult/component.tsx",
]

/** Extract top-level `type Name = ...` declarations (not export type). */
function extractTypeAliases(src) {
  const aliases = []
  const re = /^type [A-Za-z0-9_]+ = (?:\{[\s\S]*?\n\}|[^\n]+)$/gm
  let m
  const ranges = []
  while ((m = re.exec(src))) {
    aliases.push(m[0].replace(/\r/g, ""))
    ranges.push([m.index, m.index + m[0].length])
  }
  // remove from end
  let out = src
  for (const [start, end] of ranges.reverse()) {
    out = out.slice(0, start) + out.slice(end)
  }
  out = out.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").replace(/\s+$/, "\n")
  return { aliases, out }
}

function insertAfterImports(src, aliases) {
  if (!aliases.length) return src
  const lines = src.split("\n")
  let lastImport = -1
  let inImport = false
  for (let i = 0; i < lines.length; i++) {
    if (/^import\b/.test(lines[i])) {
      inImport = true
      lastImport = i
      if (/;\s*$/.test(lines[i])) inImport = false
      continue
    }
    if (inImport) {
      lastImport = i
      if (/;\s*$/.test(lines[i])) inImport = false
    }
  }
  const block = aliases.join("\n")
  if (lastImport < 0) return `${block}\n\n${src}`
  lines.splice(lastImport + 1, 0, "", block)
  return lines.join("\n").replace(/\n{3,}/g, "\n\n") + "\n"
}

for (const f of files) {
  const raw = fs.readFileSync(f, "utf8")
  const { aliases, out } = extractTypeAliases(raw)
  // Keep export type / interface; only relocate plain `type` aliases we introduced
  // Heuristic: names ending with Props
  const ours = aliases.filter((a) => /^type \w+Props\b/.test(a) || /^type \w+Prop\b/.test(a))
  const keep = aliases.filter((a) => !ours.includes(a))
  if (!ours.length) {
    console.log("none", f)
    continue
  }
  // re-add keepers at original relative position by appending keep first then ours after imports
  let body = out
  if (keep.length) {
    // put unrelated types back at end (shouldn't happen)
    body = body.replace(/\s+$/, "\n") + "\n" + keep.join("\n") + "\n"
  }
  const next = insertAfterImports(body, ours)
  fs.writeFileSync(f, next)
  console.log("placed", f, ours.length)
}
