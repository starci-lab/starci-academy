import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    ExpertSiteLeadsPipeline,
    type ExpertSiteLeadsPipelineLabels,
} from "@sb-components/nivo/blocks/expert-site/ExpertSiteLeadsPipeline/ExpertSiteLeadsPipeline"
import type { ExpertSiteLeadRow } from "@sb-components/nivo/blocks/expert-site/ExpertSiteLeads/ExpertSiteLeads"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `ExpertSiteLeadsPipeline` — the full leads CRM surface: a 4-column pipeline
 * over `ExpertSiteLeadStatus` (`new → contacted → won → lost`), each column a
 * `SurfaceCard` header (status + count) over a stack of lead cards, each lead
 * card carrying name + meta, a status-move selector, a private note field, and
 * an AI "draft reply" affordance (the connected layer wires it to
 * `draftLeadReply`). One DATA state of the single shape switches on the whole
 * set: `empty` (no leads yet — a share-link invite replaces the four columns)
 * vs `with-leads` (the pipeline). Grounded in the real `ExpertSiteLeadEntity`.
 *
 * SUPERSEDES `ExpertSiteLeads` as the leads-CRM surface: the proposal's "Leads /
 * CRM" screen is a 4-column pipeline, not a single flat list, so this is a
 * different shape rather than a variant of the existing block. It reuses
 * `ExpertSiteLeads`' own `ExpertSiteLeadRow`/`ExpertSiteLeadStatusKey` types
 * (same entity, same status vocabulary) instead of forking a parallel shape.
 * `ExpertSiteLeads` is left in place — retiring it is a call for whoever wires
 * the CRM route, not this file.
 */
const meta: Meta<typeof ExpertSiteLeadsPipeline> = {
    title: "Nivo/Blocks/ExpertSite/ExpertSiteLeadsPipeline/ExpertSiteLeadsPipeline",
    component: ExpertSiteLeadsPipeline,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ExpertSiteLeadsPipeline>

const LABELS: ExpertSiteLeadsPipelineLabels = {
    statusOptions: { new: "New", contacted: "Contacted", won: "Won", lost: "Lost" },
    statusLabel: "Lead status",
    noteLabel: "Private note",
    notePlaceholder: "Add a note only you can see…",
    saveNoteLabel: "Save note",
    draftReplyLabel: "Draft reply",
    openLeadAriaLabel: "View lead",
    emptyTitle: "No leads yet",
    emptyDescription: "Share your site link so visitors can leave their details — the first lead will land in \"New\".",
    copyLinkLabel: "Copy site link",
}

const LEADS: Array<ExpertSiteLeadRow> = [
    {
        id: "lead-1",
        name: "Mai Anh",
        contact: "maianh@example.com",
        message: "Interested in the Pro package — is there a waitlist?",
        status: "new",
        createdAtLabel: "23/06/2026 17:24",
        note: "Follow up Monday — mentioned budget is flexible.",
    },
    {
        id: "lead-2",
        name: "Trung Kien",
        contact: "0912 345 678",
        message: null,
        status: "new",
        createdAtLabel: "23/06/2026 09:03",
        note: null,
    },
    {
        id: "lead-3",
        name: "Duc Hai",
        contact: "duchai@example.com",
        message: "Called them back, waiting to hear.",
        status: "contacted",
        createdAtLabel: "22/06/2026 14:10",
        note: null,
    },
    {
        id: "lead-4",
        name: "Phuong Linh",
        contact: "linh@studio.vn",
        message: "Booked the intensive — thank you!",
        status: "won",
        createdAtLabel: "20/06/2026 14:41",
        note: null,
    },
    {
        id: "lead-5",
        name: "Bui Ha",
        contact: "buiha@example.com",
        message: "Outside their budget for now.",
        status: "lost",
        createdAtLabel: "18/06/2026 11:02",
        note: null,
    },
]

const NOOP = () => {}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    Grid: { tier: "frame", role: "the four status columns, one per `ExpertSiteLeadStatus`" },
    SurfaceCard: { tier: "composite", role: "each column's header+count, and one nested card per lead" },
    EmptyState: { tier: "composite", role: "the whole-pipeline empty branch when no leads exist in any column" },
    SelectSingle: { tier: "atom", role: "moves a lead to a new status — the status-move hook" },
    InputTextarea: { tier: "atom", role: "the private note only the expert sees — not shown to the visitor" },
    Button: { tier: "atom", role: "the \"open lead\" icon button (opens `LeadDetail`), the AI \"Draft reply\" affordance, and the empty state's copy-link action" },
    Typography: { tier: "atom", role: "the lead's name, meta, and optional message" },
}

