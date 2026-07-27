import type { Meta, StoryObj } from "@storybook/nextjs"
import { StatRibbon } from "@sb-components/composites/stats/StatRibbon/StatRibbon"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta<typeof StatRibbon> = {
    title: "Composites/Stats/StatRibbon",
    component: StatRibbon,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof StatRibbon>

/** Cùng parts cho mọi leaf: N StatPair cells trong 1 Card. */
const STAT_PARTS: Array<AnatomyNode> = [
    { name: "StatPair", tier: "design", role: "one value+label cell, repeated ×N, with a full-height divider between cells on desktop" },
]

/** Full 4-stat strip: row with full-height dividers on wide screens, 2-col grid on mobile. */
export const FourStats: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="StatRibbon"
                tier="composite"
                leaf="FourStats"
                parts={STAT_PARTS}
                reason="The hero/profile stat strip: N StatPair cells inside ONE Card, a row with vertical dividers from `sm` up, falling back to a 2-column grid on mobile. The Card and the dividers live here so a feature only ever has to hand this frame its `items`."
                states={[
                    {
                        name: "items has 4 entries",
                        why: "Four StatPair cells sit in a row with full-height dividers between them on wide screens, folding into a 2-column grid on mobile. This is the full shape used when the profile/hero panel has all four numbers to show at once.",
                        code: `<StatRibbon
  items={[
    { key: "passed", value: 12, label: "Passed" },
    { key: "xp", value: "1,204", label: "XP" },
    { key: "top", value: "8%", label: "Top" },
    { key: "rank", value: "#3", label: "Rank" },
  ]}
/>`,
                        render: (
                            <StatRibbon
                                items={[
                                    { key: "passed", value: 12, label: "Passed" },
                                    { key: "xp", value: "1,204", label: "XP" },
                                    { key: "top", value: "8%", label: "Top" },
                                    { key: "rank", value: "#3", label: "Rank" },
                                ]}
                                showAnatomy
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Reduced to 2 stats (no rank/percentile yet) — the layout still reads cleanly. */
export const TwoStats: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="StatRibbon"
                tier="composite"
                leaf="TwoStats"
                parts={STAT_PARTS}
                states={[
                    {
                        name: "items has 2 entries",
                        why: "Only two StatPair cells render, with one divider between them; the frame doesn't stretch or pad to fill a phantom minimum count. This is for a learner whose rank and percentile haven't been computed yet, so the strip only carries what's actually known.",
                        code: "<StatRibbon items={[{ key: \"passed\", value: 0, label: \"Passed\" }, { key: \"xp\", value: 0, label: \"XP\" }]} />",
                        render: (
                            <StatRibbon
                                items={[
                                    { key: "passed", value: 0, label: "Passed" },
                                    { key: "xp", value: 0, label: "XP" },
                                ]}
                                showAnatomy
                            />
                        ),
                    },
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
                <BlockAnatomy
                    name="StatRibbon"
                    tier="composite"
                    leaf="Bordered"
                    parts={STAT_PARTS}
                    states={[
                        {
                            name: "bordered = true",
                            why: "The Card switches from `shadow-surface` to a border. This is for a ribbon nested on top of another surface, where a second stacked shadow would be nearly invisible and a border reads the edge instead.",
                            code: `<StatRibbon
  bordered
  items={[
    { key: "passed", value: 12, label: "Passed" },
    { key: "xp", value: "1,204", label: "XP" },
    { key: "top", value: "8%", label: "Top" },
  ]}
/>`,
                            render: (
                                <StatRibbon
                                    bordered
                                    items={[
                                        { key: "passed", value: 12, label: "Passed" },
                                        { key: "xp", value: "1,204", label: "XP" },
                                        { key: "top", value: "8%", label: "Top" },
                                    ]}
                                    showAnatomy
                                />
                            ),
                        },
                    ]}
                />
            </div>
        </div>
    ),
}
