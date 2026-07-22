import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button } from "@heroui/react"
import { CourseCard } from "./CourseCard"
import { blockShell } from "../../../block-anatomy"
import { ANATOMY, discountedCourse, enrolledCourse, noCoverCourse, freeCourse } from "./CourseCard.mocks"

const meta: Meta<typeof CourseCard> = {
    title: "Block/Cards/CourseCard/Grid",
    component: CourseCard,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof CourseCard>

/** Discounted (loyalty price) — primary "Xem khóa học" + secondary "Thêm vào giỏ". */
export const Discounted: Story = {
    name: "Discounted",
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

/** Enrolled — no cart action, viewer already owns the course. */
export const Enrolled: Story = {
    name: "Enrolled",
    render: () =>
        blockShell(
            <div className="w-80">
                <CourseCard course={enrolledCourse} loyaltyPriceVnd={1341000} loyaltyOriginalVnd={2990000} />
            </div>,
            ANATOMY,
        ),
}

/** No cover image → branded gradient fallback. */
export const NoCover: Story = {
    name: "No Cover",
    render: () =>
        blockShell(
            <div className="w-80">
                <CourseCard course={noCoverCourse} />
            </div>,
            ANATOMY,
        ),
}

/** Loading — loyalty price still resolving → the price line is a Skeleton. */
export const Loading: Story = {
    name: "Đang tải",
    render: () =>
        blockShell(
            <div className="w-80">
                <CourseCard course={discountedCourse} loyaltyPending />
            </div>,
            ANATOMY,
        ),
}

/** Free — no price / value-props / enrollment count. */
export const Free: Story = {
    name: "Free",
    render: () =>
        blockShell(
            <div className="w-80">
                <CourseCard course={freeCourse} />
            </div>,
            ANATOMY,
        ),
}
