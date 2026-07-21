import type { Meta, StoryObj } from "@storybook/nextjs"
import { Typography } from "@heroui/react"
import { BookOpenIcon, CardsIcon, CodeIcon, FlameIcon, PuzzlePieceIcon } from "@phosphor-icons/react"
import { StatGridCard } from "./StatGridCard"

const meta: Meta<typeof StatGridCard> = {
    title: "Primitives/Stats/StatGridCard",
    component: StatGridCard,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof StatGridCard>

/** One cell: an icon + label row, a count, and a mini progress bar — the exact shape `WeeklyGoals` feeds in. */
const statCell = (icon: React.ReactNode, label: string, current: number, target: number) => (
    <>
        <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-2">
                {icon}
                <Typography type="body-sm">{label}</Typography>
            </span>
            <Typography type="body-xs" color="muted">{current}/{target}</Typography>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-default">
            <div
                className="h-full rounded-full bg-accent"
                style={{ width: `${Math.min(100, Math.round((current / target) * 100))}%` }}
            />
        </div>
    </>
)

const icon = (Component: typeof BookOpenIcon) => (
    <Component aria-hidden focusable="false" className="size-5 shrink-0" />
)

/** Even cell count (4) — every row forms a full pair, no cell needs to span. The baseline layout branch. */
export const Even: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <StatGridCard
                    items={[
                        { key: "lessons", content: statCell(icon(BookOpenIcon), "Nội dung", 2, 5) },
                        { key: "studyDays", content: statCell(icon(FlameIcon), "Ngày học", 4, 5) },
                        { key: "challenges", content: statCell(icon(PuzzlePieceIcon), "Challenge", 0, 3) },
                        { key: "coding", content: statCell(icon(CodeIcon), "Coding", 0, 3) },
                    ]}
                />
            </div>
        </div>
    ),
}

/** Odd cell count (5) — the last cell spans both columns so no dangling empty cell is left. */
export const OddOverflow: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <StatGridCard
                    items={[
                        { key: "lessons", content: statCell(icon(BookOpenIcon), "Nội dung", 2, 5) },
                        { key: "studyDays", content: statCell(icon(FlameIcon), "Ngày học", 4, 5) },
                        { key: "challenges", content: statCell(icon(PuzzlePieceIcon), "Challenge", 0, 3) },
                        { key: "coding", content: statCell(icon(CodeIcon), "Coding", 0, 3) },
                        { key: "flashcards", content: statCell(icon(CardsIcon), "Flashcard", 12, 20) },
                    ]}
                />
            </div>
        </div>
    ),
}

/** Single cell (degenerate odd) — spans full width alone. Smallest render exercising the odd-span path. */
export const Single: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <StatGridCard
                    items={[
                        { key: "lessons", content: statCell(icon(BookOpenIcon), "Nội dung", 2, 5) },
                    ]}
                />
            </div>
        </div>
    ),
}
