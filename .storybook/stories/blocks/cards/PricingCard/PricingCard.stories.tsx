import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button } from "@heroui/react"
import { PricingCard } from "./PricingCard"
import { BlockAnatomy, type AnatomyNode } from "../../layout/BlockAnatomy/BlockAnatomy"

/**
 * DESIGN — one pricing tier (a self-framed SectionCard surface). The leaves here
 * are SHAPE variants: which optional parts render (`StatusChip` only when
 * highlighted && badge · struck `originalPrice` · `period`).
 *
 * ANATOMY IS PER-LEAF: each story below is its OWN leaf and carries its OWN
 * BlockAnatomy axis (Sơ đồ + Cây) reflecting the parts THAT leaf composes — there
 * is no separate consolidated "Anatomy" story. The component emits no anchors, so
 * Sơ đồ is a clean render + numbered legend.
 */
const meta: Meta<typeof PricingCard> = {
    title: "Design/Cards/PricingCard",
    component: PricingCard,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof PricingCard>

/** Frame each leaf's anatomy panel with breathing room. */
const frame = (node: React.ReactNode) => <div className="mx-auto max-w-4xl p-8">{node}</div>

const FEATURES = (
    <ul className="flex flex-col gap-2 text-sm text-foreground">
        <li>500 tín dụng AI mỗi tháng</li>
        <li>Mở toàn bộ khóa học</li>
        <li>Chấm bài ưu tiên bằng model Balanced</li>
        <li>Không giới hạn mock interview</li>
    </ul>
)

// BASE shape (BaseTier · BadgeHiddenWithoutHighlight): no chip, no struck price, has period.
const BASE_PARTS: Array<AnatomyNode> = [
    { name: "SectionCard", tier: "design", role: "khung surface (accent khi highlighted, contentClassName xếp dọc + h-full)" },
    { name: "Typography · tên", tier: "primitive", role: "tên tier (body semibold)" },
    { name: "Typography · giá", tier: "primitive", role: "giá lớn (h3 semibold)" },
    { name: "Typography · period", tier: "primitive", role: "nhãn kỳ hạn (body-xs muted)" },
    { name: "features", tier: "primitive", role: "danh sách feature (ReactNode) — giãn flex-1 đầy chiều cao" },
    { name: "cta", tier: "primitive", role: "nút hành động (Button) — dính đáy card" },
]

// FULL shape (HighlightedWithBadge): highlighted && badge → chip accent hiện + giá gốc gạch ngang.
const FULL_PARTS: Array<AnatomyNode> = [
    { name: "SectionCard", tier: "design", role: "khung surface (accent khi highlighted, contentClassName xếp dọc + h-full)" },
    { name: "Typography · tên", tier: "primitive", role: "tên tier (body semibold)" },
    { name: "StatusChip", tier: "primitive", role: 'chip "phổ biến nhất" (accent, w-fit) — chỉ khi highlighted && badge', state: "accent" },
    { name: "Typography · giá", tier: "primitive", role: "giá lớn (h3 semibold)" },
    { name: "Typography · giá gốc", tier: "primitive", role: "giá gốc gạch ngang (body-sm muted line-through)" },
    { name: "Typography · period", tier: "primitive", role: "nhãn kỳ hạn (body-xs muted)" },
    { name: "features", tier: "primitive", role: "danh sách feature (ReactNode) — giãn flex-1 đầy chiều cao" },
    { name: "cta", tier: "primitive", role: "nút hành động (Button) — dính đáy card" },
]

// DISCOUNT shape (DiscountWithoutHighlight · LongFeatureList): giá gốc gạch ngang nhưng KHÔNG chip.
const DISCOUNT_PARTS: Array<AnatomyNode> = [
    { name: "SectionCard", tier: "design", role: "khung surface (accent khi highlighted, contentClassName xếp dọc + h-full)" },
    { name: "Typography · tên", tier: "primitive", role: "tên tier (body semibold)" },
    { name: "Typography · giá", tier: "primitive", role: "giá lớn (h3 semibold)" },
    { name: "Typography · giá gốc", tier: "primitive", role: "giá gốc gạch ngang (body-sm muted line-through)" },
    { name: "Typography · period", tier: "primitive", role: "nhãn kỳ hạn (body-xs muted)" },
    { name: "features", tier: "primitive", role: "danh sách feature (ReactNode) — giãn flex-1 đầy chiều cao" },
    { name: "cta", tier: "primitive", role: "nút hành động (Button) — dính đáy card" },
]

// NO-PERIOD shape (NoPeriod): dòng giá chỉ còn giá lớn, không period, không giá gốc, không chip.
const NO_PERIOD_PARTS: Array<AnatomyNode> = [
    { name: "SectionCard", tier: "design", role: "khung surface (accent khi highlighted, contentClassName xếp dọc + h-full)" },
    { name: "Typography · tên", tier: "primitive", role: "tên tier (body semibold)" },
    { name: "Typography · giá", tier: "primitive", role: "giá lớn (h3 semibold) — dòng giá chỉ còn một mình" },
    { name: "features", tier: "primitive", role: "danh sách feature (ReactNode) — giãn flex-1 đầy chiều cao" },
    { name: "cta", tier: "primitive", role: "nút hành động (Button) — dính đáy card" },
]

// ROW leaf (PricingRow): ba tier xếp lưới items-stretch → cùng chiều cao, gồm cả ba shape.
const ROW_PARTS: Array<AnatomyNode> = [
    { name: "PricingCard · Free", tier: "design", role: "tier cơ bản (không chip, không giá gốc)" },
    { name: "PricingCard · Pro", tier: "design", role: "tier nổi bật (highlighted → chip accent + giá gốc gạch ngang)", state: "highlighted" },
    { name: "PricingCard · Enterprise", tier: "design", role: "tier liên hệ (không kỳ hạn)" },
]

export const BaseTier: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="PricingCard"
                tier="design"
                leaf="Tier cơ bản"
                parts={BASE_PARTS}
                reason="Một tier bảng giá là MỘT surface tự đóng khung (SectionCard) với công thức cố định: tên + chip nổi bật, dòng giá lớn kèm giá gốc gạch ngang, danh sách feature giãn đầy chiều cao, và CTA dính đáy. Gói vào một block để mọi tier trong bảng giá đều một khuôn, bằng chiều cao khi xếp lưới — feature chỉ đổi nội dung ReactNode."
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
                        cta={<Button className="w-full" variant="outline">Bắt đầu miễn phí</Button>}
                    />
                </div>
            </BlockAnatomy>,
        ),
}

