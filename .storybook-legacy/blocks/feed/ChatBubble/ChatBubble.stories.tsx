import type { Meta, StoryObj } from "@storybook/nextjs"
import { ChatBubble } from "@/components/blocks/feed/ChatBubble"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof ChatBubble> = {
    title: "Legacy/Blocks/Feed/ChatBubble",
    component: ChatBubble,
}
export default meta
type Story = StoryObj<typeof ChatBubble>

/**
 * Every role and content shape a ChatBubble renders in a chat surface such as
 * ChatPanel: a short user turn, a short assistant turn, a long assistant turn
 * that must wrap inside the 85% max-width, and a turn whose content is a
 * multi-paragraph node rather than a plain string.
 */
export const AllVariants: Story = {
    parameters: { usage: "Dùng ChatBubble để dựng mỗi lượt tin trong một khung chat như ChatPanel: chọn role để lệch phải/trái đúng người nói, và để children nhận bất kỳ node nào — chuỗi ngắn, đoạn dài cần xuống dòng, hay danh sách gợi ý nhiều dòng." },
    render: () => (
        <Gallery>
            <Variant
                label="Người dùng — tin ngắn"
                hint="Tin của học viên căn phải, tint accent nhạt — dùng khi hiển thị câu hỏi vừa gõ trong khung chat."
            >
                <ChatBubble role="user">
                    Làm sao để debug memory leak trong Node.js?
                </ChatBubble>
            </Variant>
            <Variant
                label="Trợ lý — tin ngắn"
                hint="Tin của trợ lý căn trái, tint surface phụ — dùng khi phản hồi ngắn, một câu là đủ ý."
            >
                <ChatBubble role="assistant">
                    Bạn thử chạy `node --inspect` rồi soi heap snapshot trước xem sao.
                </ChatBubble>
            </Variant>
            <Variant
                label="Trợ lý — tin dài"
                hint="Nội dung dài phải xuống dòng gọn trong 85% chiều rộng, không phá layout khung chat hẹp."
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
            </Variant>
            <Variant
                label="Nội dung nhiều dòng"
                hint="Children nhận cả node phức tạp, không chỉ chuỗi thô — ví dụ trả lời kèm danh sách gợi ý gạch đầu dòng."
            >
                <ChatBubble role="assistant">
                    <div className="flex flex-col gap-1">
                        <span>Ba hướng để soi lỗi:</span>
                        <span>1. Chụp heap snapshot hai lần, so sánh phần tăng.</span>
                        <span>2. Rà lại listener chưa được gỡ.</span>
                        <span>3. Đặt giới hạn kích thước cho mọi cache trong bộ nhớ.</span>
                    </div>
                </ChatBubble>
            </Variant>
        </Gallery>
    ),
}

/**
 * Tin của người dùng: căn phải, tint accent nhạt — một trong hai role bắt buộc
 * của block, dùng khi hiển thị câu hỏi vừa gõ trong khung chat.
 */
export const RoleUser: Story = {
    render: () => (
        <ChatBubble role="user">
            Làm sao để debug memory leak trong Node.js?
        </ChatBubble>
    ),
    parameters: {
        usage:
            "Tin của người dùng: căn phải, tint accent-soft — dùng khi hiển thị câu hỏi vừa gõ trong khung chat.",
    },
}

/**
 * Tin của trợ lý: căn trái, tint surface phụ — role đối xứng còn lại, dùng
 * cho phản hồi ngắn khi một câu là đủ ý.
 */
export const RoleAssistant: Story = {
    render: () => (
        <ChatBubble role="assistant">
            Bạn thử chạy `node --inspect` rồi soi heap snapshot trước xem sao.
        </ChatBubble>
    ),
    parameters: {
        usage: "Tin của trợ lý: căn trái, tint surface-secondary — role đối xứng còn lại.",
    },
}

/**
 * Nội dung dài phải xuống dòng gọn trong max-w-[85%], không phá layout khung
 * chat hẹp — chứng minh block xử lý được đoạn văn dài mà không cần rút ngắn.
 */
export const DataOverflow: Story = {
    render: () => (
        <div className="w-80">
            <ChatBubble role="assistant">
                Memory leak trong Node.js thường xuất phát từ closure giữ tham chiếu
                biến ngoài scope lâu hơn cần thiết, listener đăng ký mà quên gỡ, hoặc
                cache tự phình không có giới hạn kích thước. Bạn nên chụp heap snapshot
                ở hai mốc thời gian cách nhau, so sánh phần tăng bất thường bằng
                Chrome DevTools để khoanh vùng chính xác đối tượng bị giữ lại.
            </ChatBubble>
        </div>
    ),
    parameters: {
        usage:
            "Nội dung dài phải wrap gọn trong max-w-[85%], không phá layout khung chat hẹp.",
    },
}

/**
 * `children` nhận một ReactNode nhiều dòng chứ không chỉ chuỗi thô — ví dụ
 * trả lời kèm danh sách gợi ý, mỗi ý một dòng riêng.
 */
export const RichNode: Story = {
    render: () => (
        <ChatBubble role="assistant">
            <div className="flex flex-col gap-1">
                <span>Ba hướng để soi lỗi:</span>
                <span>1. Chụp heap snapshot hai lần, so sánh phần tăng.</span>
                <span>2. Rà lại listener chưa được gỡ.</span>
                <span>3. Đặt giới hạn kích thước cho mọi cache trong bộ nhớ.</span>
            </div>
        </ChatBubble>
    ),
    parameters: {
        usage:
            "children là ReactNode: render node nhiều dòng (list gợi ý) chứ không chỉ chuỗi thô.",
    },
}
