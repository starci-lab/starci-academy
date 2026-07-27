import type { Meta, StoryObj } from "@storybook/nextjs"
import { ContentPaywall } from "@sb-components/blocks/learn/ContentPaywall/ContentPaywall"
import { PricingPhase } from "@sb-components/blocks/commerce/PhaseScarcityNote/PhaseScarcityNote"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `ContentPaywall`: the offer at the point the lesson stops.
 *
 * ⚠️ FLAT ON PURPOSE — no card of its own. It lives INSIDE the reading card,
 * right under the faded tail of the body, so the page reads as one surface that
 * runs out rather than as a second card interrupting a first.
 *
 * ⭐ BLOCK IMPORTS BLOCK, and this is the case that justifies the rule. Price and
 * scarcity are already blocks built for the course page, and the same WHY —
 * "sell this course" — turns up here on a different screen. Rebuilding either
 * would fork the pricing vocabulary, and two forks WILL drift.
 *
 * It EARNS its own layer by owning the frame the offer arrives in: the lock, the
 * sentence, the ORDER, and exactly one call to action. What it does not do is
 * re-decide what a price looks like.
 *
 * 📐 LEAF by STRUCTURE (§14d.2). Losing the scarcity line changes the shape ⇒ its
 * own leaf; so does the caller flipping `isSkeleton`. Whether there is an
 * original price to strike through is data ⇒ a state.
 */
const meta: Meta<typeof ContentPaywall> = {
    title: "Blocks/Learn/ContentPaywall/ContentPaywall",
    component: ContentPaywall,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ContentPaywall>

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "StackV": { tier: "frame", role: "the centred column holding the whole offer, owning the seam between the lock, the words, the price and the action", storyId: "frames-stack-stackv--default" },
    "IconTile": { tier: "atom", role: "the lock glyph on its tinted tile, the first thing that says the lesson stopped on purpose", storyId: "atoms-display-icontile-icontile--default" },
    "Typography": { tier: "atom", role: "the headline, or the muted sentence under it saying what buying unlocks", storyId: "atoms-text-typography-typography--plain" },
    "PriceTagProminent": { tier: "block", role: "the price, reused unchanged from the course page so the two screens cannot drift on currency, grouping or how a discount reads", storyId: "blocks-commerce-pricetag--default" },
    "PhaseScarcityNote": { tier: "block", role: "the phase-and-seats line, also reused from the course page, saying what waiting will cost", storyId: "blocks-commerce-phasescarcitynote-phasescarcitynote--default" },
    "Button": { tier: "atom", role: "the single call to action, owning its own accent skin and the arrow that slides on hover", storyId: "atoms-buttons-button-button--default" },
}

/** LEAF — full offer: lock, words, price, scarcity, one action. */
export const Full: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="ContentPaywall"
                tier="block"
                leaf="Full"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "originalPriceVnd set, seatsRemaining = 12",
                        why: "The lesson stops, and the offer arrives in one column: what is behind the lock, what it costs now against what it cost before, how many seats are left at this price, and one way forward. The scarcity line sits between the price and the button so it reads as a reason to act rather than as fine print after the decision.",
                        code: `<ContentPaywall
    title="Phần còn lại dành cho học viên"
    description="Mở khoá toàn bộ bài học, thử thách và sandbox của khoá này."
    discountedPriceVnd={1290000}
    originalPriceVnd={1990000}
    currentPhase={PricingPhase.Pioneer}
    seatsRemaining={12}
    nextPhasePriceVnd={1590000}
    ctaLabel="Mở khoá khoá học"
    onPurchase={buy}
/>`,
                        render: (
                            <ContentPaywall
                                anatPart="ContentPaywall"
                                showAnatomy
                                title="Phần còn lại dành cho học viên"
                                description="Mở khoá toàn bộ bài học, thử thách và sandbox của khoá này."
                                discountedPriceVnd={1290000}
                                originalPriceVnd={1990000}
                                currentPhase={PricingPhase.Pioneer}
                                seatsRemaining={12}
                                nextPhasePriceVnd={1590000}
                                ctaLabel="Mở khoá khoá học"
                                onPurchase={() => {}}
                            />
                        ),
                    },
                    {
                        name: "originalPriceVnd = null",
                        why: "The course is at its standing price, so there is nothing to strike through and the price line carries one number. The offer keeps every other part, which is what stops a full-price course from looking like a worse deal than a discounted one.",
                        code: `<ContentPaywall
    title="Phần còn lại dành cho học viên"
    discountedPriceVnd={1290000}
    currentPhase={PricingPhase.Pioneer}
    seatsRemaining={12}
    ctaLabel="Mở khoá khoá học"
    onPurchase={buy}
/>`,
                        render: (
                            <ContentPaywall
                                title="Phần còn lại dành cho học viên"
                                discountedPriceVnd={1290000}
                                currentPhase={PricingPhase.Pioneer}
                                seatsRemaining={12}
                                ctaLabel="Mở khoá khoá học"
                                onPurchase={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — no pricing phase ⇒ **loses** the `PhaseScarcityNote` node. */
export const NoScarcity: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="ContentPaywall"
                tier="block"
                leaf="No scarcity"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "currentPhase = undefined",
                        why: "The course is not running phased pricing, so the scarcity line is not drawn and the button follows the price directly. Inventing urgency where there is none would be the block claiming something the course never said.",
                        code: `<ContentPaywall
    title="Phần còn lại dành cho học viên"
    discountedPriceVnd={1290000}
    originalPriceVnd={1990000}
    ctaLabel="Mở khoá khoá học"
    onPurchase={buy}
/>`,
                        render: (
                            <ContentPaywall
                                anatPart="ContentPaywall"
                                showAnatomy
                                title="Phần còn lại dành cho học viên"
                                discountedPriceVnd={1290000}
                                originalPriceVnd={1990000}
                                ctaLabel="Mở khoá khoá học"
                                onPurchase={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — the caller flips `isSkeleton`; only the PRICE mirrors, the offer stays legible. */
export const Skeleton: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="ContentPaywall"
                tier="block"
                leaf="Prop `isSkeleton`"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "Only the price mirrors itself while the pricing request is in flight; the lock, the headline and the button stay fully real. They are known before any request, and shimmering them would hide an offer the reader could already read and act on.",
                        code: `<ContentPaywall
    title="Phần còn lại dành cho học viên"
    discountedPriceVnd={0}
    isSkeleton
    ctaLabel="Mở khoá khoá học"
    onPurchase={buy}
/>`,
                        render: (
                            <ContentPaywall
                                anatPart="ContentPaywall"
                                showAnatomy
                                title="Phần còn lại dành cho học viên"
                                description="Mở khoá toàn bộ bài học, thử thách và sandbox của khoá này."
                                discountedPriceVnd={0}
                                isSkeleton
                                ctaLabel="Mở khoá khoá học"
                                onPurchase={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
