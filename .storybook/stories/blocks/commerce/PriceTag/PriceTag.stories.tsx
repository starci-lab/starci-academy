import type { Meta, StoryObj } from "@storybook/nextjs"
import { expect, screen, userEvent, waitFor, within } from "storybook/test"
import { PriceTag } from "./PriceTag"
import { BlockAnatomy, type AnatomyNode } from "../../layout/BlockAnatomy/BlockAnatomy"

/**
 * DESIGN — a single course/product price: the amount to pay (bold), the struck
 * list price, a `−X%` success chip, and a breakdown popover.
 *
 * ANATOMY IS PER-LEAF: each story below is its OWN leaf and wraps its render in
 * its OWN BlockAnatomy (Sơ đồ + Cây) reflecting the parts THAT leaf composes —
 * there is no separate consolidated "Anatomy" story. The composition shifts with
 * the shape: no-discount shows only the amount; on-sale adds the struck price,
 * chip, popover, and saving line; `showSavingLine={false}` drops that last line.
 */
const meta: Meta<typeof PriceTag> = {
    title: "Design/Commerce/PriceTag",
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
const AMOUNT: AnatomyNode = { name: "Typography", tier: "primitive", role: "số tiền phải trả (đậm) — không có giảm giá" }
const NO_DISCOUNT_PARTS: Array<AnatomyNode> = [AMOUNT]

// The −X% chip → popover subtree, shared by every on-sale leaf. NOTE: the "Popover"
// wrapper itself is CUT from the tree — HeroUI's `PopoverRoot` is just a context
// provider around react-aria's `DialogTrigger`, which renders NO DOM element of its
// own (state-only, clones its children), so there is nothing to tag with
// `data-anat-part="Popover"`. Only its two DOM-bearing children remain, as SIBLINGS:
// `Popover.Trigger` (the actual clickable div — role=button, aria-expanded/controls —
// wrapping the StatusChip; the chip is NOT the button, just its soft-success label)
// and `Popover.Content` (the breakdown rows).
const PRICE_POPOVER_PARTS: Array<AnatomyNode> = [
    {
        name: "Popover.Trigger",
        tier: "primitive",
        role: "nút mở popover (react-aria: role=button, aria-expanded/controls) — đúng MỘT phần tử tương tác, bọc chip −X%",
        children: [
            {
                name: "StatusChip",
                tier: "primitive",
                role: "nhãn tiết kiệm \"−X%\" (soft-success) — chỉ là nhãn, không tự là nút",
                state: "success",
            },
        ],
    },
    {
        name: "Popover.Content",
        tier: "primitive",
        role: "phân rã giá: gốc → giai đoạn → thành viên → bạn trả (mỗi dòng là Typography)",
    },
]

// On sale: amount (renamed "· giá phải trả" once there's a saving to distinguish
// it from the struck original) + struck list price + −X% chip → popover + a
// saving line — PriceTag directly renders every one of these Typography itself.
const AMOUNT_WITH_SAVING: AnatomyNode = { name: "Typography.Amount", tier: "primitive", role: "số tiền phải trả (đậm)" }
const ORIGINAL: AnatomyNode = { name: "Typography.Original", tier: "primitive", role: "giá gốc gạch ngang (muted, line-through)" }
const SAVING_LINE: AnatomyNode = { name: "Typography.Saving", tier: "primitive", role: "dòng \"Tiết kiệm N₫\" cụ thể (muted)" }

const DISCOUNT_PARTS: Array<AnatomyNode> = [AMOUNT_WITH_SAVING, ORIGINAL, ...PRICE_POPOVER_PARTS, SAVING_LINE]

// On sale with showSavingLine={false}: same composed chrome minus the saving line node.
const NO_SAVING_LINE_PARTS: Array<AnatomyNode> = [AMOUNT_WITH_SAVING, ORIGINAL, ...PRICE_POPOVER_PARTS]

/** No discount — shows the sale price only, no strikethrough or chip. */
export const Default: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="PriceTag"
                tier="design"
                leaf="Default"
                parts={NO_DISCOUNT_PARTS}
                reason="Một giá hiển thị cần gói NHIỀU tín hiệu vào một chỗ: số tiền phải trả (đậm), giá gốc gạch ngang, và mức tiết kiệm. Mức tiết kiệm dùng StatusChip (soft-success) làm nhãn kiêm nút mở popover phân rã giá (gốc → giai đoạn → thành viên → bạn trả). Gộp lại một block để logic chiết khấu không lệch giữa các chỗ hiển thị giá."
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
                note="Có giảm → thêm giá gốc gạch ngang, chip −X% (mở popover), và dòng 'Tiết kiệm N₫'."
            >
                <PriceTag
                    discounted={1290000}
                    original={1990000}
                    breakdown={{ phase: 1590000, phaseLabel: "Early-bird", loyaltyPercent: 15, loyaltyNote: "sở hữu 2 khóa" }}
                    showAnatomy
                />
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
                note="Đổi cỡ chỉ đổi type-scale số tiền — CÙNG composition với leaf 'Đang giảm giá'."
            >
                <div className="flex flex-col items-start gap-6">
                    <PriceTag
                        discounted={1490000}
                        original={1990000}
                        size="sm"
                        breakdown={{ phase: 1690000, phaseLabel: "Early-bird", loyaltyPercent: 12 }}
                        showAnatomy
                    />
                    <PriceTag
                        discounted={1490000}
                        original={1990000}
                        size="md"
                        breakdown={{ phase: 1690000, phaseLabel: "Early-bird", loyaltyPercent: 12 }}
                        showAnatomy
                    />
                    <PriceTag
                        discounted={1490000}
                        original={1990000}
                        size="lg"
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
                note="Chỉ đổi ký hiệu & định dạng tiền — CÙNG composition với leaf 'Đang giảm giá'."
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
                note="showSavingLine={false} → BỎ dòng 'Tiết kiệm N₫'; chip −X% + popover vẫn còn (khác leaf 'Đang giảm giá')."
            >
                <PriceTag
                    discounted={1290000}
                    original={1990000}
                    showSavingLine={false}
                    breakdown={{ phase: 1590000, phaseLabel: "Early-bird", loyaltyPercent: 15, loyaltyNote: "sở hữu 2 khóa" }}
                    showAnatomy
                />
            </BlockAnatomy>,
        ),
}

/** Discount WITHOUT a `breakdown` — the chip still opens a popover, but it shows only "giá gốc → bạn trả" (no phase/loyalty rows). */
export const DiscountWithoutBreakdown: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="PriceTag"
                tier="design"
                leaf="DiscountWithoutBreakdown"
                parts={DISCOUNT_PARTS}
                note="Không truyền breakdown → popover chỉ có 'giá gốc → bạn trả'; composition vẫn như leaf 'Đang giảm giá'."
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
                note="Bấm chip −X% → Popover mở, hiện phân rã giá; composition như leaf 'Đang giảm giá'."
            >
                <PriceTag
                    discounted={1290000}
                    original={1990000}
                    breakdown={{ phase: 1590000, phaseLabel: "Early-bird", loyaltyPercent: 15, loyaltyNote: "sở hữu 2 khóa" }}
                    showAnatomy
                />
            </BlockAnatomy>,
        ),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await userEvent.click(canvas.getByRole("button", { name: "PriceDetail" }))
        await waitFor(() => expect(screen.getByRole("dialog")).toBeInTheDocument())
    },
}
