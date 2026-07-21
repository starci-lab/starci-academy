# FE Component Registry — block ↔ story ↔ principles/concepts

> **Mục đích:** tra nhanh 1 block dính **story nào** + **luật canon (principles/concepts) nào** — và ngược lại grep tên luật (`icon.md §6`) ra mọi block dính. Chỉ **block** (design-system có luật riêng); feature-component KHÔNG liệt kê (chúng ghép block, luật nằm ở block — xem cột concepts của block đó).
>
> **Path convention** (khỏi ghi lặp): component = `src/components/blocks/<cat>/<Name>/index.tsx` · story = `.storybook/stories/blocks/<cat>/<Name>/<Name>.stories.tsx`. Dòng có **✎** = đã enrich per-block; còn lại = **canon mặc định theo nhóm** (từ `INDEX §1`), bồi dần khi chạm.
>
> **Bảo trì:** chạm block nào (feedback/build/patch) → cập nhật dòng đó. Không có story = coverage hole (đánh `⌀`).

## async
- **AsyncContent** — canon: `patterns/asynccontent-remove-debug-hold` · `patterns/labeled-section-render-empty-not-self-hide` · concepts: skeleton mirror · empty · error
- **EmptyContent** — canon: `patterns/labeled-section-render-empty-not-self-hide` · concepts: empty-state slot
- **ErrorContent** — canon: `patterns/labeled-section-render-empty-not-self-hide` · concepts: error slot + retry
- **InfiniteScrollSentinel** — canon: `patterns/` · concepts: scroll sentinel

## buttons
- **Button** — canon: `components/button.md` · concepts: variant theo nền (primary/secondary/tertiary)
- **ElementCloseButton** ✎ — canon: `components/alert.md §CloseButton` · concepts: close-affordance = HeroUI CloseButton · transparent-at-rest + hover tonal theo `tone` · dùng cho Callout dismiss + chip cancel-X
- **FloatingActionButton** — canon: `components/button.md` · concepts: FAB nổi
- **InputButtonLike** — canon: `components/button.md` · `components/input.md` · concepts: nút trông như input (trigger)

## cards
- **CheckListCard** ✎ — canon: `components/card.md §3b` · `components/icon.md §2` · concepts: list TĨNH check-success (achievements) / no-check (prerequisites) — KHÔNG mô hình todo/done/fail
- **ContinueCard** ✎ — canon: `components/card.md` · concepts: leading icon qua prop (block tự màu) · resume/continue
- **CrossListCard** — canon: `components/card.md` · concepts: mirror âm của CheckListCard (XCircle muted = luật-riêng-block)
- **GroupPressableCard** — canon: `components/card.md` · `principles/hover-style-matches-clickable-nature` · concepts: nhóm card bấm được
- **HighlightCard** ✎ — canon: `components/card.md §3j` · concepts: 1 vệt sáng accent QUÉT quanh card (card trong = lớp hiệu ứng, card ngoài nhỏ hơn 2px bán kính chồng lên) · thuần trang trí "nổi bật", KHÔNG mang data-signal (khác `withVerdict` §3i) · chỉ 1 card/surface
- **LabeledCard** ✎ — canon: `components/card.md §2` · concepts: label NGOÀI + Card trong · `frameless`/`flushContent`/`subtleLabel` · surface-in-surface = Card thật
- **LabeledAccordionCard** ✎ — canon: `components/accordion.md §3d (block giờ TỒN TẠI, đảo ghi chú cũ; danh sách migrate 7 call-site) · §3e (separator FULL-BLEED = variant="default" KHÔNG surface)` · concepts: label + list-gập-theo-nhóm 1 card; đóng gói `LabeledCard frameless` → `SurfaceListCard` (bordered khi nested) → `Accordion default`; API `items[{id,title,subtitle?,titleEnd?,body}]`/`label?`(no-label=trần cho pane có tab)/`allowsMultipleExpanded`/`defaultExpandedKeys(Set)`; story `Default`/`MultipleExpanded`/`WithTitleEnd`/`NoLabel`/`Bordered` (news); migrated: ChallengeView·CourseFaq·PlaygroundSession-Resources·TaskCriteriaList·Course(Milestone)Outline·FlashcardReviewHistory — CHỐT 2026-07-20
- **MediaCard** — canon: `components/card.md` · `components/image.md` · concepts: card có cover
- **NestedCard** — canon: `components/card.md` · concepts: card lồng (bordered khi nested)
- **PressableCard** ✎ — canon: `components/card.md` · `principles/hover-style-matches-clickable-nature` (mode 4 hoverVariant fill/lift) · concepts: shadow-surface cả 2 variant lúc nghỉ
- **SectionCard** — canon: `components/card.md` · concepts: card 1 section
- **SurfaceListCard** ✎ — canon: `components/card.md §3b/§3c` · `components/icon.md §6 (state-marker palette) · §7 (cấm 2 icon leading)` · `principles/hover-style-matches-clickable-nature` · `principles/whitespace-over-dividers` · concepts: surface-list · **state-marker todo/done/fail** (story `StateMarkers`) · surface-in-surface (bordered) · row full-bleed divider · leading+title+subtitle+meta · `titleClassName` bị lint cấm → tô title bằng span-node · **nút/CTA NGOÀI list-card** (card = list only qua `LabeledCard frameless`; CTA `mt-3 self-start`, caption `text-xs muted mt-2` — card.md §3c 2026-07-18)

