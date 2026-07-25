import type { Meta, StoryObj } from "@storybook/nextjs"
import { SegmentBar } from "@sb-components/layouts/stats/SegmentBar/SegmentBar"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta<typeof SegmentBar> = {
    title: "Layouts/Stats/SegmentBar",
    component: SegmentBar,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof SegmentBar>

// leaf có legend (Proportional/WithMax/ManyGroups/Empty): track + legend, không caption.
const BAR_LEGEND_PARTS: Array<AnatomyNode> = [
    { name: "Bar", tier: "primitive", role: "track chia slice theo tỉ lệ (role=img)" },
    { name: "Legend", tier: "primitive", role: "dot màu + label + count dưới track" },
]

// leaf HideLegend: chỉ còn track, legend bị ẩn hẳn.
const BAR_ONLY_PARTS: Array<AnatomyNode> = [
    { name: "Bar", tier: "primitive", role: "track chia slice theo tỉ lệ (role=img)" },
]

// leaf InlineLabels: có cả legend + caption (câu takeaway muted dưới cùng).
const BAR_LEGEND_CAPTION_PARTS: Array<AnatomyNode> = [
    { name: "Bar", tier: "primitive", role: "track dạng ladder dày, in %+label ngay trên dải" },
    { name: "Legend", tier: "primitive", role: "dot màu + label dưới track (không suffix count, đã in trên dải)" },
    { name: "Caption", tier: "primitive", role: "câu takeaway muted, tuỳ chọn" },
]

/** No shared total — slices always fill 100% as shares of each other. */
export const Proportional: Story = {
    render: () => (
        <div className="p-8">
            <div className="w-80">
                <BlockAnatomy name="SegmentBar" tier="primitive" leaf="Proportional" parts={BAR_LEGEND_PARTS}>
                    <SegmentBar
                        ariaLabel="Distribution of answers by difficulty"
                        showAnatomy
                        segments={[
                            { key: "easy", label: "Easy", value: 12 },
                            { key: "medium", label: "Medium", value: 20 },
                            { key: "hard", label: "Hard", value: 8 },
                        ]}
                    />
                </BlockAnatomy>
            </div>
        </div>
    ),
}

/** `max` set → widths are `value / max`, leaving an empty remainder for true progress. */
export const WithMax: Story = {
    render: () => (
        <div className="p-8">
            <div className="w-80">
                <BlockAnatomy name="SegmentBar" tier="primitive" leaf="WithMax" parts={BAR_LEGEND_PARTS} note="max set → track chừa phần dư (progress thật), cùng composition với Proportional.">
                    <SegmentBar
                        ariaLabel="Lesson completion progress"
                        max={50}
                        showAnatomy
                        segments={[
                            { key: "done", label: "Completed", value: 18, color: "var(--success)" },
                            { key: "in-progress", label: "In progress", value: 5, color: "var(--warning)" },
                        ]}
                    />
                </BlockAnatomy>
            </div>
        </div>
    ),
}

/** `hideLegend` — the bar is a quick summary inside a block that already has its own legend. */
export const HideLegend: Story = {
    render: () => (
        <div className="p-8">
            <div className="w-80">
                <BlockAnatomy name="SegmentBar" tier="primitive" leaf="HideLegend" parts={BAR_ONLY_PARTS} note="hideLegend → chỉ còn track, không render Legend.">
                    <SegmentBar
                        hideLegend
                        ariaLabel="Ratio of correct and incorrect answers"
                        showAnatomy
                        segments={[
                            { key: "correct", label: "Correct", value: 34, color: "var(--success)" },
                            { key: "incorrect", label: "Incorrect", value: 6, color: "var(--danger)" },
                        ]}
                    />
                </BlockAnatomy>
            </div>
        </div>
    ),
}

/** Many groups — the legend wraps neatly instead of overflowing. */
export const ManyGroups: Story = {
    render: () => (
        <div className="p-8">
            <div className="w-80">
                <BlockAnatomy name="SegmentBar" tier="primitive" leaf="ManyGroups" parts={BAR_LEGEND_PARTS} note="Nhiều slice hơn — legend wrap, cùng composition với Proportional.">
                    <SegmentBar
                        ariaLabel="Distribution of assessed skills"
                        showAnatomy
                        segments={[
                            { key: "frontend", label: "Frontend", value: 9 },
                            { key: "backend", label: "Backend", value: 14 },
                            { key: "database", label: "Database", value: 6 },
                            { key: "devops", label: "DevOps", value: 4 },
                            { key: "testing", label: "Testing", value: 7 },
                        ]}
                    />
                </BlockAnatomy>
            </div>
        </div>
    ),
}

/** `inlineLabels` — a thick ladder strip; each band prints its own label + %, plus a closing caption. */
export const InlineLabels: Story = {
    render: () => (
        <div className="p-8">
            <div className="w-80">
                <BlockAnatomy name="SegmentBar" tier="primitive" leaf="InlineLabels" parts={BAR_LEGEND_CAPTION_PARTS} note="inlineLabels → track dày tự in label+%; caption thêm câu takeaway muted dưới cùng.">
                    <SegmentBar
                        inlineLabels
                        ariaLabel="Card maturity breakdown"
                        caption="Only 8% of cards have matured (retained over a long gap) — that's the real progress, not the raw card count seen."
                        showAnatomy
                        segments={[
                            { key: "non", label: "Non", value: 52, color: "var(--default)" },
                            { key: "maturing", label: "Maturing", value: 40, color: "var(--warning)" },
                            { key: "mature", label: "Mature", value: 8, color: "var(--success)" },
                        ]}
                    />
                </BlockAnatomy>
            </div>
        </div>
    ),
}

/** No data yet (all zero) — the bar shows an empty track instead of dividing by zero. */
export const Empty: Story = {
    render: () => (
        <div className="p-8">
            <div className="w-80">
                <BlockAnatomy name="SegmentBar" tier="primitive" leaf="Empty" parts={BAR_LEGEND_PARTS} note="Mọi value=0 → track rỗng (tránh chia 0), legend vẫn liệt kê tên slice.">
                    <SegmentBar
                        ariaLabel="No assessment data yet"
                        showAnatomy
                        segments={[
                            { key: "easy", label: "Easy", value: 0 },
                            { key: "medium", label: "Medium", value: 0 },
                            { key: "hard", label: "Hard", value: 0 },
                        ]}
                    />
                </BlockAnatomy>
            </div>
        </div>
    ),
}
