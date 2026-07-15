import type { Meta, StoryObj } from "@storybook/nextjs"
import { ErrorState } from "./index"

const meta: Meta<typeof ErrorState> = {
    title: "Blocks/Feedback/ErrorState",
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

/** Dùng khi lỗi không kèm hành động khắc phục: so sánh biến thể chỉ có tiêu đề và biến thể có thêm mô tả, đều không hiện nút thử lại. */
export const WithoutRetry: Story = {
    parameters: { usage: "Dùng khi lỗi không kèm hành động khắc phục: so sánh biến thể chỉ có tiêu đề và biến thể có thêm mô tả, đều không hiện nút thử lại." },
    render: () => (
        <div className="flex flex-col gap-6 sm:flex-row">
            <div className="flex flex-1 flex-col items-center gap-2">
                <span className="text-xs text-default-500">Chỉ tiêu đề</span>
                <ErrorState title="Đã xảy ra lỗi" />
            </div>
            <div className="flex flex-1 flex-col items-center gap-2">
                <span className="text-xs text-default-500">Tiêu đề và mô tả</span>
                <ErrorState
                    title="Không tìm thấy khóa học"
                    description="Khóa học này có thể đã bị gỡ hoặc đường dẫn không còn hợp lệ."
                />
            </div>
        </div>
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
