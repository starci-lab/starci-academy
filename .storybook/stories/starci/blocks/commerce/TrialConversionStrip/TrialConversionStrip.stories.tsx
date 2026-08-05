import type { Meta, StoryObj } from "@storybook/nextjs"
import { TrialConversionStrip, type TrialConversionStripPrice } from "@sb-components/starci/blocks/commerce/TrialConversionStrip/TrialConversionStrip"
import { PricingPhase } from "@sb-components/starci/blocks/commerce/PhaseScarcityNote/PhaseScarcityNote"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — the trial → enroll conversion strip on the content-home. Bundles a
 * loss-aversion line (free lessons remaining), the real price (+ phase-scarcity
 * note), and an enroll CTA. `src` is STORE-COUPLED (SWR price fetch + zustand
 * payment overlay) — this port takes the SAME data as PLAIN PROPS (`price`,
 * `isSkeleton`, `onEnroll`) so it renders standalone. Leaves differ by
 * SHAPE: price loading (skeleton mirror) vs price landed (PriceTag +
 * PhaseScarcityNote), and by content (free lessons remaining vs none left).
 *
 * ANATOMY IS PER-LEAF: each story below is its OWN leaf and carries its OWN
 * BlockAnatomy axis (Diagram + Tree) reflecting the parts THAT leaf composes —
 * there is no separate consolidated "Anatomy" story.
 */
const meta: Meta<typeof TrialConversionStrip> = {
    title: "StarCi/Blocks/Commerce/TrialConversionStrip/TrialConversionStrip",
    component: TrialConversionStrip,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof TrialConversionStrip>

/** Frame each leaf's anatomy panel with breathing room, capped to the strip's real width. */
/**
 * Story canvas padding only. The SUBJECT's own width goes through `BlockAnatomy`'s
 * `renderClassName`, not wrapped here: wrapping it here would make the panel inherit
 * `max-w-xl` and squeeze its three text columns into 576px.
 */
const frame = (node: React.ReactNode) => <div data-tier="fixture" className="p-8">{node}</div>

/** Sample landed price preview — early-bird phase, 22% off, 12 seats left before it rises. */
const SAMPLE_PRICE: TrialConversionStripPrice = {
    discountedPriceVnd: 1_990_000,
    originalPriceVnd: 2_990_000,
    phasePriceVnd: 2_490_000,
    discountPercent: 20,
    currentPhase: PricingPhase.EarlyBird,
    seatsRemainingInCurrentPhase: 12,
    nextPhasePriceVnd: 2_490_000,
}

// Header cluster — IconTile + a two-line Typography pair — is SHARED by every leaf below
// (only the price section + CTA differ), so it is one constant reused across the parts trees.
// This block goes through `SurfaceCard` ⊃ `StackV` ⊃ (`StackH` · `Split`).
const SURFACE: AnatomyNode = {
    name: "SurfaceCard",
    tier: "composite",
    role: "card face — radius/shadow/`padding` (default 3, matching the card `p-3` rule) comes from the scaffold, not hand-rolled",
    storyId: "composites-cards-surfacecard-surfacecard--default",
}
// WARNING: TRIED `Split` and it was WRONG: its contract is "the `start` side is allowed to
// SHRINK" ⇒ when tight it SQUEEZES the price column and the −33% chip drops to a new
// line. Price is a number, squeezing it makes no sense — this row must WRAP (the button
// drops below), i.e. `StackH` with `wrap`.
// Name differs from the `StackH` node of the lead row: the panel groups nodes BY NAME,
// matching names would merge into one.
const PRICE_ROW: AnatomyNode = {
    name: "StackH",
    tier: "frame",
    role: "price ↔ CTA row — `wrap` so the BUTTON drops to a new line when tight, the price column never gets squeezed",
    storyId: "frames-stack-stackh--default",
}

const HEADER_PARTS: Array<AnatomyNode> = [
    { name: "IconTile", tier: "atom", role: "the lock glyph in its tinted tile — accent tone, sm (40px)", storyId: "atoms-display-icontile-icontile--default" },
    {
        name: "TitledText",
        tier: "composite",
        role: "the title↔description pair as ONE unit — it owns the type scale (title sm medium, subtitle xs muted)",
        storyId: "composites-texts-titledtext--overview",
    },
]

// LOADING shape — price section mirrors the eventual PriceTag + PhaseScarcityNote box with
// two Skeleton.Typography bars (h4 + body-xs) so layout never shifts once the price lands.
const BUTTON: AnatomyNode = { name: "Button", tier: "atom", role: "unlock CTA — always renders, doesn't wait for the price", storyId: "atoms-buttons-button-button--default" }

/** Wraps content in the EXACT scaffold set the block builds: SurfaceCard ⊃ StackV ⊃ (StackH · Split). */
const framed = (priceSide: Array<AnatomyNode>): Array<AnatomyNode> => [
    {
        ...SURFACE,
        children: [
            {
                name: "StackV",
                tier: "frame",
                role: "column inside the card — `gap-6` seam between the lead cluster and the price block (replaces the removed `border-t`)",
                storyId: "frames-stack-stackv--default",
                children: [
                    {
                        name: "StackH",
                        tier: "frame",
                        role: "lead row — icon ↔ text cluster, center-aligned",
                        storyId: "frames-stack-stackh--default",
                        children: HEADER_PARTS,
                    },
                    {
                        ...PRICE_ROW,
                        children: [
                            {
                                // Name MUST differ from the outer `StackV` node: the panel
                                // groups nodes BY NAME, two `StackV`s with the same name
                                // would MERGE into one and misread the tree.
                                name: "StackV",
                                tier: "frame",
                                role: "LEFT side of the Split — price column + scarcity line",
                                storyId: "frames-stack-stackv--default",
                                children: priceSide,
                            },
                            BUTTON,
                        ],
                    },
                ],
            },
        ],
    },
]

const LOADING_PARTS: Array<AnatomyNode> = framed([
    // These two bars ARE `Typography isSkeleton` — a real component, so they need
    // a door. Without a `storyId` they emit DOM but never enter the tree (§11a whitelist).
    { name: "Typography", tier: "atom", role: "mirrors one of the two waiting lines — the price (h4, 1/3 width) or the seats line (body-xs, 1/2 width)", storyId: "atoms-text-typography-typography--overview" },
])

// LOADED shape — price landed: PriceTag owns the discount, PhaseScarcityNote sits as a
// sibling below owning scarcity (orthogonal urgency, per PhaseScarcityNote's own doc).
const LOADED_PARTS: Array<AnatomyNode> = framed([
    { name: "PriceTagProminent", tier: "block", role: "amount due + struck-through original price + savings chip", storyId: "starci-blocks-commerce-pricetag--with-discount" },
    // `PhaseScarcityNote` HAS `anatPart` so it can merge into ONE node.
    { name: "PhaseScarcityNote", tier: "block", role: "seats left in the current phase + the price it rises to", storyId: "starci-blocks-commerce-phasescarcitynote-phasescarcitynote--default" },
    { name: "Button", tier: "atom", role: "CTA to unlock the whole course", storyId: "atoms-buttons-button-button--default" },
])

/**
 * Leaf for `isSkeleton`. Only the PRICE region rests — the header and the CTA do not
 * depend on the price, so they render at once and the two shimmer bars stand exactly where
 * PriceTag + PhaseScarcityNote will land, which is what keeps the layout from jumping.
 *
 * A leaf is named after the TRUC it draws, and the prop is `isSkeleton` at every tier.
 */
export const Skeleton: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="TrialConversionStrip"
                tier="block"
                leaf="Prop `isSkeleton`"
                renderClassName="mx-auto max-w-xl"
                parts={LOADING_PARTS}
                reason="Only the PRICE region rests. The header and the CTA do not depend on the price, so they render at once and the two shimmer bars stand exactly where PriceTag and PhaseScarcityNote will land, which is what stops the layout jumping when the price arrives."
                states={[
                    {
                        name: "isSkeleton, price not yet arrived",
                        why: "`PriceTag` and `PhaseScarcityNote` are replaced by two shimmer bars sized to the box they will occupy. The block draws its own resting shape rather than waiting on a shared skeleton component, so whoever owns the shape owns how it rests.",
                        code: `<TrialConversionStrip
    freeLessonsRemaining={3}
    isSkeleton
    onEnroll={handleEnroll}
/>`,
                        render: (
                            <TrialConversionStrip
                                freeLessonsRemaining={3}
                                isSkeleton
                                onEnroll={() => {}}

                            />
                        ),
                    },
                ]}
            />,
        ),
}

