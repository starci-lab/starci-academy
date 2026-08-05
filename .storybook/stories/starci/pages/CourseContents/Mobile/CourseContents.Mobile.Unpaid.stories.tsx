import type { Meta, StoryObj } from "@storybook/nextjs"
import { CourseContents } from "@sb-components/starci/pages/CourseContents/CourseContents"
import { deviceLeaf } from "@sb-components/starci/pages/CourseContents/_shared"

/**
 * SCREEN `/learn/content` at MOBILE (375px, below `@app-sm`) — UNPAID viewer: tree
 * carries `TrialConversionStrip` on top of the five blocks a paid viewer also sees
 * (`CourseTeamGate` is NOT exclusive to trial). Container-query
 * driven, so the fixed-width `@container` IS the mobile signal (viewport addon does nothing).
 */
const W = 375

const meta: Meta<typeof CourseContents> = {
    title: "StarCi/Pages/CourseContents/Mobile/Unpaid",
    component: CourseContents,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}
export default meta

type Story = StoryObj<typeof CourseContents>

/** Story: resting state for this component. */
export const Default: Story = {
    render: () => deviceLeaf({
        width: W,
        viewer: "trial",
        leaf: "Default",
        reason: "This is the screen at mobile width for a viewer who has not purchased the course, and the tree adds TrialConversionStrip on top of the blocks a paid viewer also sees. Layout collapses to one column at this width and the meta chips wrap onto their own line.",
    }),
}
