import type { Meta, StoryObj } from "@storybook/nextjs"
import { PricingPhase } from "@/modules/types/enums/pricing-phase"
import { PhaseScarcityNote } from "./index"

/**
 * PhaseScarcityNote stories — dòng khan hiếm TRUNG THỰC dưới PriceTag: mỗi biến thể
 * theo trạng thái dữ liệu backend (còn suất + giá sắp tăng vs chỉ còn suất) có story
 * riêng. Trạng thái không có seat cap (`seatsRemaining = null`) render rỗng nên bỏ qua.
 */
const meta: Meta<typeof PhaseScarcityNote> = {
    title: "Blocks/Commerce/PhaseScarcityNote",
    component: PhaseScarcityNote,
}

export default meta

type Story = StoryObj<typeof PhaseScarcityNote>

/** Dùng khi pha hiện tại còn suất VÀ có mức giá tăng ở pha sau — hiện đủ "Còn N suất giá {pha} · giá tăng lên X sau đó" để tạo urgency trung thực. */
export const Default: Story = {
    args: {
        currentPhase: PricingPhase.EarlyBird,
        seatsRemaining: 7,
        nextPhasePriceVnd: 1990000,
    },
    parameters: {
        usage: "Dùng khi pha hiện tại còn suất VÀ có mức giá tăng ở pha sau — hiện đủ \"Còn N suất giá {pha} · giá tăng lên X sau đó\" để tạo urgency trung thực.",
    },
}

/** Dùng khi backend chưa có giá pha kế tiếp (`nextPhasePriceVnd = null`) — chỉ hiện dòng còn suất, KHÔNG bịa mức tăng giá. */
export const WithoutPriceRise: Story = {
    args: {
        currentPhase: PricingPhase.Pioneer,
        seatsRemaining: 3,
        nextPhasePriceVnd: null,
    },
    parameters: {
        usage: "Dùng khi backend chưa có giá pha kế tiếp (nextPhasePriceVnd = null) — chỉ hiện dòng còn suất, KHÔNG bịa mức tăng giá.",
    },
}
