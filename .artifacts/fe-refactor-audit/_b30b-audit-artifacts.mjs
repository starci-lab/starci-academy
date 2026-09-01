/**
 * BATCH 30b — update worker/status artifacts with semanticClosureAudit.
 */
import fs from "node:fs"
import path from "node:path"

const ART = path.join(process.cwd(), ".artifacts/fe-refactor-audit")

const audit = {
  batch: "30b",
  confirmedFalseClosure: {
    file: "src/components/blocks/dashboard/LeaderboardListCard/index.tsx",
    oldPayload: 'bare branch: <div className="flex flex-col gap-3"> after className door removed',
    classification: "principle-owned",
    owner: "StackV principle=sibling-stack (shared by bare + LabeledCard branches)",
    action: "Shared content StackV; bare returns content; LabeledCard wraps same content; gap prop removed (principle owns spacing)",
    verification: "bare no-raw-shape on outer stack cleared; pre-existing row-internal flex warnings remain (not introduced by B30 door burn)",
  },
  findings: [
    {
      file: "src/components/blocks/dashboard/LeaderboardListCard/index.tsx",
      oldPayload: 'className={cn("flex flex-col gap-3", className)} → className="flex flex-col gap-3"',
      classification: "principle-owned",
      owner: "StackV sibling-stack",
      action: "fixed in 30b",
      verification: "shared content stack",
    },
    {
      file: "src/components/blocks/lists/LabeledList/index.tsx",
      oldPayload: 'className={cn("flex flex-col gap-3", className)} → className="flex flex-col gap-3" (+ inner flex rows)',
      classification: "principle-owned",
      owner: "StackV sibling-stack + StackH icon-text + StackV gap={2} for rows",
      action: "fixed in 30b — door stay closed; raw layout replaced with frames",
      verification: "0 no-raw-shape on LabeledList after repair",
    },
    {
      file: "src/components/blocks/navigation/SidebarNavItem/index.tsx",
      oldPayload: "removed className from cn(intrinsic row chrome…)",
      classification: "intrinsic",
      owner: "SidebarNavItem leaf chrome (active/hover/focus/collapsed)",
      action: "no change — appearance chrome, not child spacing/placement",
      verification: "0 no-raw-shape warnings on file",
    },
    {
      file: "src/components/blocks/lists/ListRow/index.tsx",
      oldPayload: "className door → density default|comfortable maps py-2|p-3",
      classification: "intrinsic",
      owner: "ListRow density (padding axis)",
      action: "preserved — intrinsic density, not parent placement",
      verification: "pre-existing internal column flex warnings unchanged (not B30 false closure)",
    },
    {
      file: "src/components/blocks/commerce/TierCardBase/index.tsx",
      oldPayload: "className door → isFeatured maps border-accent ring-2 ring-accent/30",
      classification: "intrinsic",
      owner: "TierCardBase isFeatured merchandising chrome",
      action: "preserved",
      verification: "pre-existing internal flex divs unchanged (not from door payload)",
    },
    {
      file: "src/components/blocks/commerce/TierCard/index.tsx",
      oldPayload: "className popular ring → isFeatured",
      classification: "intrinsic",
      owner: "TierCardBase.isFeatured",
      action: "preserved migration",
      verification: "ok",
    },
    {
      file: "src/components/blocks/navigation/FlexWrapButtonRadio/index.tsx",
      oldPayload: "HeroUI ButtonGroup className=w-fit + Separator className chrome",
      classification: "intrinsic",
      owner: "ButtonGroupRoot (w-fit baked) + ButtonGroupSeparator (chrome baked)",
      action: "preserved — migrated to doorless atoms, no private raw copy of removed CSS",
      verification: "ok",
    },
    {
      file: "src/components/blocks/learn/lesson/ContentTabBar/index.tsx",
      oldPayload: "TabsCard className mx-auto w-full max-w-3xl → Container size=md",
      classification: "parent-placement",
      owner: "Container center-measure / size=md",
      action: "preserved",
      verification: "outer w-full div pre-existed; not a door hide",
    },
    {
      file: "src/components/pages/ArchitecturePage/ArchitectureMap/index.tsx",
      oldPayload: "TabsCard className w-full max-w-xs → Box parent",
      classification: "parent-placement",
      owner: "Box escape (exact max-w-xs; no Container size)",
      action: "preserved",
      verification: "ok",
    },
    {
      file: "src/components/pages/FlashcardsPage/index.tsx",
      oldPayload: "TabsCard className w-full → Box parent",
      classification: "parent-placement",
      owner: "Box w-full",
      action: "preserved",
      verification: "ok",
    },
    {
      file: "src/components/pages/NotificationsPage/index.tsx",
      oldPayload: "TabsCard className overflow-x-auto → Box principle=reel",
      classification: "parent-placement",
      owner: "Box reel + overflow-x-auto",
      action: "preserved",
      verification: "ok",
    },
    {
      file: "src/components/pages/DashboardPage/TopLearners/component.tsx",
      oldPayload: "passthrough className removed",
      classification: "parent-placement",
      owner: "dead passthrough (never painted on non-bare path)",
      action: "preserved door burn",
      verification: "ok",
    },
  ],
  unresolvedPreExistingInB30TouchedFiles: [
    {
      file: "src/components/blocks/dashboard/LeaderboardListCard/index.tsx",
      note: "9× no-raw-shape on row/standing internal flex markup — pre-existed B30; not introduced by door removal; out of 30b regression scope",
    },
    {
      file: "src/components/blocks/lists/ListRow/index.tsx",
      note: "internal text/meta column flex — pre-existing leaf structure",
    },
    {
      file: "src/components/blocks/commerce/TierCardBase/index.tsx",
      note: "internal Card layout flex divs — pre-existing",
    },
  ],
  holdsUnchanged: [
    "TabsCard door live (QuizSession)",
    "composite ButtonGroup classNames (nivoexpert)",
    "SectionCard / QuizCard classNames",
  ],
}

