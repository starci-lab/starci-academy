import type { Meta, StoryObj } from "@storybook/nextjs"
import { MetricCard } from "@sb-components/blocks/stats/MetricCard/MetricCard"
import { BlockAnatomy, type AnatomyNode } from "@sb-components/blocks/layout/BlockAnatomy/BlockAnatomy"

const meta: Meta<typeof MetricCard> = {
    title: "Primitives/Stats/MetricCard",
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
        tier: "primitive",
        role: "khung card (border + bg + radius)",
        children: [
            { name: "Value", tier: "primitive", role: "con số nổi bật (h4 semibold)" },
            { name: "Label", tier: "primitive", role: "mô tả — dòng NỔI BẬT, foreground" },
            { name: "Hint", tier: "primitive", role: "ghi chú phụ — dòng LẶNG, muted body-xs" },
        ],
    },
]
const NO_HINT_PARTS: Array<AnatomyNode> = [
    {
        name: "SectionCard",
        tier: "primitive",
        role: "khung card (border + bg + radius)",
        children: [
            { name: "Value", tier: "primitive", role: "con số nổi bật (h4 semibold)" },
            { name: "Label", tier: "primitive", role: "mô tả — dòng NỔI BẬT, foreground" },
        ],
    },
]

export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy name="MetricCard" tier="primitive" leaf="Default" parts={FULL_PARTS}>
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
            <BlockAnatomy name="MetricCard" tier="primitive" leaf="WithHint" parts={FULL_PARTS}>
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
                tier="primitive"
                leaf="WithoutHint"
                parts={NO_HINT_PARTS}
                note="Không truyền `hint` — SectionCard chỉ còn Value + Label."
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
            <BlockAnatomy name="MetricCard" tier="primitive" leaf="LongText" parts={FULL_PARTS}>
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
