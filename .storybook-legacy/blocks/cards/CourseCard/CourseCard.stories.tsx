import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button } from "@heroui/react"
import { CourseCard } from "@/components/blocks/cards/CourseCard"
import { PricingPhase } from "@/modules/types/enums/pricing-phase"
import type { CourseEntity } from "@/modules/types/entities/course"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof CourseCard> = {
    title: "Legacy/Blocks/Card/CourseCard",
    component: CourseCard,
}
export default meta
type Story = StoryObj<typeof CourseCard>

/** Fields every mock course shares — spread and override per specimen below. */
const baseCourse = {
    id: "course-fullstack-mastery",
    createdAt: new Date("2026-01-10T00:00:00.000Z"),
    updatedAt: new Date("2026-01-10T00:00:00.000Z"),
    displayId: "fullstack-mastery",
    slug: "fullstack-mastery",
    cdnUrl: null,
    coverImageUrl: "https://placehold.co/640x360",
    description: "Xây nền tảng vững từ frontend đến backend qua các dự án thực chiến, được AI chấm điểm.",
    originalPrice: 2990000,
    originalPriceUsd: 129,
    enrollmentCount: 482,
    valuePropositions: [
        { id: "vp-1", createdAt: new Date("2026-01-10T00:00:00.000Z"), updatedAt: new Date("2026-01-10T00:00:00.000Z"), text: "Xây 3 dự án thực chiến từ đầu đến khi triển khai", sortIndex: 1 },
        { id: "vp-2", createdAt: new Date("2026-01-10T00:00:00.000Z"), updatedAt: new Date("2026-01-10T00:00:00.000Z"), text: "Chấm bài bằng AI theo checklist tuyển dụng thật", sortIndex: 2 },
        { id: "vp-3", createdAt: new Date("2026-01-10T00:00:00.000Z"), updatedAt: new Date("2026-01-10T00:00:00.000Z"), text: "Mock interview không giới hạn số lần", sortIndex: 3 },
    ],
    pricingPhases: [
        { id: "pp-1", createdAt: new Date("2026-01-10T00:00:00.000Z"), updatedAt: new Date("2026-01-10T00:00:00.000Z"), phase: PricingPhase.Pioneer, price: 1490000, priceUsd: 59, slotAvailable: 20, sortIndex: 1 },
        { id: "pp-2", createdAt: new Date("2026-01-10T00:00:00.000Z"), updatedAt: new Date("2026-01-10T00:00:00.000Z"), phase: PricingPhase.EarlyBird, price: 2190000, priceUsd: 89, slotAvailable: 60, sortIndex: 2 },
        { id: "pp-3", createdAt: new Date("2026-01-10T00:00:00.000Z"), updatedAt: new Date("2026-01-10T00:00:00.000Z"), phase: PricingPhase.Regular, price: 2990000, priceUsd: 129, slotAvailable: null, sortIndex: 3 },
    ],
    currentPhase: PricingPhase.Pioneer,
} satisfies Partial<CourseEntity>

/** Course still selling in the Pioneer phase — loyalty preview resolved with a real discount. */
const discountedCourse: CourseEntity = {
    ...baseCourse,
    title: "Fullstack Mastery",
    isEnrolled: false,
}

/** Same course, viewed by a learner already enrolled. */
const enrolledCourse: CourseEntity = {
    ...baseCourse,
    id: "course-system-design",
    displayId: "system-design-mastery",
    slug: "system-design-mastery",
    title: "System Design Mastery",
    isEnrolled: true,
}

/** No cover uploaded yet — the branded gradient + icon fallback shows instead. */
const noCoverCourse: CourseEntity = {
    ...baseCourse,
    id: "course-devops",
    displayId: "devops-mastery",
    slug: "devops-mastery",
    title: "DevOps Mastery",
    coverImageUrl: null,
    isEnrolled: false,
}

/** A free intro course: no pricing phase, no list price, no learners yet. */
const freeCourse: CourseEntity = {
    ...baseCourse,
    id: "course-git-intro",
    displayId: "git-nhap-mon",
    slug: "git-nhap-mon",
    title: "Nhập môn Git",
    description: "Làm chủ nhánh, merge và rebase qua các bài tập ngắn.",
    coverImageUrl: "https://placehold.co/640x360",
    originalPrice: null,
    originalPriceUsd: null,
    pricingPhases: [],
    currentPhase: undefined,
    valuePropositions: [],
    enrollmentCount: 0,
    isEnrolled: false,
}

