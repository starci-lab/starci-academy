/**
 * BATCH 23 — write disjoint worker manifests + aggregate status.
 */
import fs from "node:fs"
import path from "node:path"

const out = path.join(process.cwd(), ".artifacts/fe-refactor-audit")
const inv = JSON.parse(fs.readFileSync(path.join(out, "2026-08-09-b23-css-door-inventory.json"), "utf8"))

const workers = {
  "pressable-group-contract": {
    changed: [
      ".storybook/components/composites/cards/SurfaceCard/SurfaceCard.tsx",
      "src/components/composites/cards/SurfaceCard/index.tsx",
      ".storybook/components/starci/blocks/learn/ContentPager/ContentPager.tsx",
      "src/components/blocks/learn/ContentPager/index.tsx",
      ".storybook/stories/composites/cards/SurfaceCard/SurfaceCardPressableGroup.stories.tsx",
    ],
    skipped: [],
    holds: [
      "item.classNames residual retained (AllowedClassName tweaks / skeleton); not deleted this batch",
      "SurfaceCard.contentClassName still funnels verdictBand + residual classNames",
    ],
    evidence: [
      "Grid already owns span?: 1|2 with intentional min-w-0 wrapper for span=2",
      "Sole live col-span-2 consumers: ContentPager SB+src + PagerFullWidth story",
      "Press/focus stay on Base; wrapper is non-interactive — matches ExpertSiteOverview Grid.span usage",
      "Prior path put col-span-2 on Base via contentClassName; new path uses GridItem.span (canonical)",
    ],
    handoff: {
      applied: "SurfaceCardPressableGroupItem.span?: 1 | 2 → GridItem.span",
      consumersMigrated: ["ContentPager", "PagerFullWidth story"],
      notClaimed: "item.classNames door still live until zero residual consumers",
    },
    ratchetReady: false,
    verification: { twinParity: "SB↔src PressableGroup + ContentPager" },
    regressions: [],
  },
  "nivoexpert-handoff": {
    changed: [],
    skipped: [".storybook/components/nivoexpert/** — mandatory non-edit"],
    holds: ["DrawerShell.contentClassName sole consumer LessonEditorPanel"],
    evidence: [
      "LessonEditorPanel.tsx:~150 contentClassName=\"w-full sm:max-w-[560px]\"",
      "DrawerShell maps contentClassName → DrawerContent; dialogWidth → DrawerDialog (different nodes)",
      "Existing dialogWidth tokens: default|cart (cart → sm:max-w-md ≈ 28rem ≠ 560px)",
    ],
    handoff: {
      id: "lesson-editor-drawer-width",
      ownerBatch: "future Nivo/Nivoexpert-allowed batch",
      steps: [
        "Confirm visually whether width must live on DrawerContent vs DrawerDialog (HeroUI Drawer)",
        "If Dialog owns width: add DrawerDialogWidth token e.g. editor → \"w-full sm:max-w-[560px]\" (or nearest scale token if design accepts)",
        "If Content must own width: add a named contentWidth axis — do NOT rename contentClassName",
        "Edit LessonEditorPanel only: swap contentClassName for the semantic prop",
        "Re-scan consumers; delete DrawerShell.contentClassName when zero remain",
      ],
      doNot: ["edit nivoexpert in CSS-door house batches", "map 560px onto cart/sm:max-w-md without design sign-off"],
      notClaimedFixed: true,
    },
    ratchetReady: false,
    verification: { edits: "none" },
    regressions: [],
  },
  "showcase-locked-handoff": {
    changed: [],
    skipped: ["LearnLoopScroll locked — no ShowcaseMockup/LearnLoopScroll edits"],
    holds: ["ShowcaseMockup.contentClassName"],
    evidence: [
      "LearnLoopScroll StepVisual: contentClassName={cn(\"flex flex-col p-4\", align==='start' ? justify-start : justify-center)}",
      "Inner motion.div already owns flex flex-col gap-3 (content-row) — outer also sets flex-col + padding + justify",
      "TalentMarketplace (unlocked twin consumer): contentClassName=\"flex flex-col gap-3 p-4\" — parent-placement candidate after unlock coordination",
    ],
    handoff: {
      id: "showcase-mockup-content-layout",
      whyNotMechanical: [
        "LearnLoopScroll is a locked path — cannot migrate the consumer that proves the door",
        "Payload mixes padding (p-4), flex direction, and conditional justify — not one proven bodyVariant",
        "Inner child already applies flex-col gap-3; deleting outer flex without unlock risks double-stack / justify loss",
      ],
      owningFuture: {
        composite: "ShowcaseMockup",
        candidate: "contentVariant or inset+align props (e.g. padded-stack | padded-start) — design must pick one closed set after LearnLoopScroll unlock",
        interim: "keep contentClassName; migrate TalentMarketplace only together with LearnLoopScroll in an unlock batch",
      },
      notClaimedFixed: true,
    },
    ratchetReady: false,
    verification: { edits: "none" },
    regressions: [],
  },
  "css-door-ratchet-inventory": {
    changed: [
      ".artifacts/fe-refactor-audit/2026-08-09-b23-css-door-inventory.json",
      ".artifacts/fe-refactor-audit/2026-08-09-b23-css-door-inventory.md",
    ],
    skipped: [
      "eslint vendor allowlist unchanged",
      "rule severity not raised to error",
    ],
    holds: [
      "live-api declarations block error-ratchet",
      "locked + teacher-hold (nivo) trees excluded from mechanical burn",
    ],
    evidence: [
      `totalHits=${inv.totalHits}`,
      `totalFiles=${inv.totalFiles}`,
      ...Object.entries(inv.summary).map(([k, v]) => `${k}: ${v.hits} hits / ${v.files} files`),
    ],
    handoff: {
      id: "css-door-error-ratchet",
      when: "after live-api declaration count → 0 (or only vendor-boundary remains)",
      then: "flip starci-fe/no-public-classname-prop to error; keep vendor allowlist",
      doNot: ["eslint-disable to hide debt", "expand vendor allowlist without evidence"],
    },
    ratchetReady: inv.summary["ratchet-ready"],
    verification: { inventory: "2026-08-09-b23-css-door-inventory.md" },
    regressions: [],
  },
  "storybook-parity-and-tests": {
    changed: [
      ".storybook/components/composites/cards/SurfaceCard/SurfaceCard.tsx",
      "src/components/composites/cards/SurfaceCard/index.tsx",
      ".storybook/components/starci/blocks/learn/ContentPager/ContentPager.tsx",
      "src/components/blocks/learn/ContentPager/index.tsx",
      ".storybook/stories/composites/cards/SurfaceCard/SurfaceCardPressableGroup.stories.tsx",
    ],
    skipped: [],
    holds: [],
    evidence: ["span API + ContentPager migration mirrored SB→src", "PagerFullWidth story updated to span: 2"],
    handoff: {},
    ratchetReady: false,
    verification: { gates: "see status.json" },
    regressions: [],
  },
}

