import type { Meta, StoryObj } from "@storybook/nextjs"
import { CourseContents } from "@sb-components/starci/screens/CourseContents/CourseContents"
import { deviceLeaf } from "@sb-components/starci/screens/CourseContents/_shared"

/**
 * SCREEN `/learn/content` at DESKTOP (full width, ≥ `@app-lg`) — SKELETON: `isSkeleton` flows down
 * into every block and each one draws its OWN resting shape. This is a LEAF, not merely a
 * state (teacher, 2026-07-27): the flag makes the components draw different pixels, and
 * whoever owns the shape owns its resting shape.
 */
const meta: Meta<typeof CourseContents> = {
    title: "StarCi/Screens/CourseContents/Desktop/Skeleton",
    component: CourseContents,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}
export default meta

type Story = StoryObj<typeof CourseContents>

export const Default: Story = {
    render: () => deviceLeaf({ isSkeleton: true, leaf: "Prop `isSkeleton`", reason: "The resting shape of the whole screen. Every tier owns a leaf for this prop (teacher, 2026-07-27): the flag flows down and each block DRAWS its own resting shape, so the pixels here are drawn by the components themselves, not by different data." }),
}
