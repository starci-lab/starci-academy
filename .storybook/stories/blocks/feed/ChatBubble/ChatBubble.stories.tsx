import type { Meta, StoryObj } from "@storybook/nextjs"
import React from "react"
import { ChatBubble } from "./ChatBubble"
import { BlockAnatomy, type AnatomyNode } from "../../layout/BlockAnatomy/BlockAnatomy"

/**
 * DESIGN — a single chat-message bubble: align + tint by author, closer to a
 * PRIMITIVE than a composite.
 *
 * ANATOMY IS PER-LEAF: each story below is its OWN leaf and wraps its render in
 * its OWN BlockAnatomy (Sơ đồ + Cây) reflecting the parts THAT leaf composes —
 * there is no separate consolidated "Anatomy" story. Every leaf here shares ONE
 * composition (role only flips alignment + tint), so they reuse one PARTS set.
 *
 * ChatBubble composes NO sub-components — its row/bubble divs are plain
 * alignment + tint chrome wrapping `children` (an element-render-prop), not
 * composed parts — so per canon granularity that PARTS set is EMPTY; the whole
 * render is one atomic "ChatBubble" node (mirrors how ChatPanel's own tree lists
 * `ChatBubble` as a single opaque leaf, never expanding into it).
 */
const meta: Meta<typeof ChatBubble> = {
    title: "Design/Feed/ChatBubble",
    component: ChatBubble,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof ChatBubble>

/** Plain canvas — each leaf's BlockAnatomy panel sits inside it. */
const frame = (node: React.ReactNode) => <div className="p-8">{node}</div>

// Every leaf shares this composition — ChatBubble composes no sub-components, so
// there are no parts to list (its row/bubble divs just align + tint `children`).
const CHAT_BUBBLE_PARTS: Array<AnatomyNode> = []

/** Plain baseline: a short assistant message. */
export const Default: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="ChatBubble"
                tier="design"
                leaf="Default"
                parts={CHAT_BUBBLE_PARTS}
                reason="Mỗi lượt tin trong khung chat (ChatPanel) cần một bong bóng căn lề + tint đúng người nói. Đây là mảnh dựng nền cho ChatPanel — gần một PRIMITIVE một-phần-tử (xem FLAGS), tách ra để mọi surface chat tái dùng."
            >
                <div className="w-96">
                    <ChatBubble role="assistant">Chào bạn, mình có thể giúp gì hôm nay?</ChatBubble>
                </div>
            </BlockAnatomy>,
        ),
}

export const RoleUser: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="ChatBubble"
                tier="design"
                leaf="RoleUser"
                parts={CHAT_BUBBLE_PARTS}
                note="Role user → row căn phải, bubble đổi sang accent-soft; CÙNG composition."
            >
                <div className="w-96">
                    <ChatBubble role="user">Làm sao để debug memory leak trong Node.js?</ChatBubble>
                </div>
            </BlockAnatomy>,
        ),
}

export const RoleAssistant: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="ChatBubble"
                tier="design"
                leaf="RoleAssistant"
                parts={CHAT_BUBBLE_PARTS}
                note="Role assistant → row căn trái, bubble surface-secondary; CÙNG composition."
            >
                <div className="w-96">
                    <ChatBubble role="assistant">
                        Bạn thử chạy node --inspect rồi soi heap snapshot trước xem sao.
                    </ChatBubble>
                </div>
            </BlockAnatomy>,
        ),
}

export const DataOverflow: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="ChatBubble"
                tier="design"
                leaf="DataOverflow"
                parts={CHAT_BUBBLE_PARTS}
                note="Text dài → bubble bị chặn max-w-[85%] và xuống dòng; composition không đổi."
            >
                <div className="w-80">
                    <ChatBubble role="assistant">
                        Memory leak trong Node.js thường xuất phát từ closure giữ tham chiếu
                        biến ngoài scope lâu hơn cần thiết, listener đăng ký mà quên gỡ, hoặc
                        cache tự phình không có giới hạn kích thước. Bạn nên chụp heap snapshot
                        ở hai mốc thời gian cách nhau, so sánh phần tăng bất thường bằng
                        Chrome DevTools để khoanh vùng chính xác đối tượng bị giữ lại.
                    </ChatBubble>
                </div>
            </BlockAnatomy>,
        ),
}

export const RichNode: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="ChatBubble"
                tier="design"
                leaf="RichNode"
                parts={CHAT_BUBBLE_PARTS}
                note="children là node cấu trúc (list nhiều dòng) thay cho chuỗi; bubble vẫn là cùng khung."
            >
                <div className="w-96">
                    <ChatBubble role="assistant">
                        <div className="flex flex-col gap-1">
                            <span>Ba hướng để soi lỗi:</span>
                            <span>1. Chụp heap snapshot hai lần, so sánh phần tăng.</span>
                            <span>2. Rà lại listener chưa được gỡ.</span>
                            <span>3. Đặt giới hạn kích thước cho mọi cache trong bộ nhớ.</span>
                        </div>
                    </ChatBubble>
                </div>
            </BlockAnatomy>,
        ),
}
