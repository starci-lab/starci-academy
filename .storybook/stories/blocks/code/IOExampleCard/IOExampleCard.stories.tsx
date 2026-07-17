import type { Meta, StoryObj } from "@storybook/nextjs"

import { IOExampleCard } from "@/components/blocks/code/IOExampleCard"

const meta: Meta<typeof IOExampleCard> = {
    title: "Blocks/Code/IOExampleCard",
    component: IOExampleCard,
    tags: ["news"],
}

export default meta

type Story = StoryObj<typeof IOExampleCard>

/** A sample testcase: labelled input → expected output, mono + pre-wrapped. Replaces the hand-rolled `<pre bg-default-100>` on the coding surfaces. */
export const Sample: Story = {
    tags: ["news"],
    parameters: { usage: "Chờ duyệt — sample testcase: input → output, mono. Thay <pre bg-default-100> thô ở màn giải bài." },
    render: () => (
        <div className="max-w-md">
            <IOExampleCard
                rows={[
                    { key: "in", label: "Ví dụ 1 · Đầu vào", value: "nums = [2,7,11,15], target = 9" },
                    { key: "out", label: "Đầu ra", value: "[0,1]" },
                ]}
            />
        </div>
    ),
}

/** A failed-case diff: the mismatch tints the labels — expected = success, got = danger — so the learner spots the divergence at a glance. */
export const Diff: Story = {
    tags: ["news"],
    parameters: { usage: "Chờ duyệt — diff case sai: input · Mong đợi (success) · Nhận được (danger). Dùng trong TestCaseResultGrid." },
    render: () => (
        <div className="max-w-md">
            <IOExampleCard
                rows={[
                    { key: "in", label: "Đầu vào", value: "nums = [3,3], target = 6" },
                    { key: "exp", label: "Mong đợi", value: "[0,1]", tone: "success" },
                    { key: "got", label: "Nhận được", value: "[]", tone: "danger" },
                ]}
            />
        </div>
    ),
}
