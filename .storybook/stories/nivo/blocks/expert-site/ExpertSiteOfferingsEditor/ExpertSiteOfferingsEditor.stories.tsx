import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    ExpertSiteOfferingsEditor,
    type ExpertSiteOfferingRow,
    type ExpertSiteOfferingsEditorLabels,
} from "@sb-components/nivo/blocks/expert-site/ExpertSiteOfferingsEditor/ExpertSiteOfferingsEditor"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `ExpertSiteOfferingsEditor` — the owner-side manager for the offerings an
 * expert publishes. One composition: a titled card with an Add action holding a
 * row per offering (title + price, edit + remove). Two DATA states of the single
 * shape: `empty` and `with-items`. Grounded in the real
 * `ExpertSiteOfferingsEditor`; maps onto `ExpertSiteOfferingEntity`.
 */
const meta: Meta<typeof ExpertSiteOfferingsEditor> = {
    title: "Nivo/Blocks/ExpertSite/ExpertSiteOfferingsEditor/ExpertSiteOfferingsEditor",
    component: ExpertSiteOfferingsEditor,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ExpertSiteOfferingsEditor>

const LABELS: ExpertSiteOfferingsEditorLabels = {
    title: "Offerings",
    addLabel: "Add offering",
    editLabel: "Edit offering",
    removeLabel: "Remove offering",
    emptyTitle: "No offerings yet",
    emptyDescription: "Add the courses or services you want visitors to see.",
}

const OFFERINGS: Array<ExpertSiteOfferingRow> = [
    { id: "mentoring", title: "1:1 Mentoring", priceText: "2,000,000 VND / month" },
    { id: "intensive", title: "System Design Intensive", priceText: "5,000,000 VND" },
    { id: "review", title: "One-off code review", priceText: null },
]

const NOOP = () => {}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    SurfaceCard: { tier: "composite", role: "the outer card, and one nested card per offering row" },
    EmptyState: { tier: "composite", role: "the empty branch — a call to add the first offering" },
    Button: { tier: "atom", role: "the Add action, plus per-row edit and remove buttons" },
    Typography: { tier: "atom", role: "each offering's title and price" },
}

/** LEAF — the manager has one shape; empty vs with-items are DATA ⇒ states. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ExpertSiteOfferingsEditor"
                tier="block"
                leaf="Offerings manager"
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-xl"
                reason="Blocks take no `className`: the block owns the offerings list, so empty vs with-items are states of one shape. The add/edit form is an interaction the connected layer drives — this block emits the `onAdd`/`onEdit`/`onRemove` intents and renders the resolved rows."
                states={[
                    {
                        name: "offerings = []",
                        why: "No offerings yet. The card keeps its title and Add action, and its body reads as an intentional empty state rather than a blank gap — the one call to action is to add the first offering.",
                        code: `<ExpertSiteOfferingsEditor
    offerings={[]}
    onAdd={add} onEdit={edit} onRemove={remove}
    labels={labels}
/>`,
                        render: (
                            <ExpertSiteOfferingsEditor
                                offerings={[]}
                                onAdd={NOOP}
                                onEdit={NOOP}
                                onRemove={NOOP}
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "offerings populated",
                        why: "Three offerings, one without a price (the price line simply drops rather than showing an empty slot). Each row carries its own edit and remove controls; the whole-card Add stays in the header.",
                        code: "<ExpertSiteOfferingsEditor offerings={offerings} … />",
                        render: (
                            <ExpertSiteOfferingsEditor
                                offerings={OFFERINGS}
                                onAdd={NOOP}
                                onEdit={NOOP}
                                onRemove={NOOP}
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The list's own first fetch hasn't resolved yet, so the same titled card draws a fixed count of offering-shaped rows — title and price shimmering — while the interactive Add and per-row edit/remove controls drop, so nothing jumps when the offerings land.",
                        code: `<ExpertSiteOfferingsEditor
    offerings={[]}
    onAdd={add} onEdit={edit} onRemove={remove}
    labels={labels}
    isSkeleton
/>`,
                        render: (
                            <ExpertSiteOfferingsEditor
                                offerings={[]}
                                onAdd={NOOP}
                                onEdit={NOOP}
                                onRemove={NOOP}
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
