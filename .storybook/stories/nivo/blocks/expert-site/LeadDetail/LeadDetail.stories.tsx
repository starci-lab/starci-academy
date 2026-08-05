import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import {
    LeadDetail,
    type LeadDetailLabels,
} from "@sb-components/nivo/blocks/expert-site/LeadDetail/LeadDetail"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `LeadDetail` — overlay drawer over ONE lead: its full message, the same
 * status-move selector `ExpertSiteLeadsPipeline`'s board uses, and the AI
 * draft-reply card (drafted text, a copy-to-clipboard affordance, and the
 * draft/redraft trigger). Replaces the toast that used to carry the drafted
 * reply — content the expert needs to read and copy is the wrong shape for a
 * surface that auto-dismisses.
 */
const meta: Meta<typeof LeadDetail> = {
    title: "Nivo/Blocks/ExpertSite/LeadDetail/LeadDetail",
    component: LeadDetail,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof LeadDetail>

const LABELS: LeadDetailLabels = {
    messageLabel: "Message",
    noMessageLabel: "No message provided.",
    statusLabel: "Lead status",
    statusOptions: { new: "New", contacted: "Contacted", won: "Won", lost: "Lost" },
    draftSectionLabel: "AI draft reply",
    draftActionLabel: "Draft reply",
    copyLabel: "Copy",
    draftEmptyChipLabel: "Not drafted",
    draftPendingChipLabel: "Drafting…",
    draftReadyChipLabel: "Drafted",
    draftErrorChipLabel: "Draft failed",
    draftEmptyBodyLabel: "Ask the AI to draft a reply based on this lead's message.",
    closeLabel: "Close",
}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Drawer.CloseTrigger": { tier: "heroui", role: "the close button, upper-right" },
    SelectSingle: { tier: "atom", role: "moves this lead to a new status — same control the board's card uses" },
    SurfaceCardNested: { tier: "composite", role: "the message card, and the AI draft-reply card (heading + status chip + body + actions)" },
    Chip: { tier: "atom", role: "the draft card's own state — not drafted / drafting / drafted / failed" },
    Button: { tier: "atom", role: "draft/redraft (primary intent), copy (secondary), and close (footer)" },
    Typography: { tier: "atom", role: "the message body and the drafted reply text" },
}

/** Shared controlled wrapper — one `isOpen` feeds every leaf state below; each leaf overrides its own draft flags. */
type ControlledLeadDetailProps = {
    draftReply: string | null
    isDrafting: boolean
    draftError: string | null
}
const ControlledLeadDetail = ({
    draftReply,
    isDrafting,
    draftError,
}: ControlledLeadDetailProps) => {
    const [isOpen, setIsOpen] = useState(true)

    return (
        <div data-tier="fixture" className="flex flex-col gap-3 p-8">
            <div className="self-start">
                <Button label="Open lead" variant="secondary" size="sm" onPress={() => setIsOpen(true)} />
            </div>
            <LeadDetail
                isOpen={isOpen}
                onOpenChange={setIsOpen}
                name="Mai Anh"
                contact="maianh@example.com"
                createdAtLabel="23/06/2026 17:24"
                message="Interested in the Pro package — is there a waitlist? Also wondering if there's a discount for annual billing."
                status="new"
                onStatusChange={() => {}}
                draftReply={draftReply}
                onDraftReply={() => {}}
                isDrafting={isDrafting}
                draftError={draftError}
                onCopyDraft={() => {}}
                onClose={() => setIsOpen(false)}
                labels={LABELS}
            />
        </div>
    )
}

/** All four draft states live inside one `BlockAnatomy` panel — see its `states` array. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="LeadDetail"
                tier="block"
                leaf="Lead + AI draft reply"
                annotate={ANNOTATE}
                reason={"A presentational overlay drawer over one lead. The message and status move are read/act; the draft-reply card carries its own three-flag state (`draftReply` · `isDrafting` · `draftError`) so the drawer can tell \"never drafted\" apart from \"drafted, empty\" and \"drafting again after a failure\"."}
                states={[
                    {
                        name: "draftReply = null",
                        why: "No draft attempt yet — the card shows a placeholder and the one \"Draft reply\" action; Copy stays disabled with nothing to copy.",
                        code: "<LeadDetail draftReply={null} isDrafting={false} draftError={null} … />",
                        render: <ControlledLeadDetail draftReply={null} isDrafting={false} draftError={null} />,
                    },
                    {
                        name: "isDrafting = true",
                        why: "The draftLeadReply mutation is in flight — the draft button busies, the chip reads \"Drafting…\", and the placeholder still shows underneath (nothing to show yet on a first draft).",
                        code: "<LeadDetail draftReply={null} isDrafting … />",
                        render: <ControlledLeadDetail draftReply={null} isDrafting draftError={null} />,
                    },
                    {
                        name: "draftReply = \"…\"",
                        why: "A reply is in hand — the full text renders, Copy becomes pressable, and \"Draft reply\" doubles as the redraft trigger.",
                        code: "<LeadDetail draftReply=\"The 15% promo runs through…\" … />",
                        render: (
                            <ControlledLeadDetail
                                draftReply="Hi Mai Anh, thanks for reaching out! The Pro package is 990,000₫/month and yes — annual billing gets 2 months free. Want me to send the signup link?"
                                isDrafting={false}
                                draftError={null}
                            />
                        ),
                    },
                    {
                        name: "draftError = \"…\"",
                        why: "The last draft attempt failed — the error replaces the body text, the chip reads \"Draft failed\", and \"Draft reply\" stays available to retry.",
                        code: "<LeadDetail draftReply={null} draftError=\"Couldn't draft a reply.\" … />",
                        render: <ControlledLeadDetail draftReply={null} isDrafting={false} draftError="Couldn't draft a reply. Try again." />,
                    },
                ]}
            />
        </div>
    ),
}
