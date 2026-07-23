import type { Meta, StoryObj } from "@storybook/nextjs"
import { DeckCard } from "./DeckCard"
import { BlockAnatomy, type AnatomyNode } from "../../layout/BlockAnatomy/BlockAnatomy"

/**
 * DESIGN — a single flashcard-deck picker card (title + due/difficulty chips, an
 * optional blurb, a per-viewer mastery meter, card count, and one "Học" CTA). The
 * card itself is not pressable — the CTA is the only action.
 *
 * ANATOMY IS PER-LEAF: each story below is its OWN leaf and carries its OWN
 * BlockAnatomy axis (Sơ đồ + Cây) reflecting the parts THAT leaf composes — there
 * is no separate consolidated "Anatomy" story.
 */
const meta: Meta<typeof DeckCard> = {
    title: "Design/Learn/DeckCard",
    component: DeckCard,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof DeckCard>

/** Frame each leaf's anatomy panel with breathing room. */
const frame = (node: React.ReactNode) => <div className="mx-auto max-w-4xl p-8">{node}</div>

// Real DOM: <Card rounded-3xl> → <Card.Content> holds, in order, the header row
// (title Typography + StatusChip + DifficultyChip), the description Typography, the
// mastery ProgressMeter, then the footer row (card-count Typography + CTA Button).
// The flexbox rows are anonymous layout divs (no named port) so they aren't nodes;
// the Card frame CONTAINS everything → all parts nest under its `children`.

// FULL composition — due chip + difficulty chip + description + mastery meter + CTA (Default, Long, Grid).
const DECK_PARTS: Array<AnatomyNode> = [
    {
        name: "Card",
        tier: "primitive",
        role: "khung thẻ (rounded-3xl) bọc toàn bộ nội dung — card không bấm được, CTA là hành động duy nhất",
        children: [
            { name: "Typography", tier: "primitive", role: "tiêu đề (body-sm · medium · clamp-2)" },
            { name: "StatusChip", tier: "primitive", role: '"N đến hạn" (warning) — chỉ khi showProgress && dueCount', state: "warning" },
            { name: "DifficultyChip", tier: "design", role: "chấm màu theo độ khó (beginner→insane)" },
            { name: "Typography", tier: "primitive", role: "mô tả chủ đề (body-xs · muted · clamp-2)" },
            { name: "ProgressMeter", tier: "primitive", role: "thanh mastery% (đã thuộc/tổng) — thay text+Separator cũ" },
            { name: "Typography", tier: "primitive", role: "số thẻ (body-xs · muted)" },
            { name: "Button", tier: "primitive", role: 'CTA "Học" — hành động duy nhất (card không click được)' },
        ],
    },
]

// No due cards — dueCount rỗng nên StatusChip biến mất, meter vẫn còn (NoDue, FullyMastered).
const NO_DUE_PARTS: Array<AnatomyNode> = [
    {
        name: "Card",
        tier: "primitive",
        role: "khung thẻ (rounded-3xl) bọc toàn bộ nội dung — card không bấm được, CTA là hành động duy nhất",
        children: [
            { name: "Typography", tier: "primitive", role: "tiêu đề (body-sm · medium · clamp-2)" },
            { name: "DifficultyChip", tier: "design", role: "chấm màu theo độ khó (beginner→insane)" },
            { name: "Typography", tier: "primitive", role: "mô tả chủ đề (body-xs · muted · clamp-2)" },
            { name: "ProgressMeter", tier: "primitive", role: "thanh mastery% (đã thuộc/tổng)" },
            { name: "Typography", tier: "primitive", role: "số thẻ (body-xs · muted)" },
            { name: "Button", tier: "primitive", role: 'CTA "Học" — hành động duy nhất' },
        ],
    },
]

// No description — StatusChip + meter vẫn còn, chỉ dòng blurb Typography xẹp (NoDescription).
const NO_DESC_PARTS: Array<AnatomyNode> = [
    {
        name: "Card",
        tier: "primitive",
        role: "khung thẻ (rounded-3xl) bọc toàn bộ nội dung — card không bấm được, CTA là hành động duy nhất",
        children: [
            { name: "Typography", tier: "primitive", role: "tiêu đề (body-sm · medium · clamp-2)" },
            { name: "StatusChip", tier: "primitive", role: '"N đến hạn" (warning) — chỉ khi showProgress && dueCount', state: "warning" },
            { name: "DifficultyChip", tier: "design", role: "chấm màu theo độ khó (beginner→insane)" },
            { name: "ProgressMeter", tier: "primitive", role: "thanh mastery% (đã thuộc/tổng) — thay text+Separator cũ" },
            { name: "Typography", tier: "primitive", role: "số thẻ (body-xs · muted)" },
            { name: "Button", tier: "primitive", role: 'CTA "Học" — hành động duy nhất (card không click được)' },
        ],
    },
]

// Quiz mode — showProgress=false: KHÔNG StatusChip, KHÔNG ProgressMeter, chỉ đổi nhãn CTA.
const QUIZ_PARTS: Array<AnatomyNode> = [
    {
        name: "Card",
        tier: "primitive",
        role: "khung thẻ (rounded-3xl) bọc toàn bộ nội dung — card không bấm được, CTA là hành động duy nhất",
        children: [
            { name: "Typography", tier: "primitive", role: "tiêu đề (body-sm · medium · clamp-2)" },
            { name: "DifficultyChip", tier: "design", role: "chấm màu theo độ khó (beginner→insane)" },
            { name: "Typography", tier: "primitive", role: "mô tả chủ đề (body-xs · muted · clamp-2)" },
            { name: "Typography", tier: "primitive", role: "số thẻ (body-xs · muted)" },
            { name: "Button", tier: "primitive", role: "CTA nhãn tuỳ biến (vd 'Hỏi nhanh')" },
        ],
    },
]

// Khung chờ — Skeleton mirror đúng footprint card thật, cùng khung Card (Skeleton, Khung chờ · lưới).
const SKELETON_PARTS: Array<AnatomyNode> = [
    {
        name: "Card",
        tier: "primitive",
        role: "khung thẻ (rounded-3xl) — giữ nguyên footprint khi tải",
        children: [
            { name: "Skeleton.Typography", tier: "primitive", role: "khung tiêu đề (body-sm · 1/2)", state: "skeleton" },
            { name: "Skeleton.Chip", tier: "primitive", role: "khung chip độ khó", state: "skeleton" },
            { name: "Skeleton.Typography", tier: "primitive", role: "khung mô tả (body-xs · 3/4)", state: "skeleton" },
            { name: "Skeleton.Typography", tier: "primitive", role: "khung nhãn mastery (body-xs · 1/3)", state: "skeleton" },
            { name: "Skeleton.Typography", tier: "primitive", role: "khung % mastery (body-xs · w-8)", state: "skeleton" },
            { name: "Skeleton.Meter", tier: "primitive", role: "khung thanh mastery", state: "skeleton" },
            { name: "Skeleton.Typography", tier: "primitive", role: "khung số thẻ (body-xs · 1/4)", state: "skeleton" },
            { name: "Skeleton.Button", tier: "primitive", role: "khung CTA", state: "skeleton" },
        ],
    },
]

/** Default — a deck with due cards and partial mastery progress. */
export const Default: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="DeckCard"
                tier="design"
                leaf="Đầy đủ"
                parts={DECK_PARTS}
                reason="Gom chip trạng thái (đến hạn + độ khó), thanh mastery trực quan thay dòng chữ, và MỘT CTA duy nhất vào một ô — để feature (FlashcardDeckList) chỉ lặp map truyền dữ liệu, không dựng lại khung/chip/thanh mỗi nơi. Khi tải: Skeleton mirror đúng khung này."
            >
                <div className="w-80">
                    <DeckCard
                        title="React Hooks nâng cao"
                        description="useEffect, useMemo, useCallback và các bẫy dependency thường gặp."
                        difficulty="intermediate"
                        dueCount={6}
                        masteredCount={18}
                        cardCount={40}
                        showAnatomy
                        onOpen={() => {}}
                    />
                </div>
            </BlockAnatomy>,
        ),
}

