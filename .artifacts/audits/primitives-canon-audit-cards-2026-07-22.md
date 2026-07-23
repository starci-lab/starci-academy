# Primitives canon audit — họ Card (2026-07-22)

> Scope: 13 primitive `Primitives/Card/*` · PORT-only (`.storybook/stories/blocks/cards/**`) · thước = `.claude/fe/principles.md` §1–6 + template ButtonGroup.
> Máy: 13× Sonnet audit + 1× Opus synth (workflow `wf_5acf2612-942`). Tổng 29 gap.
> **Report-only** — chưa sửa gì; batch fix đi lane `starci-fe-story-fix-block-{plan,apply}` / codemod.

# Audit Synthesis — Card primitives (StarCi FE Storybook)

## A. Top-N cần sửa nhất
`điểm = high×3 + med×2 + low×1`

| # | Primitive | Điểm | Gap chính |
|---|-----------|:----:|-----------|
| 1 | **Card/SummaryCard** | 16 | S4-own icon-size không tự ép (`SummaryCard.tsx:54`, callsite `.stories.tsx:24,41,57,75,84,92`); S1-surface border-no-shadow ở vai outer card (`SummaryCard.tsx:48`); C-cluster itemize 3 card tay (`.stories.tsx:69-101`) |
| 2 | **Card/MediaCard** | 10 | C-skeleton không có prop, consumer nhồi Skeleton rời (`.stories.tsx:100-119`); S4-own img sizing đã own nhưng story re-set `size-full object-cover` (`MediaCard.tsx:80` vs `.stories.tsx:34,67,84`); p-4 banned (`MediaCard.tsx:83`) |
| 3 | **Card/PressableCard** | 8 | C-skeleton thiếu (`PressableCard.tsx:11-141`); C-responsive không có `@app-sm` fallback (`:118-127`); C-props `label` optional dù docs REQUIRED khi có `actions` (`:46,129,136`) |
| 4 | **Card/SectionCard** | 7 | S4-own icon render trần `{icon}` (`SectionCard.tsx:68`), consumer set `size-5 text-*` tay (`.stories.tsx:32,50`); S5-icon lệch nấc (text-base → phải size-6); C-skeleton thiếu |
| 5 | **Card/FlipCard** | 5 | C-props "Locked" là shape tự do không prop/variant (`FlipCard.tsx:17-36`), caller hand-roll `size-8 text-muted` (`.stories.tsx:135`); C-skeleton thiếu + không story Loading |
| 5 | **Card/GroupPressableCard** | 5 | S4-own `content:ReactNode` black-box, story set `size-5` icon tay (`.stories.tsx:25,139`) — anti-pattern §4/§5a; C-skeleton thiếu (khác ButtonGroup) |
| 7 | **Card/CrossListCard** | 3 | C-skeleton thiếu ở CrossListCard/Item (`:20-30,63-78`); p-4 lệch nấc story Bordered (`.stories.tsx:73`) |
| 7 | **Card/RatingBar** | 3 | C-skeleton chỉ có `isPending`, thiếu mirror (`:219-234`); pl-4 ×2 off-scale (`:51,274`) |
| 9 | **Card/SurfaceAccordionCard** | 3 | C-skeleton thiếu, story dựng `<Skeleton.Accordion>` rời (`.stories.tsx:180-186`) |
| 10 | **Card/HighlightCard** | 2 | C-skeleton thiếu → sweep vẫn nhấn mạnh nội dung đang loading (`:29-34`) |

## B. GAP phổ biến (làn sóng)

| Check | # primitive dính | Primitives | Làn batch |
|-------|:---:|-----------|-----------|
| **C-skeleton** | **10** | CrossList, Flip, GroupPressable, Highlight, Media, Pressable, RatingBar, Section, Summary, SurfaceAccordion | ⭐ Làn sóng lớn nhất — batch isSkeleton mirror |
| **C-spacing** | 5 | CrossList, Media, Pressable, RatingBar, Summary | Codemod p-4/pl-4/gap-1 → thang 0-2-3-6-8 |
| **S4-own** (icon-size) | 4 | GroupPressable, Media, Section, Summary | Batch ownership `[&_svg]:size-*` |
| **C-props** | 3 | Flip, GroupPressable, Pressable | Variant/slot tường minh + enforce |
| **S5-icon** | 2 | Section, Summary | Đi kèm S4-own (auto-fix khi own size) |
| **C-cluster** | 2 | Media, Summary | Fold ≥2 same-role → Group primitive |
| **S1-surface** | 1 | Summary | — |
| **C-responsive** | 1 | Pressable | — |
| **card-radius** | 1 | Summary | — |

