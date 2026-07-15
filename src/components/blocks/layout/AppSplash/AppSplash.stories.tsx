import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { AppSplash } from "./index"

const meta: Meta<typeof AppSplash> = {
    title: "Block/Layout/AppSplash",
    component: AppSplash,
}
export default meta
type Story = StoryObj<typeof AppSplash>

/** Dùng cho lần nạp ĐẦU TIÊN (cold load / hard refresh), khi chưa có gì trên màn để mà chờ — che trọn màn bằng lockup StarCi. Điều hướng giữa các trang thì KHÔNG dùng cái này mà dùng TopLoader: lúc đó nội dung cũ vẫn đứng đó đọc được, che nó lại bằng splash là lấy đi thứ người dùng đang đọc. Hai block dùng chung một thanh accent, khác nhau ở chỗ có che màn hay không. */
export const Default: Story = {
    parameters: { usage: "Dùng cho lần nạp ĐẦU TIÊN (cold load / hard refresh), khi chưa có gì trên màn để mà chờ — che trọn màn bằng lockup StarCi. Điều hướng giữa các trang thì KHÔNG dùng cái này mà dùng TopLoader: lúc đó nội dung cũ vẫn đứng đó đọc được, che nó lại bằng splash là lấy đi thứ người dùng đang đọc. Hai block dùng chung một thanh accent, khác nhau ở chỗ có che màn hay không." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Màn chờ khởi động</Label>
                <Typography type="body-sm" color="muted">
                    block tự quản vòng đời: nó hiện tối thiểu 550ms rồi mờ dần 350ms và trả về null vĩnh viễn, nên trên canvas này nó chỉ chớp qua khoảng một giây đầu — tải lại khung xem trước để thấy lại. Không có prop nào giữ nó đứng yên.
                </Typography>
            </div>
            <AppSplash />
        </div>
    ),
}
