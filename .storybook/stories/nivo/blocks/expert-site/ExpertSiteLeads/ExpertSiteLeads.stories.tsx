import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    ExpertSiteLeads,
    type ExpertSiteLeadRow,
    type ExpertSiteLeadsLabels,
} from "@sb-components/nivo/blocks/expert-site/ExpertSiteLeads/ExpertSiteLeads"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `ExpertSiteLeads` — the owner-side list of contact requests, each workable
 * through New → Contacted → Won/Lost. One composition: a titled card with a row
 * per lead (name + status chip + time, contact, message, status selector). Two
 * DATA states of the single shape: `empty` and `with-leads`. Grounded in the
 * real `ExpertSiteLeads`; maps onto `ExpertSiteLeadEntity`.
 */
const meta: Meta<typeof ExpertSiteLeads> = {
    title: "Nivo/Blocks/ExpertSite/ExpertSiteLeads/ExpertSiteLeads",
    component: ExpertSiteLeads,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ExpertSiteLeads>

const LABELS: ExpertSiteLeadsLabels = {
    title: "Leads",
    statusLabel: "Lead status",
    statusOptions: { new: "New", contacted: "Contacted", won: "Won", lost: "Lost" },
    emptyTitle: "No leads yet",
    emptyDescription: "Enquiries from your site's contact form will show up here.",
}

const LEADS: Array<ExpertSiteLeadRow> = [
    {
        id: "lead-1",
        name: "Mai Anh",
        contact: "maianh@example.com",
        message: "I'd love to join your next cohort — is there a waitlist?",
        status: "new",
        createdAtLabel: "23/06/2026 17:24",
    },
    {
        id: "lead-2",
        name: "Trung Kien",
        contact: "0912 345 678",
        message: null,
        status: "contacted",
        createdAtLabel: "22/06/2026 09:03",
    },
    {
        id: "lead-3",
        name: "Phuong Linh",
        contact: "linh@studio.vn",
        message: "Booked the intensive — thank you!",
        status: "won",
        createdAtLabel: "20/06/2026 14:41",
    },
]

const NOOP = () => {}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    SurfaceCard: { tier: "composite", role: "the outer card, and one nested card per lead" },
    EmptyState: { tier: "composite", role: "the empty branch when no leads have arrived" },
    Chip: { tier: "atom", role: "the lead's current status, toned by where it sits in the flow" },
    SelectSingle: { tier: "atom", role: "moves the lead to a new status" },
    Typography: { tier: "atom", role: "the name, arrival time, contact, and message" },
}

/** LEAF — the list has one shape; empty vs with-leads are DATA ⇒ states. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ExpertSiteLeads"
                tier="block"
                leaf="Leads list"
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-xl"
                reason="Blocks take no `className`: the block owns the leads entity, so empty vs with-leads are states of one shape. It emits the one intent it owns — `onStatusChange` — through the per-row selector, and words the four statuses itself from the resolved labels."
                states={[
                    {
                        name: "leads = []",
                        why: "No enquiries yet. The card keeps its title and reads as an intentional empty state, telling the owner where leads will appear rather than showing a blank panel.",
                        code: `<ExpertSiteLeads
    leads={[]}
    onStatusChange={move}
    labels={labels}
/>`,
                        render: <ExpertSiteLeads leads={[]} onStatusChange={NOOP} labels={LABELS} />,
                    },
                    {
                        name: "leads populated",
                        why: "Three leads across three statuses — new (accent), contacted (warning), won (success). One lead has no message, so its message line simply drops. Each row's selector moves that lead independently through the flow.",
                        code: "<ExpertSiteLeads leads={leads} onStatusChange={move} … />",
                        render: <ExpertSiteLeads leads={LEADS} onStatusChange={NOOP} labels={LABELS} />,
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The list's own first fetch hasn't resolved yet, so the same titled card draws a fixed count of lead-shaped rows — name, chip, time, contact, message and status selector all shimmering — matching the loaded row so nothing jumps when the leads land.",
                        code: `<ExpertSiteLeads
    leads={[]}
    onStatusChange={move}
    labels={labels}
    isSkeleton
/>`,
                        render: <ExpertSiteLeads leads={[]} onStatusChange={NOOP} labels={LABELS} isSkeleton />,
                    },
                ]}
            />
        </div>
    ),
}
