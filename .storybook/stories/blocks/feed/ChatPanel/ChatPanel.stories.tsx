import type { Meta, StoryObj } from "@storybook/nextjs"
import React, { useState } from "react"
import type { ReactNode } from "react"
import { Typography } from "@heroui/react"
import { ChatCircleDotsIcon } from "@phosphor-icons/react"
import { ChatPanel, type ChatPanelMessage } from "./ChatPanel"
import { NestedCard, NestedCardSection } from "../../cards/NestedCard/NestedCard"
import { BlockAnatomy, type AnatomyNode } from "../../layout/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — a complete chat surface: a scrollable list of turns (with tool-result
 * rows under assistant turns), an optional typing indicator, an empty-state slot,
 * and a sticky-bottom composer that auto-scrolls to the newest turn.
 *
 * ANATOMY IS PER-LEAF: each story below is its OWN leaf and wraps its render in
 * its OWN BlockAnatomy reflecting the parts THAT leaf composes — there is no
 * separate consolidated "Anatomy" story.
 */
const meta: Meta<typeof ChatPanel> = {
    title: "Block/Feed/ChatPanel",
    component: ChatPanel,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof ChatPanel>

/** Plain canvas that frames each leaf's anatomy panel. */
const shell = (node: React.ReactNode) => <div className="p-8">{node}</div>

// Sticky-bottom composer (own Block story → tier "block"). It OWNS its row: an
// optional leading avatar, the auto-growing HeroUI field, and the Send button.
const COMPOSER_PART: AnatomyNode = {
    name: "Composer",
    tier: "block",
    role: "ô soạn tin ghim đáy panel",
    children: [
        { name: "UserAvatar", tier: "primitive", role: "avatar người soạn ở đầu hàng (tuỳ chọn)" },
        { name: "TextField · TextArea", tier: "primitive", role: "ô nhập tự giãn cao (HeroUI field)" },
        { name: "Button", tier: "primitive", role: "nút Send + spinner khi đang gửi" },
    ],
}

// Tool-result row under an assistant turn: the caller-built NestedCard, which
// CONTAINS its section rows. NestedCardSection's eyebrow/title are its own props
// (rendered internally, untaggable) and its body is an element-render-prop of
// `children` — cut per canon granularity; NestedCardSection absorbs them as ONE node.
const TOOL_RESULT_PART: AnatomyNode = {
    name: "NestedCard",
    tier: "design",
    role: "tool-result gắn dưới lượt trợ lý (nguồn tham khảo)",
    children: [
        { name: "NestedCardSection", tier: "design", role: "mỗi nguồn một hàng (eyebrow + tiêu đề + mô tả)" },
    ],
}

// Conversation leaf: the real turns — bubbles, a tool-result card nested under the
// assistant turn, and the composer with its own field/avatar/Send inside.
const CONVERSATION_PARTS: Array<AnatomyNode> = [
    { name: "ChatBubble", tier: "design", role: "mỗi lượt tin theo role (user/assistant)" },
    TOOL_RESULT_PART,
    COMPOSER_PART,
]

// Typing leaf: same turns + the three-dot indicator standing in for the pending reply.
const TYPING_PARTS: Array<AnatomyNode> = [
    { name: "ChatBubble", tier: "design", role: "mỗi lượt tin theo role (user/assistant)" },
    TOOL_RESULT_PART,
    { name: "Typing indicator", tier: "primitive", role: "ba chấm nảy phía trợ lý đang gõ", state: "typing" },
    COMPOSER_PART,
]

// Empty leaf: no turns — the centered empty-state slot is a caller-filled SLOT
// (its icon + dòng nhắc are element-render-props of whatever ReactNode the FEATURE
// hands `emptyState`) — cut per canon granularity; the slot absorbs them as ONE
// node. Composer still pinned at the bottom.
const EMPTY_PARTS: Array<AnatomyNode> = [
    { name: "Empty state", tier: "primitive", role: "slot canh giữa khi danh sách rỗng (icon + dòng nhắc do feature cấp)" },
    COMPOSER_PART,
]

const baseMessages: Array<ChatPanelMessage> = [
    {
        id: "m1",
        role: "user",
        content: "Can I ask when I should split one table into several smaller tables?",
    },
    {
        id: "m2",
        role: "assistant",
        content: "Usually when you notice data repeating across many rows, or a column that depends on a non-primary-key column. I found a few sources in the course related to this question.",
        toolResult: (
            <NestedCard title="Related lessons" bordered anatPart="NestedCard">
                <NestedCardSection
                    eyebrow="Relational databases"
                    title="Data normalization and the normal forms"
                    anatPart="NestedCardSection"
                >
                    <Typography type="body-sm" color="muted">
                        Normalization splits data across multiple tables to reduce duplication and update anomalies.
                    </Typography>
                </NestedCardSection>
                <NestedCardSection
                    eyebrow="Database review flashcard deck"
                    title="When should you denormalize to optimize reads?"
                    anatPart="NestedCardSection"
                />
            </NestedCard>
        ),
    },
    {
        id: "m3",
        role: "user",
        content: "Got it, so denormalization is the opposite then, right?",
    },
    {
        id: "m4",
        role: "assistant",
        content: "Exactly. Denormalization deliberately merges data back together to read faster, at the cost of duplicated data and having to update it in several places.",
    },
]

/** Wrapper owning the composer draft + the message list — the controlled flow. */
const Controlled = ({
    initialMessages,
    isTyping,
    emptyState,
    showAnatomy,
}: {
    initialMessages: Array<ChatPanelMessage>
    isTyping?: boolean
    emptyState?: ReactNode
    showAnatomy?: boolean
}) => {
    const [messages, setMessages] = useState(initialMessages)
    const [draft, setDraft] = useState("")
    return (
        <div className="w-[36rem] max-w-full">
            <ChatPanel
                messages={messages}
                isTyping={isTyping}
                emptyState={emptyState}
                showAnatomy={showAnatomy}
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
                    placeholder: "Ask the teaching assistant...",
                    avatarSrc: "https://i.pravatar.cc/80?img=12",
                }}
            />
        </div>
    )
}

