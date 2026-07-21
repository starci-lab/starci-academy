import type { Meta, StoryObj } from "@storybook/nextjs"
import { Typography } from "@heroui/react"
import { BookOpenIcon, CardsIcon, CodeIcon, FlameIcon, PuzzlePieceIcon } from "@phosphor-icons/react"
import { StatGridCard } from "@/components/blocks/stats/StatGridCard"
import { Gallery, Variant } from "../../../../story-kit"

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
 * Toàn bộ ma trận đếm-ô của StatGridCard: số lẻ (ô cuối span 2 cột) và số chẵn
 * (mọi hàng đủ cặp). Dùng để tra khi nào cần lo về ô-lẻ-dôi và khi nào không.
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="5 ô (lẻ — ô cuối span full width)"
                hint="Áp đầu: WeeklyGoals' 5 weekly-KPI cells (thầy 2026-07-17: “render kiểu grid 2x3 được không, cho gọn”). Dùng cho stat cell nằm cạnh nhau (weekly-goal KPI breakdown) thay vì list một cột dài — sibling grid của SurfaceListCard. Cell chia nhau bằng đường viền mỏng (không dùng gap) để card vẫn là MỘT khối liền, không rời rạc. Số ô LẺ (5 ở đây) không bao giờ để trống một ô — ô cuối tự span 2 cột."
            >
                <div className="max-w-md">
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
            </Variant>
            <Variant
                label="4 ô (chẵn — mọi hàng đủ cặp)"
                hint="Số ô chia hết cho 2 nên không có ô dôi cần lấp — mọi hàng tự ghép cặp đủ, không ô nào phải span."
            >
                <div className="max-w-md">
                    <StatGridCard
                        items={[
                            { key: "lessons", content: statCell(<BookOpenIcon aria-hidden focusable="false" className="size-5 shrink-0" />, "Nội dung", 2, 5) },
                            { key: "studyDays", content: statCell(<FlameIcon aria-hidden focusable="false" className="size-5 shrink-0" />, "Ngày học", 4, 5) },
                            { key: "challenges", content: statCell(<PuzzlePieceIcon aria-hidden focusable="false" className="size-5 shrink-0" />, "Challenge", 0, 3) },
                            { key: "coding", content: statCell(<CodeIcon aria-hidden focusable="false" className="size-5 shrink-0" />, "Coding", 0, 3) },
                        ]}
                    />
                </div>
            </Variant>
        </Gallery>
    ),
    parameters: {
        usage:
            "Toàn bộ ma trận đếm-ô của StatGridCard: số lẻ (ô cuối tự span 2 cột, không để trống) và số chẵn " +
            "(mọi hàng đủ cặp, không ô nào cần span). Dùng cho stat cell cạnh nhau (weekly-goal KPI breakdown) " +
            "thay vì list một cột dài — sibling grid của SurfaceListCard, chia ô bằng viền mỏng để card vẫn " +
            "là một khối liền.",
    },
}
