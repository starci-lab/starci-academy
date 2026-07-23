import type { Meta, StoryObj } from "@storybook/nextjs"
import { TaskChecklistRow } from "./TaskChecklistRow"

const meta: Meta<typeof TaskChecklistRow> = {
    title: "Design/Learn/TaskChecklistRow",
    component: TaskChecklistRow,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof TaskChecklistRow>

/** Not done: a `CircleIcon` beside a muted-tone title. */
export const Default: Story = {
    render: () => (
        <div className="max-w-sm p-8">
            <TaskChecklistRow label="Thiết lập Docker Compose cho staging" done={false} />
        </div>
    ),
}

/** Done: a `CheckCircleIcon` beside a success-tinted title. */
export const Done: Story = {
    render: () => (
        <div className="max-w-sm p-8">
            <TaskChecklistRow label="Viết Dockerfile multi-stage" done />
        </div>
    ),
}

/** Long title truncates to one line instead of wrapping/overflowing. */
export const LongTitleTruncates: Story = {
    render: () => (
        <div className="max-w-sm p-8">
            <TaskChecklistRow
                label="Cấu hình CI/CD pipeline chạy lint, test, build và deploy tự động lên staging mỗi khi merge vào nhánh main"
                done={false}
            />
        </div>
    ),
}

/** Interactive: `onClick` renders the row as a pressable button (hover/focus ring). */
export const Interactive: Story = {
    render: () => (
        <div className="max-w-sm p-8">
            <TaskChecklistRow label="Deploy container lên VPS" done={false} onClick={() => {}} />
        </div>
    ),
}

/** Loading: `isSkeleton` mirrors the icon dot + title bar. */
export const Loading: Story = {
    render: () => (
        <div className="max-w-sm p-8">
            <TaskChecklistRow label="Deploy container lên VPS" done={false} isSkeleton />
        </div>
    ),
}

/**
 * Checklist: a stack of rows as used in the milestone roadmap — dividers
 * between rows (the caller's job, not this row's), done/not-done mixed.
 */
export const Checklist: Story = {
    render: () => (
        <div className="max-w-sm p-8">
            <div className="flex flex-col gap-0">
                {[
                    { label: "Viết Dockerfile multi-stage", done: true },
                    { label: "Thiết lập Docker Compose cho staging", done: true },
                    { label: "Cấu hình CI/CD pipeline", done: false },
                    { label: "Deploy container lên VPS", done: false },
                ].map((task, index, all) => (
                    <div
                        key={task.label}
                        className={index < all.length - 1 ? "border-b border-default" : undefined}
                    >
                        <TaskChecklistRow label={task.label} done={task.done} />
                    </div>
                ))}
            </div>
        </div>
    ),
}
