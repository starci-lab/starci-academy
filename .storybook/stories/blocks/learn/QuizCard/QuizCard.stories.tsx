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
            showAnatomy
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
            showAnatomy
        />
    )
}

// Shared leaf nodes — mọi leaf đều bọc TRONG SectionCard (khung tự đóng). Cây thật:
// SectionCard > StatusChip? + Radio/CheckboxGroup > rows + Button?
// (câu hỏi + khối giải thích là text/prop nội tại SectionCard/QuizCard — không
// tách node; icon ✓/✗ là mark nội tại mỗi row — gộp vào Radio/Checkbox.)

/** StatusChip "Câu N" — con đầu của SectionCard (chỉ khi có questionIndex). */
const CHIP_NODE: AnatomyNode = { name: "StatusChip", tier: "primitive", role: "nhãn \"Câu N\"", state: "accent" }
/** Typography hiển thị prop `question` — QuizCard tự render trực tiếp. */
const QUESTION_NODE: AnatomyNode = { name: "Typography", tier: "primitive", role: "nội dung câu hỏi" }
/** Nút nộp — chỉ dựng khi có onSubmit và chưa nộp. */
const SUBMIT_NODE: AnatomyNode = {
    name: "Button",
    tier: "primitive",
    role: "CTA \"Kiểm tra đáp án\" — chỉ khi có onSubmit và chưa nộp",
}
/** Khối giải thích — chỉ dựng khi đã nộp VÀ có `explanation`; 2 Typography riêng (nhãn tĩnh + nội dung). */
const EXPLANATION_LABEL_NODE: AnatomyNode = { name: "Typography", tier: "primitive", role: "nhãn tĩnh \"Giải thích\"" }
const EXPLANATION_BODY_NODE: AnatomyNode = { name: "Typography", tier: "primitive", role: "nội dung giải thích (muted)" }

// Câu hỏi + khối giải thích đều là Typography QuizCard TỰ RENDER trực tiếp (dù
// nằm trong children của SectionCard) → MỖI Typography là 1 node riêng, có
// data-anat-part. Icon ✓/✗ (OptionResultIcon) thì khác: nó là mark truyền vào
// SLOT children của Radio/Checkbox (một primitive) — gộp vào node "Radio"/
// "Checkbox", không tách node riêng.

/** Bọc các con trong SectionCard theo đúng thứ tự DOM. */
const inSection = (children: Array<AnatomyNode>): Array<AnatomyNode> => [
    { name: "SectionCard", tier: "primitive", role: "khung surface tự đóng bao TOÀN BỘ câu hỏi (câu hỏi là text nội tại)", children },
]

/** RadioGroup > Radio row (đúng/sai lộ ra sau khi nộp qua chính Radio, không tách node icon). */
const radioGroup = (revealed: boolean): AnatomyNode => ({
    name: "RadioGroup",
    tier: "primitive",
    role: revealed ? "nhóm phương án chọn-một; lộ đúng/sai sau khi nộp" : "nhóm phương án chọn-một; chỉ default/selected trước khi nộp",
    ...(revealed ? { state: "revealed" } : {}),
    children: [
        {
            name: "Radio",
            tier: "primitive",
            role: revealed ? "mỗi phương án (một dòng); tô + icon ✓/✗ đúng/sai sau khi nộp" : "mỗi phương án (một dòng); default/selected",
            ...(revealed ? { state: "revealed" } : {}),
        },
    ],
})

/** CheckboxGroup > Checkbox row (đúng/sai/bỏ sót lộ ra qua chính Checkbox, không tách node icon). */
const checkboxGroup = (revealed: boolean): AnatomyNode => ({
    name: "CheckboxGroup",
    tier: "primitive",
    role: revealed ? "nhóm phương án chọn-nhiều; mỗi dòng lộ đúng/sai/bỏ sót sau khi nộp" : "nhóm phương án chọn-nhiều; chỉ default/selected trước khi nộp",
    ...(revealed ? { state: "revealed" } : {}),
    children: [
        {
            name: "Checkbox",
            tier: "primitive",
            role: revealed ? "mỗi phương án (một dòng); tô + icon ✓/✗ đúng/sai/bỏ sót sau khi nộp" : "mỗi phương án (một dòng); default/selected",
            ...(revealed ? { state: "revealed" } : {}),
        },
    ],
})

