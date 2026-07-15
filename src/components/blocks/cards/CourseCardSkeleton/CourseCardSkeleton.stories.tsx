import type { Meta, StoryObj } from "@storybook/nextjs"
import { CourseCardSkeleton } from "./index"

const meta: Meta<typeof CourseCardSkeleton> = {
    title: "Blocks/CourseCardSkeleton",
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

/** Đặt nhiều skeleton trong một lưới để mô phỏng trạng thái tải của toàn bộ danh sách khóa học. */
export const Grid: Story = {
    parameters: { usage: "Đặt nhiều skeleton trong một lưới để mô phỏng trạng thái tải của toàn bộ danh sách khóa học." },
    render: () => (
        <div className="grid w-[720px] grid-cols-3 gap-4">
            <CourseCardSkeleton />
            <CourseCardSkeleton />
            <CourseCardSkeleton />
        </div>
    ),
}

/** Truyền className tuỳ biến để giới hạn chiều rộng skeleton khi đặt trong khu vực hẹp như sidebar. */
export const CustomWidth: Story = {
    parameters: { usage: "Truyền className tuỳ biến để giới hạn chiều rộng skeleton khi đặt trong khu vực hẹp như sidebar." },
    render: () => <CourseCardSkeleton className="w-[280px]" />,
}
