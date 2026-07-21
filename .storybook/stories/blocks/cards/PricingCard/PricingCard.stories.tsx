import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button } from "@heroui/react"
import { PricingCard } from "./PricingCard"
import { blockShell } from "../../../block-anatomy"

const meta: Meta<typeof PricingCard> = {
    title: "Block/Cards/PricingCard",
    component: PricingCard,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof PricingCard>

const ANATOMY = {
    primitives: [
        { name: "SectionCard", role: "khung surface (accent khi highlighted, contentClassName xếp dọc + h-full)" },
    ],
    reason:
        "Một tier bảng giá là MỘT surface tự đóng khung (SectionCard) với công thức cố định: tên + chip nổi bật, dòng giá lớn kèm giá gốc gạch ngang, danh sách feature giãn đầy chiều cao, và CTA dính đáy. Gói vào một block để mọi tier trong bảng giá đều một khuôn, bằng chiều cao khi xếp lưới — feature chỉ đổi nội dung ReactNode.",
}

const FEATURES = (
    <ul className="flex flex-col gap-2 text-sm text-foreground">
        <li>500 tín dụng AI mỗi tháng</li>
        <li>Mở toàn bộ khóa học</li>
        <li>Chấm bài ưu tiên bằng model Balanced</li>
        <li>Không giới hạn mock interview</li>
    </ul>
)

export const BaseTier: Story = {
    render: () =>
        blockShell(
            <div className="max-w-sm">
                <PricingCard
                    name="Free"
                    price="0đ"
                    period="/tháng"
                    features={
                        <ul className="flex flex-col gap-2 text-sm text-foreground">
                            <li>50 tín dụng AI mỗi tháng</li>
                            <li>Truy cập toàn bộ bài học miễn phí</li>
                            <li>1 mock interview mỗi tuần</li>
                        </ul>
                    }
                    cta={<Button className="w-full" variant="outline">Bắt đầu miễn phí</Button>}
                />
            </div>,
            ANATOMY,
        ),
}

export const HighlightedWithBadge: Story = {
    render: () =>
        blockShell(
            <div className="max-w-sm">
                <PricingCard
                    name="Pro"
                    price="199.000đ"
                    originalPrice="399.000đ"
                    period="/tháng"
                    badge="Phổ biến nhất"
                    highlighted
                    features={FEATURES}
                    cta={<Button className="w-full" variant="primary">Nâng cấp ngay</Button>}
                />
            </div>,
            ANATOMY,
        ),
}

export const BadgeHiddenWithoutHighlight: Story = {
    render: () =>
        blockShell(
            <div className="max-w-sm">
                <PricingCard
                    name="Pro"
                    price="199.000đ"
                    period="/tháng"
                    badge="Phổ biến nhất"
                    features={
                        <ul className="flex flex-col gap-2 text-sm text-foreground">
                            <li>500 tín dụng AI mỗi tháng</li>
                            <li>Mở toàn bộ khóa học</li>
                        </ul>
                    }
                    cta={<Button className="w-full" variant="outline">Nâng cấp</Button>}
                />
            </div>,
            ANATOMY,
        ),
}

export const NoPeriod: Story = {
    render: () =>
        blockShell(
            <div className="max-w-sm">
                <PricingCard
                    name="Enterprise"
                    price="Liên hệ"
                    features={
                        <ul className="flex flex-col gap-2 text-sm text-foreground">
                            <li>Tín dụng AI theo nhu cầu</li>
                            <li>Onboarding riêng cho đội ngũ</li>
                            <li>SLA hỗ trợ 24/7</li>
                        </ul>
                    }
                    cta={<Button className="w-full" variant="outline">Liên hệ tư vấn</Button>}
                />
            </div>,
            ANATOMY,
        ),
}

export const LongFeatureList: Story = {
    render: () =>
        blockShell(
            <div className="max-w-sm">
                <PricingCard
                    name="Pro Plus"
                    price="349.000đ"
                    originalPrice="599.000đ"
                    period="/tháng"
                    features={
                        <ul className="flex flex-col gap-2 text-sm text-foreground">
                            <li>1000 tín dụng AI mỗi tháng</li>
                            <li>Mở toàn bộ khóa học + capstone</li>
                            <li>Chấm bài bằng model Premium</li>
                            <li>Không giới hạn mock interview</li>
                            <li>Review 1:1 với mentor mỗi tháng</li>
                            <li>Ưu tiên phản hồi support dưới 2 giờ</li>
                            <li>Truy cập sớm bài học mới</li>
                        </ul>
                    }
                    cta={<Button className="w-full" variant="primary">Nâng cấp Pro Plus</Button>}
                />
            </div>,
            ANATOMY,
        ),
}

export const PricingRow: Story = {
    render: () =>
        blockShell(
            <div className="grid max-w-4xl grid-cols-1 items-stretch gap-6 @app-md:grid-cols-3">
                <PricingCard
                    name="Free"
                    price="0đ"
                    period="/tháng"
                    features={
                        <ul className="flex flex-col gap-2 text-sm text-foreground">
                            <li>50 tín dụng AI mỗi tháng</li>
                            <li>Truy cập toàn bộ bài học miễn phí</li>
                        </ul>
                    }
                    cta={<Button className="w-full" variant="outline">Bắt đầu miễn phí</Button>}
                />
                <PricingCard
                    name="Pro"
                    price="199.000đ"
                    originalPrice="399.000đ"
                    period="/tháng"
                    badge="Phổ biến nhất"
                    highlighted
                    features={FEATURES}
                    cta={<Button className="w-full" variant="primary">Nâng cấp ngay</Button>}
                />
                <PricingCard
                    name="Enterprise"
                    price="Liên hệ"
                    features={
                        <ul className="flex flex-col gap-2 text-sm text-foreground">
                            <li>Tín dụng AI theo nhu cầu</li>
                            <li>Onboarding riêng cho đội ngũ</li>
                            <li>SLA hỗ trợ 24/7</li>
                        </ul>
                    }
                    cta={<Button className="w-full" variant="outline">Liên hệ tư vấn</Button>}
                />
            </div>,
            ANATOMY,
        ),
}
