import type { Meta, StoryObj } from "@storybook/nextjs"
import { CourseContents } from "@sb-components/screens/CourseContents/CourseContents"
import { deviceLeaf } from "@sb-components/screens/CourseContents/_shared"

/**
 * SCREEN `/learn/content` at DESKTOP (full width, ≥ `@app-lg`) — UNPAID viewer
 * (`viewer="trial"`): the tree carries TWO extra blocks vs paid (GitHub-team
 * `Feedback.Callout` + `TrialConversionStrip`) → different block tree, own story.
 */
const meta: Meta<typeof CourseContents> = {
    title: "Screens/CourseContents/Desktop/Unpaid",
    component: CourseContents,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}
export default meta

type Story = StoryObj<typeof CourseContents>

export const Default: Story = {
    render: () => deviceLeaf({ viewer: "trial", leaf: "Default", reason: "Not purchased — the tree ADDS CourseTeamGate (GitHub-team gate) + TrialConversionStrip. A different tree from Paid, so it earns its own story." }),
}
