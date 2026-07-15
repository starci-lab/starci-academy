import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { AvatarGroup } from "./index"

const meta: Meta<typeof AvatarGroup> = {
    title: "Blocks/Identity/AvatarGroup",
    component: AvatarGroup,
}
export default meta
type Story = StoryObj<typeof AvatarGroup>

const users = [
    { username: "minh.tran", displayName: "Minh Trần", avatar: "https://i.pravatar.cc/150?img=1" },
    { username: "lan.pham", displayName: "Lan Phạm", avatar: "https://i.pravatar.cc/150?img=2" },
    { username: "hoang.le", displayName: "Hoàng Lê", avatar: null },
    { username: "an.nguyen", displayName: "An Nguyễn", avatar: null },
    { username: "thu.vo", displayName: "Thu Võ", avatar: null },
    { username: "khoa.dinh", displayName: "Khoa Đinh", avatar: null },
]

/** Dùng khi câu trả lời cần đưa ra là "bao nhiêu người / đại khái những ai" — thay vì `UserCell` (một người, cần đọc rõ tên và handle) hay `UserAvatar` (đúng một khuôn mặt). Nhóm avatar chồng nhau đọc ra là số đông, không phải danh sách tra cứu được: cần bấm vào từng người thì đó là list `UserCell`, không phải block này. */
export const Default: Story = {
    parameters: { usage: "Dùng khi câu trả lời cần đưa ra là \"bao nhiêu người / đại khái những ai\" — thay vì `UserCell` (một người, cần đọc rõ tên và handle) hay `UserAvatar` (đúng một khuôn mặt). Nhóm avatar chồng nhau đọc ra là số đông, không phải danh sách tra cứu được: cần bấm vào từng người thì đó là list `UserCell`, không phải block này." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Mặc định</Label>
                <Typography type="body-sm" color="muted">
                    Không đặt max khi danh sách vốn đã ngắn và không thể phình: người tham gia một buổi, tác
                    giả của một bài. Ai không có ảnh thì rơi về avatar sinh từ username.
                </Typography>
            </div>
            <AvatarGroup users={users.slice(0, 3)} />
        </div>
    ),
}

/** Đặt `max` khi số người có thể lớn tuỳ dữ liệu, để nhóm không kéo dài vô hạn ngoài khung. */
export const OverflowChip: Story = {
    parameters: { usage: "Đặt `max` khi số người có thể lớn tuỳ dữ liệu, để nhóm không kéo dài vô hạn ngoài khung." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Vượt giới hạn</Label>
                <Typography type="body-sm" color="muted">
                    Đặt max cho mọi chỗ số người đến từ dữ liệu người dùng và không có trần: người theo dõi,
                    người đã học. Chip cộng N gánh phần còn lại, nên khung giữ nguyên chiều rộng dù danh sách
                    dài bao nhiêu.
                </Typography>
            </div>
            <AvatarGroup max={3} users={users} />
        </div>
    ),
}

/** Trạng thái danh sách rỗng — block không render gì thay vì để lại khung trống. */
export const Empty: Story = {
    parameters: { usage: "Trạng thái danh sách rỗng — block không render gì thay vì để lại khung trống." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Rỗng</Label>
                <Typography type="body-sm" color="muted">
                    Chưa ai tham gia thì block tự biến mất, không chừa khoảng trống. Nghĩa là chỗ nào cần nói
                    rõ "chưa có ai" thì phải tự dựng empty-state ở ngoài, đừng trông vào block này.
                </Typography>
            </div>
            <AvatarGroup users={[]} />
        </div>
    ),
}
