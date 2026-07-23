import type { Meta, StoryObj } from "@storybook/nextjs"
import React, { useState } from "react"
import { QuizCard } from "./QuizCard"
import { blockShell } from "../../../block-anatomy"

const meta: Meta<typeof QuizCard> = {
    title: "Design/Learn/QuizCard",
    component: QuizCard,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof QuizCard>

const ANATOMY = {
    primitives: [
        { name: "SectionCard", role: "khung surface tự đóng" },
        { name: "StatusChip", role: "nhãn \"Câu N\" (tone accent)" },
    ],
    reason:
        "Một câu trắc nghiệm cần MỘT surface tự đóng khung để tách khỏi câu khác (SectionCard) và một nhãn thứ tự câu (StatusChip). Gói prompt + option rows + submit + giải thích + trạng thái đúng/sai vào một block, để feature chỉ truyền dữ liệu — không phải tự dựng lại khung, nhãn, và logic reveal đáp án ở mỗi màn.",
}

const OPTIONS = [
    { id: "a", label: "200 OK" },
    { id: "b", label: "404 Not Found", isCorrect: true },
    { id: "c", label: "500 Internal Server Error" },
]

const SingleDemo = () => {
    const [ids, setIds] = useState<string[]>([])
    return (
        <QuizCard
            questionIndex={1}
            question="HTTP status nào báo tài nguyên không tồn tại?"
            options={OPTIONS}
            selectionMode="single"
            selectedIds={ids}
            onSelectionChange={setIds}
            onSubmit={() => {}}
        />
    )
}

const MultipleDemo = () => {
    const [ids, setIds] = useState<string[]>(["b"])
    return (
        <QuizCard
            questionIndex={2}
            question="Những verb nào là idempotent? (chọn nhiều)"
            options={[
                { id: "get", label: "GET", isCorrect: true },
                { id: "post", label: "POST" },
                { id: "put", label: "PUT", isCorrect: true },
                { id: "delete", label: "DELETE", isCorrect: true },
            ]}
            selectionMode="multiple"
            selectedIds={ids}
            onSelectionChange={setIds}
            onSubmit={() => {}}
        />
    )
}

export const SingleChoice: Story = {
    render: () => blockShell(<SingleDemo />, ANATOMY),
}

export const MultipleChoice: Story = {
    render: () => blockShell(<MultipleDemo />, ANATOMY),
}

export const SubmittedCorrect: Story = {
    render: () =>
        blockShell(
            <QuizCard
                questionIndex={1}
                question="HTTP status nào báo tài nguyên không tồn tại?"
                options={OPTIONS}
                selectionMode="single"
                selectedIds={["b"]}
                onSelectionChange={() => {}}
                isSubmitted
                explanation="404 Not Found: server hiểu request nhưng không có tài nguyên khớp URI."
            />,
            ANATOMY,
        ),
}

export const SubmittedIncorrect: Story = {
    render: () =>
        blockShell(
            <QuizCard
                questionIndex={1}
                question="HTTP status nào báo tài nguyên không tồn tại?"
                options={OPTIONS}
                selectionMode="single"
                selectedIds={["a"]}
                onSelectionChange={() => {}}
                isSubmitted
                explanation="200 OK báo thành công — không phải lỗi thiếu tài nguyên. Đáp án đúng là 404."
            />,
            ANATOMY,
        ),
}

/** Multiple-choice, submitted: every row reveals its own correct/incorrect/missed state at
 *  once (independent per option, unlike single-choice's one right answer). */
export const MultipleSubmitted: Story = {
    render: () =>
        blockShell(
            <QuizCard
                questionIndex={2}
                question="Những verb nào là idempotent? (chọn nhiều)"
                options={[
                    { id: "get", label: "GET", isCorrect: true },
                    { id: "post", label: "POST" },
                    { id: "put", label: "PUT", isCorrect: true },
                    { id: "delete", label: "DELETE", isCorrect: true },
                ]}
                selectionMode="multiple"
                selectedIds={["get", "post"]}
                onSelectionChange={() => {}}
                isSubmitted
                explanation="GET, PUT, DELETE đều idempotent (gọi lặp lại cho cùng kết quả). POST thì không."
            />,
            ANATOMY,
        ),
}

/** No `questionIndex`: the "Câu N" chip is omitted entirely (the chip only renders
 *  when `questionIndex` is a number). */
export const NoQuestionIndex: Story = {
    render: () => {
        const Demo = () => {
            const [ids, setIds] = useState<string[]>([])
            return (
                <QuizCard
                    question="HTTP status nào báo tài nguyên không tồn tại?"
                    options={OPTIONS}
                    selectionMode="single"
                    selectedIds={ids}
                    onSelectionChange={setIds}
                    onSubmit={() => {}}
                />
            )
        }
        return blockShell(<Demo />, ANATOMY)
    },
}

/** Submitted without an `explanation` — the explanation block is optional and simply
 *  omitted once there's nothing to show. */
export const SubmittedNoExplanation: Story = {
    render: () =>
        blockShell(
            <QuizCard
                questionIndex={1}
                question="HTTP status nào báo tài nguyên không tồn tại?"
                options={OPTIONS}
                selectionMode="single"
                selectedIds={["b"]}
                onSelectionChange={() => {}}
                isSubmitted
            />,
            ANATOMY,
        ),
}

/** No `onSubmit` handler: a static, read-only preview — the submit action never
 *  renders (`onSubmit && !isSubmitted`), matching the documented "read-only preview" use case. */
export const ReadOnlyNoAction: Story = {
    render: () =>
        blockShell(
            <QuizCard
                questionIndex={1}
                question="HTTP status nào báo tài nguyên không tồn tại?"
                options={OPTIONS}
                selectionMode="single"
                selectedIds={["b"]}
                onSelectionChange={() => {}}
            />,
            ANATOMY,
        ),
}