## chips
- **AiCategoryChip** — canon: `components/chip.md` · concepts: chip phân loại AI
- **Chip** — canon: `components/chip.md` · `components/icon.md §2/§6` · concepts: chip nền (1 cụm meta tối đa 1 chip — lint)
- **DifficultyChip** — canon: `components/chip.md` · concepts: chip độ khó
- **HighlightChip** — canon: `components/chip.md` · concepts: chip nhấn
- **LanguageChip** — canon: `components/chip.md` · concepts: chip ngôn ngữ
- **StatusChip** ✎ — canon: `components/chip.md` · `components/icon.md §2 (status circle) · §6 (icon cùng màu title)` · concepts: tint `bg-<status>/10 text-<status>` · `w-fit` · removable X = ElementCloseButton (X trailing → KHÔNG icon leading, §Đính chính icon.md)

## commerce
- **PriceTag** ✎ — canon: `principles/single-source-render` (1 nguồn render giá) · concepts: hiển thị giá
- **PricingTable** — canon: `principles/single-source-render` · concepts: bảng giá tier

## feed
- **ChatPanel** — canon: `principles/hover-style-matches-clickable-nature` · concepts: panel chat
- **CommentThread** — canon: `principles/hover-style-matches-clickable-nature` · concepts: luồng bình luận
- **Composer** — canon: `patterns/form-flow` · concepts: soạn bài/bình luận
- **FeedItem** — canon: `principles/hover-style-matches-clickable-nature` · concepts: item feed
- **ReactionBar** — canon: `components/` · concepts: thanh reaction
- **Timeline** — canon: `principles/whitespace-over-dividers` · concepts: timeline dọc

## feedback
- **Callout** ✎ — canon: `components/alert.md` (alert-in-card, tint `bg-<status>/10 shadow-none`) · concepts: dismiss = ElementCloseButton tone={status}
- **ConfirmDialog** — canon: `components/alert.md` · `patterns/when-drawer` · concepts: xác nhận hành động
- **EmptyState** — canon: `patterns/labeled-section-render-empty-not-self-hide` · concepts: rỗng có illustration + CTA
- **ErrorState** — canon: `patterns/labeled-section-render-empty-not-self-hide` · concepts: lỗi + retry
- **InfoTooltip** — canon: `components/` · concepts: tooltip thông tin
- **SimpleEmptyState** — canon: `patterns/labeled-section-render-empty-not-self-hide` · concepts: rỗng gọn 1 dòng

## form
- **CVSubmissionForm** — canon: `patterns/form-flow` · concepts: form nộp CV
- **Input** — canon: `components/input.md` · concepts: input nền
- **OtpInput** — canon: `components/input.md` · concepts: nhập OTP
- **RadioGroup** — canon: `patterns/form-flow` · `components/icon.md` · concepts: ⚠️ Radio.Content nhãn text thường (không bọc Typography — throw slot)
- **SchedulePicker** — canon: `patterns/form-flow` · concepts: chọn lịch
- **SearchAutocomplete** — canon: `components/input.md` · concepts: search + gợi ý
- **SearchInput** — canon: `components/input.md` · concepts: ô tìm kiếm
- **Switch** — canon: `components/input.md` · concepts: toggle
- **TextField** — canon: `components/input.md` · concepts: field label+input+error

