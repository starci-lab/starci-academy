import type { Meta, StoryObj } from "@storybook/nextjs"
import { Typography } from "@heroui/react"
import { InfoTooltip } from "./InfoTooltip"

const meta: Meta<typeof InfoTooltip> = {
    title: "Primitives/Feedback/InfoTooltip",
    component: InfoTooltip,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof InfoTooltip>

/** Title + description — explain a hard term in place (title = the term, description = one plain sentence). Hover the trigger. */
export const TitleAndDescription: Story = {
    render: () => (
        <div className="p-8">
            <InfoTooltip
                title="Streak"
                description="Consecutive days studied without a break; miss one day and it resets to 0."
            >
                Day streak
            </InfoTooltip>
        </div>
    ),
}

/** Description only — when the term is clear enough, drop the title for a tighter tooltip. */
export const DescriptionOnly: Story = {
    render: () => (
        <div className="p-8">
            <InfoTooltip description="Ranked by total XP for the week, refreshed every Monday.">
                Weekly leaderboard
            </InfoTooltip>
        </div>
    ),
}

/** Custom content — a multi-line body with highlighted values, composed via `content`. */
export const CustomContent: Story = {
    render: () => (
        <div className="p-8">
            <InfoTooltip
                content={
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
                }
            >
                Task points
            </InfoTooltip>
        </div>
    ),
}

/** Placement: top (default) — trigger near the bottom edge, room above. */
export const PlacementTop: Story = {
    render: () => (
        <div className="p-8">
            <InfoTooltip placement="top" title="Top" description="Tooltip anchored to the top.">
                Top
            </InfoTooltip>
        </div>
    ),
}

/** Placement: bottom — trigger near the top edge (header), room below. */
export const PlacementBottom: Story = {
    render: () => (
        <div className="p-8">
            <InfoTooltip placement="bottom" title="Bottom" description="Tooltip anchored to the bottom.">
                Bottom
            </InfoTooltip>
        </div>
    ),
}

/** Placement: left — trigger near the right edge, room to the left. */
export const PlacementLeft: Story = {
    render: () => (
        <div className="p-8">
            <InfoTooltip placement="left" title="Left" description="Tooltip anchored to the left.">
                Left
            </InfoTooltip>
        </div>
    ),
}

/** Placement: right — trigger near the left edge, room to the right. */
export const PlacementRight: Story = {
    render: () => (
        <div className="p-8">
            <InfoTooltip placement="right" title="Right" description="Tooltip anchored to the right.">
                Right
            </InfoTooltip>
        </div>
    ),
}
