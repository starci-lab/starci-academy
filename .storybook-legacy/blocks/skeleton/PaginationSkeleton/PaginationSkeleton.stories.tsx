import type { Meta, StoryObj } from "@storybook/nextjs"
import { PaginationSkeleton } from "@/components/blocks/skeleton/PaginationSkeleton"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof PaginationSkeleton> = {
    title: "Legacy/Blocks/Skeleton/PaginationSkeleton",
    component: PaginationSkeleton,
}
export default meta
type Story = StoryObj<typeof PaginationSkeleton>

/**
 * Toàn bộ ma trận của PaginationSkeleton: số pill mặc định, ít pill (kết quả
 * ngắn), nhiều pill (kết quả dài), và className tuỳ biến trên wrapper. Block
 * chỉ có một hình hài — chính nó LÀ trạng thái loading thay cho Pagination
 * thật, không có variant/tone/size hay trạng thái rỗng/lỗi/disabled riêng.
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="Mặc định (3 pill)"
                hint="Dùng khi chưa biết trước tổng số trang — pageCount mặc định 3 khớp layout Pagination cỡ sm phổ biến nhất (prev, 3 trang, next), ví dụ danh sách bài viết đang chờ đếm tổng số trang."
            >
                <PaginationSkeleton />
            </Variant>
            <Variant
                label="Ít pill (pageCount=1)"
                hint="Dùng khi biết trước kết quả ngắn, ví dụ bảng kết quả lọc hẹp chỉ còn một vài trang — giữ khung prev/next + 1 pill để không chiếm chỗ thừa trong lúc chờ dữ liệu."
            >
                <PaginationSkeleton pageCount={1} />
            </Variant>
            <Variant
                label="Nhiều pill (pageCount=5)"
                hint="Dùng khi biết trước danh sách dài, ví dụ catalog khoá học nhiều trang — tăng pageCount để khung loading không bị hẹp hơn Pagination thật khi dữ liệu về, tránh giật layout."
            >
                <PaginationSkeleton pageCount={5} />
            </Variant>
            <Variant
                label="className tuỳ biến"
                hint="className đắp thêm lên wrapper ngoài (flex justify-center) — dùng khi khu vực gọi cần chỉnh khoảng cách, ví dụ mt-6 để tách pagination khỏi bảng phía trên."
            >
                <PaginationSkeleton className="mt-6 rounded-2xl border border-default p-3" />
            </Variant>
        </Gallery>
    ),
    parameters: {
        usage:
            "Toàn bộ ma trận của PaginationSkeleton: số pill mặc định, ít pill khi kết quả ngắn, " +
            "nhiều pill khi kết quả dài, và className tuỳ biến trên wrapper. Dùng để tra pageCount " +
            "nên đặt bao nhiêu cho khớp Pagination thật sẽ thay vào, tránh giật layout khi dữ liệu về.",
    },
}
