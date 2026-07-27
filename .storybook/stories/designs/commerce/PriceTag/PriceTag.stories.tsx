import type { Meta, StoryObj } from "@storybook/nextjs"
import { expect, screen, userEvent, waitFor, within } from "storybook/test"
import { PriceTag } from "@sb-components/designs/commerce/PriceTag/PriceTag"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * DESIGN — a single course/product price: the amount to pay (bold), the struck
 * list price, a `−X%` success chip, and a breakdown popover.
 *
 * ANATOMY IS PER-LEAF: each story below is its OWN leaf and wraps its render in
 * its OWN BlockAnatomy (Diagram + Tree) reflecting the parts THAT leaf composes —
 * there is no separate consolidated "Anatomy" story. The composition shifts with
 * the shape: no-discount shows only the amount; on-sale adds the struck price,
 * chip, popover, and saving line; `showSavingLine={false}` drops that last line.
 */
const meta: Meta<typeof PriceTag> = {
    title: "Designs/Commerce/PriceTag",
    component: PriceTag,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof PriceTag>

/** Plain canvas for each leaf's anatomy panel. */
const shell = (node: React.ReactNode) => <div className="p-8">{node}</div>

// No saving: only the bold amount — PriceTag directly renders this Typography
// itself (own `type`/`weight`), so it's a badged node even with no other parts.
const TYPOGRAPHY_STORY = "atoms-text-typography-typography-base--plain"

const AMOUNT: AnatomyNode = { name: "Typography", tier: "atom", role: "the amount to pay (bold), rendered alone when there is no discount to compare it against", storyId: TYPOGRAPHY_STORY }

// The −X% chip → popover subtree, shared by every on-sale leaf. NOTE: the "Popover"
// wrapper itself is CUT from the tree — HeroUI's `PopoverRoot` is just a context
// provider around react-aria's `DialogTrigger`, which renders NO DOM element of its
// own (state-only, clones its children), so there is nothing to tag with
// `data-anat-part="Popover"`. Only its two DOM-bearing children remain, as SIBLINGS:
// `Popover.Trigger` (the actual clickable div — role=button, aria-expanded/controls —
// wrapping the `Chip.Base`; the chip is NOT the button, just its soft-success label)
// and `Popover.Content` (the breakdown rows).
const PRICE_POPOVER_PARTS: Array<AnatomyNode> = [
    {
        name: "Popover.Trigger",
        tier: "composite",
        role: "the button that opens the popover (react-aria: role=button, aria-expanded/controls), the one interactive element in this cluster, wrapping the −X% chip",
        children: [
            {
                // Node name = the REAL name of the component (`Chip.Base`), not a dead name:
                // `StatusChip` was REMOVED on 2026-07-26 because it was just this chip with
                // `tone` hardcoded. Tier is `atom` — the old badge showed "layout" because
                // `primitive` was mis-declared.
                name: "Chip.Base",
                tier: "atom",
                role: "the \"−X%\" saving label (soft-success), just a label rather than a button itself",
                state: "success",
                storyId: "atoms-chips-chip-chip-base--default",
            },
        ],
    },
    {
        name: "Popover.Content",
        tier: "composite",
        role: "the price-breakdown table",
        children: [
            {
                // ⭐ 2026-07-27: the four "label ↔ value" rows used to be four hand-rolled
                // `<div className="flex items-center justify-between gap-3">` plus a
                // hand-drawn `border-t` for the total row. Now they go through the
                // `KeyValue.List` COMPOSITE — the "You pay" row uses `emphasis` so the EMPHASIS
                // is decided by the composite, the same across every price table.
                name: "KeyValue.List",
                tier: "composite",
                role: "a column of label and value pairs built from `items`, with the TOTAL row turning on `emphasis`",
                storyId: "composites-data-keyvalue-keyvalue-list--with-total",
            },
        ],
    },
]

// On sale: amount (renamed "· amount to pay" once there's a saving to distinguish
// it from the struck original) + struck list price + −X% chip → popover + a
// saving line — PriceTag directly renders every one of these Typography itself.
const AMOUNT_WITH_SAVING: AnatomyNode = { name: "Typography.Amount", tier: "atom", role: "amount to pay (bold)", storyId: TYPOGRAPHY_STORY }
// ⚠️ Node names must match EXACTLY the `data-anat-part` the component emits — `Typography.Original`/
// `Typography.Saving` are the OLD names, the DOM emits `OriginalPrice`/`SavingLine` ⇒ those two
// nodes never matched anything (deep-scan 2026-07-27).
const ORIGINAL: AnatomyNode = { name: "OriginalPrice", tier: "atom", role: "struck original price (muted, line-through)", storyId: TYPOGRAPHY_STORY }
const SAVING_LINE: AnatomyNode = { name: "SavingLine", tier: "atom", role: "the \"Save N₫\" line (muted)", storyId: TYPOGRAPHY_STORY }

// ⭐ 2026-07-27 — the tree now reflects the real FRAME (teacher: "layout is built from
// layouts components"): `Stack.V` (outer column) ⊃ `Cluster` (price row, baseline aligned)
// ⊃ three elements, then `SavingLine` is the column's second line.
const STACK: AnatomyNode = { name: "Stack.V", tier: "frame", role: "the outer column that stacks the price row on top and the \"Save\" line beneath it", storyId: "frames-stack-stack-v--default" }
const CLUSTER = (items: Array<AnatomyNode>): AnatomyNode => ({
    name: "Cluster",
    tier: "frame",
    role: "the price row, baseline aligned so the big number, the struck number, and the chip share one baseline, wrapping onto a new line when space runs out",
    storyId: "frames-cluster-cluster-base--default",
    children: items,
})

// No discount: still the EXACT SAME frame set, only the price row has a single element.
const NO_DISCOUNT_PARTS: Array<AnatomyNode> = [
    { ...STACK, children: [CLUSTER([AMOUNT])] },
]

const DISCOUNT_PARTS: Array<AnatomyNode> = [
    { ...STACK, children: [CLUSTER([AMOUNT_WITH_SAVING, ORIGINAL, ...PRICE_POPOVER_PARTS]), SAVING_LINE] },
]

// On sale with showSavingLine={false}: same composed chrome minus the saving line node.
const NO_SAVING_LINE_PARTS: Array<AnatomyNode> = [
    { ...STACK, children: [CLUSTER([AMOUNT_WITH_SAVING, ORIGINAL, ...PRICE_POPOVER_PARTS])] },
]

/** No discount — shows the sale price only, no strikethrough or chip. */
export const Default: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="PriceTag"
                tier="design"
                leaf="Default"
                parts={NO_DISCOUNT_PARTS}
                reason="A displayed price needs to pack multiple signals into one spot: the amount to pay in bold, the struck original price, and the saving amount. The saving amount uses a `Chip.Base` (tone success) as both the label and the button that opens the price-breakdown popover, which walks from the original price, through the phase price and membership discount, down to what the buyer actually pays. Bundling all of this into one block keeps the discount logic from drifting across every place a price gets shown."
                states={[
                    {
                        name: "original = undefined",
                        why: "Only the bold amount to pay renders, with no struck price, chip, or popover anywhere in the tree. A price with nothing to compare it against needs none of that scaffolding, so leaving it out keeps a plain price looking exactly like a plain price.",
                        code: "<PriceTag discounted={1990000} />",
                        render: <PriceTag discounted={1990000} showAnatomy />,
                    },
                ]}
            />,
        ),
}