export const HighlightedWithBadge: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="PricingCard"
                tier="design"
                leaf="Nổi bật có badge"
                parts={FULL_PARTS}
                note="highlighted && badge → chip accent hiện + giá gốc gạch ngang; composition ĐẦY ĐỦ."
            >
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
                </div>
            </BlockAnatomy>,
        ),
}

export const BadgeHiddenWithoutHighlight: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="PricingCard"
                tier="design"
                leaf="Badge ẩn khi không nổi bật"
                parts={BASE_PARTS}
                note="badge truyền vào NHƯNG không highlighted → StatusChip ẩn; cùng composition với tier cơ bản."
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
                        cta={<Button className="w-full" variant="outline">Nâng cấp</Button>}
                    />
                </div>
            </BlockAnatomy>,
        ),
}

/** Có discount NHƯNG không highlighted — `originalPrice` render độc lập với `highlighted` (khác với badge, chỉ hiện khi `highlighted`). */
export const DiscountWithoutHighlight: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="PricingCard"
                tier="design"
                leaf="Giảm giá không nổi bật"
                parts={DISCOUNT_PARTS}
                note="originalPrice hiện độc lập với highlighted (khác chip) → giá gốc gạch ngang có mặt nhưng KHÔNG có StatusChip."
            >
                <div className="max-w-sm">
                    <PricingCard
                        name="Basic"
                        price="99.000đ"
                        originalPrice="149.000đ"
                        period="/tháng"
                        features={
                            <ul className="flex flex-col gap-2 text-sm text-foreground">
                                <li>200 tín dụng AI mỗi tháng</li>
                                <li>Mở 5 khóa học nền tảng</li>
                            </ul>
                        }
                        cta={<Button className="w-full" variant="outline">Chọn Basic</Button>}
                    />
                </div>
            </BlockAnatomy>,
        ),
}

export const NoPeriod: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="PricingCard"
                tier="design"
                leaf="Không kỳ hạn"
                parts={NO_PERIOD_PARTS}
                note="bỏ period → dòng giá chỉ còn giá lớn; không chip, không giá gốc."
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
                        cta={<Button className="w-full" variant="outline">Liên hệ tư vấn</Button>}
                    />
                </div>
            </BlockAnatomy>,
        ),
}

export const LongFeatureList: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="PricingCard"
                tier="design"
                leaf="Danh sách feature dài"
                parts={DISCOUNT_PARTS}
                note="features dài giãn flex-1 đẩy CTA xuống đáy; có giá gốc, cùng composition với leaf giảm giá."
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
                        cta={<Button className="w-full" variant="primary">Nâng cấp Pro Plus</Button>}
                    />
                </div>
            </BlockAnatomy>,
        ),
}

export const PricingRow: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="PricingCard"
                tier="design"
                leaf="Hàng bảng giá"
                parts={ROW_PARTS}
                note="ba tier xếp lưới items-stretch → cùng chiều cao; gồm cả ba shape (cơ bản · nổi bật · không kỳ hạn)."
            >
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
                </div>
            </BlockAnatomy>,
        ),
}
