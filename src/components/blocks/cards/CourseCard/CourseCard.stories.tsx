import type { Meta, StoryObj } from "@storybook/nextjs"
import { CourseCard } from "./index"
import type { CourseEntity } from "@/modules/types/entities/course"
import { PricingPhase } from "@/modules/types/enums"

const now = new Date("2026-01-01T00:00:00.000Z")

/** Realistic base course entity — overridden per story. */
const baseCourse: CourseEntity = {
    id: "course-fullstack-mastery",
    createdAt: now,
    updatedAt: now,
    displayId: "fullstack-mastery",
    title: "Fullstack Mastery: Từ Zero đến Senior",
    slug: "fullstack-mastery",
    description: "Lộ trình fullstack thực chiến: React, NestJS, PostgreSQL, hệ thống lớn — build sản phẩm thật, không chỉ học lý thuyết.",
    cdnUrl: null,
    coverImageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
    originalPrice: 2990000,
    originalPriceUsd: 129,
    pricingPhases: [
        {
            id: "phase-pioneer",
            createdAt: now,
            updatedAt: now,
            phase: PricingPhase.Pioneer,
            price: 1990000,
            priceUsd: 79,
            slotAvailable: 12,
            sortIndex: 1,
        },
    ],
    currentPhase: PricingPhase.Pioneer,
    valuePropositions: [
        { id: "vp-1", createdAt: now, updatedAt: now, text: "Xây dựng 4 dự án thực chiến từ đầu đến triển khai", sortIndex: 1 },
        { id: "vp-2", createdAt: now, updatedAt: now, text: "Mock interview với AI chấm điểm theo tiêu chuẩn senior", sortIndex: 2 },
        { id: "vp-3", createdAt: now, updatedAt: now, text: "Lộ trình cá nhân hoá theo tốc độ học của bạn", sortIndex: 3 },
    ],
    enrollmentCount: 1284,
    isEnrolled: false,
}

const meta: Meta<typeof CourseCard> = {
    title: "Blocks/Card/CourseCard",
    component: CourseCard,
    parameters: { layout: "centered" },
}
export default meta
type Story = StoryObj<typeof CourseCard>

/** Dùng làm thẻ khóa học mặc định trong lưới catalog — cover, mô tả, top ưu điểm và giá theo phase hiện tại kèm nút xem khóa học. */
export const Default: Story = {
    parameters: { usage: "Dùng làm thẻ khóa học mặc định trong lưới catalog — cover, mô tả, top ưu điểm và giá theo phase hiện tại kèm nút xem khóa học." },
    render: () => (
        <div className="w-[360px]">
            <CourseCard course={baseCourse} />
        </div>
    ),
}

/** Chuyển sang layout hàng ngang khi catalog ở chế độ xem danh sách, để quét nhanh nhiều khóa học trên màn hình hẹp theo chiều dọc. */
export const LineLayout: Story = {
    parameters: { usage: "Chuyển sang layout hàng ngang khi catalog ở chế độ xem danh sách, để quét nhanh nhiều khóa học trên màn hình hẹp theo chiều dọc." },
    render: () => (
        <div className="w-[560px]">
            <CourseCard course={baseCourse} layout="line" />
        </div>
    ),
}

/** Khi viewer đã sở hữu khóa học, đổi CTA chính sang "Tiếp tục học" và thêm nút phụ "Xem khóa học" để vẫn ghé lại trang marketing. */
export const Enrolled: Story = {
    parameters: { usage: "Khi viewer đã sở hữu khóa học, đổi CTA chính sang \"Tiếp tục học\" và thêm nút phụ \"Xem khóa học\" để vẫn ghé lại trang marketing." },
    render: () => (
        <div className="w-[360px]">
            <CourseCard course={{ ...baseCourse, isEnrolled: true }} />
        </div>
    ),
}

/** Dùng khi giá loyalty cá nhân hoá đang chờ resolve (viewer đã đăng nhập) — skeleton dòng giá thay vì nháy giá phase rồi đổi ngay sau đó. */
export const LoyaltyPricePending: Story = {
    parameters: { usage: "Dùng khi giá loyalty cá nhân hoá đang chờ resolve (viewer đã đăng nhập) — skeleton dòng giá thay vì nháy giá phase rồi đổi ngay sau đó." },
    render: () => (
        <div className="w-[360px]">
            <CourseCard course={baseCourse} loyaltyPending />
        </div>
    ),
}

/** Khi khóa học chưa có ảnh cover (hoặc ảnh lỗi), thẻ tự hiện fallback gradient thương hiệu kèm tiêu đề thay vì để trống. */
export const NoCoverFallback: Story = {
    parameters: { usage: "Khi khóa học chưa có ảnh cover (hoặc ảnh lỗi), thẻ tự hiện fallback gradient thương hiệu kèm tiêu đề thay vì để trống." },
    render: () => (
        <div className="w-[360px]">
            <CourseCard course={{ ...baseCourse, coverImageUrl: null }} />
        </div>
    ),
}
