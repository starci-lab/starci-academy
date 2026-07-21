import type { Meta, StoryObj } from "@storybook/nextjs"
import { CourseCardSkeleton } from "@/components/blocks/cards/CourseCardSkeleton"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof CourseCardSkeleton> = {
    title: "Blocks/Card/CourseCardSkeleton",
    component: CourseCardSkeleton,
}
export default meta
type Story = StoryObj<typeof CourseCardSkeleton>

/**
 * The only shape this block has: a single placeholder card, and the catalog
 * grid loading N of them at once. There is no variant/tone/size prop and no
 * empty/error/disabled/selected state — the block itself IS the "loading"
 * state that stands in for `CourseCard` before the query resolves.
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="Một card"
                hint="Dùng khi chỉ có một CourseCard đang chờ dữ liệu, ví dụ ô 'khoá học tiếp theo nên học' trên trang chủ — kích thước placeholder khớp đúng layout grid của CourseCard nên trang không giật khi data về."
            >
                <div className="w-80">
                    <CourseCardSkeleton />
                </div>
            </Variant>
            <Variant
                label="Lưới N card"
                hint="Dùng khi cả trang catalog/course-grid đang tải: render đúng số ô sẽ có (ví dụ 3) để giữ chiều cao lưới ổn định, tránh nhảy layout khi CourseCard thật thay vào."
            >
                <div className="grid w-full gap-4 @app-sm:grid-cols-2 @app-lg:grid-cols-3">
                    <CourseCardSkeleton />
                    <CourseCardSkeleton />
                    <CourseCardSkeleton />
                </div>
            </Variant>
            <Variant
                label="className tuỳ biến"
                hint="className truyền xuống Card root — dùng khi ô skeleton cần khớp một bề rộng/khung riêng của surface gọi nó (ví dụ carousel một cột hẹp), thay vì luôn full-width theo grid cha."
            >
                <CourseCardSkeleton className="w-64" />
            </Variant>
        </Gallery>
    ),
}