/** LEAF — the pipeline has one shape; empty vs with-leads are DATA ⇒ states. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ExpertSiteLeadsPipeline"
                tier="block"
                leaf="Leads CRM pipeline"
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-5xl"
                reason="Blocks take no `className`: the block owns the leads entity across all four statuses, so empty vs with-leads are states of one shape. It emits the intents it owns — `onStatusChange`, `onNoteChange`/`onNoteSave`, `onDraftReply`, `onOpenLead`, `onCopyLink` — and words its own four column headers from the resolved status labels. `onOpenLead` fires from a dedicated icon button beside the lead's name (the connected layer opens `LeadDetail`) — a plain sibling control next to the status selector and draft button, same shape loaded and loading. The note field edits locally on every keystroke (`onNoteChange`); nothing persists until Save (`onNoteSave`) — matches `updateExpertSiteLead`, which the connected layer only calls on that explicit action."
                states={[
                    {
                        name: "leads = []",
                        why: "No enquiries have landed in any status. The four columns are replaced by ONE share-link invite — there is nothing yet to break into a pipeline, so showing four empty tracks would just be noise.",
                        code: `<ExpertSiteLeadsPipeline
    leads={[]}
    onStatusChange={move}
    onNoteChange={editNote}
    onNoteSave={saveNote}
    onDraftReply={draftReply}
    onOpenLead={openLead}
    onCopyLink={copyLink}
    labels={labels}
/>`,
                        render: (
                            <ExpertSiteLeadsPipeline
                                leads={[]}
                                onStatusChange={NOOP}
                                onNoteChange={NOOP}
                                onNoteSave={NOOP}
                                onDraftReply={NOOP}
                                onOpenLead={NOOP}
                                onCopyLink={NOOP}
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "leads populated",
                        why: "Five leads across all four statuses — New holds two, Contacted/Won/Lost hold one each. Each card carries its own status selector (moves that lead independently), a private note (the first lead's is pre-filled to show the field with content), and a \"Draft reply\" affordance for the AI-assisted reply, wired later to `draftLeadReply`.",
                        code: "<ExpertSiteLeadsPipeline leads={leads} onStatusChange={move} onNoteChange={editNote} onNoteSave={saveNote} onDraftReply={draftReply} onOpenLead={openLead} onCopyLink={copyLink} … />",
                        render: (
                            <ExpertSiteLeadsPipeline
                                leads={LEADS}
                                onStatusChange={NOOP}
                                onNoteChange={NOOP}
                                onNoteSave={NOOP}
                                onDraftReply={NOOP}
                                onOpenLead={NOOP}
                                onCopyLink={NOOP}
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The site's own first fetch hasn't resolved yet, so the same four columns draw a fixed spread of lead-shaped cards — name, meta, message, selector, and draft-reply button all shimmering — matching the loaded shape so nothing jumps when the real leads land.",
                        code: `<ExpertSiteLeadsPipeline
    leads={[]}
    onStatusChange={move}
    onNoteChange={editNote}
    onNoteSave={saveNote}
    onDraftReply={draftReply}
    onCopyLink={copyLink}
    labels={labels}
    isSkeleton
/>`,
                        render: (
                            <ExpertSiteLeadsPipeline
                                leads={[]}
                                onStatusChange={NOOP}
                                onNoteChange={NOOP}
                                onNoteSave={NOOP}
                                onDraftReply={NOOP}
                                onOpenLead={NOOP}
                                onCopyLink={NOOP}
                                labels={LABELS}
                                isSkeleton
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
