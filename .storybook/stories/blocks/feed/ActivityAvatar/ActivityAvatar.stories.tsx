import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    BookOpenIcon,
    ChatCircleIcon,
    FlagIcon,
    GraduationCapIcon,
    SparkleIcon,
    UserPlusIcon,
} from "@phosphor-icons/react"
import { ActivityAvatar } from "@/components/blocks/feed/ActivityAvatar"
import { Gallery, Variant, VariantRow } from "../../../../story-kit"

const meta: Meta<typeof ActivityAvatar> = {
    title: "Blocks/Feed/ActivityAvatar",
    component: ActivityAvatar,
}
export default meta
type Story = StoryObj<typeof ActivityAvatar>

/**
 * Every state this block can be in: an uploaded photo, the generated fallback
 * when no photo was ever uploaded, and the row of activity-type badges the
 * feed swaps in per event kind. Pure/props-only, so there's no interactive
 * specimen to split out.
 */
export const AllVariants: Story = {
    parameters: {
        usage: "Dùng khi cần vẽ avatar của một hoạt động trong feed kèm badge nhỏ báo loại hoạt động ở góc dưới-phải, ví dụ hàng follow/hoàn thành milestone/bình luận trong ActivityFeed. Tránh dùng cho avatar đơn thuần không cần badge — trường hợp đó dùng thẳng UserAvatar.",
    },
    render: () => (
        <Gallery>
            <Variant
                label="Đã có ảnh đại diện"
                hint="Người dùng đã upload ảnh: avatar là URL thật, badge báo họ vừa được người khác theo dõi."
            >
                <ActivityAvatar
                    username="minhanh_dev"
                    avatar="https://i.pravatar.cc/150?img=12"
                    icon={<UserPlusIcon aria-hidden focusable="false" weight="bold" />}
                />
            </Variant>
            <Variant
                label="Chưa có ảnh — rơi về avatar sinh sẵn"
                hint="Bỏ trống avatar (null/undefined) khi người dùng chưa từng upload ảnh: UserAvatar tự sinh ảnh mặc định theo seed là username, không để trống khung."
            >
                <ActivityAvatar
                    username="quochuy_backend"
                    avatar={null}
                    icon={<GraduationCapIcon aria-hidden focusable="false" weight="bold" />}
                />
            </Variant>
            <VariantRow
                label="Các loại icon hoạt động"
                hint="Icon badge đổi theo loại hoạt động trong feed — mỗi loại một icon phosphor, cùng một khung avatar bên dưới."
            >
                <ActivityAvatar
                    username="thuha_ux"
                    avatar="https://i.pravatar.cc/150?img=45"
                    icon={<BookOpenIcon aria-hidden focusable="false" weight="bold" />}
                />
                <ActivityAvatar
                    username="quochuy_backend"
                    avatar="https://i.pravatar.cc/150?img=33"
                    icon={<FlagIcon aria-hidden focusable="false" weight="bold" />}
                />
                <ActivityAvatar
                    username="lananh_pham"
                    avatar={null}
                    icon={<SparkleIcon aria-hidden focusable="false" weight="bold" />}
                />
                <ActivityAvatar
                    username="minhanh_dev"
                    avatar="https://i.pravatar.cc/150?img=12"
                    icon={<ChatCircleIcon aria-hidden focusable="false" weight="bold" />}
                />
            </VariantRow>
        </Gallery>
    ),
}
