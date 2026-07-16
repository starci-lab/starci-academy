import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { BookOpenIcon, CardsIcon, CodeIcon, FlameIcon, PuzzlePieceIcon } from "@phosphor-icons/react"
import { StatGridCard } from "@/components/blocks/stats/StatGridCard"

const meta: Meta<typeof StatGridCard> = {
    title: "Blocks/Stats/StatGridCard",
    component: StatGridCard,
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

/**
 * Use for compact stat cells side-by-side (a weekly-goal KPI breakdown) instead of a tall single-column list —
 * the grid sibling of `SurfaceListCard`. Cells are divided by thin border seams (not `gap`), so the card stays
 * ONE continuous bordered block instead of floating pieces. An ODD item count (5 here) never leaves a dangling
 * empty cell — the last cell spans both columns automatically.
 */
export const Default: Story = {
    parameters: {
        usage:
            "Use for compact stat cells side-by-side (a weekly-goal KPI breakdown) instead of a tall " +
            "single-column list — the grid sibling of SurfaceListCard. Cells are divided by thin border seams " +
            "(not gap), so the card stays one continuous bordered block instead of floating pieces. An odd item " +
            "count (5 here) never leaves a dangling empty cell — the last cell spans both columns automatically.",
    },
    render: () => (
        <div className="flex max-w-md flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>5 cells (odd — last spans full width)</Label>
                <Typography type="body-sm" color="muted">
                    Áp đầu: WeeklyGoals&apos; 5 weekly-KPI cells (thầy 2026-07-17: &quot;render kiểu grid 2x3 được không, cho gọn&quot;).
                </Typography>
            </div>
            <StatGridCard
                items={[
                    { key: "lessons", content: statCell(<BookOpenIcon aria-hidden focusable="false" className="size-5 shrink-0" />, "Nội dung", 2, 5) },
                    { key: "studyDays", content: statCell(<FlameIcon aria-hidden focusable="false" className="size-5 shrink-0" />, "Ngày học", 4, 5) },
                    { key: "challenges", content: statCell(<PuzzlePieceIcon aria-hidden focusable="false" className="size-5 shrink-0" />, "Challenge", 0, 3) },
                    { key: "coding", content: statCell(<CodeIcon aria-hidden focusable="false" className="size-5 shrink-0" />, "Coding", 0, 3) },
                    { key: "flashcards", content: statCell(<CardsIcon aria-hidden focusable="false" className="size-5 shrink-0" />, "Flashcard", 12, 20) },
                ]}
            />
        </div>
    ),
}

/** An EVEN item count fills the grid exactly — no spanning cell needed. */
export const EvenCount: Story = {
    parameters: {
        usage: "An even item count (4 here) fills the 2-col grid exactly — no cell needs to span, every row is a full pair.",
    },
    render: () => (
        <div className="flex max-w-md flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>4 cells (even — every row is a full pair)</Label>
                <Typography type="body-sm" color="muted">
                    No dangling cell to fill when the count divides evenly by 2 — every row pairs up.
                </Typography>
            </div>
            <StatGridCard
                items={[
                    { key: "lessons", content: statCell(<BookOpenIcon aria-hidden focusable="false" className="size-5 shrink-0" />, "Nội dung", 2, 5) },
                    { key: "studyDays", content: statCell(<FlameIcon aria-hidden focusable="false" className="size-5 shrink-0" />, "Ngày học", 4, 5) },
                    { key: "challenges", content: statCell(<PuzzlePieceIcon aria-hidden focusable="false" className="size-5 shrink-0" />, "Challenge", 0, 3) },
                    { key: "coding", content: statCell(<CodeIcon aria-hidden focusable="false" className="size-5 shrink-0" />, "Coding", 0, 3) },
                ]}
            />
        </div>
    ),
}
