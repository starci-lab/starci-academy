import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { DeadlineCallout } from "@/components/blocks/stats/DeadlineCallout"

const meta: Meta<typeof DeadlineCallout> = {
    title: "Blocks/Stats/DeadlineCallout",
    component: DeadlineCallout,
    // NEW — pending review ("Chờ duyệt")
    tags: ["news"],
}
export default meta
type Story = StoryObj<typeof DeadlineCallout>

/** Use for the "sắp quên" urgency zone in flashcard review stats: a big count + deadline sentence on a warning-soft panel, a 7-day forecast row with one overload "spike" day, and a closing line telling the learner what to do about it. */
export const Default: Story = {
    parameters: { usage: "Use for an urgency zone that always carries a countdown (e.g. \"sắp quên\" in flashcard review stats) — count + deadline sentence on a warning-soft panel, an optional forecast row, an optional closing caption. For a flat status note with no countdown, use Callout instead." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Full — panel + forecast + caption</Label>
                <Typography type="body-sm" color="muted">
                    The forecast row shows the load for the next 7 days; Thursday is a spike day (danger fill) so the learner sees the pile-up coming before it hits.
                </Typography>
            </div>
            <DeadlineCallout
                count={12}
                title="12 thẻ sẽ tuột khỏi trí nhớ trước Thứ 5"
                hint="Ôn ngay hôm nay để giữ — để qua ngưỡng là phải học lại từ đầu."
                forecast={[
                    { label: "T4", ratio: 0.3 },
                    { label: "T5", ratio: 0.45 },
                    { label: "T6", ratio: 1, spike: true },
                    { label: "T7", ratio: 0.38 },
                    { label: "CN", ratio: 0.22 },
                    { label: "T2", ratio: 0.3 },
                    { label: "T3", ratio: 0.18 },
                ]}
                caption="Thứ 6 dồn 34 thẻ — làm bớt 15 hôm nay để san phẳng."
            />
        </div>
    ),
}

/** Use to check the panel alone still reads as a complete callout when there is no lookahead data yet — forecast and caption are the only optional slots; drop both rather than rendering an empty row. */
export const PanelOnly: Story = {
    parameters: { usage: "Use when there is no lookahead data yet — drop both forecast and caption rather than rendering an empty row; the panel (count + sentence + hint) still reads as a complete callout on its own." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>No forecast data</Label>
                <Typography type="body-sm" color="muted">
                    Not enough review history yet to project a 7-day forecast — the panel alone is still a complete, actionable callout.
                </Typography>
            </div>
            <DeadlineCallout
                count={3}
                title="3 thẻ sẽ tuột khỏi trí nhớ trước Thứ 3"
                hint="Ôn ngay hôm nay để giữ."
            />
        </div>
    ),
}
