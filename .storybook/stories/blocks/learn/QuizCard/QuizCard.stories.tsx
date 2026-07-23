import type { Meta, StoryObj } from "@storybook/nextjs"
import React, { useState } from "react"
import { QuizCard } from "./QuizCard"
import { BlockAnatomy, type AnatomyNode } from "../../layout/BlockAnatomy/BlockAnatomy"

/**
 * DESIGN — a self-framed single multiple-choice question. Composed from local
 * primitives (SectionCard frame + StatusChip "Câu N" marker + Radio/Checkbox
 * group + submit Button + optional explanation surface).
 *
 * ANATOMY IS PER-LEAF: each story below is its OWN leaf and carries its OWN
 * BlockAnatomy axis (Sơ đồ + Cây) reflecting the parts THAT leaf composes —
 * there is no separate consolidated "Anatomy" story. This block does not emit
 * anchors, so `Sơ đồ` is a clean render + numbered legend decoded by order.
 */
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

/** Frame each leaf's anatomy panel with breathing room. */
const frame = (node: React.ReactNode) => <div className="mx-auto max-w-4xl p-8">{node}</div>

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

// SINGLE, before submit: chip + question + radio options + submit CTA (answer key hidden).
const SINGLE_ASK_PARTS: Array<AnatomyNode> = [
    { name: "SectionCard", tier: "primitive", role: "khung surface tự đóng bao cả câu hỏi" },
    { name: "StatusChip", tier: "primitive", role: 'nhãn "Câu N"', state: "accent" },
    { name: "Typography", tier: "primitive", role: "câu hỏi (body semibold)" },
    { name: "RadioGroup", tier: "primitive", role: "phương án chọn-một; chỉ default/selected trước khi nộp" },
    { name: "Button", tier: "primitive", role: 'CTA "Kiểm tra đáp án" — chỉ trước khi nộp' },
]

// MULTIPLE, before submit: same chrome nhưng CheckboxGroup thay RadioGroup.
const MULTIPLE_ASK_PARTS: Array<AnatomyNode> = [
    { name: "SectionCard", tier: "primitive", role: "khung surface tự đóng bao cả câu hỏi" },
    { name: "StatusChip", tier: "primitive", role: 'nhãn "Câu N"', state: "accent" },
    { name: "Typography", tier: "primitive", role: "câu hỏi (body semibold)" },
    { name: "CheckboxGroup", tier: "primitive", role: "phương án chọn-nhiều; chỉ default/selected trước khi nộp" },
    { name: "Button", tier: "primitive", role: 'CTA "Kiểm tra đáp án" — chỉ trước khi nộp' },
]

// SINGLE, submitted + explanation: options reveal đúng/sai, nút nộp biến mất, thêm khối giải thích.
const SINGLE_SUBMITTED_PARTS: Array<AnatomyNode> = [
    { name: "SectionCard", tier: "primitive", role: "khung surface tự đóng bao cả câu hỏi" },
    { name: "StatusChip", tier: "primitive", role: 'nhãn "Câu N"', state: "accent" },
    { name: "Typography", tier: "primitive", role: "câu hỏi (body semibold)" },
    { name: "RadioGroup", tier: "primitive", role: "phương án chọn-một; lộ đúng/sai từng dòng sau khi nộp", state: "revealed" },
    { name: "Typography · giải thích", tier: "primitive", role: "khối giải thích muted (surface-secondary) — chỉ sau khi nộp" },
]

// MULTIPLE, submitted + explanation: mỗi dòng tự lộ đúng/sai/bỏ sót + khối giải thích.
const MULTIPLE_SUBMITTED_PARTS: Array<AnatomyNode> = [
    { name: "SectionCard", tier: "primitive", role: "khung surface tự đóng bao cả câu hỏi" },
    { name: "StatusChip", tier: "primitive", role: 'nhãn "Câu N"', state: "accent" },
    { name: "Typography", tier: "primitive", role: "câu hỏi (body semibold)" },
    { name: "CheckboxGroup", tier: "primitive", role: "phương án chọn-nhiều; mỗi dòng lộ đúng/sai/bỏ sót sau khi nộp", state: "revealed" },
    { name: "Typography · giải thích", tier: "primitive", role: "khối giải thích muted (surface-secondary) — chỉ sau khi nộp" },
]

// NO questionIndex: StatusChip "Câu N" biến mất hoàn toàn.
const NO_INDEX_PARTS: Array<AnatomyNode> = [
    { name: "SectionCard", tier: "primitive", role: "khung surface tự đóng bao cả câu hỏi" },
    { name: "Typography", tier: "primitive", role: "câu hỏi (body semibold)" },
    { name: "RadioGroup", tier: "primitive", role: "phương án chọn-một; chỉ default/selected trước khi nộp" },
    { name: "Button", tier: "primitive", role: 'CTA "Kiểm tra đáp án" — chỉ trước khi nộp' },
]

// BARE: chip + question + radio, không có submit-button lẫn khối giải thích
// (đã-nộp-không-giải-thích và xem-trước-read-only cùng composition này).
const BARE_PARTS: Array<AnatomyNode> = [
    { name: "SectionCard", tier: "primitive", role: "khung surface tự đóng bao cả câu hỏi" },
    { name: "StatusChip", tier: "primitive", role: 'nhãn "Câu N"', state: "accent" },
    { name: "Typography", tier: "primitive", role: "câu hỏi (body semibold)" },
    { name: "RadioGroup", tier: "primitive", role: "phương án chọn-một" },
]

