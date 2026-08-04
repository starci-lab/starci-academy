import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import {
    ThreadDrawer,
    type ThreadDrawerLabels,
    type ThreadDrawerMessage,
} from "@sb-components/nivo/blocks/agent-os/ThreadDrawer/ThreadDrawer"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `ThreadDrawer` — overlay drawer over one conversation: message history by
 * author, plus an editable AI-drafted reply the operator reviews before
 * sending. New interaction vs. the legacy openclaw thread: the draft
 * composer is editable, and sending it is this drawer's own primary action.
 */
const meta: Meta<typeof ThreadDrawer> = {
    title: "Nivo/Blocks/AgentOs/ThreadDrawer/ThreadDrawer",
    component: ThreadDrawer,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ThreadDrawer>

const LABELS: ThreadDrawerLabels = {
    channelOptions: { zalo: "Zalo", telegram: "Telegram", whatsapp: "WhatsApp" },
    authorOptions: { customer: "Customer", agent: "Agent" },
    draftLabel: "AI draft reply",
    draftPendingLabel: "Not sent",
    draftAriaLabel: "Edit the AI-drafted reply before sending",
    closeLabel: "Close",
    sendLabel: "Send",
}

const MESSAGES: Array<ThreadDrawerMessage> = [
    { id: "msg-1", author: "customer", body: "Hi, could you tell me the Pro plan price? Any promo running right now?" },
    { id: "msg-2", author: "agent", body: "Hi! The Pro plan is 990,000₫/month — 3 agents, every channel, and a knowledge base. We have 15% off the first month." },
    { id: "msg-3", author: "customer", body: "How long does that promo last?" },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Drawer.CloseTrigger": { tier: "heroui", role: "the close button, upper-right" },
    SurfaceCard: { tier: "composite", role: "one bubble per message, aligned by author" },
    SurfaceCardNested: { tier: "composite", role: "the AI draft-reply card — heading + pending chip + the editable textarea" },
    InputTextarea: { tier: "atom", role: "the editable draft reply" },
    Chip: { tier: "atom", role: "the \"Not sent\" pending marker on the draft card" },
    Button: { tier: "atom", role: "close (ghost) and send (primary, busy while sending, disabled on an empty draft)" },
    Typography: { tier: "atom", role: "the author labels and message bodies" },
}

/** Shared controlled wrapper — one `isOpen`/draft state feeds every leaf state below. */
const ControlledThreadDrawer = () => {
    const [isOpen, setIsOpen] = useState(true)
    const [draft, setDraft] = useState("The 15% promo runs through August 31st. Would you like me to set up your Pro subscription now?")

    const base = {
        isOpen,
        onOpenChange: setIsOpen,
        customerName: "Tran Thi Mai",
        channel: "zalo" as const,
        messages: MESSAGES,
        draftReply: draft,
        onDraftReplyChange: setDraft,
        onSendDraft: () => setIsOpen(false),
        labels: LABELS,
    }

    return (
        <div data-tier="fixture" className="flex flex-col gap-3 p-8">
            <Button label="Open conversation" variant="secondary" size="sm" classNames={["self-start"]} onPress={() => setIsOpen(true)} />
            <BlockAnatomy
                name="ThreadDrawer"
                tier="block"
                leaf="Thread + draft reply"
                annotate={ANNOTATE}
                reason="A presentational overlay drawer over one conversation. The message history is read-only; the AI-drafted reply is the one editable, sendable region — the operator can send it as-is or edit first, but there is nowhere else in this drawer to act."
                states={[
                    {
                        name: "editable draft, resting",
                        why: "The common state: the AI's drafted reply sits ready in the composer, editable before sending.",
                        code: `<ThreadDrawer
  isOpen={isOpen}
  onOpenChange={setIsOpen}
  customerName="Tran Thi Mai"
  channel="zalo"
  messages={messages}
  draftReply={draft}
  onDraftReplyChange={setDraft}
  onSendDraft={send}
  labels={labels}
/>`,
                        render: <ThreadDrawer {...base} />,
                    },
                    {
                        name: "draftReply = \"\"",
                        why: "Nothing to send yet — the send button stays disabled until there is a draft in the composer.",
                        code: "<ThreadDrawer draftReply=\"\" … />",
                        render: <ThreadDrawer {...base} draftReply="" onDraftReplyChange={() => {}} />,
                    },
                    {
                        name: "isSending = true",
                        why: "The send mutation is in flight — the composer locks and the send button shows its busy state so the operator can't double-send.",
                        code: "<ThreadDrawer isSending … />",
                        render: <ThreadDrawer {...base} isSending />,
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The thread's own first fetch hasn't resolved yet, so the same shape shimmers — the title, a fixed count of message-shaped bubbles, and the draft card — matching the loaded thread so nothing jumps when the conversation lands.",
                        code: "<ThreadDrawer isSkeleton … />",
                        render: <ThreadDrawer {...base} isSkeleton />,
                    },
                ]}
            />
        </div>
    )
}

/** All four states (editable, empty draft, sending, loading) live inside one `BlockAnatomy` panel — see its `states` array. */
export const Default: Story = {
    render: () => <ControlledThreadDrawer />,
}