## C. Đạt canon

| Primitive | Trạng thái |
|-----------|-----------|
| **Card/NestedCard** | 0 gap |
| **Card/SurfaceCard** | 0 gap |
| **Card/SurfaceListCard** | 0 gap |
| Card/HighlightCard | Gần nhất — chỉ 1 med (C-skeleton), wrapper mỏng đúng S4-own |
| Card/SurfaceAccordionCard | Tốt 9/10 chiều, chỉ vướng C-skeleton |

## D. Khuyến nghị BATCH theo GAP

Xếp HIGH (compose/fold/surface — kéo sinh việc thừa cho anatomy) trước, rồi med, rồi low.

| # | Batch | Primitive dính | Cách fix | Lane |
|---|-------|---------------|----------|------|
| **H1** | **Cluster→Group fold** | Media (meta chips), Summary (Row 3 card) | Dựng Group primitive mới (`{primary/secondary}` slots kiểu ButtonGroup) rồi thay itemize call-site — làm TRƯỚC vì đẻ primitive mới, kéo lại anatomy | `fix-block-plan` → `apply` |
| **H2** | **Surface double-fill (outer card)** | Summary | Đổi `border-divider/60` no-shadow → `shadow-surface` no-border + `rounded-xl`→`rounded-3xl` cho vai top-level (S1) | `fix-block-plan` → `apply` |
| **H3** | **Props/variant tường minh** | Flip (`locked?`), GroupPressable (icon slot có tên), Pressable (enforce `label` khi `actions`) | Thêm variant/named-slot + conditional type thay shape tự do — khoá contract trước khi vẽ states | `fix-block-plan` → `apply` |
| **M1** | **isSkeleton mirror** ⭐ | CrossList, Flip, GroupPressable, Highlight, Media, Pressable, RatingBar, Section, Summary, SurfaceAccordion (10) | Thêm `isSkeleton?` + nhánh self-render Skeleton mirror theo template Button/ButtonGroup + story `Loading` mỗi primitive; gỡ Skeleton rời ở story | `fix-block-apply` (template hoá, apply loạt) |
| **M2** | **S4-own icon-sizing** | GroupPressable, Media(img), Section, Summary | Bọc `[&_svg]:size-* text-*` (map size-theo-text §5a) trong primitive, xoá `size-5/size-6` ở call-site → tự khỏi S5-icon | `fix-block-apply` / codemod sweep |
| **L1** | **Spacing codemod** | CrossList, Media, Pressable, RatingBar, Summary | Sweep `p-4/pb-4/px-4→p-3`, `pl-4→pl-3|pl-6`, `gap-1→gap-2`, `rounded-xl→rounded-3xl` về thang 0-2-3-6-8 | codemod sweep |

---

## Appendix — per-primitive detail

### Card/CrossListCard
CrossListCard port sạch ở phần lõi (props có tên rõ ràng, S1 surface đúng chuẩn shadow/border không double-fill, S4 icon-size tự ép nội bộ, cluster→group đã gộp đúng CrossListItem), chỉ thiếu isSkeleton mirror theo template Button/ButtonGroup và có 1 chỗ padding p-4 lệch nấc trong story Bordered.

- **[med] C-skeleton** — CrossListCard/CrossListItem không có prop isSkeleton mirror như base Button (Button.tsx:45-46, 67-73) dù đây là card hiển thị data (pricing/value-props) thường load async; CrossListCardProps (CrossListCard.tsx:20-30) và CrossListItemProps (CrossListCard.tsx:63-78) đều thiếu field này.
- **[low] C-spacing** — Wrapper mô phỏng surface ngoài ở story Bordered dùng `p-4` thay vì `p-3` chuẩn card padding (CrossListCard.stories.tsx:73: `<div className="rounded-3xl bg-surface p-4 shadow-surface">`), lệch 1 nấc so với canon 0-2-3-6-8.

