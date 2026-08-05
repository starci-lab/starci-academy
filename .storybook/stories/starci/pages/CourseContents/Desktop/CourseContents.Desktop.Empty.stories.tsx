import type { Meta, StoryObj } from "@storybook/nextjs"
import { CourseContents } from "@sb-components/starci/pages/CourseContents/CourseContents"
import { deviceLeaf } from "@sb-components/starci/pages/CourseContents/_shared"

/**
 * SCREEN `/learn/content` at DESKTOP (full width, ≥ `@app-lg`) — EMPTY: the course has
 * no contents yet, so `AsyncContentEmpty` replaces the WHOLE dashboard spine.
 */
const meta: Meta<typeof CourseContents> = {
    title: "StarCi/Pages/CourseContents/Desktop/Empty",
    component: CourseContents,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}
export default meta

type Story = StoryObj<typeof CourseContents>

/** Story: resting state for this component. */
export const Default: Story = {
    render: () => deviceLeaf({ isEmpty: true, leaf: "Default", reason: "The course has no contents yet — AsyncContentEmpty replaces the ENTIRE spine; not one dashboard block is left." }),
}
