import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button, Typography } from "@heroui/react"
import { CheckIcon } from "@phosphor-icons/react"
import { PricingCard } from "./index"

const meta: Meta<typeof PricingCard> = {
    title: "Blocks/Card/PricingCard",
    component: PricingCard,
    parameters: { layout: "centered" },
}
export default meta
type Story = StoryObj<typeof PricingCard>

const basicFeatures = (
    <ul className="flex flex-col gap-2">
        <li className="flex items-center gap-2">
            <CheckIcon size={16} />
            <Typography type="body-sm">5 khoá học nền tảng</Typography>
        </li>
        <li className="flex items-center gap-2">
            <CheckIcon size={16} />
            <Typography type="body-sm">Chấm bài bằng AI</Typography>
        </li>
        <li className="flex items-center gap-2">
            <CheckIcon size={16} />
            <Typography type="body-sm">Hỗ trợ cộng đồng</Typography>
        </li>
    </ul>
)

const fullFeatures = (
    <ul className="flex flex-col gap-2">
        <li className="flex items-center gap-2">
            <CheckIcon size={16} />
            <Typography type="body-sm">Toàn bộ khoá học &amp; lộ trình</Typography>
        </li>
        <li className="flex items-center gap-2">
            <CheckIcon size={16} />
            <Typography type="body-sm">Chấm bài bằng AI không giới hạn</Typography>
        </li>
        <li className="flex items-center gap-2">
            <CheckIcon size={16} />
            <Typography type="body-sm">Phỏng vấn thử với AI</Typography>
        </li>
        <li className="flex items-center gap-2">
            <CheckIcon size={16} />
            <Typography type="body-sm">Chứng chỉ hoàn thành</Typography>
        </li>
        <li className="flex items-center gap-2">
            <CheckIcon size={16} />
            <Typography type="body-sm">Hỗ trợ ưu tiên 1-1</Typography>
        </li>
    </ul>
)

/** Dùng cho gói giá cơ bản, không khuyến mãi, hiển thị như một lựa chọn thường trong bảng giá. */
export const Default: Story = {
    parameters: { usage: "Dùng cho gói giá cơ bản, không khuyến mãi, hiển thị như một lựa chọn thường trong bảng giá." },
    render: () => (
        <div className="w-80">
            <PricingCard
                name="Cơ bản"
                price="Miễn phí"
                features={basicFeatures}
                cta={<Button className="w-full" variant="outline">Bắt đầu</Button>}
            />
        </div>
    ),
}

/** Dùng cho gói được đề xuất nhất trong bảng giá, cần nổi bật hơn các gói còn lại kèm nhãn huy hiệu. */
export const Highlighted: Story = {
    parameters: { usage: "Dùng cho gói được đề xuất nhất trong bảng giá, cần nổi bật hơn các gói còn lại kèm nhãn huy hiệu." },
    render: () => (
        <div className="w-80">
            <PricingCard
                name="Pro"
                price="299.000đ"
                period="/tháng"
                features={fullFeatures}
                cta={<Button className="w-full" variant="primary">Nâng cấp ngay</Button>}
                badge="Phổ biến nhất"
                highlighted
            />
        </div>
    ),
}

/** Dùng khi gói đang có khuyến mãi, cần hiển thị giá gốc gạch ngang bên cạnh giá ưu đãi để nhấn mạnh mức giảm. */
export const WithDiscount: Story = {
    parameters: { usage: "Dùng khi gói đang có khuyến mãi, cần hiển thị giá gốc gạch ngang bên cạnh giá ưu đãi để nhấn mạnh mức giảm." },
    render: () => (
        <div className="w-80">
            <PricingCard
                name="Premium"
                price="499.000đ"
                originalPrice="990.000đ"
                period="/năm"
                features={fullFeatures}
                cta={<Button className="w-full" variant="primary">Mua ngay</Button>}
                badge="Giảm 50%"
                highlighted
            />
        </div>
    ),
}