### Card/FlipCard
FlipCard.tsx compose SurfaceCard + framer-motion reveal hợp lý (G-6/spacing/cluster ổn) nhưng thiếu isSkeleton loading-state và biến "Locked" thành shape tự do thay vì prop/variant tường minh, khiến caller phải hand-roll markup nhạy cảm (icon size/color) mỗi lần.

- **[high] C-props** — "Locked" là một shape/vai KHÁC hẳn của slot back (unlock-prompt icon+title+subtitle căn giữa) nhưng không có prop/variant tường minh (vd `locked?: boolean`) trong FlipCardProps (FlipCard.tsx:17-36) — nó chỉ "emerge" từ children tự do, buộc caller hand-roll đúng markup + tự set `className="size-8 text-muted"` lên LockIcon (FlipCard.stories.tsx:135) mỗi lần cần trạng thái này, dễ trôi (drift) giữa các nơi dùng.
- **[med] C-skeleton** — FlipCardProps (FlipCard.tsx:17-36) không có `isSkeleton` — không tự render skeleton mirror như base Button (Button.tsx:46,67-73); story cũng không có state "Loading/Đang tải" nào (FlipCard.stories.tsx chỉ có NotRevealed/Revealed/WithoutChips/LongAnswer/Locked/Interactive, đối chiếu ButtonGroup.stories.tsx:76-86 có hẳn story `Loading` cho `isSkeleton`).

### Card/GroupPressableCard
GroupPressableCard port tốt ở granularity (đúng vai group tách khỏi PressableCard, giống ButtonGroup/Button), responsive (container-query columns) và a11y (role=group + keyboard shortcut 1-N); nhưng thiếu isSkeleton (không như ButtonGroup) và để content tự do khiến 2 story phải tự tay set size icon thay vì primitive ép theo §4/§5a.

- **[med] C-skeleton** — GroupPressableCardProps (GroupPressableCard.tsx:64-84) không có isSkeleton — cụm ButtonGroup canon (ButtonGroup.tsx:39-40,49,60,64) pass isSkeleton xuống từng Button + có story Loading riêng (ButtonGroup.stories.tsx:76-86); GroupPressableCard không có state loading nào (không prop, không story) dù grid-of-cards (settings list, rating bar) là ứng viên loading rất tự nhiên.
- **[high] S4-own / C-props** — GroupPressableCardItem chỉ có content: ReactNode tự do (GroupPressableCard.tsx:40), không có slot icon có tên như ButtonGroupAction.icon (ButtonGroup.tsx:24); hệ quả là story tự tay set size icon bên trong content — GearIcon className="size-5 shrink-0 text-muted" (GroupPressableCard.stories.tsx:25) và CaretRightIcon className="size-5 shrink-0 text-muted" (GroupPressableCard.stories.tsx:139) — đúng anti-pattern bị cấm ở principles.md §4 dòng 116 ("consumer thêm className='size-5' cho icon... vá call-site"); vì content là black-box nên mọi call-site tương lai phải tự nhớ map size-theo-text (§5a) thay vì primitive ép 1 chỗ.

### Card/HighlightCard
HighlightCard là wrapper trang trí rất mỏng (chỉ children + sweep layer tự sở hữu qua global class), đúng S4-own và cố ý tách khỏi SectionCard (G-6 N/A vì vai/composition khác hẳn), nhưng thiếu prop isSkeleton để mute hiệu ứng khi nội dung bên trong đang loading.

- **[med] C-skeleton** — Không có prop isSkeleton (khác base Button/ButtonGroup luôn tự vẽ skeleton mirror) — interface HighlightCardProps chỉ có children/className (HighlightCard.tsx:13-18) và component render thẳng sweep + children không nhánh if-else (HighlightCard.tsx:29-34), nên khi children đang loading, hiệu ứng 'nổi bật' vẫn chạy trên nội dung skeleton, gây tín hiệu sai (đang loading mà vẫn nhấn mạnh là card quan trọng).

