import type { Meta, StoryObj } from "@storybook/nextjs"
import { CourseContents } from "@sb-components/starci/screens/CourseContents/CourseContents"
import { deviceLeaf } from "@sb-components/starci/screens/CourseContents/_shared"

/**
 * SCREEN `/learn/content` at TABLET (768px, `@app-sm` … below `@app-lg`) — SKELETON:
 * `isSkeleton` flows down into every block, mirroring the SAME spine as the loaded
 * leaf (§11f: state, not structure) while data is still in flight.
 */
const W = 768

const meta: Meta<typeof CourseContents> = {
    title: "StarCi/Screens/CourseContents/Tablet/Skeleton",
    component: CourseContents,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}
export default meta

type Story = StoryObj<typeof CourseContents>

export const Default: Story = {
    render: () => deviceLeaf({ width: W, isSkeleton: true, leaf: "Prop `isSkeleton`", reason: "Tablet 768px · the resting shape, drawn by each block itself." }),
}
