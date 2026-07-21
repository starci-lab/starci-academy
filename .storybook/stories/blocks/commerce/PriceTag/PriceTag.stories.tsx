import type { Meta, StoryObj } from "@storybook/nextjs"
import { expect, screen, userEvent, waitFor, within } from "storybook/test"
import { PriceTag } from "./PriceTag"
import { blockShell } from "../../../block-anatomy"

const meta: Meta<typeof PriceTag> = {
    title: "Block/Commerce/PriceTag",
    component: PriceTag,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof PriceTag>

const ANATOMY = {
    primitives: [{ name: "StatusChip", role: 'nhãn tiết kiệm "−X%" (tone success), mở popover chi tiết' }],
    reason:
        "Một giá hiển thị cần gói NHIỀU tín hiệu vào một chỗ: số tiền phải trả (đậm), giá gốc gạch ngang, và mức tiết kiệm. Mức tiết kiệm dùng StatusChip (soft-success) làm nhãn kiêm nút mở popover phân rã giá (gốc → giai đoạn → thành viên → bạn trả). Gộp lại một block để logic chiết khấu không lệch giữa các chỗ hiển thị giá.",
}

/** No discount — shows the sale price only, no strikethrough or chip. */
export const Default: Story = {
    render: () => blockShell(<PriceTag discounted={1990000} />, ANATOMY),
}

/** On sale — struck list price + a `−X%` chip; click/tap the chip to open the breakdown. */
export const WithDiscount: Story = {
    render: () =>
        blockShell(
            <PriceTag
                discounted={1290000}
                original={1990000}
                breakdown={{ phase: 1590000, phaseLabel: "Early-bird", loyaltyPercent: 15, loyaltyNote: "sở hữu 2 khóa" }}
            />,
            ANATOMY,
        ),
}

/** Pick size by context: `sm` dense lists, `md` default card, `lg` hero/checkout. */
export const Sizes: Story = {
    render: () =>
        blockShell(
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
            </div>,
            ANATOMY,
        ),
}

/** International / USD-listed courses — only the symbol and format change, no conversion. */
export const CurrencyUsd: Story = {
    render: () =>
        blockShell(
            <PriceTag
                discounted={79}
                original={129}
                currency="USD"
                breakdown={{ phase: 99, phaseLabel: "Early-bird", loyaltyPercent: 20 }}
            />,
            ANATOMY,
        ),
}

/** The breakdown Popover shown OPEN — the `play` clicks the `−X%` chip (a button, not a hover tooltip). */
export const BreakdownOpen: Story = {
    render: () =>
        blockShell(
            <PriceTag
                discounted={1290000}
                original={1990000}
                breakdown={{ phase: 1590000, phaseLabel: "Early-bird", loyaltyPercent: 15, loyaltyNote: "sở hữu 2 khóa" }}
            />,
            ANATOMY,
        ),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await userEvent.click(canvas.getByRole("button", { name: "Chi tiết giá" }))
        await waitFor(() => expect(screen.getByRole("dialog")).toBeInTheDocument())
    },
}