for (const name of [
  "leaderboard-list-card",
  "sidebar-labeled-list",
  "coordinator-verification",
]) {
  const p = path.join(ART, `2026-08-09-b30-worker-${name}.json`)
  const data = JSON.parse(fs.readFileSync(p, "utf8"))
  data.semanticClosureAudit = name === "coordinator-verification"
    ? audit
    : {
        ...audit,
        scope: name,
        findings: audit.findings.filter((f) => {
          if (name === "leaderboard-list-card") {
            return f.file.includes("LeaderboardListCard") || f.file.includes("TopLearners")
          }
          if (name === "sidebar-labeled-list") {
            return f.file.includes("LabeledList") || f.file.includes("SidebarNavItem")
          }
          return true
        }),
      }
  if (name === "leaderboard-list-card") {
    data.changed = [
      "src/components/blocks/dashboard/LeaderboardListCard/index.tsx",
      "src/components/pages/DashboardPage/TopLearners/component.tsx",
    ]
    data.regressions = []
    data.verification = {
      ...(data.verification || {}),
      b30b: "bare/card shared StackV sibling-stack; no gap beside principle",
    }
  }
  if (name === "sidebar-labeled-list") {
    data.changed = [
      "src/components/blocks/navigation/SidebarNavItem/index.tsx",
      "src/components/blocks/lists/LabeledList/index.tsx",
    ]
    data.verification = {
      ...(data.verification || {}),
      b30b: "LabeledList false closure repaired with Stack frames",
    }
  }
  fs.writeFileSync(p, JSON.stringify(data, null, 2) + "\n")
}

const statusPath = path.join(ART, "2026-08-09-b30-status.json")
const status = JSON.parse(fs.readFileSync(statusPath, "utf8"))
status.semanticClosureAudit = audit
status.batchNote = "30b regression repair on top of uncommitted B30"
fs.writeFileSync(statusPath, JSON.stringify(status, null, 2) + "\n")

const mdPath = path.join(ART, "2026-08-09-b30-status.md")
let md = fs.readFileSync(mdPath, "utf8")
if (!md.includes("## Semantic closure audit (30b)")) {
  md += `
## Semantic closure audit (30b)

**Confirmed false closure:** \`LeaderboardListCard\` bare branch kept \`flex flex-col gap-3\` after the public \`className\` door was removed.

**Repair:** one shared \`StackV principle="sibling-stack"\` for bare and \`LabeledCard\` branches; no \`gap\` beside the principle.

**Also repaired:** \`LabeledList\` same pattern (\`cn(..., className)\` → private raw flex) → \`StackV\`/\`StackH\` frames; door stays closed.

| File | Old payload | Class | Owner | Action |
|---|---|---|---|---|
| LeaderboardListCard | bare \`flex flex-col gap-3\` | principle-owned | StackV sibling-stack | fixed |
| LabeledList | section \`flex flex-col gap-3\` | principle-owned | StackV + StackH | fixed |
| SidebarNavItem | door drop from intrinsic cn | intrinsic | leaf chrome | keep |
| ListRow | density ← p-3 | intrinsic | density prop | keep |
| TierCardBase | isFeatured ← ring | intrinsic | isFeatured | keep |
| FlexWrapButtonRadio | HeroUI CSS → atoms | intrinsic | ButtonGroupRoot/Separator | keep |
| ContentTabBar / ArchitectureMap / Flashcards / Notifications | TabsCard measure CSS | parent-placement | Container/Box | keep |

**Unresolved (pre-existing in B30-touched files, not B30 door hides):** LeaderboardListCard row-internal flex; ListRow/TierCardBase internal flex. Not claimed fixed.

**Holds unchanged:** TabsCard (QuizSession), composite ButtonGroup (nivoexpert), SectionCard/QuizCard.
`
  fs.writeFileSync(mdPath, md)
}

console.log("artifacts updated")