// SINGLE, before submit: SectionCard bao chip + câu hỏi + RadioGroup(row) + submit CTA (đáp án ẩn).
const SINGLE_ASK_PARTS: Array<AnatomyNode> = inSection([CHIP_NODE, QUESTION_NODE, radioGroup(false), SUBMIT_NODE])

// MULTIPLE, before submit: y hệt nhưng CheckboxGroup thay RadioGroup.
const MULTIPLE_ASK_PARTS: Array<AnatomyNode> = inSection([CHIP_NODE, QUESTION_NODE, checkboxGroup(false), SUBMIT_NODE])

// SINGLE, submitted + explanation: rows lộ đúng/sai, nút nộp biến mất, thêm khối giải thích (2 Typography riêng).
const SINGLE_SUBMITTED_PARTS: Array<AnatomyNode> = inSection([CHIP_NODE, QUESTION_NODE, radioGroup(true), EXPLANATION_LABEL_NODE, EXPLANATION_BODY_NODE])

// MULTIPLE, submitted + explanation: mỗi dòng tự lộ đúng/sai/bỏ sót + khối giải thích (2 Typography riêng).
const MULTIPLE_SUBMITTED_PARTS: Array<AnatomyNode> = inSection([CHIP_NODE, QUESTION_NODE, checkboxGroup(true), EXPLANATION_LABEL_NODE, EXPLANATION_BODY_NODE])

// NO questionIndex: StatusChip "Câu N" biến mất hoàn toàn (chưa nộp → còn nút nộp).
const NO_INDEX_PARTS: Array<AnatomyNode> = inSection([QUESTION_NODE, radioGroup(false), SUBMIT_NODE])

// SUBMITTED, no explanation: đã nộp → rows lộ đúng/sai, KHÔNG nút nộp, KHÔNG khối giải thích.
const SUBMITTED_NO_EXPLANATION_PARTS: Array<AnatomyNode> = inSection([CHIP_NODE, QUESTION_NODE, radioGroup(true)])

// READ-ONLY preview: chưa nộp + không onSubmit → rows default/selected, không nút, không giải thích.
const READONLY_PARTS: Array<AnatomyNode> = inSection([CHIP_NODE, QUESTION_NODE, radioGroup(false)])

export const SingleChoice: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="QuizCard"
                tier="design"
                leaf="SingleChoice"
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
                leaf="MultipleChoice"
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
                leaf="SubmittedCorrect"
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
                    showAnatomy
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
                leaf="SubmittedIncorrect"
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
                    showAnatomy
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
                leaf="MultipleSubmitted"
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
                    showAnatomy
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
                    showAnatomy
                />
            )
        }
        return frame(
            <BlockAnatomy
                name="QuizCard"
                tier="design"
                leaf="NoQuestionIndex"
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
                leaf="SubmittedNoExplanation"
                parts={SUBMITTED_NO_EXPLANATION_PARTS}
                note="Đã nộp nhưng không có explanation → khối giải thích bị lược; rows VẪN lộ đúng/sai (OptionResultIcon), chỉ mất khối giải thích + nút nộp."
            >
                <QuizCard
                    questionIndex={1}
                    question="HTTP status nào báo tài nguyên không tồn tại?"
                    options={OPTIONS}
                    selectionMode="single"
                    selectedIds={["b"]}
                    onSelectionChange={() => {}}
                    isSubmitted
                    showAnatomy
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
                leaf="ReadOnlyNoAction"
                parts={READONLY_PARTS}
                note="Không có onSubmit + chưa nộp → nút nộp không dựng, rows chỉ default/selected (KHÔNG OptionResultIcon); xem trước tĩnh chip + câu hỏi + phương án."
            >
                <QuizCard
                    questionIndex={1}
                    question="HTTP status nào báo tài nguyên không tồn tại?"
                    options={OPTIONS}
                    selectionMode="single"
                    selectedIds={["b"]}
                    onSelectionChange={() => {}}
                    showAnatomy
                />
            </BlockAnatomy>,
        ),
}
