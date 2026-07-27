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
 * BlockAnatomy axis. `items[].content` is an opaque caller-built slot (icon +
 * label + count + mini progress bar assembled by the STORY, not this
 * component) so it stays collapsed as ONE `Cell` node, never drilled into.
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

const CELL: AnatomyNode = { name: "Cell", tier: "composite", role: "1 ô lưới (lặp ×N, nội dung tự do); ô cuối span 2 cột khi tổng số lẻ" }
const PARTS: Array<AnatomyNode> = [CELL]

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
                    reason="Khung grid 2 cột với seam border; mỗi Cell là 1 ô lặp, nội dung (icon+label+count+bar) là slot tự do do story lắp, không phải node của StatGridCard."
                    code={`<StatGridCard
  items={[
    { key: "lessons", content: statCell(<BookOpenIcon />, "Lessons", 2, 5) },
    { key: "studyDays", content: statCell(<FlameIcon />, "Study days", 4, 5) },
  ]}
/>`}
                >
                    <StatGridCard
                        showAnatomy
                        items={[
                            { key: "lessons", content: statCell(icon(BookOpenIcon), "Nội dung", 2, 5) },
                            { key: "studyDays", content: statCell(icon(FlameIcon), "Ngày học", 4, 5) },
                            { key: "challenges", content: statCell(icon(PuzzlePieceIcon), "Challenge", 0, 3) },
                            { key: "coding", content: statCell(icon(CodeIcon), "Coding", 0, 3) },
                        ]}
                    />
                </BlockAnatomy>
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
                    note="Tổng số lẻ (5) → Cell cuối tự `col-span-2`, không để trống 1 ô — vẫn cùng 1 loại node Cell."
                    code={`<StatGridCard
  items={[
    { key: "lessons", content: statCell(<BookOpenIcon />, "Lessons", 2, 5) },
    { key: "flashcards", content: statCell(<CardsIcon />, "Flashcards", 12, 20) },
  ]}
/>`}
                >
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
                </BlockAnatomy>
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
                    note="1 item (lẻ suy biến) → Cell duy nhất span full-width, không border-r/b thừa."
                    code={"<StatGridCard items={[{ key: \"lessons\", content: statCell(<BookOpenIcon />, \"Lessons\", 2, 5) }]} />"}
                >
                    <StatGridCard
                        showAnatomy
                        items={[
                            { key: "lessons", content: statCell(icon(BookOpenIcon), "Nội dung", 2, 5) },
                        ]}
                    />
                </BlockAnatomy>
            </div>
        </div>
    ),
}
