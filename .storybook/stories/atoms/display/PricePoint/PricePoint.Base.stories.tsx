import type { Meta, StoryObj } from "@storybook/nextjs"
import { PricePoint } from "@sb-components/atoms/display/PricePoint/PricePoint"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `PricePoint.Base`: tier/subscription price as ONE baseline-aligned unit
 * (amount + optional struck original + optional billing period).
 *
 * 📐 **1 PROP = 1 LEAF** (§12g). Leaf-worthy props: `original` · `period` · `size` ·
 * `isSkeleton`. `amount` carries CONTENT, not a leaf of its own (same treatment as
 * Chip's `text`) — every leaf below just picks whichever amount reads best. `anatPart`,
 * `className`, and `showAnatomy` render nothing by themselves, so they get no leaf.
 *
 * `isSkeleton` now DISCRIMINATES `amount` (§12c, same union shape as
 * `Chip.Base`/`Typography.Base`): `{isSkeleton:true; amount?}` vs
 * `{isSkeleton?:false; amount:required}`. The `Skeleton` leaf below passes no `amount`
 * on purpose — the shimmer never reads it.
 *
 * This atom composes `Typography.Base` for ALL three parts now, amount included
 * (previously raw HeroUI `Typography`, kept only because `Typography.Base` did not
 * cover heading sizes yet). `showAnatomy`/`anatPart` forward down into those calls,
 * and the atom tags all three with the SAME `anatPart="Typography.Base"` — the REAL
 * component name (§ naming pass, 2026-07-28), not the role words `Amount`/
 * `Original`/`Period` a previous pass used. The panel groups nodes by DOM element,
 * not by name, so three same-named `Typography.Base` nodes still show up as three
 * separate branches; only the label/story link they share is now honest about what
 * they actually are. Same treatment for the skeleton branch's two `HeroSkeleton`
 * bars, now both named `Skeleton` (real HeroUI import), `tier: "heroui"`.
 *
 * `original`/`period` used to be locked to a fixed small size regardless of `size` —
 * now they ride the SAME per-size token table as `amount`, so `size="lg"` reads as one
 * coherent, larger unit instead of a big number next to leftover tiny text.
 *
 * 2026-07-27: migrated to the `states` API (§8) — each prop's demonstrated values
 * are now `states[]` entries instead of a stacked flex row under one shared `note`.
 */

/** Doc shown at the top of the autodocs page. UI copy stays English (2026-07-26 house style). */
const PRICE_POINT_DOC = `
## When to add the original price

Pass \`original\` only when there is a real discount to show — the struck price sits
beside the amount so the reader can do the subtraction themselves. Skip it on a plain
price; a struck-through number with nothing to compare against just reads as noise.

## When to add a period

\`period\` renders small and muted right after the amount (\`/month\`). Add it for a
recurring price so the reader isn't left guessing whether it's one-time or a
subscription; skip it for a flat one-time price.

## Sizing

\`size\` drives the WHOLE unit's type scale, not just the amount — the struck original
and the period ride the same per-size table, so a bigger amount also gets a bigger
(still visibly secondary) original and period instead of staying pinned to one tiny
size. Reach for \`lg\` on the price that anchors a pricing page, \`sm\` for a price
sitting inside a denser row.
`

const meta: Meta<typeof PricePoint.Base> = {
    title: "Atoms/Display/PricePoint/PricePoint.Base",
    component: PricePoint.Base,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
        docs: { description: { component: PRICE_POINT_DOC } },
    },
}

export default meta

type Story = StoryObj<typeof PricePoint.Base>

/** Story đích của cả ba part — chúng đều là `Typography.Base`, khác nhau ở cỡ/tone. */
const TYPOGRAPHY_STORY = "atoms-text-typography-typography-base--plain"

/**
 * Chú giải DÙNG CHUNG cho cả ba part (amount/original/period): tất cả đều là cùng
 * MỘT real component, `Typography.Base`, nên chia sẻ một entry theo tên thật thay
 * vì ba tên bịa `Amount`/`Original`/`Period` (§ naming pass, 2026-07-28) — panel
 * gom node theo phần tử DOM nên ba lần xuất hiện vẫn ra ba nhánh riêng.
 */
