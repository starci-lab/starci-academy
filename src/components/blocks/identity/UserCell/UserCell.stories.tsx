import type { Meta, StoryObj } from "@storybook/nextjs"
import { UserCell } from "./index"

const meta: Meta<typeof UserCell> = {
    title: "Blocks/UserCell",
    component: UserCell,
    args: {
        username: "levan.dev",
        displayName: "Le Van",
        avatar: null,
        handle: "@levan.dev",
        size: "sm",
    },
}

export default meta

type Story = StoryObj<typeof UserCell>

/** Dùng mặc định để hiển thị 1 user trong list/comment/bảng — avatar + tên + handle. */
export const Default: Story = {
    parameters: {
        usage: "Dùng mặc định để hiển thị 1 user trong list/comment/bảng — avatar + tên + handle.",
    },
}

/** Chọn size theo mật độ: sm cho list dày (comment, bảng), md cho khu vực rộng hơn (profile header, card). */
export const Sizes: Story = {
    render: (args) => (
        <div className="flex flex-col gap-4">
            <UserCell {...args} size="sm" />
            <UserCell {...args} size="md" />
        </div>
    ),
    parameters: {
        usage: "Chọn size theo mật độ: sm cho list dày (comment, bảng), md cho khu vực rộng hơn (profile header, card).",
    },
}

/** Dùng khi user chưa đặt tên hiển thị — cell tự rơi về username làm nhãn chính, không để trống. */
export const NoDisplayName: Story = {
    args: {
        username: "tranthib92",
        displayName: undefined,
        handle: "@tranthib92",
    },
    parameters: {
        usage: "Dùng khi user chưa đặt tên hiển thị — cell tự rơi về username làm nhãn chính, không để trống.",
    },
}

/** Dùng ở nơi không cần/không có handle (VD nội bộ, hệ thống) — chỉ còn 1 dòng tên. */
export const NoHandle: Story = {
    args: {
        username: "nguyenvana",
        displayName: "Nguyen Van A",
        handle: undefined,
    },
    parameters: {
        usage: "Dùng ở nơi không cần/không có handle (VD nội bộ, hệ thống) — chỉ còn 1 dòng tên.",
    },
}

/** Dùng khi user đã tải ảnh đại diện thật — ưu tiên ảnh upload thay vì avatar sinh tự động. */
export const WithUploadedAvatar: Story = {
    args: {
        username: "phamthic",
        displayName: "Pham Thi C",
        avatar: "https://i.pravatar.cc/150?img=47",
        handle: "@phamthic",
    },
    parameters: {
        usage: "Dùng khi user đã tải ảnh đại diện thật — ưu tiên ảnh upload thay vì avatar sinh tự động.",
    },
}

/** Gắn nhãn phụ bên phải (vai trò, badge, trạng thái) — VD đánh dấu Admin trong bảng thành viên. */
export const WithTrailing: Story = {
    args: {
        username: "dothif",
        displayName: "Do Thi F",
        handle: "@dothif",
        trailing: (
            <span className="text-xs font-medium text-warning">Admin</span>
        ),
    },
    parameters: {
        usage: "Gắn nhãn phụ bên phải (vai trò, badge, trạng thái) — VD đánh dấu Admin trong bảng thành viên.",
    },
}

/** Đặt trong khung hẹp (sidebar, dropdown) để kiểm tra tên/handle dài bị cắt gọn thay vì vỡ layout. */
export const LongNameTruncation: Story = {
    args: {
        username: "very.long.username.for.testing.truncation",
        displayName: "Nguyen Thi Truncation Test With A Very Long Display Name",
        handle: "@very.long.username.for.testing.truncation.overflow",
    },
    decorators: [
        (Story) => (
            <div className="w-48">
                <Story />
            </div>
        ),
    ],
    parameters: {
        usage: "Đặt trong khung hẹp (sidebar, dropdown) để kiểm tra tên/handle dài bị cắt gọn thay vì vỡ layout.",
    },
}
