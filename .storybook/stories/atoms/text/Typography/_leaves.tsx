import type { ComponentType, ReactNode } from "react"
import type { StoryObj } from "@storybook/nextjs"
import { CircleCheck, ArrowRight } from "@gravity-ui/icons"
import type { TypographyProps } from "@sb-components/atoms/text/Typography/Typography"
import { BlockAnatomy, type AnatomyNode } from "@sb-components/blocks/layout/BlockAnatomy/BlockAnatomy"

/**
 * Shared story-leaf builder for the per-SIZE Typography components. NOT a `.stories`
 * file (leading `_`, no `.stories` suffix → not loaded by the glob).
 */

/** Rules (mirrors README) — shown at the top of each size's Overview. */
export const TYPOGRAPHY_RULES = `
## \`Typography.*\` — atom chữ (custom, KHÔNG phải HeroUI Typography)

Tách theo CỠ: \`Typography.Xs\` · \`.Sm\` · \`.Base\` · \`.Lg\` (mở rộng dễ). Content qua PROP \`text={...}\`.

**Màu:** \`color="default|muted|accent|success|warning|danger"\` (default=foreground §9a; semantic=§2).
**Weight §9b:** \`weight="medium"|"bold"\` · \`isItalic\`.
**\`isLink\`:** HeroUI \`Link\` (accent + hover underline) — KHÔNG kèm weight/icon.
**Icon (strict):** \`prefixIcon\`/\`suffixIcon\` = COMPONENT; atom ép size=font-size; gravity (không \`weight\`). ⚠️ **có icon → text TỰ \`font-medium\`**. \`iconSlide\` = ARROW trượt khi hover (§5b, không caret).
**Cắt chữ:** \`truncate\` (1 dòng) · \`lineClamp={1|2|3}\` · **\`tabularNums\`** cho số (§3 thẳng cột).
**\`isLoading\`:** atom tự vẽ text-bar skeleton (hybrid C).
`

type SizeComponent = ComponentType<TypographyProps>

const TEXT_PARTS: Array<AnatomyNode> = [{ name: "Text", tier: "atom", role: "nội dung chữ (prop `text`)" }]
const PREFIX_PARTS: Array<AnatomyNode> = [
    { name: "PrefixIcon", tier: "atom", role: "leading glyph — COMPONENT, atom ép size=font-size" },
    { name: "Text", tier: "atom", role: "nội dung chữ (icon → tự font-medium)" },
]
const BOTH_PARTS: Array<AnatomyNode> = [
    { name: "PrefixIcon", tier: "atom", role: "leading glyph (component)" },
    { name: "Text", tier: "atom", role: "nội dung chữ" },
    { name: "SuffixIcon", tier: "atom", role: "trailing glyph (component)" },
]
const SUFFIX_PARTS: Array<AnatomyNode> = [
    { name: "Text", tier: "atom", role: "nội dung chữ" },
    { name: "SuffixIcon", tier: "atom", role: "trailing arrow — `iconSlide` trượt khi hover (§5b)" },
]
const SKELETON_PARTS: Array<AnatomyNode> = [
    { name: "Skeleton", tier: "atom", role: "leaf skeleton do atom tự sở hữu (text bar)" },
]

export const makeTypographyLeaves = (Comp: SizeComponent, label: string) => {
    const leaf = (leafName: string, parts: Array<AnatomyNode>, code: string, node: ReactNode, extra?: string): StoryObj => ({
        render: () => (
            <div className="p-8">
                <BlockAnatomy name={label} tier="atom" leaf={leafName} parts={parts} note={extra} code={code}>
                    {node}
                </BlockAnatomy>
            </div>
        ),
    })

    return {
        /** Plain — chỉ chữ. */
        Plain: leaf("Plain", TEXT_PARTS, `<${label} text="Chấm bài với model premium" />`, (
            <Comp text="Chấm bài với model premium" showAnatomy />
        )),
        /** Colors — mọi tone semantic (§9a + §2). */
        Colors: {
            render: () => (
                <div className="flex flex-col gap-2 p-8">
                    <Comp text="default — chữ chính (foreground)" />
                    <Comp text="muted — chữ phụ" color="muted" />
                    <Comp text="accent — nhấn / của tôi" color="accent" />
                    <Comp text="success — đạt / xong" color="success" />
                    <Comp text="warning — cảnh báo / sắp hết" color="warning" />
                    <Comp text="danger — lỗi / trượt" color="danger" />
                </div>
            ),
        } as StoryObj,
        /** Bold — heading (§9b), KHÔNG kèm icon. */
        Bold: leaf("Bold", TEXT_PARTS, `<${label} text="Doanh thu quý 4" weight="bold" />`, (
            <Comp text="Doanh thu quý 4" weight="bold" showAnatomy />
        ), "weight=bold = heading. Weight KHÔNG kèm icon."),
        /** Link — HeroUI Link (§1 accent). */
        Link: leaf("Link", TEXT_PARTS, `<${label} text="Xem chi tiết" isLink />`, (
            <Comp text="Xem chi tiết" isLink showAnatomy />
        ), "isLink = HeroUI Link (accent + hover underline)."),
        /** WithPrefixIcon — leading icon; text tự font-medium. */
        WithPrefixIcon: leaf("WithPrefixIcon", PREFIX_PARTS, `<${label} text="Đã đạt" prefixIcon={CircleCheck} />`, (
            <Comp text="Đã đạt" prefixIcon={CircleCheck} showAnatomy />
        ), "có icon → text tự font-medium (icon gravity fit medium text)."),
        /** WithBothIcons — prefix + suffix. */
        WithBothIcons: leaf("WithBothIcons", BOTH_PARTS, `<${label} text="Xem kết quả" prefixIcon={CircleCheck} suffixIcon={ArrowRight} />`, (
            <Comp text="Xem kết quả" prefixIcon={CircleCheck} suffixIcon={ArrowRight} showAnatomy />
        )),
        /** CtaArrow — suffix ARROW + `iconSlide` (hover trượt phải, §5b). */
        CtaArrow: leaf("CtaArrow", SUFFIX_PARTS, `<${label} text="Xem thêm" suffixIcon={ArrowRight} iconSlide color="accent" />`, (
            <Comp text="Xem thêm" suffixIcon={ArrowRight} iconSlide color="accent" showAnatomy />
        ), "iconSlide: hover thì arrow trượt phải (§5b, CHỈ arrow không caret)."),
        /** Truncate — 1 dòng ellipsis trong khung hẹp. */
        Truncate: leaf("Truncate", TEXT_PARTS, `<${label} text="…chuỗi dài…" truncate />`, (
            <div className="max-w-[220px] rounded-2xl border border-default p-3">
                <Comp text="Chuỗi rất dài này sẽ bị cắt bằng ellipsis khi vượt khung" truncate showAnatomy />
            </div>
        ), "truncate = 1 dòng + ellipsis (cần parent giới hạn width)."),
        /** Numeric — `tabularNums` cho số thẳng cột (§3). */
        Numeric: leaf("Numeric", TEXT_PARTS, `<${label} text="1.284.000₫" tabularNums weight="bold" />`, (
            <Comp text="1.284.000₫" tabularNums weight="bold" showAnatomy />
        ), "tabularNums = chữ số đều bề rộng (giá/đếm thẳng cột)."),
        /** Loading — atom tự vẽ text-bar skeleton. */
        Loading: leaf("Loading", SKELETON_PARTS, `<${label} text="…" isLoading />`, (
            <Comp text="Chấm bài với model premium" isLoading showAnatomy />
        ), "isLoading → text-bar shimmer OWNED bởi atom (hybrid C)."),
    }
}