/** Story: resting state for this component. */
export const Default: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="TrialConversionStrip"
                tier="block"
                leaf="Default"
                renderClassName="mx-auto max-w-xl"
                parts={LOADED_PARTS}
                reason="The strip carries three honest levers on the surface the learner is already standing on, namely what they lose by stopping, how scarce the current price is, and the single button that ends the decision. Every number arrives as a prop from the caller, so this block never fabricates a price, a seat count or a deadline."
                states={[
                    {
                        name: "freeLessonsRemaining = 3",
                        why: "The description names how many free lessons are still unread. Loss aversion works harder than a discount here, because the learner already owns something they are about to leave behind.",
                        code: `<TrialConversionStrip
    freeLessonsRemaining={3}
    price={price}
    onEnroll={handleEnroll}
/>`,
                        render: (
                            <TrialConversionStrip
                                freeLessonsRemaining={3}
                                price={SAMPLE_PRICE}
                                onEnroll={() => {}}

                            />
                        ),
                    },
                    {
                        name: "freeLessonsRemaining = 0",
                        why: "Only the `subtitle` string changes and the node tree stays identical to the first state. With nothing free left the loss argument is spent, so the sentence switches to the closing line that asks for the purchase.",
                        code: `<TrialConversionStrip
    freeLessonsRemaining={0}
    price={price}
    onEnroll={handleEnroll}
/>`,
                        render: (
                            <TrialConversionStrip
                                freeLessonsRemaining={0}
                                price={SAMPLE_PRICE}
                                onEnroll={() => {}}

                            />
                        ),
                    },
                ]}
            />,
        ),
}
