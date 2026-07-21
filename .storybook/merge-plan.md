# merge-plan.md — Primitives trùng khái niệm → kế hoạch gộp

> Audit toàn bộ `Primitives/*` tìm component **trùng khái niệm / near-duplicate** để gộp (như CheckListCard+CrossListCard
> → `CrossListCard`, đã làm). Đây là **PLAN** — chưa merge, thầy duyệt từng cái. Gộp ở Storybook trước, **sync `src` sau**
> (⚠️ nhiều primitive còn dùng ở 100+ file src → gộp = consolidation spec, không đụng src ngay).
> Đã done: **CrossListCard** (= CheckListCard + CrossListCard, prop `mark`). Đã có sẵn: LabeledCard→SurfaceCard, LabeledAccordionCard→SurfaceAccordionCard.

## TIER A — HIGH confidence (structural duplicate, làm trước)

| # | Gộp | Bằng chứng | Đề xuất | Keep / Delete |
|---|---|---|---|---|
| A1 | **DotChip** ← DifficultyChip · LanguageChip · AiCategoryChip | JSX y đúc (`span > dot + Typography body-xs muted`), chỉ khác map; doc tự ghi "mirroring LanguageChip's shape" | `DotChip{label, dotClassName?/dotColor?}` + 3 map-wrapper mỏng | KEEP DotChip + maps · DELETE 3 JSX body |
| A2 | **HostPlatformChip → EnumChip** | HostPlatformChip inline nguyên copy EnumChip (30 dòng) + TODO tự nhận | import `../EnumChip` | DELETE inline copy |
| A3 | **Skeleton standalone → compound** (SkeletonText·Paragraph·AccordionSkeleton·PaginationSkeleton) | trùng `Skeleton.Typography/.Paragraph/.Accordion/.Pagination`; compound app-accurate hơn | absorb config (width string, size, per-item body) vào compound | DELETE 4 standalone folder |
| A4 | **StatePlaceholder** ← EmptyState + ErrorState | cùng `flex flex-col items-center gap-3 py-6 text-center` + icon + title medium + desc muted + action; ErrorState = EmptyState + warning icon + retry | `StatePlaceholder{icon,title,description,action,tone?}`; ErrorState = preset `tone="danger"` | KEEP 1 · DEMOTE ErrorState → preset |
| A5 | **Surface frame DRY** (SurfaceCard·SurfaceListCard·SurfaceAccordionCard·CrossListCard) | khung `overflow-hidden rounded-3xl bg-surface + (border XOR shadow-surface)` copy-paste 4×; scaffold section+header+caption triplicate | rút `surfaceFrameClass({bordered,flush})` + `<SurfaceSection>` dùng chung | KEEP public 3 · DELETE code trùng vào helper |
| A6 | **Legend dedup** (Legend + inline SegmentBar·CourseProgressBar·LanguageDonut) | legend markup byte-identical (`flex flex-wrap gap-x-3 gap-y-2`, dot `size-2.5 rounded-full`, `body-xs muted`) | `Legend{items:[{label,color,suffix?}], direction?}` làm chủ | KEEP Legend · DELETE 3 inline |
| A7 | **ListRow ⟷ SurfaceListCardRow** (cross-tier!) | `content` block line-for-line giống (leading·title·subtitle·meta+trailing) | 1 `ListRow` superset (selected/disabled/hover/verdict/`<button>`/RowAnchor + `separator?: divider\|inset\|none`); SurfaceListCard render ListRow | KEEP merged ListRow · DELETE SurfaceListCardRow export (alias) + thin ListRow |
| A8 | **inline SeeMore → SeeMoreLink** | `surface-card-header.tsx` vẽ tay lại SeeMoreLink (accent + caret translate) | import `navigation/SeeMoreLink` | DELETE inline SeeMore |
| A9 | **ProgrammingLanguageTabs → ExtendedTabs** | PLT tự vẽ raw HeroUI `<Tabs>` + chrome-constants, lặp secondary-underline mà ExtendedTabs đã có | PLT = thin wrapper map 4 lang → ExtendedTabs; giữ enum/util | DELETE inline Tabs + class-constants |

