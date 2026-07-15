import type { Meta, StoryObj } from "@storybook/nextjs"
import { AvatarUploadButton } from "./index"

const meta: Meta<typeof AvatarUploadButton> = {
    title: "Blocks/Identity/AvatarUploadButton",
    component: AvatarUploadButton,
}
export default meta
type Story = StoryObj<typeof AvatarUploadButton>

/** Dùng khi người dùng đã có ảnh đại diện đã lưu và cần nút để đổi ảnh mới. */
export const Default: Story = {
    parameters: { usage: "Dùng khi người dùng đã có ảnh đại diện đã lưu và cần nút để đổi ảnh mới." },
    render: () => (
        <AvatarUploadButton
            avatar="https://i.pravatar.cc/150?img=12"
            displayName="Nguyễn Văn An"
            seed="an.nguyen@example.com"
            label="Đổi ảnh đại diện"
            onPress={() => {}}
        />
    ),
}

/** Dùng khi người dùng chưa có ảnh đại diện: so sánh cạnh nhau lúc còn danh tính (tên + seed → chữ cái đầu) và lúc trống hoàn toàn (đều rơi về khuôn mặt mặc định). */
export const NoAvatar: Story = {
    parameters: { usage: "Dùng khi người dùng chưa có ảnh đại diện: so sánh cạnh nhau lúc còn danh tính (tên + seed cho ra chữ cái đầu) và lúc trống hoàn toàn — cả hai đều rơi về khuôn mặt mặc định." },
    render: () => (
        <div className="flex items-start gap-8">
            <div className="flex flex-col items-center gap-2">
                <AvatarUploadButton
                    avatar={null}
                    displayName="Trần Thị Bình"
                    seed="binh.tran@example.com"
                    label="Tải ảnh đại diện"
                    onPress={() => {}}
                />
                <span className="text-xs text-default-500">Có tên và seed</span>
            </div>
            <div className="flex flex-col items-center gap-2">
                <AvatarUploadButton
                    avatar={null}
                    displayName={null}
                    seed={null}
                    label="Thêm ảnh đại diện"
                    onPress={() => {}}
                />
                <span className="text-xs text-default-500">Danh tính trống</span>
            </div>
        </div>
    ),
}