/** No due cards — the due chip disappears, only difficulty remains. */
export const NoDue: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="DeckCard"
                tier="design"
                leaf="Không đến hạn"
                parts={NO_DUE_PARTS}
                note="dueCount rỗng → StatusChip 'đến hạn' biến mất, chỉ còn DifficultyChip; meter vẫn hiện."
            >
                <div className="w-80">
                    <DeckCard
                        title="CSS Flexbox căn bản"
                        description="Các thuộc tính container và item cốt lõi khi dựng layout."
                        difficulty="beginner"
                        masteredCount={12}
                        cardCount={12}
                        showAnatomy
                        onOpen={() => {}}
                    />
                </div>
            </BlockAnatomy>,
        ),
}

/** Fully mastered — the meter fills to 100%. */
export const FullyMastered: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="DeckCard"
                tier="design"
                leaf="Thuộc hết"
                parts={NO_DUE_PARTS}
                note="Không đến hạn → không StatusChip; ProgressMeter đầy 100% (đã thuộc = tổng)."
            >
                <div className="w-80">
                    <DeckCard
                        title="Git — nhánh & rebase"
                        description="Tạo nhánh, merge, rebase và xử lý conflict cơ bản."
                        difficulty="advanced"
                        masteredCount={25}
                        cardCount={25}
                        showAnatomy
                        onOpen={() => {}}
                    />
                </div>
            </BlockAnatomy>,
        ),
}

