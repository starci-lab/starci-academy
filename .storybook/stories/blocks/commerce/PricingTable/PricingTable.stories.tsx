import type { Meta, StoryObj } from "@storybook/nextjs"
import { PricingTable } from "@/components/blocks/commerce/PricingTable"
import { Gallery, Variant } from "../../../../story-kit"
import { threeTiers } from "./components"

const meta: Meta<typeof PricingTable> = {
    title: "Features/Commerce/PricingTable",
    component: PricingTable,
}
export default meta
type Story = StoryObj<typeof PricingTable>

/**
 * Toàn bộ ma trận trạng thái của PricingTable: ba plan với plan giữa nổi bật
 * (ribbon "phổ biến" + khung nhấn), và hai plan không plan nào nổi bật (hai cột
 * giãn đều, nút hành động thẳng hàng ở dưới). Dùng để tra khi nào bật
 * isHighlighted và layout xử lý ra sao khi thiếu plan nổi bật.
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="Ba plan, plan giữa nổi bật"
                hint="Dùng trên trang giá hoặc bước nâng cấp khi so sánh 2-3 plan cạnh nhau. Mỗi plan giữ sẵn giá đã format dưới dạng string; giữ nhãn feature giống nhau giữa các plan để chúng thẳng hàng. Bật isHighlighted cho plan giữa để có ribbon phổ biến và khung nhấn."
            >
                <PricingTable tiers={threeTiers} onSelectTier={() => {}} />
            </Variant>
            <Variant
                label="Hai plan, không nổi bật"
                hint="Dùng khi chỉ có hai plan và không muốn nhấn plan nào — hai cột vẫn giãn đều, nút hành động thẳng hàng ở dưới. Không có isHighlighted thì không cột nào có ribbon."
            >
                <PricingTable
                    tiers={threeTiers.slice(0, 2).map((tier) => ({ ...tier, isHighlighted: false }))}
                    onSelectTier={() => {}}
                />
            </Variant>
        </Gallery>
    ),
    parameters: {
        usage:
            "Toàn bộ ma trận trạng thái của PricingTable: ba plan với plan giữa nổi bật (ribbon " +
            "\"phổ biến\" + khung nhấn), và hai plan không plan nào nổi bật (hai cột giãn đều, nút " +
            "hành động thẳng hàng ở dưới). Dùng khi cần so sánh 2-3 plan cạnh nhau trên trang giá hoặc " +
            "bước nâng cấp, và xác nhận layout vẫn đúng khi không có plan nổi bật.",
    },
}
