import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button, Chip, ListBox, Typography } from "@heroui/react"
import { CardsIcon, TrayIcon } from "@phosphor-icons/react"
import { LabeledList } from "./LabeledList"
import { EmptyState } from "../../feedback/EmptyState/EmptyState"
import { Skeleton } from "../../skeleton/Skeleton/Skeleton"

const meta: Meta<typeof LabeledList> = {
    title: "Primitives/List/LabeledList",
    component: LabeledList,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof LabeledList>

/**
 * Local stand-in for `@/components/blocks/chips/DifficultyChip` — a soft chip whose
 * colour maps to a challenge difficulty.
 * TODO: swap for DifficultyChip local when ported.
 */
type Difficulty = "beginner" | "intermediate" | "advanced"
const DIFFICULTY: Record<Difficulty, { label: string; color: "success" | "warning" | "danger" }> = {
    beginner: { label: "Cơ bản", color: "success" },
    intermediate: { label: "Trung cấp", color: "warning" },
    advanced: { label: "Nâng cao", color: "danger" },
}
const DifficultyChip = ({ difficulty }: { difficulty: Difficulty }) => (
    <Chip size="sm" variant="soft" color={DIFFICULTY[difficulty].color}>
        <Chip.Label>{DIFFICULTY[difficulty].label}</Chip.Label>
    </Chip>
)

const challenges = [
    { id: "two-sum", title: "Two Sum", difficulty: "beginner" as const },
    { id: "sliding-window", title: "Sliding Window Maximum", difficulty: "advanced" as const },
    { id: "lru-cache", title: "LRU Cache", difficulty: "intermediate" as const },
]

const decks = [
    { id: "closures", title: "JavaScript Closures" },
    { id: "event-loop", title: "Event Loop" },
]

const shortcuts = [
    { id: "courses", label: "Khoá học" },
    { id: "review", label: "Ôn tập thẻ ghi nhớ" },
    { id: "practice", label: "Luyện tập" },
]

/** One related deck, no CTA — the lightest review panel (rows are muted body-sm text). */
export const SingleItem: Story = {
    render: () => (
        <div className="p-8">
            <LabeledList label="Ôn tập bài này">
                {decks.slice(0, 1).map((deck) => (
                    <Typography key={deck.id} type="body-sm" color="muted" truncate>
                        {deck.title}
                    </Typography>
                ))}
            </LabeledList>
        </div>
    ),
}

/** Multiple rows (title + difficulty) with a footer `action` CTA — the lesson-rail practice panel. */
export const MultipleWithAction: Story = {
    render: () => (
        <div className="p-8">
            <LabeledList
                label="Luyện tập bài này"
                action={
                    <Button size="sm" variant="primary" className="self-start">
                        Luyện tập ngay
                    </Button>
                }
            >
                {challenges.map((challenge) => (
                    <div key={challenge.id} className="flex items-center justify-between gap-2">
                        <Typography type="body-sm" color="muted" truncate>
                            {challenge.title}
                        </Typography>
                        <DifficultyChip difficulty={challenge.difficulty} />
                    </div>
                ))}
            </LabeledList>
        </div>
    ),
}

/** `icon` before the label — a visual marker to tell adjacent panels apart at a glance. */
export const WithIcon: Story = {
    render: () => (
        <div className="p-8">
            <LabeledList
                label="Thẻ ghi nhớ liên quan"
                icon={<CardsIcon aria-hidden focusable="false" className="size-5" />}
            >
                {decks.map((deck) => (
                    <Typography key={deck.id} type="body-sm" color="muted" truncate>
                        {deck.title}
                    </Typography>
                ))}
            </LabeledList>
        </div>
    ),
}

/** `children` need not be static text — here a navigating `ListBox` nests inside (the block only owns the label/spacing). */
export const WithListBox: Story = {
    render: () => (
        <div className="p-8">
            <LabeledList label="Truy cập nhanh">
                <ListBox aria-label="Truy cập nhanh" selectionMode="none" className="gap-1 p-0">
                    {shortcuts.map((shortcut) => (
                        <ListBox.Item
                            key={shortcut.id}
                            id={shortcut.id}
                            textValue={shortcut.label}
                            className="flex cursor-pointer items-center gap-3 rounded-large px-2 py-2 text-foreground outline-none data-[focus-visible=true]:ring-2 data-[focus-visible=true]:ring-accent data-[hovered=true]:bg-default"
                        >
                            <span className="min-w-0 flex-1 truncate text-sm">{shortcut.label}</span>
                        </ListBox.Item>
                    ))}
                </ListBox>
            </LabeledList>
        </div>
    ),
}

/**
 * Empty: the block itself owns no empty-state — the caller renders one into
 * `children`. Here the {@link EmptyState} primitive fills the list slot (e.g. no
 * RAG-related decks found for the lesson), while the label stays put.
 */
export const Empty: Story = {
    render: () => (
        <div className="p-8">
            <LabeledList label="Ôn tập bài này">
                <EmptyState
                    icon={<TrayIcon weight="duotone" />}
                    title="Chưa có mục nào"
                    description="Chưa tìm thấy thẻ ghi nhớ liên quan cho bài học này."
                />
            </LabeledList>
        </div>
    ),
}

/**
 * Loading: MIRROR the real layout tree — keep the real `Label` header and the
 * `gap-2` list frame, swap only each row's text for a `body-sm` `Skeleton` bar so
 * the panel doesn't jump when data arrives.
 */
export const SkeletonLoading: Story = {
    render: () => (
        <div className="p-8">
            <LabeledList label="Luyện tập bài này">
                {[0, 1, 2].map((i) => (
                    <Skeleton key={i} className="h-[14px] w-1/2 rounded" />
                ))}
            </LabeledList>
        </div>
    ),
}