/** No description — the blurb row collapses cleanly. */
export const NoDescription: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="DeckCard"
                tier="design"
                leaf="Không mô tả"
                parts={NO_DESC_PARTS}
                note="Bỏ description → Typography mô tả biến mất khỏi cây; các part còn lại (chip · meter · CTA) giữ nguyên."
            >
                <div className="w-80">
                    <DeckCard
                        title="Thuật toán sắp xếp"
                        difficulty="insane"
                        dueCount={3}
                        masteredCount={4}
                        cardCount={30}
                        showAnatomy
                        onOpen={() => {}}
                    />
                </div>
            </BlockAnatomy>,
        ),
}

/** Long title/description — both `line-clamp-2`, so overflow truncates instead of stretching the card. */
export const LongTitleAndDescription: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="DeckCard"
                tier="design"
                leaf="Nội dung dài"
                parts={DECK_PARTS}
                note="Tiêu đề + mô tả dài đều clamp-2 → tràn thì cắt, không kéo dài card; composition y hệt leaf 'Đầy đủ'."
            >
                <div className="w-80">
                    <DeckCard
                        title="Cấu trúc dữ liệu và giải thuật nâng cao cho phỏng vấn hệ thống phân tán quy mô lớn"
                        description="Bao gồm cây, đồ thị, quy hoạch động, chia để trị, và các kỹ thuật tối ưu độ phức tạp thời gian lẫn không gian thường gặp trong vòng phỏng vấn hệ thống."
                        difficulty="advanced"
                        dueCount={12}
                        masteredCount={30}
                        cardCount={80}
                        showAnatomy
                        onOpen={() => {}}
                    />
                </div>
            </BlockAnatomy>,
        ),
}

