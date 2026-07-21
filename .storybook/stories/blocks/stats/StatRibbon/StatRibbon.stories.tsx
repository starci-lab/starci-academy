import type { Meta, StoryObj } from "@storybook/nextjs"
import { StatRibbon } from "./StatRibbon"

const meta: Meta<typeof StatRibbon> = {
    title: "Primitives/Stats/StatRibbon",
    component: StatRibbon,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof StatRibbon>

/** Full 4-stat strip: row with full-height dividers on wide screens, 2-col grid on mobile. */
export const FourStats: Story = {
    render: () => (
        <div className="p-8">
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

/** Reduced to 2 stats (no rank/percentile yet) — the layout still reads cleanly. */
export const TwoStats: Story = {
    render: () => (
        <div className="p-8">
            <StatRibbon
                items={[
                    { key: "passed", value: 0, label: "Passed" },
                    { key: "xp", value: 0, label: "XP" },
                ]}
            />
        </div>
    ),
}

/** `bordered` — nested on another surface, a border delineates it (the shadow is invisible there). */
export const Bordered: Story = {
    render: () => (
        <div className="p-8">
            <div className="rounded-3xl bg-surface p-4 shadow-surface">
                <StatRibbon
                    bordered
                    items={[
                        { key: "passed", value: 12, label: "Passed" },
                        { key: "xp", value: "1,204", label: "XP" },
                        { key: "top", value: "8%", label: "Top" },
                    ]}
                />
            </div>
        </div>
    ),
}
