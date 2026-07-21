import type { Meta, StoryObj } from "@storybook/nextjs"
import { Chip } from "@heroui/react"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof Chip> = {
    title: "Primitives/DataDisplay/Chip",
    component: Chip,
}
export default meta
type Story = StoryObj<typeof Chip>

/**
 * Toàn bộ bảng màu của `Chip` HeroUI — primitive nền cho mọi chip/pill/tag/badge (mọi
 * block trong họ `Core/Chip` dựng trên nó). Dùng để tra "màu nào trông ra sao" cạnh các
 * block khác, và chọn màu theo Ý NGHĨA, không phải thẩm mỹ.
 */
export const AllVariants: Story = {
    parameters: {
        usage:
            "Chip là nhãn TRẠNG THÁI, KHÔNG phải nút bấm. Chọn màu theo Ý NGHĨA: accent = đang chọn / bước tiếp " +
            "theo · success = đã xong · warning = cần chú ý · danger = lỗi · default = trung tính. Luôn dùng " +
            "variant=\"soft\" cho các sắc thái ngữ nghĩa (cặp bg-<status>-soft + text-<status>-soft-foreground đạt " +
            "độ tương phản ở cả light và dark — màu gốc trên nền tint nhạt không đạt 4.5:1). Ngoài gallery này, " +
            "một cụm meta chỉ được mang DUY NHẤT một chip trên MỘT trục phân loại; phần còn lại để text thường + icon.",
    },
    render: () => (
        <Gallery>
            <Variant
                label="Accent"
                hint="Dùng khi mục đang được chọn hoặc là bước kế tiếp cần làm — thứ muốn kéo mắt người dùng vào."
            >
                <Chip color="accent" variant="soft"><Chip.Label>In progress</Chip.Label></Chip>
            </Variant>
            <Variant
                label="Success"
                hint="Dùng khi một việc đã hoàn tất và đạt yêu cầu, không cần hành động gì thêm."
            >
                <Chip color="success" variant="soft"><Chip.Label>Completed</Chip.Label></Chip>
            </Variant>
            <Variant
                label="Warning"
                hint="Dùng khi người dùng cần chú ý nhưng chưa phải lỗi — ví dụ gần hết hạn hoặc còn đang xử lý."
            >
                <Chip color="warning" variant="soft"><Chip.Label>Due soon</Chip.Label></Chip>
            </Variant>
            <Variant
                label="Danger"
                hint="Dùng khi kết quả là lỗi hoặc thất bại — trạng thái người dùng cần sửa."
            >
                <Chip color="danger" variant="soft"><Chip.Label>Not passed</Chip.Label></Chip>
            </Variant>
            <Variant
                label="Default"
                hint="Dùng cho nhãn trung tính không mang ý nghĩa trạng thái — ví dụ bản nháp hoặc một phân loại thông thường."
            >
                <Chip color="default" variant="soft"><Chip.Label>Draft</Chip.Label></Chip>
            </Variant>
        </Gallery>
    ),
}
