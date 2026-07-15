import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { PricingTable } from "./index"
import type { PricingTableTier } from "./index"

const meta: Meta<typeof PricingTable> = {
    title: "Block/Commerce/PricingTable",
    component: PricingTable,
}
export default meta
type Story = StoryObj<typeof PricingTable>

/** Ba gói dùng chung một bộ tính năng để các nhãn thẳng hàng giữa các cột. */
const threeTiers: PricingTableTier[] = [
    {
        id: "free",
        name: "Miễn phí",
        price: "0₫",
        description: "Học thử và làm quen với nền tảng.",
        ctaLabel: "Bắt đầu miễn phí",
        features: [
            { label: "Truy cập bài học nhập môn", included: true },
            { label: "Chấm bài bằng mô hình nội bộ", included: true },
            { label: "Chấm bài bằng mô hình cao cấp", included: false },
            { label: "Phỏng vấn thử không giới hạn", included: false },
            { label: "Hỗ trợ ưu tiên qua email", included: false },
        ],
    },
    {
        id: "pro",
        name: "Chuyên nghiệp",
        price: "299.000₫",
        period: "/tháng",
        description: "Dành cho người học nghiêm túc muốn lên trình nhanh.",
        ctaLabel: "Chọn gói Chuyên nghiệp",
        isHighlighted: true,
        features: [
            { label: "Truy cập bài học nhập môn", included: true },
            { label: "Chấm bài bằng mô hình nội bộ", included: true },
            { label: "Chấm bài bằng mô hình cao cấp", included: true },
            { label: "Phỏng vấn thử không giới hạn", included: true },
            { label: "Hỗ trợ ưu tiên qua email", included: false },
        ],
    },
    {
        id: "team",
        name: "Nhóm",
        price: "899.000₫",
        period: "/tháng",
        description: "Cho nhóm học tập hoặc doanh nghiệp nhỏ.",
        ctaLabel: "Liên hệ tư vấn",
        features: [
            { label: "Truy cập bài học nhập môn", included: true },
            { label: "Chấm bài bằng mô hình nội bộ", included: true },
            { label: "Chấm bài bằng mô hình cao cấp", included: true },
            { label: "Phỏng vấn thử không giới hạn", included: true },
            { label: "Hỗ trợ ưu tiên qua email", included: true },
        ],
    },
]

/** Dùng khi cần so sánh 2–3 gói cạnh nhau — mỗi cột có tên gói, giá và chu kỳ, danh sách tính năng có dấu tích hoặc dấu gạch, nút hành động và một gói nổi bật gắn ruy băng "phổ biến". */
export const Default: Story = {
    parameters: {
        usage: "Dùng cho trang bảng giá hoặc bước nâng cấp — so sánh 2–3 gói cạnh nhau. Mỗi gói tự cầm giá đã định dạng sẵn dạng chuỗi; nhãn tính năng nên giữ giống nhau giữa các gói để thẳng hàng. Gói ở giữa bật isHighlighted để có ruy băng phổ biến và khung nhấn.",
    },
    render: () => (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <Label>Ba gói, gói giữa nổi bật</Label>
                <Typography type="body-sm" color="muted">
                    Ba cột dùng chung một bộ tính năng nên các nhãn thẳng hàng; gói Chuyên nghiệp ở giữa được nhấn bằng ruy băng phổ biến và khung nhấn.
                </Typography>
            </div>
            <PricingTable tiers={threeTiers} onSelectTier={() => {}} />
        </div>
    ),
}

/** Dùng để kiểm tra bố cục khi chỉ có hai gói, không gói nào được nhấn — hai cột vẫn giãn đều và thẳng hàng nút. */
export const TwoTiersNoHighlight: Story = {
    parameters: {
        usage: "Dùng khi chỉ có hai gói và không muốn nhấn gói nào — hai cột giãn đều, thẳng hàng nút hành động ở đáy. Không truyền isHighlighted thì không cột nào có ruy băng.",
    },
    render: () => (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <Label>Hai gói, không nhấn</Label>
                <Typography type="body-sm" color="muted">
                    Khi chỉ có hai gói và không nhấn gói nào, hai cột vẫn giãn đều và các nút hành động thẳng hàng ở đáy.
                </Typography>
            </div>
            <PricingTable
                tiers={threeTiers.slice(0, 2).map((tier) => ({ ...tier, isHighlighted: false }))}
                onSelectTier={() => {}}
            />
        </div>
    ),
}
