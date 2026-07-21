import type { Meta, StoryObj } from "@storybook/nextjs"
import { Typography } from "@heroui/react"
import { DragScrollArea } from "./DragScrollArea"

const meta: Meta<typeof DragScrollArea> = {
    title: "Primitives/Layout/DragScrollArea",
    component: DragScrollArea,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof DragScrollArea>

const shortLessons = [
    "Buổi 1: Giới thiệu NestJS",
    "Buổi 2: Modules & Providers",
    "Buổi 3: Dependency Injection",
]

const longLessons = [
    "Buổi 1: Giới thiệu NestJS",
    "Buổi 2: Modules & Providers",
    "Buổi 3: Dependency Injection",
    "Buổi 4: Controllers & Routing",
    "Buổi 5: Pipes & Validation",
    "Buổi 6: Guards & Interceptors",
    "Buổi 7: TypeORM cơ bản",
    "Buổi 8: Quan hệ bảng & Migration",
    "Buổi 9: GraphQL Resolver",
    "Buổi 10: Xác thực Keycloak",
    "Buổi 11: Kafka & Debezium CDC",
    "Buổi 12: Triển khai lên VPS",
]

// TODO: swap for SurfaceListCard local when ported — a faithful joined list.
const LessonList = ({ lessons }: { lessons: Array<string> }) => (
    <div className="rounded-3xl bg-surface shadow-surface">
        {lessons.map((lesson, index) => (
            <div
                key={lesson}
                className="flex flex-col gap-1 border-b border-separator px-4 py-3 last:border-b-0"
            >
                <Typography type="body-sm">{lesson}</Typography>
                <Typography type="body-xs" color="muted">{`Bài giảng #${index + 1}`}</Typography>
            </div>
        ))}
    </div>
)

/** Overflowing content, scrollbar hidden (default): 12 lessons taller than `max-h-64` — drag or wheel; edges fade. */
export const OverflowHiddenScrollbar: Story = {
    render: () => (
        <div className="p-8">
            <DragScrollArea className="max-h-64">
                <LessonList lessons={longLessons} />
            </DragScrollArea>
        </div>
    ),
}

/** Short content, no overflow: 3 lessons fit the frame → no fade (ScrollShadow self-disables when content fits). */
export const ShortNoOverflow: Story = {
    render: () => (
        <div className="p-8">
            <DragScrollArea className="max-h-64">
                <LessonList lessons={shortLessons} />
            </DragScrollArea>
        </div>
    ),
}

/** `hideScrollBar={false}` keeps the native scrollbar as a visual marker of how much content remains. */
export const NativeScrollbarShown: Story = {
    render: () => (
        <div className="p-8">
            <DragScrollArea className="max-h-64" hideScrollBar={false}>
                <LessonList lessons={longLessons} />
            </DragScrollArea>
        </div>
    ),
}

/** `size={80}` widens the edge fade beyond the 40px default — a stronger overflow cue on a tall scroller. */
export const CustomFadeSize: Story = {
    render: () => (
        <div className="p-8">
            <DragScrollArea className="max-h-64" size={80}>
                <LessonList lessons={longLessons} />
            </DragScrollArea>
        </div>
    ),
}
