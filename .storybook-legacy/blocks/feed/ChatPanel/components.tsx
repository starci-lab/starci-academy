import { useState } from "react"
import type { ReactNode } from "react"
import { Typography } from "@heroui/react"
import { StackIcon } from "@phosphor-icons/react"
import { ChatPanel, type ChatPanelMessage } from "@/components/blocks/feed/ChatPanel"
import { NestedCard, NestedCardSection } from "@/components/blocks/cards/NestedCard"

/** A ready-made conversation for quickly building static stories. */
export const baseMessages: Array<ChatPanelMessage> = [
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
            <NestedCard
                title="Related lessons"
                bordered
                icon={<StackIcon aria-hidden focusable="false" className="size-4 text-muted" />}
            >
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

/**
 * Wrapper that owns the composer draft + the message list, faithfully simulating the controlled
 * flow: sending appends a user turn then clears the draft, and the panel auto-scrolls to the bottom.
 */
export const Controlled = ({
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
                placeholder: "Ask the teaching assistant...",
                avatarSrc: "https://i.pravatar.cc/80?img=12",
            }}
        />
    )
}
