import type { Meta, StoryObj } from "@storybook/nextjs"
import { PricePeriod } from "@sb-components/composites/text/PricePeriod/PricePeriod"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * COMPOSITE — `PricePeriod`: a price shown as one baseline-aligned unit — a
 * prominent amount, an optional struck original/list price, and an optional
 * billing period ("/month"). Replaces the retired `PricePoint` atom, which
 * reached ATOM-3 by rendering raw spans instead of the house `Typography`
 * atom; this composite fixes that by composing `Typography` for all three
 * parts, so each part draws its own tone AND its own skeleton bar.
 *
 * Distinct from `commerce/PriceTag`, which is a product-discount price
 * (VND/USD numbers + a −X% chip + a breakdown popover) — `PricePeriod` takes
 * pre-formatted strings plus a billing `/period`.
 *
 * 📐 **1 PROP = 1 LEAF.** `original`, `period`, `size`, `isSkeleton` each get
 * their own leaf. `amount` has no leaf of its own — it is the content every
 * other leaf fills in, the same role `label`/`value` play on `KeyValueRow`.
 * `anatPart`/`classNames` get none — pure wiring/placement props with no
 * visible shape of their own.
 *
 * COMPOSITE GAP — `PricePeriod` does not forward `showAnatomy` into its three
 * `Typography` calls yet, so the Structure tab below stays empty for now; the
 * table is left in place as the mapping for when that wiring lands.
 */

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Typography": {
        tier: "atom",
        role: "the amount, the struck original, and the period — three separate Typography instances, one per part",
        storyId: "atoms-text-typography-typography--plain",
    },
}

const meta: Meta<typeof PricePeriod> = {
    title: "Composites/Texts/PricePeriod",
    component: PricePeriod,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}
export default meta

type Story = StoryObj<typeof PricePeriod>

/** Bare leaf — no optional prop turned on: just the amount, at the default `md` scale. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="PricePeriod"
                tier="composite"
                annotate={ANNOTATE}
                leaf="No prop turned on"
                reason="The baseline: just the amount, no original, no period, at the default md scale. Every leaf below differs from this one by exactly one prop."
                states={[
                    {
                        name: "amount only, size = \"md\" (default)",
                        why: "The amount renders alone as a semibold h3, with no struck price and no trailing period text. This is the plainest shape the unit can take — a flat one-time price with nothing to compare it against.",
                        code: "<PricePeriod amount=\"199,000₫\" />",
                        render: <PricePeriod amount="199,000₫" anatPart="PricePeriod" />,
                    },
                ]}
            />
        </div>
    ),
}

/**
 * Leaf for prop `original` — the struck-through list price sitting beside
 * the amount. Pass it only when there is a real discount to show.
 */
export const OriginalPrice: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="PricePeriod"
                tier="composite"
                annotate={ANNOTATE}
                leaf="Prop `original`"
                reason="original is the struck list price beside the amount, so the reader can do the subtraction themselves. Skip it on a plain price; a struck number with nothing to compare against just reads as noise."
                states={[
                    {
                        name: "original = undefined (default)",
                        why: "No struck price renders — only the amount and the period sit on the baseline. This is the shape for a flat price with no discount to show off.",
                        code: "<PricePeriod amount=\"199,000₫\" period=\"/month\" />",
                        render: <PricePeriod amount="199,000₫" period="/month" />,
                    },
                    {
                        name: "original set",
                        why: "A muted, struck-through original price grows beside the amount, sized off the same per-size table as the rest of the unit. This is the shape for a real discount, where the crossed-out number lets the reader see exactly how much they are saving.",
                        code: "<PricePeriod amount=\"199,000₫\" original=\"399,000₫\" period=\"/month\" />",
                        render: <PricePeriod amount="199,000₫" original="399,000₫" period="/month" />,
                    },
                ]}
            />
        </div>
    ),
}

/**
 * Leaf for prop `period` — the billing cadence rendered small and muted
 * right after the amount.
 */
