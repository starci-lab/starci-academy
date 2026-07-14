import type { Meta, StoryObj } from "@storybook/nextjs"
import { PriceTag } from "./index"

/**
 * PriceTag stories — content/state variants get their own story; pure style props
 * (size) are grouped into ONE gallery story (side-by-side = one Chromatic snapshot,
 * not N near-identical ones).
 */
const meta: Meta<typeof PriceTag> = {
    title: "Blocks/PriceTag",
    component: PriceTag,
    parameters: { layout: "centered" },
}

export default meta

type Story = StoryObj<typeof PriceTag>

/** Dùng khi khóa CHƯA có ưu đãi — chỉ hiện giá bán, không gạch giá gốc. */
export const Default: Story = {
    args: { discounted: 1990000 },
}

/** Dùng khi khóa đang giảm giá — giá gốc gạch ngang + chip −X% để tạo cảm giác "hời". */
export const WithDiscount: Story = {
    args: { discounted: 1490000, original: 1990000 },
}

/** Dùng khi muốn GIẢI THÍCH mức giảm đến từ đâu (hover/tap chip) — ví dụ tách early-bird + ưu đãi học viên cũ, minh bạch thay vì chỉ đưa % khô khan. */
export const Breakdown: Story = {
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

/** Chọn size theo bối cảnh đặt PriceTag: sm cho hàng list dày (bảng so sánh khóa), md cho card khóa mặc định, lg cho hero/trang checkout. */
export const Sizes: Story = {
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
}
