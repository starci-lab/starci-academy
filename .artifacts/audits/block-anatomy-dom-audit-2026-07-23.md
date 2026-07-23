# Audit anatomy = cây DOM thật — 53 block (2026-07-23)

> Read-only, 53 agent Sonnet (batch 5). Chấm `*_PARTS` mỗi leaf vs cây DOM component render.

**53 block · 138 gap · high=42 med=81 low=15**. Sạch: FeedItem.

## Theo loại gap

| loại | count | nghĩa |
|---|---|---|
| `no-badge-wiring` | 51 | part không tag `data-anat-part` → Sơ đồ không hiện badge (cần rollout tag) |
| `missing-structural` | 33 | thiếu part render THẬT (AsyncContent/CTA/Typography…) trong spec |
| `nesting-mismatch` | 26 | spec phẳng nhưng DOM lồng → phải dùng `children` |
| `stub-inline` | 8 | component tự viết stub thay vì import primitive port thật |
| `tier-wrong` | 8 | tier (block/design/primitive) sai |
| `extra-curated` | 4 | spec kể part không render |
| `cluster-not-grouped` | 3 | ≥2 đồng vai chưa gộp GROUP |
| `name-mismatch` | 3 | `name` ≠ tag part thật → badge lệch |
| `other` | 2 | khác |

## Bảng block (xếp theo #high)

