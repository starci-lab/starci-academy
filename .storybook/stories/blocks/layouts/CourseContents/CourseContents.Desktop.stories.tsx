import type { Meta, StoryObj } from "@storybook/nextjs"
import { CourseContents } from "./CourseContents"
import { deviceLeaf } from "./_shared"

/**
 * LAYOUT `/learn/content` at DESKTOP (full width, ≥ `@app-lg`). Anatomy everywhere;
 * states as stories. `Paid` = same leaf, self-hiding strips gone (STATE, not a leaf).
 */
const meta: Meta<typeof CourseContents> = {
    title: "Layouts/CourseContents/Desktop",
    component: CourseContents,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}
export default meta

type Story = StoryObj<typeof CourseContents>

export const Default: Story = {
    render: () => deviceLeaf({ state: "content", viewer: "trial", leaf: "Default", reason: "Leaf DUY NHẤT của trang — không view-switch. Trial: GitHub-team gate + TrialConversionStrip hiện (STATE, không phải leaf riêng)." }),
}
export const Paid: Story = {
    render: () => deviceLeaf({ state: "content", viewer: "paid", leaf: "Paid", reason: "CÙNG leaf, khác STATE: đã mua → Callout gh-gate + TrialConversionStrip tự ẩn. Cấu trúc block còn lại y hệt." }),
}
export const Loading: Story = {
    render: () => deviceLeaf({ state: "loading", leaf: "Loading" }),
}
export const Empty: Story = {
    render: () => deviceLeaf({ state: "empty", leaf: "Empty" }),
}
