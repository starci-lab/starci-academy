import type { Meta, StoryObj } from "@storybook/nextjs"
import { MetricCard } from "@sb-components/composites/stats/MetricCard/MetricCard"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta<typeof MetricCard> = {
    title: "Composites/Stats/MetricCard",
    component: MetricCard,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof MetricCard>

// SectionCard (frame) contains Value (h4 bold), Label (body-sm, the prominent line), and an
// optional Hint (body-xs muted).
// The local `SectionCard` helper (inlined in MetricCard.tsx, a TODO stand-in for the real
// port) renders straight HeroUI `Card` — so the frame node is named for THAT real import,
// not the placeholder helper's own name.
const FULL_PARTS: Array<AnatomyNode> = [
    {
        name: "Card",
        tier: "heroui",
        role: "the card frame, giving the value its border, background fill and rounded corners",
        children: [
            { name: "Typography", tier: "atom", role: "the highlighted number, rendered semibold at h4 size", storyId: "atoms-text-typography-typography--plain" },
            { name: "Typography", tier: "atom", role: "the description underneath, the prominent foreground line", storyId: "atoms-text-typography-typography--plain" },
            { name: "Typography", tier: "atom", role: "a quiet supplementary note, muted and one size smaller than the label", storyId: "atoms-text-typography-typography--plain" },
        ],
    },
]
const NO_HINT_PARTS: Array<AnatomyNode> = [
    {
        name: "Card",
        tier: "heroui",
        role: "the card frame, giving the value its border, background fill and rounded corners",
        children: [
            { name: "Typography", tier: "atom", role: "the highlighted number, rendered semibold at h4 size", storyId: "atoms-text-typography-typography--plain" },
            { name: "Typography", tier: "atom", role: "the description underneath, the prominent foreground line", storyId: "atoms-text-typography-typography--plain" },
        ],
    },
]

export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="MetricCard"
                tier="composite"
                leaf="Default"
                parts={FULL_PARTS}
                reason="A standalone, framed presentation of one data point: a value, a label describing it, and an optional hint. Every part arrives through props, so the card never invents a number or a description of its own."
                states={[
                    {
                        name: "value, label, hint all set",
                        why: "All three parts render: the value large at the top, the label right below it, and the hint as a small muted line under that. This is the full shape, the one every other leaf below narrows down from.",
                        code: "<MetricCard value=\"1,204\" label=\"Total enrolled students\" hint=\"Updated daily\" />",
                        render: (
                            <MetricCard
                                showAnatomy
                                value="1,204"
                                label="Total enrolled students"
                                hint="Updated daily"
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

export const WithHint: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="MetricCard"
                tier="composite"
                leaf="WithHint"
                parts={FULL_PARTS}
                states={[
                    {
                        name: "value, label, hint all set",
                        why: "The hint line reads as context for the value rather than a caveat, since a completion rate benefits from knowing what it's compared against. The tree stays identical to `Default`, only the wording of the three strings changes.",
                        code: "<MetricCard value=\"98%\" label=\"Course completion rate\" hint=\"Vs. last week\" />",
                        render: (
                            <MetricCard
                                showAnatomy
                                value="98%"
                                label="Course completion rate"
                                hint="Vs. last week"
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** `hint` is the only optional slot — omit it when value + label already explain themselves. */
export const WithoutHint: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="MetricCard"
                tier="composite"
                leaf="WithoutHint"
                parts={NO_HINT_PARTS}
                states={[
                    {
                        name: "hint not passed",
                        why: "The `Hint` node disappears entirely and the card ends right after the label, one node fewer than `Default`. A certificate count needs no extra caveat, so the card doesn't reserve empty space for one.",
                        code: "<MetricCard value=\"42\" label=\"Certificates issued\" />",
                        render: <MetricCard showAnatomy value="42" label="Certificates issued" />,
                    },
                ]}
            />
        </div>
    ),
}

/** Long label + hint — the text wraps cleanly inside the frame. */
export const LongText: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="MetricCard"
                tier="composite"
                leaf="LongText"
                parts={FULL_PARTS}
                states={[
                    {
                        name: "label and hint both long sentences",
                        why: "The label and hint wrap onto multiple lines instead of truncating or overflowing the frame, so the tree stays the same shape as `Default` at any text length. A metric card has to hold a real sentence, not just a short tag, without breaking its layout.",
                        code: "<MetricCard value=\"3,750\" label=\"Total assignment submissions graded this month\" hint=\"Includes submissions from both trial and paid students\" />",
                        render: (
                            <MetricCard
                                showAnatomy
                                value="3,750"
                                label="Total assignment submissions graded this month"
                                hint="Includes submissions from both trial and paid students"
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
