import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button } from "@heroui/react"
import { StickyBottomBar } from "@/components/blocks/layout/StickyBottomBar"
import { PriceTag } from "@/components/blocks/commerce/PriceTag"
import { Gallery, Variant } from "../../../../story-kit"
import { IN_BOX, Screen } from "./components"

const meta: Meta<typeof StickyBottomBar> = {
    title: "Layout/StickyBottomBar",
    component: StickyBottomBar,
}
export default meta
type Story = StoryObj<typeof StickyBottomBar>

/**
 * Toàn bộ cách bố trí nội dung bên trong StickyBottomBar: giá kèm hành động chính,
 * chỉ một hành động full-width, và hành động chính kèm đường từ chối. Block chỉ lo
 * phần khung (nền, viền trên, safe-area padding) — nội dung bên trong do nơi gọi
 * quyết định. Cuộn phần nội dung phía trên để thấy thanh vẫn neo dưới đáy.
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="Giá kèm hành động chính"
                hint="Bố cục thanh đăng ký của một khoá học trả phí: giá bên trái, nút bên phải. Cuộn nội dung phía trên — thanh vẫn neo ở đáy."
            >
                <Screen
                    bar={(
                        <StickyBottomBar className={IN_BOX}>
                            <div className="flex items-center justify-between gap-3">
                                <PriceTag discounted={599000} original={899000} size="sm" />
                                <Button variant="primary" onPress={() => {}}>Enroll now</Button>
                            </div>
                        </StickyBottomBar>
                    )}
                />
            </Variant>
            <Variant
                label="Một hành động, full width"
                hint="Không còn gì để cân nhắc trước khi bấm — khoá học miễn phí, không có giá để đọc, nên nút chiếm hết chiều rộng thay vì bỏ trống nửa thanh."
            >
                <Screen
                    bar={(
                        <StickyBottomBar className={IN_BOX}>
                            <Button variant="primary" className="w-full" onPress={() => {}}>Start learning for free</Button>
                        </StickyBottomBar>
                    )}
                />
            </Variant>
            <Variant
                label="Hành động chính kèm đường từ chối"
                hint="Dùng khi thanh là một QUYẾT ĐỊNH chặn luồng — người dùng phải trả lời ngay tại đây trước khi đi tiếp (đồng ý cookie), nên đường từ chối phải đứng cạnh đường chấp nhận thay vì giấu ở nơi khác. Với thanh mời bình thường, giữ đúng một CTA chính như biến thể đầu tiên."
            >
                <Screen
                    bar={(
                        <StickyBottomBar className={IN_BOX}>
                            <div className="flex items-center gap-3">
                                <Button variant="secondary" className="flex-1" onPress={() => {}}>Decline</Button>
                                <Button variant="primary" className="flex-1" onPress={() => {}}>Accept all</Button>
                            </div>
                        </StickyBottomBar>
                    )}
                />
            </Variant>
        </Gallery>
    ),
    parameters: {
        usage:
            "Toàn bộ cách bố trí nội dung bên trong StickyBottomBar: giá kèm hành động chính, chỉ một hành " +
            "động full-width, và hành động chính kèm đường từ chối. Block chỉ lo phần khung (nền, viền trên, " +
            "safe-area padding) — nội dung bên trong do nơi gọi quyết định. Dùng để tra khi nào nên full-width, " +
            "khi nào cần thêm đường từ chối cạnh CTA chính.",
    },
}
