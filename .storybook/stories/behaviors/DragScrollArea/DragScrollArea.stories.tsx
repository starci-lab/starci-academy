import type { Meta, StoryObj } from "@storybook/nextjs"
import { Typography } from "@heroui/react"
import { DragScrollArea } from "@sb-components/behaviors/DragScrollArea/DragScrollArea"

/**
 * `DragScrollArea` — a vertical scroll region with a hidden scrollbar plus
 * Framer-Motion pointer pan (drag → `scrollTop`), so a hidden-bar region is
 * still scrollable on Windows. One region → plain `children`, no named slots.
 */
const meta: Meta<typeof DragScrollArea> = {
    title: "Behaviors/DragScrollArea/DragScrollArea",
    component: DragScrollArea,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof DragScrollArea>

const shortLessons = [
    "Session 1: Introduction to NestJS",
    "Session 2: Modules & Providers",
    "Session 3: Dependency Injection",
]

const longLessons = [
    "Session 1: Introduction to NestJS",
    "Session 2: Modules & Providers",
    "Session 3: Dependency Injection",
    "Session 4: Controllers & Routing",
    "Session 5: Pipes & Validation",
    "Session 6: Guards & Interceptors",
    "Session 7: TypeORM basics",
    "Session 8: Table relations & migrations",
    "Session 9: GraphQL resolvers",
    "Session 10: Keycloak authentication",
    "Session 11: Kafka & Debezium CDC",
    "Session 12: Deploying to a VPS",
]

/**
 * Props for the `LessonList` demo helper.
 */
interface LessonListProps {
    /** lesson titles rendered as rows */
    lessons: Array<string>
}

// TODO: swap for SurfaceCardList local when ported — a faithful joined list.
const LessonList = ({ lessons }: LessonListProps) => (
    <div data-tier="fixture" className="rounded-3xl bg-surface shadow-surface">
        {lessons.map((lesson, index) => (
            <div data-tier="fixture"
                key={lesson}
                className="flex flex-col gap-1 border-b border-separator px-4 py-3 last:border-b-0"
            >
                <Typography type="body-sm">{lesson}</Typography>
                <Typography type="body-xs" color="muted">{`Lecture #${index + 1}`}</Typography>
            </div>
        ))}
    </div>
)

/** Overflowing content, scrollbar hidden (default): 12 lessons taller than `max-h-64` — drag or wheel; edges fade. */
export const OverflowHiddenScrollbar: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <DragScrollArea className="max-h-64">
                <LessonList lessons={longLessons} />
            </DragScrollArea>
        </div>
    ),
}

/** Short content, no overflow: 3 lessons fit the frame → no fade (ScrollShadow self-disables when content fits). */
export const ShortNoOverflow: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <DragScrollArea className="max-h-64">
                <LessonList lessons={shortLessons} />
            </DragScrollArea>
        </div>
    ),
}

/** `hideScrollBar={false}` keeps the native scrollbar as a visual marker of how much content remains. */
export const NativeScrollbarShown: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <DragScrollArea className="max-h-64" hideScrollBar={false}>
                <LessonList lessons={longLessons} />
            </DragScrollArea>
        </div>
    ),
}

/** `size={80}` widens the edge fade beyond the 40px default — a stronger overflow cue on a tall scroller. */
export const CustomFadeSize: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <DragScrollArea className="max-h-64" size={80}>
                <LessonList lessons={longLessons} />
            </DragScrollArea>
        </div>
    ),
}
