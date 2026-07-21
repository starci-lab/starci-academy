import type { Meta, StoryObj } from "@storybook/nextjs"
import React from "react"
import { ChatBubble } from "./ChatBubble"
import { blockShell } from "../../../block-anatomy"

const meta: Meta<typeof ChatBubble> = {
    title: "Block/Feed/ChatBubble",
    component: ChatBubble,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof ChatBubble>

const ANATOMY = {
    primitives: [
        { name: "div", role: "khung bong bóng tint + căn lề theo role" },
    ],
    reason:
        "Mỗi lượt tin trong khung chat (ChatPanel) cần một bong bóng căn lề + tint đúng người nói. Đây là mảnh dựng nền cho ChatPanel — gần một PRIMITIVE một-phần-tử (xem FLAGS), tách ra để mọi surface chat tái dùng.",
}

export const RoleUser: Story = {
    render: () =>
        blockShell(
            <div className="w-96">
                <ChatBubble role="user">Làm sao để debug memory leak trong Node.js?</ChatBubble>
            </div>,
            ANATOMY,
        ),
}

export const RoleAssistant: Story = {
    render: () =>
        blockShell(
            <div className="w-96">
                <ChatBubble role="assistant">
                    Bạn thử chạy node --inspect rồi soi heap snapshot trước xem sao.
                </ChatBubble>
            </div>,
            ANATOMY,
        ),
}

export const DataOverflow: Story = {
    render: () =>
        blockShell(
            <div className="w-80">
                <ChatBubble role="assistant">
                    Memory leak trong Node.js thường xuất phát từ closure giữ tham chiếu
                    biến ngoài scope lâu hơn cần thiết, listener đăng ký mà quên gỡ, hoặc
                    cache tự phình không có giới hạn kích thước. Bạn nên chụp heap snapshot
                    ở hai mốc thời gian cách nhau, so sánh phần tăng bất thường bằng
                    Chrome DevTools để khoanh vùng chính xác đối tượng bị giữ lại.
                </ChatBubble>
            </div>,
            ANATOMY,
        ),
}

export const RichNode: Story = {
    render: () =>
        blockShell(
            <div className="w-96">
                <ChatBubble role="assistant">
                    <div className="flex flex-col gap-1">
                        <span>Ba hướng để soi lỗi:</span>
                        <span>1. Chụp heap snapshot hai lần, so sánh phần tăng.</span>
                        <span>2. Rà lại listener chưa được gỡ.</span>
                        <span>3. Đặt giới hạn kích thước cho mọi cache trong bộ nhớ.</span>
                    </div>
                </ChatBubble>
            </div>,
            ANATOMY,
        ),
}
