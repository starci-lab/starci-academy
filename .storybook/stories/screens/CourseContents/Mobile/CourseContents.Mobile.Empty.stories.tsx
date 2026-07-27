import type { Meta, StoryObj } from "@storybook/nextjs"
import { CourseContents } from "@sb-components/screens/CourseContents/CourseContents"
import { deviceLeaf } from "@sb-components/screens/CourseContents/_shared"

/**
 * SCREEN `/learn/content` at MOBILE (375px, below `@app-sm`) — EMPTY: the course has no
 * contents yet, so `AsyncContentEmpty` replaces the WHOLE dashboard spine.
 */
const W = 375

const meta: Meta<typeof CourseContents> = {
    title: "Screens/CourseContents/Mobile/Empty",
    component: CourseContents,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}
export default meta

type Story = StoryObj<typeof CourseContents>

export const Default: Story = {
    render: () => deviceLeaf({ width: W, isEmpty: true, leaf: "Default", reason: "Mobile 375px · no contents yet — AsyncContentEmpty replaces the whole spine." }),
}
