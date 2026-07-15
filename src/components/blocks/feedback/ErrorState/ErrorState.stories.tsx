import type { Meta, StoryObj } from "@storybook/nextjs"
import { ErrorState } from "./index"

const meta: Meta<typeof ErrorState> = {
    title: "Blocks/ErrorState",
    component: ErrorState,
}
export default meta
type Story = StoryObj<typeof ErrorState>

/** Dùng khi tải dữ liệu thất bại và có thể thử lại ngay: hiển thị tiêu đề, mô tả ngắn và nút thử lại. */
export const Default: Story = {
    parameters: { usage: "Dùng khi tải dữ liệu thất bại và có thể thử lại ngay: hiển thị tiêu đề, mô tả ngắn và nút thử lại." },
    render: () => (
        <ErrorState
            title="Không thể tải dữ liệu"
            description="Đã có lỗi xảy ra trong lúc tải nội dung. Vui lòng thử lại."
            retryLabel="Thử lại"
            onRetry={() => {}}
        />
    ),
}

/** Dùng khi chỉ cần báo lỗi ngắn gọn mà không có hành động khắc phục nào khả dụng (không có mô tả, không có nút thử lại). */
export const TitleOnly: Story = {
    parameters: { usage: "Dùng khi chỉ cần báo lỗi ngắn gọn mà không có hành động khắc phục nào khả dụng (không có mô tả, không có nút thử lại)." },
    render: () => <ErrorState title="Đã xảy ra lỗi" />,
}

/** Dùng khi cần giải thích rõ nguyên nhân lỗi cho người dùng nhưng thao tác thử lại không áp dụng được ở màn này. */
export const WithoutRetry: Story = {
    parameters: { usage: "Dùng khi cần giải thích rõ nguyên nhân lỗi cho người dùng nhưng thao tác thử lại không áp dụng được ở màn này." },
    render: () => (
        <ErrorState
            title="Không tìm thấy khóa học"
            description="Khóa học này có thể đã bị gỡ hoặc đường dẫn không còn hợp lệ."
        />
    ),
}

/** Dùng khi thông báo lỗi dài để kiểm tra việc xuống dòng và căn giữa của mô tả không bị vỡ bố cục. */
export const LongDescription: Story = {
    parameters: { usage: "Dùng khi thông báo lỗi dài để kiểm tra việc xuống dòng và căn giữa của mô tả không bị vỡ bố cục." },
    render: () => (
        <ErrorState
            title="Kết nối máy chủ bị gián đoạn"
            description="Hệ thống đang gặp sự cố kết nối tới máy chủ, có thể do đường truyền mạng không ổn định hoặc máy chủ đang bảo trì định kỳ. Vui lòng kiểm tra kết nối mạng của bạn rồi thử lại sau ít phút."
            retryLabel="Thử lại"
            onRetry={() => {}}
        />
    ),
}

/** Dùng khi muốn tuỳ biến vị trí/khoảng cách của khối lỗi để phù hợp với khung chứa cụ thể (truyền className tuỳ biến). */
export const CustomSpacing: Story = {
    parameters: { usage: "Dùng khi muốn tuỳ biến vị trí/khoảng cách của khối lỗi để phù hợp với khung chứa cụ thể (truyền className tuỳ biến)." },
    render: () => (
        <ErrorState
            className="py-12"
            title="Không thể tải danh sách bài học"
            description="Vui lòng thử tải lại trang."
            retryLabel="Tải lại"
            onRetry={() => {}}
        />
    ),
}
