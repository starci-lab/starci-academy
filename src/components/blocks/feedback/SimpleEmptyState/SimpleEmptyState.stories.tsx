import type { Meta, StoryObj } from "@storybook/nextjs"
import { SimpleEmptyState } from "./index"

const meta: Meta<typeof SimpleEmptyState> = {
    title: "Blocks/SimpleEmptyState",
    component: SimpleEmptyState,
}
export default meta
type Story = StoryObj<typeof SimpleEmptyState>

/** Dùng khi một tab hoặc panel nhỏ chưa có dữ liệu và chỉ cần một dòng chữ mờ báo "chưa có gì" thay vì một empty-state đầy đủ. */
export const Default: Story = {
    parameters: { usage: "Dùng khi một tab hoặc panel nhỏ chưa có dữ liệu và chỉ cần một dòng chữ mờ báo \"chưa có gì\" thay vì một empty-state đầy đủ." },
    render: () => <SimpleEmptyState>Chưa có dữ liệu nào để hiển thị.</SimpleEmptyState>,
}

/** Dùng khi cần thông báo trống ngắn gọn bên trong một danh sách con, ví dụ tab bình luận hoặc tab lịch sử chưa có mục nào. */
export const ShortMessage: Story = {
    parameters: { usage: "Dùng khi cần thông báo trống ngắn gọn bên trong một danh sách con, ví dụ tab bình luận hoặc tab lịch sử chưa có mục nào." },
    render: () => <SimpleEmptyState>Chưa có bình luận.</SimpleEmptyState>,
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

/** Dùng khi cần căn giữa thông báo trống trong một khối card hoặc panel có chiều cao cố định, ví dụ card thống kê chưa có số liệu. */
export const CenteredInPanel: Story = {
    parameters: { usage: "Dùng khi cần căn giữa thông báo trống trong một khối card hoặc panel có chiều cao cố định, ví dụ card thống kê chưa có số liệu." },
    render: () => (
        <div className="flex h-40 w-72 items-center justify-center rounded-lg border border-default-200">
            <SimpleEmptyState>Không có thông báo mới.</SimpleEmptyState>
        </div>
    ),
}

/** Dùng khi muốn tuỳ biến thêm màu sắc hoặc căn lề cho dòng chữ trống thông qua className, ví dụ nhấn mạnh bằng cách căn giữa văn bản. */
export const WithCustomClassName: Story = {
    parameters: { usage: "Dùng khi muốn tuỳ biến thêm màu sắc hoặc căn lề cho dòng chữ trống thông qua className, ví dụ nhấn mạnh bằng cách căn giữa văn bản." },
    render: () => (
        <SimpleEmptyState className="text-center italic">
            Chưa có khoá học nào trong danh sách yêu thích.
        </SimpleEmptyState>
    ),
}
