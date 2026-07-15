import type { Meta, StoryObj } from "@storybook/nextjs"
import { CardsIcon, FileTextIcon } from "@phosphor-icons/react"
import type { SearchCourseContentItem } from "@/modules/api/graphql/queries/types/search-course-content"
import { ChatToolResult } from "./index"

const meta: Meta<typeof ChatToolResult> = {
    title: "Blocks/Learn/ChatToolResult",
    component: ChatToolResult,
    parameters: { layout: "centered" },
}
export default meta
type Story = StoryObj<typeof ChatToolResult>

const contentItems: Array<SearchCourseContentItem> = [
    {
        kind: "content",
        title: "React Server Components là gì",
        breadcrumb: "Module 3 - Rendering nâng cao",
        snippet: "React Server Components cho phép render component trên server, giảm bundle size gửi về client...",
        score: 0.91,
        moduleId: "module-3",
        contentId: "content-rsc-intro",
        deckId: null,
        taskId: null,
    },
    {
        kind: "content",
        title: "Streaming SSR với Suspense",
        breadcrumb: "Module 3 - Rendering nâng cao",
        snippet: "Suspense boundary cho phép stream từng phần HTML về client ngay khi sẵn sàng, không chờ toàn bộ trang...",
        score: 0.84,
        moduleId: "module-3",
        contentId: "content-streaming-ssr",
        deckId: null,
        taskId: null,
    },
]

const mixedItems: Array<SearchCourseContentItem> = [
    ...contentItems,
    {
        kind: "flashcard",
        title: "Bộ thẻ React Server Components",
        breadcrumb: null,
        snippet: "10 thẻ ôn tập nhanh về RSC, hydration và streaming.",
        score: 0.77,
        moduleId: null,
        contentId: null,
        deckId: "deck-rsc-flashcards",
        taskId: null,
    },
    {
        kind: "milestone",
        title: "Xây dashboard streaming với RSC",
        breadcrumb: "Milestone 2 - Ứng dụng thực tế",
        snippet: "Áp dụng Server Components để dựng dashboard cập nhật theo thời gian thực.",
        score: 0.68,
        moduleId: null,
        contentId: null,
        deckId: null,
        taskId: "task-rsc-dashboard",
    },
]

/** Dùng khi chatbot trả về danh sách bài học liên quan cho một câu hỏi cụ thể, để người học chọn nhảy tới đúng bài. */
export const Default: Story = {
    parameters: { usage: "Dùng khi chatbot trả về danh sách bài học liên quan cho một câu hỏi cụ thể, để người học chọn nhảy tới đúng bài." },
    render: () => (
        <div className="w-96">
            <ChatToolResult
                items={contentItems}
                label="Bài liên quan"
                icon={<FileTextIcon className="size-4" aria-hidden focusable="false" />}
                onSelect={() => {}}
            />
        </div>
    ),
}

/** Dùng khi tool đang chạy truy vấn, để giữ nguyên hình dạng danh sách bằng skeleton thay vì hiện spinner rời rạc. */
export const Loading: Story = {
    parameters: { usage: "Dùng khi tool đang chạy truy vấn, để giữ nguyên hình dạng danh sách bằng skeleton thay vì hiện spinner rời rạc." },
    render: () => (
        <div className="w-96">
            <ChatToolResult
                items={[]}
                label="Đang tìm bài liên quan"
                icon={<FileTextIcon className="size-4" aria-hidden focusable="false" />}
                isLoading
                onSelect={() => {}}
            />
        </div>
    ),
}

/** Dùng khi kết quả gồm nhiều loại nguồn khác nhau (bài học, flashcard, milestone), để mỗi dòng có chip phân biệt loại. */
export const MixedKinds: Story = {
    parameters: { usage: "Dùng khi kết quả gồm nhiều loại nguồn khác nhau (bài học, flashcard, milestone), để mỗi dòng có chip phân biệt loại." },
    render: () => (
        <div className="w-96">
            <ChatToolResult
                items={mixedItems}
                label="Kết quả tìm kiếm"
                icon={<CardsIcon className="size-4" aria-hidden focusable="false" />}
                showKindChip
                onSelect={() => {}}
            />
        </div>
    ),
}

/** Dùng khi danh sách bị cắt bớt so với tổng số kết quả thật, để người học có lối đi tiếp sang trang tìm kiếm đầy đủ. */
export const WithViewAll: Story = {
    parameters: { usage: "Dùng khi danh sách bị cắt bớt so với tổng số kết quả thật, để người học có lối đi tiếp sang trang tìm kiếm đầy đủ." },
    render: () => (
        <div className="w-96">
            <ChatToolResult
                items={contentItems}
                label="Bài liên quan"
                icon={<FileTextIcon className="size-4" aria-hidden focusable="false" />}
                onSelect={() => {}}
                onViewAll={() => {}}
                viewAllLabel="Xem tất cả kết quả"
            />
        </div>
    ),
}
