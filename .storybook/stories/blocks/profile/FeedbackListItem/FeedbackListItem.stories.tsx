import type { Meta, StoryObj } from "@storybook/nextjs"
import { FeedbackListItem } from "@sb-components/_designs/profile/FeedbackListItem/FeedbackListItem"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

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

// Direct parts inside CardContent: a leading SourceChip + Title + right-aligned
// Date row, an optional CourseTitle line, then the Summary line.
const SOURCE_CHIP: AnatomyNode = { name: "SourceChip", tier: "primitive", role: "tone theo nguồn (challenge/task/cv)" }
const TITLE: AnatomyNode = { name: "Title", tier: "primitive", role: "tiêu đề feedback (body-sm medium)" }
const DATE: AnatomyNode = { name: "Date", tier: "primitive", role: "ngày, đẩy phải (ml-auto)" }
const COURSE_TITLE: AnatomyNode = { name: "CourseTitle", tier: "primitive", role: "khoá học liên quan — ẩn khi không có" }
const SUMMARY: AnatomyNode = { name: "Summary", tier: "primitive", role: "nội dung tóm tắt feedback" }
const WITH_COURSE_PARTS: Array<AnatomyNode> = [SOURCE_CHIP, TITLE, DATE, COURSE_TITLE, SUMMARY]
const NO_COURSE_PARTS: Array<AnatomyNode> = [SOURCE_CHIP, TITLE, DATE, SUMMARY]
const SKELETON_PARTS: Array<AnatomyNode> = [SOURCE_CHIP, TITLE, SUMMARY]

/** Default — challenge-sourced feedback with a related course. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <div className="w-full max-w-2xl">
                <BlockAnatomy name="FeedbackListItem" tier="design" leaf="Default" parts={WITH_COURSE_PARTS} note="Có courseTitle → 3 dòng: chip+title+date, courseTitle, summary.">
                    <FeedbackListItem
                        source="challenge"
                        sourceLabel="Thử thách"
                        title="Giải pháp cache tốt, cần xử lý race condition"
                        date="20 thg 7, 2026"
                        courseTitle="System Design Mastery"
                        summary="Cách tiếp cận cache-aside ổn, nhưng chưa khoá invalidation khi 2 request ghi đồng thời — xem lại phần lock ở mục 4."
                        showAnatomy
                    />
                </BlockAnatomy>
            </div>
        </div>
    ),
}

/** No related course — feedback not tied to any course (e.g. a CV review). */
export const NoCourse: Story = {
    render: () => (
        <div className="p-8">
            <div className="w-full max-w-2xl">
                <BlockAnatomy name="FeedbackListItem" tier="design" leaf="NoCourse" parts={NO_COURSE_PARTS} note="courseTitle omitted → dòng CourseTitle KHÔNG render (không phải rỗng-vẫn-badge).">
                    <FeedbackListItem
                        source="cv"
                        sourceLabel="CV"
                        title="Tinh gọn phần kinh nghiệm"
                        date="18 thg 7, 2026"
                        summary="Mục kinh nghiệm đang liệt kê nhiệm vụ thay vì kết quả — quy về số liệu impact cho từng dòng."
                        showAnatomy
                    />
                </BlockAnatomy>
            </div>
        </div>
    ),
}

/** Task-sourced feedback — warning tone. */
export const TaskSource: Story = {
    render: () => (
        <div className="p-8">
            <div className="w-full max-w-2xl">
                <BlockAnatomy name="FeedbackListItem" tier="design" leaf="TaskSource" parts={WITH_COURSE_PARTS} note="tone warning (task) — composition giống leaf Default (có courseTitle).">
                    <FeedbackListItem
                        source="task"
                        sourceLabel="Bài tập"
                        title="Thiếu test case biên"
                        date="15 thg 7, 2026"
                        courseTitle="Front-end Mastery"
                        summary="Hàm parse ngày chưa test input rỗng và múi giờ âm — bổ sung trước khi nộp lại."
                        showAnatomy
                    />
                </BlockAnatomy>
            </div>
        </div>
    ),
}

/** Stacked list — how `MyFeedback` composes rows in the real app (gap-3 column, mixed sources). */
export const List: Story = {
    render: () => (
        <div className="p-8">
            <div className="w-full max-w-2xl">
                <BlockAnatomy name="FeedbackListItem" tier="design" leaf="List" parts={WITH_COURSE_PARTS} note="×3 xếp chồng gap-3 (consumer sở hữu, KHÔNG thuộc block) — mixed nguồn, hàng cuối không có CourseTitle.">
                    <div className="flex flex-col gap-3">
                        <FeedbackListItem
                            source="challenge"
                            sourceLabel="Thử thách"
                            title="Giải pháp cache tốt, cần xử lý race condition"
                            date="20 thg 7, 2026"
                            courseTitle="System Design Mastery"
                            summary="Cách tiếp cận cache-aside ổn, nhưng chưa khoá invalidation khi 2 request ghi đồng thời."
                            showAnatomy
                        />
                        <FeedbackListItem
                            source="task"
                            sourceLabel="Bài tập"
                            title="Thiếu test case biên"
                            date="15 thg 7, 2026"
                            courseTitle="Front-end Mastery"
                            summary="Hàm parse ngày chưa test input rỗng và múi giờ âm."
                            showAnatomy
                        />
                        <FeedbackListItem
                            source="cv"
                            sourceLabel="CV"
                            title="Tinh gọn phần kinh nghiệm"
                            date="18 thg 7, 2026"
                            summary="Mục kinh nghiệm đang liệt kê nhiệm vụ thay vì kết quả."
                            showAnatomy
                        />
                    </div>
                </BlockAnatomy>
            </div>
        </div>
    ),
}

/** Khung chờ — mirror while `myLearningFeedbacks` resolves (`isSkeleton`); other props ignored. */
export const SkeletonState: Story = {
    name: "Loading",
    render: () => (
        <div className="p-8">
            <div className="w-full max-w-2xl">
                <BlockAnatomy name="FeedbackListItem" tier="design" leaf="Skeleton" parts={SKELETON_PARTS} note="isSkeleton → chỉ 2 hàng bar (chip+title, summary); KHÔNG giữ chỗ riêng cho Date/CourseTitle.">
                    <div className="flex flex-col gap-3">
                        <FeedbackListItem
                            isSkeleton
                            source="challenge"
                            sourceLabel=""
                            title=""
                            date=""
                            summary=""
                            showAnatomy
                        />
                        <FeedbackListItem
                            isSkeleton
                            source="task"
                            sourceLabel=""
                            title=""
                            date=""
                            summary=""
                            showAnatomy
                        />
                    </div>
                </BlockAnatomy>
            </div>
        </div>
    ),
}
