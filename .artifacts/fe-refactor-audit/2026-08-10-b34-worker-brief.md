# B34 worker brief

Checkpoint: `6ff21c66` · Do not commit · Do not edit CLAUDE.md or decision-ledger.json
Forbidden: nivo / nivoexpert / mia-mia / locked / a11y

## Wave A — COMPLETE (tsc 0)

Contracts A–D owners landed. Reuse existing `IconComponent`.

## Wave B — migrations

Read `.artifacts/fe-refactor-audit/2026-08-10-b34-manifests.json` wave B section.
Edit ONLY your manifest files. No file overlap.

Touched-file law: zero introduced errors/warnings on retained changes; no raw CSS replacement; no SB/src drift; no eslint-disable.

Write report: `.artifacts/fe-refactor-audit/2026-08-10-b34-worker-<name>.json`

### glyphmark-consumer-migration
- Replace glyphClass tables with `{ Icon, tone }` + `<GlyphMark icon={} tone={} isSkeleton={} />`
- Delete hand-rolled size-5 / Skeleton rounded-full
- WeeklyGoals is NOT exact (`text-muted`) — do not edit; report hold

### qa-header-src-consumer-migration
- Mirror Wave A SB QaConversationHeader into src (canonical person + labels)
- Update QaQuestionThread (src + SB) call sites; map username→id; resolve displayName at boundary
- House Button/Avatar/etc.; no FollowButton block import; no HeroUI; no CSS doors
- Also migrate MarkdownContent className on QaQuestionThread files to presentation axes

### markdown-consumers-learn
- Add density/tone/flow/emphasis/previewLines to blocks/rendering MarkdownContent (mirror composite mappings)
- Keep className door until coordinator proves zero allowed consumers
- Migrate QaMessageBubble, QaInboxRow, ChallengeCard (not QaQuestionThread)

### markdown-consumers-feed-profile-and-chip-icons
- Migrate CommunityPostCard/CommentRow, TaskResult, MockInterviewScorecard
- StatusChip + legacy EnumChip: icon is ComponentType, owner mounts it; no ReactNode/iconClassName
- Do not edit composite EnumChip check/cross API unless brand path requires it

### coordinator-parity-gates
- Replace raw `<nav className="flex min-h-0 flex-1 flex-col">` with NavigationRail body slot
- Keep src CollapsibleSidebar.className for mia-mia; SB stays doorless
- After peer worker JSON exists: gates listed in batch; note door burns
