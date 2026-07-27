import type { Meta, StoryObj } from "@storybook/nextjs"
import { CourseContents } from "@sb-components/starci/screens/CourseContents/CourseContents"
import { deviceLeaf } from "@sb-components/starci/screens/CourseContents/_shared"

/**
 * SCREEN `/learn/content` at MOBILE (375px, below `@app-sm`) — SKELETON: `isSkeleton` flows down
 * into every block and each one draws its OWN resting shape. This is a LEAF, not merely a
 * state (teacher, 2026-07-27): the flag makes the components draw different pixels, and
 * whoever owns the shape owns its resting shape.
 */
const W = 375

const meta: Meta<typeof CourseContents> = {
    title: "StarCi/Screens/CourseContents/Mobile/Skeleton",
    component: CourseContents,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}
export default meta

type Story = StoryObj<typeof CourseContents>

export const Default: Story = {
    render: () => deviceLeaf({ width: W, isSkeleton: true, leaf: "Prop `isSkeleton`", reason: "Mobile 375px · the resting shape. The flag flows into each block and every block draws its own shimmer, which is why this is a leaf at the screen tier too." }),
}