/** On sale — struck list price + a `−X%` chip; click/tap the chip to open the breakdown. */
export const WithDiscount: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="PriceTag"
                tier="design"
                leaf="WithDiscount"
                parts={DISCOUNT_PARTS}
                states={[
                    {
                        name: "original set, breakdown set",
                        why: "Alongside the amount to pay, the tree adds the struck original price, the −X% chip that opens the popover, and the \"Save N₫\" line beneath. Together these four pieces let a buyer see the discount, open where it came from, and read the exact amount saved without leaving the price itself.",
                        code: `<PriceTag
    discounted={1290000}
    original={1990000}
    breakdown={{ phase: 1590000, phaseLabel: "Early-bird", loyaltyPercent: 15, loyaltyNote: "owns 2 courses" }}
/>`,
                        render: (
                            <PriceTag
                                discounted={1290000}
                                original={1990000}
                                breakdown={{ phase: 1590000, phaseLabel: "Early-bird", loyaltyPercent: 15, loyaltyNote: "owns 2 courses" }}
                                showAnatomy
                            />
                        ),
                    },
                ]}
            />,
        ),
}

/**
 * Leaf prop `isSkeleton` — the RESTING state.
 *
 * Uses the EXACT SAME parts tree as the discounted version (`DISCOUNT_PARTS`): the flag
 * changes STATE, not STRUCTURE (§11f). The flag flows down into each rendering atom
 * (`Typography.Base`, `Chip.Base`) — there is no second shimmer tree (§12c).
 */
