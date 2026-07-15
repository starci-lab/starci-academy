import type { Meta, StoryObj } from "@storybook/nextjs"
import { TopicMasteryGrid } from "./index"

const meta: Meta<typeof TopicMasteryGrid> = {
    title: "Blocks/TopicMasteryGrid",
    component: TopicMasteryGrid,
}
export default meta
type Story = StoryObj<typeof TopicMasteryGrid>

/** Dùng khi hiển thị bảng mạnh-yếu theo chủ đề của học viên, sắp xếp chủ đề mạnh nhất lên đầu. */
export const Default: Story = {
    parameters: { usage: "Dùng khi hiển thị bảng mạnh-yếu theo chủ đề của học viên, sắp xếp chủ đề mạnh nhất lên đầu." },
    render: () => (
        <TopicMasteryGrid
            ariaLabel="Mức độ thành thạo theo chủ đề"
            topics={[
                { key: "dp", label: "Dynamic Programming", solved: 24 },
                { key: "graph", label: "Đồ thị", solved: 19 },
                { key: "array", label: "Mảng & Chuỗi", solved: 17 },
                { key: "tree", label: "Cây nhị phân", solved: 12 },
                { key: "greedy", label: "Tham lam", solved: 8 },
                { key: "backtrack", label: "Quay lui", solved: 5 },
            ]}
        />
    ),
}

/** Dùng khi học viên vừa bắt đầu và mọi chủ đề có số bài giải bằng nhau, chưa có chủ đề nổi bật. */
export const EvenDistribution: Story = {
    parameters: { usage: "Dùng khi học viên vừa bắt đầu và mọi chủ đề có số bài giải bằng nhau, chưa có chủ đề nổi bật." },
    render: () => (
        <TopicMasteryGrid
            ariaLabel="Mức độ thành thạo theo chủ đề"
            topics={[
                { key: "array", label: "Mảng & Chuỗi", solved: 3 },
                { key: "hash", label: "Bảng băm", solved: 3 },
                { key: "stack", label: "Ngăn xếp", solved: 3 },
            ]}
        />
    ),
}

/** Dùng khi học viên chỉ mới giải bài thuộc đúng một chủ đề duy nhất. */
export const SingleTopic: Story = {
    parameters: { usage: "Dùng khi học viên chỉ mới giải bài thuộc đúng một chủ đề duy nhất." },
    render: () => (
        <TopicMasteryGrid
            ariaLabel="Mức độ thành thạo theo chủ đề"
            topics={[{ key: "array", label: "Mảng & Chuỗi", solved: 6 }]}
        />
    ),
}

/** Dùng khi danh sách chủ đề dài, cần kiểm tra khả năng xuống dòng (wrap) của lưới chip. */
export const ManyTopics: Story = {
    parameters: { usage: "Dùng khi danh sách chủ đề dài, cần kiểm tra khả năng xuống dòng (wrap) của lưới chip." },
    render: () => (
        <TopicMasteryGrid
            ariaLabel="Mức độ thành thạo theo chủ đề"
            topics={[
                { key: "dp", label: "Dynamic Programming", solved: 30 },
                { key: "graph", label: "Đồ thị", solved: 27 },
                { key: "array", label: "Mảng & Chuỗi", solved: 25 },
                { key: "tree", label: "Cây nhị phân", solved: 21 },
                { key: "greedy", label: "Tham lam", solved: 18 },
                { key: "backtrack", label: "Quay lui", solved: 15 },
                { key: "sliding-window", label: "Cửa sổ trượt", solved: 13 },
                { key: "two-pointer", label: "Hai con trỏ", solved: 11 },
                { key: "heap", label: "Heap / Priority Queue", solved: 9 },
                { key: "trie", label: "Cây tiền tố (Trie)", solved: 6 },
                { key: "union-find", label: "Union-Find", solved: 4 },
                { key: "bit-manipulation", label: "Thao tác bit", solved: 2 },
            ]}
        />
    ),
}

/** Dùng khi chưa có dữ liệu giải bài nào, lưới hiển thị rỗng nhưng vẫn giữ vùng đọc cho trình đọc màn hình. */
export const Empty: Story = {
    parameters: { usage: "Dùng khi chưa có dữ liệu giải bài nào, lưới hiển thị rỗng nhưng vẫn giữ vùng đọc cho trình đọc màn hình." },
    render: () => (
        <TopicMasteryGrid ariaLabel="Mức độ thành thạo theo chủ đề" topics={[]} />
    ),
}