const PART_TYPOGRAPHY: AnatomyAnnotation = {
    role: "One of the three price parts (the prominent amount, the struck original, or the billing period) — each a Typography.Base instance riding this atom's own per-size type scale.",
    tier: "atom",
    storyId: TYPOGRAPHY_STORY,
}

/** Chú giải cho bar shimmer — cùng một HeroUI `Skeleton` cho cả amount-bar lẫn period-bar. */
const PART_SKELETON: AnatomyAnnotation = {
    role: "A shimmer bar mirroring either the amount or the period box at this size.",
    tier: "heroui",
}

/** Leaf TRẦN — chỉ `amount`, không `original`/`period`, `size` mặc định `"md"`. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="PricePoint.Base"
                tier="atom"
                leaf="Bare price"
                reason="The baseline unit: just the amount, at the default md scale. Every leaf below differs by exactly one prop, so this is what you compare the others against."
                annotate={{ "Typography.Base": PART_TYPOGRAPHY }}
                states={[
                    {
                        name: "original and period both unset, size unset",
                        why: "The DOM is one flex row holding just the amount, at the default `md` scale. No `Original` or `Period` node exists in the tree, since neither prop was passed.",
                        code: "<PricePoint.Base amount=\"$19\" />",
                        render: <PricePoint.Base amount="$19" showAnatomy />,
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf prop `original` — struck-through list price beside the amount. */
export const Original: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="PricePoint.Base"
                tier="atom"
                leaf="Prop `original`"
                reason="The struck price only earns its spot when there is a real discount — it lets the reader see the drop for themselves instead of trusting a badge that claims one."
                annotate={{ "Typography.Base": PART_TYPOGRAPHY }}
                states={[
                    {
                        name: "original unset",
                        why: "Only the `Amount` node renders — the same bare shape as `Default`. This is the baseline you compare the next state against.",
                        code: "<PricePoint.Base amount=\"$19\" />",
                        render: <PricePoint.Base amount="$19" showAnatomy />,
                    },
                    {
                        name: "original set",
                        why: "An `Original` node grows beside the amount, struck through and rendered at the size table's secondary size rather than a fixed tiny one. It stays legible next to a `lg` amount instead of shrinking to nothing, because it now rides the same per-size token table as the amount.",
                        code: "<PricePoint.Base amount=\"$19\" original=\"$29\" />",
                        render: <PricePoint.Base amount="$19" original="$29" showAnatomy />,
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf prop `period` — muted billing cadence after the amount. */
export const Period: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="PricePoint.Base"
                tier="atom"
                leaf="Prop `period`"
                reason="A recurring price needs the cadence right next to the number, or the reader has to hunt the page for a `/month` disclaimer somewhere else."
                annotate={{ "Typography.Base": PART_TYPOGRAPHY }}
                states={[
                    {
                        name: "period unset",
                        why: "Only the `Amount` node renders — the same bare shape as `Default`. This is the baseline you compare the next state against.",
                        code: "<PricePoint.Base amount=\"$19\" />",
                        render: <PricePoint.Base amount="$19" showAnatomy />,
                    },
                    {
                        name: "period set",
                        why: "A `Period` node grows right after the amount, at the size table's smallest, most muted size. It reads as a unit suffix rather than competing with the amount for attention, so the reader never mistakes the price for a one-time charge.",
                        code: "<PricePoint.Base amount=\"$19\" period=\"/month\" />",
                        render: <PricePoint.Base amount="$19" period="/month" showAnatomy />,
                    },
                ]}
            />
        </div>
    ),
}

/**
 * Leaf prop `size` — ĐỦ union `PricePointSize`, mỗi state kèm `original` + `period`
 * để thấy cả ba part cùng giãn theo `size`, không chỉ `amount`.
 */
export const Sizes: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="PricePoint.Base"
                tier="atom"
                leaf="Prop `size`"
                reason="Pick size from where the price sits, not from the number's own weight — a pricing page hero and a compact plan row both show plain dollar amounts. `size` drives all three parts off one shared token table, so the unit grows as one coherent piece instead of a big number next to leftover tiny text."
                annotate={{ "Typography.Base": PART_TYPOGRAPHY }}
                states={[
                    {
                        name: "size = \"sm\"",
                        why: "All three parts render at the smallest step on the table — the compact scale for a price sitting inside a denser row rather than standing alone.",
                        code: "<PricePoint.Base size=\"sm\" amount=\"$9\" original=\"$14\" period=\"/month\" />",
                        render: <PricePoint.Base size="sm" amount="$9" original="$14" period="/month" showAnatomy />,
                    },
                    {
                        name: "size = \"md\" (default)",
                        why: "All three parts render at the default scale — the same step the `Default` leaf's bare amount uses. This is the size for a price in an ordinary card or row.",
                        code: "<PricePoint.Base size=\"md\" amount=\"$19\" original=\"$29\" period=\"/month\" />",
                        render: <PricePoint.Base size="md" amount="$19" original="$29" period="/month" showAnatomy />,
                    },
                    {
                        name: "size = \"lg\"",
                        why: "All three parts render at the largest step — the original reads at `base` and the period at `sm` instead of staying pinned to `xs` like at `sm`/`md`. This is the scale for the price that anchors a pricing page.",
                        code: "<PricePoint.Base size=\"lg\" amount=\"$49\" original=\"$69\" period=\"/month\" />",
                        render: <PricePoint.Base size="lg" amount="$49" original="$69" period="/month" showAnatomy />,
                    },
                ]}
            />
        </div>
    ),
}