export const Skeleton: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="PriceTag"
                tier="design"
                leaf={"Prop `isSkeleton`"}
                parts={DISCOUNT_PARTS}
                states={[
                    {
                        name: "isSkeleton",
                        why: "Every bar keeps the real line's box, the amount, the struck original, the chip, and the saving line, so nothing shifts once the price lands (§8). The −X% chip keeps its slot in the row but drops the popover, since there is nothing to open yet and a pressable control while loading is a promise the card cannot keep.",
                        code: "<PriceTag.Prominent isSkeleton discounted={0} original={0} />",
                        render: <PriceTag.Prominent isSkeleton discounted={1290000} original={1990000} showAnatomy />,
                    },
                ]}
            />,
        ),
}

/** Pick size by context: `sm` dense lists, `md` default card, `lg` hero/checkout. */
export const Sizes: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="PriceTag"
                tier="design"
                leaf="Sizes"
                parts={DISCOUNT_PARTS}
                states={[
                    {
                        name: "PriceTag.Inline",
                        why: "The amount renders at the smaller type scale meant to sit as one line inside a card, while every other part, the struck price, the chip, the popover, and the saving line, stays identical to the discounted composition. This size fits a dense list where the price is one signal among several, not the page's sole focus.",
                        code: "<PriceTag.Inline discounted={1490000} original={1990000} />",
                        render: (
                            <PriceTag.Inline
                                discounted={1490000}
                                original={1990000}
                                breakdown={{ phase: 1690000, phaseLabel: "Early-bird", loyaltyPercent: 12 }}
                                showAnatomy
                            />
                        ),
                    },
                    {
                        name: "PriceTag.Prominent",
                        why: "The amount renders at a larger type scale meant to be the focal point of a buy CTA, with the same composition underneath it as the Inline size. This size fits a hero section or checkout, where the price itself is the thing the page wants the eye to land on first.",
                        code: "<PriceTag.Prominent discounted={1490000} original={1990000} />",
                        render: (
                            <PriceTag.Prominent
                                discounted={1490000}
                                original={1990000}
                                breakdown={{ phase: 1690000, phaseLabel: "Early-bird", loyaltyPercent: 12 }}
                                showAnatomy
                            />
                        ),
                    },
                ]}
            />,
        ),
}

/** International / USD-listed courses — only the symbol and format change, no conversion. */
export const CurrencyUsd: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="PriceTag"
                tier="design"
                leaf="CurrencyUsd"
                parts={DISCOUNT_PARTS}
                states={[
                    {
                        name: "currency = \"USD\"",
                        why: "Only the currency symbol and the number format change, from a ₫ suffix to a $ prefix with USD grouping, while the composition stays identical to the discounted leaf. No conversion happens in this component, it only formats whatever number and currency the caller already decided on.",
                        code: `<PriceTag
    discounted={79}
    original={129}
    currency="USD"
    breakdown={{ phase: 99, phaseLabel: "Early-bird", loyaltyPercent: 20 }}
/>`,
                        render: (
                            <PriceTag
                                discounted={79}
                                original={129}
                                currency="USD"
                                breakdown={{ phase: 99, phaseLabel: "Early-bird", loyaltyPercent: 20 }}
                                showAnatomy
                            />
                        ),
                    },
                ]}
            />,
        ),
}

