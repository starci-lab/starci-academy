import type { Meta, StoryObj } from "@storybook/nextjs"
import { CourseCardSkeleton } from "./index"

const meta: Meta<typeof CourseCardSkeleton> = {
    title: "Blocks/Card/CourseCardSkeleton",
    component: CourseCardSkeleton,
    parameters: { layout: "centered" },
}
export default meta
type Story = StoryObj<typeof CourseCardSkeleton>

/** Dùng làm placeholder khi một CourseCard đang tải dữ liệu, giữ đúng bố cục để lưới không bị giật khi nội dung xuất hiện. */
export const Default: Story = {
    parameters: { usage: "Dùng làm placeholder khi một CourseCard đang tải dữ liệu, giữ đúng bố cục để lưới không bị giật khi nội dung xuất hiện." },
    render: () => <CourseCardSkeleton />,
}
