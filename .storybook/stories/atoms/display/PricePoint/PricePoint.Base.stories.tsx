import type { Meta, StoryObj } from "@storybook/nextjs"
import { PricePoint, type PricePointSize } from "@sb-components/atoms/display/PricePoint/PricePoint"
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
 * cover heading sizes yet). `showAnatomy`/`anatPart` forward down into those calls, so
 * `Amount`/`Original`/`Period` là DEPS THẬT: cả ba đều dựng lại `Typography.Base`, và
 * atom đó CÓ story riêng (`Atoms/Text/Typography/Typography.Base`) nên cả ba đều khai
 * `storyId` để bấm nhảy sang được — đúng luật "deps phải bấm được" (thầy chốt
 * 2026-07-26). ⚠️ Bản trước ghi "Typography.Base has no story of its own yet" là SAI
 * sự thật; hệ quả là ba node bị BlockAnatomy lọc bỏ và tab Deps không mọc ra.
 *
 * `original`/`period` used to be locked to a fixed small size regardless of `size` —
 * now they ride the SAME per-size token table as `amount`, so `size="lg"` reads as one
 * coherent, larger unit instead of a big number next to leftover tiny text.
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

/** Chú giải phần Amount — composed từ `Typography.Base`, luôn có mặt khi render giá thật. */
const PART_AMOUNT: AnatomyAnnotation = {
    role: "The prominent number — a Typography.Base heading riding this atom's own per-size type scale.",
    tier: "atom",
    storyId: TYPOGRAPHY_STORY,
}
/** Chú giải phần Original — struck-through, chỉ có mặt khi `original` được truyền. */
const PART_ORIGINAL: AnatomyAnnotation = {
    role: "The struck-through original price — Typography.Base at the size table's muted, secondary size.",
    tier: "atom",
    storyId: TYPOGRAPHY_STORY,
}
/** Chú giải phần Period — chỉ có mặt khi `period` được truyền. */
const PART_PERIOD: AnatomyAnnotation = {
    role: "The billing cadence suffix — Typography.Base at the size table's smallest, most muted size.",
    tier: "atom",
    storyId: TYPOGRAPHY_STORY,
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
                note="No struck original, no period, size defaults to md (h3). The DOM is one flex row holding just the amount."
                annotate={{ Amount: PART_AMOUNT }}
                code={"<PricePoint.Base amount=\"$19\" />"}
            >
                <PricePoint.Base amount="$19" showAnatomy />
            </BlockAnatomy>
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
                note="original now rides the same per-size token table as the amount (secondary, not fixed-tiny), so it stays legible next to a lg amount instead of shrinking to nothing."
                annotate={{ Amount: PART_AMOUNT, Original: PART_ORIGINAL }}
                code={`<PricePoint.Base amount="$19" />
<PricePoint.Base amount="$19" original="$29" />`}
            >
                <div className="flex flex-wrap items-center gap-8">
                    <PricePoint.Base amount="$19" showAnatomy />
                    <PricePoint.Base amount="$19" original="$29" />
                </div>
            </BlockAnatomy>
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
                note="period rides the size table's smallest, most muted size — it reads as a unit suffix, never as competing with the amount for attention."
                annotate={{ Amount: PART_AMOUNT, Period: PART_PERIOD }}
                code={`<PricePoint.Base amount="$19" />
<PricePoint.Base amount="$19" period="/month" />`}
            >
                <div className="flex flex-wrap items-center gap-8">
                    <PricePoint.Base amount="$19" showAnatomy />
                    <PricePoint.Base amount="$19" period="/month" />
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/**
 * ĐỦ union `PricePointSize` — thiếu một giá trị là giá trị đó mọc thành leaf lạc chỗ.
 * Kèm `original` + `period` ở CẢ BA cỡ để leaf thấy rõ cả hai giãn theo `size`, không
 * chỉ amount (trước đây chúng khoá cứng sm/xs bất kể size).
 */
const SIZES: Array<{ size: PricePointSize; amount: string; original: string; hint: string }> = [
    { size: "sm", amount: "$9", original: "$14", hint: "a price inside a denser row" },
    { size: "md", amount: "$19", original: "$29", hint: "the default amount scale" },
    { size: "lg", amount: "$49", original: "$69", hint: "the price anchoring a pricing page" },
]

/** Leaf prop `size` — 3 CỠ, render ĐỦ union. */
export const Sizes: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="PricePoint.Base"
                tier="atom"
                leaf="Prop `size`"
                reason="Pick size from where the price sits, not from the number's own weight — a pricing page hero and a compact plan row both show plain dollar amounts."
                note="size now scales all THREE parts off one shared token table — at lg, original reads at base and period at sm instead of staying pinned to xs like at sm/md. The unit grows as one coherent piece, not a big number next to leftover tiny text."
                annotate={{ Amount: PART_AMOUNT, Original: PART_ORIGINAL, Period: PART_PERIOD }}
                code={`<PricePoint.Base size="sm" amount="$9" original="$14" period="/month" />
<PricePoint.Base size="md" amount="$19" original="$29" period="/month" />
<PricePoint.Base size="lg" amount="$49" original="$69" period="/month" />`}
            >
                <div className="flex flex-wrap items-end gap-8">
                    {SIZES.map(({ size, amount, original }, index) => (
                        <PricePoint.Base
                            key={size}
                            size={size}
                            amount={amount}
                            original={original}
                            period="/month"
                            showAnatomy={index === 0}
                        />
                    ))}
                </div>
            </BlockAnatomy>
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
 * có ô riêng cho "có original" ở đây (không phải hình do `isSkeleton` sinh ra).
 */
export const Skeleton: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="PricePoint.Base"
                tier="atom"
                leaf="Prop `isSkeleton`"
                reason="Whoever owns the shape owns its resting state, so the price draws its own shimmer instead of a shared generic placeholder."
                note="The amount bar's height follows size, same as the real amount. The second bar only shows up when period is set — it mirrors the /month slot at that size's periodBarH so the row doesn't jump once data lands. original has no placeholder of its own: passing it during isSkeleton changes nothing, and amount itself is optional here — the union only requires it once isSkeleton is false or omitted."
                annotate={{ Amount: PART_AMOUNT, Period: PART_PERIOD }}
                code={`<PricePoint.Base isSkeleton size="sm" />
<PricePoint.Base isSkeleton size="md" />
<PricePoint.Base isSkeleton size="lg" />
<PricePoint.Base isSkeleton size="md" period="/month" />`}
            >
                <div className="flex flex-wrap items-end gap-8">
                    <PricePoint.Base isSkeleton size="sm" showAnatomy />
                    <PricePoint.Base isSkeleton size="md" />
                    <PricePoint.Base isSkeleton size="lg" />
                    <PricePoint.Base isSkeleton size="md" period="/month" />
                </div>
            </BlockAnatomy>
        </div>
    ),
}
