import type { Meta, StoryObj } from "@storybook/nextjs"
import { MindMapNodeDrawerView } from "@/components/drawers/MindMapNodeDrawer"
import type { SearchCourseContentItem } from "@/modules/api/graphql/queries/types/search-course-content"

/** Relevance-ordered RAG hits across all four kinds, as `searchCourseContent` returns them. */
const RESULTS: Array<SearchCourseContentItem> = [
    { kind: "content", title: "Resumable upload với tus protocol: resume sau khi mất mạng", breadcrumb: "File Upload & Storage", snippet: "tus dùng PATCH + Upload-Offset để tiếp tục đúng byte đang dở…", score: 0.91, moduleId: "m1", contentId: "c1", deckId: null, taskId: null },
    { kind: "content", title: "Chunked upload with progress tracking", breadcrumb: "File Upload & Storage", snippet: "Chia file thành phần nhỏ, theo dõi tiến độ từng chunk…", score: 0.78, moduleId: "m1", contentId: "c2", deckId: null, taskId: null },
    { kind: "flashcard", title: "tus protocol hoạt động thế nào?", breadcrumb: null, snippet: "PATCH request mang Upload-Offset để nối tiếp phần đã tải…", score: 0.74, moduleId: null, contentId: null, deckId: "d1", taskId: null },
    { kind: "challenge", title: "Cài tus server + resume một upload 2GB bị ngắt", breadcrumb: "File Upload & Storage", snippet: "Chứng minh upload tiếp tục đúng offset sau khi rớt mạng…", score: 0.83, moduleId: "m1", contentId: "c3", deckId: null, taskId: null },
    { kind: "milestone", title: "Task: pipeline upload resumable cho video", breadcrumb: "Capstone · Media Service", snippet: "Ghép tus vào service upload video của đồ án cuối khoá…", score: 0.69, moduleId: null, contentId: null, deckId: null, taskId: "t1" },
]

const meta: Meta<typeof MindMapNodeDrawerView> = {
    title: "Drawers/MindMapNodeDrawer",
    component: MindMapNodeDrawerView,
    tags: ["news"],
    args: {
        keyword: "Resumable upload với tus protocol",
        courseDisplayId: "fullstack-mastery",
        isOpen: true,
        onClose: () => {},
        onRetry: () => {},
        results: [],
        isLoading: false,
        isError: false,
    },
    parameters: {
        docs: {
            description: {
                component:
                    "Node-detail drawer của Sơ đồ tư duy: bấm 1 node KEYWORD → RAG (`searchCourseContent`) trả các bề mặt LIÊN QUAN theo NGHĨA (không phải authored link cứng), gộp theo loại (Nội dung / Flashcard / Thử thách / Milestone), mỗi dòng là 1 jump link. Đây là VIEW presentational (nhận `results`/`isLoading`/`isError` làm prop) — container `MindMapNodeDrawer` bọc SWR.",
            },
        },
    },
}

export default meta
type Story = StoryObj<typeof MindMapNodeDrawerView>

/** Có kết quả — RAG trả hits đủ 4 loại, gộp thành 4 nhóm labeled-list, mỗi dòng jump link. */
export const Results: Story = {
    args: { results: RESULTS },
    parameters: {
        usage: "Chờ duyệt — bấm node keyword trên mind-map: RAG trả bề mặt liên quan (lesson/flashcard/challenge/milestone), gộp theo loại, giữ thứ tự relevance trong mỗi nhóm.",
    },
}

/** Có mô tả — keyword kèm explainer (`course.mind_map` desc) render TRÊN phần RAG: đọc là hiểu concept ngay trong drawer, chưa cần vào bài. */
export const WithDescription: Story = {
    args: {
        results: RESULTS,
        desc: "Resumable upload cho phép tiếp tục một lần tải file dở dang thay vì tải lại từ đầu sau khi mất mạng. Giao thức tus dùng PATCH kèm header Upload-Offset để server biết nối tiếp từ byte nào; đánh đổi là client phải theo dõi offset và server phải lưu trạng thái phần đã nhận.",
    },
    parameters: {
        usage: "Chờ duyệt — node kèm mô tả (desc author trong course.mind_map): giải thích concept ngay trong drawer, phía trên các bề mặt RAG liên quan.",
    },
}

/** Đang tải — skeleton mirror trong lúc gọi embedding + Qdrant. */
export const Loading: Story = {
    args: { isLoading: true },
    parameters: { usage: "Chờ duyệt — trạng thái đang chạy RAG (embed keyword + search Qdrant)." },
}

/** Rỗng — keyword chưa index hoặc không có bề mặt nào liên quan (không ngõ cụt: mind-map vẫn ngay sau lưng). */
export const Empty: Story = {
    args: { results: [], keyword: "Một khái niệm chưa có nội dung" },
    parameters: { usage: "Chờ duyệt — không tìm thấy phần liên quan cho keyword." },
}

/** Lỗi — RAG search fail → tiêu đề lỗi + nút thử lại. */
export const ErrorState: Story = {
    args: { isError: true },
    parameters: { usage: "Chờ duyệt — RAG search lỗi, hiện retry." },
}