### Card/MediaCard
MediaCard is otherwise a clean, well-documented composition (cover full-bleed + title/meta/description/footer body with consistent gap-3), but it fails the skeleton-ownership and internal-sizing-ownership contracts the ButtonGroup/Button template establishes, plus one banned-padding-unit and one unstructured-cluster slip.

- **[high] C-skeleton** — MediaCard.tsx (props line 14-41, component line 56-114) has no `isSkeleton` prop at all — unlike base Button (Button.tsx:46,67-73) and ButtonGroup (ButtonGroup.tsx:40,49) which if-else self-render a Skeleton mirror. Consumer instead hand-assembles the loading state by manually stuffing `<Skeleton>`/`Skeleton.Chip`/`Skeleton.Button` into `cover`/`title`/`meta`/`description`/`footer` slots in MediaCard.stories.tsx:100-119 (`SkeletonLoading` story) — exactly the "consumer dùng Skeleton rời" anti-pattern the canon forbids.
- **[high] S4-own** — MediaCard.tsx:80 already forces cover sizing on any child img via the wrapper's `[&_img]:block [&_img]:size-full [&_img]:object-cover` descendant selector (ownership meant to live in the primitive, per §4/S4 pattern seen in Button.tsx:23-27 owning icon size). Yet every story that supplies a real `cover` image redundantly re-sets that same sizing itself — `className="size-full object-cover"` on the `<img>` in MediaCard.stories.tsx:34, 67 and 84 — i.e. the consumer is setting internal sizing/style the primitive already owns, contradicting the 'children truyền TRẦN' contract.
- **[med] C-spacing** — CardContent uses `px-4 pb-4 pt-3` (MediaCard.tsx:83) — `4` is an explicitly banned padding unit under the 0-2-3-6-8 discipline, and specifically violates the documented "card padding = p-3" rule (all other cards in canon use p-3, not p-4/pb-4).
- **[med] C-cluster** — `meta` accepts a raw `React.ReactNode` (MediaCardProps.meta, MediaCard.tsx:23-27) and the story hand-assembles ≥2 same-role Chips as a bare JSX fragment (`metaChips`, MediaCard.stories.tsx:19-24) rather than a typed cluster/group primitive with named slots — unlike ButtonGroup, which turns its ≥2 same-role Button cluster into a typed `{primary, secondary}` group (ButtonGroup.tsx:20-27) instead of letting callers itemize raw children.

### Card/NestedCard
placeholder

- (0 gap)

### Card/PressableCard
PressableCard's core interaction model (whole-card button/anchor + accessible stretched-link overlay for actions) is sound and correctly surface-only (shadow-surface, no border, rounded-3xl consistent per S1), but it lags the Button/ButtonGroup canon on isSkeleton, narrow-width responsive handling, statically-enforced label-when-actions, and has a couple of off-scale spacing values (px-4, gap-1).

- **[med] C-skeleton** — PressableCard.tsx:11-141 has no `isSkeleton` prop/skeleton-mirror branch at all (unlike base Button.tsx:46,67-73 which self-renders a Skeleton mirror), and PressableCard.stories.tsx has no Loading/skeleton story to match ButtonGroup.stories.tsx's `Loading` export — nav-tile/option-card lists that load async have no first-class loading state.
- **[med] C-responsive** — The stretched-link content row at PressableCard.tsx:118-127 (`flex items-center gap-3` wrapping content + `flex shrink-0 items-center gap-2` actions) has no `@app-sm` stack/wrap fallback for narrow widths, unlike ButtonGroup.tsx:52 which explicitly switches `flex-col`→`@app-sm:flex-row` — a narrow card with long content + 2 actions has no documented narrow-width behavior.
- **[med] C-props** — `label` is documented as REQUIRED when `actions` is set (PressableCard.tsx:34-46) but the type at PressableCard.tsx:46 keeps `label?: string` optional with no conditional enforcement — passing `actions` without `label` compiles fine yet leaves the overlay at PressableCard.tsx:129/136 with `aria-label={undefined}`, silently breaking the accessible name.
- **[low] C-spacing** — Card surface uses `px-4 py-3` (PressableCard.tsx:77) instead of the canon card padding `p-3`; `4` is off the 0-2-3-6-8 scale and the two axes are asymmetric where the mandate is uniform p-3.
- **[low] C-spacing** — `OptionCardContent` in the story uses `gap-1` (PressableCard.stories.tsx:34), an off-scale value outside the allowed 0-2-3-6-8 spacing steps.

