import type { Meta, StoryObj } from "@storybook/nextjs"
import { TruthList } from "./index"

const meta: Meta<typeof TruthList> = {
    title: "Blocks/Marketing/TruthList",
    component: TruthList,
    parameters: { layout: "centered" },
}
export default meta
type Story = StoryObj<typeof TruthList>

/** Dùng khi cần trình bày các sự thật gai góc của ngành kèm câu trả lời cụ thể của sản phẩm, mỗi mục bấm mở để đọc thêm. */
export const Default: Story = {
    parameters: { usage: "Dùng khi cần trình bày các sự thật gai góc của ngành kèm câu trả lời cụ thể của sản phẩm, mỗi mục bấm mở để đọc thêm." },
    render: () => (
        <div className="w-[480px]">
            <TruthList
                items={[
                    {
                        truth: "Hầu hết khóa học chỉ dạy lý thuyết, không ai chấm code thật.",
                        fix: "→ Mọi bài tập ở đây đều được AI chấm dựa trên pull request thật, không phải quiz trắc nghiệm.",
                    },
                    {
                        truth: "Nhà tuyển dụng không quan tâm bạn học bao nhiêu giờ.",
                        fix: "→ Hồ sơ của bạn là dự án capstone chạy được, không phải chứng chỉ hoàn thành khóa.",
                    },
                    {
                        truth: "Phỏng vấn kỹ thuật đánh rớt phần lớn ứng viên vì thiếu luyện tập thật.",
                        fix: "→ Mô phỏng phỏng vấn với AI, chấm theo rubric của kỹ sư senior thật.",
                    },
                ]}
            />
        </div>
    ),
}

/** Dùng khi cần đóng danh sách sự thật bằng một chữ ký thật (người sáng lập) để tăng độ tin cậy. */
export const WithByline: Story = {
    parameters: { usage: "Dùng khi cần đóng danh sách sự thật bằng một chữ ký thật (người sáng lập) để tăng độ tin cậy." },
    render: () => (
        <div className="w-[480px]">
            <TruthList
                items={[
                    {
                        truth: "Hầu hết khóa học chỉ dạy lý thuyết, không ai chấm code thật.",
                        fix: "→ Mọi bài tập ở đây đều được AI chấm dựa trên pull request thật, không phải quiz trắc nghiệm.",
                    },
                    {
                        truth: "Nhà tuyển dụng không quan tâm bạn học bao nhiêu giờ.",
                        fix: "→ Hồ sơ của bạn là dự án capstone chạy được, không phải chứng chỉ hoàn thành khóa.",
                    },
                ]}
                byline={
                    <span className="text-sm text-muted">
                        — Quang, người sáng lập StarCi Academy
                    </span>
                }
            />
        </div>
    ),
}
