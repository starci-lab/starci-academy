# Primitives triage 4-way (2026-07-23)

**Lane:** report-only. 102 primitive `Primitives/*` → phân loại keep / remove / merge / move-block (§6c tier · §6a granularity · C-compose). Đã reconcile 3 bất nhất cross-batch.

**Tổng: keep 72 · remove 4 · merge 10 · move-block 16.**

## REMOVE (4) — thừa, nên là PROP/variant (§6b)
| Primitive | → thành | Conf |
|---|---|---|
| Button/ElementCloseButton | prop trên **Button** (ghost+iconOnly+X + tone) | med |
| Feedback/SimpleEmptyState | variant compact của **EmptyState** (hoặc Typography trực tiếp) | med |
| Identity/BrandLogo | size preset của **Logo** (`h-9`) | high |
| Layout/Spacer | dùng `gap-*` Tailwind (container đã flex) | high |

## MERGE (10) — trùng / biến thể mỏng
| Primitive | → gộp vào | Conf |
|---|---|---|
| Chip/AiCategoryChip · Chip/DifficultyChip · **Chip/LanguageChip** ⟵reconcile | **DotChip** (đều "thin map wrapper over DotChip") | high |
| Chip/HighlightChip (+ **EnumChip**? — cùng cặp) | **StatusChip** (thin tone wrapper) | high |
| Feedback/ErrorState · Feedback/ErrorPageState | **EmptyState** (variant danger + retry / full-page code) | med ⚠️ |
| Form/SearchInput | **SearchAutocomplete** (SearchInput hand-roll lại ComboBox) | med |
| Identity/BadgeImage | **IconTile** (cùng img+fallback state machine) | med |
| Layout/SubPageHeader | **PageHeader** (cùng title+desc stack + back-button variant) | med |
| Stats/StatRibbon | **StatGridCard** (cùng N-cell framed container) | med |

## MOVE-BLOCK (16) — §6c content-role → retitle `Block/*`
- **Stats (8):** MetricCard · VerdictHeroCard · Score · DeadlineCallout · LanguageDonut · MilestoneRoadmap · TopicMasteryGrid · **StatPair** ⟵reconcile (value/label = content-role)
- **Identity (3):** AvatarGroup · AvatarUploadButton · BrandLockup (đã là Block ở src app)
- **Media (1):** VideoRenderer (business logic chọn 3 sub-player theo LessonVideoType)
- **Navigation (1):** ProgrammingLanguageTabs (hardcode enum 4 ngôn ngữ + brand icon)
- **Rendering (1):** RagSourceGraph (question/sources content-role)
- **Form (2):** SchedulePicker (booking mock-interview) · SearchBar (hardcode vocab domain)

## KEEP (72) — atom nền + shell structural/agnostic
Button · ButtonGroup · FloatingActionButton · InputButtonLike · StatusChip · DotChip · TagChips · HostPlatformChip · mọi Card shell (Surface/Pressable/Group/Nested/CrossList/SurfaceList/Accordion/Highlight) · mọi Form input (FieldShell + TextField/Textarea/Select/…) · Callout/ConfirmDialog/EmptyState/InfoTooltip · IconTile/UserAvatar/UserCell/Logo/SnippetIcon/ImageDropzone · ListRow/MetaRow/LabeledList · Layout shells (ModalShell/PageContainer/PageHeader/ResizableRail/StickyBottomBar/DragScrollArea) · Nav (Tabs/Pagination/Breadcrumb/Stepper/BackLink/SeeMoreLink/SelectableCardGroup/FlexWrapButtonRadio) · Skeleton · Stats structural (StatGridCard/ProgressMeter/ProgressRing/SegmentBar/Legend/CourseProgressBar) · Rendering (Markdown/RichText/FlowDiagram/PDFView) · Media (CoverImage/QRCode) · AsyncContent.

## Risk / thứ tự đề xuất
- **MOVE-BLOCK = rủi ro THẤP** (đổi story title `Primitives/*`→`Block/*`, không đụng logic) → làm trước, nhanh.
- **MERGE chip→DotChip/StatusChip = thấp-vừa** (domain map về call-site).
- **REMOVE + MERGE ErrorState/PageState→EmptyState + SearchInput/BadgeImage/SubPageHeader = vừa-cao** (đụng consumer, cần migrate + verify).

## Quyết định đã chốt (2026-07-23)
- **EnumChip: GIỮ** (canonical enum→chip generic). Chỉ **HighlightChip → StatusChip**.
- **ErrorState + ErrorPageState → GỘP vào EmptyState** (3 feedback → 1 + variant danger-retry + full-page-code).
- Cả 4 bucket đều duyệt. ⏸️ CHỜ thầy confirm "1 thứ" trước khi mở lane fix.