| block | tier | high | med | low | loại gap |
|---|---|--:|--:|--:|---|
| FlashcardDeckList | block | 4 | 4 | 0 | missing-structural, nesting-mismatch, no-badge-wiring |
| NotificationBell | block | 3 | 3 | 0 | extra-curated, missing-structural, nesting-mismatch, no-badge-wiring |
| TruthList | block | 3 | 2 | 0 | missing-structural, nesting-mismatch, no-badge-wiring |
| ContinueCard | design | 2 | 3 | 0 | missing-structural, nesting-mismatch, no-badge-wiring |
| GradeCreditCaption | design | 2 | 2 | 2 | missing-structural, nesting-mismatch, no-badge-wiring, stub-inline, tier-wrong |
| ReactionBar | design | 2 | 2 | 0 | extra-curated, missing-structural, nesting-mismatch, no-badge-wiring |
| TrackCard | design | 2 | 2 | 0 | missing-structural, no-badge-wiring, stub-inline |
| ActivityFeed | block | 2 | 1 | 0 | missing-structural, no-badge-wiring |
| PitchCard | design | 2 | 1 | 0 | nesting-mismatch, no-badge-wiring |
| PriceTag | design | 2 | 1 | 0 | missing-structural, nesting-mismatch, no-badge-wiring |
| ShowcaseMockup | design | 2 | 1 | 0 | missing-structural, nesting-mismatch, no-badge-wiring |
| RelatedContentList | block | 2 | 0 | 0 | nesting-mismatch |
| CourseCard (Grid) | design | 1 | 4 | 0 | cluster-not-grouped, missing-structural, no-badge-wiring, stub-inline |
| HeroBanner | design | 1 | 3 | 1 | cluster-not-grouped, missing-structural, no-badge-wiring, tier-wrong |
| PricingTable | block | 1 | 3 | 0 | missing-structural, no-badge-wiring, stub-inline |
| CommentThread | block | 1 | 2 | 1 | missing-structural, nesting-mismatch, no-badge-wiring, tier-wrong |
| GradeModelDropdown | block | 1 | 2 | 1 | extra-curated, missing-structural, other |
| CommunityPostCard | design | 1 | 1 | 0 | missing-structural, no-badge-wiring |
| ContinueCard | design | 1 | 1 | 0 | nesting-mismatch, no-badge-wiring |
| CourseCard (Line) | design | 1 | 1 | 0 | no-badge-wiring, stub-inline |
| MicroservicesDiagram | design | 1 | 1 | 0 | missing-structural, no-badge-wiring |
| PricingCard | design | 1 | 1 | 0 | nesting-mismatch, no-badge-wiring |
| SelfHostGpuMark | design | 1 | 1 | 0 | nesting-mismatch, no-badge-wiring |
| TopicLane | block | 1 | 1 | 1 | no-badge-wiring, stub-inline, tier-wrong |
| UpNextCard | design | 1 | 1 | 0 | nesting-mismatch, no-badge-wiring |
| NotificationList | block | 1 | 0 | 0 | missing-structural |
| ChatToolResult | block | 0 | 3 | 0 | extra-curated, no-badge-wiring, stub-inline |
| Composer | block | 0 | 3 | 0 | cluster-not-grouped, nesting-mismatch, no-badge-wiring |
| ArchitectureFlow | design | 0 | 2 | 0 | missing-structural, no-badge-wiring |
| DeckCard | design | 0 | 2 | 0 | no-badge-wiring |
| DiffViewer | design | 0 | 2 | 0 | missing-structural |
| EntityResultRow | design | 0 | 2 | 0 | name-mismatch, no-badge-wiring |
| GradingByline | design | 0 | 2 | 0 | nesting-mismatch, no-badge-wiring |
| QuizCard | design | 0 | 2 | 0 | nesting-mismatch, no-badge-wiring |
| Timeline | block | 0 | 2 | 1 | missing-structural, no-badge-wiring |
| ActivityAvatar | design | 0 | 1 | 1 | no-badge-wiring, tier-wrong |
| ArchitectureScene | design | 0 | 1 | 0 | no-badge-wiring |
| ChatBubble | design | 0 | 1 | 0 | no-badge-wiring |
| ChatPanel | block | 0 | 1 | 1 | no-badge-wiring, tier-wrong |
| CommunityCommentRow | design | 0 | 1 | 1 | name-mismatch, no-badge-wiring |
| ContinueCard (Item variant) | design | 0 | 1 | 0 | no-badge-wiring |
| CourseProgressRow | design | 0 | 1 | 0 | no-badge-wiring |
| EmptyContent | design | 0 | 1 | 0 | no-badge-wiring |
| EntityLink | design | 0 | 1 | 0 | no-badge-wiring |
| ErrorContent | design | 0 | 1 | 0 | no-badge-wiring |
| MicroservicesScene | design | 0 | 1 | 0 | no-badge-wiring |
| NotificationItem | design | 0 | 1 | 1 | no-badge-wiring, tier-wrong |
| PhaseScarcityNote | design | 0 | 1 | 1 | name-mismatch, no-badge-wiring |
| PlaygroundCard | design | 0 | 1 | 0 | no-badge-wiring |
| RewardItemCard | design | 0 | 1 | 2 | no-badge-wiring, other, tier-wrong |
| SectionHeading | design | 0 | 1 | 1 | nesting-mismatch, no-badge-wiring |
| SitePreview | design | 0 | 1 | 0 | no-badge-wiring |
| FeedItem | design | 0 | 0 | 0 | — |

## Chi tiết gap HIGH (theo block)

### FlashcardDeckList (block)
- **nesting-mismatch** · _Có dữ liệu / Tìm có kết quả (DATA_PARTS)_ — DeckCard is a flat sibling of AsyncContent in DATA_PARTS, but the real DOM renders the DeckCard grid INSIDE AsyncContent's content branch (AsyncContent wraps `content` in a relative/data-anat div). DeckCard should be a `children` of the AsyncContent (state:content) node, not a peer.
- **nesting-mismatch** · _Rỗng_ — EMPTY_PARTS lists EmptyContent as a flat sibling of AsyncContent, but AsyncContent renders `<EmptyContent/>` as its empty branch — a DOM child of AsyncContent's wrapper div. EmptyContent should nest under the AsyncContent (state:empty) node.
- **nesting-mismatch** · _Lỗi_ — ERROR_PARTS lists ErrorContent as a flat sibling of AsyncContent, but AsyncContent renders `<ErrorContent/>` inside its wrapper as the error branch. ErrorContent should be a child of the AsyncContent (state:error) node.
- **nesting-mismatch** · _Đang tải_ — LOADING_PARTS lists the skeleton DeckCard (state:skeleton) as a flat sibling of AsyncContent, but skeletonGrid is passed as AsyncContent's `skeleton` branch and renders inside AsyncContent's wrapper div. The skeleton DeckCard should nest under the AsyncContent (state:loading) node.

