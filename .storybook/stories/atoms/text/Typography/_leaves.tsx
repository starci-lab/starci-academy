import type { ComponentType, ReactNode } from "react"
import type { StoryObj } from "@storybook/nextjs"
import { CheckCircleIcon, ArrowRightIcon } from "@phosphor-icons/react"
import type { TypographyProps } from "@sb-components/atoms/text/Typography/Typography"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * Shared story-leaf builder for the per-SIZE Typography components. NOT a `.stories`
 * file (leading `_`, no `.stories` suffix → not loaded by the glob).
 *
 * ⚠️ 2026-07-26: bỏ hẳn `parts`. `Typography.*` là ATOM LÁ cuối cùng của hệ chữ —
 * bọc thẳng HeroUI (`Typography.Heading`/`Link`/`Skeleton`), KHÔNG compose atom
 * nào khác có story riêng, nên KHÔNG có deps thật (canon §12, `BlockAnatomyProps`).
 * `data-anat-part` mà atom tự phát (`Text`/`PrefixIcon`/`SuffixIcon`) là KHE nội bộ,
 * không phải component có nhà để nhảy tới — không khai `annotate`. RIÊNG `Skeleton`
 * (leaf `Loading`) LÀ HeroUI's own `Skeleton` render thẳng nên khai `annotate:
 * { "Skeleton": { tier: "heroui" } }` — panel chỉ nhận node có `storyId` hoặc
 * `tier: "heroui"`, badge mà không khai là badge vô hình (`check-orphan-parts.mjs`).
 */

/** Rules (mirrors README) — shown at the top of each size's Overview. Chữ TIẾNG ANH vì hiện ra docs page. */
export const TYPOGRAPHY_RULES = `
## \`Typography.*\` — the text atom (custom, not the HeroUI \`Typography\`)

One member: \`Typography.Base\`. Content goes through the \`text={...}\` prop, never children.

**Color:** \`color="default|muted|accent|success|warning|danger"\` — default is the page foreground, the rest borrow the shared status colors.
**Weight:** \`weight="medium"|"bold"\` — medium reads as working emphasis, bold reads as a heading. \`isItalic\` for italics.
**\`isLink\`:** renders as a HeroUI \`Link\` — accent color with a hover underline. Don't pair it with weight or an icon.
**Icons (strict):** \`prefixIcon\`/\`suffixIcon\` take an icon COMPONENT, never JSX. The atom pins the glyph to the text size and picks the weight — stories never pass either. ⚠️ Any icon pushes the text to \`font-medium\` automatically. \`iconSlide\` slides an arrow on hover (prefix ← / suffix →) — arrows only, never a caret.
**Clipping:** \`truncate\` for one line, \`lineClamp={1|2|3}\` for a few, **\`tabularNums\`** to keep digits lined up in a column.
**\`isSkeleton\`:** the atom draws its own shimmer bar — it owns its resting state.
`

type SizeComponent = ComponentType<TypographyProps>

