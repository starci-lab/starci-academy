# Storybook stories — INDEX (lớp UI-REF)

> **Đây là lớp UI-REF** trong mô hình 3 lớp ([[.claude/fe/principles/three-layer-sync-truth-story-ui]]):
> - **`.claude/fe/` = CHÂN LÝ** (luật) · **story (đây) = UI-REF** (biểu hiện trực quan của luật) · **`src/components` = UI** (xây trên luật).
> - Index này neo mỗi NHÓM story ↔ **luật canon chi phối** để reconcile 3 lớp dễ hơn. Bổ sung (không trùng) `.artifacts/states/snapshot.json` (map máy đọc block↔story↔file) bằng cột **story↔LUẬT** cho người đọc.
> - **Bảo trì:** `starci-fe-sync` cập nhật khi block/story đổi; mỗi lần feedback chạm 1 block → thêm/siết dòng per-block ở §2.

## 1. Nhóm story → CHÂN LÝ chi phối (105 story)
> Mỗi nhóm trỏ về nhà canon quyết định "đúng là gì" cho nhóm đó. `—` = chưa map chắc, `fe-sync`/feedback bồi khi chạm.

| Nhóm `.storybook/stories/` | Chân lý chi phối (`.claude/fe/…`) |
|---|---|
| `blocks/async/*` (AsyncContent · EmptyContent · ErrorContent · InfiniteScrollSentinel) | `patterns/asynccontent-remove-debug-hold` · `patterns/labeled-section-render-empty-not-self-hide` |
| `blocks/buttons/*` (Button · **ElementCloseButton** · FloatingActionButton · InputButtonLike) | `components/button.md` · `components/alert.md` §CloseButton |
| `blocks/cards/*` (LabeledCard · SurfaceListCard · PressableCard · CheckListCard · ContinueCard · MediaCard · NestedCard · SectionCard · CrossListCard · GroupPressableCard) | `components/card.md` · `principles/hover-style-matches-clickable-nature` · `principles/whitespace-over-dividers` |
| `blocks/chips/*` (**StatusChip** · Chip · DifficultyChip · AiCategoryChip · HighlightChip · LanguageChip) | `components/chip.md` · `components/icon.md` (§leading: icon cùng màu title; §2 status circle) |
| `blocks/commerce/*` (PriceTag · PricingTable) | `principles/single-source-render` (1 nguồn render giá) · `components/` |
| `blocks/feed/*` (ChatPanel · CommentThread · Composer · FeedItem · ReactionBar · Timeline) | `principles/hover-style-matches-clickable-nature` · `components/` — (bồi) |
| `blocks/feedback/*` (**Callout** · ConfirmDialog · EmptyState · ErrorState · InfoTooltip · SimpleEmptyState) | `components/alert.md` · `patterns/labeled-section-render-empty-not-self-hide` |
| `blocks/form/*` (Input · TextField · RadioGroup · Switch · OtpInput · SearchInput · SearchAutocomplete · SchedulePicker · CVSubmissionForm) | `patterns/form-flow` · `components/input.md` |
| `blocks/grading/*` (DiffViewer) | — (bồi) |
| `blocks/identity/*` (UserAvatar · UserCell · AvatarGroup · AvatarUploadButton · **IconTile** · ImageDropzone · Logo) | `components/avatar.md` · `principles/hover-style-matches-clickable-nature` (UserCell = opacity) |
| `blocks/layout/*` (ModalShell · PageContainer · PageHeader · ResizableRail · ScrollShadow · StickyBottomBar · TopLoader · AmbientBackground · AppSplash · SocketConnectionStatus) | `layouts/*` · `foundations/` |
| `blocks/learn/*` (QuizCard) | `components/card.md` §3g (flip/2-face) — (bồi) |
| `blocks/lists/*` (**ListBox**) | `principles/hover-style-matches-clickable-nature` (§Đính chính: nav-rail = ListBox gốc, fill native) · axis "rail chọn item → ListBox" |
| `blocks/marketing/*` (SectionHeading · ArchitectureScene) | `principles/landing-marketing` · `principles/advanced-tech-flexes-capability-not-decoration` |
| `blocks/media/*` (CoverImage) | `components/image.md` — (bồi) |
| `blocks/navigation/*` (**SidebarNavItem** · TabsCard · ExtendedTabs · BackLink · Pagination · Stepper · OutlineRail · CollapsibleSidebar · SidebarNavGroup · SidebarNavAccordionGroup · ResponsiveBreadcrumb · SelectableCardGroup · FlexWrapButtonRadio) | `principles/hover-style-matches-clickable-nature` · `components/tabs.md` · `components/card.md` §3e/§3f (selectable/flexwrap) |
| `blocks/notifications/*` (NotificationBell · NotificationItem · NotificationList) | `components/card.md` §3c (SurfaceListCard rows) — (bồi) |
| `blocks/rendering/*` (MarkdownContent · CodeToHtml · FlowDiagram) | `patterns/` · `principles/advanced-tech-flexes-capability-not-decoration` — (bồi) |
| `blocks/skeleton/*` (Skeleton) | `patterns/loading-feedback-three-tiers-splash-toploader-skeleton` · `components/skeleton` |
| `blocks/stats/*` (ProgressMeter · ProgressRing · CourseProgressBar · MetricCard · StatPair · SegmentBar · Legend · LanguageDonut · TopicMasteryGrid · MilestoneRoadmap) | `principles/design-restraint` (1 meter, không vanity) · `principles/grounded-in-data` · `patterns/meter-tracks-out-of-box-default-target` |
| `foundations/*` (Radius · Spacing · SurfacesAndFills) | `foundations/*` (token gốc) |
| `overlays/*` (Popover · Toast) | `patterns/overlay-from-popover-render-in-panel` · `patterns/when-drawer` |

