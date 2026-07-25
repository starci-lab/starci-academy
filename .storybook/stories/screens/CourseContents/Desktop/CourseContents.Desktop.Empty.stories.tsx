import type { Meta, StoryObj } from "@storybook/nextjs"
import { CourseContents } from "@sb-components/screens/CourseContents/CourseContents"
import { deviceLeaf } from "@sb-components/screens/CourseContents/_shared"

/**
 * SCREEN `/learn/content` at DESKTOP (full width, ≥ `@app-lg`) — EMPTY: the course
 * has no lesson yet, so `AsyncContent.Empty` replaces the WHOLE dashboard spine.
 */
const meta: Meta<typeof CourseContents> = {
    title: "Screens/CourseContents/Desktop/Empty",
    component: CourseContents,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}
export default meta

type Story = StoryObj<typeof CourseContents>

export const Default: Story = {
    render: () => deviceLeaf({ state: "empty", leaf: "Default", reason: "Khoá chưa có bài — AsyncContent.Empty thay TOÀN BỘ spine, không còn block nào của dashboard." }),
}
