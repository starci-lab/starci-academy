import type { Meta, StoryObj } from "@storybook/nextjs"
import React, { useState } from "react"
import { QuizCard } from "./QuizCard"
import { blockShell } from "../../../block-anatomy"

const meta: Meta<typeof QuizCard> = {
    title: "Block/Learn/QuizCard",
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
        { name: "StatusChip", role: 'nhãn "Câu N" (tone accent)' },
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
