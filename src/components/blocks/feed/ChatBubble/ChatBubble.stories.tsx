import type { Meta, StoryObj } from "@storybook/nextjs"
import { ChatBubble } from "./index"

const meta: Meta<typeof ChatBubble> = {
    title: "Blocks/Feed/ChatBubble",
    component: ChatBubble,
    parameters: { layout: "centered" },
}
export default meta
type Story = StoryObj<typeof ChatBubble>

/** So sánh cả hai vai trò cạnh nhau: người dùng căn phải nhấn nhẹ, trợ lý căn trái trên surface phụ. */
export const Conversation: Story = {
    parameters: {
        usage:
            "Dùng khi cần đối chiếu nhanh cả hai vai trò của bong bóng chat trong cùng một khung nhìn — người dùng (căn phải, tông nhấn nhẹ) và trợ lý AI (căn trái, nền surface phụ).",
    },
    render: () => (
        <div className="flex w-[360px] flex-col gap-4">
            <div className="flex flex-col gap-1">
                <span className="text-xs text-muted">Người dùng</span>
                <ChatBubble role="user">
                    Cho mình hỏi khoá học System Design có bài tập thực hành không?
                </ChatBubble>
            </div>
            <div className="flex flex-col gap-1">
                <span className="text-xs text-muted">Trợ lý AI</span>
                <ChatBubble role="assistant">
                    Chào bạn, mình có thể giúp gì cho bạn hôm nay?
                </ChatBubble>
            </div>
        </div>
    ),
}

/** Dùng khi nội dung tin nhắn dài, cần kiểm tra bong bóng chat co giãn và xuống dòng đúng cách. */
export const LongContent: Story = {
    parameters: {
        usage:
            "Dùng khi nội dung tin nhắn dài, cần kiểm tra bong bóng chat co giãn và xuống dòng đúng cách.",
    },
    render: () => (
        <div className="w-[400px]">
            <ChatBubble role="assistant">
                Đây là một tin nhắn khá dài để kiểm tra việc bong bóng chat có tự động xuống
                dòng hợp lý hay không, đồng thời vẫn giữ chiều rộng tối đa 85% so với vùng chứa
                bên ngoài, tránh tràn ra ngoài màn hình trên các thiết bị nhỏ.
            </ChatBubble>
        </div>
    ),
}
