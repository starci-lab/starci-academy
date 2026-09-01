/** Move trailing extracted type aliases to just after the import block. */
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
  let src = fs.readFileSync(f, "utf8")
  // Collect trailing type-alias-only block at EOF
  const trail = src.match(/\n((?:type [A-Za-z0-9_]+ = [\s\S]*?)\n*)$/)
  if (!trail) {
    // also allow mid-file orphan like ProfilePinned — skip if already after imports
    console.log("no-trailing-block", f)
    continue
  }
  const aliases = trail[1].trim()
  // Only move if it's pure type aliases
  if (!/^type /.test(aliases) || /\b(export |const |function |class )/.test(aliases)) {
    console.log("skip-not-pure", f)
    continue
  }
  src = src.slice(0, src.length - trail[1].length).replace(/\s+$/, "\n")
  const lines = src.split(/\r?\n/)
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
  lines.splice(lastImport + 1, 0, "", aliases)
  fs.writeFileSync(f, lines.join("\n") + "\n")
  console.log("moved", f)
}
