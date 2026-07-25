import type { Meta, StoryObj } from "@storybook/nextjs"
import { TaskChecklistRow } from "@sb-components/blocks/learn/TaskChecklistRow/TaskChecklistRow"
import { BlockAnatomy, type AnatomyNode } from "@sb-components/blocks/layout/BlockAnatomy/BlockAnatomy"

/**
 * DESIGN — a generic checklist row: a `CheckCircleIcon`/`CircleIcon` beside a
 * truncated title, generalised from the capstone milestone roadmap's hand-rolled
 * task rows.
 *
 * ANATOMY IS PER-LEAF: each story below is its OWN leaf and carries its OWN
 * BlockAnatomy axis reflecting the parts THAT leaf composes.
 */
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

const ICON: AnatomyNode = { name: "Icon", tier: "primitive", role: "CheckCircleIcon (done) hoặc CircleIcon (chưa xong)" }
const TITLE: AnatomyNode = { name: "Typography", tier: "primitive", role: "tiêu đề task, truncate 1 dòng, tint success khi done" }
const PARTS: Array<AnatomyNode> = [ICON, TITLE]

/** Not done: a `CircleIcon` beside a muted-tone title. */
export const Default: Story = {
    render: () => (
        <div className="max-w-sm p-8">
            <BlockAnatomy name="TaskChecklistRow" tier="design" leaf="Default" parts={PARTS} reason="Hàng checklist tối giản: icon trạng thái (CheckCircle/Circle) + tiêu đề — hai phần trực tiếp cố định.">
                <TaskChecklistRow showAnatomy label="Thiết lập Docker Compose cho staging" done={false} />
            </BlockAnatomy>
        </div>
    ),
}

/** Done: a `CheckCircleIcon` beside a success-tinted title. */
export const Done: Story = {
    render: () => (
        <div className="max-w-sm p-8">
            <BlockAnatomy name="TaskChecklistRow" tier="design" leaf="Done" parts={PARTS} note="`done` đổi Icon sang CheckCircleIcon + tint success trên Typography — cùng 2 node.">
                <TaskChecklistRow showAnatomy label="Viết Dockerfile multi-stage" done />
            </BlockAnatomy>
        </div>
    ),
}

/** Long title truncates to one line instead of wrapping/overflowing. */
export const LongTitleTruncates: Story = {
    render: () => (
        <div className="max-w-sm p-8">
            <BlockAnatomy name="TaskChecklistRow" tier="design" leaf="LongTitleTruncates" parts={PARTS} note="Title dài → truncate 1 dòng (Typography), không đổi composition.">
                <TaskChecklistRow
                    showAnatomy
                    label="Cấu hình CI/CD pipeline chạy lint, test, build và deploy tự động lên staging mỗi khi merge vào nhánh main"
                    done={false}
                />
            </BlockAnatomy>
        </div>
    ),
}

/** Interactive: `onClick` renders the row as a pressable button (hover/focus ring). */
export const Interactive: Story = {
    render: () => (
        <div className="max-w-sm p-8">
            <BlockAnatomy name="TaskChecklistRow" tier="design" leaf="Interactive" parts={PARTS} note="`onClick` đổi root sang `<button>` (hover/focus ring) — Icon+Typography bên trong không đổi.">
                <TaskChecklistRow showAnatomy label="Deploy container lên VPS" done={false} onClick={() => {}} />
            </BlockAnatomy>
        </div>
    ),
}

/** Loading: `isSkeleton` mirrors the icon dot + title bar. */
export const Loading: Story = {
    render: () => (
        <div className="max-w-sm p-8">
            <BlockAnatomy
                name="TaskChecklistRow"
                tier="design"
                leaf="Loading"
                parts={[
                    { name: "Skeleton.Icon", tier: "design", role: "chấm tròn skeleton thay Icon" },
                    { name: "Skeleton.Typography", tier: "design", role: "thanh bar skeleton thay title (1/2 chiều rộng)" },
                ]}
                note="`isSkeleton` thay cả Icon lẫn Typography bằng skeleton mirror, giữ nguyên gap-3/py-2."
            >
                <TaskChecklistRow showAnatomy label="Deploy container lên VPS" done={false} isSkeleton />
            </BlockAnatomy>
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
