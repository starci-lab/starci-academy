import type { Meta, StoryObj } from "@storybook/nextjs"
import { Chip, Label, Typography } from "@heroui/react"
import { UserCell } from "./index"

const meta: Meta<typeof UserCell> = {
    title: "Blocks/Identity/UserCell",
    component: UserCell,
    args: {
        username: "levan.dev",
        displayName: "Lê Văn",
        avatar: null,
        handle: "@levan.dev",
        size: "sm",
    },
}

export default meta

type Story = StoryObj<typeof UserCell>

/** Dùng khi cần trả lời "đây là ai" — avatar kèm tên và handle — thay vì `UserAvatar` (chỉ cần khuôn mặt, không cần tên) hoặc `AvatarGroup` (nhiều người gộp một dòng). Ảnh đổi được tại chỗ thì dùng `AvatarUploadButton`. `UserCell` thuần trình bày: muốn bấm được thì bọc `<a>`/`<button>` ở call-site. */
export const Default: Story = {
    parameters: { usage: "Dùng khi cần trả lời \"đây là ai\" — avatar kèm tên và handle — thay vì `UserAvatar` (chỉ cần khuôn mặt, không cần tên) hoặc `AvatarGroup` (nhiều người gộp một dòng). Ảnh đổi được tại chỗ thì dùng `AvatarUploadButton`. `UserCell` thuần trình bày: muốn bấm được thì bọc `<a>`/`<button>` ở call-site." },
    render: (args) => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Mặc định</Label>
                <Typography type="body-sm" color="muted">
                    Dùng cho phần lớn chỗ hiển thị người dùng trong danh sách dày: size sm kèm handle để
                    phân biệt hai người trùng tên hiển thị.
                </Typography>
            </div>
            <UserCell {...args} />
        </div>
    ),
}

/** Chọn size theo mật độ khu vực đặt cell, không theo độ quan trọng của người đó. */
export const Sizes: Story = {
    parameters: { usage: "Chọn size theo mật độ khu vực đặt cell, không theo độ quan trọng của người đó." },
    render: (args) => (
        <div className="flex max-w-2xl flex-col gap-6">
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Nhỏ (sm)</Label>
                    <Typography type="body-sm" color="muted">
                        Dùng khi mỗi dòng là một người và các dòng xếp sát nhau: bình luận, bảng thành viên,
                        kết quả tìm kiếm, dropdown.
                    </Typography>
                </div>
                <UserCell {...args} size="sm" />
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Vừa (md)</Label>
                    <Typography type="body-sm" color="muted">
                        Dùng khi người đó là nhân vật chính của cả khối và xung quanh còn chỗ thở: đầu trang
                        hồ sơ, card giới thiệu tác giả.
                    </Typography>
                </div>
                <UserCell {...args} size="md" />
            </div>
        </div>
    ),
}

/** Dùng ở nơi người dùng không có handle công khai để tra cứu — cell rút còn một dòng tên. */
export const NoHandle: Story = {
    args: {
        username: "nguyenvana",
        displayName: "Nguyễn Văn A",
        handle: undefined,
    },
    parameters: { usage: "Dùng ở nơi người dùng không có handle công khai để tra cứu — cell rút còn một dòng tên." },
    render: (args) => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Không có handle</Label>
                <Typography type="body-sm" color="muted">
                    Bỏ handle khi người đó không có định danh công khai để gõ tìm: tài khoản hệ thống, người
                    tạo nội bộ. Đừng bỏ chỉ để cho gọn — mất handle là mất cách phân biệt người trùng tên.
                </Typography>
            </div>
            <UserCell {...args} />
        </div>
    ),
}

/** Trạng thái khi người dùng đã tải ảnh thật, để đối chiếu với avatar sinh tự động ở các story khác. */
export const WithUploadedAvatar: Story = {
    args: {
        username: "phamthic",
        displayName: "Phạm Thị C",
        avatar: "https://i.pravatar.cc/150?img=47",
        handle: "@phamthic",
    },
    parameters: { usage: "Trạng thái khi người dùng đã tải ảnh thật, để đối chiếu với avatar sinh tự động ở các story khác." },
    render: (args) => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Có ảnh tải lên</Label>
                <Typography type="body-sm" color="muted">
                    Không phải lựa chọn của người dựng giao diện mà là dữ liệu: có avatar thì ảnh thật hiện
                    lên, avatar rỗng thì rơi về ảnh sinh từ username. Luôn truyền username kể cả khi đã có
                    ảnh, để còn chỗ rơi về khi URL hỏng.
                </Typography>
            </div>
            <UserCell {...args} />
        </div>
    ),
}

/** Dùng khi mỗi dòng cần thêm một thông tin phân loại chính người đó, không phải hành động. */
export const WithTrailing: Story = {
    args: {
        username: "dothif",
        displayName: "Đỗ Thị F",
        handle: "@dothif",
        trailing: <Chip size="sm" variant="soft" color="warning">Quản trị</Chip>,
    },
    parameters: { usage: "Dùng khi mỗi dòng cần thêm một thông tin phân loại chính người đó, không phải hành động." },
    render: (args) => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Có nhãn phụ</Label>
                <Typography type="body-sm" color="muted">
                    Đặt vào trailing thứ mô tả người đó là ai trong ngữ cảnh này: vai trò, trạng thái lời
                    mời. Nút bấm thì đừng nhét vào đây — cell không phải là chỗ chứa hành động.
                </Typography>
            </div>
            <UserCell {...args} />
        </div>
    ),
}

/** Kiểm cell trong cột hẹp: tên và handle dài phải cắt gọn thay vì đẩy vỡ khung. */
export const LongNameTruncation: Story = {
    args: {
        username: "very.long.username.for.testing.truncation",
        displayName: "Nguyễn Thị Tên Hiển Thị Rất Dài Dùng Để Kiểm Tra Cắt Chữ",
        handle: "@very.long.username.for.testing.truncation.overflow",
    },
    parameters: { usage: "Kiểm cell trong cột hẹp: tên và handle dài phải cắt gọn thay vì đẩy vỡ khung." },
    render: (args) => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Chữ dài trong khung hẹp</Label>
                <Typography type="body-sm" color="muted">
                    Tra story này trước khi đặt cell vào cột hẹp: sidebar, dropdown, rail. Tên do người dùng
                    tự đặt nên không có trần độ dài — chỗ nào không cắt được thì đừng đặt cell vào.
                </Typography>
            </div>
            <div className="w-48">
                <UserCell {...args} />
            </div>
        </div>
    ),
}
