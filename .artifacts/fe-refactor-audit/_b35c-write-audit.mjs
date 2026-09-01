import fs from "node:fs";

const gap = JSON.parse(
  fs.readFileSync(".artifacts/fe-refactor-audit/_b35c-gap-beside.json", "utf8"),
);

const by = new Map();
for (const h of gap.gapNew) {
  if (!by.has(h.path)) by.set(h.path, h);
}

const regressions = [];
for (const [path, h] of by) {
  regressions.push({
    kind: "gap-align-padding-beside-principle",
    path,
    evidence: `B35 added principle while retaining public frame CSS props (${h.props.join(",")}); TOPOLOGY requires principle to exclusively own gap/padding/align/justify. sample: ${h.snippet}`,
  });
}

regressions.push({
  kind: "dishonest-principle",
  path: "src/components/blocks/feed/EntityLink/index.tsx",
  evidence:
    'principle="icon-text" stamped on Box root whose sole leaf is Typography text (no icon). Explain admits sole leaf; icon-text misnames a text-only token.',
});

regressions.sort(
  (a, b) => a.kind.localeCompare(b.kind) || a.path.localeCompare(b.path),
);

const out = {
  batch: "B35c",
  checkpoint: "02011807",
  filesAudited: 301,
  regressions,
  regressionCount: regressions.length,
  ok: regressions.length === 0,
  notes: [
    "Automated scan of all 301 retainedProduct paths vs git diff 02011807; deep spot-check of 55+ high-risk files (ChatPane, coordinator door burns, Box intros, className removals, principle stamps) across agents.",
    "Cleared after review: raw-host SettingsSidebarNav (held sticky div retained inside new StackV root — not a raw-for-raw swap); SearchBar/PaginationSkeleton/Navbar className door burns kept pre-existing internal host literals (not door-to-local laundering); public-api deletions are page-folder moves with live imports retargeted to @/hooks and @/modules; ChatPane skeleton repair intentional (await-id -> isSkeleton; ChatPaneSkeleton deleted); ComponentType->ReactNode none; line-ending/formatting churn none; ProfileLoadingState Box+className mirrors pre-checkpoint src hold (SB twin catch-up, not new escape); ContentAiSelectionAsk SB identity-only touch — className door pre-existing, src twin is connected not presentational.",
    "gap-align-padding-beside-principle: 52 files where principle was newly co-located with gap/align/padding/justify on the same frame open tag (deduped one finding per file).",
    "no-public-frame-css-props remains pilot-scoped per ESLINT-RULESET.md; TOPOLOGY still forbids dual ownership — reported as architectural regression.",
    "Spot-check owners covered: shared-consumer-chains-coordinator, learn-course-content, navigation-shells-layouts, overlays-modals-drawers, commerce-account-settings, community-feed-blog-league, profile-cv-careers-consultant, dashboard-admin-system-architecture, ChatPane skeleton repair, pages-and-filing samples.",
  ],
};

fs.writeFileSync(
  ".artifacts/fe-refactor-audit/2026-08-10-b35c-diff-audit.json",
  JSON.stringify(out, null, 2) + "\n",
);

console.log(
  JSON.stringify(
    {
      regressionCount: out.regressionCount,
      ok: out.ok,
      kinds: regressions.reduce((a, r) => {
        a[r.kind] = (a[r.kind] || 0) + 1;
        return a;
      }, {}),
      outPath: ".artifacts/fe-refactor-audit/2026-08-10-b35c-diff-audit.json",
    },
    null,
    2,
  ),
);
