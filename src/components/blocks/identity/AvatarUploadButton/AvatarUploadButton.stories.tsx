import type { Meta, StoryObj } from "@storybook/nextjs"
import { AvatarUploadButton } from "./index"

const meta: Meta<typeof AvatarUploadButton> = {
    title: "Blocks/AvatarUploadButton",
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

/** Dùng khi người dùng chưa từng tải ảnh lên, hiển thị avatar mặc định sinh từ seed cùng chữ cái đầu tên. */
export const NoAvatar: Story = {
    parameters: { usage: "Dùng khi người dùng chưa từng tải ảnh lên, hiển thị avatar mặc định sinh từ seed cùng chữ cái đầu tên." },
    render: () => (
        <AvatarUploadButton
            avatar={null}
            displayName="Trần Thị Bình"
            seed="binh.tran@example.com"
            label="Tải ảnh đại diện"
            onPress={() => {}}
        />
    ),
}

/** Dùng khi hồ sơ chưa có tên hiển thị lẫn seed, vẫn phải render được trạng thái tối giản nhất. */
export const MinimalIdentity: Story = {
    parameters: { usage: "Dùng khi hồ sơ chưa có tên hiển thị lẫn seed, vẫn phải render được trạng thái tối giản nhất." },
    render: () => (
        <AvatarUploadButton
            avatar={null}
            displayName={null}
            seed={null}
            label="Thêm ảnh đại diện"
            onPress={() => {}}
        />
    ),
}

/** Dùng khi cần đặt nút trong một vùng cụ thể của layout và phải tuỳ biến thêm khoảng cách qua className. */
export const WithCustomClassName: Story = {
    parameters: { usage: "Dùng khi cần đặt nút trong một vùng cụ thể của layout và phải tuỳ biến thêm khoảng cách qua className." },
    render: () => (
        <AvatarUploadButton
            avatar="https://i.pravatar.cc/150?img=47"
            displayName="Lê Minh Châu"
            seed="chau.le@example.com"
            label="Đổi ảnh đại diện"
            onPress={() => {}}
            className="ring-2 ring-primary ring-offset-2"
        />
    ),
}
