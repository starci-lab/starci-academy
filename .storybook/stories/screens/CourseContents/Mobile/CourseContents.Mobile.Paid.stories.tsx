import type { Meta, StoryObj } from "@storybook/nextjs"
import { CourseContents } from "@sb-components/screens/CourseContents/CourseContents"
import { deviceLeaf } from "@sb-components/screens/CourseContents/_shared"

/**
 * SCREEN `/learn/content` at MOBILE (375px, below `@app-sm`) — PAID viewer:
 * `Feedback.Callout` + `TrialConversionStrip` drop OUT of the tree.
 */
const W = 375

const meta: Meta<typeof CourseContents> = {
    title: "Screens/CourseContents/Mobile/Paid",
    component: CourseContents,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}
export default meta

type Story = StoryObj<typeof CourseContents>

export const Default: Story = {
    render: () => deviceLeaf({ width: W, state: "content", viewer: "paid", leaf: "Default", reason: "Mobile 375px · đã mua — cây rụng Callout + TrialConversionStrip, còn 4 block xếp 1 cột." }),
}
