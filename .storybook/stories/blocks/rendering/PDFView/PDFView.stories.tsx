import type { Meta, StoryObj } from "@storybook/nextjs"
import { PDFView } from "@/components/blocks/rendering/PDFView"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof PDFView> = {
    title: "Blocks/Rendering/PDFView",
    component: PDFView,
}
export default meta
type Story = StoryObj<typeof PDFView>

/**
 * Các cách dùng thật của PDFView: chỉ trang đầu để xem lướt, toàn bộ trang
 * cuộn dọc để đọc hết tài liệu, tự co giãn theo khung chứa khi nhúng vào
 * modal/drawer responsive, và 2 state không có tài liệu (rỗng/lỗi tải).
 */
export const AllVariants: Story = {
    parameters: {
        usage: "Nhúng để xem trước tài liệu PDF ngay trong trang (slide bài giảng, hợp đồng, chứng chỉ) mà không bắt học viên tải file xuống — chọn showAllPages/fitToContainer theo không gian hiển thị.",
    },
    render: () => (
        <Gallery>
            <Variant
                label="Một trang (showAllPages=false)"
                hint="Dùng khi chỉ cần xem lướt trang đầu, ví dụ thumbnail xem trước tài liệu trong danh sách bài học."
            >
                <div className="w-[420px]">
                    <PDFView
                        src="https://storage.starci.org/lessons/nestjs-slides.pdf"
                        title="Slide bài giảng NestJS"
                        showAllPages={false}
                        heightClassName="h-[320px]"
                    />
                </div>
            </Variant>
            <Variant
                label="Toàn bộ trang, cuộn dọc"
                hint="Dùng khi học viên cần đọc hết tài liệu nhiều trang ngay trong trang, ví dụ xem trọn slide bài giảng System Design."
            >
                <div className="w-[420px]">
                    <PDFView
                        src="https://storage.starci.org/lessons/system-design-scaling-slides.pdf"
                        title="Slide bài giảng System Design"
                        allowVerticalScroll
                        heightClassName="h-[420px]"
                    />
                </div>
            </Variant>
            <Variant
                label="Tự co giãn theo khung chứa (fitToContainer)"
                hint="Dùng khi khung chứa co giãn theo layout responsive như modal hoặc drawer — PDF tự đo lại chiều rộng khung thay vì giữ pageWidth cố định."
            >
                <div className="w-full max-w-2xl">
                    <PDFView
                        src="https://storage.starci.org/legal/hop-dong-dich-vu-2026.pdf"
                        title="Hợp đồng dịch vụ StarCi"
                        fitToContainer
                        allowVerticalScroll
                        heightClassName="h-[400px]"
                    />
                </div>
            </Variant>
            <Variant
                label="Rỗng — chưa có PDF"
                hint="Dùng khi học viên chưa upload tài liệu, src truyền vào rỗng — hiện thông báo thay khung xem trống."
            >
                <div className="w-[420px]">
                    <PDFView
                        src=""
                        title="Chưa có tài liệu"
                        heightClassName="h-[200px]"
                    />
                </div>
            </Variant>
            <Variant
                label="Lỗi tải PDF"
                hint="Dùng khi src trỏ tới file hỏng hoặc không truy cập được — react-pdf hiện thông báo lỗi thay vì để trống trắng."
            >
                <div className="w-[420px]">
                    <PDFView
                        src="https://storage.starci.org/lessons/file-khong-ton-tai.pdf"
                        title="Tài liệu không tải được"
                        heightClassName="h-[200px]"
                    />
                </div>
            </Variant>
        </Gallery>
    ),
}
