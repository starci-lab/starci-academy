import type { Meta, StoryObj } from "@storybook/nextjs"
import { FeedbackListItem } from "./FeedbackListItem"

const meta: Meta<typeof FeedbackListItem> = {
    title: "Design/Profile/FeedbackListItem",
    component: FeedbackListItem,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof FeedbackListItem>

/** Default — challenge-sourced feedback with a related course. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <div className="w-full max-w-2xl">
                <FeedbackListItem
                    source="challenge"
                    sourceLabel="Thử thách"
                    title="Giải pháp cache tốt, cần xử lý race condition"
                    date="20 thg 7, 2026"
                    courseTitle="System Design Mastery"
                    summary="Cách tiếp cận cache-aside ổn, nhưng chưa khoá invalidation khi 2 request ghi đồng thời — xem lại phần lock ở mục 4."
                />
            </div>
        </div>
    ),
}

/** No related course — feedback not tied to any course (e.g. a CV review). */
export const NoCourse: Story = {
    name: "No course",
    render: () => (
        <div className="p-8">
            <div className="w-full max-w-2xl">
                <FeedbackListItem
                    source="cv"
                    sourceLabel="CV"
                    title="Tinh gọn phần kinh nghiệm"
                    date="18 thg 7, 2026"
                    summary="Mục kinh nghiệm đang liệt kê nhiệm vụ thay vì kết quả — quy về số liệu impact cho từng dòng."
                />
            </div>
        </div>
    ),
}

/** Task-sourced feedback — warning tone. */
export const TaskSource: Story = {
    name: "Task source",
    render: () => (
        <div className="p-8">
            <div className="w-full max-w-2xl">
                <FeedbackListItem
                    source="task"
                    sourceLabel="Bài tập"
                    title="Thiếu test case biên"
                    date="15 thg 7, 2026"
                    courseTitle="Front-end Mastery"
                    summary="Hàm parse ngày chưa test input rỗng và múi giờ âm — bổ sung trước khi nộp lại."
                />
            </div>
        </div>
    ),
}

/** Stacked list — how `MyFeedback` composes rows in the real app (gap-3 column, mixed sources). */
export const List: Story = {
    render: () => (
        <div className="p-8">
            <div className="flex w-full max-w-2xl flex-col gap-3">
                <FeedbackListItem
                    source="challenge"
                    sourceLabel="Thử thách"
                    title="Giải pháp cache tốt, cần xử lý race condition"
                    date="20 thg 7, 2026"
                    courseTitle="System Design Mastery"
                    summary="Cách tiếp cận cache-aside ổn, nhưng chưa khoá invalidation khi 2 request ghi đồng thời."
                />
                <FeedbackListItem
                    source="task"
                    sourceLabel="Bài tập"
                    title="Thiếu test case biên"
                    date="15 thg 7, 2026"
                    courseTitle="Front-end Mastery"
                    summary="Hàm parse ngày chưa test input rỗng và múi giờ âm."
                />
                <FeedbackListItem
                    source="cv"
                    sourceLabel="CV"
                    title="Tinh gọn phần kinh nghiệm"
                    date="18 thg 7, 2026"
                    summary="Mục kinh nghiệm đang liệt kê nhiệm vụ thay vì kết quả."
                />
            </div>
        </div>
    ),
}

/** Khung chờ — mirror while `myLearningFeedbacks` resolves (`isSkeleton`); other props ignored. */
export const SkeletonState: Story = {
    name: "Khung chờ",
    render: () => (
        <div className="p-8">
            <div className="flex w-full max-w-2xl flex-col gap-3">
                <FeedbackListItem
                    isSkeleton
                    source="challenge"
                    sourceLabel=""
                    title=""
                    date=""
                    summary=""
                />
                <FeedbackListItem
                    isSkeleton
                    source="task"
                    sourceLabel=""
                    title=""
                    date=""
                    summary=""
                />
            </div>
        </div>
    ),
}
