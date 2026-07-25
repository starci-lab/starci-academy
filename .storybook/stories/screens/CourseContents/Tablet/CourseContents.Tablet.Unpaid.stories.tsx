import type { Meta, StoryObj } from "@storybook/nextjs"
import { CourseContents } from "@sb-components/screens/CourseContents/CourseContents"
import { deviceLeaf } from "@sb-components/screens/CourseContents/_shared"

/**
 * SCREEN `/learn/content` at TABLET (768px, `@app-sm` … below `@app-lg`) — UNPAID
 * viewer: tree carries the GitHub-team `Feedback.Callout` + `TrialConversionStrip`.
 * Container-query driven, so the fixed-width `@container` IS the tablet signal.
 */
const W = 768

const meta: Meta<typeof CourseContents> = {
    title: "Screens/CourseContents/Tablet/Unpaid",
    component: CourseContents,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}
export default meta

type Story = StoryObj<typeof CourseContents>

export const Default: Story = {
    render: () => deviceLeaf({ width: W, state: "content", viewer: "trial", leaf: "Default", reason: "Tablet 768px · chưa mua — cây có thêm Callout + TrialConversionStrip; lưới rút còn 2 cột." }),
}
