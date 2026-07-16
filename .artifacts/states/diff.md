# FE Storybook baseline — component ↔ story

> Baseline đầu tiên (lastSyncCommit = null → toàn bộ coi là mới). Sinh từ `.artifacts/states/_sync/{components,stories,git}.md`. Nguồn máy-đọc: `snapshot.json` (cùng thư mục). Các skill brainstorm ĐỌC file này thay vì rescan `src/`.

- HEAD: `9db6f337d60925d1a843fd6b265824b95e34154b` · branch `mtp` · generatedAt `2026-07-16T07:21:02.949Z`

## Tổng quan coverage

| chỉ số | giá trị |
|---|---:|
| Tổng component (`src/components/**`) | 769 |
| Component CÓ story | 98 |
| HOLES (component chưa có story) | 671 |
| Tổng story | 106 |
| — story primitive/foundation (không map 1 component) | 7 |
| Story 'news' (chờ thầy duyệt) | 0 |

### Holes theo nhóm

| nhóm | tổng | holes |
|---|---:|---:|
| features | 409 | 409 |
| layouts | 69 | 69 |
| blocks | 153 | 61 |
| reuseable | 62 | 56 |
| modals | 54 | 54 |
| drawers | 14 | 14 |
| svg | 5 | 5 |
| providers | 3 | 3 |

> Đọc số: **blocks** + **reuseable** là tầng primitive tái dùng — holes ở đây là nợ story THẬT. **features/layouts/modals/drawers** phần lớn là composition mức-trang/-luồng, KHÔNG kỳ vọng story riêng; liệt kê để tra cứu, không ưu tiên.

## Bảng component ↔ story (99 matched)

