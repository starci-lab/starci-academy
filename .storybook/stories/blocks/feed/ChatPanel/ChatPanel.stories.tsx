import type { Meta, StoryObj } from "@storybook/nextjs"
import React, { useState } from "react"
import type { ReactNode } from "react"
import { Typography } from "@heroui/react"
import { ChatCircleDotsIcon } from "@phosphor-icons/react"
import { ChatPanel, type ChatPanelMessage } from "./ChatPanel"
import { NestedCard, NestedCardSection } from "../../cards/NestedCard/NestedCard"
import { blockShell } from "../../../block-anatomy"

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

const ANATOMY = {
    primitives: [
        { name: "ChatBubble", role: "mỗi lượt tin theo role (user/assistant)" },
        { name: "Composer", role: "ô soạn tin ghim đáy panel" },
        { name: "NestedCard", role: "tool-result gắn dưới lượt trợ lý (nguồn tham khảo)" },
    ],
    reason:
        "Một surface chat hoàn chỉnh: danh sách tin cuộn được + typing indicator + empty-state + ô soạn ghim đáy, tự cuộn xuống lượt mới nhất. Gói ChatBubble + Composer + auto-scroll vào một block để mọi feature chat props-only là chạy.",
}

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
            <NestedCard title="Related lessons" bordered>
                <NestedCardSection
                    eyebrow="Relational databases"
                    title="Data normalization and the normal forms"
                >
                    <Typography type="body-sm" color="muted">
                        Normalization splits data across multiple tables to reduce duplication and update anomalies.
                    </Typography>
                </NestedCardSection>
                <NestedCardSection
                    eyebrow="Database review flashcard deck"
                    title="When should you denormalize to optimize reads?"
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
}: {
    initialMessages: Array<ChatPanelMessage>
    isTyping?: boolean
    emptyState?: ReactNode
}) => {
    const [messages, setMessages] = useState(initialMessages)
    const [draft, setDraft] = useState("")
    return (
        <div className="w-[36rem] max-w-full">
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
                    placeholder: "Ask the teaching assistant...",
                    avatarSrc: "https://i.pravatar.cc/80?img=12",
                }}
            />
        </div>
    )
}

export const Conversation: Story = {
    render: () => blockShell(<Controlled initialMessages={baseMessages} />, ANATOMY),
}

export const Empty: Story = {
    render: () =>
        blockShell(
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
            />,
            ANATOMY,
        ),
}

export const Typing: Story = {
    render: () => blockShell(<Controlled initialMessages={baseMessages.slice(0, 3)} isTyping />, ANATOMY),
}
