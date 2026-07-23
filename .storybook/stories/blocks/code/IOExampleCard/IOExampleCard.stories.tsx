import type { Meta, StoryObj } from "@storybook/nextjs"
import { IOExampleCard } from "./IOExampleCard"

const meta: Meta<typeof IOExampleCard> = {
    title: "Design/Code/IOExampleCard",
    component: IOExampleCard,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof IOExampleCard>

/** A sample testcase: labelled input → expected output, mono + pre-wrapped. */
export const Sample: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <IOExampleCard
                    rows={[
                        { key: "in", label: "Ví dụ 1 · Đầu vào", value: "nums = [2,7,11,15], target = 9" },
                        { key: "out", label: "Đầu ra", value: "[0,1]" },
                    ]}
                />
            </div>
        </div>
    ),
}

/** A failed-case diff: expected label tints `success`, got label tints `danger` — the mismatch reads at a glance. */
export const Diff: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <IOExampleCard
                    rows={[
                        { key: "in", label: "Đầu vào", value: "nums = [3,3], target = 6" },
                        { key: "exp", label: "Mong đợi", value: "[0,1]", tone: "success" },
                        { key: "got", label: "Nhận được", value: "[]", tone: "danger" },
                    ]}
                />
            </div>
        </div>
    ),
}

/** A single row — the dashed inset rule only appears between rows, so one row is a plain labelled block. */
export const SingleRow: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <IOExampleCard
                    rows={[{ key: "in", label: "Đầu vào", value: "s = \"()[]{}\"" }]}
                />
            </div>
        </div>
    ),
}

/** Multi-line values: `whitespace-pre-wrap` keeps newlines + wraps long lines inside the mono block. */
export const MultiLineValue: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <IOExampleCard
                    rows={[
                        { key: "in", label: "Đầu vào", value: "3\n1 2 3\n4 5 6\n7 8 9" },
                        { key: "out", label: "Đầu ra", value: "[[1,4,7],[2,5,8],[3,6,9]]" },
                    ]}
                />
            </div>
        </div>
    ),
}
