import type { Meta, StoryObj } from "@storybook/nextjs"
import { PhaseScarcityNote } from "@/components/blocks/commerce/PhaseScarcityNote"
import { PricingPhase } from "@/modules/types/enums/pricing-phase"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof PhaseScarcityNote> = {
    title: "Legacy/Blocks/Commerce/PhaseScarcityNote",
    component: PhaseScarcityNote,
}

export default meta

type Story = StoryObj<typeof PhaseScarcityNote>

/**
 * Toàn bộ trạng thái của dòng cảnh báo khan-hiếm-suất theo phase giá: rỗng (không
 * có seat cap → không render gì), còn nhiều suất, còn ít suất (số nhỏ để tạo cảm
 * giác cấp bách thật, không giả), có/không có giá phase kế tiếp, và đủ 3 phase giá.
 */
export const AllVariants: Story = {
    parameters: {
        usage: "Dựng cạnh nhau mọi trạng thái thật của PhaseScarcityNote để soi bố cục và câu chữ trước khi ghép vào paywall — không phải nơi kiểm tra logic render.",
    },
    render: () => (
        <Gallery>
            <Variant
                label="Không có seat cap (unlimited)"
                hint="seatsRemaining = null → phase này không có trigger khan hiếm thật, block render null, không có gì hiển thị."
            >
                <PhaseScarcityNote
                    currentPhase={PricingPhase.Regular}
                    seatsRemaining={null}
                    nextPhasePriceVnd={null}
                />
            </Variant>
            <Variant
                label="Pioneer · còn nhiều suất · có giá tăng sau đó"
                hint="Dùng khi phase Pioneer vừa mở, seat cap còn xa mới cạn, cần báo trước giá sẽ tăng lên Early Bird."
            >
                <PhaseScarcityNote
                    currentPhase={PricingPhase.Pioneer}
                    seatsRemaining={42}
                    nextPhasePriceVnd={2490000}
                />
            </Variant>
            <Variant
                label="Early Bird · còn ít suất · sắp tăng giá"
                hint="Số suất nhỏ (1 chữ số) để tạo cấp bách thật — số này lấy thẳng từ coursePricePreview, không phải số bịa."
            >
                <PhaseScarcityNote
                    currentPhase={PricingPhase.EarlyBird}
                    seatsRemaining={3}
                    nextPhasePriceVnd={2990000}
                />
            </Variant>
            <Variant
                label="Regular · còn suất · không có phase kế tiếp"
                hint="nextPhasePriceVnd = null → phase Regular là phase cuối, không có giá nào để cảnh báo tăng, chỉ báo số suất còn lại."
            >
                <PhaseScarcityNote
                    currentPhase={PricingPhase.Regular}
                    seatsRemaining={15}
                    nextPhasePriceVnd={null}
                />
            </Variant>
            <Variant
                label="Chỉ còn 1 suất cuối"
                hint="Trường hợp biên: seatsRemaining = 1, câu chữ số ít (count) phải tự nhiên ở cả vi và en."
            >
                <PhaseScarcityNote
                    currentPhase={PricingPhase.EarlyBird}
                    seatsRemaining={1}
                    nextPhasePriceVnd={2990000}
                />
            </Variant>
        </Gallery>
    ),
}