/** Quiz-mode reuse (`showProgress={false}`) — no due chip, no mastery meter, only the CTA label differs. */
export const QuizModeNoProgress: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="DeckCard"
                tier="design"
                leaf="Chế độ quiz"
                parts={QUIZ_PARTS}
                note="showProgress=false → bỏ cả StatusChip lẫn ProgressMeter (SR không liên quan khi chỉ chọn chủ đề để hỏi); chỉ còn tiêu đề · chip độ khó · CTA đổi nhãn."
            >
                <div className="w-80">
                    <DeckCard
                        title="React Hooks nâng cao"
                        description="useEffect, useMemo, useCallback và các bẫy dependency thường gặp."
                        difficulty="intermediate"
                        cardCount={40}
                        showProgress={false}
                        ctaLabel="Hỏi nhanh"
                        showAnatomy
                        onOpen={() => {}}
                    />
                </div>
            </BlockAnatomy>,
        ),
}

/** Grid of cards — how the deck picker actually repeats this card. */
export const Grid: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="DeckCard"
                tier="design"
                leaf="Lưới"
                parts={DECK_PARTS}
                note="Lưới deck picker chỉ lặp CÙNG card ×N (mỗi ô tự phân giải chip/meter theo dữ liệu) — không dựng lại khung mỗi nơi."
            >
                <div className="grid w-full max-w-3xl gap-3 @app-sm:grid-cols-2">
                    <DeckCard
                        title="React Hooks nâng cao"
                        description="useEffect, useMemo, useCallback và các bẫy dependency thường gặp."
                        difficulty="intermediate"
                        dueCount={6}
                        masteredCount={18}
                        cardCount={40}
                        onOpen={() => {}}
                    />
                    <DeckCard
                        title="CSS Flexbox căn bản"
                        description="Các thuộc tính container và item cốt lõi khi dựng layout."
                        difficulty="beginner"
                        masteredCount={12}
                        cardCount={12}
                        onOpen={() => {}}
                    />
                    <DeckCard
                        title="Thuật toán sắp xếp"
                        difficulty="insane"
                        dueCount={3}
                        masteredCount={4}
                        cardCount={30}
                        onOpen={() => {}}
                    />
                    <DeckCard
                        title="Git — nhánh & rebase"
                        description="Tạo nhánh, merge, rebase và xử lý conflict cơ bản."
                        difficulty="advanced"
                        masteredCount={25}
                        cardCount={25}
                        onOpen={() => {}}
                    />
                </div>
            </BlockAnatomy>,
        ),
}

/** Khung chờ — mirror của card thật khi đang tải (`isSkeleton`), mọi prop dữ liệu bị bỏ qua. */
export const Skeleton: Story = {
    name: "Khung chờ",
    render: () =>
        frame(
            <BlockAnatomy
                name="DeckCard"
                tier="design"
                leaf="Khung chờ"
                parts={SKELETON_PARTS}
                note="isSkeleton → mỗi part thật đổi sang Skeleton tương ứng, giữ đúng footprint card (mọi prop dữ liệu bị bỏ qua)."
            >
                <div className="w-80">
                    <DeckCard title="" difficulty="beginner" cardCount={0} onOpen={() => {}} isSkeleton />
                </div>
            </BlockAnatomy>,
        ),
}

/** Khung chờ · lưới — cả lưới deck picker đang tải cùng lúc. */
export const SkeletonGrid: Story = {
    name: "Khung chờ · lưới",
    render: () =>
        frame(
            <BlockAnatomy
                name="DeckCard"
                tier="design"
                leaf="Khung chờ · lưới"
                parts={SKELETON_PARTS}
                note="Cả lưới deck picker đang tải cùng lúc — Skeleton mirror ×4, giữ nguyên footprint lưới thật."
            >
                <div className="grid w-full max-w-3xl gap-3 @app-sm:grid-cols-2">
                    <DeckCard title="" difficulty="beginner" cardCount={0} onOpen={() => {}} isSkeleton />
                    <DeckCard title="" difficulty="beginner" cardCount={0} onOpen={() => {}} isSkeleton />
                    <DeckCard title="" difficulty="beginner" cardCount={0} onOpen={() => {}} isSkeleton />
                    <DeckCard title="" difficulty="beginner" cardCount={0} onOpen={() => {}} isSkeleton />
                </div>
            </BlockAnatomy>,
        ),
}