### NotificationBell (block)
- **extra-curated** · _Đã đọc hết / Vượt ngưỡng_ — Both NoUnread ('Đã đọc hết') and OverCap ('Vượt ngưỡng') pass defaultOpen={false}, so the HeroUI Popover is CLOSED and PopoverContent > NotificationList (children Typography title, Button · markAllRead, NotificationItem) never mount for those leaves' props. Yet NO_BADGE_PARTS and WITH_BADGE_PARTS list the full open NotificationList subtree. For those two leaves the only real DOM is the Button trigger (+ Badge for OverCap); the Popover/NotificationList parts are curated, not rendered.
- **nesting-mismatch** · _Có chưa đọc_ — Real DOM roots at Popover, which wraps BOTH the Button trigger and (via PopoverContent) NotificationList. WITH_BADGE_PARTS lists Button · iconOnly, Badge, Popover, NotificationList as FLAT top-level siblings — Popover has no children. Faithful anatomy needs Popover as parent with children [Button (trigger), PopoverContent > NotificationList].
- **nesting-mismatch** · _Có chưa đọc_ — Badge renders INSIDE the Button's icon, wrapped by Badge.Anchor alongside BellIcon (icon={<Badge.Anchor><BellIcon/><Badge/></Badge.Anchor>}). WITH_BADGE_PARTS lists Badge as a top-level sibling of Button; it should be nested under the Button trigger's icon, not a peer.

### TruthList (block)
- **missing-structural** · _Một sự thật / Không byline / Nội dung dài xuống dòng (TRUTHLIST_PARTS)_ — TruthList's real root is the surface-frame wrapper `<div class="overflow-hidden rounded-3xl bg-surface shadow-surface">` (TruthList.tsx line 44) that wraps the Accordion. TRUTHLIST_PARTS lists only Accordion→Typography and omits this list/card frame entirely, so the block's bounding surface never appears in the anatomy tree for these three data leaves.
- **missing-structural** · _Có byline (TRUTHLIST_BYLINE_PARTS)_ — Same surface-frame root div (`rounded-3xl bg-surface shadow-surface`) is absent from TRUTHLIST_BYLINE_PARTS — it lists Accordion + `Typography · byline` but not the outer surface wrapper the component actually mounts as its root.
- **missing-structural** · _Rỗng (EMPTY_PARTS)_ — The Empty story hand-rolls `<div class="overflow-hidden rounded-3xl bg-surface shadow-surface"><EmptyState/></div>` (stories lines 182-188), so the rendered DOM has the surface frame div wrapping EmptyState, but EMPTY_PARTS lists only EmptyState — the surface wrapper part is missing.

### ContinueCard (design)
- **missing-structural** · _Không gấp / Gấp (CONTENT_PARTS)_ — The loaded hero leaves pass ctaLabel="Continue" with no href, so ContinueCard renders a real primary CTA <Button> (with ArrowRightIcon) on its own row (ContinueCard.tsx L155-165, wrapped at L214). CONTENT_PARTS (Progress stories L42-48) omits this Button entirely. The sibling NO_PROGRESS_PARTS correctly lists a Button CTA node — Progress must too. Effect: the block's primary interactive control has no legend row/number in the anatomy panel.
- **nesting-mismatch** · _Không gấp / Gấp (CONTENT_PARTS)_ — StatusChip is passed as MetaRow's `chip` prop (ContinueCard.tsx L193-205), so in the real DOM it mounts INSIDE MetaRow. CONTENT_PARTS lists StatusChip flat as a sibling of MetaRow (Progress L46), not under MetaRow.children. The sibling NO_PROGRESS_PARTS nests it correctly (NoProgress L48-54). Fix: move StatusChip into MetaRow.children. Effect: the Cây (tree) view renders StatusChip as a peer of MetaRow instead of its child.