/** Discount with `showSavingLine={false}` — dense-card context: chip stays clickable, but the concrete "save N₫" line is hidden. */
export const NoSavingLine: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="PriceTag"
                tier="design"
                leaf="NoSavingLine"
                parts={NO_SAVING_LINE_PARTS}
                states={[
                    {
                        name: "showSavingLine = false",
                        why: "The \"Save N₫\" line drops out of the tree while the −X% chip and its popover stay in place and stay clickable. A dense card context wants the chip's shorthand without spending a whole second line spelling out the same fact in currency.",
                        code: `<PriceTag
    discounted={1290000}
    original={1990000}
    showSavingLine={false}
/>`,
                        render: (
                            <PriceTag
                                discounted={1290000}
                                original={1990000}
                                showSavingLine={false}
                                breakdown={{ phase: 1590000, phaseLabel: "Early-bird", loyaltyPercent: 15, loyaltyNote: "owns 2 courses" }}
                                showAnatomy
                            />
                        ),
                    },
                ]}
            />,
        ),
}

/** Discount WITHOUT a `breakdown` — the chip still opens a popover, but it shows only "original price → you pay" (no phase/loyalty rows). */
export const DiscountWithoutBreakdown: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="PriceTag"
                tier="design"
                leaf="DiscountWithoutBreakdown"
                parts={DISCOUNT_PARTS}
                states={[
                    {
                        name: "breakdown = undefined",
                        why: "The composition matches the discounted leaf exactly, and the chip still opens a popover, but that popover now shows only the original price resolving down to what the buyer pays, with no phase or loyalty rows in between. Without a breakdown object there is nothing more granular to show, so the popover falls back to the two numbers it always has.",
                        code: "<PriceTag discounted={1290000} original={1990000} />",
                        render: <PriceTag discounted={1290000} original={1990000} showAnatomy />,
                    },
                ]}
            />,
        ),
}

/** The breakdown Popover shown OPEN — the `play` clicks the `−X%` chip (a button, not a hover tooltip). */
export const BreakdownOpen: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="PriceTag"
                tier="design"
                leaf="BreakdownOpen"
                parts={DISCOUNT_PARTS}
                states={[
                    {
                        name: "breakdown set, popover opened by the play test",
                        why: "Clicking the −X% chip opens the popover to show the full price breakdown, with the same composition underneath it as the discounted leaf. The `play` function drives a real button click rather than a hover, matching how a touch or keyboard user actually opens this popover.",
                        code: `<PriceTag
    discounted={1290000}
    original={1990000}
    breakdown={{ phase: 1590000, phaseLabel: "Early-bird", loyaltyPercent: 15, loyaltyNote: "owns 2 courses" }}
/>`,
                        render: (
                            <PriceTag
                                discounted={1290000}
                                original={1990000}
                                breakdown={{ phase: 1590000, phaseLabel: "Early-bird", loyaltyPercent: 15, loyaltyNote: "owns 2 courses" }}
                                showAnatomy
                            />
                        ),
                    },
                ]}
            />,
        ),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        // The lookup name must be the trigger's REAL ACCESSIBLE NAME — `aria-label="Chi tiết giá"`
        // in `PriceTag`. "PriceDetail" was a made-up name that never matched: this play test
        // has been red all along, nobody just opened the Interactions tab to notice.
        await userEvent.click(canvas.getByRole("button", { name: "Chi tiết giá" }))
        await waitFor(() => expect(screen.getByRole("dialog")).toBeInTheDocument())
    },
}
