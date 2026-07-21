import type { Meta, StoryObj } from "@storybook/nextjs"
import { AvatarUploadButton } from "@/components/blocks/identity/AvatarUploadButton"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof AvatarUploadButton> = {
    title: "Legacy/Blocks/Identity/AvatarUploadButton",
    component: AvatarUploadButton,
}
export default meta
type Story = StoryObj<typeof AvatarUploadButton>

/**
 * Toàn bộ trạng thái của AvatarUploadButton: đã có ảnh, chưa có ảnh nhưng còn
 * danh tính để sinh avatar, và trống hoàn toàn danh tính. Dùng để tra khi nào
 * đổi nhãn nút giữa "Change"/"Upload"/"Add" theo đúng trạng thái ảnh hiện có.
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="Đã có ảnh"
                hint="Trạng thái khi profile đã có ảnh lưu sẵn: nhãn đặt theo hành động khi nhấn, nên viết là change, không phải upload."
            >
                <AvatarUploadButton
                    avatar="https://i.pravatar.cc/150?img=12"
                    displayName="Ethan Carter"
                    seed="ethan.carter@example.com"
                    label="Change profile photo"
                    onPress={() => {}}
                />
            </Variant>
            <Variant
                label="Chưa có ảnh, còn tên và seed"
                hint="Fallback phổ biến nhất: chưa upload ảnh nào, nhưng user đã đăng ký nên còn tên và email để sinh avatar ổn định. Luôn truyền seed kèm displayName — thiếu seed thì mỗi lần render ra một mặt khác nhau."
            >
                <AvatarUploadButton
                    avatar={null}
                    displayName="Olivia Bennett"
                    seed="olivia.bennett@example.com"
                    label="Upload profile photo"
                    onPress={() => {}}
                />
            </Variant>
            <Variant
                label="Trống hoàn toàn danh tính"
                hint="Fallback cuối cùng: không ảnh, không tên, không seed thì rơi về mặt mặc định. Xảy ra với profile vừa tạo còn trống — nhãn nên là add, vì chưa từng có gì để đổi."
            >
                <AvatarUploadButton
                    avatar={null}
                    displayName={null}
                    seed={null}
                    label="Add profile photo"
                    onPress={() => {}}
                />
            </Variant>
        </Gallery>
    ),
    parameters: {
        usage:
            "Toàn bộ trạng thái của AvatarUploadButton: đã có ảnh, chưa có ảnh nhưng còn danh tính để sinh " +
            "avatar, và trống hoàn toàn danh tính. Dùng khi avatar chính là nút đổi ảnh — khác với " +
            "`UserAvatar` (chỉ hiển thị, không sửa được) hoặc `ImageDropzone` (vùng thả ảnh riêng, không " +
            "gắn với danh tính một người) — đặt trong form hồ sơ, nơi user tự sửa ảnh của mình.",
    },
}