### GradeCreditCaption (design)
- **nesting-mismatch** · _Còn nhiều credit / Model pin, không cảnh báo / Chưa biết chi phí Auto / Bấm mở chi tiết (MUTED_PARTS)_ — Real DOM nests the text span INSIDE the button: <button> › <span>(text). MUTED_PARTS lists 'Pressable · button' and 'Typography · text' as two FLAT siblings under the root. The 'Typography · text' part is a child of 'Pressable · button' and should sit in that node's `children`, not beside it — the Cây view otherwise draws them as siblings when the button wraps the text.
- **nesting-mismatch** · _Chặn: hết tuần / Chặn: dồn khung 5h (WARNING_PARTS)_ — Real DOM is two levels deep: <button>(Pressable) › <span.inline-flex>(the caption line) › [ <WarningCircleIcon/>, text node ]. WARNING_PARTS lists all three (Pressable · button, WarningCircleIcon, Typography · text) as FLAT siblings. Both the WarningCircleIcon and the text live INSIDE the pressable, and the icon is a child of the same inline-flex line span as the text — the spec should nest icon+text as `children` of the caption line, and the caption line as `children` of Pressable.

### ReactionBar (design)
- **nesting-mismatch** · _Chưa react / Đã react_ — INTERACTIVE_PARTS lists SmileyIcon, Typography(count), Emoji picker as three FLAT siblings, but the real DOM nests them: the trigger `button[aria-label="React"]` wraps BOTH the glyph (SmileyIcon/emoji) AND the count Typography as its children, and only the Emoji picker (motion.div) is a true sibling of that button under the root div. Spec should put SmileyIcon + Typography under a trigger-button `children`, with the picker as the sibling — not all three flat.
- **missing-structural** · _Chưa react / Đã react_ — The actual interactive trigger element — `button[aria-label="React"][aria-expanded]` (the clickable that toggles the picker) — is absent from INTERACTIVE_PARTS. The parts list only its inner glyph (SmileyIcon), collapsing the real switch/wrapper node into the icon. The root `div.relative.flex.items-center.gap-2` wrapper is likewise unrepresented. The primary structural node of the interactive bar is not a part.

### TrackCard (design)
- **missing-structural** · _all leaves (shared TRACK_PARTS, e.g. Accent · 4 tầng)_ — The CTA the component ALWAYS renders — a native <button> (TrackCard.tsx lines 99-106) with viewLabel ('Vào khóa') + ArrowRightIcon — is entirely absent from TRACK_PARTS. It's a real interactive leaf node of the block (the design description even calls it 'chốt bằng CTA vào khóa'), yet parts lists only Card/IconTile/Typography. Every real DOM part must appear.
- **stub-inline** · _all leaves (shared TRACK_PARTS)_ — The CTA is a hand-rolled native <button> (lines 99-106) instead of importing the real Button primitive port. The component comment (lines 94-98) explicitly acknowledges deferring the Button port. Faithful DOM should import the real primitive; because it's inlined, parts has no Button/CTA node to point at.