## 2. Per-block ↔ luật (seed — block đã chạm thật, bồi dần)
> Chỉ ghi khi đã đối chiếu luật THẬT trong 1 lần feedback/build. Đừng bịa map — chưa chắc thì để §1 cấp nhóm.

- **StatusChip** (`blocks/chips`) → `components/chip.md` + `components/icon.md` §2 (status = `CheckCircleIcon`/`XCircleIcon` circle, leading, tĩnh) & §leading (icon cùng màu title); tint `bg-<status>/10 text-<status>`; `w-fit`; removable X = `ElementCloseButton` (X trailing → KHÔNG icon leading).
- **ElementCloseButton** (`blocks/buttons`) → `components/alert.md` §CloseButton (close-affordance = HeroUI `CloseButton`, không hand-roll); transparent-lúc-nghỉ + hover tint theo `tone`; dùng cho Callout dismiss + chip cancel-X.
- **Callout** (`blocks/feedback`) → `components/alert.md` (alert-in-card, tint `bg-<status>/10 shadow-none`); dismiss = `ElementCloseButton tone={status}`.
- **CourseCard** (feature, story `blocks/cards`-family) → `components/card.md` (footer 2-Button; enrolled = Tiếp tục học primary + Xem khóa học secondary; arrow chỉ CTA chính) + `components/button.md` §2/§4b.
- **LabeledCard** (`blocks/cards`) → `components/card.md` §2 (label NGOÀI + Card trong; `frameless`/`flushContent`/`subtleLabel`); surface-in-surface = `Card` thật, không hand-roll div.
- **SurfaceListCard** (`blocks/cards`) → `components/card.md` §3b/§3c (da surface-accordion; `bordered` khi nested; row title KHÔNG `weight="medium"`).
- **PressableCard** (`blocks/cards`) → `components/card.md` (PressableCard) + `principles/hover-style-matches-clickable-nature` mode 4 (`hoverVariant` fill/lift; `shadow-surface` cả 2 variant lúc nghỉ).
- **SidebarNavItem / ListBox (nav-rail)** (`blocks/navigation` · `blocks/lists`) → `principles/hover-style-matches-clickable-nature` §Đính chính 2026-07-15: nav-LIST/rail dùng **HeroUI ListBox gốc** (fill = chrome native, hợp lệ) ≠ hand-roll fill trên content-row (content-row = underline). Áp: dashboard `QuickActions`.
