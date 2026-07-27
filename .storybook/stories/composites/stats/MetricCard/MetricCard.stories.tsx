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

// SectionCard (frame) ⊃ Value (h4 bold) · Label (body-sm, prominent line) · Hint (body-xs muted, optional).
const FULL_PARTS: Array<AnatomyNode> = [
    {
        name: "SectionCard",
        tier: "composite",
        role: "khung card (border + bg + radius)",
        children: [
            { name: "Value", tier: "composite", role: "con số nổi bật (h4 semibold)" },
            { name: "Label", tier: "composite", role: "mô tả — dòng NỔI BẬT, foreground" },
            { name: "Hint", tier: "composite", role: "ghi chú phụ — dòng LẶNG, muted body-xs" },
        ],
    },
]
const NO_HINT_PARTS: Array<AnatomyNode> = [
    {
        name: "SectionCard",
        tier: "composite",
        role: "khung card (border + bg + radius)",
        children: [
            { name: "Value", tier: "composite", role: "con số nổi bật (h4 semibold)" },
            { name: "Label", tier: "composite", role: "mô tả — dòng NỔI BẬT, foreground" },
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
                code={"<MetricCard value=\"1,204\" label=\"Total enrolled students\" hint=\"Updated daily\" />"}
            >
                <MetricCard
                    showAnatomy
                    value="1,204"
                    label="Total enrolled students"
                    hint="Updated daily"
                />
            </BlockAnatomy>
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
                code={"<MetricCard value=\"98%\" label=\"Course completion rate\" hint=\"Vs. last week\" />"}
            >
                <MetricCard
                    showAnatomy
                    value="98%"
                    label="Course completion rate"
                    hint="Vs. last week"
                />
            </BlockAnatomy>
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
                note="Không truyền `hint` — SectionCard chỉ còn Value + Label."
                code={"<MetricCard value=\"42\" label=\"Certificates issued\" />"}
            >
                <MetricCard showAnatomy value="42" label="Certificates issued" />
            </BlockAnatomy>
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
                code={"<MetricCard value=\"3,750\" label=\"Total assignment submissions graded this month\" hint=\"Includes submissions from both trial and paid students\" />"}
            >
                <MetricCard
                    showAnatomy
                    value="3,750"
                    label="Total assignment submissions graded this month"
                    hint="Includes submissions from both trial and paid students"
                />
            </BlockAnatomy>
        </div>
    ),
}
