import type { Meta, StoryObj } from "@storybook/nextjs"
import { StatRibbon } from "@sb-components/layouts/stats/StatRibbon/StatRibbon"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

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

/** Cùng parts cho mọi leaf: N StatPair cells trong 1 Card. */
const STAT_PARTS: Array<AnatomyNode> = [
    { name: "StatPair", tier: "design", role: "1 cell giá trị+nhãn (lặp ×N), full-height divider trên desktop" },
]

/** Full 4-stat strip: row with full-height dividers on wide screens, 2-col grid on mobile. */
export const FourStats: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="StatRibbon"
                tier="primitive"
                leaf="FourStats"
                parts={STAT_PARTS}
                reason="Dải thống kê hero/profile: N StatPair trong MỘT Card — hàng ngang có divider dọc (sm+), fallback lưới 2 cột trên mobile. Card + divider sống ở đây để feature chỉ đổ `items`."
            >
                <StatRibbon
                    items={[
                        { key: "passed", value: 12, label: "Passed" },
                        { key: "xp", value: "1,204", label: "XP" },
                        { key: "top", value: "8%", label: "Top" },
                        { key: "rank", value: "#3", label: "Rank" },
                    ]}
                    showAnatomy
                />
            </BlockAnatomy>
        </div>
    ),
}

/** Reduced to 2 stats (no rank/percentile yet) — the layout still reads cleanly. */
export const TwoStats: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy name="StatRibbon" tier="primitive" leaf="TwoStats" parts={STAT_PARTS} note="Chỉ 2 items — layout vẫn gọn, không ép tối thiểu 4 cell.">
                <StatRibbon
                    items={[
                        { key: "passed", value: 0, label: "Passed" },
                        { key: "xp", value: 0, label: "XP" },
                    ]}
                    showAnatomy
                />
            </BlockAnatomy>
        </div>
    ),
}

/** `bordered` — nested on another surface, a border delineates it (the shadow is invisible there). */
export const Bordered: Story = {
    render: () => (
        <div className="p-8">
            <div className="rounded-3xl bg-surface p-4 shadow-surface">
                <BlockAnatomy name="StatRibbon" tier="primitive" leaf="Bordered" parts={STAT_PARTS} note="`bordered` đổi Card từ shadow-surface sang border (nested trên surface khác, shadow gần như vô hình).">
                    <StatRibbon
                        bordered
                        items={[
                            { key: "passed", value: 12, label: "Passed" },
                            { key: "xp", value: "1,204", label: "XP" },
                            { key: "top", value: "8%", label: "Top" },
                        ]}
                        showAnatomy
                    />
                </BlockAnatomy>
            </div>
        </div>
    ),
}
