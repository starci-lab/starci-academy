import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button } from "@heroui/react"

import { PricingCard } from "@/components/blocks/cards/PricingCard"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof PricingCard> = {
    title: "Legacy/Blocks/Card/PricingCard",
    component: PricingCard,
}

export default meta

type Story = StoryObj<typeof PricingCard>

/**
 * Toàn bộ ma trận trạng thái của `PricingCard` trong một Gallery: tier cơ bản,
 * tier nổi bật kèm badge, ca badge bị ẩn vì thiếu `highlighted`, tier không có
 * kỳ hạn (thanh toán một lần), và danh sách feature dài để soi hành vi
 * `flex-1` của khối feature.
 */
export const AllVariants: Story = {
    parameters: {
        usage: "Xem tất cả trạng thái prop của PricingCard cạnh nhau trước khi ghép vào trang bảng giá — chọn đúng tổ hợp originalPrice/period/badge/highlighted cho từng tier.",
    },
    render: () => (
        <Gallery>
            <Variant
                label="Tier cơ bản"
                hint="Không giảm giá, không nổi bật — dùng cho tier miễn phí hoặc tier thấp nhất trong bảng giá."
            >
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
                        cta={
                            <Button className="w-full" variant="outline">
                                Bắt đầu miễn phí
                            </Button>
                        }
                    />
                </div>
            </Variant>
            <Variant
                label="Tier nổi bật + badge"
                hint="highlighted kèm badge — dùng cho đúng một tier được đề xuất trong bảng giá, có originalPrice để nhấn khuyến mãi."
            >
                <div className="max-w-sm">
                    <PricingCard
                        name="Pro"
                        price="199.000đ"
                        originalPrice="399.000đ"
                        period="/tháng"
                        badge="Phổ biến nhất"
                        highlighted
                        features={
                            <ul className="flex flex-col gap-2 text-sm text-foreground">
                                <li>500 tín dụng AI mỗi tháng</li>
                                <li>Mở toàn bộ khóa học</li>
                                <li>Chấm bài ưu tiên bằng model Balanced</li>
                                <li>Không giới hạn mock interview</li>
                            </ul>
                        }
                        cta={
                            <Button className="w-full" variant="primary">
                                Nâng cấp ngay
                            </Button>
                        }
                    />
                </div>
            </Variant>
            <Variant
                label="Badge bị ẩn (thiếu highlighted)"
                hint="badge chỉ hiện khi highlighted đồng thời true — set badge nhưng để highlighted=false thì badge không render, đúng theo thiết kế của block, không phải bug."
            >
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
                        cta={
                            <Button className="w-full" variant="outline">
                                Nâng cấp
                            </Button>
                        }
                    />
                </div>
            </Variant>
            <Variant
                label="Không có kỳ hạn (thanh toán một lần)"
                hint="Bỏ period khi giá không lặp lại theo tháng, ví dụ gói doanh nghiệp báo giá theo hợp đồng."
            >
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
                        cta={
                            <Button className="w-full" variant="outline">
                                Liên hệ tư vấn
                            </Button>
                        }
                    />
                </div>
            </Variant>
            <Variant
                label="Danh sách feature dài"
                hint="features là ReactNode tự do — khối feature nhận flex-1 nên co giãn theo chiều cao card, CTA vẫn dính đáy dù danh sách dài."
            >
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
                        cta={
                            <Button className="w-full" variant="primary">
                                Nâng cấp Pro Plus
                            </Button>
                        }
                    />
                </div>
            </Variant>
        </Gallery>
    ),
}

/**
 * Bảng giá thật gồm ba tier xếp cạnh nhau trong một grid co giãn đều
 * chiều cao — bố cục full-bleed để thấy `highlighted` nổi bật đúng cách
 * khi đặt giữa hai tier thường, và khối feature giãn đều dù số dòng khác nhau.
 */
export const PricingRow: Story = {
    parameters: {
        usage: "Dùng bố cục lưới ba cột này khi ghép PricingCard vào trang bảng giá thật — kiểm tra tier nổi bật có nổi lên đúng mức giữa các tier lân cận, và ba card có bằng chiều cao dù feature list dài ngắn khác nhau.",
    },
    render: () => (
        <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-3">
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
                cta={
                    <Button className="w-full" variant="outline">
                        Bắt đầu miễn phí
                    </Button>
                }
            />
            <PricingCard
                name="Pro"
                price="199.000đ"
                originalPrice="399.000đ"
                period="/tháng"
                badge="Phổ biến nhất"
                highlighted
                features={
                    <ul className="flex flex-col gap-2 text-sm text-foreground">
                        <li>500 tín dụng AI mỗi tháng</li>
                        <li>Mở toàn bộ khóa học</li>
                        <li>Chấm bài ưu tiên bằng model Balanced</li>
                        <li>Không giới hạn mock interview</li>
                    </ul>
                }
                cta={
                    <Button className="w-full" variant="primary">
                        Nâng cấp ngay
                    </Button>
                }
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
                cta={
                    <Button className="w-full" variant="outline">
                        Liên hệ tư vấn
                    </Button>
                }
            />
        </div>
    ),
}
