import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button } from "@heroui/react"
import { CourseCard } from "./CourseCard"
import { blockShell } from "../../../block-anatomy"
import { ANATOMY, discountedCourse, enrolledCourse } from "./CourseCard.mocks"

const meta: Meta<typeof CourseCard> = {
    title: "Block/Cards/CourseCard/Line",
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
