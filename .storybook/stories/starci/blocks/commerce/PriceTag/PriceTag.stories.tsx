import type { Meta, StoryObj } from "@storybook/nextjs"
import { expect, screen, userEvent, waitFor, within } from "storybook/test"
import { PriceTag, PriceTagInline, PriceTagProminent } from "@sb-components/starci/blocks/commerce/PriceTag/PriceTag"
import { BlockAnatomy, type AnatomyAnnotation, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

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
    title: "StarCi/Blocks/Commerce/PriceTag",
    component: PriceTag,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof PriceTag>

/** Plain canvas for each leaf's anatomy panel. */
const shell = (node: React.ReactNode) => <div data-tier="fixture" className="p-8">{node}</div>

// No saving: only the bold amount — PriceTag directly renders this Typography
// itself (own `type`/`weight`), so it's a badged node even with no other parts.
const TYPOGRAPHY_STORY = "atoms-text-typography-typography--plain"

const AMOUNT: AnatomyNode = { name: "Typography", tier: "atom", role: "the amount to pay (bold), rendered alone when there is no discount to compare it against", storyId: TYPOGRAPHY_STORY }

// The tree reflects the real FRAME: `StackV` (outer column) ⊃ `Cluster` (price row, baseline
// aligned) ⊃ three elements, then the saving line is the column's second line.
const STACK: AnatomyNode = { name: "StackV", tier: "frame", role: "the outer column that stacks the price row on top and the \"Save\" line beneath it", storyId: "frames-stack-stackv--default" }
const CLUSTER = (items: Array<AnatomyNode>): AnatomyNode => ({
    name: "Cluster",
    tier: "frame",
    role: "the price row, baseline aligned so the big number, the struck number, and the chip share one baseline, wrapping onto a new line when space runs out",
    storyId: "frames-cluster-cluster--default",
    children: items,
})

// No discount: still the EXACT SAME frame set, only the price row has a single element.
const NO_DISCOUNT_PARTS: Array<AnatomyNode> = [
    { ...STACK, children: [CLUSTER([AMOUNT])] },
]

/**
 * On-sale composition — amount + struck original + `−X%` chip -> popover + saving line,
 * flattened into the whitelist shape INSTEAD OF a nested `parts` tree.
 *
 * The whitelist shape is a flat `"Name": { … }` record literal — the one
 * `scripts/check-orphan-parts.mjs` recognises (the shape `annotate` uses everywhere else,
 * e.g. `Button`/`Avatar`/`Badge`). A first-occurrence-wins collapse handles the duplicate
 * `Typography` name (original/saving-line drop to the amount's role).
 *
 * The "Popover" context wrapper itself is CUT from the tree — HeroUI's `PopoverRoot` is
 * just a context provider around react-aria's `DialogTrigger`, which renders NO DOM
 * element of its own (state-only, clones its children), so there is nothing to tag with
 * ``. Only its two DOM-bearing children remain, both `tier:
 * "heroui"` (no `storyId` — they're the library's own components, not one of ours):
 * `Popover.Trigger` (the actual clickable div — role=button, aria-expanded/controls —
 * wrapping the `Chip`; the chip is NOT the button, just its soft-success label) and
 * `Popover.Content` (the breakdown rows).
 */
const DISCOUNT_ANNOTATE: Record<string, AnatomyAnnotation> = {
    "StackV": { tier: "frame", role: "the outer column that stacks the price row on top and the \"Save\" line beneath it", storyId: "frames-stack-stackv--default" },
    "Cluster": { tier: "frame", role: "the price row, baseline aligned so the big number, the struck number, and the chip share one baseline, wrapping onto a new line when space runs out", storyId: "frames-cluster-cluster--default" },
    "Typography": { tier: "atom", role: "the amount to pay (bold)", storyId: TYPOGRAPHY_STORY },
    "Popover.Trigger": { tier: "heroui", role: "the button that opens the popover (react-aria: role=button, aria-expanded/controls), the one interactive element in this cluster, wrapping the −X% chip" },
    "Chip": {
        // Node name = the REAL name of the component (`Chip`), not a dead name.
        // Tier is `atom`.
        tier: "atom",
        role: "the \"−X%\" saving label (soft-success), just a label rather than a button itself",
        state: "success",
        storyId: "atoms-chips-chip-chip--default",
    },
    "Popover.Content": { tier: "heroui", role: "the price-breakdown table" },
    "KeyValueList": {
        // The four "label <-> value" rows go through the `KeyValueList`
        // COMPOSITE — the "You pay" row uses `emphasis` so the EMPHASIS is decided by
        // the composite, the same across every price table.
        tier: "composite",
        role: "a column of label and value pairs built from `items`, with the TOTAL row turning on `emphasis`",
        storyId: "composites-data-keyvalue-keyvaluelist--with-total",
    },
}

/** No discount — shows the sale price only, no strikethrough or chip. */
export const Default: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="PriceTag"
                tier="block"
                leaf="Default"
                parts={NO_DISCOUNT_PARTS}
                reason="A displayed price needs to pack multiple signals into one spot: the amount to pay in bold, the struck original price, and the saving amount. The saving amount uses a `Chip` (tone success) as both the label and the button that opens the price-breakdown popover, which walks from the original price, through the phase price and membership discount, down to what the buyer actually pays. Bundling all of this into one block keeps the discount logic from drifting across every place a price gets shown."
                states={[
                    {
                        name: "original = undefined",
                        why: "Only the bold amount to pay renders, with no struck price, chip, or popover anywhere in the tree. A price with nothing to compare it against needs none of that scaffolding, so leaving it out keeps a plain price looking exactly like a plain price.",
                        code: "<PriceTag discounted={1990000} />",
                        render: <PriceTag discounted={1990000} />,
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
                tier="block"
                leaf="WithDiscount"
                annotate={DISCOUNT_ANNOTATE}
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
 * Uses the EXACT SAME annotate table as the discounted version (`DISCOUNT_ANNOTATE`): the flag
 * changes STATE, not STRUCTURE (§11f). The flag flows down into each rendering atom
 * (`Typography`, `Chip`) — there is no second shimmer tree (§12c).
 */
export const Skeleton: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="PriceTag"
                tier="block"
                leaf={"Prop `isSkeleton`"}
                annotate={DISCOUNT_ANNOTATE}
                states={[
                    {
                        name: "isSkeleton",
                        why: "Every bar keeps the real line's box, the amount, the struck original, the chip, and the saving line, so nothing shifts once the price lands (§8). The −X% chip keeps its slot in the row but drops the popover, since there is nothing to open yet and a pressable control while loading is a promise the card cannot keep.",
                        code: "<PriceTagProminent isSkeleton discounted={0} original={0} />",
                        render: <PriceTagProminent isSkeleton discounted={1290000} original={1990000} />,
                    },
                ]}
            />,
        ),
}

/** Pick size by context: `sm` dense lists, `md` default card, `lg` hero/checkout. */
export const Inline: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="PriceTagInline"
                tier="block"
                leaf="Inline"
                annotate={DISCOUNT_ANNOTATE}
                states={[
                    {
                        name: "discounted = 1490000, original = 1990000",
                        why: "The amount renders at the smaller type scale meant to sit as one line inside a card, while the struck price, the chip, the popover and the saving line stay identical to the discounted composition. This size fits a dense list where the price is one signal among several rather than the page's sole focus.",
                        code: "<PriceTagInline discounted={1490000} original={1990000} />",
                        render: (
                            <PriceTagInline
                                discounted={1490000}
                                original={1990000}
                                breakdown={{ phase: 1690000, phaseLabel: "Early-bird", loyaltyPercent: 12 }}

                            />
                        ),
                    },
                ]}
            />,
        ),
}

