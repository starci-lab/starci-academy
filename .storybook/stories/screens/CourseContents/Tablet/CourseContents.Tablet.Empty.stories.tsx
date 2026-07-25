import type { Meta, StoryObj } from "@storybook/nextjs"
import { CourseContents } from "@sb-components/screens/CourseContents/CourseContents"
import { deviceLeaf } from "@sb-components/screens/CourseContents/_shared"

/**
 * SCREEN `/learn/content` at TABLET (768px, `@app-sm` … below `@app-lg`) — EMPTY:
 * `AsyncContent.Empty` replaces the WHOLE dashboard spine.
 */
const W = 768

const meta: Meta<typeof CourseContents> = {
    title: "Screens/CourseContents/Tablet/Empty",
    component: CourseContents,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}
export default meta

type Story = StoryObj<typeof CourseContents>

export const Default: Story = {
    render: () => deviceLeaf({ width: W, state: "empty", leaf: "Default", reason: "Tablet 768px · khoá chưa có bài — AsyncContent.Empty thay toàn bộ spine." }),
}
