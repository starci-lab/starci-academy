import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    OfferingsSummaryCard,
    type OfferingsSummaryCardLabels,
} from "@sb-components/nivo/blocks/expert-site/OfferingsSummaryCard/OfferingsSummaryCard"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `OfferingsSummaryCard` — the operating-loop tile over the site's offerings.
 * One composition: a titled tile holding the offering count and a drill-in
 * link to the offerings editor, worded differently once there are none yet so
 * the empty tile invites the first offering instead of reading as broken. Two
 * DATA states of the single shape: `empty` and `with-offerings`. Grounded in
 * the real `ExpertSiteOfferingEntity`.
 */
const meta: Meta<typeof OfferingsSummaryCard> = {
    title: "Nivo/Blocks/ExpertSite/OfferingsSummaryCard/OfferingsSummaryCard",
    component: OfferingsSummaryCard,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof OfferingsSummaryCard>

const LABELS: OfferingsSummaryCardLabels = {
    title: "Offerings",
    description: "offerings live on your site",
    emptyDescription: "No offerings yet — add one so visitors know what you sell.",
    drillLabel: "Edit offerings",
    emptyDrillLabel: "Add your first offering",
}

const NOOP = () => {}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    SurfaceCard: { tier: "composite", role: "the tile face and title" },
    Typography: { tier: "atom", role: "the offering count and its caption" },
    LinkSeeMore: { tier: "atom", role: "drills into the offerings editor — worded to invite the first offering when the count is 0" },
}

/** LEAF — the tile has one shape; empty vs with-offerings are DATA ⇒ states. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="OfferingsSummaryCard"
                tier="block"
                leaf="Offerings summary"
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-xs"
                reason="Blocks take no `className`: the block owns the offerings entity, so empty vs with-offerings are states of one shape. The drill link is present in both — an owner with zero offerings can still reach the editor — but its wording flips to an invitation instead of reading as a dead end."
                states={[
                    {
                        name: "count = 0",
                        why: "No offerings added yet. The count still renders (0) and the caption + link invite the owner to add their first, rather than showing a blank tile.",
                        code: `<OfferingsSummaryCard
    count={0}
    onOpenEditor={open}
    labels={labels}
/>`,
                        render: <OfferingsSummaryCard count={0} onOpenEditor={NOOP} labels={LABELS} />,
                    },
                    {
                        name: "count = 3",
                        why: "Three offerings are live on the site. The caption confirms they are the ones visitors see, and the link switches to editing rather than adding.",
                        code: "<OfferingsSummaryCard count={3} onOpenEditor={open} … />",
                        render: <OfferingsSummaryCard count={3} onOpenEditor={NOOP} labels={LABELS} />,
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The tile's own first fetch hasn't resolved yet, so the same titled tile draws the count, caption, and drill link all shimmering — matching the loaded row so nothing jumps when the offerings land.",
                        code: `<OfferingsSummaryCard
    count={0}
    onOpenEditor={open}
    labels={labels}
    isSkeleton
/>`,
                        render: <OfferingsSummaryCard count={0} onOpenEditor={NOOP} labels={LABELS} isSkeleton />,
                    },
                ]}
            />
        </div>
    ),
}
