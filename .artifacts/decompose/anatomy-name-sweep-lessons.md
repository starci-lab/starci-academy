# Anatomy Name Sweep v2 — Lessons Learned

Canon: `.claude/fe/storybook-naming.md` §2 + §2c. Rename `AnatomyNode.name` + `BlockAnatomy leaf=` from Vietnamese/dot-compound to English PascalCase identifiers across the Storybook tree. Scope-locked to those two string fields only — imports/exports/JSX/props/component names/`role`/`reason`/`note` prose untouched throughout.

## Slice results

| # | Slice | Verify | Files touched |
|---|-------|--------|----------------|
| 1 | cards | pass | 12 |
| 2 | learn-A | pass | 9 |
| 3 | learn-B | pass | 10 |
| 4 | feed-A | pass | 11 |
| 5 | feed-B+async | pass | 10 |
| 6 | marketing-A | pass | 12 |
| 7 | marketing-B | pass | 8 |
| 8 | grading | pass | 9 |
| 9 | commerce+buttons | pass | 9 |
| 10 | notifications+rewards+overlays | pass | 8 |

**10/10 slices PASS.** Total ~98 file touches (some files counted once but edited on both story + component side). Zero FAIL slices — no slice needed a redo. `npx tsc --noEmit` clean on every slice except the 2 known pre-existing baseline errors in `.next/.../validator.ts` (rag-playground page module, unrelated to any of these edits — documented exception, not a regression).

## Where SYNC story↔component got hard

The canon's §3 hardcode-sync step (`anatPart="X"` / `data-anat-part="X"` in the component `.tsx` must match the renamed `name:`/`leaf=` in the sibling `.stories.tsx`) split components into two families:

- **Hardcoded in component** (needs sync, most error-prone): ReactionBar, Composer, CommunityPostCard, CommunityCommentRow, CommentThread, ChatPanel, ActivityAvatar, CourseProgressRow, ConversationList, ChatThread, ChatComposer, GradingByline, GradeModelDropdown, GradeCreditCaption, DiffViewer, TrialConversionStrip, PricingTable, PriceTag, PhaseScarcityNote, NotificationList, NotificationBell, RewardItemCard, ContentAiChatDrawer, CourseCard, PricingCard, PlaygroundCard, UpNextCard, FlashcardDeckList, MicroservicesScene, MicroservicesDiagram, ArchitectureScene. Each of these has a literal string baked into the component's own JSX that must byte-match the story's `AnatomyNode.name`.
- **No hardcode / prop passthrough** (no sync needed, only the story side changes): ChatBubble (anatPart comes in as a prop from the story render), SelfHostGpuMark, HeroBanner, ArchitectureFlow, ChipButtonList — these already used plain English part names and only their `leaf=` needed translation.

Concrete traps hit and fixed:
- **Substring collision**: `leaf="Khung chờ · lưới"` had to be replaced before the shorter `leaf="Khung chờ"` pattern, or the script would corrupt the longer string first (cards slice, CourseCard).
- **Missed variant of the same field**: `Skeleton.Typography · giá` (dot-space variant) was missed by an automated pair-list because only the paren variant `(giá)` was registered — caught by a follow-up full grep, not by the first pass (cards slice, CourseCard.tsx line 235 LINE-layout branch).
- **Repeated block across multiple const arrays**: ArchitectureScene.stories.tsx had the same `Canvas.WebGL`/`Line.Grid`/etc. node list duplicated 3× (SCENE_PARTS, SELECTED_PARTS, NO_CAPTION_PARTS) with different surrounding role/state text each time — required re-reading the file after edit to confirm all three sites landed, not just the first.
- **leaf= naming convention ambiguity**: canon says "khớp story name" — in most slices this meant the `export const` identifier, but some components override the *display* name shown in the Storybook UI (e.g. DeckCard's `Skeleton` story displays as "Loading" and `SkeletonGrid` as "Loading.Grid") — leaf was set to match the *display* name in those cases, not the raw export identifier. Worth flagging to a human because it's a judgment call, not a mechanical rule.

## Sample renames (representative, one per family)

- `Typography · title` → `Typography.Title` (near-universal pattern, ~40+ occurrences across slices)
- `Dot chưa đọc` → `Dot`
- `Button · chính` / `Button · phụ` → `Button.Primary` / `Button.Secondary`
- `div · hàng CTA` → `Div.CtaRow`
- `svg · scene` → `Svg.Scene`; `g · connectors` → `G.Connectors`
- `Khung chờ · lưới` → `Loading.Grid` (matched a story's *display name override*, not its export const)
- `leaf="Chưa react"` → `leaf="NoInteraction"`
- `leaf="Đã có giá · còn bài miễn phí"` → `leaf="PriceLoadedWithFreeLeft"`

## Slices worth a human eyeball before trusting badges blind

- **cards** — the one confirmed near-miss (Skeleton.Typography.Price in CourseCard's LINE-layout skeleton branch was fixed by hand after a follow-up grep, not caught by the first automated pass). Worth a quick visual check in Storybook that the LINE-layout skeleton price badge still lights up.
- **marketing-B (ArchitectureScene)** — 3 duplicated const blocks in one story file; low but nonzero risk one of the three didn't get the exact same rename if a future edit touches this file again without re-grepping all three.
- **learn-A (DeckCard)** and **notifications+rewards+overlays** — leaf values chosen by *display name* rather than export-const identifier in a few spots; if another engineer expects `leaf=` to always equal the export const, these will look "wrong" even though they're intentionally matching the on-screen story label.

Everything else synced cleanly on the first automated/manual pass per the per-slice notes.

## Reminder for whoever reviews this by eye

- **Restart Storybook** (dev server caches the old anatomy strings; a plain browser refresh is not reliable after this many renamed identifiers across nested JSX).
- After restart, **hard-reload** the Storybook tab (the anatomy badge overlay reads from a client-side registry that can go stale on hot-reload alone).
- Spot-check the two flagged folders above (CourseCard LINE-skeleton price badge, ArchitectureScene's 3 duplicated const blocks) directly in the browser, not just via grep, since those are the two places a silent mismatch could still be hiding.
- No `tsc` error can catch a story/component string mismatch — the sync is duck-typed through matching string literals, not the type system, so a fresh visual pass is the only real safety net for the "badge disappears" failure mode this canon exists to prevent.
