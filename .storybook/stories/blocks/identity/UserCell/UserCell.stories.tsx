import type { Meta, StoryObj } from "@storybook/nextjs"
import { Chip } from "@heroui/react"
import { UserCell } from "@/components/blocks/identity/UserCell"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof UserCell> = {
    title: "Blocks/Identity/UserCell",
    component: UserCell,
}
export default meta
type Story = StoryObj<typeof UserCell>

/**
 * Toàn bộ ma trận trạng thái của UserCell: hai size (sm/md), không có handle, có
 * ảnh đại diện thật, có nhãn phụ (trailing), và tên/handle dài trong khung hẹp.
 * Dùng để tra khi nào chọn size nào, khi nào bỏ handle, và cell xử lý tên dài ra
 * sao trước khi đặt vào một khu vực cụ thể (sidebar, dropdown, bảng thành viên...).
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="Nhỏ (sm)"
                hint="Dùng cho hầu hết nơi hiển thị người dùng trong danh sách dày đặc: size nhỏ kèm handle để phân biệt hai người trùng tên hiển thị — bình luận, bảng thành viên, kết quả tìm kiếm, dropdown."
            >
                <UserCell
                    username="levan.dev"
                    displayName="Ethan Vaughn"
                    avatar={null}
                    handle="@levan.dev"
                    size="sm"
                />
            </Variant>
            <Variant
                label="Vừa (md)"
                hint="Dùng khi người này là trọng tâm của cả khối và có đủ khoảng trống xung quanh: phần đầu trang hồ sơ, thẻ giới thiệu tác giả."
            >
                <UserCell
                    username="levan.dev"
                    displayName="Ethan Vaughn"
                    avatar={null}
                    handle="@levan.dev"
                    size="md"
                />
            </Variant>
            <Variant
                label="Không có handle"
                hint="Dùng khi người không có handle công khai để tra cứu — cell co lại chỉ còn một dòng tên. Bỏ handle khi đó là tài khoản hệ thống hoặc tác giả nội bộ; đừng bỏ chỉ để gọn vì sẽ mất cách phân biệt người trùng tên."
            >
                <UserCell
                    username="jamesanderson"
                    displayName="James Anderson"
                    avatar={null}
                />
            </Variant>
            <Variant
                label="Có ảnh đại diện thật"
                hint="Trạng thái người dùng đã tải ảnh thật lên, để đối chiếu với avatar tự sinh ở các state khác. Đây không phải lựa chọn của người dựng UI mà là do dữ liệu: có avatar thì hiện ảnh thật, trống thì rơi về ảnh sinh từ username — luôn truyền username dù đã có ảnh, để có phương án dự phòng khi URL hỏng."
            >
                <UserCell
                    username="sophiachen"
                    displayName="Sophia Chen"
                    avatar="https://i.pravatar.cc/150?img=47"
                    handle="@sophiachen"
                />
            </Variant>
            <Variant
                label="Có nhãn phụ (trailing)"
                hint="Dùng khi mỗi dòng cần thêm một thông tin phân loại chính người đó, không phải một hành động: vai trò, trạng thái lời mời. Đừng nhét nút bấm vào đây — cell không phải nơi đặt hành động."
            >
                <UserCell
                    username="emmafoster"
                    displayName="Emma Foster"
                    avatar={null}
                    handle="@emmafoster"
                    trailing={<Chip size="sm" variant="soft" color="warning">Admin</Chip>}
                />
            </Variant>
            <Variant
                label="Tên dài trong khung hẹp"
                hint="Kiểm tra cell trong cột hẹp: tên và handle dài phải bị cắt (truncate) chứ không được vỡ khung. Tên do người dùng tự đặt và không có giới hạn độ dài — nơi nào không cắt được thì không đặt cell ở đó."
            >
                <div className="w-48">
                    <UserCell
                        username="very.long.username.for.testing.truncation"
                        displayName="Alexandra Wellington-Fairchild With An Exceptionally Long Display Name For Testing Truncation"
                        avatar={null}
                        handle="@very.long.username.for.testing.truncation.overflow"
                    />
                </div>
            </Variant>
        </Gallery>
    ),
    parameters: {
        usage:
            "Toàn bộ ma trận trạng thái của UserCell: hai size (sm/md), không có handle, có ảnh " +
            "đại diện thật, có nhãn phụ (trailing), và tên/handle dài trong khung hẹp. Dùng để tra " +
            "khi nào chọn size nào, khi nào bỏ handle, và cell xử lý tên dài ra sao trước khi đặt " +
            "vào một khu vực cụ thể (sidebar, dropdown, bảng thành viên...). UserCell chỉ thuần " +
            "trình bày — muốn bấm được thì bọc thêm `<a>`/`<button>` ở nơi gọi; cần chỉ mặt (không " +
            "kèm tên) dùng `UserAvatar`, cần nhiều người trên một dòng dùng `AvatarGroup`, cần đổi " +
            "ảnh tại chỗ dùng `AvatarUploadButton`.",
    },
}