export const Conversation: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="ChatPanel"
                tier="block"
                leaf="Có hội thoại"
                parts={CONVERSATION_PARTS}
                reason="Một surface chat hoàn chỉnh: danh sách tin cuộn được + typing indicator + empty-state + ô soạn ghim đáy, tự cuộn xuống lượt mới nhất. Gói ChatBubble + Composer + auto-scroll vào một block để mọi feature chat props-only là chạy."
            >
                <Controlled initialMessages={baseMessages} showAnatomy />
            </BlockAnatomy>,
        ),
}

export const Empty: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="ChatPanel"
                tier="block"
                leaf="Rỗng"
                parts={EMPTY_PARTS}
                note="Không có lượt tin → danh sách nhường chỗ cho empty-state slot (icon + dòng nhắc), KHÔNG có ChatBubble; composer vẫn ghim đáy."
            >
                <Controlled
                    initialMessages={[]}
                    showAnatomy
                    emptyState={(
                        <div className="flex flex-col items-center gap-2 text-center">
                            <ChatCircleDotsIcon aria-hidden focusable="false" className="size-8 text-muted" />
                            <Typography type="body-sm" color="muted">
                                No messages yet. Ask the teaching assistant your first question.
                            </Typography>
                        </div>
                    )}
                />
            </BlockAnatomy>,
        ),
}

export const Typing: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="ChatPanel"
                tier="block"
                leaf="Đang gõ"
                parts={TYPING_PARTS}
                note="Trợ lý đang soạn → dưới lượt cuối thêm typing indicator ba chấm nảy; phần còn lại cùng composition với leaf 'Có hội thoại'."
            >
                <Controlled initialMessages={baseMessages.slice(0, 3)} isTyping showAnatomy />
            </BlockAnatomy>,
        ),
}
