import type { Meta, StoryObj } from "@storybook/nextjs"
import { CourseContents } from "@sb-components/screens/CourseContents/CourseContents"
import { deviceLeaf } from "@sb-components/screens/CourseContents/_shared"

/**
 * SCREEN `/learn/content` at MOBILE (375px, below `@app-sm`) — UNPAID viewer: tree
 * carries the GitHub-team `Feedback.Callout` + `TrialConversionStrip`. Container-query
 * driven, so the fixed-width `@container` IS the mobile signal (viewport addon does nothing).
 */
const W = 375

const meta: Meta<typeof CourseContents> = {
    title: "Screens/CourseContents/Mobile/Unpaid",
    component: CourseContents,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}
export default meta

type Story = StoryObj<typeof CourseContents>

export const Default: Story = {
    render: () => deviceLeaf({ width: W, state: "content", viewer: "trial", leaf: "Default", reason: "Mobile 375px · chưa mua — cây có thêm Callout + TrialConversionStrip; layout dồn 1 cột, meta chips wrap." }),
}