## TIER B — MED-HIGH (merge thật, kiểm nhẹ trước)

| # | Gộp | Đề xuất | Note |
|---|---|---|---|
| B1 | **CrossListCard ⊂ SurfaceListCard** | thêm `mark?: check\|cross\|none` vào `SurfaceListCardItem`, xoá CrossListCard | ⚠️ CrossListCard dùng semantic `<ul>/<li>` (a11y) — giữ qua prop `as`. **Design decision** (xem D2) |
| B2 | **Stat** ← StatPair + MetricCard | `Stat{value,label,hint?,framed?}`; MetricCard = `<Stat framed hint/>`; rename StatPair→Stat | VerdictHeroCard.splits rewire về Stat |
| B3 | **HighlightChip → StatusChip** | `<StatusChip tone icon>` + children value+label | kiểm layout PageHeader meta trước |
| B4 | **SearchInput → SearchAutocomplete/ComboBox** | SearchInput tự vẽ lại nguyên ComboBox (framer-motion + keyboard nav) | giữ mode "no-suggestions"; SearchBar = ComboBox + suffix |

## TIER C — MEDIUM (giảm surface, tuỳ chọn)

- **C1** SimpleEmptyState → `variant="inline"` của StatePlaceholder (A4).
- **C2** StatGroup ← StatRibbon + StatGridCard (`layout: ribbon\|grid`) — 2 engine sau 1 prop.
- **C3** ImageDropzone ⟷ Dropzone → ImageDropzone = preset image của Dropzone.
- **C4** FlexWrapButtonRadio ⟷ SelectableCardGroup → chung `SelectableItem<T>` type / `variant: pills\|cards` (feature khác nhau, có thể giữ 2 tên).
- **C5** IconTile ⟷ BadgeImage → rút hook chung `ImageWithFallback` (KHÔNG gộp component).
- **C6** dedup underline-hover row (NestedCard↔SurfaceListCardRow) + normalize SummaryCard re-skin (canon-drift: `rounded-xl`, `border-divider/60`, `bg-accent/5`).

## TIER D — DEFER / DESIGN DECISION (thầy quyết, không auto-merge)

- **D1** ProgressMeter + ProgressRing → `Progress shape="bar"\|"ring"` · SegmentBar + LanguageDonut → `Breakdown shape` — **defer**: prop-union leaky, dep nặng (recharts), domain map. 1 concept 2 impl.
- **D2** **SurfaceCard (header NGOÀI) vs SectionCard (header TRONG border-b)** — 2 idiom "titled card" cạnh tranh → **chốt cái nào canonical** trước khi merge. Liên quan B1 (CrossListCard giữ riêng semantic hay fold vào SurfaceListCard).
- **D3** BrandLogo → Logo (BrandLogo là near no-op `<Logo h-9>`); + sửa docstring lệch (S-mark vs C-mark).

## GIỮ RIÊNG (distinct — không gộp)
EnumChip (base) · StatusChip (API riêng: onCancel) · TagChips (list overflow) · Callout (tinted surface-in-surface ≠ Alert) · ErrorPageState (page-scale, có `code`) · InfoTooltip · ReadinessChecklist · ConfirmDialog · PressableCard · GroupPressableCard (compose PressableCard) · FlipCard · HighlightCard (modifier) · MediaCard · SectionCard (pending D2) · CourseProgressBar (N-lane) · Score · TopicMasteryGrid · MilestoneRoadmap · DeadlineCallout (composite ≠ Callout) · VerdictHeroCard · TabsCard (compose ExtendedTabs) · ExtendedTabs · BackLink · UserAvatar/AvatarGroup/UserCell (compose family) · LabeledList · Stepper · Pagination · ResponsiveBreadcrumb · SnippetIcon · các button (đều thêm placement/tone/compose).

## THỨ TỰ LÀM đề xuất
1. Tier A (9 cái) — mechanical, confidence cao, zero API risk (trừ A7 cần alias migration).
2. Tier B (4 cái) — merge thật, kiểm nhẹ.
3. Chốt **D2** (SurfaceCard vs SectionCard) — quyết định gốc, ảnh hưởng B1.
4. Tier C / D còn lại.