| component | nhóm | story states |
|---|---|---|
| blocks/async/AsyncContent | blocks | Branches |
| blocks/async/EmptyContent | blocks | Default, WithRetry, WithCustomIcon |
| blocks/async/ErrorContent | blocks | Default, WithoutRetry, CustomIcon |
| blocks/async/InfiniteScrollSentinel | blocks | Default |
| blocks/buttons/ElementCloseButton | blocks | AllTones |
| blocks/buttons/FloatingActionButton | blocks | Default |
| blocks/buttons/InputButtonLike | blocks | Default, WithIcon, WithShortcutSuffix, LongPlaceholderTruncates |
| blocks/cards/CheckListCard | blocks | Default, WithoutCheck, LongText, SurfaceInSurface |
| blocks/cards/ContinueCard | blocks | Item, Hero, HeroUrgent |
| blocks/cards/CrossListCard | blocks | Default, SurfaceInSurface |
| blocks/cards/GroupPressableCard | blocks | Default, ActionTilesWithShortcut, AllDisabled, LonePagerCardPinnedRight |
| blocks/cards/LabeledCard | blocks | Default, WithLabelEnd, WithSeeMore, WithAction, SurfaceInSurface, CategorizedList |
| blocks/cards/MediaCard | blocks | Default, FallbackCover |
| blocks/cards/NestedCard | blocks | SurfaceInSurface, OnBackground |
| blocks/cards/PressableCard | blocks | Default, LinkCard, WithActions, Disabled |
| blocks/cards/SurfaceListCard | blocks | Default, RowVariants, WithLeadingAndMeta, FreeFormItems |
| blocks/cards/SurfaceListCard | blocks | Default, RowVariants, WithLeadingAndMeta, FreeFormItems |
| blocks/chips/AiCategoryChip | blocks | AllCategories |
| blocks/chips/DifficultyChip | blocks | AllDifficulties |
| blocks/chips/HighlightChip | blocks | AllTones |
| blocks/chips/LanguageChip | blocks | AllLanguages |
| blocks/chips/StatusChip | blocks | Default, Tones, WithIcon, Removable |
| blocks/commerce/PriceTag | blocks | Default, WithDiscount, Sizes, CurrencyUsd, BreakdownOpen |
| blocks/commerce/PricingTable | blocks | Default, TwoTiersNoHighlight |
| blocks/feed/ChatPanel | blocks | Conversation, Empty, Typing |
| blocks/feed/CommentThread | blocks | Thread, Empty |
| blocks/feed/Composer | blocks | Empty, Typing, Submitting |
| blocks/feed/FeedItem | blocks | Default, WithReactionBar, WithoutLeading, LongActivityText |
| blocks/feed/ReactionBar | blocks | Default, MyReactionSelected, ReadOnly, ReadOnlyEmpty, PickerGroup |
| blocks/feed/Timeline | blocks | Default |
| blocks/feedback/Callout | blocks | Default, Tones, WithAction, Closable, TitleOnly |
| blocks/feedback/ConfirmDialog | blocks | DefaultConfirm, DestructiveDelete |
| blocks/feedback/EmptyState | blocks | Default, Compositions, ErrorTone |
| blocks/feedback/ErrorState | blocks | Default, WithoutRetry, LongDescription |
| blocks/feedback/InfoTooltip | blocks | Default, DescriptionOnly, Composed, Placements |
| blocks/feedback/SimpleEmptyState | blocks | Default, LongMessageWrapping |
| blocks/form/OtpInput | blocks | Default |
| blocks/form/SchedulePicker | blocks | Default |
| blocks/form/SearchAutocomplete | blocks | Default, Loading, Empty |
| blocks/grading/DiffViewer | blocks | Unified, Split |
| blocks/identity/AvatarGroup | blocks | Default, OverflowChip, Empty |
| blocks/identity/AvatarUploadButton | blocks | Default, NoAvatar |
| blocks/identity/IconTile | blocks | Default, Tones, Sizes, CoverImage |
| blocks/identity/ImageDropzone | blocks | Default, WithoutHint |
| blocks/identity/Logo | blocks | Sizes, OnDarkSurface |
| blocks/identity/UserCell | blocks | Default, Sizes, NoHandle, WithUploadedAvatar, WithTrailing, LongNameTruncation |
| blocks/layout/AmbientBackground | blocks | AllEffects, None |
| blocks/layout/AppSplash | blocks | Default |
| blocks/layout/ModalShell | blocks | Default, CustomHeader, ScrollableBody, WithLeadingTabs, PlainFormClusters |
| blocks/layout/PageContainer | blocks | Default |
| blocks/layout/PageHeader | blocks | Default, Full, LongDescriptionClamped |
| blocks/layout/ResizableRail | blocks | Default, ScrollableContent |
| blocks/layout/SocketConnectionStatus | blocks | Default, Down, Recovered |
| blocks/layout/StickyBottomBar | blocks | Default, SingleAction, WithSecondaryAction |
| blocks/layout/TopLoader | blocks | Default, Navigating, ReducedMotion |
| blocks/learn/QuizCard | blocks | SingleChoice, SingleChoiceSubmitted, MultipleChoice |
| blocks/marketing/ArchitectureScene | blocks | Default, CustomScene |
| blocks/marketing/SectionHeading | blocks | Default, AlignedStart, WithAnchorLink, TitleOnly |
| blocks/media/CoverImage | blocks | Default, Empty |
| blocks/navigation/BackLink | blocks | Default |
| blocks/navigation/CollapsibleSidebar | blocks | Default, WithTopSlot, LongTitle |
| blocks/navigation/ExtendedTabs | blocks | TabsAsInput, PagePrimary, SecondaryFilter |
| blocks/navigation/FlexWrapButtonRadio | blocks | Default, WithDisabledItem, WithTrailing, WithItemAction |
| blocks/navigation/OutlineRail | blocks | Default, Loading, Empty, NoMatch, ErrorState |
| blocks/navigation/ResponsiveBreadcrumb | blocks | Default, Collapsed, RootOnly |
| blocks/navigation/SelectableCardGroup | blocks | Default, Columns, WithIconAndDisabled |
| blocks/navigation/SidebarNavAccordionGroup | blocks | Default, WithActiveChild, Collapsed, LongChildLabel |
| blocks/navigation/SidebarNavGroup | blocks | Default, WithDivider, Collapsed |
| blocks/navigation/SidebarNavItem | blocks | Default, Active, WithEndContent, LongLabelTruncation |
| blocks/navigation/Stepper | blocks | HorizontalMidFlow, Vertical, AllDone |
| blocks/navigation/TabsCard | blocks | TabCard, DoubleTabsCard, WithLeftEndAction, PrimaryVariant |
| blocks/notifications/NotificationBell | blocks | WithUnreadCount |
| blocks/notifications/NotificationItem | blocks | States |
| blocks/notifications/NotificationList | blocks | Grouped, Empty |
| blocks/rendering/FlowDiagram | blocks | Default, LinearFlow |
| blocks/skeleton/Skeleton/Button | blocks | AllVariants, SizesAndStates |
| blocks/skeleton/Skeleton/Chip | blocks | AllColors |
| blocks/skeleton/Skeleton | blocks | Bar, TypographySizes, AllKinds, ComposedExample |
| blocks/skeleton/Skeleton/Input | blocks | Variants, States |
| blocks/skeleton/Skeleton/ListBox | blocks | SingleSelect, WithDisabledItem |
| blocks/skeleton/Skeleton/Pagination | blocks | Default, Few |
| blocks/skeleton/Skeleton/RadioGroup | blocks | Vertical, WithDisabledOption |
| blocks/skeleton/Skeleton/Switch | blocks | OnOff, Disabled |
| blocks/stats/CourseProgressBar | blocks | Default, HiddenLegend, DimensionNotApplicable |
| blocks/stats/LanguageDonut | blocks | Default, Compact |
| blocks/stats/Legend | blocks | Default, ManyItems, LongLabel |
| blocks/stats/MetricCard | blocks | Default, OptionalSlots, LongLabelAndHint |
| blocks/stats/MilestoneRoadmap | blocks | Default, LongRoadmap |
| blocks/stats/ProgressMeter | blocks | Default, LabelAndValueVariants, Tones, CustomMax |
| blocks/stats/ProgressRing | blocks | Sizes, Tones, WithCaption |
| blocks/stats/SegmentBar | blocks | Default, ProgressToTotal, HiddenLegend, ManyGroups, NoData |
| blocks/stats/StatPair | blocks | Default, Row, Grid |
| blocks/stats/TopicMasteryGrid | blocks | Default |
| reuseable/CVSubmissionForm | reuseable | Default, Uploading, Uploaded, Processing |
| reuseable/MarkdownContent/CodeToHtml | reuseable | TypeScript, JavaScriptDark, Bash |
| reuseable/MarkdownContent | reuseable | Default, Reading, Inline |
| reuseable/SearchInput | reuseable | Default, WithSuggestions, Secondary |
| reuseable/SectionCard | reuseable | Default, Accent, Plain |
| reuseable/UserAvatar | reuseable | Default, Sizes |

