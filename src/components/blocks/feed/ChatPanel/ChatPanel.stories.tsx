import { useState } from "react"
import type { ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { ArrowRightIcon, ChatCircleDotsIcon, StackIcon } from "@phosphor-icons/react"
import { ChatPanel, type ChatPanelMessage } from "./index"
import { NestedCard, NestedCardSection } from "@/components/blocks/cards/NestedCard"

const meta: Meta<typeof ChatPanel> = {
    title: "Block/Feed/ChatPanel",
    component: ChatPanel,
}
export default meta
type Story = StoryObj<typeof ChatPanel>

/** Link kiểu "Đọc →" cho action mỗi section của NestedCard bài liên quan. */
const ActionLink = ({ children }: { children: string }) => (
    <span className="flex items-center gap-1 text-accent-soft-foreground">
        <Typography type="body-sm" weight="medium">{children}</Typography>
        <ArrowRightIcon aria-hidden focusable="false" className="size-4" />
    </span>
)

/** Một đoạn hội thoại có sẵn để dựng nhanh các story tĩnh. */
const baseMessages: Array<ChatPanelMessage> = [
    {
        id: "m1",
        role: "user",
        content: "Cho mình hỏi khi nào nên tách một bảng thành nhiều bảng nhỏ hơn?",
    },
    {
        id: "m2",
        role: "assistant",
        content: "Thường là khi bạn thấy dữ liệu bị lặp lại nhiều dòng hoặc một cột phụ thuộc vào cột không phải khoá chính. Mình tìm được vài nguồn trong khoá liên quan tới câu này.",
        toolResult: (
            <NestedCard
                title="Bài liên quan"
                icon={<StackIcon aria-hidden focusable="false" className="size-4 text-muted" />}
                trailing={<Typography type="body-xs" color="muted">2</Typography>}
            >
                <NestedCardSection
                    eyebrow="Cơ sở dữ liệu quan hệ"
                    title="Chuẩn hoá dữ liệu và các dạng chuẩn"
                    action={<ActionLink>Đọc</ActionLink>}
                >
                    <Typography type="body-sm" color="muted">
                        Chuẩn hoá tách dữ liệu thành nhiều bảng để giảm trùng lặp và bất thường khi cập nhật.
                    </Typography>
                </NestedCardSection>
                <NestedCardSection
                    eyebrow="Bộ thẻ ôn cơ sở dữ liệu"
                    title="Khi nào nên khử chuẩn hoá để tối ưu đọc?"
                    action={<ActionLink>Ôn</ActionLink>}
                />
            </NestedCard>
        ),
    },
    {
        id: "m3",
        role: "user",
        content: "Rõ rồi, vậy khử chuẩn hoá thì ngược lại đúng không?",
    },
    {
        id: "m4",
        role: "assistant",
        content: "Đúng vậy. Khử chuẩn hoá cố ý gộp lại để đọc nhanh hơn, đổi lại phải chấp nhận trùng dữ liệu và cập nhật ở nhiều chỗ.",
    },
]

/**
 * Wrapper sở hữu bản nháp của composer + danh sách tin, mô phỏng đúng luồng controlled:
 * gửi thì thêm một lượt của người dùng rồi xoá nháp, panel tự cuộn xuống cuối.
 */
const Controlled = ({
    initialMessages,
    isTyping,
    emptyState,
}: {
    initialMessages: Array<ChatPanelMessage>
    isTyping?: boolean
    emptyState?: ReactNode
}) => {
    const [messages, setMessages] = useState(initialMessages)
    const [draft, setDraft] = useState("")

    return (
        <ChatPanel
            messages={messages}
            isTyping={isTyping}
            emptyState={emptyState}
            composer={{
                value: draft,
                onChange: setDraft,
                onSubmit: () => {
                    const text = draft.trim()
                    if (!text) {
                        return
                    }
                    setMessages((previous) => [
                        ...previous,
                        { id: `m-${previous.length + 1}`, role: "user", content: text },
                    ])
                    setDraft("")
                },
                placeholder: "Hỏi trợ giảng...",
                avatarSrc: "https://i.pravatar.cc/80?img=12",
            }}
        />
    )
}

/** Dùng cho một cuộc trò chuyện đang diễn ra: nhiều lượt hỏi đáp, có một lượt kèm hàng nguồn tham khảo. */
export const Conversation: Story = {
    parameters: { usage: "Dùng cho bề mặt chat đầy đủ: danh sách tin cuộn được, mỗi tin là một ChatBubble theo vai, lượt của trợ giảng có thể kèm một NestedCard bài liên quan, và một Composer dính đáy để gõ lượt tiếp theo." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Hội thoại</Label>
                <Typography type="body-sm" color="muted">
                    Vài lượt hỏi đáp qua lại, trong đó một lượt của trợ giảng đính kèm danh sách bài liên quan tìm được.
                </Typography>
            </div>
            <Controlled initialMessages={baseMessages} />
        </div>
    ),
}

/** Dùng khi chưa có tin nào: vùng danh sách nhường chỗ cho slot empty-state ở giữa, composer vẫn sẵn sàng. */
export const Empty: Story = {
    parameters: { usage: "Dùng khi cuộc trò chuyện chưa bắt đầu: vùng danh sách render slot empty-state canh giữa thay vì để trống, Composer ở đáy vẫn sẵn sàng cho tin đầu tiên." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Chưa có tin</Label>
                <Typography type="body-sm" color="muted">
                    Không có tin nào thì panel hiển thị slot empty-state ở giữa vùng danh sách, mời người dùng gõ câu hỏi đầu tiên.
                </Typography>
            </div>
            <Controlled
                initialMessages={[]}
                emptyState={(
                    <div className="flex flex-col items-center gap-2 text-center">
                        <ChatCircleDotsIcon aria-hidden focusable="false" className="size-8 text-muted" />
                        <Typography type="body-sm" color="muted">
                            Chưa có tin nhắn nào. Hãy đặt câu hỏi đầu tiên cho trợ giảng.
                        </Typography>
                    </div>
                )}
            />
        </div>
    ),
}

/** Dùng khi trợ giảng đang soạn trả lời: hiện ba chấm nhấp nháy phía trái dưới tin cuối. */
export const Typing: Story = {
    parameters: { usage: "Dùng khi đối phương đang soạn trả lời: một chỉ báo ba chấm nhấp nháy hiện ở phía trợ giảng, dưới tin cuối; panel tự cuộn để giữ nó trong tầm nhìn." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Đang soạn trả lời</Label>
                <Typography type="body-sm" color="muted">
                    Bật isTyping để hiện chỉ báo ba chấm phía trợ giảng trong lúc chờ câu trả lời được sinh ra.
                </Typography>
            </div>
            <Controlled initialMessages={baseMessages.slice(0, 3)} isTyping />
        </div>
    ),
}