### ActivityFeed (block)
- **missing-structural** · _Nhiều ngày (+ Một hoạt động / Hoạt động của bạn / Chỉ đọc / Viền / Thả cảm xúc — all FEED_PARTS leaves)_ — FEED_PARTS lists SurfaceListCard as the root part, but the REAL top node per day-group is DayHeaderSection (the inlined frameless-subtleLabel LabeledCard mirror, ActivityFeed.tsx lines 161-170) which wraps EVERY SurfaceListCard and renders the day eyebrow (Hôm nay/Hôm qua/date span.text-xs.text-muted). Neither DayHeaderSection nor its day-label eyebrow appears in FEED_PARTS, and SurfaceListCard is listed flat where it actually nests INSIDE DayHeaderSection (also a nesting-mismatch). It is a hand-rolled inline LabeledCard copy (documented TODO line 160); LabeledCard is not yet ported to .storybook, so there is no real port to import.
- **missing-structural** · _all FEED_PARTS data leaves (Nhiều ngày, Một hoạt động, Hoạt động của bạn, Chỉ đọc, Viền, Thả cảm xúc)_ — FEED_PARTS goes SurfaceListCard -> FeedItem directly, but each row is really wrapped in <SurfaceListCardItem> (ActivityFeed.tsx lines 322-326) sitting between SurfaceListCard and FeedItem. SurfaceListCardItem is a real imported+rendered part (import line 20) — the per-row list frame — and is absent from every leaf. The SKELETON_PARTS leaf also omits it though its render (lines 258-269) mounts SurfaceListCardItem too.

### PitchCard (design)
- **nesting-mismatch** · _Mặc định (+ Bộ tone, Tone còn lại — cùng base composition)_ — SectionCard is the surface FRAME: it renders Card>CardContent and receives IconTile + Typography·h5 + Typography·body-sm as its children (they mount INSIDE the Card element in the real DOM). But PITCH_PARTS lists all four flat as siblings of SectionCard. Faithful tree must nest: SectionCard { children: [IconTile, Typography·h5, Typography·body-sm] }. Applies to every base leaf.
- **nesting-mismatch** · _Có CTA (WithFooter)_ — The footer mounts as `<div>{footer}</div>` inside SectionCard's CardContent (a wrapper div → Button). PITCH_FOOTER_PARTS appends `footer › Button` flat at the block root instead of nesting it under SectionCard.children; the wrapper <div> node is also folded away rather than represented as the actual DOM parent of Button.

### PriceTag (design)
- **nesting-mismatch** · _Đang giảm giá (also Ba cỡ, Tiền USD, Giảm không breakdown, Popover mở)_ — DISCOUNT_PARTS lists StatusChip and Popover as FLAT siblings, but the real DOM nests them: StatusChip is a child of the Popover (rendered inside Popover.Trigger, lines 157-165), and the breakdown rows live inside Popover.Content. StatusChip should be under Popover via children, not a flat sibling before it.
- **missing-structural** · _Đang giảm giá (all discount leaves + Popover mở)_ — The actual interactive affordance is the Popover.Trigger wrapper (aria-label 'Chi tiết giá' -> role=button), confirmed by BreakdownOpen's play getByRole('button',{name:'Chi tiết giá'}). The spec omits this trigger node and instead assigns the button role to StatusChip. Also the 3-5 Typography breakdown rows inside Popover.Content (Giá gốc / Giai đoạn / Ưu đãi thành viên / Bạn trả, lines 109-142) are real DOM parts absent from parts, collapsed into the single 'Popover' role text.

### ShowcaseMockup (design)
- **missing-structural** · _all leaves (BASE_PARTS · NO_BACKDROP_PARTS · NO_URL_PARTS)_ — The foreground WINDOW CARD — `div` with `border border-default bg-surface rounded-3xl overflow-hidden` (ShowcaseMockup.tsx L160-165), the actual 'browser window' surface that visibly frames the whole mockup — is absent from every parts array. It is the central structural node: window chrome (L167) and content (L178) both mount INSIDE it. Its parent `div.group.relative` card-stack/fanned wrapper (L146), which also holds Card sau, is likewise unrepresented. Every real DOM part must appear; the most prominent surface of the block is missing.
- **nesting-mismatch** · _all leaves (BASE_PARTS · NO_BACKDROP_PARTS · NO_URL_PARTS)_ — `Window chrome` and `Content` are listed as flat top-level siblings of `Card sau`, but in the DOM both are CHILDREN of the foreground window card (L167 and L178 nest inside the card div at L160). They should be `children` of a window-card node, not root-level parts. Also Backdrop sits under the root while Card sau sits under `div.group.relative`, so the spec collapses two real nesting levels into one flat list.

