import type { Meta, StoryObj } from "@storybook/nextjs"
import { SeeMoreLink } from "@/components/blocks/navigation/SeeMoreLink"
import { Gallery, Variant, VariantRow } from "../../../../story-kit"

const meta: Meta<typeof SeeMoreLink> = {
    title: "Legacy/Blocks/Navigation/SeeMoreLink",
    component: SeeMoreLink,
}
export default meta
type Story = StoryObj<typeof SeeMoreLink>

/**
 * Every mode SeeMoreLink can render: a press handler when the feature owns
 * routing itself, an explicit href when the destination is a fixed URL, a
 * decorative span when the parent surface is already the one press target,
 * and the two sizes it can sit next to (a section label vs a small eyebrow).
 */
export const AllVariants: Story = {
    parameters: {
        usage: "Dùng SeeMoreLink cho hành vi \"Xem thêm →\" cuối một khối nội dung — LabeledCard truyền onPress khi feature tự điều hướng, ContinueCard dùng decorative khi cả card đã là target bấm duy nhất.",
    },
    render: () => (
        <Gallery>
            <Variant
                label="Bấm hành động (onPress)"
                hint="Dùng khi feature tự xử lý điều hướng bằng router — ví dụ nút Xem thêm cuối một danh sách bài học rút gọn trên trang chủ."
            >
                <SeeMoreLink onPress={() => {}}>Xem thêm</SeeMoreLink>
            </Variant>
            <Variant
                label="Điều hướng URL (href)"
                hint="Dùng khi đích đến là một URL cố định — href được ưu tiên hơn onPress nên chỉ cần truyền một trong hai."
            >
                <SeeMoreLink href="/courses">Xem tất cả khóa học</SeeMoreLink>
            </Variant>
            <Variant
                label="Decorative trong surface cha"
                hint="Dùng khi cả bề mặt cha (ví dụ ContinueCard) đã là target bấm duy nhất — SeeMoreLink chỉ render span tĩnh, hiệu ứng hover ăn theo class group của cha."
            >
                <div className="group w-fit cursor-pointer rounded-lg border border-default-200 p-3">
                    <SeeMoreLink decorative>Tiếp tục</SeeMoreLink>
                </div>
            </Variant>
            <VariantRow
                label="Size"
                hint="sm đứng cạnh nhãn lớn của một section (mặc định), xs đứng cạnh eyebrow nhỏ và tinh giản hơn."
            >
                <SeeMoreLink size="sm" onPress={() => {}}>
                    Xem thêm (sm)
                </SeeMoreLink>
                <SeeMoreLink size="xs" onPress={() => {}}>
                    Xem thêm (xs)
                </SeeMoreLink>
            </VariantRow>
        </Gallery>
    ),
}
