import type { Meta, StoryObj } from "@storybook/nextjs"
import { AppSplash } from "@/components/blocks/layout/AppSplash"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof AppSplash> = {
    title: "Layout/AppSplash",
    component: AppSplash,
}
export default meta
type Story = StoryObj<typeof AppSplash>

/**
 * Trạng thái duy nhất của AppSplash: dùng cho lần LOAD ĐẦU (cold load / hard
 * refresh) khi chưa có gì trên màn hình để chờ — phủ toàn màn hình bằng logo
 * StarCi. Khi chuyển trang giữa các route thì KHÔNG dùng cái này, dùng
 * TopLoader thay thế: nội dung cũ vẫn còn đọc được, phủ splash lên là che
 * mất thứ người dùng đang đọc. Cả hai block dùng chung thanh accent, chỉ
 * khác ở việc có phủ toàn màn hình hay không.
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="Splash khởi động"
                hint="Block tự quản lý lifecycle: hiện tối thiểu 550ms rồi fade out trong 350ms và trả về null vĩnh viễn, nên trên canvas này nó chỉ lướt qua trong giây đầu tiên — reload preview để xem lại. Không có prop nào giữ nó ở lại trên màn hình."
            >
                <AppSplash />
            </Variant>
        </Gallery>
    ),
    parameters: {
        usage:
            "Dùng cho lần LOAD ĐẦU (cold load / hard refresh) khi chưa có gì trên màn hình để chờ — phủ toàn " +
            "màn hình bằng logo StarCi. Khi chuyển trang giữa các route thì KHÔNG dùng cái này, dùng TopLoader " +
            "thay thế: nội dung cũ vẫn còn đọc được, phủ splash lên là che mất thứ người dùng đang đọc. Cả hai " +
            "block dùng chung thanh accent, chỉ khác ở việc có phủ toàn màn hình hay không.",
    },
}
