import type { Meta, StoryObj } from "@storybook/nextjs"
import { SearchBar } from "@/components/blocks/form/SearchBar"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof SearchBar> = {
    title: "Blocks/Form/SearchBar",
    component: SearchBar,
}
export default meta
type Story = StoryObj<typeof SearchBar>

/**
 * Cả hai cách đặt của thanh tìm kiếm: chiếm hết chiều rộng khả dụng (header/toolbar
 * toàn trang) và co lại trong một khung hẹp (sidebar/card). Component không nhận
 * items/loading/error từ ngoài — danh sách 3 gợi ý (Khóa học/Học phần/Video) và
 * placeholder đều lấy từ i18n `search.*`, popover autocomplete tự quản lý trạng thái
 * mở/đóng/lọc bên trong nên bấm và gõ thử ngay trong canvas là thấy hành vi thật.
 */
export const AllVariants: Story = {
    parameters: {
        usage: "Dùng làm ô tìm kiếm chính của header/toolbar: bấm vào để mở popover gợi ý (Khóa học/Học phần/Video), gõ để lọc, và nút icon bộ lọc ở cuối để mở panel lọc nâng cao. Component chỉ nhận className — không có items/loading/error/disabled từ ngoài vì Autocomplete tự quản trạng thái mở/lọc của chính nó.",
    },
    render: () => (
        <Gallery>
            <Variant
                label="Mặc định — full width"
                hint="Đặt trong header hoặc toolbar toàn trang, chiếm hết chiều rộng cha (fullWidth trên TextField + Autocomplete)."
            >
                <SearchBar />
            </Variant>
            <Variant
                label="Trong khung hẹp"
                hint="Truyền className giới hạn max-width khi thanh tìm kiếm nằm trong sidebar hoặc card hẹp — InputGroup và nút icon bộ lọc vẫn giữ đúng tỉ lệ, không vỡ layout."
            >
                <div className="w-64">
                    <SearchBar className="w-full" />
                </div>
            </Variant>
        </Gallery>
    ),
}