### Story primitive/foundation (wrapper HeroUI hoặc token — không map component trong `src/components`)

- `blocks/form/TextField/TextField.stories.tsx` — TextField · Default, Required, Invalid, Disabled, Multiline
- `blocks/layout/ScrollShadow/ScrollShadow.stories.tsx` — ScrollShadow · Vertical, Horizontal
- `foundations/Radius/Radius.stories.tsx` — _(none)_ · Scale, Concentric
- `foundations/Spacing/Spacing.stories.tsx` — _(none)_ · GapScale, NamedExceptions, Padding
- `foundations/SurfacesAndFills/SurfacesAndFills.stories.tsx` — _(none)_ · Elevation, AccentSolidVsTint, AccentAntiPatterns
- `overlays/Popover/Popover.stories.tsx` — Popover · Default, RichContent
- `overlays/Toast/Toast.stories.tsx` — _(none)_ · Default

## HOLES — component thiếu story (xếp ưu tiên)

### P1 · blocks (38) — design-system primitives, nợ story cao nhất

| component | sub-group |
|---|---|
| blocks/buttons/RatingBar | buttons |
| blocks/cards/CourseCard | cards |
| blocks/cards/FlipCard | cards |
| blocks/cards/PlaygroundCard | cards |
| blocks/cards/PricingCard | cards |
| blocks/chips/EnumChip | chips |
| blocks/commerce/PhaseScarcityNote | commerce |
| blocks/feed/ActivityAvatar | feed |
| blocks/feed/ActivityFeed | feed |
| blocks/feed/ChatBubble | feed |
| blocks/feed/CommunityCommentRow | feed |
| blocks/feed/CommunityPostCard | feed |
| blocks/feed/EntityLink | feed |
| blocks/grading/GradeCreditCaption | grading |
| blocks/grading/GradeModelDropdown | grading |
| blocks/grading/GradingByline | grading |
| blocks/grading/SelfHostGpuMark | grading |
| blocks/identity/BrandLockup | identity |
| blocks/identity/BrandLogo | identity |
| blocks/learn/ChatToolResult | learn |
| blocks/learn/EntityResultRow | learn |
| blocks/learn/RelatedContentList | learn |
| blocks/learn/UpNextCard | learn |
| blocks/lists/LabeledList | lists |
| blocks/lists/ListRow | lists |
| blocks/marketing/ArchitectureFlow | marketing |
| blocks/marketing/HeroBanner | marketing |
| blocks/marketing/MicroservicesDiagram | marketing |
| blocks/marketing/MicroservicesScene | marketing |
| blocks/marketing/PitchCard | marketing |
| blocks/marketing/ShowcaseMockup | marketing |
| blocks/marketing/SitePreview | marketing |
| blocks/marketing/TopicLane | marketing |
| blocks/marketing/TrackCard | marketing |
| blocks/marketing/TruthList | marketing |
| blocks/navigation/ContentMapRow | navigation |
| blocks/navigation/SeeMoreLink | navigation |
| blocks/navigation/WorkSessionHeader | navigation |

