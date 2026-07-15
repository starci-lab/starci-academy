import type { Meta, StoryObj } from "@storybook/nextjs"
import { AvatarGroup } from "./index"

const meta: Meta<typeof AvatarGroup> = {
    title: "Blocks/Identity/AvatarGroup",
    component: AvatarGroup,
}
export default meta
type Story = StoryObj<typeof AvatarGroup>

/** Dùng khi cần hiển thị nhanh những ai đang theo dõi hoặc tham gia một mục, với vài avatar xếp chồng lên nhau. */
export const Default: Story = {
    parameters: { usage: "Dùng khi cần hiển thị nhanh những ai đang theo dõi hoặc tham gia một mục, với vài avatar xếp chồng lên nhau." },
    render: () => (
        <AvatarGroup
            users={[
                { username: "minh.tran", displayName: "Minh Trần", avatar: "https://i.pravatar.cc/150?img=1" },
                { username: "lan.pham", displayName: "Lan Phạm", avatar: "https://i.pravatar.cc/150?img=2" },
                { username: "hoang.le", displayName: "Hoàng Lê", avatar: null },
            ]}
        />
    ),
}

/** Dùng khi số người vượt quá giới hạn hiển thị, để gọn gàng nhóm avatar thành vài cái đầu kèm chip "+N" thay vì kéo dài vô hạn. */
export const OverflowChip: Story = {
    parameters: { usage: "Dùng khi số người vượt quá giới hạn hiển thị, để gọn gàng nhóm avatar thành vài cái đầu kèm chip \"+N\" thay vì kéo dài vô hạn." },
    render: () => (
        <AvatarGroup
            max={3}
            users={[
                { username: "minh.tran", displayName: "Minh Trần", avatar: "https://i.pravatar.cc/150?img=1" },
                { username: "lan.pham", displayName: "Lan Phạm", avatar: "https://i.pravatar.cc/150?img=2" },
                { username: "hoang.le", displayName: "Hoàng Lê", avatar: null },
                { username: "an.nguyen", displayName: "An Nguyễn", avatar: null },
                { username: "thu.vo", displayName: "Thu Võ", avatar: null },
                { username: "khoa.dinh", displayName: "Khoa Đinh", avatar: null },
            ]}
        />
    ),
}

/** Dùng khi danh sách rỗng (chưa ai tham gia), để nhóm avatar không render gì thay vì báo lỗi hay hiện khung trống. */
export const Empty: Story = {
    parameters: { usage: "Dùng khi danh sách rỗng (chưa ai tham gia), để nhóm avatar không render gì thay vì báo lỗi hay hiện khung trống." },
    render: () => <AvatarGroup users={[]} />,
}
