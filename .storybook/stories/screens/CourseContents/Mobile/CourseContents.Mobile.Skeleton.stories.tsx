import type { Meta, StoryObj } from "@storybook/nextjs"
import { CourseContents } from "@sb-components/screens/CourseContents/CourseContents"
import { deviceLeaf } from "@sb-components/screens/CourseContents/_shared"

/**
 * SCREEN `/learn/content` at MOBILE (375px, below `@app-sm`) — SKELETON: `isSkeleton`
 * flows down into every block, mirroring the SAME spine as the loaded leaf (§11f:
 * state, not structure) while data is still in flight.
 */
const W = 375

const meta: Meta<typeof CourseContents> = {
    title: "Screens/CourseContents/Mobile/Skeleton",
    component: CourseContents,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}
export default meta

type Story = StoryObj<typeof CourseContents>

export const Default: Story = {
    render: () => deviceLeaf({ width: W, isSkeleton: true, leaf: "Default", reason: "Mobile 375px · loading — the isSkeleton flag flows into each block, SAME STRUCTURE as the content leaf (§11f)." }),
}