for (const [name, w] of Object.entries(workers)) {
  fs.writeFileSync(
    path.join(out, `2026-08-09-b23-worker-${name}.json`),
    JSON.stringify({ partition: name, ...w }, null, 2),
  )
}

const status = {
  batch: 23,
  title: "Boundary handoff and lint ratchet preparation",
  committed: false,
  checkpoint: "bd09062d",
  headAtWrite: null,
  generatedAt: new Date().toISOString(),
  appliedCode: {
    pressableGroupItemSpan: "span?: 1 | 2 → GridItem.span",
    migrated: ["ContentPager SB+src", "PagerFullWidth story"],
  },
  handoffsNotClaimedFixed: [
    "lesson-editor-drawer-width",
    "showcase-mockup-content-layout",
    "css-door-error-ratchet",
  ],
  cssDoorSummary: inv.summary,
  verification: {},
}

fs.writeFileSync(path.join(out, "2026-08-09-b23-status.json"), JSON.stringify(status, null, 2))

const md = `# BATCH 23 — Boundary handoff and lint ratchet preparation

**Committed:** no  
**Checkpoint:** \`bd09062d\`

## Applied code (only)

| Change | Detail |
|---|---|
| \`SurfaceCardPressableGroupItem.span?: 1 \\| 2\` | Forwards to \`GridItem.span\` (existing frame contract) |
| Consumers | ContentPager (SB+src), PagerFullWidth story — left \`classNames: ["col-span-2"]\` |

DOM note: span=2 uses Grid's \`min-w-0 col-span-2\` wrapper (same as other Grid span cells). Press/focus remain on the tile \`Base\`.

## Handoffs (not fixed)

### 1. Nivoexpert DrawerShell
- Consumer: \`LessonEditorPanel\` \`contentClassName="w-full sm:max-w-[560px]"\`
- \`contentClassName\` → \`DrawerContent\`; \`dialogWidth\` → \`DrawerDialog\` (different nodes)
- \`cart\`/\`sm:max-w-md\` ≠ 560px — needs a new token or Content-axis after visual confirm
- Future Nivo-allowed batch only

### 2. ShowcaseMockup + locked LearnLoopScroll
- Cannot mechanically replace: locked consumer + mixed pad/flex/justify payload
- Owning future: ShowcaseMockup content inset/align variant after unlock; migrate TalentMarketplace in same batch

### 3. CSS-door lint ratchet
- Fresh inventory: **${inv.totalHits}** hits / **${inv.totalFiles}** files
- Buckets: ${Object.entries(inv.summary).map(([k, v]) => `\`${k}\` ${v.hits}`).join(", ")}
- **Do not** flip rule to error while \`live-api\` declarations remain
- Vendor allowlist unchanged this batch

## Verification

| Gate | Result |
|---|---|
| (filled after run) | |
`

fs.writeFileSync(path.join(out, "2026-08-09-b23-status.md"), md)
console.log("b23 workers + status written")
