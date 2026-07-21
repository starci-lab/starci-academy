import type { Meta, StoryObj } from "@storybook/nextjs"
import { SubPageHeader } from "@/components/blocks/layout/SubPageHeader"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof SubPageHeader> = {
    title: "Blocks/Layout/SubPageHeader",
    component: SubPageHeader,
}

export default meta

type Story = StoryObj<typeof SubPageHeader>

/**
 * Toàn bộ trạng thái thật của SubPageHeader: chỉ có tiêu đề (không mô tả), có
 * mô tả ngắn, mô tả rỗng chuỗi (edge case vẫn chiếm chỗ), mô tả dài tràn quá
 * 3 dòng (clamp), và tiêu đề dài tự xuống dòng — tất cả đặt trong khung hẹp
 * để lộ đúng điểm ngắt dòng/clamp.
 */
export const AllVariants: Story = {
    parameters: {
        usage: "Dựng cạnh nhau mọi trạng thái thật của SubPageHeader để soi bố cục tiêu đề/mô tả trước khi ghép vào đầu trang con — không phải nơi kiểm tra logic điều hướng của onBack.",
    },
    render: () => (
        <Gallery>
            <Variant
                label="Chỉ có tiêu đề, không có mô tả"
                hint="description = undefined → khối mô tả không render, dùng cho trang con không cần giải thích thêm ngay dưới tiêu đề."
            >
                <div className="max-w-sm">
                    <SubPageHeader
                        title="Đổi mật khẩu"
                        onBack={() => {}}
                    />
                </div>
            </Variant>
            <Variant
                label="Tiêu đề + mô tả ngắn"
                hint="Trường hợp phổ biến nhất: một dòng mô tả gọn, không chạm ngưỡng 3 dòng clamp."
            >
                <div className="max-w-sm">
                    <SubPageHeader
                        title="Thông tin thanh toán"
                        description="Quản lý thẻ và phương thức thanh toán đã lưu."
                        onBack={() => {}}
                    />
                </div>
            </Variant>
            <Variant
                label="Mô tả là chuỗi rỗng"
                hint="Edge case: description là chuỗi rỗng, khác undefined, nên khối mô tả vẫn render (chiếm chỗ) nhưng không có chữ nào hiển thị."
            >
                <div className="max-w-sm">
                    <SubPageHeader
                        title="Lịch sử giao dịch"
                        description=""
                        onBack={() => {}}
                    />
                </div>
            </Variant>
            <Variant
                label="Mô tả dài tràn quá 3 dòng (clamp)"
                hint="Khung hẹp bên dưới để lộ đúng điểm line-clamp-3: chữ dừng ở dòng 3 rồi bị cắt, không kéo dài đầu trang."
            >
                <div className="max-w-sm">
                    <SubPageHeader
                        title="Cấu hình cổng thanh toán"
                        description="Thiết lập SePay và PayOS, chọn cổng thanh toán mặc định cho học viên mới, cấu hình các gói trả góp áp dụng theo từng khóa học, và theo dõi trạng thái giao dịch theo thời gian thực ngay tại đây."
                        onBack={() => {}}
                    />
                </div>
            </Variant>
            <Variant
                label="Tiêu đề dài tự xuống dòng"
                hint="Tiêu đề không bị line-clamp, chỉ wrap tự nhiên khi khung hẹp — kiểm tra tiêu đề nhiều dòng không đè lên nút Back."
            >
                <div className="max-w-sm">
                    <SubPageHeader
                        title="Cài đặt thông báo và quyền riêng tư tài khoản"
                        description="Bật hoặc tắt từng loại thông báo."
                        onBack={() => {}}
                    />
                </div>
            </Variant>
            <Variant
                label="backAriaLabel tuỳ biến"
                hint="Ghi đè nhãn accessibility mặc định (common.back) khi ngữ cảnh cần nói rõ quay lại đâu, ví dụ từ một luồng lồng nhau."
            >
                <div className="max-w-sm">
                    <SubPageHeader
                        title="Xác nhận huỷ đăng ký"
                        description="Quay lại trang danh sách khóa học đã đăng ký."
                        backAriaLabel="Quay lại danh sách khóa học"
                        onBack={() => {}}
                    />
                </div>
            </Variant>
        </Gallery>
    ),
}
