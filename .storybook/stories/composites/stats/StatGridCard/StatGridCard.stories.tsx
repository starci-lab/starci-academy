import type { Meta, StoryObj } from "@storybook/nextjs"
import { Typography } from "@heroui/react"
import { BookOpenIcon, CardsIcon, CodeIcon, FlameIcon, PuzzlePieceIcon } from "@phosphor-icons/react"
import { StatGridCard } from "@sb-components/composites/stats/StatGridCard/StatGridCard"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * COMPOSITE — a bounded surface whose cells sit in a 2-col grid, divided by thin
 * seams (the grid sibling of `SurfaceListCard`'s vertical list). The block owns
 * only the grid/border/span structure — cell content is free-form (`ReactNode`).
 *
 * ANATOMY IS PER-LEAF: each story below is its OWN leaf and carries its OWN
 * BlockAnatomy axis. Each grid cell is this frame's own internal geometry
 * (border/col-span placement, §13z) wrapping `items[].content`, an opaque
 * caller-built slot (icon + label + count + mini progress bar assembled by the
 * STORY, not this component). Neither has a dedicated sub-story to link to, so
 * the cell carries no badge (a link-less node is worse than none) — the
 * structure tab stays empty for every leaf below.
 */
const meta: Meta<typeof StatGridCard> = {
    title: "Composites/Stats/StatGridCard",
    component: StatGridCard,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof StatGridCard>

const PARTS: Array<AnatomyNode> = []

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
                <BlockAnatomy
                    name="StatGridCard"
                    tier="composite"
                    leaf="Even"
                    parts={PARTS}
                    reason="A 2-column grid frame with seam borders between cells; each Cell is a repeated slot whose content (icon, label, count, bar) is assembled freely by the caller, not a node StatGridCard itself owns."
                    states={[
                        {
                            name: "items.length = 4 (even)",
                            why: "Four cells fill the grid in two complete rows with no dangling slot at the end. This is the baseline shape the grid takes whenever the item count already divides evenly by the column count.",
                            code: `<StatGridCard
  items={[
    { key: "lessons", content: statCell(<BookOpenIcon />, "Lessons", 2, 5) },
    { key: "studyDays", content: statCell(<FlameIcon />, "Study days", 4, 5) },
  ]}
/>`,
                            render: (
                                <StatGridCard
                                    showAnatomy
                                    items={[
                                        { key: "lessons", content: statCell(icon(BookOpenIcon), "Nội dung", 2, 5) },
                                        { key: "studyDays", content: statCell(icon(FlameIcon), "Ngày học", 4, 5) },
                                        { key: "challenges", content: statCell(icon(PuzzlePieceIcon), "Challenge", 0, 3) },
                                        { key: "coding", content: statCell(icon(CodeIcon), "Coding", 0, 3) },
                                    ]}
                                />
                            ),
                        },
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
                <BlockAnatomy
                    name="StatGridCard"
                    tier="composite"
                    leaf="OddOverflow"
                    parts={PARTS}
                    states={[
                        {
                            name: "items.length = 5 (odd)",
                            why: "The fifth and last cell stretches to span both columns instead of leaving an empty slot beside it. The cell is still the same Cell node as every other one, only its width changes.",
                            code: `<StatGridCard
  items={[
    { key: "lessons", content: statCell(<BookOpenIcon />, "Lessons", 2, 5) },
    { key: "flashcards", content: statCell(<CardsIcon />, "Flashcards", 12, 20) },
  ]}
/>`,
                            render: (
                                <StatGridCard
                                    showAnatomy
                                    items={[
                                        { key: "lessons", content: statCell(icon(BookOpenIcon), "Nội dung", 2, 5) },
                                        { key: "studyDays", content: statCell(icon(FlameIcon), "Ngày học", 4, 5) },
                                        { key: "challenges", content: statCell(icon(PuzzlePieceIcon), "Challenge", 0, 3) },
                                        { key: "coding", content: statCell(icon(CodeIcon), "Coding", 0, 3) },
                                        { key: "flashcards", content: statCell(icon(CardsIcon), "Flashcard", 12, 20) },
                                    ]}
                                />
                            ),
                        },
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
                <BlockAnatomy
                    name="StatGridCard"
                    tier="composite"
                    leaf="Single"
                    parts={PARTS}
                    states={[
                        {
                            name: "items.length = 1",
                            why: "The one cell spans the full width of the grid alone, with no border-right or border-bottom left dangling against an empty neighbour. This is the smallest case that still exercises the same odd-count span rule as OddOverflow.",
                            code: "<StatGridCard items={[{ key: \"lessons\", content: statCell(<BookOpenIcon />, \"Lessons\", 2, 5) }]} />",
                            render: (
                                <StatGridCard
                                    showAnatomy
                                    items={[
                                        { key: "lessons", content: statCell(icon(BookOpenIcon), "Nội dung", 2, 5) },
                                    ]}
                                />
                            ),
                        },
                    ]}
                />
            </div>
        </div>
    ),
}