export const SingleChoice: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="QuizCard"
                tier="design"
                leaf="Chọn một"
                parts={SINGLE_ASK_PARTS}
                reason='Một câu trắc nghiệm cần MỘT surface tự đóng khung để tách khỏi câu khác (SectionCard) và một nhãn thứ tự câu (StatusChip). Gói prompt + option rows + submit + giải thích + trạng thái đúng/sai vào một block, để feature chỉ truyền dữ liệu — không phải tự dựng lại khung, nhãn, và logic reveal đáp án ở mỗi màn.'
            >
                <SingleDemo />
            </BlockAnatomy>,
        ),
}

export const MultipleChoice: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="QuizCard"
                tier="design"
                leaf="Chọn nhiều"
                parts={MULTIPLE_ASK_PARTS}
                note="Chế độ chọn-nhiều → CheckboxGroup thay RadioGroup; vẫn có nút nộp (chưa nộp)."
            >
                <MultipleDemo />
            </BlockAnatomy>,
        ),
}

export const SubmittedCorrect: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="QuizCard"
                tier="design"
                leaf="Đã nộp · đúng"
                parts={SINGLE_SUBMITTED_PARTS}
                note="Đã nộp (chọn đúng) → RadioGroup lộ đúng/sai, thêm khối giải thích, nút nộp biến mất."
            >
                <QuizCard
                    questionIndex={1}
                    question="HTTP status nào báo tài nguyên không tồn tại?"
                    options={OPTIONS}
                    selectionMode="single"
                    selectedIds={["b"]}
                    onSelectionChange={() => {}}
                    isSubmitted
                    explanation="404 Not Found: server hiểu request nhưng không có tài nguyên khớp URI."
                />
            </BlockAnatomy>,
        ),
}

export const SubmittedIncorrect: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="QuizCard"
                tier="design"
                leaf="Đã nộp · sai"
                parts={SINGLE_SUBMITTED_PARTS}
                note="Đã nộp (chọn sai) → cùng composition với leaf 'Đúng': lộ đáp án + giải thích, không nút nộp."
            >
                <QuizCard
                    questionIndex={1}
                    question="HTTP status nào báo tài nguyên không tồn tại?"
                    options={OPTIONS}
                    selectionMode="single"
                    selectedIds={["a"]}
                    onSelectionChange={() => {}}
                    isSubmitted
                    explanation="200 OK báo thành công — không phải lỗi thiếu tài nguyên. Đáp án đúng là 404."
                />
            </BlockAnatomy>,
        ),
}

/** Multiple-choice, submitted: every row reveals its own correct/incorrect/missed state at
 *  once (independent per option, unlike single-choice's one right answer). */
export const MultipleSubmitted: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="QuizCard"
                tier="design"
                leaf="Chọn nhiều · đã nộp"
                parts={MULTIPLE_SUBMITTED_PARTS}
                note="Chọn-nhiều đã nộp → mỗi dòng CheckboxGroup tự lộ đúng/sai/bỏ sót + khối giải thích."
            >
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
                />
            </BlockAnatomy>,
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
        return frame(
            <BlockAnatomy
                name="QuizCard"
                tier="design"
                leaf="Không số câu"
                parts={NO_INDEX_PARTS}
                note="Không có questionIndex → StatusChip 'Câu N' biến mất hoàn toàn (khác các leaf khác)."
            >
                <Demo />
            </BlockAnatomy>,
        )
    },
}

/** Submitted without an `explanation` — the explanation block is optional and simply
 *  omitted once there's nothing to show. */
export const SubmittedNoExplanation: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="QuizCard"
                tier="design"
                leaf="Đã nộp · không giải thích"
                parts={BARE_PARTS}
                note="Đã nộp nhưng không có explanation → khối giải thích bị lược, chỉ còn chip + câu hỏi + phương án đã lộ."
            >
                <QuizCard
                    questionIndex={1}
                    question="HTTP status nào báo tài nguyên không tồn tại?"
                    options={OPTIONS}
                    selectionMode="single"
                    selectedIds={["b"]}
                    onSelectionChange={() => {}}
                    isSubmitted
                />
            </BlockAnatomy>,
        ),
}

/** No `onSubmit` handler: a static, read-only preview — the submit action never
 *  renders (`onSubmit && !isSubmitted`), matching the documented "read-only preview" use case. */
export const ReadOnlyNoAction: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="QuizCard"
                tier="design"
                leaf="Xem trước (read-only)"
                parts={BARE_PARTS}
                note="Không có onSubmit → nút nộp không dựng; xem trước tĩnh chip + câu hỏi + phương án."
            >
                <QuizCard
                    questionIndex={1}
                    question="HTTP status nào báo tài nguyên không tồn tại?"
                    options={OPTIONS}
                    selectionMode="single"
                    selectedIds={["b"]}
                    onSelectionChange={() => {}}
                />
            </BlockAnatomy>,
        ),
}