### Card/RatingBar
RatingBar port sạch ở granularity/composition (đúng compose GroupPressableCard, cluster/anatomy/radius/responsive đều ổn) nhưng thiếu isSkeleton mirror và có 2 chỗ pl-4 lệch thang spacing.

- **[med] C-skeleton** — RatingBar (RatingBar.tsx:219-234, RatingBarProps) chỉ có `isPending` (disable khi đang gửi điểm), không có `isSkeleton` mirror như base Button/ButtonGroup (Button.tsx:46 `isSkeleton?`, ButtonGroup.tsx:40 pass-through `isSkeleton`) — không có state loading-placeholder cho 4 tile trước khi flashcard sẵn sàng.
- **[low] C-spacing** — `pl-4` xuất hiện 2 lần ngoài thang 0-2-3-6-8: RatingBar.tsx:51 (`return cn("pl-4", shadowClass)`) và RatingBar.tsx:274 (`className: "flex flex-col gap-2 py-2 pr-3 pl-4"`) — lệch 1 nấc, đáng lẽ pl-3 hoặc pl-6.

### Card/SectionCard
SectionCard đạt canon ở granularity/props/spacing/surface nhưng thiếu 2 mảng theo mẫu Button/ButtonGroup: chưa tự sở hữu icon-sizing (buộc consumer set size/màu tay, lệch cả tỉ lệ size-theo-text) và hoàn toàn chưa có isSkeleton/story Loading.

- **[high] S4-own** — SectionCard nhận `icon` như ReactNode rồi render trần `{icon}` (SectionCard.tsx:68), không ép size/màu nội bộ như Button sở hữu ICON_CLS (Button.tsx:23-27,77,86) — hệ quả: consumer tự set class size/màu ngay tại call-site (`size-5 text-muted` / `size-5 text-accent`, SectionCard.stories.tsx:32,50), đúng pattern 'consumer set size noi bo' bị cấm.
- **[med] S5-icon** — Title header dùng `text-base` (SectionCard.tsx:70) nên theo canon icon đi kèm phải `size-6`, nhưng vì primitive không tự ép (gap S4-own) nên 2 story minh hoạ đều dùng `size-5` (SectionCard.stories.tsx:32,50) — lệch 1 nấc so với đối chiếu font-size.
- **[med] C-skeleton** — SectionCard không có prop `isSkeleton` (props chỉ children/title/icon/action/accent/withVerdict/className/contentClassName, SectionCard.tsx:12-34) và không có story `Loading`/skeleton mirror nào (SectionCard.stories.tsx chỉ có Default/Accent/Plain/WithVerdict) — thiếu state loading tự-vẽ như Button (Button.tsx:45-46,67-73) và ButtonGroup pass-through (ButtonGroup.stories.tsx:75-86).

### Card/SummaryCard
SummaryCard composes PressableCard correctly (no hand-rolled press logic) and has clean named props, but drifts on several canon dimensions vs the ButtonGroup template: it doesn't own icon sizing (consumers set icon size manually), applies border-without-shadow as what reads like an outer card, has no isSkeleton mirror, uses banned p-4 spacing and field-tier rounded-xl instead of card rounded-3xl, lacks the trailing-icon micro-interaction, and itemizes multi-card layouts by hand instead of via a Group primitive.

