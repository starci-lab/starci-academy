import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button } from "@heroui/react"
import { CourseCard } from "./CourseCard"
import { blockShell } from "../../../block-anatomy"
import { ANATOMY, discountedCourse, enrolledCourse, freeCourse, noCoverCourse } from "./CourseCard.mocks"

const meta: Meta<typeof CourseCard> = {
    title: "Design/Cards/CourseCard/Line",
    component: CourseCard,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof CourseCard>

/** Default (discounted) — horizontal row layout: cover · title+meta · price+CTA. */
export const Default: Story = {
    name: "Default",
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

/** Enrolled — line layout, no cart action. */
export const Enrolled: Story = {
    name: "Enrolled",
    render: () =>
        blockShell(
            <div className="w-full max-w-2xl">
                <CourseCard course={enrolledCourse} layout="line" />
            </div>,
            ANATOMY,
        ),
}

/** No cover — hàng ngang, thumbnail rơi về fallback gradient + BookOpenIcon (ẩn dưới @app-sm). */
export const NoCover: Story = {
    name: "No Cover",
    render: () =>
        blockShell(
            <div className="w-full max-w-2xl">
                <CourseCard course={noCoverCourse} layout="line" />
            </div>,
            ANATOMY,
        ),
}

/** Loading — loyalty price đang resolve → dòng giá là Skeleton (chỉ dòng giá, không mirror cả hàng). */
export const Loading: Story = {
    name: "Đang tải",
    render: () =>
        blockShell(
            <div className="w-full max-w-2xl">
                <CourseCard course={discountedCourse} layout="line" loyaltyPending />
            </div>,
            ANATOMY,
        ),
}

/** Free — hàng ngang không giá / không số học viên (enrollmentCount=0 ẩn meta). */
export const Free: Story = {
    name: "Free",
    render: () =>
        blockShell(
            <div className="w-full max-w-2xl">
                <CourseCard course={freeCourse} layout="line" />
            </div>,
            ANATOMY,
        ),
}

/** Khung chờ — mirror hàng ngang khi card thật đang tải (isSkeleton), `course` bị bỏ qua. */
export const Skeleton: Story = {
    name: "Khung chờ",
    render: () =>
        blockShell(
            <div className="w-full max-w-2xl">
                <CourseCard course={discountedCourse} layout="line" isSkeleton />
            </div>,
            ANATOMY,
        ),
}
