import type { Meta, StoryObj } from "@storybook/nextjs"
import { CourseContents } from "@sb-components/starci/screens/CourseContents/CourseContents"
import { deviceLeaf } from "@sb-components/starci/screens/CourseContents/_shared"

/**
 * SCREEN `/learn/content` at TABLET (768px, `@app-sm` … below `@app-lg`) — EMPTY: the course has no
 * contents yet, so `AsyncContentEmpty` replaces the WHOLE dashboard spine.
 */
const W = 768

const meta: Meta<typeof CourseContents> = {
    title: "StarCi/Screens/CourseContents/Tablet/Empty",
    component: CourseContents,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}
export default meta

type Story = StoryObj<typeof CourseContents>

export const Default: Story = {
    render: () => deviceLeaf({ width: W, isEmpty: true, leaf: "Default", reason: "Tablet 768px · no lessons yet — AsyncContentEmpty replaces the whole spine." }),
}
