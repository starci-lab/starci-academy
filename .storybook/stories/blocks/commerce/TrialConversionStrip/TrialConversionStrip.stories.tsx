import type { Meta, StoryObj } from "@storybook/nextjs"
import { TrialConversionStrip, type TrialConversionStripPrice } from "@sb-components/blocks/commerce/TrialConversionStrip/TrialConversionStrip"
import { PricingPhase } from "@sb-components/_legacy/designs/commerce/PhaseScarcityNote/PhaseScarcityNote"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — the trial → enroll conversion strip on the content-home. Bundles a
 * loss-aversion line (free lessons remaining), the real price (+ phase-scarcity
 * note), and an enroll CTA. `src` is STORE-COUPLED (SWR price fetch + zustand
 * payment overlay) — this port takes the SAME data as PLAIN PROPS (`price`,
 * `isPriceLoading`, `onEnroll`) so it renders standalone. Leaves differ by
 * SHAPE: price loading (skeleton mirror) vs price landed (PriceTag +
 * PhaseScarcityNote), and by content (free lessons remaining vs none left).
 *
 * ANATOMY IS PER-LEAF: each story below is its OWN leaf and carries its OWN
 * BlockAnatomy axis (Diagram + Tree) reflecting the parts THAT leaf composes —
 * there is no separate consolidated "Anatomy" story.
 */
