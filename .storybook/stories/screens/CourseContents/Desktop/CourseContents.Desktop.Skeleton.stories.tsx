import type { Meta, StoryObj } from "@storybook/nextjs"
import { CourseContents } from "@sb-components/screens/CourseContents/CourseContents"
import { deviceLeaf } from "@sb-components/screens/CourseContents/_shared"

/**
 * SCREEN `/learn/content` at DESKTOP (full width, ≥ `@app-lg`) — SKELETON: `isSkeleton`
 * flows down into every block, mirroring the SAME spine as the loaded leaf (§11f:
 * state, not structure) while data is still in flight.
 */
const meta: Meta<typeof CourseContents> = {
    title: "Screens/CourseContents/Desktop/Skeleton",
    component: CourseContents,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}
export default meta

type Story = StoryObj<typeof CourseContents>

export const Default: Story = {
    render: () => deviceLeaf({ isSkeleton: true, leaf: "Default", reason: "Loading — the isSkeleton flag flows down into each block. SAME STRUCTURE as the content leaf (§11f); only the state turns to shimmer." }),
}