### RelatedContentList (block)
- **nesting-mismatch** · _DATA_PARTS (shared: Một kết quả · Nhiều kết quả · Có hàng khoá · Loại nguồn hiện tại · Giới hạn số hàng)_ — DATA_PARTS lists LabeledCard, AsyncContent, SurfaceListCard, EntityResultRow as a FLAT sibling array, but the component nests them in a strict containment chain: LabeledCardFrameless(section) > AsyncContent(div.relative) > div[data-anat-part=SurfaceListCard]/SurfaceListCard > EntityResultRow. AnatomyNode.children exists for exactly this and the Cây view renders nesting from it, so the tree wrongly shows 4 co-equal siblings. Should be AsyncContent as child of LabeledCard, SurfaceListCard as child of AsyncContent, EntityResultRow as child of SurfaceListCard.
- **nesting-mismatch** · _Đang tải (LOADING_PARTS)_ — LOADING_PARTS lists LabeledCard, AsyncContent, SurfaceListCard, Skeleton flat, but real DOM nests LabeledCard > AsyncContent(loading branch) > div[data-anat-part=SurfaceListCard]/SurfaceListCard > SurfaceListCardItem > div[data-anat-part=Skeleton] > Skeleton.Typography. The four parts should be a nested chain via children, not siblings.

### CourseCard (Grid) (design)
- **stub-inline** · _Discounted / Enrolled / No Cover_ — The `PriceTag` part (spec tier=block) is NOT the real port — CourseCard.tsx hand-rolls a full inline copy (PriceTag lines 45-140: formatVnd, savingPercent, StatusChip chip, Popover breakdown) with a stale `// TODO: swap` at L46. A real faithful port EXISTS at .storybook/stories/blocks/commerce/PriceTag/PriceTag.tsx. Every leaf that shows the price (Discounted, Enrolled, No Cover — all render PriceTag at CourseCard.tsx L508) renders the inline stub, not the port. Spec itself flags '⚠ đang inline'. Faithful DOM must import the real PriceTag.

### HeroBanner (design)
- **no-badge-wiring** · _ALL (Căn giữa/Chia đôi/Chỉ CTA/Dải keyword/Headline dài)_ — HeroBanner emits no `data-anat-part` on any element and accepts no `showAnatomy` prop to cascade an AnatomyOverlay. Its rendered parts (StatusChip, Typography.Heading, Typography, Button slots, Chip) are plain HeroUI primitives that also carry no `data-anat-part`. BlockAnatomy anchors badges via `box.querySelectorAll('[data-anat-part]')` — with zero tagged nodes, NONE of the listed parts get a numbered on-render badge on any of the 5 leaves. The whole anatomy panel is a legend with nothing to point at.

### PricingTable (block)
- **stub-inline** · _Có gói nổi bật + Không gói nổi bật (both)_ — PricingTable.tsx defines a local `const PricingCard` (lines 41-74) and renders THAT, instead of importing the real ported port at .storybook/stories/blocks/cards/PricingCard/PricingCard.tsx (essentially identical: SectionCard + StatusChip + Typography price row). The stories name the top part `PricingCard` (HIGHLIGHTED_PARTS/PLAIN_PARTS) but it resolves to the inline stub, not the port. The file JSDoc claim 'PricingCard is NOT yet ported' is stale — the port exists. Faithful DOM needs the real primitive imported.

### CommentThread (block)
- **nesting-mismatch** · _Có dữ liệu_ — DATA_PARTS lists the inline reply 'Composer' (state:"reply") as a CHILD of CommunityCommentRow, but the component renders it as a SIBLING of the row inside the CommentThreadItem wrapper (CommentThread.tsx L114-124). The row only receives the hand-rolled 'Trả lời' button via its `actions` slot; the reply Composer is rendered after/outside CommunityCommentRow, never inside it. Only 'Trả lời' is a true child of the row.

