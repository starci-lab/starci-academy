import type { Meta, StoryObj } from "@storybook/nextjs"
import { EnrollGate } from "@sb-components/starci/blocks/learn/EnrollGate/EnrollGate"
import { PricingPhase } from "@sb-components/starci/blocks/commerce/PhaseScarcityNote/PhaseScarcityNote"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `EnrollGate` — the conversion card shown in place of an enrollment-required
 * learn surface (currently personal-project) for a trial viewer. Kept separate
 * from `ContentPaywall` despite composing the same two commerce blocks. Four
 * leaves: `Standalone` (no `preview`, centered), `WithPreview` (floats over a
 * faded teaser), `NoScarcity` (no `price.currentPhase`, drops
 * `PhaseScarcityNote`), and `Loading` (`isSkeleton`, price region shimmers).
 */
const meta: Meta<typeof EnrollGate> = {
    title: "StarCi/Blocks/Learn/EnrollGate/EnrollGate",
    component: EnrollGate,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof EnrollGate>

const PRICE = {
    discountedVnd: 1_990_000,
    originalVnd: 2_990_000,
    breakdown: { phase: 2_490_000, phaseLabel: "Early bird", loyaltyPercent: 20, loyaltyNote: "completed 2 courses" },
    currentPhase: PricingPhase.EarlyBird,
    seatsRemaining: 12,
    nextPhasePriceVnd: 2_490_000,
}

// A stand-in for a real teaser block (e.g. `PersonalProjectGatePreview`) —
// representative, non-interactive content, matching the "mock teaser" contract
// `preview` documents. Not itself a design-system component, so it carries no
// `data-anat-part` of its own (nothing for the anatomy panel to link to).
const MockPreview = () => (
    <div data-tier="fixture" className="mx-auto flex w-full max-w-3xl flex-col gap-3">
        <div className="rounded-3xl bg-surface p-6 shadow-surface">
            <div className="h-5 w-2/3 rounded bg-default" />
            <div className="mt-3 h-3 w-1/3 rounded bg-default" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
            <div className="h-24 rounded-2xl bg-surface shadow-surface" />
            <div className="h-24 rounded-2xl bg-surface shadow-surface" />
        </div>
    </div>
)

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "SurfaceCard": { tier: "composite", role: "the conversion card's own face — surface fill, rounded-3xl, shadow — so it floats up whether alone or over a faded teaser", storyId: "composites-cards-surfacecard-surfacecard--default" },
    "StackV": { tier: "frame", role: "the vertical frame stacking lock, headline, description, price region and CTA with one owned seam", storyId: "frames-stack-stackv--default" },
    "IconTile": { tier: "atom", role: "the lock identity marking this as a gated surface", storyId: "atoms-display-icontile-icontile--default" },
    "Typography": { tier: "atom", role: "one of the block's own text lines — the headline or the outcome sentence", storyId: "atoms-text-typography-typography--overview" },
    "PriceTagProminent": { tier: "block", role: "the loyalty-aware price, the SAME render as the payment modal's own price line", storyId: "starci-blocks-commerce-pricetag--prominent" },
    "PhaseScarcityNote": { tier: "block", role: "the honest seats-left + next-phase-price line, self-hiding when the phase has no seat cap", storyId: "starci-blocks-commerce-phasescarcitynote-phasescarcitynote--default" },
    "Button": { tier: "atom", role: "the single enroll CTA — one way through, no second control to weigh", storyId: "atoms-buttons-button-button--icon-slide" },
}

/** LEAF — no `preview` ⇒ the card renders centered alone on the canvas. */
export const Standalone: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="EnrollGate"
                tier="block"
                leaf="Standalone"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "preview = undefined",
                        why: "With no teaser to show, the gate is just the conversion card, centered in whatever region replaces the locked surface. This is the shape every gate starts from before a screen decides it also has a preview worth showing.",
                        code: `<EnrollGate
    title="Unlock the Personal Project"
    description="Enroll to build a real capstone, graded by AI."
    price={price}
    onEnroll={() => {}}
/>`,
                        render: (
                            <EnrollGate


                                title="Unlock the Personal Project"
                                description="Enroll to build a real capstone, graded by AI."
                                price={PRICE}
                                onEnroll={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — `preview` given ⇒ **gains** a whole faded-teaser layer the card floats over. */
export const WithPreview: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="EnrollGate"
                tier="block"
                leaf="With preview"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "preview = <MockPreview />",
                        why: "The real surface's own shape shows through, faded, with the card floating over its tail. A trial learner sees what enrolling actually unlocks instead of guessing from copy alone — the Medium-style upgrade this prop exists for.",
                        code: `<EnrollGate
    title="Unlock the Personal Project"
    description="Enroll to build a real capstone, graded by AI."
    preview={<PersonalProjectGatePreview />}
    price={price}
    onEnroll={() => {}}
/>`,
                        render: (
                            <EnrollGate


                                title="Unlock the Personal Project"
                                description="Enroll to build a real capstone, graded by AI."
                                preview={<MockPreview />}
                                price={PRICE}
                                onEnroll={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — `price.currentPhase` omitted ⇒ **loses** the whole `PhaseScarcityNote` node. */
export const NoScarcity: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="EnrollGate"
                tier="block"
                leaf="No scarcity"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "price.currentPhase = undefined",
                        why: "An unlimited phase has no real seat cap to report, so the scarcity line does not render an empty or fabricated claim — it simply is not there, and the card ends at the price.",
                        code: `<EnrollGate
    title="Unlock the Personal Project"
    description="Enroll to build a real capstone, graded by AI."
    price={{ discountedVnd: 1990000, originalVnd: 2990000 }}
    onEnroll={() => {}}
/>`,
                        render: (
                            <EnrollGate


                                title="Unlock the Personal Project"
                                description="Enroll to build a real capstone, graded by AI."
                                price={{ discountedVnd: 1_990_000, originalVnd: 2_990_000 }}
                                onEnroll={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — the caller flips `isSkeleton`, so the price region falls to its shimmer branch. */
export const Loading: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="EnrollGate"
                tier="block"
                leaf="Prop `isSkeleton`"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "The lock, headline, description and CTA are already known before any price request, so they stay real; only the price region — the one thing that genuinely depends on a network round-trip — falls to AsyncContent's shimmer branch.",
                        code: `<EnrollGate
    title="Unlock the Personal Project"
    description="Enroll to build a real capstone, graded by AI."
    onEnroll={() => {}}
    isSkeleton
/>`,
                        render: (
                            <EnrollGate


                                title="Unlock the Personal Project"
                                description="Enroll to build a real capstone, graded by AI."
                                onEnroll={() => {}}
                                isSkeleton
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
