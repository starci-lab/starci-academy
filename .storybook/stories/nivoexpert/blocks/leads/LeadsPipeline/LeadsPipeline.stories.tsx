import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    LeadsPipeline,
    type LeadRowView,
    type LeadsPipelineLabels,
} from "@sb-components/nivoexpert/blocks/leads/LeadsPipeline/LeadsPipeline"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `LeadsPipeline` — the leads board: every lead sorted into one of four fixed
 * pipeline stages (new → contacted → won/lost), one column per stage. Tapping a
 * row is the select action — the real app opens `LeadDetailDrawer` with the
 * tapped lead's id. The board is one shape; `isSkeleton`/`empty` are STATES of
 * it, not separate leaves.
 */
const meta: Meta<typeof LeadsPipeline> = {
    title: "NivoExpert/Blocks/Leads/LeadsPipeline/LeadsPipeline",
    component: LeadsPipeline,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof LeadsPipeline>

const NOOP = () => {}

const LABELS: LeadsPipelineLabels = {
    stageLabels: { new: "New", contacted: "Contacted", won: "Won", lost: "Lost" },
    emptyColumnLabel: "No leads at this stage yet.",
    emptyTitle: "No leads yet",
    emptyDescription: "Once your landing page starts capturing interest, leads show up here sorted into this pipeline.",
}

const LEADS: Array<LeadRowView> = [
    { id: "lead-1", email: "hoa@company.vn", interest: "Interested in System Design", source: "Landing page", stage: "new" },
    { id: "lead-2", email: "nam@shop.vn", interest: "Asked about the enterprise plan", source: "Referral", stage: "new" },
    { id: "lead-3", email: "linh@abc.vn", interest: "Wants a demo before buying", source: "Landing page", stage: "contacted" },
    { id: "lead-4", email: "dung@x.vn", interest: "Bought the Advanced React course", source: "Landing page", stage: "won" },
    { id: "lead-5", email: "minh@y.vn", interest: "Went with a competitor", source: "Referral", stage: "lost" },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    SurfaceCard: { tier: "composite", role: "each of the four stage columns — label, lead count, and its rows" },
    SurfaceCardList: { tier: "composite", role: "the leads inside one column, or its own empty note" },
    Chip: { tier: "atom", role: "the per-column lead count" },
    EmptyState: { tier: "composite", role: "shown when there are no leads at all across every stage" },
}

/** LEAF — one shape; content, per-stage empties, board-wide empty, and loading are all STATES. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="LeadsPipeline"
                tier="block"
                leaf="Pipeline"
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-5xl"
                reason="Blocks take no `className`: the block owns the lead entity and its stage, so the four columns are a filter of ONE list, not four separate blocks. A column with no leads at that stage shows its own quiet note (`SurfaceCardList`'s `emptyState`); the board-wide empty state only replaces the whole grid when there are no leads anywhere."
                states={[
                    {
                        name: "leads across all four stages",
                        why: "Two new leads, one contacted, one won, one lost — every column has at least one row, and the count chip beside each label matches its column.",
                        code: "<LeadsPipeline leads={leads} onSelectLead={openLeadDetail} labels={labels} />",
                        render: <LeadsPipeline leads={LEADS} onSelectLead={NOOP} labels={LABELS} />,
                    },
                    {
                        name: "one stage empty (Lost, here)",
                        why: "Most stages have leads; Lost has none — its own column shows the quiet 'No leads at this stage yet' note instead of an empty box, while the other three columns render normally.",
                        code: "<LeadsPipeline leads={leadsWithoutLost} onSelectLead={openLeadDetail} labels={labels} />",
                        render: <LeadsPipeline leads={LEADS.filter((lead) => lead.stage !== "lost")} onSelectLead={NOOP} labels={LABELS} />,
                    },
                    {
                        name: "leads = [] (no leads at all)",
                        why: "A brand-new academy with no captured leads yet — the whole grid is replaced by one board-wide empty state instead of four empty columns.",
                        code: "<LeadsPipeline leads={[]} onSelectLead={openLeadDetail} labels={labels} />",
                        render: <LeadsPipeline leads={[]} onSelectLead={NOOP} labels={LABELS} />,
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The first fetch hasn't resolved: every column keeps its label and draws two lead-shaped rows shimmering, so nothing jumps once the real leads land.",
                        code: "<LeadsPipeline leads={[]} onSelectLead={openLeadDetail} labels={labels} isSkeleton />",
                        render: <LeadsPipeline leads={[]} onSelectLead={NOOP} labels={LABELS} isSkeleton />,
                    },
                ]}
            />
        </div>
    ),
}
