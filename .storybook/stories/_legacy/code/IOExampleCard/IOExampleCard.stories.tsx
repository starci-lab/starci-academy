import type { Meta, StoryObj } from "@storybook/nextjs"
import { IOExampleCard } from "@sb-components/_legacy/blocks/code/IOExampleCard/IOExampleCard"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta<typeof IOExampleCard> = {
    title: "Legacy/Design/Code/IOExampleCard",
    component: IOExampleCard,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof IOExampleCard>

// DOM thật: mỗi phần tử `rows` render thành MỘT "Row" (label muted + value mono) —
// N hàng cùng 1 tên part (repeated), tách nhau bởi viền dashed. Không đào sâu vào
// label/value riêng bên trong (cháu-nội của Row).
const TWO_ROW_PARTS: Array<AnatomyNode> = [
    { name: "Row", tier: "composite", role: "label muted (text-xs) + value mono pre-wrap, lặp lại mỗi phần tử `rows`" },
]

const THREE_ROW_PARTS: Array<AnatomyNode> = [
    { name: "Row", tier: "composite", role: "label muted/success/danger theo `tone` + value mono, lặp lại mỗi phần tử `rows`" },
]

const ONE_ROW_PARTS: Array<AnatomyNode> = [
    { name: "Row", tier: "composite", role: "label muted + value mono — chỉ 1 hàng nên không có viền dashed giữa hàng" },
]

/** A sample testcase: labelled input → expected output, mono + pre-wrapped. */
export const Sample: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <BlockAnatomy
                    name="IOExampleCard"
                    tier="design"
                    leaf="Sample"
                    parts={TWO_ROW_PARTS}
                    reason="Bounded card render N khối label+value đồng dạng (test case input→output); mỗi khối là 1 Row lặp lại, tách bởi viền dashed."
                >
                    <IOExampleCard
                        showAnatomy
                        rows={[
                            { key: "in", label: "Ví dụ 1 · Đầu vào", value: "nums = [2,7,11,15], target = 9" },
                            { key: "out", label: "Đầu ra", value: "[0,1]" },
                        ]}
                    />
                </BlockAnatomy>
            </div>
        </div>
    ),
}

/** A failed-case diff: expected label tints `success`, got label tints `danger` — the mismatch reads at a glance. */
export const Diff: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <BlockAnatomy
                    name="IOExampleCard"
                    tier="design"
                    leaf="Diff"
                    parts={THREE_ROW_PARTS}
                    note="3 Row cùng tên — chỉ khác `tone` trên label (default/success/danger), value luôn cùng cấu trúc mono."
                >
                    <IOExampleCard
                        showAnatomy
                        rows={[
                            { key: "in", label: "Đầu vào", value: "nums = [3,3], target = 6" },
                            { key: "exp", label: "Mong đợi", value: "[0,1]", tone: "success" },
                            { key: "got", label: "Nhận được", value: "[]", tone: "danger" },
                        ]}
                    />
                </BlockAnatomy>
            </div>
        </div>
    ),
}

/** A single row — the dashed inset rule only appears between rows, so one row is a plain labelled block. */
export const SingleRow: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <BlockAnatomy
                    name="IOExampleCard"
                    tier="design"
                    leaf="SingleRow"
                    parts={ONE_ROW_PARTS}
                    note="1 phần tử `rows` → 1 Row, không viền dashed (viền chỉ xuất hiện TỪ hàng thứ 2)."
                >
                    <IOExampleCard
                        showAnatomy
                        rows={[{ key: "in", label: "Đầu vào", value: "s = \"()[]{}\"" }]}
                    />
                </BlockAnatomy>
            </div>
        </div>
    ),
}

/** Multi-line values: `whitespace-pre-wrap` keeps newlines + wraps long lines inside the mono block. */
export const MultiLineValue: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <BlockAnatomy
                    name="IOExampleCard"
                    tier="design"
                    leaf="MultiLineValue"
                    parts={TWO_ROW_PARTS}
                    note="Cùng bộ part như Sample — value nhiều dòng chỉ đổi nội dung, không đổi composition."
                >
                    <IOExampleCard
                        showAnatomy
                        rows={[
                            { key: "in", label: "Đầu vào", value: "3\n1 2 3\n4 5 6\n7 8 9" },
                            { key: "out", label: "Đầu ra", value: "[[1,4,7],[2,5,8],[3,6,9]]" },
                        ]}
                    />
                </BlockAnatomy>
            </div>
        </div>
    ),
}
