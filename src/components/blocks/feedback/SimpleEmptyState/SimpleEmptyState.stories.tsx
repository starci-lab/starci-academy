import type { Meta, StoryObj } from "@storybook/nextjs"
import { SimpleEmptyState } from "./index"

const meta: Meta<typeof SimpleEmptyState> = {
    title: "Core/Feedback/SimpleEmptyState",
    component: SimpleEmptyState,
}
export default meta
type Story = StoryObj<typeof SimpleEmptyState>

/** Dùng khi một tab hoặc panel nhỏ chưa có dữ liệu và chỉ cần một dòng chữ mờ báo "chưa có gì" thay vì một empty-state đầy đủ. */
export const Default: Story = {
    parameters: { usage: "Dùng khi một tab hoặc panel nhỏ chưa có dữ liệu và chỉ cần một dòng chữ mờ báo \"chưa có gì\" thay vì một empty-state đầy đủ." },
    render: () => <SimpleEmptyState>Chưa có dữ liệu nào để hiển thị.</SimpleEmptyState>,
}

/** Dùng khi thông điệp trống cần giải thích thêm lý do hoặc gợi ý hành động tiếp theo, và cần xuống dòng tự nhiên trong khung hẹp. */
export const LongMessageWrapping: Story = {
    parameters: { usage: "Dùng khi thông điệp trống cần giải thích thêm lý do hoặc gợi ý hành động tiếp theo, và cần xuống dòng tự nhiên trong khung hẹp." },
    render: () => (
        <div className="w-64">
            <SimpleEmptyState>
                Chưa có bài nộp nào cho bài tập này. Hãy hoàn thành và nộp bài để xem kết quả chấm điểm tại đây.
            </SimpleEmptyState>
        </div>
    ),
}