### P2 · reuseable (52) — primitive tái dùng (legacy-leaning)

| component |
|---|
| reuseable/AiBalancer/KeyStatusChip |
| reuseable/AIProcessingText |
| reuseable/BadgeImage |
| reuseable/ContributionCalendarView |
| reuseable/CourseTrialChip |
| reuseable/CVSubmissionForm/CvSubmissionFields |
| reuseable/Discussion |
| reuseable/DragScrollArea |
| reuseable/Dropzone |
| reuseable/FollowButton |
| reuseable/HostPlatformChip |
| reuseable/LeagueRow |
| reuseable/LeagueTierBadge |
| reuseable/LessonVideoKindChip |
| reuseable/MarkdownContent/CodePreviewTabs |
| reuseable/MarkdownContent/LayoutWidget |
| reuseable/MarkdownContent/MermaidDiagram |
| reuseable/MarkdownContent/RenderReactComponent |
| reuseable/MarkdownContent/TabsBlock |
| reuseable/MascotBadge |
| reuseable/Pagination |
| reuseable/PDFView |
| reuseable/PDFView/PdfViewportPage |
| reuseable/PressableCard |
| reuseable/ProgrammingLanguageTabs |
| reuseable/QRCode |
| reuseable/RankBadge |
| reuseable/RankDeltaCaret |
| reuseable/ReferenceLinks |
| reuseable/RichText |
| reuseable/SandpackPanel |
| reuseable/Score |
| reuseable/SearchBar |
| reuseable/SnippetIcon |
| reuseable/Spacer |
| reuseable/StarCiAIBadge |
| reuseable/StatRibbon |
| reuseable/SubPageHeader |
| reuseable/SummaryCard |
| reuseable/TagChips |
| reuseable/Turnstile |
| reuseable/VideoRenderer |
| reuseable/VideoRenderer/MpegDash |
| reuseable/VideoRenderer/Standard |
| reuseable/VideoRenderer/VideoControls/FullscreenButton |
| reuseable/VideoRenderer/VideoControls |
| reuseable/VideoRenderer/VideoControls/PlayPauseButton |
| reuseable/VideoRenderer/VideoControls/QualitySelector |
| reuseable/VideoRenderer/VideoControls/SeekBar |
| reuseable/VideoRenderer/VideoControls/TimeDisplay |
| reuseable/VideoRenderer/VideoControls/VolumeControl |
| reuseable/VideoRenderer/Youtube |

### P3 · low-value (23 block skeleton) — story tuỳ chọn

`blocks/cards/CourseCardSkeleton` · `blocks/skeleton/Skeleton/Accordion` · `blocks/skeleton/Skeleton/Avatar` · `blocks/skeleton/Skeleton/Badge` · `blocks/skeleton/Skeleton/Breadcrumbs` · `blocks/skeleton/Skeleton/Card` · `blocks/skeleton/Skeleton/Checkbox` · `blocks/skeleton/Skeleton/Disclosure` · `blocks/skeleton/Skeleton/Kbd` · `blocks/skeleton/Skeleton/ListRow` · `blocks/skeleton/Skeleton/Menu` · `blocks/skeleton/Skeleton/Meter` · `blocks/skeleton/Skeleton/Metric` · `blocks/skeleton/Skeleton/Paragraph` · `blocks/skeleton/Skeleton/ProgressBar` · `blocks/skeleton/Skeleton/SegmentBar` · `blocks/skeleton/Skeleton/Select` · `blocks/skeleton/Skeleton/Slider` · `blocks/skeleton/Skeleton/Table` · `blocks/skeleton/Skeleton/Tabs` · `blocks/skeleton/Skeleton/TextArea` · `blocks/skeleton/Skeleton/Typography` · `blocks/skeleton/Skeleton/UserCell`

### P4 · composition mức-trang (không kỳ vọng story)

- features: 409 · layouts: 69 · modals: 54 · drawers: 14
- Danh sách đầy đủ: xem `snapshot.json` → `coverage.holes` (đã rank sẵn cùng thứ tự P1→P4).

## Story 'news' (chờ thầy duyệt)

_Chưa có story nào gắn `tags: ['news']`._
