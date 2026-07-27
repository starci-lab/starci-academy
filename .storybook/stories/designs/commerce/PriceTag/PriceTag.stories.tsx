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

const AMOUNT: AnatomyNode = { name: "Typography", tier: "atom", role: "amount to pay (bold) — no discount", storyId: TYPOGRAPHY_STORY }

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
        role: "button that opens the popover (react-aria: role=button, aria-expanded/controls) — exactly ONE interactive element, wraps the −X% chip",
        children: [
            {
                // Node name = the REAL name of the component (`Chip.Base`), not a dead name:
                // `StatusChip` was REMOVED on 2026-07-26 because it was just this chip with
                // `tone` hardcoded. Tier is `atom` — the old badge showed "layout" because
                // `primitive` was mis-declared.
                name: "Chip.Base",
                tier: "atom",
                role: "\"−X%\" saving label (soft-success) — just a label, not itself a button",
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
                role: "a column of label↔value pairs built from `items`; the TOTAL row turns on `emphasis`",
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
const STACK: AnatomyNode = { name: "Stack.V", tier: "frame", role: "outer column — the price row on top, the \"Save\" line beneath", storyId: "frames-stack-stack-v--default" }
const CLUSTER = (items: Array<AnatomyNode>): AnatomyNode => ({
    name: "Cluster",
    tier: "frame",
    role: "price row — BASELINE aligned (big number, struck number and chip share a baseline) and wraps when space runs out",
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
                reason="A displayed price needs to pack MULTIPLE signals into one spot: the amount to pay (bold), the struck original price, and the saving amount. The saving amount uses a `Chip.Base` (tone success) as both the label and the button that opens the price-breakdown popover (original → phase → membership → you pay). Bundling it into one block keeps the discount logic from drifting across the places a price is shown."
                code={"<PriceTag discounted={1990000} />"}
            >
                <PriceTag discounted={1990000} showAnatomy />
            </BlockAnatomy>,
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
                note="With a discount → adds the struck original price, the −X% chip (opens the popover), and the 'Save N₫' line."
                code={`<PriceTag
    discounted={1290000}
    original={1990000}
    breakdown={{ phase: 1590000, phaseLabel: "Early-bird", loyaltyPercent: 15, loyaltyNote: "owns 2 courses" }}
/>`}
            >
                <PriceTag
                    discounted={1290000}
                    original={1990000}
                    breakdown={{ phase: 1590000, phaseLabel: "Early-bird", loyaltyPercent: 15, loyaltyNote: "owns 2 courses" }}
                    showAnatomy
                />
            </BlockAnatomy>,
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
                note="Every bar keeps the real line box (amount, struck original, chip, saving line) so nothing shifts when the price lands (§8). The −X% chip keeps its slot but drops the Popover — there is nothing to open yet, and a pressable control while loading is a promise the card cannot keep."
                code={"<PriceTag.Prominent isSkeleton discounted={0} original={0} />"}
            >
                <PriceTag.Prominent isSkeleton discounted={1290000} original={1990000} showAnatomy />
            </BlockAnatomy>,
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
                note="Two ROLES for a price: Inline (one line inside a card) vs Prominent (the focal point of the buy CTA). Only the amount's type-scale differs — SAME composition."
                code={`<PriceTag.Inline discounted={1490000} original={1990000} />
<PriceTag.Prominent discounted={1490000} original={1990000} />`}
            >
                <div className="flex flex-col items-start gap-6">
                    <PriceTag.Inline
                        discounted={1490000}
                        original={1990000}
                        breakdown={{ phase: 1690000, phaseLabel: "Early-bird", loyaltyPercent: 12 }}
                        showAnatomy
                    />
                    <PriceTag.Prominent
                        discounted={1490000}
                        original={1990000}
                        breakdown={{ phase: 1690000, phaseLabel: "Early-bird", loyaltyPercent: 12 }}
                        showAnatomy
                    />
                </div>
            </BlockAnatomy>,
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
                note="Only the currency symbol & format change — SAME composition as the 'On sale' leaf."
                code={`<PriceTag
    discounted={79}
    original={129}
    currency="USD"
    breakdown={{ phase: 99, phaseLabel: "Early-bird", loyaltyPercent: 20 }}
/>`}
            >
                <PriceTag
                    discounted={79}
                    original={129}
                    currency="USD"
                    breakdown={{ phase: 99, phaseLabel: "Early-bird", loyaltyPercent: 20 }}
                    showAnatomy
                />
            </BlockAnatomy>,
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
                note="showSavingLine={false} → REMOVES the 'Save N₫' line; the −X% chip + popover stay (differs from the 'On sale' leaf)."
                code={`<PriceTag
    discounted={1290000}
    original={1990000}
    showSavingLine={false}
/>`}
            >
                <PriceTag
                    discounted={1290000}
                    original={1990000}
                    showSavingLine={false}
                    breakdown={{ phase: 1590000, phaseLabel: "Early-bird", loyaltyPercent: 15, loyaltyNote: "owns 2 courses" }}
                    showAnatomy
                />
            </BlockAnatomy>,
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
                note="No breakdown passed → the popover only shows 'original price → you pay'; composition is still like the 'On sale' leaf."
                code={"<PriceTag discounted={1290000} original={1990000} />"}
            >
                <PriceTag discounted={1290000} original={1990000} showAnatomy />
            </BlockAnatomy>,
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
                note="Click the −X% chip → Popover opens, shows the price breakdown; composition like the 'On sale' leaf."
                code={`<PriceTag
    discounted={1290000}
    original={1990000}
    breakdown={{ phase: 1590000, phaseLabel: "Early-bird", loyaltyPercent: 15, loyaltyNote: "owns 2 courses" }}
/>`}
            >
                <PriceTag
                    discounted={1290000}
                    original={1990000}
                    breakdown={{ phase: 1590000, phaseLabel: "Early-bird", loyaltyPercent: 15, loyaltyNote: "owns 2 courses" }}
                    showAnatomy
                />
            </BlockAnatomy>,
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
