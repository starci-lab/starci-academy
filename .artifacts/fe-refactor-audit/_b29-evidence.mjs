/**
 * BATCH 29 — fresh evidence for fill / video / markdown contracts.
 */
import fs from "node:fs"
import path from "node:path"

const ROOT = process.cwd()
const ART = path.join(ROOT, ".artifacts/fe-refactor-audit")

const evidence = {
  generatedAt: new Date().toISOString(),
  fillAvailable: {
    exactValue: "min-h-0 @app-lg:flex-1",
    note: "Prompt suggested @app-lg:min-h-0 @app-lg:flex-1; proven consumers use min-h-0 at base + @app-lg:flex-1. Map at=lg to the proven string.",
    consumers: [
      { component: "ContentMap", file: "src/components/layouts/LearnShellLayout/index.tsx", line: 146 },
      { component: "MilestoneOutline", file: "src/components/layouts/LearnShellLayout/index.tsx", line: 157 },
      { component: "LeaderboardCategoryRail", file: "src/components/layouts/LearnShellLayout/index.tsx", line: 168 },
      { component: "ArchitectureRail", file: "src/components/pages/ArchitecturePage/index.tsx", line: 64 },
      { component: "PracticeRail", file: "src/components/pages/PracticeHubPage/index.tsx", line: 51 },
    ],
    atBase: {
      value: "min-h-0 flex-1",
      unlockedExactConsumerOnFillTargets: false,
      note: "MockInterviewWorkspace locked; other min-h-0 flex-1 sites are not these five components. Do not add at=base in B29.",
    },
  },
  videoRenderer: {
    openTagConsumersWithClassNameOrClassNames: 0,
    note: "No <VideoRenderer|MpegDash|Standard|Youtube ... className/classNames=> open tags in repo. Safe to delete doors and stop forwarding.",
  },
  markdown: {
    srcBlocksMap: {
      file: "src/components/blocks/rendering/MarkdownContent/map.tsx",
      passesClassNameBlockMy: true,
    },
    sbCompositeMap: {
      file: ".storybook/components/composites/viewers/MarkdownContent/map.tsx",
      wrapsInDivBlockMy: true,
      passesClassName: false,
    },
    srcCompositeMap: {
      file: "src/components/composites/viewers/MarkdownContent/map.tsx",
      wrapsInDivBlockMy: true,
      passesClassName: false,
    },
  },
}

fs.writeFileSync(path.join(ART, "2026-08-09-b29-evidence.json"), JSON.stringify(evidence, null, 2) + "\n")
console.log(JSON.stringify(evidence, null, 2))
