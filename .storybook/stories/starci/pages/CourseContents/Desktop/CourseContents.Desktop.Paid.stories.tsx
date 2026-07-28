import type { Meta, StoryObj } from "@storybook/nextjs"
import { CourseContents } from "@sb-components/starci/pages/CourseContents/CourseContents"
import { deviceLeaf } from "@sb-components/starci/pages/CourseContents/_shared"

/**
 * SCREEN `/learn/content` at DESKTOP (full width, ≥ `@app-lg`) — PAID viewer:
 * only `TrialConversionStrip` drops out, leaving a FIVE-block spine (CourseBrief ·
 * CourseTeamGate · ContinueLearning · LearnNudges · KeepGoingPath). The gate stays: its
 * own condition is `!isEnrolled || isInTeam`, and a paid viewer who is not in the team yet
 * satisfies neither.
 */
const meta: Meta<typeof CourseContents> = {
    title: "StarCi/Pages/CourseContents/Desktop/Paid",
    component: CourseContents,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}
export default meta

type Story = StoryObj<typeof CourseContents>

export const Default: Story = {
    render: () => deviceLeaf({ viewer: "paid", leaf: "Default", reason: "Purchased — only TrialConversionStrip drops out, leaving 5 blocks: CourseBrief · CourseTeamGate · ContinueLearning · LearnNudges · KeepGoingPath. The gate stays because the viewer is enrolled but not in the GitHub team yet." }),
}
