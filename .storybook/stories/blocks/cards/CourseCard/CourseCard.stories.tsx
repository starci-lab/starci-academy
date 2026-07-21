import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button } from "@heroui/react"
import { CourseCard } from "./CourseCard"
import type { CourseCardCourse } from "./CourseCard"
import { blockShell } from "../../../block-anatomy"

const meta: Meta<typeof CourseCard> = {
    title: "Block/Cards/CourseCard",
    component: CourseCard,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof CourseCard>

const ANATOMY = {
    primitives: [
        { name: "CrossListCard", role: "value-props (bordered, mark=check ✓) — KHÔNG vẽ tay CheckCircleIcon; framed surface-in-surface" },
        { name: "PriceTag", role: "dòng giá: số đã giảm + gốc gạch ngang + chip −% (popover). ⚠ đang inline — PriceTag local thiếu dòng USD-hint" },
        { name: "Skeleton", role: "dòng giá khi loyalty preview đang tải (loyaltyPending)" },
        { name: "Typography muted + UsersIcon", role: "số học viên — meta-count render text muted (không bọc Chip: lạm dụng chip)" },
    ],
    reason:
        "Một ô khóa học trong catalog cần: value-props check-list (CrossListCard bordered, compose primitive thay vì vẽ tay ✓), ĐÚNG một cách render giá (PriceTag — logic giảm giá không lệch), placeholder giá khi cá-nhân-hoá đang tải (Skeleton), và số học viên (text muted — meta count, không lạm dụng Chip). Gói cover + tiêu đề + value-props + giá + CTA (2 layout grid/line, 2 nút khi đã đăng ký) vào một block để feature chỉ truyền `course`.",
}

// storybook renders inside a CSP-restricted canvas — cover is a data-URI SVG (no external host).
const COVER =
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

const discountedCourse: CourseCardCourse = {
    ...baseCourse,
    title: "Fullstack Mastery",
    isEnrolled: false,
}

const enrolledCourse: CourseCardCourse = {
    ...baseCourse,
    displayId: "system-design-mastery",
    title: "System Design Mastery",
    isEnrolled: true,
}

const noCoverCourse: CourseCardCourse = {
    ...baseCourse,
    displayId: "devops-mastery",
    title: "DevOps Mastery",
    coverImageUrl: null,
    isEnrolled: false,
}

const freeCourse: CourseCardCourse = {
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

export const GridDiscounted: Story = {
    render: () =>
        blockShell(
            <div className="w-80">
                <CourseCard
                    course={discountedCourse}
                    loyaltyPriceVnd={1341000}
                    loyaltyOriginalVnd={2990000}
                    action={<Button variant="secondary" className="flex-1">Thêm vào giỏ</Button>}
                />
            </div>,
            ANATOMY,
        ),
}

export const GridEnrolled: Story = {
    render: () =>
        blockShell(
            <div className="w-80">
                <CourseCard
                    course={enrolledCourse}
                    loyaltyPriceVnd={1341000}
                    loyaltyOriginalVnd={2990000}
                />
            </div>,
            ANATOMY,
        ),
}

export const GridNoCover: Story = {
    render: () =>
        blockShell(
            <div className="w-80">
                <CourseCard course={noCoverCourse} />
            </div>,
            ANATOMY,
        ),
}

export const GridLoyaltyPending: Story = {
    render: () =>
        blockShell(
            <div className="w-80">
                <CourseCard course={discountedCourse} loyaltyPending />
            </div>,
            ANATOMY,
        ),
}

export const GridFree: Story = {
    render: () =>
        blockShell(
            <div className="w-80">
                <CourseCard course={freeCourse} />
            </div>,
            ANATOMY,
        ),
}

export const LineDefault: Story = {
    render: () =>
        blockShell(
            <div className="w-full max-w-2xl">
                <CourseCard
                    course={discountedCourse}
                    layout="line"
                    loyaltyPriceVnd={1341000}
                    loyaltyOriginalVnd={2990000}
                    action={<Button variant="secondary" className="flex-1">Thêm vào giỏ</Button>}
                />
            </div>,
            ANATOMY,
        ),
}

export const LineEnrolled: Story = {
    render: () =>
        blockShell(
            <div className="w-full max-w-2xl">
                <CourseCard course={enrolledCourse} layout="line" />
            </div>,
            ANATOMY,
        ),
}
