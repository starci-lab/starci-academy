import type { Meta, StoryObj } from "@storybook/nextjs"
import { StarIcon, UserPlusIcon } from "@phosphor-icons/react"
import { ActivityAvatar } from "./index"

const meta: Meta<typeof ActivityAvatar> = {
    title: "Blocks/Feed/ActivityAvatar",
    component: ActivityAvatar,
    parameters: { layout: "centered" },
}
export default meta
type Story = StoryObj<typeof ActivityAvatar>

/** Dùng cho mục feed hoạt động (ví dụ "đã theo dõi"), avatar người dùng kèm badge icon loại hoạt động ở góc dưới phải. */
export const Default: Story = {
    parameters: { usage: "Dùng cho mục feed hoạt động (ví dụ \"đã theo dõi\"), avatar người dùng kèm badge icon loại hoạt động ở góc dưới phải." },
    render: () => (
        <ActivityAvatar
            username="minhanh_dev"
            avatar="https://i.pravatar.cc/150?img=12"
            icon={<UserPlusIcon weight="fill" />}
        />
    ),
}

/** Khi người dùng chưa từng tải avatar lên, ảnh đại diện tự sinh theo seed username vẫn hiển thị ổn định kèm badge. */
export const KhongCoAvatarTaiLen: Story = {
    parameters: { usage: "Khi người dùng chưa từng tải avatar lên, ảnh đại diện tự sinh theo seed username vẫn hiển thị ổn định kèm badge." },
    render: () => (
        <ActivityAvatar
            username="tranvantuan"
            avatar={null}
            icon={<StarIcon weight="fill" />}
        />
    ),
}