- **[high] S4-own** — Primitive doesn't own icon sizing (no `[&_svg]:size-*` wrapper like base Button's ICON_CLS) — every story callsite hand-sets the icon's size instead, e.g. `.storybook/stories/blocks/cards/SummaryCard/SummaryCard.stories.tsx:24` (`<BookOpenIcon className="size-6" .../>`), repeated at lines 41, 57, 75, 84, 92; the primitive at `SummaryCard.tsx:54` only applies a color class (`text-accent-soft-foreground`), no size enforcement.
- **[high] S1-surface** — Card is rendered as the outermost card directly on a plain page background (`SummaryCard.stories.tsx:20-32`) but uses `border border-divider/60` with no shadow (`SummaryCard.tsx:48`) — outer cards must be `shadow-surface` with NO border per S1; current styling is the nested-surface treatment applied to what reads as a top-level card.
- **[high] C-cluster** — The `Row` story (`SummaryCard.stories.tsx:69-101`) itemizes 3 same-role SummaryCard instances by hand, each wrapped in an ad-hoc `<div className="w-56">`, instead of a dedicated Group primitive (cf. `ButtonGroup.tsx` composing multiple `Button`s under one primitive with shared `size`/`gap`/responsive logic) — a cluster of ≥2 same-role cards should fold into 1 group primitive, not be itemized at call-site.
- **[med] C-skeleton** — No `isSkeleton` prop/mirror exists on `SummaryCardProps` (`SummaryCard.tsx:13-26`) — base Button/ButtonGroup both self-render a skeleton mirror via `isSkeleton` (`Button.tsx:46,67-73`); SummaryCard shows metric values (loadable data) with no equivalent loading-state path.
- **[med] C-spacing** — Card uses `p-4` (`SummaryCard.tsx:48`), a value explicitly in the forbidden set (1/1.5/4/5/7/9) under the 0-2-3-6-8 scale and directly conflicting with the card-padding-p-3 rule.
- **[med] S5-icon** — Trailing chevron (`ChevronRightIcon`, `SummaryCard.tsx:55`) plays the "trailing arrow" role in a pressable card but has no interaction micro (no `group-hover:translate-x-1`) unlike the canon's trailing-icon behavior demonstrated in `Button.tsx:85-87`.
- **[low] card-radius** — Card uses `rounded-xl` (`SummaryCard.tsx:48`), the reserved "field" radius tier, instead of `rounded-3xl` (or `rounded-2xl` if genuinely nested) required for card-like surfaces.

### Card/SurfaceAccordionCard
Primitive tốt ở 9/10 chiều (props có tên, spacing đúng thang, S1 surface-nesting đúng qua bordered/surfaceFrame, không hand-roll icon/size nội bộ) nhưng thiếu isSkeleton tự-vẽ nên story loading phải dùng Skeleton rời — vi phạm nguyên tắc mirror-qua-prop mà Button/ButtonGroup đã chuẩn hoá.

- **[high] C-skeleton** — SurfaceAccordionCard.tsx (SurfaceAccordionCardProps, dòng 26-44) không có prop isSkeleton — primitive không tự vẽ skeleton mirror như base Button (Button.tsx dòng 46, 67-73) và ButtonGroup (dòng 39, isSkeleton pass-down). Story SkeletonLoading (SurfaceAccordionCard.stories.tsx dòng 180-186) phải tự dựng `<Skeleton.Accordion items={4} />` RỜI thay vì `<SurfaceAccordionCard isSkeleton />` — đúng anti-pattern mà canon ButtonGroup.stories.tsx dòng 75-79 cảnh báo tránh ("Không dựng Skeleton rời ngoài").

### Card/SurfaceCard
placeholder

- (0 gap)

### Card/SurfaceListCard
placeholder

- (0 gap)


---

## Addendum 2026-07-22 — reclassify tier (thầy duyệt)

Scan lại 13 primitive theo lens "primitive = vai generic data-agnostic · block = composite mang ngữ nghĩa nghiệp vụ":

- **`FlipCard` → `Block/Cards`** — compose `SurfaceCard`, vai flashcard Anki-style (question/answer, `locked` premium gating + copy mặc định). Đổi title xong.
- **`RatingBar` → `Block/Cards`** — compose `GroupPressableCard`/`PressableCard`/verdict-band, vai "tự chấm mức nhớ" (grade/verdict) của feature flashcard. Đổi title xong.
- 11 cái còn lại GIỮ Primitives (kể cả `SummaryCard`/`MediaCard`/`SectionCard`/`HighlightCard` — pattern chung, data-agnostic; compose-primitive kiểu ButtonGroup không tính là block).

Hệ quả: danh sách primitives họ Card còn **11**; các audit/batch sau loại FlipCard + RatingBar khỏi scope Primitives (chấm ở tier Block).
