import type { Meta, StoryObj } from "@storybook/nextjs"
import { CourseContents } from "@sb-components/starci/pages/CourseContents/CourseContents"
import { deviceLeaf } from "@sb-components/starci/pages/CourseContents/_shared"

/**
 * `CourseContents` at MOBILE (375px, below `@app-sm`) — skeleton state:
 * `isSkeleton` flows down into every block and each draws its own resting
 * shape. This is a leaf, not merely a state — the flag makes components draw
 * different pixels, and whoever owns the shape owns its resting shape.
 */
const W = 375

const meta: Meta<typeof CourseContents> = {
    title: "StarCi/Pages/CourseContents/Mobile/Skeleton",
    component: CourseContents,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}
export default meta

type Story = StoryObj<typeof CourseContents>

/** Story: resting state for this component. */
export const Default: Story = {
    render: () => deviceLeaf({ width: W, isSkeleton: true, leaf: "Prop `isSkeleton`", reason: "Mobile 375px · the resting shape. The flag flows into each block and every block draws its own shimmer, which is why this is a leaf at the screen tier too." }),
}
