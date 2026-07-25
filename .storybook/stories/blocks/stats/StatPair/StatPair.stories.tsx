import type { Meta, StoryObj } from "@storybook/nextjs"
import { Card } from "@heroui/react"
import { StatPair } from "@sb-components/layouts/stats/StatPair/StatPair"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta<typeof StatPair> = {
    title: "Primitives/Stats/StatPair",
    component: StatPair,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof StatPair>

/** The four stats reused across the layout stories below. */
const STATS = [
    { value: "1,204", label: "Followers" },
    { value: "87%", label: "Completion rate" },
    { value: "12", label: "Enrolled courses" },
    { value: "4.9", label: "Average rating" },
]

/**
 * ANATOMY IS PER-LEAF: every story below wraps its render in its OWN BlockAnatomy
 * axis. `StatPair` renders its `value`/`label` `Typography` DIRECTLY itself
 * (canon granularity rule — a component that renders `Typography` inline gets
 * its OWN tagged node), so both are direct parts. Frameless — the surrounding
 * `Card`/divider/grid belongs to the CALLER, not this primitive.
 */
const STAT_PARTS: Array<AnatomyNode> = [
    { name: "Typography.Value", tier: "primitive", role: "số liệu chính, semibold" },
    { name: "Typography.Label", tier: "primitive", role: "chú thích muted dưới value" },
]

export const Single: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="StatPair"
                tier="primitive"
                leaf="Single"
                parts={STAT_PARTS}
                reason="Cặp value+label xếp dọc, không khung riêng — để card/hàng stat bên ngoài quyết định surface + divider."
            >
                <StatPair value="1,204" label="Followers" showAnatomy />
            </BlockAnatomy>
        </div>
    ),
}

export const Row: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="StatPair"
                tier="primitive"
                leaf="Row"
                parts={STAT_PARTS}
                note="4 StatPair trong 1 Card chia cột bằng divide-x — Card/divider là của caller, mỗi StatPair vẫn cùng 2 node."
            >
                {/* Parent owns the card + full-height vertical dividers; StatPair is frameless. */}
                <Card variant="default" className="w-fit">
                    <div className="flex items-stretch divide-x divide-default">
                        {STATS.map((stat) => (
                            <div key={stat.label} className="px-6 first:pl-0 last:pr-0">
                                <StatPair value={stat.value} label={stat.label} showAnatomy />
                            </div>
                        ))}
                    </div>
                </Card>
            </BlockAnatomy>
        </div>
    ),
}

export const Grid: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="StatPair"
                tier="primitive"
                leaf="Grid"
                parts={STAT_PARTS}
                note="Cùng 4 stat, đổi sang grid 2 cột (widget hẹp) — vẫn cùng composition mỗi StatPair."
            >
                {/* Narrow width (sidebar/widget): the same stats fall into a 2-col grid. */}
                <Card variant="default" className="w-[420px]">
                    <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                        {STATS.map((stat) => (
                            <StatPair key={stat.label} value={stat.value} label={stat.label} showAnatomy />
                        ))}
                    </div>
                </Card>
            </BlockAnatomy>
        </div>
    ),
}
