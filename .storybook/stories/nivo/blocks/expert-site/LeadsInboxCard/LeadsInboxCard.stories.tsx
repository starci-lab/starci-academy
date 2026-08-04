import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    LeadsInboxCard,
    type LeadsInboxCardLabels,
    type LeadsInboxCounts,
} from "@sb-components/nivo/blocks/expert-site/LeadsInboxCard/LeadsInboxCard"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `LeadsInboxCard` — the overview's leads TILE: the whole card is one press
 * target that drills into the leads CRM (`ExpertSiteLeadsPipeline`). Shows a big
 * total-leads count plus a mini pipeline (one count per `ExpertSiteLeadStatus`).
 * Two DATA states of the single shape: `empty` (no leads yet — invites sharing
 * the site link, mirrored via `isEmpty`) and `with-leads` (mini pipeline shown,
 * "N new" badge when any are unworked). Grounded in the real
 * `ExpertSiteLeadEntity` — counts are `count()` by `status`, never fabricated.
 */
const meta: Meta<typeof LeadsInboxCard> = {
    title: "Nivo/Blocks/ExpertSite/LeadsInboxCard/LeadsInboxCard",
    component: LeadsInboxCard,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof LeadsInboxCard>

const LABELS: LeadsInboxCardLabels = {
    title: "Leads (CRM)",
    newBadgePrefix: "New",
    caption: "Contacts your site collected — some still need a reply.",
    emptyCaption: "No leads yet — share your site link to get your first one.",
    statusOptions: { new: "New", contacted: "Contacted", won: "Won", lost: "Lost" },
    openCrmLabel: "Open CRM",
    openCrmAriaLabel: "Open leads CRM",
}

const EMPTY_COUNTS: LeadsInboxCounts = { new: 0, contacted: 0, won: 0, lost: 0 }
const LIVE_COUNTS: LeadsInboxCounts = { new: 3, contacted: 5, won: 3, lost: 1 }

const NOOP = () => {}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    SurfaceCard: { tier: "composite", role: "the one press target for the whole tile, drilling into the CRM" },
    Chip: { tier: "atom", role: "the \"N new\" badge and, per status, the mini pipeline count" },
    Typography: { tier: "atom", role: "the title, the big total, the caption, and the drill-link text" },
}

/** LEAF — the tile has one shape; empty vs with-leads are DATA ⇒ states. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="LeadsInboxCard"
                tier="block"
                leaf="Leads tile"
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-xs"
                reason="Blocks take no `className`: the block owns the leads count entity, so empty vs with-leads are states of one shape. It emits the one intent it owns — `onOpenCrm` — as the whole-card press target, and words its own new-count badge and mini pipeline from the resolved counts."
                states={[
                    {
                        name: "counts = { 0, 0, 0, 0 }",
                        why: "No enquiries have landed yet. The tile keeps its title and total (0) but swaps the caption for the share-link invite, and drops the mini pipeline row — nothing to break down yet. The drill link stays, so the owner can still open the (empty) CRM.",
                        code: `<LeadsInboxCard
    counts={{ new: 0, contacted: 0, won: 0, lost: 0 }}
    onOpenCrm={openCrm}
    labels={labels}
/>`,
                        render: <LeadsInboxCard counts={EMPTY_COUNTS} onOpenCrm={NOOP} labels={LABELS} />,
                    },
                    {
                        name: "counts populated",
                        why: "Twelve leads across the four statuses. The \"New 3\" badge calls out the unworked ones, the big total reads 12, and the mini pipeline breaks it down by status — new (accent), contacted (warning), won (success), lost (default) — mirroring `ExpertSiteLeads`' own status vocabulary.",
                        code: "<LeadsInboxCard counts={{ new: 3, contacted: 5, won: 3, lost: 1 }} onOpenCrm={openCrm} … />",
                        render: <LeadsInboxCard counts={LIVE_COUNTS} onOpenCrm={NOOP} labels={LABELS} />,
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The site's own first fetch hasn't resolved yet, so the same tile draws its full live shape — title, badge, total, caption, mini pipeline, and drill link — all shimmering, with the whole-card press target disabled until real counts land.",
                        code: `<LeadsInboxCard
    counts={{ new: 0, contacted: 0, won: 0, lost: 0 }}
    onOpenCrm={openCrm}
    labels={labels}
    isSkeleton
/>`,
                        render: <LeadsInboxCard counts={EMPTY_COUNTS} onOpenCrm={NOOP} labels={LABELS} isSkeleton />,
                    },
                ]}
            />
        </div>
    ),
}
