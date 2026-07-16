import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { StatRibbon } from "@/components/blocks/stats/StatRibbon"

const meta: Meta<typeof StatRibbon> = {
    title: "Blocks/Stats/StatRibbon",
    component: StatRibbon,
    // NEW — pending review ("Chờ duyệt")
    tags: ["news"],
}
export default meta
type Story = StoryObj<typeof StatRibbon>

/** Use for the headline stat strip at the top of a profile tab (Challenges / Skills): 4 StatPairs in ONE card split by vertical dividers on wide screens, a 2-column grid on mobile. */
export const Default: Story = {
    parameters: { usage: "Use for the headline stat strip at the top of a profile tab (Challenges / Skills): 4 StatPairs in one card split by vertical dividers on wide screens, a 2-column grid on mobile." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Four stats</Label>
                <Typography type="body-sm" color="muted">
                    The profile Challenges / Skills header — passed count, XP, top percentile, rank — as one bordered ribbon.
                </Typography>
            </div>
            <StatRibbon
                items={[
                    { key: "passed", value: 12, label: "Passed" },
                    { key: "xp", value: "1,204", label: "XP" },
                    { key: "top", value: "8%", label: "Top" },
                    { key: "rank", value: "#3", label: "Rank" },
                ]}
            />
        </div>
    ),
}

/** Use when the viewer is unranked (no solved work yet): the ribbon holds only the stats that exist — the dividers and equal cells still lay out cleanly with 2 items. */
export const FewStats: Story = {
    parameters: { usage: "Use when the viewer is unranked (no solved work yet): the ribbon holds only the stats that exist — the dividers and equal cells still lay out cleanly with 2 items." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Two stats (unranked)</Label>
                <Typography type="body-sm" color="muted">
                    Rank / percentile hide until the viewer has passed work, so the ribbon renders just the two known stats.
                </Typography>
            </div>
            <StatRibbon
                items={[
                    { key: "passed", value: 0, label: "Passed" },
                    { key: "xp", value: 0, label: "XP" },
                ]}
            />
        </div>
    ),
}
