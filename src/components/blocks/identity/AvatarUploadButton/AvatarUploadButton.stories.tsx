import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { AvatarUploadButton } from "./index"

const meta: Meta<typeof AvatarUploadButton> = {
    title: "Blocks/Identity/AvatarUploadButton",
    component: AvatarUploadButton,
}
export default meta
type Story = StoryObj<typeof AvatarUploadButton>

/** Dùng khi chính cái avatar là nút để đổi ảnh — thay vì `UserAvatar` (chỉ hiển thị, không sửa được) hoặc `ImageDropzone` (khu kéo thả riêng, cho ảnh bất kỳ chứ không neo vào danh tính một người). Đặt ở form hồ sơ, nơi người dùng đang sửa chính mình. */
export const Default: Story = {
    parameters: { usage: "Dùng khi chính cái avatar là nút để đổi ảnh — thay vì `UserAvatar` (chỉ hiển thị, không sửa được) hoặc `ImageDropzone` (khu kéo thả riêng, cho ảnh bất kỳ chứ không neo vào danh tính một người). Đặt ở form hồ sơ, nơi người dùng đang sửa chính mình." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Đã có ảnh</Label>
                <Typography type="body-sm" color="muted">
                    Trạng thái khi hồ sơ đã lưu được ảnh: nhãn nói việc sẽ xảy ra khi bấm, nên viết là đổi
                    chứ không phải tải lên.
                </Typography>
            </div>
            <AvatarUploadButton
                avatar="https://i.pravatar.cc/150?img=12"
                displayName="Nguyễn Văn An"
                seed="an.nguyen@example.com"
                label="Đổi ảnh đại diện"
                onPress={() => {}}
            />
        </div>
    ),
}

/** Hai mức rơi về khi chưa có ảnh tải lên, tuỳ còn hay mất danh tính để sinh avatar. */
export const NoAvatar: Story = {
    parameters: { usage: "Hai mức rơi về khi chưa có ảnh tải lên, tuỳ còn hay mất danh tính để sinh avatar." },
    render: () => (
        <div className="flex max-w-2xl flex-col gap-6">
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Có tên và seed</Label>
                    <Typography type="body-sm" color="muted">
                        Mức rơi về thường gặp: chưa tải ảnh nhưng đã đăng ký nên còn tên và email để sinh
                        avatar ổn định. Luôn truyền seed cùng displayName, thiếu seed thì mỗi lần render ra
                        một mặt khác.
                    </Typography>
                </div>
                <AvatarUploadButton
                    avatar={null}
                    displayName="Trần Thị Bình"
                    seed="binh.tran@example.com"
                    label="Tải ảnh đại diện"
                    onPress={() => {}}
                />
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                    <Label>Danh tính trống</Label>
                    <Typography type="body-sm" color="muted">
                        Mức cuối: không ảnh, không tên, không seed thì rơi về khuôn mặt mặc định. Gặp khi hồ
                        sơ vừa tạo còn trống — nhãn nên là thêm, vì chưa từng có gì để đổi.
                    </Typography>
                </div>
                <AvatarUploadButton
                    avatar={null}
                    displayName={null}
                    seed={null}
                    label="Thêm ảnh đại diện"
                    onPress={() => {}}
                />
            </div>
        </div>
    ),
}