### GradeModelDropdown (block)
- **missing-structural** · _Trigger inline / field / button / button full-width, Không auto, Khoá gói, Cảnh báo dưới floor, Vô hiệu hoá_ — FULL_CATALOG has gpt-4o with available=false, so at default showHidden=false hiddenCount=1 and the component renders the escape-hatch <button> 'Hiện 1 model đang ẩn' as the last child of the popover div — a real interactive switch that reveals hidden rows. It is absent from INLINE/FIELD/BUTTON/NO_AUTO/LOCKED/WARN_PARTS in every one of these leaves (only EmptyCatalog with models=[] legitimately has no such button).

### CommunityPostCard (design)
- **missing-structural** · _ALL leaves (Có dữ liệu, Founder + ghim, Đã ghim, Tác giả founder, Bài mới, Thân bài dài, Chỉ đọc, Tương tác)_ — The footer renders TWO affordances but the comment-count button is absent from every parts spec. Component footer (lines 150-173) is `<div flex gap-6>` = <ReactionBar> + a hand-rolled `<button>` (ChatCircleIcon + Typography commentCount, disabled when no onToggleComments). DEFAULT_PARTS / FOUNDER_PARTS / PINNED_PARTS / FOUNDER_PINNED_PARTS / READONLY_PARTS all list only ReactionBar for the footer. This comment button is a real, interactive DOM part (it is exactly the read-only vs interactive difference the 'Chỉ đọc'/'Tương tác' leaves are about) and must appear as its own part in every leaf.

### ContinueCard (design)
- **nesting-mismatch** · _Chưa có tiến độ / Có icon nền (streak) / CTA dạng link (href)_ — For all three hero leaves the real DOM nests: HighlightCard (outer wrapper, `return isHero ? <HighlightCard>{cardNode}</HighlightCard>`) CONTAINS SectionCard, and SectionCard CONTAINS the title Typography, MetaRow, and the CTA Button/Link. But NO_PROGRESS_PARTS / WITH_ICON_PARTS / LINK_CTA_PARTS list SectionCard, HighlightCard, Typography, MetaRow and Button as FLAT sibling children of the root (SectionCard even listed before its own parent HighlightCard). Only MetaRow>StatusChip uses `children`. The tree should be HighlightCard > SectionCard > [Typography, MetaRow>StatusChip, Button] (WithIcon adds the watermark Icon as a SectionCard child). The `children` nesting mechanism exists and is used for StatusChip, so the flat containment misrepresents the true DOM tree.

### CourseCard (Line) (design)
- **stub-inline** · _Có dữ liệu / Đã đăng ký / Không ảnh bìa_ — CourseCard.tsx hand-rolls a full INLINE copy of PriceTag (const PriceTag = … lines 45-140, incl. its own StatusChip + Popover breakdown) even though the REAL port already exists at .storybook/stories/blocks/commerce/PriceTag/PriceTag.tsx with a matching API (discounted/original/size). The in-file TODO ('not yet ported … commerce/PriceTag') is stale. Every leaf that renders the price (Default, Enrolled, No Cover) mounts the fake copy, so the spec's `PriceTag` (tier block) part does not point at the real primitive DOM. Should import the ported PriceTag.

### MicroservicesDiagram (design)
- **missing-structural** · _Có caption / Không caption / Màn hẹp (all leaves)_ — The topology itself — 11 hand-rolled node cards across 5 tier rows (Client, Load Balancer, API Gateway[accent], Auth/Order/Payment[danger], Postgres[danger]/Redis/Kafka), each a motion.div with name+sub spans, plus the tier wrapper divs — is the PRIMARY rendered content of the diagram, yet NO part represents it in any leaf. Both WITH_CAPTION_PARTS and NO_CAPTION_PARTS list only StatusChip (+Typography). The spec captures the floating failure chips but omits the entire microservices graph the block exists to draw. Anatomy = real DOM tree requires a part for the node/tier cards (design/hand-rolled), not just the annotations curated beside them.

