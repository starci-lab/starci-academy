import type { Meta, StoryObj } from "@storybook/nextjs"
import { CourseCardSkeleton } from "./CourseCardSkeleton"
import { blockShell } from "../../../block-anatomy"

const meta: Meta<typeof CourseCardSkeleton> = {
    title: "Block/Cards/CourseCardSkeleton",
    component: CourseCardSkeleton,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof CourseCardSkeleton>

const ANATOMY = {
    primitives: [
        { name: "Skeleton", role: "mọi node nội dung (cover / dòng chữ / nút) thành shimmer bar khớp box thật" },
    ],
    reason:
        "Loading state của lưới catalog phải GIỮ nguyên cây layout của CourseCard grid (cover 16:9, tiêu đề, 2 dòng mô tả, 3 dòng value-prop, dòng giá, hàng 2 nút) và chỉ đổi node nội dung sang Skeleton đúng kích thước — nhờ vậy trang không giật khi CourseCard thật thay vào.",
}

export const SingleCard: Story = {
    render: () =>
        blockShell(
            <div className="w-80">
                <CourseCardSkeleton />
            </div>,
            ANATOMY,
        ),
}

export const Grid: Story = {
    render: () =>
        blockShell(
            <div className="grid w-full gap-4 @app-sm:grid-cols-2 @app-lg:grid-cols-3">
                <CourseCardSkeleton />
                <CourseCardSkeleton />
                <CourseCardSkeleton />
            </div>,
            ANATOMY,
        ),
}

export const CustomWidth: Story = {
    render: () => blockShell(<CourseCardSkeleton className="w-64" />, ANATOMY),
}
