import type { Meta, StoryObj } from "@storybook/nextjs"
import { AccordionSkeleton } from "@/components/blocks/skeleton/AccordionSkeleton"
import { SkeletonText } from "@/components/blocks/skeleton/SkeletonText"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof AccordionSkeleton> = {
    title: "Blocks/Skeleton/AccordionSkeleton",
    component: AccordionSkeleton,
}
export default meta
type Story = StoryObj<typeof AccordionSkeleton>

/**
 * Every state of the accordion skeleton in one gallery: empty, one row, many
 * rows, an expanded row with a body placeholder, a row without the chevron
 * indicator, and title bars at different text tiers.
 */
export const AllVariants: Story = {
    parameters: { usage: "Trang FAQ hoặc sidebar còn đang chờ dữ liệu accordion (câu hỏi thường gặp, mục lục bài học) dùng block này để giữ layout ổn định trước khi Accordion thật mount." },
    render: () => (
        <Gallery>
            <Variant
                label="Rỗng"
                hint="Hiếm khi xảy ra (accordion luôn có sẵn ít nhất một mục), nhưng vẫn cần render không lỗi khi items rỗng."
            >
                <div className="w-full max-w-md">
                    <AccordionSkeleton items={[]} />
                </div>
            </Variant>

            <Variant
                label="Một mục"
                hint="Dùng khi chỉ có một khối accordion đang tải, ví dụ chi tiết một câu hỏi thường gặp vừa mở trang."
            >
                <div className="w-full max-w-md">
                    <AccordionSkeleton
                        items={[
                            { ariaLabel: "Đang tải câu hỏi thường gặp", titleWidth: "w-2/3" },
                        ]}
                    />
                </div>
            </Variant>

            <Variant
                label="Nhiều mục, đang thu gọn"
                hint="Trường hợp phổ biến nhất: danh sách FAQ hoặc mục lục bài học đang tải, mỗi hàng chỉ có tiêu đề và chevron."
            >
                <div className="w-full max-w-md">
                    <AccordionSkeleton
                        items={[
                            { ariaLabel: "Khoá học có cấp chứng chỉ không", titleWidth: "w-3/4" },
                            { ariaLabel: "Người mới bắt đầu có theo được không", titleWidth: "w-2/3" },
                            { ariaLabel: "Học phí có được trả góp không", titleWidth: "w-5/6" },
                            { ariaLabel: "Sau khi hoàn thành có được hỗ trợ tìm việc không", titleWidth: "w-full" },
                        ]}
                    />
                </div>
            </Variant>

            <Variant
                label="Mục đang mở kèm nội dung"
                hint="Dùng khi người dùng đã bấm mở một mục trước khi dữ liệu về, cần giữ chỗ cho cả tiêu đề và phần nội dung bên dưới."
            >
                <div className="w-full max-w-md">
                    <AccordionSkeleton
                        items={[
                            { ariaLabel: "Khoá học có cấp chứng chỉ không", titleWidth: "w-3/4" },
                            {
                                ariaLabel: "Người mới bắt đầu có theo được không",
                                titleWidth: "w-2/3",
                                expanded: true,
                            },
                            { ariaLabel: "Học phí có được trả góp không", titleWidth: "w-5/6" },
                        ]}
                        renderExpandedBody={() => (
                            <div className="flex flex-col gap-2">
                                <SkeletonText size="sm" width="w-full" />
                                <SkeletonText size="sm" width="w-5/6" />
                                <SkeletonText size="sm" width="w-2/3" />
                            </div>
                        )}
                    />
                </div>
            </Variant>

            <Variant
                label="Ẩn chỉ báo chevron"
                hint="Dùng khi thiết kế thật không có chevron mở/đóng cho hàng đó, ví dụ hàng chỉ mang tính hiển thị."
            >
                <div className="w-full max-w-md">
                    <AccordionSkeleton
                        items={[
                            { ariaLabel: "Điều khoản sử dụng", titleWidth: "w-1/2", showIndicator: false },
                            { ariaLabel: "Chính sách bảo mật", titleWidth: "w-2/3", showIndicator: false },
                        ]}
                    />
                </div>
            </Variant>

            <Variant
                label="Cỡ tiêu đề khác nhau"
                hint="Chọn titleSize khớp với cỡ chữ tiêu đề thật (body-sm, base, lg) để chiều cao khung không lệch khi dữ liệu về."
            >
                <div className="w-full max-w-md">
                    <AccordionSkeleton
                        items={[
                            { ariaLabel: "Tiêu đề nhỏ", titleSize: "sm", titleWidth: "w-1/2" },
                            { ariaLabel: "Tiêu đề vừa", titleSize: "base", titleWidth: "w-2/3" },
                            { ariaLabel: "Tiêu đề lớn", titleSize: "lg", titleWidth: "w-3/4" },
                        ]}
                    />
                </div>
            </Variant>
        </Gallery>
    ),
}
