import type { Meta, StoryObj } from "@storybook/nextjs"
import { CardsIcon, MagnifyingGlassIcon } from "@phosphor-icons/react"
import { ChatToolResult } from "@/components/blocks/learn/ChatToolResult"
import type { SearchCourseContentItem } from "@/modules/api/graphql/queries/types/search-course-content"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof ChatToolResult> = {
    title: "Blocks/Learn/ChatToolResult",
    component: ChatToolResult,
}
export default meta
type Story = StoryObj<typeof ChatToolResult>

const FLASHCARD_ITEMS: Array<SearchCourseContentItem> = [
    {
        kind: "flashcard",
        title: "Ôn khái niệm đóng (closure) trong JavaScript",
        breadcrumb: null,
        snippet: "Bộ thẻ giúp bạn nhớ lại cách closure giữ tham chiếu biến ngoài scope lâu hơn cần thiết.",
        score: 0.87,
        moduleId: null,
        contentId: null,
        deckId: "deck-closure-101",
        taskId: null,
        isLocked: false,
    },
    {
        kind: "flashcard",
        title: "Event loop và microtask queue",
        breadcrumb: null,
        snippet: "So sánh thứ tự chạy giữa Promise.then và setTimeout trong Node.js.",
        score: 0.81,
        moduleId: null,
        contentId: null,
        deckId: "deck-event-loop-202",
        taskId: null,
        isLocked: false,
    },
]

const MIXED_KIND_ITEMS: Array<SearchCourseContentItem> = [
    {
        kind: "content",
        title: "Memory leak trong Node.js là gì",
        breadcrumb: "Module 4 · Debug hiệu năng Node.js",
        snippet: "Memory leak thường xuất phát từ closure giữ tham chiếu lâu hơn cần thiết hoặc listener quên gỡ.",
        score: 0.91,
        moduleId: "module-debug-nodejs",
        contentId: "lesson-memory-leak",
        deckId: null,
        taskId: null,
        isLocked: false,
    },
    {
        kind: "challenge",
        title: "Bài tập: tìm memory leak trong service Node",
        breadcrumb: "Module 4 · Debug hiệu năng Node.js",
        snippet: "",
        score: 0.86,
        moduleId: "module-debug-nodejs",
        contentId: "challenge-memory-leak",
        deckId: null,
        taskId: null,
        isLocked: true,
    },
    {
        kind: "milestone",
        title: "Task: Tối ưu hiệu năng API tra cứu",
        breadcrumb: "Milestone 2 · Xây dựng service tìm kiếm",
        snippet: "Đo lại thời gian phản hồi trước và sau khi thêm index cho các cột lọc thường xuyên.",
        score: 0.78,
        moduleId: null,
        contentId: null,
        deckId: null,
        taskId: "task-perf-search",
        isLocked: false,
    },
]

const SINGLE_ITEM: Array<SearchCourseContentItem> = [
    {
        kind: "flashcard",
        title: "Ôn khái niệm đóng (closure) trong JavaScript",
        breadcrumb: null,
        snippet: "Bộ thẻ giúp bạn nhớ lại cách closure giữ tham chiếu biến ngoài scope lâu hơn cần thiết.",
        score: 0.87,
        moduleId: null,
        contentId: null,
        deckId: "deck-closure-101",
        taskId: null,
        isLocked: false,
    },
]

/**
 * Every shape ChatToolResult renders inline inside an assistant ChatBubble
 * message part: the loading skeleton while a RAG tool call runs, a single-kind
 * result list with a view-all footer, a mixed-kind list with a locked row, and
 * a single-hit result. The component never renders an empty state itself — per
 * its own doc comment the caller shows a text fallback (not an empty card) when
 * nothing matched, so that shape is intentionally left out of this gallery.
 */
export const AllVariants: Story = {
    parameters: {
        usage: "Dùng ChatToolResult để hiển thị kết quả một tool call RAG ngay trong bong bóng chat của trợ lý: bật showKindChip khi danh sách trộn nhiều loại nguồn, tắt khi header đã nêu rõ một loại; isLoading để mô phỏng khung hàng bằng skeleton trong lúc tool đang chạy, không dùng spinner.",
    },
    render: () => (
        <Gallery>
            <Variant
                label="Đang tải"
                hint="Trong lúc tool RAG đang chạy, mirror hình dạng danh sách bằng hai hàng skeleton — không dùng spinner để tránh giật layout khi dữ liệu về."
            >
                <div className="w-96">
                    <ChatToolResult
                        items={[]}
                        label="Flashcard liên quan"
                        icon={<CardsIcon aria-hidden focusable="false" className="size-4" />}
                        isLoading
                        showKindChip
                        onSelect={() => {}}
                    />
                </div>
            </Variant>
            <Variant
                label="Một loại nguồn, có nút xem tất cả"
                hint="Header đã nêu rõ loại nguồn (Flashcard) nên tắt showKindChip; onViewAll mở view tìm kiếm đầy đủ khi danh sách còn nhiều hơn số hàng đang hiển thị."
            >
                <div className="w-96">
                    <ChatToolResult
                        items={FLASHCARD_ITEMS}
                        label="Flashcard liên quan"
                        icon={<CardsIcon aria-hidden focusable="false" className="size-4" />}
                        onSelect={() => {}}
                        onViewAll={() => {}}
                        viewAllLabel="Xem tất cả kết quả"
                    />
                </div>
            </Variant>
            <Variant
                label="Nhiều loại trộn lẫn, có mục bị khoá"
                hint="Khi một câu hỏi khớp nhiều loại nguồn (bài học, bài tập, milestone), bật showKindChip để phân biệt từng hàng; hàng isLocked hiện badge khoá thay vì đoạn trích, nhưng vẫn bấm được để dẫn học viên tới cổng đăng ký học."
            >
                <div className="w-96">
                    <ChatToolResult
                        items={MIXED_KIND_ITEMS}
                        label="Kết quả liên quan"
                        icon={<MagnifyingGlassIcon aria-hidden focusable="false" className="size-4" />}
                        showKindChip
                        onSelect={() => {}}
                    />
                </div>
            </Variant>
            <Variant
                label="Chỉ một kết quả"
                hint="Khi tool chỉ tìm ra đúng một nguồn khớp, danh sách vẫn hiện số lượng (1) ở góc phải header và không có nút xem tất cả vì không còn gì để mở rộng."
            >
                <div className="w-96">
                    <ChatToolResult
                        items={SINGLE_ITEM}
                        label="Flashcard liên quan"
                        icon={<CardsIcon aria-hidden focusable="false" className="size-4" />}
                        onSelect={() => {}}
                    />
                </div>
            </Variant>
        </Gallery>
    ),
}