## grading
- **DiffViewer** — canon: `patterns/` · concepts: xem diff code

## identity
- **AvatarGroup** — canon: `components/avatar.md` · concepts: chồng avatar
- **AvatarUploadButton** — canon: `components/avatar.md` · concepts: upload avatar
- **IconTile** ✎ — canon: `components/icon.md §4` (leading avatar-của-1-thứ = IconTile, không icon trơ nhỏ) · `components/avatar.md` · concepts: tile size-sm 48px + icon size-6 + src cover/fallback
- **ImageDropzone** — canon: `components/avatar.md` · `patterns/form-flow` · concepts: kéo-thả ảnh
- **Logo** — canon: `foundations/` · concepts: logo
- **UserAvatar** — canon: `components/avatar.md` · concepts: avatar user + fallback
- **UserCell** ✎ — canon: `components/avatar.md` · `principles/hover-style-matches-clickable-nature` (UserCell = opacity, không fill) · concepts: avatar + tên + phụ

## layout
- **AmbientBackground** — canon: `foundations/` · concepts: nền ambient
- **AppSplash** — canon: `patterns/loading-feedback-three-tiers-splash-toploader-skeleton` · concepts: splash tier-1
- **ModalShell** ✎ — canon: `layouts/` · concepts: khung modal · header = Typography body semibold (lint `no-modal-title-classname` cấm `titleClassName` escape-hatch)
- **PageContainer** — canon: `layouts/` · concepts: khung trang max-width
- **PageHeader** ✎ — canon: `components/header.md` (§1 4-slot · §2 gap-10 header→content · §3 breadcrumb=BackLink cho leaf · §6 đừng lặp title ở card dưới · **§7 `size="page"|"compact"`** 2026-07-20) · concepts: header trang · **`size="compact"`** = title body-bold cho header của PANE/PHA nằm trong page shell đã có header riêng (story `Compact`; áp đầu `PlaygroundPrepare` pha prepare)
- **ReadinessChecklist** ✎ — canon: `components/card.md` (row-block khác `SurfaceListCardItem` lồng trong list-card phải tự mang **`p-3`**, divider full-bleed — CHỐT 2026-07-20) · concepts: hàng điều-kiện-sẵn-sàng (IconTile check khi ready + StatusChip trailing); LUÔN render trong `SurfaceListCard` (nested → `bordered`)
- **ResizableRail** — canon: `layouts/` · concepts: rail kéo rộng
- **ScrollShadow** — canon: `foundations/` · concepts: bóng mép scroll
- **SocketConnectionStatus** — canon: `layouts/` · concepts: trạng thái socket
- **StickyBottomBar** — canon: `layouts/` · concepts: bar đáy dính
- **TopLoader** — canon: `patterns/loading-feedback-three-tiers-splash-toploader-skeleton` · concepts: loader top tier-2

## learn
- **QuizCard** — canon: `components/card.md §3g` (flip/2-face) · concepts: thẻ quiz lật 2 mặt

## lists
- **ListBox** ✎ — canon: `principles/hover-style-matches-clickable-nature` (§Đính chính 2026-07-15: nav-rail = ListBox gốc, fill native) · `components/icon.md §6` · concepts: nav-rail native hover fill = chrome hợp lệ (≠ hand-roll fill content-row)

## marketing
- **ArchitectureScene** — canon: `principles/advanced-tech-flexes-capability-not-decoration` · concepts: cảnh kiến trúc
- **SectionHeading** — canon: `principles/landing-marketing` · concepts: tiêu đề section landing

## media
- **CoverImage** — canon: `components/image.md` · concepts: ảnh cover ratio