/**
 * Leaf prop `isSkeleton` — shimmer CO-LOCATED (§12c). Render đủ BỐN hình mà chính
 * prop này sinh ra: bar cao theo `size` (3 cỡ) + bar phụ mọc thêm khi `period` có mặt.
 *
 * Không truyền `amount` ở đây — union `PricePointProps` giờ để `amount` OPTIONAL khi
 * `isSkeleton: true` (§12c), và bar không đọc nó nên truyền vào cũng vô nghĩa.
 *
 * `original` KHÔNG ảnh hưởng hình skeleton — component chỉ xét `period`, nên không
 * có state riêng cho "có original" ở đây (không phải hình do `isSkeleton` sinh ra).
 */
export const Skeleton: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="PricePoint.Base"
                tier="atom"
                leaf="Prop `isSkeleton`"
                reason="Whoever owns the shape owns its resting state, so the price draws its own shimmer instead of a shared generic placeholder. `original` has no placeholder of its own — passing it during `isSkeleton` changes nothing, since the bar only ever reads `period`."
                annotate={{ Skeleton: PART_SKELETON }}
                states={[
                    {
                        name: "isSkeleton = true, size = \"sm\", period unset",
                        why: "A single shimmer bar renders at the `sm` height, mirroring where the amount would sit. No second bar exists, since no `period` was passed.",
                        code: "<PricePoint.Base isSkeleton size=\"sm\" />",
                        render: <PricePoint.Base isSkeleton size="sm" showAnatomy />,
                    },
                    {
                        name: "isSkeleton = true, size = \"md\", period unset",
                        why: "The same single bar renders taller, matching the `md` amount height. Only the bar's height changes between size states, not its count.",
                        code: "<PricePoint.Base isSkeleton size=\"md\" />",
                        render: <PricePoint.Base isSkeleton size="md" showAnatomy />,
                    },
                    {
                        name: "isSkeleton = true, size = \"lg\", period unset",
                        why: "The bar grows to its tallest height, matching the `lg` amount. This is the largest single-bar shape the shimmer ever takes.",
                        code: "<PricePoint.Base isSkeleton size=\"lg\" />",
                        render: <PricePoint.Base isSkeleton size="lg" showAnatomy />,
                    },
                    {
                        name: "isSkeleton = true, size = \"md\", period set",
                        why: "A second, shorter bar appears after the first, mirroring the `/month` slot at this size's period height. It exists so the row's footprint doesn't jump once the real period text lands.",
                        code: "<PricePoint.Base isSkeleton size=\"md\" period=\"/month\" />",
                        render: <PricePoint.Base isSkeleton size="md" period="/month" showAnatomy />,
                    },
                ]}
            />
        </div>
    ),
}