/**
 * The catalog's featured course card — covers both layouts (`grid` roomy, `line`
 * compact row) across the states that actually change its shape: cover missing,
 * enrolled vs not, price loading/discounted/absent. `coverFailed` (broken `<img>`)
 * is internal state the block manages itself, not a prop — not shown here.
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="Lưới — mặc định, có giá loyalty"
                hint="Layout grid mặc định cho lưới catalog. loyaltyPriceVnd/loyaltyOriginalVnd được truyền nên card ưu tiên giá cá nhân hoá (đã trừ loyalty) thay vì giá theo phase; action là slot do feature sở hữu (ví dụ nút Thêm vào giỏ)."
            >
                <div className="w-80">
                    <CourseCard
                        course={discountedCourse}
                        loyaltyPriceVnd={1341000}
                        loyaltyOriginalVnd={2990000}
                        action={<Button variant="secondary" className="flex-1">Thêm vào giỏ</Button>}
                    />
                </div>
            </Variant>
            <Variant
                label="Lưới — đã đăng ký"
                hint="isEnrolled truyền qua course.isEnrolled: CTA chính đổi thành Tiếp tục học và trỏ vào trang học, action bị thay bằng nút phụ Xem khóa học (trỏ trang marketing) — không còn Thêm vào giỏ vì học viên đã sở hữu."
            >
                <div className="w-80">
                    <CourseCard
                        course={enrolledCourse}
                        loyaltyPriceVnd={1341000}
                        loyaltyOriginalVnd={2990000}
                    />
                </div>
            </Variant>
            <Variant
                label="Lưới — chưa có ảnh cover"
                hint="coverImageUrl là null (hoặc ảnh lỗi onError): card rơi về khối gradient nhánh accent kèm icon sách và tên khóa học, thay vì để trống ô ảnh."
            >
                <div className="w-80">
                    <CourseCard course={noCoverCourse} />
                </div>
            </Variant>
            <Variant
                label="Lưới — giá cá nhân hoá đang tải"
                hint="loyaltyPending truyền true khi viewer đã đăng nhập và app đang chờ coursePricePreview trả về — dòng giá hiện skeleton thay vì chớp giá theo phase rồi nhảy sang giá loyalty."
            >
                <div className="w-80">
                    <CourseCard course={discountedCourse} loyaltyPending />
                </div>
            </Variant>
            <Variant
                label="Lưới — khóa miễn phí, chưa ai học"
                hint="Không có pricingPhases/originalPrice và không truyền loyaltyPriceVnd → dòng giá để trống thay vì hiện 0₫; enrollmentCount = 0 nên chip số học viên cũng ẩn; không có valuePropositions nên danh sách gạch đầu dòng không render."
            >
                <div className="w-80">
                    <CourseCard course={freeCourse} />
                </div>
            </Variant>
            <Variant
                label="Hàng ngang (line) — mặc định"
                hint={"layout=\"line\" cho chế độ xem danh sách của catalog: ảnh thu nhỏ + tiêu đề bên trái, giá + CTA gọn bên phải trên một dòng — dùng khi người dùng bật list-view thay vì grid-view."}
            >
                <div className="w-full max-w-2xl">
                    <CourseCard
                        course={discountedCourse}
                        layout="line"
                        loyaltyPriceVnd={1341000}
                        loyaltyOriginalVnd={2990000}
                        action={<Button variant="secondary" className="flex-1">Thêm vào giỏ</Button>}
                    />
                </div>
            </Variant>
            <Variant
                label="Hàng ngang (line) — đã đăng ký"
                hint={"Cùng layout=\"line\" nhưng isEnrolled true: CTA chính là Tiếp tục học, nút phụ Xem khóa học thay cho action — đúng công thức 2 nút như bản grid, chỉ đổi hình hài sang một dòng."}
            >
                <div className="w-full max-w-2xl">
                    <CourseCard course={enrolledCourse} layout="line" />
                </div>
            </Variant>
        </Gallery>
    ),
}
