import type { Meta, StoryObj } from "@storybook/nextjs"
import { ProgressRing } from "@/components/blocks/stats/ProgressRing"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof ProgressRing> = {
    title: "Primitives/DataDisplay/ProgressRing",
    component: ProgressRing,
}
export default meta
type Story = StoryObj<typeof ProgressRing>

/**
 * Toàn bộ ma trận trạng thái của ProgressRing: 3 kích thước (sm/md/lg), 4 tone
 * theo ngưỡng ý nghĩa của số liệu (accent/success/warning/danger), và các cách
 * dùng caption/label ở tâm vòng (mặc định phần trăm, nhãn tuỳ chỉnh, hoặc bỏ
 * caption). Dùng để tra chọn size theo vị trí đặt, chọn tone theo ý nghĩa số,
 * và khi nào cần caption giải thích vòng đang đo cái gì.
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="Nhỏ (sm)"
                hint="Dùng ở chỗ chật, nằm cạnh một dòng chữ hoặc trong danh sách gọn, khi vòng chỉ là chi tiết phụ."
            >
                <ProgressRing value={68} size="sm" />
            </Variant>
            <Variant
                label="Vừa (md)"
                hint="Dùng trong một stat card thông thường, khi vòng là nội dung chính của card."
            >
                <ProgressRing value={68} size="md" />
            </Variant>
            <Variant
                label="Lớn (lg)"
                hint="Dùng làm số liệu nổi bật ở đầu trang hoặc dashboard, khi muốn con số đập vào mắt trước tiên."
            >
                <ProgressRing value={68} size="lg" />
            </Variant>
            <Variant
                label="Tone Accent"
                hint="Dùng cho tiến độ trung tính, khi con số chỉ cho biết đã đi được bao xa và không mang nghĩa tốt/xấu."
            >
                <ProgressRing value={68} tone="accent" caption="Course progress" />
            </Variant>
            <Variant
                label="Tone Success"
                hint="Dùng khi con số đã đạt mức tốt, ví dụ điểm kiểm tra vượt ngưỡng đạt."
            >
                <ProgressRing value={92} tone="success" caption="Test score" />
            </Variant>
            <Variant
                label="Tone Warning"
                hint="Dùng khi con số ở mức cần chú ý — chưa tới nhưng cũng chưa đáng lo."
            >
                <ProgressRing value={45} tone="warning" caption="This week's progress" />
            </Variant>
            <Variant
                label="Tone Danger"
                hint="Dùng khi con số dưới ngưỡng và cần cảnh báo, ví dụ tỉ lệ hoàn thành quá thấp."
            >
                <ProgressRing value={18} tone="danger" caption="Completion rate" />
            </Variant>
            <Variant
                label="Có caption"
                hint="Thêm caption khi vòng đứng độc lập và cần nói rõ nó đang đo cái gì."
            >
                <ProgressRing value={68} size="lg" caption="Course progress" />
            </Variant>
            <Variant
                label="Nhãn tuỳ chỉnh"
                hint="Ghi đè nhãn ở tâm vòng bằng một phân số khi số lượng dễ hiểu hơn phần trăm."
            >
                <ProgressRing value={90} size="lg" tone="success" label="9/10" caption="Lessons completed" />
            </Variant>
            <Variant
                label="Không caption"
                hint="Bỏ caption khi ngữ cảnh xung quanh đã đủ rõ, chỉ cần vòng và con số."
            >
                <ProgressRing value={68} size="lg" />
            </Variant>
        </Gallery>
    ),
    parameters: {
        usage:
            "Toàn bộ ma trận trạng thái của ProgressRing: 3 kích thước (sm/md/lg), 4 tone theo ngưỡng ý nghĩa " +
            "(accent/success/warning/danger), và các cách dùng caption/label ở tâm vòng (phần trăm mặc định, " +
            "nhãn tuỳ chỉnh, hoặc bỏ caption). Dùng khi cần chọn size theo vị trí đặt, chọn tone theo ý nghĩa " +
            "của con số, và xác định lúc nào cần caption giải thích.",
    },
}
