import type { Meta, StoryObj } from "@storybook/nextjs"
import { SkeletonParagraph } from "@/components/blocks/skeleton/SkeletonParagraph"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof SkeletonParagraph> = {
    title: "Blocks/Skeleton/SkeletonParagraph",
    component: SkeletonParagraph,
}
export default meta
type Story = StoryObj<typeof SkeletonParagraph>

/**
 * Phủ toàn bộ trạng thái của SkeletonParagraph: số dòng (rỗng/một/mặc định/nhiều)
 * và cỡ chữ (nhỏ/mặc định/lớn), xếp cạnh nhau trong một gallery để chọn đúng biến
 * thể theo đoạn văn bản thật sắp hiển thị.
 */
export const AllVariants: Story = {
    parameters: { usage: "Dùng khi cần chọn đúng số dòng và cỡ chữ cho khung chờ của một đoạn văn bản — so các biến thể cạnh nhau để cân đối với nội dung thật sắp tải xong." },
    render: () => (
        <Gallery>
            <Variant
                label="Mặc định (3 dòng, size base)"
                hint="Dùng khi chưa tải xong một đoạn mô tả ngắn, ví dụ phần giới thiệu khóa học — không truyền lines thì mặc định là 3 dòng, dòng cuối luôn ngắn hơn."
            >
                <div className="w-80">
                    <SkeletonParagraph size="base" />
                </div>
            </Variant>
            <Variant
                label="Một dòng (lines=1)"
                hint="Dùng khi đoạn văn bản thật chỉ còn một dòng ngắn, ví dụ một câu trích dẫn hoặc ghi chú phụ."
            >
                <div className="w-80">
                    <SkeletonParagraph size="base" lines={1} />
                </div>
            </Variant>
            <Variant
                label="Nhiều dòng (lines=6)"
                hint="Dùng khi thay cho một đoạn văn dài, ví dụ mô tả chi tiết bài học hoặc nội dung bài viết trên trang khóa học."
            >
                <div className="w-80">
                    <SkeletonParagraph size="base" lines={6} />
                </div>
            </Variant>
            <Variant
                label="Rỗng (lines=0)"
                hint="Trường hợp biên khi số dòng tính ra là 0 — block không render thanh nào, tránh vẽ khung chờ thừa khi nội dung thật cũng rỗng."
            >
                <div className="w-80">
                    <SkeletonParagraph size="base" lines={0} />
                </div>
            </Variant>
            <Variant
                label="Cỡ lớn (size=xl)"
                hint="Dùng khi đoạn văn bản thật là tiêu đề nhiều dòng, ví dụ tiêu đề dài của một bài học hiển thị ở cỡ chữ lớn."
            >
                <div className="w-96">
                    <SkeletonParagraph size="xl" lines={2} />
                </div>
            </Variant>
            <Variant
                label="Cỡ nhỏ (size=xs)"
                hint="Dùng khi đoạn văn bản thật là chú thích nhỏ, ví dụ ghi chú dưới ảnh hoặc nhãn phụ nhiều dòng."
            >
                <div className="w-64">
                    <SkeletonParagraph size="xs" lines={2} />
                </div>
            </Variant>
        </Gallery>
    ),
}
