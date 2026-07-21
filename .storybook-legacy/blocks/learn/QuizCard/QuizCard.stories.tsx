import type { Meta, StoryObj } from "@storybook/nextjs"
import { QuizCard } from "@/components/blocks/learn/QuizCard"
import { Gallery, Variant } from "../../../../story-kit"
import { ControlledQuizCard, SINGLE_OPTIONS, MULTIPLE_OPTIONS } from "./components"

const meta: Meta<typeof QuizCard> = {
    title: "Features/Learn/QuizCard",
    component: QuizCard,
}
export default meta
type Story = StoryObj<typeof QuizCard>

/**
 * Toàn bộ trạng thái của QuizCard: câu hỏi một đáp án trước khi nộp (mỗi hàng chỉ ở
 * mặc định hoặc đã chọn, đáp án đúng chưa lộ), câu hỏi một đáp án sau khi nộp (hàng
 * chọn sai tô danger kèm dấu X, hàng đúng bị bỏ lỡ có viền success nhạt kèm dấu tick,
 * nhóm chuyển chỉ-đọc, giải thích hiện ra), và câu hỏi nhiều đáp án dùng CheckboxGroup
 * trước khi nộp. Dùng để tra khi nào chọn selectionMode single hay multiple, và cách
 * mỗi hàng đổi màu theo trạng thái chấm sau khi nộp.
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="Một đáp án — trước khi nộp"
                hint="Câu hỏi trắc nghiệm chỉ có một đáp án đúng, trước khi học viên nộp bài — mỗi hàng chỉ ở trạng thái mặc định hoặc đã chọn (viền accent), đáp án đúng chưa lộ ra. Chọn một phương án rồi bấm kiểm tra để xem trạng thái sau khi chấm."
            >
                <div className="w-[32rem] max-w-full">
                    <ControlledQuizCard
                        questionIndex={1}
                        question="Which way of storing a session token is safest in the browser?"
                        options={SINGLE_OPTIONS}
                        selectionMode="single"
                        explanation="A cookie with the HttpOnly flag can't be read by JavaScript, so it defends against XSS attacks stealing the token — unlike localStorage or a global variable."
                    />
                </div>
            </Variant>
            <Variant
                label="Một đáp án — sau khi nộp (chọn sai)"
                hint="Trạng thái sau khi nộp của câu hỏi một đáp án, ở đây học viên chọn sai: hàng đã chọn tô danger kèm dấu X, hàng đúng bị bỏ lỡ có viền success nhạt kèm dấu tick, cả nhóm chuyển về chỉ-đọc và phần giải thích hiện ra bên dưới."
            >
                <div className="w-[32rem] max-w-full">
                    <ControlledQuizCard
                        questionIndex={1}
                        question="Which way of storing a session token is safest in the browser?"
                        options={SINGLE_OPTIONS}
                        selectionMode="single"
                        explanation="A cookie with the HttpOnly flag can't be read by JavaScript, so it defends against XSS attacks stealing the token — unlike localStorage or a global variable."
                        startSelectedIds={["opt-local"]}
                        startSubmitted
                    />
                </div>
            </Variant>
            <Variant
                label="Nhiều đáp án — trước khi nộp"
                hint="Câu hỏi có nhiều đáp án đúng dùng ngữ nghĩa checkbox (CheckboxGroup) — chọn được nhiều ô cùng lúc. Nút kiểm tra bị khoá tới khi có ít nhất một ô được chọn; sau khi nộp mỗi ô tự lộ trạng thái chấm riêng."
            >
                <div className="w-[32rem] max-w-full">
                    <ControlledQuizCard
                        questionIndex={2}
                        question="Which columns are usually good candidates for indexing in a relational database?"
                        options={MULTIPLE_OPTIONS}
                        selectionMode="multiple"
                        submitLabel="Check selection"
                        explanation="Columns often filtered in WHERE or joined in JOIN are queried frequently and benefit from an index; low-value columns like a boolean, or ones almost never queried, gain little from an index."
                    />
                </div>
            </Variant>
        </Gallery>
    ),
    parameters: {
        usage:
            "Toàn bộ trạng thái của QuizCard: câu hỏi một đáp án trước khi nộp (mỗi hàng chỉ ở mặc định " +
            "hoặc đã chọn, đáp án đúng chưa lộ), câu hỏi một đáp án sau khi nộp (hàng chọn sai tô danger " +
            "kèm dấu X, hàng đúng bị bỏ lỡ có viền success nhạt kèm dấu tick, nhóm chuyển chỉ-đọc, giải " +
            "thích hiện ra), và câu hỏi nhiều đáp án dùng CheckboxGroup trước khi nộp (nút kiểm tra khoá " +
            "tới khi có ít nhất một ô được chọn). Dùng để tra selectionMode nên chọn single hay multiple, " +
            "và cách mỗi hàng đổi màu theo trạng thái chấm sau khi nộp.",
    },
}
