import React from "react"
import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { QuizCard } from "./index"
import type { QuizCardProps, QuizOption } from "./index"

const meta: Meta<typeof QuizCard> = {
    title: "Block/Learn/QuizCard",
    component: QuizCard,
}
export default meta
type Story = StoryObj<typeof QuizCard>

/**
 * Controlled wrapper so the reviewer can actually click options and press submit.
 * Owns the `selectedIds` + `isSubmitted` state and forwards everything else. When
 * `startSubmitted` is set the wrapper opens already graded (for the post-submit
 * stories).
 */
const ControlledQuizCard = ({
    startSelectedIds = [],
    startSubmitted = false,
    ...props
}: Omit<QuizCardProps, "selectedIds" | "onSelectionChange" | "isSubmitted" | "onSubmit"> & {
    startSelectedIds?: string[]
    startSubmitted?: boolean
}) => {
    const [selectedIds, setSelectedIds] = useState<string[]>(startSelectedIds)
    const [isSubmitted, setIsSubmitted] = useState(startSubmitted)
    return (
        <QuizCard
            {...props}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
            isSubmitted={isSubmitted}
            onSubmit={() => setIsSubmitted(true)}
        />
    )
}

const SINGLE_OPTIONS: QuizOption[] = [
    { id: "opt-cookie", label: "Lưu token vào cookie có cờ HttpOnly", isCorrect: true },
    { id: "opt-local", label: "Lưu token vào localStorage cho tiện truy cập" },
    { id: "opt-url", label: "Đính token vào query string của mỗi URL" },
    { id: "opt-global", label: "Gán token vào một biến toàn cục trên window" },
]

const MULTIPLE_OPTIONS: QuizOption[] = [
    { id: "idx-where", label: "Cột thường xuất hiện trong mệnh đề WHERE", isCorrect: true },
    { id: "idx-join", label: "Cột dùng để nối bảng trong mệnh đề JOIN", isCorrect: true },
    { id: "idx-boolean", label: "Cột kiểu boolean chỉ có hai giá trị đúng hoặc sai" },
    { id: "idx-rare", label: "Cột hầu như không bao giờ xuất hiện trong truy vấn" },
]

/**
 * Trước khi nộp: câu chọn một đáp án, mỗi hàng ở trạng thái mặc định hoặc đang chọn
 * (viền accent). Đáp án chưa lộ. Bấm một lựa chọn rồi bấm nút kiểm tra để xem trạng thái chấm.
 */
export const SingleChoice: Story = {
    parameters: {
        usage: "Dùng cho câu trắc nghiệm một đáp án khi học viên chưa nộp. Mỗi hàng chỉ có hai trạng thái: mặc định và đang chọn (viền accent) — đáp án đúng chưa hề lộ. Nút kiểm tra bị khoá cho tới khi có lựa chọn.",
    },
    render: () => (
        <div className="flex w-[32rem] max-w-full flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Câu một đáp án (trước khi nộp)</Label>
                <Typography type="body-sm" color="muted">
                    Chọn một phương án rồi bấm kiểm tra để lộ trạng thái đúng hoặc sai.
                </Typography>
            </div>
            <ControlledQuizCard
                questionIndex={1}
                question="Cách lưu token phiên đăng nhập nào an toàn nhất trên trình duyệt?"
                options={SINGLE_OPTIONS}
                selectionMode="single"
                explanation="Cookie có cờ HttpOnly không đọc được bằng JavaScript nên chống được tấn công XSS đánh cắp token, khác với localStorage hay biến toàn cục."
            />
        </div>
    ),
}

/**
 * Sau khi nộp: hàng đúng được chọn tô nền success kèm dấu tích, hàng sai bị chọn tô
 * nền danger kèm dấu chéo, hàng đúng nhưng bỏ lỡ có viền success mờ, và phần giải thích hiện ra.
 */
export const SingleChoiceSubmitted: Story = {
    parameters: {
        usage: "Dùng để xem trạng thái sau khi nộp của câu một đáp án. Ở đây học viên chọn sai: hàng đã chọn tô nền danger kèm dấu chéo, hàng đúng bị bỏ lỡ có viền success mờ kèm dấu tích, nhóm chuyển sang chỉ đọc, và phần giải thích hiện ra bên dưới.",
    },
    render: () => (
        <div className="flex w-[32rem] max-w-full flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Câu một đáp án (đã nộp, chọn sai)</Label>
                <Typography type="body-sm" color="muted">
                    Nhóm đã khoá chỉ đọc; mỗi hàng lộ trạng thái chấm và giải thích xuất hiện.
                </Typography>
            </div>
            <ControlledQuizCard
                questionIndex={1}
                question="Cách lưu token phiên đăng nhập nào an toàn nhất trên trình duyệt?"
                options={SINGLE_OPTIONS}
                selectionMode="single"
                explanation="Cookie có cờ HttpOnly không đọc được bằng JavaScript nên chống được tấn công XSS đánh cắp token, khác với localStorage hay biến toàn cục."
                startSelectedIds={["opt-local"]}
                startSubmitted
            />
        </div>
    ),
}

/**
 * Câu nhiều đáp án dùng ngữ nghĩa checkbox: chọn được nhiều phương án. Bấm vài ô rồi
 * bấm kiểm tra để chấm cả tập lựa chọn.
 */
export const MultipleChoice: Story = {
    parameters: {
        usage: "Dùng cho câu có nhiều đáp án đúng — selectionMode multiple dựng bằng CheckboxGroup nên chọn được nhiều ô. Nút kiểm tra khoá tới khi chọn ít nhất một ô; sau khi nộp mỗi ô lộ trạng thái chấm riêng.",
    },
    render: () => (
        <div className="flex w-[32rem] max-w-full flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Câu nhiều đáp án</Label>
                <Typography type="body-sm" color="muted">
                    Chọn tất cả phương án phù hợp rồi bấm kiểm tra để chấm cả tập.
                </Typography>
            </div>
            <ControlledQuizCard
                questionIndex={2}
                question="Những cột nào thường là ứng viên tốt để đánh chỉ mục trong cơ sở dữ liệu quan hệ?"
                options={MULTIPLE_OPTIONS}
                selectionMode="multiple"
                submitLabel="Kiểm tra lựa chọn"
                explanation="Cột hay lọc trong WHERE hoặc nối trong JOIN được truy vấn thường xuyên nên hưởng lợi từ chỉ mục; cột ít giá trị như boolean hoặc gần như không được truy vấn thì chỉ mục ít tác dụng."
            />
        </div>
    ),
}
