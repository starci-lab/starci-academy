import type { Meta, StoryObj } from "@storybook/nextjs"
import { expect, screen, userEvent, waitFor, within } from "storybook/test"
import { PriceTag } from "./index"

/**
 * PriceTag stories — content/state variants get their own story; pure style props
 * (size) are grouped into ONE gallery story (side-by-side = one Chromatic snapshot,
 * not N near-identical ones).
 */
const meta: Meta<typeof PriceTag> = {
    title: "Blocks/PriceTag",
    component: PriceTag,
}

export default meta

type Story = StoryObj<typeof PriceTag>

/** Dùng khi khóa CHƯA có ưu đãi — chỉ hiện giá bán, không gạch giá gốc. */
export const Default: Story = {
    args: { discounted: 1990000 },
    parameters: { usage: "Dùng khi khóa CHƯA có ưu đãi — chỉ hiện giá bán, không gạch giá gốc." },
}

/** Dùng khi muốn GIẢI THÍCH mức giảm đến từ đâu (bấm/chạm chip −X% → Popover) — ví dụ tách early-bird + ưu đãi học viên cũ, minh bạch thay vì chỉ đưa % khô khan. */
export const Breakdown: Story = {
    parameters: { usage: "Dùng khi muốn GIẢI THÍCH mức giảm đến từ đâu (bấm/chạm chip −X% → Popover) — ví dụ tách early-bird + ưu đãi học viên cũ, minh bạch thay vì chỉ đưa % khô khan." },
    render: () => (
        <div className="flex flex-col items-start gap-8">
            <PriceTag
                discounted={1290000}
                original={1990000}
                breakdown={{ phase: 1590000, phaseLabel: "Early-bird", loyaltyPercent: 15, loyaltyNote: "đã sở hữu 2 khóa" }}
            />
            <PriceTag
                discounted={1690000}
                original={1990000}
                breakdown={{ phase: 1690000, loyaltyPercent: 0 }}
            />
        </div>
    ),
}

/**
 * Popover breakdown Ở TRẠNG THÁI MỞ — `play` bấm chip `−X%` để mở panel (đây là
 * `Popover` click/tap, KHÔNG phải hover-`Tooltip`). Dùng để soi/nhìn layout panel +
 * chụp Chromatic state mở mà không cần rê chuột.
 */
export const BreakdownOpen: Story = {
    parameters: { usage: "Popover chi tiết giá ở trạng thái MỞ (bấm chip −X% → Popover, không phải hover-Tooltip) — soi layout panel + snapshot Chromatic state mở." },
    render: () => (
        <PriceTag
            discounted={1290000}
            original={1990000}
            breakdown={{ phase: 1590000, phaseLabel: "Early-bird", loyaltyPercent: 15, loyaltyNote: "đã sở hữu 2 khóa" }}
        />
    ),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        // chip is the Popover trigger (aria-label = breakdown title); clicking opens it
        const trigger = await canvas.findByRole("button", { name: "Chi tiết giá" })
        await userEvent.click(trigger)
        // Popover.Content portals to document.body → assert via screen, not canvas
        await waitFor(() => expect(screen.getByText("Bạn trả")).toBeInTheDocument())
    },
}

/** Chọn size theo bối cảnh đặt PriceTag: sm cho hàng list dày (bảng so sánh khóa), md cho card khóa mặc định, lg cho hero/trang checkout. */
export const Sizes: Story = {
    parameters: { usage: "Chọn size theo bối cảnh đặt PriceTag: sm cho hàng list dày (bảng so sánh khóa), md cho card khóa mặc định, lg cho hero/trang checkout." },
    render: () => (
        <div className="flex flex-col items-start gap-4">
            <PriceTag discounted={1490000} original={1990000} size="sm" />
            <PriceTag discounted={1490000} original={1990000} size="md" />
            <PriceTag discounted={1490000} original={1990000} size="lg" />
        </div>
    ),
}

/** Dùng cho khách quốc tế / khóa niêm yết bằng USD — không tự quy đổi, chỉ đổi ký hiệu + định dạng tiền tệ. */
export const CurrencyUsd: Story = {
    args: { discounted: 79, original: 129, currency: "USD" },
    parameters: { usage: "Dùng cho khách quốc tế / khóa niêm yết bằng USD — không tự quy đổi, chỉ đổi ký hiệu + định dạng tiền tệ." },
}
