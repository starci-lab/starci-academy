import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { expect, screen, userEvent, waitFor, within } from "storybook/test"
import { InfoTooltip } from "@/components/blocks/feedback/InfoTooltip"

/**
 * `InfoTooltip` — the ONLY way to attach a one-line explanation to a tricky term (rank,
 * tier, streak, KPI…). Shows on HOVER/FOCUS, with STATIC read-once content. Do NOT use it
 * for a click-to-open-panel affordance (→ `Popover`) — hover isn't reachable on touch.
 */
const meta: Meta<typeof InfoTooltip> = {
    title: "Core/Overlays/InfoTooltip",
    component: InfoTooltip,
}

export default meta

type Story = StoryObj<typeof InfoTooltip>

/** Use when you need to explain a tricky term inline (title = the term, description = one easy-to-understand sentence). */
export const Default: Story = {
    args: {
        title: "Streak",
        description: "Consecutive days studied without a break; miss one day and it resets to 0.",
        children: <span className="cursor-help underline decoration-dotted">Day streak</span>,
    },
    parameters: {
        usage: "Explain a tricky term (streak/rank/tier) inline — shows on hover/focus. NOT for a click affordance (→ Popover).",
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await userEvent.hover(canvas.getByText("Day streak"))
        await waitFor(() =>
            expect(
                screen.getByText("Consecutive days studied without a break; miss one day and it resets to 0."),
            ).toBeInTheDocument(),
        )
    },
}

/** Use when the term is already clear and only needs a one-line description — drop the title to keep it compact. */
export const DescriptionOnly: Story = {
    args: {
        description: "Ranked by total XP for the week, refreshed every Monday.",
        children: <span className="cursor-help underline decoration-dotted">Weekly leaderboard</span>,
    },
    parameters: {
        usage: "When the term is already clear and only needs a one-line description — drop the title to keep it compact.",
    },
}

/** Use when you need a richer body (multiple lines, highlighted values) — pass `content` and compose it yourself instead of title/description. */
export const Composed: Story = {
    args: {
        children: <span className="cursor-help underline decoration-dotted">Task points</span>,
        content: (
            <div className="flex flex-col gap-1">
                <Typography type="body-sm">
                    Task points
                </Typography>
                <div className="flex items-center justify-between gap-4">
                    <Typography type="body-xs" color="muted">Coding exercise</Typography>
                    <Typography type="body-xs">+10</Typography>
                </div>
                <div className="flex items-center justify-between gap-4">
                    <Typography type="body-xs" color="muted">Mock interview</Typography>
                    <Typography type="body-xs">+25</Typography>
                </div>
            </div>
        ),
    },
    parameters: {
        usage: "When you need a richer body (multiple lines, highlighted values) — pass `content` and compose it yourself instead of title/description.",
    },
}

/** Choose the anchor direction based on the space around the trigger so the tooltip doesn't overflow the screen edge. */
export const Placements: Story = {
    parameters: {
        usage: "4 anchor directions (top/bottom/left/right) — choose based on the space around the trigger so the tooltip doesn't overflow the edge.",
    },
    render: () => (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Top</Label>
                    <Typography type="body-sm" color="muted">
                        Default — the trigger sits near the bottom edge, with space above.
                    </Typography>
                </div>
                <InfoTooltip
                    placement="top"
                    title="Top"
                    description="Tooltip anchored to the top."
                >
                    <span className="cursor-help underline decoration-dotted">Top</span>
                </InfoTooltip>
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Bottom</Label>
                    <Typography type="body-sm" color="muted">
                        The trigger sits near the top edge (header/top of page), with space below.
                    </Typography>
                </div>
                <InfoTooltip
                    placement="bottom"
                    title="Bottom"
                    description="Tooltip anchored to the bottom."
                >
                    <span className="cursor-help underline decoration-dotted">Bottom</span>
                </InfoTooltip>
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Left</Label>
                    <Typography type="body-sm" color="muted">
                        The trigger sits near the right edge, with space on the left.
                    </Typography>
                </div>
                <InfoTooltip
                    placement="left"
                    title="Left"
                    description="Tooltip anchored to the left."
                >
                    <span className="cursor-help underline decoration-dotted">Left</span>
                </InfoTooltip>
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Right</Label>
                    <Typography type="body-sm" color="muted">
                        The trigger sits near the left edge, with space on the right.
                    </Typography>
                </div>
                <InfoTooltip
                    placement="right"
                    title="Right"
                    description="Tooltip anchored to the right."
                >
                    <span className="cursor-help underline decoration-dotted">Right</span>
                </InfoTooltip>
            </div>
        </div>
    ),
}
