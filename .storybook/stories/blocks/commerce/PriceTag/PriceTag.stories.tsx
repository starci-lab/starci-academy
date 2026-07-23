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

// No saving: only the bold amount — no strikethrough, chip, popover, or saving line.
const NO_DISCOUNT_PARTS: Array<AnatomyNode> = [
    {
        name: "Typography",
        tier: "primitive",
        role: "số tiền phải trả (đậm) — không giảm nên chỉ một số, không gạch ngang / chip / dòng tiết kiệm",
    },
]

// The −X% chip → popover subtree, shared by every on-sale leaf. DOM nesting:
// Popover WRAPS Popover.Trigger (the react-aria button — role=button,
// aria-expanded/controls) which WRAPS the StatusChip; Popover.Content holds the
// breakdown rows. The chip is NOT the button — the Trigger is; the chip is just its
// soft-success label. So StatusChip nests under Popover.Trigger under Popover, NOT
// as a sibling of Popover.
const PRICE_POPOVER_PART: AnatomyNode = {
    name: "Popover",
    tier: "primitive",
    role: "popover phân rã giá — bọc nút mở (Trigger) + nội dung (Content)",
    children: [
        {
            name: "Popover.Trigger",
            tier: "primitive",
            role: "nút mở popover (react-aria: role=button, aria-expanded/controls) — đúng MỘT phần tử tương tác, bọc chip −X%",
            children: [
                {
                    name: "StatusChip",
                    tier: "primitive",
                    role: 'nhãn tiết kiệm "−X%" (soft-success) — chỉ là nhãn, không tự là nút',
                    state: "success",
                },
            ],
        },
        {
            name: "Popover.Content",
            tier: "primitive",
            role: "phân rã giá: gốc → giai đoạn → thành viên → bạn trả (mỗi dòng là Typography)",
        },
    ],
}

// On sale: amount + struck list price + −X% chip (→ popover) + saving line.
const DISCOUNT_PARTS: Array<AnatomyNode> = [
    { name: "Typography · giá phải trả", tier: "primitive", role: "số tiền phải trả (đậm)" },
    { name: "Typography · giá gốc", tier: "primitive", role: "giá gốc gạch ngang" },
    PRICE_POPOVER_PART,
    { name: "Typography · tiết kiệm", tier: "primitive", role: 'dòng "Tiết kiệm N₫"' },
]

// On sale with showSavingLine={false}: same chrome but the "Tiết kiệm N₫" line is dropped.
const NO_SAVING_LINE_PARTS: Array<AnatomyNode> = [
    { name: "Typography · giá phải trả", tier: "primitive", role: "số tiền phải trả (đậm)" },
    { name: "Typography · giá gốc", tier: "primitive", role: "giá gốc gạch ngang" },
    PRICE_POPOVER_PART,
]

/** No discount — shows the sale price only, no strikethrough or chip. */
export const Default: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="PriceTag"
                tier="design"
                leaf="Không giảm giá"
                parts={NO_DISCOUNT_PARTS}
                reason="Một giá hiển thị cần gói NHIỀU tín hiệu vào một chỗ: số tiền phải trả (đậm), giá gốc gạch ngang, và mức tiết kiệm. Mức tiết kiệm dùng StatusChip (soft-success) làm nhãn kiêm nút mở popover phân rã giá (gốc → giai đoạn → thành viên → bạn trả). Gộp lại một block để logic chiết khấu không lệch giữa các chỗ hiển thị giá."
            >
                <PriceTag discounted={1990000} />
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
                leaf="Đang giảm giá"
                parts={DISCOUNT_PARTS}
                note="Có giảm → thêm giá gốc gạch ngang, chip −X% (mở popover), và dòng 'Tiết kiệm N₫'."
            >
                <PriceTag
                    discounted={1290000}
                    original={1990000}
                    breakdown={{ phase: 1590000, phaseLabel: "Early-bird", loyaltyPercent: 15, loyaltyNote: "sở hữu 2 khóa" }}
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
                leaf="Ba cỡ"
                parts={DISCOUNT_PARTS}
                note="Đổi cỡ chỉ đổi type-scale số tiền — CÙNG composition với leaf 'Đang giảm giá'."
            >
                <div className="flex flex-col items-start gap-6">
                    <PriceTag
                        discounted={1490000}
                        original={1990000}
                        size="sm"
                        breakdown={{ phase: 1690000, phaseLabel: "Early-bird", loyaltyPercent: 12 }}
                    />
                    <PriceTag
                        discounted={1490000}
                        original={1990000}
                        size="md"
                        breakdown={{ phase: 1690000, phaseLabel: "Early-bird", loyaltyPercent: 12 }}
                    />
                    <PriceTag
                        discounted={1490000}
                        original={1990000}
                        size="lg"
                        breakdown={{ phase: 1690000, phaseLabel: "Early-bird", loyaltyPercent: 12 }}
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
                leaf="Tiền USD"
                parts={DISCOUNT_PARTS}
                note="Chỉ đổi ký hiệu & định dạng tiền — CÙNG composition với leaf 'Đang giảm giá'."
            >
                <PriceTag
                    discounted={79}
                    original={129}
                    currency="USD"
                    breakdown={{ phase: 99, phaseLabel: "Early-bird", loyaltyPercent: 20 }}
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
                leaf="Ẩn dòng tiết kiệm"
                parts={NO_SAVING_LINE_PARTS}
                note="showSavingLine={false} → BỎ dòng 'Tiết kiệm N₫'; chip −X% + popover vẫn còn (khác leaf 'Đang giảm giá')."
            >
                <PriceTag
                    discounted={1290000}
                    original={1990000}
                    showSavingLine={false}
                    breakdown={{ phase: 1590000, phaseLabel: "Early-bird", loyaltyPercent: 15, loyaltyNote: "sở hữu 2 khóa" }}
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
                leaf="Giảm, không breakdown"
                parts={DISCOUNT_PARTS}
                note="Không truyền breakdown → popover chỉ có 'giá gốc → bạn trả'; composition vẫn như leaf 'Đang giảm giá'."
            >
                <PriceTag discounted={1290000} original={1990000} />
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
                leaf="Popover mở"
                parts={DISCOUNT_PARTS}
                note="Bấm chip −X% → Popover mở, hiện phân rã giá; composition như leaf 'Đang giảm giá'."
            >
                <PriceTag
                    discounted={1290000}
                    original={1990000}
                    breakdown={{ phase: 1590000, phaseLabel: "Early-bird", loyaltyPercent: 15, loyaltyNote: "sở hữu 2 khóa" }}
                />
            </BlockAnatomy>,
        ),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await userEvent.click(canvas.getByRole("button", { name: "Chi tiết giá" }))
        await waitFor(() => expect(screen.getByRole("dialog")).toBeInTheDocument())
    },
}