/** Story: prominent price treatment. */
export const Prominent: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="PriceTagProminent"
                tier="block"
                leaf="Prominent"
                annotate={DISCOUNT_ANNOTATE}
                states={[
                    {
                        name: "discounted = 1490000, original = 1990000",
                        why: "The amount renders at a larger type scale meant to be the focal point of a buy CTA, with the same composition underneath it as the Inline member. This size fits a hero section or a checkout, where the price itself is the thing the page wants the eye to land on first.",
                        code: "<PriceTagProminent discounted={1490000} original={1990000} />",
                        render: (
                            <PriceTagProminent
                                discounted={1490000}
                                original={1990000}
                                breakdown={{ phase: 1690000, phaseLabel: "Early-bird", loyaltyPercent: 12 }}

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
                tier="block"
                leaf="CurrencyUsd"
                annotate={DISCOUNT_ANNOTATE}
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
                tier="block"
                leaf="NoSavingLine"
                annotate={DISCOUNT_ANNOTATE}
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

                            />
                        ),
                    },
                ]}
            />,
        ),
}

/** Discount WITHOUT a `breakdown` — the chip still opens a popover, but it shows only "original price -> you pay" (no phase/loyalty rows). */
export const DiscountWithoutBreakdown: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="PriceTag"
                tier="block"
                leaf="DiscountWithoutBreakdown"
                annotate={DISCOUNT_ANNOTATE}
                states={[
                    {
                        name: "breakdown = undefined",
                        why: "The composition matches the discounted leaf exactly, and the chip still opens a popover, but that popover now shows only the original price resolving down to what the buyer pays, with no phase or loyalty rows in between. Without a breakdown object there is nothing more granular to show, so the popover falls back to the two numbers it always has.",
                        code: "<PriceTag discounted={1290000} original={1990000} />",
                        render: <PriceTag discounted={1290000} original={1990000} />,
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
                tier="block"
                leaf="BreakdownOpen"
                annotate={DISCOUNT_ANNOTATE}
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

                            />
                        ),
                    },
                ]}
            />,
        ),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        // The lookup name must be the trigger's REAL ACCESSIBLE NAME — `aria-label="Price details"`
        // in `PriceTag`. "PriceDetail" was a made-up name that never matched: this play test
        // has been red all along, nobody just opened the Interactions tab to notice.
        await userEvent.click(canvas.getByRole("button", { name: "Price details" }))
        await waitFor(() => expect(screen.getByRole("dialog")).toBeInTheDocument())
    },
}
