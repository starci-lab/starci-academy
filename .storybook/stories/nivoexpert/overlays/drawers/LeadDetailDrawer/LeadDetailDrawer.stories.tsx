import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import {
    LeadDetailDrawer,
    type LeadDetailDrawerLabels,
} from "@sb-components/nivoexpert/overlays/drawers/LeadDetailDrawer/LeadDetailDrawer"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `LeadDetailDrawer` — the overlay for one lead: its pipeline stage stepper,
 * its message/source, and an AI-drafted reply the expert reviews (edit or
 * approve) before it sends. The lead is a resolved view handed in as props —
 * this file never fetches.
 */
const meta: Meta<typeof LeadDetailDrawer> = {
    title: "NivoExpert/Overlays/Drawers/LeadDetailDrawer/LeadDetailDrawer",
    component: LeadDetailDrawer,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof LeadDetailDrawer>

const NOOP = () => {}

const LABELS: LeadDetailDrawerLabels = {
    stageLabels: { new: "New", contacted: "Contacted", won: "Won", lost: "Lost" },
    messageLabel: "Message",
    sourceLabel: "Source",
    unknownValueLabel: "—",
    aiDraftTitle: "AI draft reply",
    pendingApprovalLabel: "Pending approval",
    editDraftLabel: "Edit draft",
    sendReplyLabel: "Send reply",
    sendingLabel: "Sending…",
}

const DRAFT_REPLY =
    "Hi Hoa, thanks for your interest in System Design! Our next SME-focused cohort starts in two weeks — happy to send the syllabus and pricing if that helps."

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Drawer.CloseTrigger": { tier: "heroui", role: "the close button, upper-right" },
    Chip: { tier: "atom", role: "the stage stepper pills, and the send-in-flight status on the AI-draft card" },
    KeyValueList: { tier: "composite", role: "the message and source rows", storyId: "composites-data-keyvalue-keyvaluelist--default" },
    SurfaceCard: { tier: "composite", role: "the AI-draft card — title, pending-approval chip, and the draft text itself" },
    InputTextarea: { tier: "atom", role: "the draft, only while `isEditingDraft` is true" },
}

/** Controlled wrapper — a trigger reopens the drawer after it closes, so the story stays interactive. */
const ControlledLeadDetailDrawer = ({
    isEditingDraft,
    draftReply,
    stage,
    message,
    source,
    isSending,
    isSkeleton,
}: {
    isEditingDraft?: boolean
    draftReply: string
    stage: "new" | "contacted" | "won" | "lost"
    message?: string | null
    source?: string | null
    isSending?: boolean
    isSkeleton?: boolean
}) => {
    const [isOpen, setIsOpen] = useState(true)
    const [draft, setDraft] = useState(draftReply)
    const [editing, setEditing] = useState(isEditingDraft ?? false)
    return (
        <div data-tier="fixture" className="flex flex-col gap-3 p-8">
            <Button label="Open lead" variant="secondary" size="sm" classNames={["self-start"]} onPress={() => setIsOpen(true)} />
            <LeadDetailDrawer
                isOpen={isOpen}
                onOpenChange={setIsOpen}
                email="hoa@company.vn"
                stage={stage}
                message={message}
                source={source}
                draftReply={draft}
                onDraftReplyChange={setDraft}
                isEditingDraft={editing}
                onEditDraft={() => setEditing(true)}
                onSendReply={NOOP}
                isSending={isSending}
                isSkeleton={isSkeleton}
                labels={LABELS}
            />
        </div>
    )
}

/** STATE — the resolved drawer for a new lead: stepper on "New", full details, AI draft pending review. */
export const Default: Story = {
    render: () => (
        <BlockAnatomy
            name="LeadDetailDrawer"
            tier="block"
            leaf="Default"
            annotate={ANNOTATE}
            reason="Presentational overlay drawer over one lead, handed in as props (the connected layer looks the lead up by id). The AI draft is human-in-loop: it renders as static text pending review, with 'Pending approval' on the card until the expert edits or sends it."
            states={[
                {
                    name: "stage = \"new\", draft pending review",
                    why: "A freshly-captured lead: the stepper highlights New, both detail rows are filled, and the AI draft sits ready to review — 'Edit draft' switches it into a textarea, 'Send reply' sends it as-is.",
                    code: "<LeadDetailDrawer isOpen onOpenChange={close} email=\"hoa@company.vn\" stage=\"new\" message={message} source={source} draftReply={draft} onSendReply={send} labels={labels} />",
                    render: (
                        <ControlledLeadDetailDrawer
                            stage="new"
                            message="Interested in System Design"
                            source="Landing page"
                            draftReply={DRAFT_REPLY}
                        />
                    ),
                },
                {
                    name: "isEditingDraft = true",
                    why: "The expert tapped 'Edit draft' — the draft becomes an editable textarea instead of static text, so the reply that goes out is exactly what the expert reviewed.",
                    code: "<LeadDetailDrawer … draftReply={draft} onDraftReplyChange={setDraft} isEditingDraft onSendReply={send} labels={labels} />",
                    render: (
                        <ControlledLeadDetailDrawer
                            stage="contacted"
                            message="Wants a demo before buying"
                            source="Referral"
                            draftReply={DRAFT_REPLY}
                            isEditingDraft
                        />
                    ),
                },
                {
                    name: "isSending = true",
                    why: "Right after 'Send reply' is pressed: both footer buttons lock and Send shows its spinner + 'Sending…' until the mutation resolves.",
                    code: "<LeadDetailDrawer … onSendReply={send} isSending labels={labels} />",
                    render: (
                        <ControlledLeadDetailDrawer
                            stage="new"
                            message="Interested in System Design"
                            source="Landing page"
                            draftReply={DRAFT_REPLY}
                            isSending
                        />
                    ),
                },
                {
                    name: "message/source unknown",
                    why: "A lead captured with only an email — both detail rows fall to the unknown-value dash instead of rendering blank.",
                    code: "<LeadDetailDrawer … message={null} source={null} labels={labels} />",
                    render: <ControlledLeadDetailDrawer stage="new" message={null} source={null} draftReply={DRAFT_REPLY} />,
                },
                {
                    name: "isSkeleton = true",
                    why: "The drawer's own first fetch (looking the lead up by id) is in flight: the title, stepper, detail rows, and the AI-draft card all shimmer together.",
                    code: "<LeadDetailDrawer … isSkeleton labels={labels} />",
                    render: <ControlledLeadDetailDrawer stage="new" message="" source="" draftReply="" isSkeleton />,
                },
            ]}
        />
    ),
}
