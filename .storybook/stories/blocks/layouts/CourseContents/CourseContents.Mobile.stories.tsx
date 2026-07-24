import type { Meta, StoryObj } from "@storybook/nextjs"
import { CourseContents } from "./CourseContents"
import { deviceLeaf } from "./_shared"

/**
 * LAYOUT `/learn/content` at MOBILE width (375px, below `@app-sm`). Every story is
 * anatomy-wrapped; states live side-by-side under this device folder (§11f: states,
 * not leaves). Container-query driven, so the fixed-width `@container` IS the mobile
 * signal (viewport addon would do nothing).
 */
const W = 375

const meta: Meta<typeof CourseContents> = {
    title: "Layouts/CourseContents/Mobile - 375px",
    component: CourseContents,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}
export default meta

type Story = StoryObj<typeof CourseContents>

export const Default: Story = {
    render: () => deviceLeaf({ width: W, state: "content", viewer: "trial", leaf: "Default", reason: "Màn mobile 375px — dưới @app-sm; layout dồn 1 cột, meta chips wrap." }),
}
export const Paid: Story = {
    render: () => deviceLeaf({ width: W, state: "content", viewer: "paid", leaf: "Paid", reason: "Mobile · đã mua → Callout gh-gate + TrialConversionStrip tự ẩn (STATE, không phải leaf)." }),
}
export const Loading: Story = {
    render: () => deviceLeaf({ width: W, state: "loading", leaf: "Loading" }),
}
export const Empty: Story = {
    render: () => deviceLeaf({ width: W, state: "empty", leaf: "Empty" }),
}
