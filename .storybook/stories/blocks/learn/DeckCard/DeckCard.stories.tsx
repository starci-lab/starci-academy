import type { Meta, StoryObj } from "@storybook/nextjs"
import { DeckCard } from "./DeckCard"
import { blockShell } from "../../../block-anatomy"

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

const ANATOMY = {
    primitives: [
        { name: "DifficultyChip", tier: "primitive" as const, role: "chấm màu theo độ khó (thang beginner→insane)" },
        { name: "StatusChip", tier: "primitive" as const, role: "nhãn \"N đến hạn\" (tone warning) — chỉ khi showProgress" },
        { name: "ProgressMeter", tier: "primitive" as const, role: "thanh mastery% (đã thuộc/tổng) — thay text+Separator cũ" },
        { name: "Button", tier: "primitive" as const, role: "CTA \"Học\" — hành động duy nhất trên card (card không click được)" },
        { name: "Typography", tier: "primitive" as const, role: "tiêu đề (clamp-2) + mô tả muted (clamp-2) + số thẻ" },
        { name: "Skeleton", tier: "primitive" as const, state: "Khung chờ", role: "mirror đúng khung khi isSkeleton" },
    ],
    reason:
        "Một ô bộ thẻ trong lưới chọn chủ đề gom chip trạng thái (đến hạn + độ khó), thanh mastery trực quan thay vì dòng chữ, và một CTA duy nhất — để feature (FlashcardDeckList) chỉ lặp `map` truyền dữ liệu, không tự dựng lại khung/chip/thanh tiến độ mỗi nơi dùng.",
}

/** Default — a deck with due cards and partial mastery progress. */
export const Default: Story = {
    render: () =>
        blockShell(
            <div className="w-80">
                <DeckCard
                    title="React Hooks nâng cao"
                    description="useEffect, useMemo, useCallback và các bẫy dependency thường gặp."
                    difficulty="intermediate"
                    dueCount={6}
                    masteredCount={18}
                    cardCount={40}
                    onOpen={() => {}}
                />
            </div>,
            ANATOMY,
        ),
}

/** No due cards — the due chip disappears, only difficulty remains. */
export const NoDue: Story = {
    render: () =>
        blockShell(
            <div className="w-80">
                <DeckCard
                    title="CSS Flexbox căn bản"
                    description="Các thuộc tính container và item cốt lõi khi dựng layout."
                    difficulty="beginner"
                    masteredCount={12}
                    cardCount={12}
                    onOpen={() => {}}
                />
            </div>,
            ANATOMY,
        ),
}

/** Fully mastered — the meter fills to 100%. */
export const FullyMastered: Story = {
    render: () =>
        blockShell(
            <div className="w-80">
                <DeckCard
                    title="Git — nhánh & rebase"
                    description="Tạo nhánh, merge, rebase và xử lý conflict cơ bản."
                    difficulty="advanced"
                    masteredCount={25}
                    cardCount={25}
                    onOpen={() => {}}
                />
            </div>,
            ANATOMY,
        ),
}

/** No description — the blurb row collapses cleanly. */
export const NoDescription: Story = {
    render: () =>
        blockShell(
            <div className="w-80">
                <DeckCard
                    title="Thuật toán sắp xếp"
                    difficulty="insane"
                    dueCount={3}
                    masteredCount={4}
                    cardCount={30}
                    onOpen={() => {}}
                />
            </div>,
            ANATOMY,
        ),
}

/** Long title/description — both `line-clamp-2`, so overflow truncates instead of stretching the card. */
export const LongTitleAndDescription: Story = {
    render: () =>
        blockShell(
            <div className="w-80">
                <DeckCard
                    title="Cấu trúc dữ liệu và giải thuật nâng cao cho phỏng vấn hệ thống phân tán quy mô lớn"
                    description="Bao gồm cây, đồ thị, quy hoạch động, chia để trị, và các kỹ thuật tối ưu độ phức tạp thời gian lẫn không gian thường gặp trong vòng phỏng vấn hệ thống."
                    difficulty="advanced"
                    dueCount={12}
                    masteredCount={30}
                    cardCount={80}
                    onOpen={() => {}}
                />
            </div>,
            ANATOMY,
        ),
}

/** Quiz-mode reuse (`showProgress={false}`) — no due chip, no mastery meter, only the CTA label differs. */
export const QuizModeNoProgress: Story = {
    render: () =>
        blockShell(
            <div className="w-80">
                <DeckCard
                    title="React Hooks nâng cao"
                    description="useEffect, useMemo, useCallback và các bẫy dependency thường gặp."
                    difficulty="intermediate"
                    cardCount={40}
                    showProgress={false}
                    ctaLabel="Hỏi nhanh"
                    onOpen={() => {}}
                />
            </div>,
            ANATOMY,
        ),
}

/** Grid of cards — how the deck picker actually repeats this card. */
export const Grid: Story = {
    render: () =>
        blockShell(
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
            </div>,
            ANATOMY,
        ),
}

/** Khung chờ — mirror của card thật khi đang tải (`isSkeleton`), mọi prop dữ liệu bị bỏ qua. */
export const Skeleton: Story = {
    name: "Khung chờ",
    render: () =>
        blockShell(
            <div className="w-80">
                <DeckCard
                    title=""
                    difficulty="beginner"
                    cardCount={0}
                    onOpen={() => {}}
                    isSkeleton
                />
            </div>,
            ANATOMY,
        ),
}

/** Khung chờ · lưới — cả lưới deck picker đang tải cùng lúc. */
export const SkeletonGrid: Story = {
    name: "Khung chờ · lưới",
    render: () =>
        blockShell(
            <div className="grid w-full max-w-3xl gap-3 @app-sm:grid-cols-2">
                <DeckCard title="" difficulty="beginner" cardCount={0} onOpen={() => {}} isSkeleton />
                <DeckCard title="" difficulty="beginner" cardCount={0} onOpen={() => {}} isSkeleton />
                <DeckCard title="" difficulty="beginner" cardCount={0} onOpen={() => {}} isSkeleton />
                <DeckCard title="" difficulty="beginner" cardCount={0} onOpen={() => {}} isSkeleton />
            </div>,
            ANATOMY,
        ),
}
