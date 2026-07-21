import type { Meta, StoryObj } from "@storybook/nextjs"
import { Typography } from "@heroui/react"
import { ChatCircleDotsIcon } from "@phosphor-icons/react"
import { ChatPanel } from "@/components/blocks/feed/ChatPanel"
import { Gallery, Variant } from "../../../../story-kit"
import { baseMessages, Controlled } from "./components"

const meta: Meta<typeof ChatPanel> = {
    title: "Features/Social/ChatPanel",
    component: ChatPanel,
}
export default meta
type Story = StoryObj<typeof ChatPanel>

/**
 * Toàn bộ trạng thái của ChatPanel: hội thoại đang diễn ra (một lượt gắn kèm
 * nguồn tham khảo), chưa có tin nhắn nào (empty-state slot), và trợ lý đang
 * soạn trả lời (chỉ báo ba chấm). Dùng để tra panel hiện gì ở từng trạng thái.
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="Hội thoại"
                hint="Một vài lượt hỏi-đáp qua lại, trong đó lượt trả lời của trợ lý gắn kèm NestedCard liệt kê các bài học liên quan tìm được."
            >
                <Controlled initialMessages={baseMessages} />
            </Variant>
            <Variant
                label="Chưa có tin nhắn"
                hint="Khi hội thoại chưa bắt đầu, khu vực danh sách hiện một empty-state slot ở giữa thay vì để trống, Composer ở dưới vẫn sẵn sàng cho câu hỏi đầu tiên."
            >
                <Controlled
                    initialMessages={[]}
                    emptyState={(
                        <div className="flex flex-col items-center gap-2 text-center">
                            <ChatCircleDotsIcon aria-hidden focusable="false" className="size-8 text-muted" />
                            <Typography type="body-sm" color="muted">
                                No messages yet. Ask the teaching assistant your first question.
                            </Typography>
                        </div>
                    )}
                />
            </Variant>
            <Variant
                label="Trợ lý đang soạn trả lời"
                hint="Bật isTyping để hiện chỉ báo ba chấm nhấp nháy ở phía trợ lý bên dưới tin nhắn cuối, panel tự cuộn để giữ chỉ báo trong khung nhìn."
            >
                <Controlled initialMessages={baseMessages.slice(0, 3)} isTyping />
            </Variant>
        </Gallery>
    ),
    parameters: {
        usage:
            "Toàn bộ trạng thái của ChatPanel: một hội thoại đầy đủ với danh sách tin nhắn cuộn được và " +
            "Composer ghim ở dưới, mỗi tin nhắn là một ChatBubble theo role, lượt của trợ lý có thể gắn " +
            "NestedCard các bài học liên quan; trạng thái chưa có tin nhắn nào hiện empty-state slot; và " +
            "trạng thái trợ lý đang soạn trả lời với chỉ báo ba chấm. Dùng khi cần tra panel hiện gì ở mỗi trạng thái.",
    },
}
