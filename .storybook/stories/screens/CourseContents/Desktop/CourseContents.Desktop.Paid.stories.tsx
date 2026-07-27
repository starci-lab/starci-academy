import type { Meta, StoryObj } from "@storybook/nextjs"
import { CourseContents } from "@sb-components/screens/CourseContents/CourseContents"
import { deviceLeaf } from "@sb-components/screens/CourseContents/_shared"

/**
 * SCREEN `/learn/content` at DESKTOP (full width, ≥ `@app-lg`) — PAID viewer:
 * `Feedback.Callout` + `TrialConversionStrip` drop OUT of the tree, leaving the
 * 4-block spine (Header · ContinueCard · LearnNudges · KeepGoingPath).
 */
const meta: Meta<typeof CourseContents> = {
    title: "Screens/CourseContents/Desktop/Paid",
    component: CourseContents,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}
export default meta

type Story = StoryObj<typeof CourseContents>

export const Default: Story = {
    render: () => deviceLeaf({ viewer: "paid", leaf: "Default", reason: "Purchased — the tree drops CourseTeamGate + TrialConversionStrip, leaving 4 blocks: CourseBrief · ContinueLearning · LearnNudges · KeepGoingPath." }),
}
