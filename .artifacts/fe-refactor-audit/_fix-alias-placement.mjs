/** Move misplaced leading type aliases to after imports. */
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

for (const f of files) {
  const raw = fs.readFileSync(f, "utf8")
  const src = raw.replace(/^\uFEFF/, "")
  const m = src.match(/^(\s*type [\s\S]*?)(?=(?:"use client"|'use client'|import\s))/)
  if (!m) {
    console.log("ok", f)
    continue
  }
  const aliases = m[1].trim()
  const rest = src.slice(m[1].length)
  const lines = rest.split(/\r?\n/)
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
  if (lastImport < 0) {
    console.log("NO_IMPORT", f)
    continue
  }
  const before = lines.slice(0, lastImport + 1).join("\n")
  const after = lines.slice(lastImport + 1).join("\n")
  const out = `${before}\n\n${aliases}\n${after.replace(/^\n+/, "\n")}`
  fs.writeFileSync(f, out)
  console.log("fixed", f)
}