## navigation
- **BackLink** — canon: `principles/hover-style-matches-clickable-nature` · concepts: link quay lại
- **CollapsibleSidebar** — canon: `principles/hover-style-matches-clickable-nature` · concepts: sidebar thu gọn
- **ExtendedTabs** — canon: `components/tabs.md` · concepts: tabs mở rộng
- **FlexWrapButtonRadio** — canon: `components/card.md §3f` (flexwrap) · concepts: nhóm button-radio wrap
- **OutlineRail** — canon: `principles/hover-style-matches-clickable-nature` · concepts: rail mục lục
- **Pagination** — canon: `components/` · concepts: phân trang
- **ResponsiveBreadcrumb** — canon: `components/` · concepts: breadcrumb responsive
- **SelectableCardGroup** — canon: `components/card.md §3e` (selectable) · concepts: nhóm card chọn 1-trong-N
- **SidebarNavAccordionGroup** — canon: `principles/hover-style-matches-clickable-nature` · concepts: nhóm nav accordion
- **SidebarNavGroup** — canon: `principles/hover-style-matches-clickable-nature` · concepts: nhóm nav
- **SidebarNavItem** ✎ — canon: `principles/hover-style-matches-clickable-nature` · `components/icon.md §3` (leading nav icon size-5) · concepts: nav item · collapsed = icon-only
- **Stepper** — canon: `components/` · concepts: các bước
- **TabsCard** — canon: `components/tabs.md` · `components/card.md` · concepts: tabs trong card

## notifications
- **NotificationBell** — canon: `components/card.md §3c` · `components/icon.md §6` · concepts: chuông + unread pip (pip accent — xem borderline icon §6)
- **NotificationItem** — canon: `components/card.md §3c` · concepts: 1 dòng thông báo (leading IconTile)
- **NotificationList** — canon: `components/card.md §3c` (SurfaceListCard rows) · concepts: danh sách thông báo

## rendering
- **FlowDiagram** — canon: `principles/advanced-tech-flexes-capability-not-decoration` · concepts: sơ đồ luồng
- **MarkdownContent** — canon: `patterns/` · concepts: render markdown (directive accordion)

## skeleton
- **Skeleton** — canon: `patterns/loading-feedback-three-tiers-splash-toploader-skeleton` · concepts: skeleton tier-3 (mirror layout thật · ListRow/ContentMapRow variants)

## stats
- **CourseProgressBar** — canon: `principles/grounded-in-data` · concepts: thanh tiến độ khóa
- **LanguageDonut** — canon: `principles/design-restraint` · concepts: donut ngôn ngữ
- **Legend** — canon: `principles/design-restraint` · concepts: chú giải chart
- **MetricCard** — canon: `principles/grounded-in-data` · concepts: card 1 chỉ số (icon-top/value)
- **MilestoneRoadmap** — canon: `principles/grounded-in-data` · concepts: lộ trình milestone
- **ProgressMeter** — canon: `patterns/meter-tracks-out-of-box-default-target` · `principles/design-restraint` (1 meter, không vanity) · concepts: meter tiến độ
- **ProgressRing** — canon: `patterns/meter-tracks-out-of-box-default-target` · concepts: vòng tiến độ
- **SegmentBar** — canon: `principles/grounded-in-data` · concepts: bar phân đoạn
- **StatGridCard** ✎ — canon: `patterns/component-rules.md §Card` (border-seam sibling của SurfaceListCard, cạnh CourseProgressBar) · concepts: N stat cell ngắn xếp grid 2 cột thay vì list 1 cột dọc · seam `border-default` không `gap` · item lẻ col-span-2 hàng cuối
- **StatPair** — canon: `principles/grounded-in-data` · concepts: cặp label+value (icon khớp tông label)
- **TopicMasteryGrid** — canon: `principles/grounded-in-data` · concepts: lưới thành thạo (mastery) chủ đề

---
## Coverage hole (block CHƯA có story — cần build/audit)
- **ContentMapRow** `blocks/navigation` ⌀ — canon: `components/icon.md §6` (state-marker unread/locked/premium=foreground, read=success) · `principles/hover-style-matches-clickable-nature`
- **ListRow** `blocks/lists` ⌀ — canon: `components/card.md` · `components/icon.md §6` · concepts: leading+title+subtitle · hover:bg-surface-secondary
