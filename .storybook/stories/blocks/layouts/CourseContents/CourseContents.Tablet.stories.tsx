import type { Meta, StoryObj } from "@storybook/nextjs"
import { CourseContents } from "./CourseContents"
import { deviceLeaf } from "./_shared"

/** LAYOUT `/learn/content` at TABLET width (768px = `@app-md`). Anatomy everywhere; states as stories. */
const W = 768

const meta: Meta<typeof CourseContents> = {
    title: "Layouts/CourseContents/Tablet - 768px",
    component: CourseContents,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}
export default meta

type Story = StoryObj<typeof CourseContents>

export const Default: Story = {
    render: () => deviceLeaf({ width: W, state: "content", viewer: "trial", leaf: "Default", reason: "Màn tablet 768px (@app-md) — meta chips 1 hàng, spine rộng hơn mobile." }),
}
export const Paid: Story = {
    render: () => deviceLeaf({ width: W, state: "content", viewer: "paid", leaf: "Paid", reason: "Tablet · đã mua → Callout gh-gate + TrialConversionStrip tự ẩn (STATE, không phải leaf)." }),
}
export const Loading: Story = {
    render: () => deviceLeaf({ width: W, state: "loading", leaf: "Loading" }),
}
export const Empty: Story = {
    render: () => deviceLeaf({ width: W, state: "empty", leaf: "Empty" }),
}