export const Period: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="PricePeriod"
                tier="composite"
                annotate={ANNOTATE}
                leaf="Prop `period`"
                reason="period renders small and muted right after the amount, so a recurring price doesn't leave the reader guessing whether it's one-time or a subscription. Skip it for a flat one-time price."
                states={[
                    {
                        name: "period = undefined (default)",
                        why: "The amount stands alone with no trailing period text — the shape for a one-time price, like a single course purchase.",
                        code: "<PricePeriod amount=\"499,000₫\" />",
                        render: <PricePeriod amount="499,000₫" />,
                    },
                    {
                        name: "period set",
                        why: "A small muted \"/month\" grows right after the amount, on the same baseline. This is the shape for a subscription price, telling the reader the number recurs instead of being charged once.",
                        code: "<PricePeriod amount=\"199,000₫\" period=\"/month\" />",
                        render: <PricePeriod amount="199,000₫" period="/month" />,
                    },
                ]}
            />
        </div>
    ),
}

/**
 * Leaf for prop `size` — 3 scale tiers driving the WHOLE unit, not just the
 * amount: `original`/`period` ride the same per-size table via
 * `SIZE_TO_TOKENS`.
 */
export const Sizes: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="PricePeriod"
                tier="composite"
                annotate={ANNOTATE}
                leaf="Prop `size`"
                reason="size drives the whole unit's type scale, not just the amount — the struck original and the period ride the same per-size table, so a bigger amount also gets a bigger (still visibly secondary) original and period instead of staying pinned to one tiny size."
                states={[
                    {
                        name: "size = \"sm\"",
                        why: "The amount renders as an h4, with the original and period stepped down to xs. This scale suits a dense price list, like a comparison table of several plans side by side.",
                        code: "<PricePeriod size=\"sm\" amount=\"99,000₫\" original=\"149,000₫\" period=\"/month\" />",
                        render: <PricePeriod size="sm" amount="99,000₫" original="149,000₫" period="/month" />,
                    },
                    {
                        name: "size = \"md\" (default)",
                        why: "The amount renders as an h3, the default scale every PricePeriod falls back to when size is left unset, with the original at sm and the period at xs. This is the scale a plain pricing card reaches for.",
                        code: "<PricePeriod amount=\"199,000₫\" original=\"399,000₫\" period=\"/month\" />",
                        render: <PricePeriod size="md" amount="199,000₫" original="399,000₫" period="/month" />,
                    },
                    {
                        name: "size = \"lg\"",
                        why: "The amount renders as an h2, with the original at base and the period at sm — the largest scale in the union. This suits a hero pricing section, a single plan a page wants the reader's eye to land on first.",
                        code: "<PricePeriod size=\"lg\" amount=\"499,000₫\" original=\"699,000₫\" period=\"/month\" />",
                        render: <PricePeriod size="lg" amount="499,000₫" original="699,000₫" period="/month" />,
                    },
                ]}
            />
        </div>
    ),
}

/**
 * Leaf for prop `isSkeleton` — shimmer CO-LOCATED per part: the amount bar
 * always shows, a second shorter bar only appears when `period` is set, and
 * `original` never gets a placeholder of its own.
 */
export const SkeletonState: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="PricePeriod"
                tier="composite"
                annotate={ANNOTATE}
                leaf="Prop `isSkeleton`"
                reason="isSkeleton flows into each part's own Typography instance; the amount bar always shows, a second shorter bar only appears when period is set, and original never gets a placeholder of its own — it has no shape to preserve while loading."
                states={[
                    {
                        name: "isSkeleton = false",
                        why: "The real unit renders: amount, struck original, and period — the shape the shimmer below mirrors.",
                        code: "<PricePeriod amount=\"199,000₫\" original=\"399,000₫\" period=\"/month\" />",
                        render: <PricePeriod amount="199,000₫" original="399,000₫" period="/month" />,
                    },
                    {
                        name: "isSkeleton = true, no period",
                        why: "Only one shimmer bar renders, standing in for the amount. With no period passed, no second bar grows — the placeholder mirrors exactly the parts the real price would show.",
                        code: "<PricePeriod isSkeleton size=\"sm\" />",
                        render: <PricePeriod isSkeleton size="sm" />,
                    },
                    {
                        name: "isSkeleton = true, period set",
                        why: "A second, shorter shimmer bar grows after the first, mirroring where the real period text would sit. The original never gets a bar of its own even when set on the loaded state, since a struck price has no fixed shape worth guessing at before the discount is known.",
                        code: "<PricePeriod isSkeleton size=\"lg\" period=\"/month\" />",
                        render: <PricePeriod isSkeleton size="lg" period="/month" />,
                    },
                ]}
            />
        </div>
    ),
}
