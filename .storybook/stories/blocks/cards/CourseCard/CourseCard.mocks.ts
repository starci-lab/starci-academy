import type { CourseCardCourse } from "./CourseCard"

/**
 * Shared fixtures for the CourseCard story KINDS (Grid / Line) — one source so both
 * nested-folder story files stay in sync (nested-folder convention, thầy 2026-07-22).
 */

// Anatomy = KIỂM KÊ ĐẦY ĐỦ (U1): mọi part block dựng nên, tag tier (block/primitive),
// part chỉ-1-state gắn `state`. Block cấu tạo từ block CON + primitive.
export const ANATOMY = {
    primitives: [
        { name: "CrossListCard", tier: "block" as const, role: "value-props (bordered, mark=check, tone=muted) — tick CHÌM để chữ dẫn (§2)" },
        { name: "PriceTag", tier: "block" as const, role: "giá: số giảm + gốc gạch ngang + chip −% (popover breakdown) + dòng tiết kiệm. ⚠ đang inline" },
        { name: "Cover (img / gradient)", tier: "primitive" as const, role: "ảnh bìa 16:9 rounded-2xl; thiếu → gradient + BookOpenIcon" },
        { name: "Button ×2", tier: "primitive" as const, role: "CTA: Xem khóa học (primary) + Thêm vào giỏ (secondary action)" },
        { name: "Typography", tier: "primitive" as const, role: "tiêu đề (bold) + mô tả (muted line-clamp)" },
        { name: "Typography muted + UsersIcon", tier: "primitive" as const, role: "số học viên — meta-count text muted (KHÔNG bọc Chip)" },
        { name: "Skeleton", tier: "primitive" as const, state: "Đang tải", role: "dòng giá khi loyalty preview đang tải (loyaltyPending)" },
    ],
    reason:
        "Một ô khóa học trong catalog gom BLOCK con (CrossListCard value-props · PriceTag giá) + PRIMITIVE (cover · 2 Button CTA · Typography tiêu đề/mô tả · Typography+UsersIcon số học viên; Skeleton chỉ khi đang tải giá). Đóng gói 2 layout grid/line, 2 nút khi đã đăng ký, để feature chỉ truyền `course`.",
}

// storybook renders inside a CSP-restricted canvas — cover is a data-URI SVG (no external host).
export const COVER =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
        "<svg xmlns='http://www.w3.org/2000/svg' width='640' height='360'>" +
            "<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>" +
            "<stop offset='0' stop-color='#6366f1'/><stop offset='1' stop-color='#8b5cf6'/>" +
            "</linearGradient></defs><rect width='640' height='360' fill='url(#g)'/>" +
            "<text x='50%' y='50%' fill='white' font-family='sans-serif' font-size='30'" +
            " text-anchor='middle' dominant-baseline='middle'>Course cover</text></svg>",
    )

/** Fields every mock course shares — spread and override per specimen. */
const baseCourse = {
    displayId: "fullstack-mastery",
    description: "Xây nền tảng vững từ frontend đến backend qua các dự án thực chiến, được AI chấm điểm.",
    coverImageUrl: COVER,
    originalPrice: 2990000,
    originalPriceUsd: 129,
    enrollmentCount: 482,
    valuePropositions: [
        { text: "Xây 3 dự án thực chiến từ đầu đến khi triển khai" },
        { text: "Chấm bài bằng AI theo checklist tuyển dụng thật" },
        { text: "Mock interview không giới hạn số lần" },
    ],
    pricingPhases: [
        { phase: "pioneer", price: 1490000, priceUsd: 59 },
        { phase: "early-bird", price: 2190000, priceUsd: 89 },
        { phase: "regular", price: 2990000, priceUsd: 129 },
    ],
    currentPhase: "pioneer",
} satisfies Partial<CourseCardCourse>

export const discountedCourse: CourseCardCourse = {
    ...baseCourse,
    title: "Fullstack Mastery",
    isEnrolled: false,
}

// Enrolled = ĐÚNG course discounted, chỉ bật `isEnrolled` (nội suy từ gốc — cô lập trạng thái đã đăng ký).
export const enrolledCourse: CourseCardCourse = {
    ...discountedCourse,
    isEnrolled: true,
}

// No cover = ĐÚNG course discounted, bỏ ảnh → fallback gradient (delta = coverImageUrl null).
export const noCoverCourse: CourseCardCourse = {
    ...discountedCourse,
    coverImageUrl: null,
}

// Free = kịch bản KHÁC HẲN (không giá / value-props) → để riêng, KHÔNG ép derive.
export const freeCourse: CourseCardCourse = {
    ...baseCourse,
    displayId: "git-nhap-mon",
    title: "Nhập môn Git",
    description: "Làm chủ nhánh, merge và rebase qua các bài tập ngắn.",
    originalPrice: null,
    originalPriceUsd: null,
    pricingPhases: [],
    currentPhase: undefined,
    valuePropositions: [],
    enrollmentCount: 0,
    isEnrolled: false,
}
