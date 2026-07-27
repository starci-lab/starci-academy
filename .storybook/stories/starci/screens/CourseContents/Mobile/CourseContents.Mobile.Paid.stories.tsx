import type { Meta, StoryObj } from "@storybook/nextjs"
import { CourseContents } from "@sb-components/starci/screens/CourseContents/CourseContents"
import { deviceLeaf } from "@sb-components/starci/screens/CourseContents/_shared"

/**
 * SCREEN `/learn/content` at MOBILE (375px, below `@app-sm`) — PAID viewer:
 * only `TrialConversionStrip` drops out. `CourseTeamGate` STAYS — a paid viewer who is
 * not in the GitHub team yet still needs it.
 */
const W = 375

const meta: Meta<typeof CourseContents> = {
    title: "StarCi/Screens/CourseContents/Mobile/Paid",
    component: CourseContents,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}
export default meta

type Story = StoryObj<typeof CourseContents>

export const Default: Story = {
    render: () => deviceLeaf({ width: W, viewer: "paid", leaf: "Default", reason: "Mobile 375px, purchased: only TrialConversionStrip drops out; the remaining 5 blocks stack into one column." }),
}