export const makeTypographyLeaves = (Comp: SizeComponent, label: string) => {
    const leaf = (
        leafName: string,
        code: string,
        node: ReactNode,
        extra?: string,
        annotate?: Record<string, AnatomyAnnotation>,
    ): StoryObj => ({
        render: () => (
            <div className="p-8">
                <BlockAnatomy name={label} tier="atom" leaf={leafName} note={extra} code={code} annotate={annotate}>
                    {node}
                </BlockAnatomy>
            </div>
        ),
    })

    return {
        /** Plain — chỉ chữ. */
        Plain: leaf("Plain", `<${label} text="Grade assignments with the premium model" />`, (
            <Comp text="Grade assignments with the premium model" showAnatomy />
        )),
        /** Colors — mọi tone semantic (§9a + §2), một row. */
        Colors: {
            render: () => (
                <div className="p-8">
                    <BlockAnatomy
                        name={label}
                        tier="atom"
                        leaf="Prop `color`"
                        note="Every semantic tone in one row — default stays the page foreground, the rest borrow the shared status colors."
                        code={`<${label} text="Primary text" />
<${label} text="Secondary text" color="muted" />
<${label} text="Highlight / mine" color="accent" />
<${label} text="Passed / done" color="success" />
<${label} text="Caution / running low" color="warning" />
<${label} text="Error / failed" color="danger" />`}
                    >
                        <div className="flex flex-col gap-2">
                            <Comp text="Primary text" showAnatomy />
                            <Comp text="Secondary text" color="muted" />
                            <Comp text="Highlight / mine" color="accent" />
                            <Comp text="Passed / done" color="success" />
                            <Comp text="Caution / running low" color="warning" />
                            <Comp text="Error / failed" color="danger" />
                        </div>
                    </BlockAnatomy>
                </div>
            ),
        } as StoryObj,
        /**
         * Weight — cả hai giá trị hợp lệ ở body scale (`semibold` chỉ dành cho heading,
         * đã dồn về `medium` ở body — xem JSDoc `Typography.tsx`). KHÔNG kèm icon.
         */
        Bold: {
            render: () => (
                <div className="p-8">
                    <BlockAnatomy
                        name={label}
                        tier="atom"
                        leaf="Prop `weight`"
                        note="medium reads as working emphasis, bold reads as a heading. Don't pair weight with an icon — an icon already forces medium."
                        code={`<${label} text="Emphasized text" weight="medium" />
<${label} text="Q4 revenue" weight="bold" />`}
                    >
                        <div className="flex flex-col gap-2">
                            <Comp text="Emphasized text" weight="medium" showAnatomy />
                            <Comp text="Q4 revenue" weight="bold" />
                        </div>
                    </BlockAnatomy>
                </div>
            ),
        } as StoryObj,
        /** Link — HeroUI Link (§1 accent). */
        Link: leaf("Link", `<${label} text="View details" isLink />`, (
            <Comp text="View details" isLink showAnatomy />
        ), "isLink renders as HeroUI Link — accent color with a hover underline.", {
            Link: { tier: "heroui", role: "renders the text as HeroUI's own `Link`, for the accent color + hover underline + a11y" },
        }),
        /** WithPrefixIcon — leading icon; text tự font-medium. */
        WithPrefixIcon: leaf("WithPrefixIcon", `<${label} text="Passed" prefixIcon={CheckCircleIcon} />`, (
            <Comp text="Passed" prefixIcon={CheckCircleIcon} showAnatomy />
        ), "An icon pushes the text to font-medium automatically, so the glyph sits flush with the weight."),
        /** WithBothIcons — prefix + suffix. */
        WithBothIcons: leaf("WithBothIcons", `<${label} text="View results" prefixIcon={CheckCircleIcon} suffixIcon={ArrowRightIcon} />`, (
            <Comp text="View results" prefixIcon={CheckCircleIcon} suffixIcon={ArrowRightIcon} showAnatomy />
        )),
        /** CtaArrow — suffix ARROW + `iconSlide` (hover trượt phải, §5b). */
        CtaArrow: leaf("CtaArrow", `<${label} text="See more" suffixIcon={ArrowRightIcon} iconSlide color="accent" />`, (
            <Comp text="See more" suffixIcon={ArrowRightIcon} iconSlide color="accent" showAnatomy />
        ), "iconSlide slides the arrow right on hover — arrows only, never a caret."),
        /** Truncate — 1 dòng ellipsis trong khung hẹp. */
        Truncate: leaf("Truncate", `<${label} text="…a very long string…" truncate />`, (
            <div className="max-w-[220px] rounded-2xl border border-default p-3">
                <Comp text="This string is long enough that it gets clipped with an ellipsis once it overflows the box" truncate showAnatomy />
            </div>
        ), "truncate clips to one line with an ellipsis — the parent needs a bounded width."),
        /** Numeric — `tabularNums` cho số thẳng cột (§3). */
        Numeric: leaf("Numeric", `<${label} text="1.284.000₫" tabularNums weight="bold" />`, (
            <Comp text="1.284.000₫" tabularNums weight="bold" showAnatomy />
        ), "tabularNums locks digit widths so prices and counts line up in a column."),
        /** Loading — atom tự vẽ text-bar skeleton. */
        Loading: leaf("Loading", `<${label} text="…" isSkeleton />`, (
            <Comp text="Grade assignments with the premium model" isSkeleton showAnatomy />
        ), "isSkeleton draws its own shimmer bar — the atom owns its resting state.", {
            "Skeleton": { tier: "heroui", role: "the shimmer bar itself, HeroUI's own `Skeleton`" },
        }),
    }
}