const meta: Meta<typeof TrialConversionStrip> = {
    title: "Blocks/Commerce/TrialConversionStrip",
    component: TrialConversionStrip,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof TrialConversionStrip>

/** Frame each leaf's anatomy panel with breathing room, capped to the strip's real width. */
const frame = (node: React.ReactNode) => <div className="mx-auto max-w-xl p-8">{node}</div>

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
// ⭐ 2026-07-27 (teacher: "layout is built from layouts components"): this block used to
// draw its own surface (`rounded-3xl bg-surface p-5 shadow-surface`) + three hand-rolled
// flex `div`s. It now goes through `SurfaceCard.Base` ⊃ `Stack.V` ⊃ (`Stack.H` · `Split`) —
// and the tree must SAY so, otherwise the reader still thinks this is a hand-rolled div.
const SURFACE: AnatomyNode = {
    name: "SurfaceCard",
    tier: "primitive",
    role: "card face — radius/shadow/`padding` (default 3, matching the card `p-3` rule) comes from the scaffold, not hand-rolled",
    storyId: "layouts-cards-surfacecard-surfacecard-base--default",
}
// ⚠️ TRIED `Split` and it was WRONG: its contract is "the `start` side is allowed to
// SHRINK" ⇒ when tight it SQUEEZES the price column and the −33% chip drops to a new
// line. Price is a number, squeezing it makes no sense — this row must WRAP (the button
// drops below), i.e. `Stack.H` with `wrap`.
// Name differs from the `Stack.H` node of the lead row: the panel groups nodes BY NAME,
// matching names would merge into one.
const PRICE_ROW: AnatomyNode = {
    name: "Stack.H.PriceRow",
    tier: "primitive",
    role: "price ↔ CTA row — `wrap` so the BUTTON drops to a new line when tight, the price column never gets squeezed",
    storyId: "layouts-layout-stack-stack-h--default",
}

const HEADER_PARTS: Array<AnatomyNode> = [
    { name: "IconTile", tier: "atom", role: "the lock glyph in its tinted tile — accent tone, sm (40px)", storyId: "atoms-display-icontile-icontile-base--default" },
    {
        name: "TitledText",
        tier: "primitive",
        role: "the title↔description pair as ONE unit — it owns the type scale (title sm medium, subtitle xs muted)",
        storyId: "layouts-texts-titledtext--row",
    },
]

// LOADING shape — price section mirrors the eventual PriceTag + PhaseScarcityNote box with
// two Skeleton.Typography bars (h4 + body-xs) so layout never shifts once the price lands.
const BUTTON: AnatomyNode = { name: "Button", tier: "atom", role: "unlock CTA — always renders, doesn't wait for the price", storyId: "atoms-buttons-button-button-base--default" }

/** Wraps content in the EXACT scaffold set the block builds: SurfaceCard ⊃ Stack.V ⊃ (Stack.H · Split). */
const framed = (priceSide: Array<AnatomyNode>): Array<AnatomyNode> => [
    {
        ...SURFACE,
        children: [
            {
                name: "Stack.V",
                tier: "primitive",
                role: "column inside the card — `gap-6` seam between the lead cluster and the price block (replaces the removed `border-t`)",
                storyId: "layouts-layout-stack-stack-v--default",
                children: [
                    {
                        name: "Stack.H",
                        tier: "primitive",
                        role: "lead row — icon ↔ text cluster, center-aligned",
                        storyId: "layouts-layout-stack-stack-h--default",
                        children: HEADER_PARTS,
                    },
                    {
                        ...PRICE_ROW,
                        children: [
                            {
                                // Name MUST differ from the outer `Stack.V` node: the panel
                                // groups nodes BY NAME, two `Stack.V`s with the same name
                                // would MERGE into one and misread the tree.
                                name: "Stack.V.Price",
                                tier: "primitive",
                                role: "LEFT side of the Split — price column + scarcity line",
                                storyId: "layouts-layout-stack-stack-v--default",
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
    // These two bars ARE `Typography.Base isSkeleton` — a real component, so they need
    // a door. Without a `storyId` they emit DOM but never enter the tree (§11a whitelist).
    { name: "Skeleton.Price", tier: "atom", role: "mirrors the price line (h4, 1/3 width)", storyId: "atoms-text-typography-typography-base--plain" },
    { name: "Skeleton.Seats", tier: "atom", role: "mirrors the seats line (body-xs, 1/2 width)", storyId: "atoms-text-typography-typography-base--plain" },
])

// LOADED shape — price landed: PriceTag owns the discount, PhaseScarcityNote sits as a
// sibling below owning scarcity (orthogonal urgency, per PhaseScarcityNote's own doc).
const LOADED_PARTS: Array<AnatomyNode> = framed([
    { name: "PriceTag", tier: "design", role: "amount due + struck-through original price + savings chip", storyId: "designs-commerce-pricetag--with-discount" },
    // 2026-07-27: `PhaseScarcityNote` now HAS `anatPart` so it can merge into ONE node.
    // Before, it lacked that prop ⇒ the root emitted no `data-anat-part` ⇒ the amber
    // text line vanished from the tree even though it still rendered, while its four
    // internal spans leaked out as separate siblings.
    { name: "PhaseScarcityNote", tier: "design", role: "seats left in the current phase + the price it rises to", storyId: "designs-commerce-phasescarcitynote-base--full-clause" },
    { name: "Button", tier: "primitive", role: "CTA to unlock the whole course", storyId: "atoms-buttons-button-button-base--default" },
])

/** Price fetch in flight, no price landed yet — the price section mirrors via Skeleton.Typography. */
export const PriceLoading: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="TrialConversionStrip"
                tier="block"
                leaf="Loading"
                parts={LOADING_PARTS}
                reason="The conversion strip bundles 3 honest levers right on the surface the learner is standing on: loss (N free lessons left), scarcity (PhaseScarcityNote — real seats + the price it rises to), and the unlock CTA. The header (IconTile + title/description) renders IMMEDIATELY since it doesn't depend on price; only the price block mirrors via Skeleton.Typography (h4 + body-xs, matching the exact box PriceTag/PhaseScarcityNote will occupy) so layout never jumps once the price lands. The button always renders — the CTA doesn't wait for price."
                code={`<TrialConversionStrip
    freeLessonsRemaining={3}
    isPriceLoading
    onEnroll={handleEnroll}
/>`}
            >
                <TrialConversionStrip
                    freeLessonsRemaining={3}
                    isPriceLoading
                    onEnroll={() => {}}
                    showAnatomy
                />
            </BlockAnatomy>,
        ),
}

/** Price landed, free lessons still remaining — the main "keep going" leaf. */
export const PriceLoadedWithFreeLeft: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="TrialConversionStrip"
                tier="block"
                leaf="PriceLoadedWithFreeLeft"
                parts={LOADED_PARTS}
                note="Price has landed (PriceTag + PhaseScarcityNote replace the 2 Skeleton.Typography bars) — the description uses the line 'N free lessons left unread' (loss-aversion)."
                code={`<TrialConversionStrip
    freeLessonsRemaining={3}
    price={price}
    onEnroll={handleEnroll}
/>`}
            >
                <TrialConversionStrip
                    freeLessonsRemaining={3}
                    price={SAMPLE_PRICE}
                    onEnroll={() => {}}
                    showAnatomy
                />
            </BlockAnatomy>,
        ),
}

/** Price landed, no free lessons left — description switches to the generic pitch. */
export const PriceLoadedNoFreeLeft: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="TrialConversionStrip"
                tier="block"
                leaf="PriceLoadedNoFreeLeft"
                parts={LOADED_PARTS}
                note="freeLessonsRemaining = 0 → Typography · description switches to the generic closing line (all free lessons read), SAME composition as the leaf above."
                code={`<TrialConversionStrip
    freeLessonsRemaining={0}
    price={price}
    onEnroll={handleEnroll}
/>`}
            >
                <TrialConversionStrip
                    freeLessonsRemaining={0}
                    price={SAMPLE_PRICE}
                    onEnroll={() => {}}
                    showAnatomy
                />
            </BlockAnatomy>,
        ),
}