### PricingCard (design)
- **nesting-mismatch** · _BaseTier / HighlightedWithBadge / BadgeHiddenWithoutHighlight / DiscountWithoutHighlight / NoPeriod / LongFeatureList (all single-card leaves)_ — PricingCard.tsx returns a single <SectionCard> as the outer frame; the name row, StatusChip, price/originalPrice/period, features and cta are all rendered INSIDE SectionCard's CardContent. But BASE_PARTS/FULL_PARTS/DISCOUNT_PARTS/NO_PERIOD_PARTS list 'SectionCard' as a FLAT sibling of those content parts (all direct children of the PricingCard root). Faithful DOM nests them: SectionCard (design, the labeled-card wrapper) should carry the Typography/StatusChip/features/cta parts as its `children`, not list them as peers. This flattening is repeated in every single-card leaf.

### SelfHostGpuMark (design)
- **nesting-mismatch** · _Đứng riêng + Cạnh tên model (shared MARK_PARTS)_ — In the real DOM CpuIcon is rendered INSIDE Tooltip — it is the child of Tooltip.Trigger, which is a child of the Tooltip root. MARK_PARTS lists Tooltip and CpuIcon as two flat siblings, losing the nesting. CpuIcon should sit under Tooltip via `children`, not beside it. Also the Tooltip.Content explanation span (the actual self-host detail text) is not represented as a nested part of Tooltip.

### TopicLane (block)
- **stub-inline** · _Một hàng / Danh sách thường / Nhãn dài cắt bớt / Hàng tĩnh (CONTENT_PARTS)_ — CONTENT_PARTS lists a `ListRow` part (role literally admits 'đang hand-roll button'), but TopicLane.tsx renders each row as a raw inline `<button>` (lines 57-69) wrapping two Typography (label + code tag) — it never imports the real ListRow port that already exists at .storybook/stories/blocks/lists/ListRow. ListRow provides exactly title(left) + meta(right) + onPress, so the faithful DOM should mount the real primitive, not a hand-rolled button. Affects all 4 row-bearing leaves.

### UpNextCard (design)
- **nesting-mismatch** · _ALL leaves (esp. Đầy đủ / Nội dung dài where all four parts co-exist)_ — The real DOM is SectionCard(frame) → CardContent → [check/eyebrow row(CheckCircleIcon+Typography), next-rung div(Typography title/desc), CTA row(Button primary + optional tertiary Button)]. i.e. CheckCircleIcon, Typography and Button all render INSIDE SectionCard's CardContent. But every *_PARTS constant lists them FLAT as siblings of SectionCard: [SectionCard, CheckCircleIcon, Typography, Button]. Since SectionCard is itself listed as a part (it is a real composed design port, imported from ../../cards/SectionCard, not hand-rolled), the content parts should be its `children`, not flat peers — the Cây tree currently draws UpNextCard→{SectionCard, CheckCircleIcon, Typography, Button} as one flat level, misrepresenting that SectionCard wraps the other three. (Alternative fix matching the DeckCard convention: drop SectionCard as a listed part and treat it as the frame/root, leaving the content flat — but as written it is neither.)

### NotificationList (block)
- **missing-structural** · _Rỗng (Empty)_ — The Empty story passes title="Notifications", so NotificationList still renders its header block — a Typography (body-sm/semibold) title — above the EmptyState fallback (isEmpty gates only the body, not the header; the mark-all-read Button is absent only because onMarkAllRead is omitted). But EMPTY_PARTS lists ONLY { name: "EmptyState" }; the header Typography title that actually mounts is missing from parts. The leaf note ("Mọi nhóm rỗng → không header") is factually wrong for the props given. Fix: add a Typography (header title, primitive) part before EmptyState, or drop title="Notifications" from the story to make the no-header note true.
