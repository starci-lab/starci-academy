import type { Meta, StoryObj } from "@storybook/nextjs"
import React from "react"
import { CardsIcon, SparkleIcon, ListMagnifyingGlassIcon, PuzzlePieceIcon, BookOpenIcon } from "@phosphor-icons/react"
import { ChatThread, type ChatThreadMessage } from "./ChatThread"
import { BlockAnatomy, type AnatomyNode } from "../../layout/BlockAnatomy/BlockAnatomy"
import type { SearchCourseContentItem } from "../EntityResultRow/EntityResultRow"

/**
 * BLOCK — the AI-chat message THREAD (the scrolling conversation region). One function:
 * render the turn list. Each turn is a ChatBubble; the assistant turn is a 4-way ladder
 * (tool-result · thinking · quota-error · markdown). An empty thread shows a hint +
 * suggestion chips. Distinct from the conversation-history block and the composer block.
 */
const meta: Meta<typeof ChatThread> = {
    title: "Block/Learn/ChatThread",
    component: ChatThread,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}
export default meta

type Story = StoryObj<typeof ChatThread>

/** Frame each leaf on the chat-bubble surface (the thread sits on a filled panel). */
const frame = (node: React.ReactNode) => (
    <div className="p-8">
        <div className="w-full max-w-md rounded-2xl bg-surface p-3 shadow-surface">{node}</div>
    </div>
)

const TOOL_ITEMS: Array<SearchCourseContentItem> = [
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

const Q: ChatThreadMessage = { id: "u1", role: "user", content: "closure trong JS là gì và khi nào dễ gây memory leak?" }
const ANSWER_MD =
    "**Closure** là hàm “nhớ” được scope nơi nó sinh ra — nó giữ tham chiếu tới biến ngoài ngay cả sau khi hàm cha đã `return`.\n\nMemory leak xảy ra khi closure giữ tham chiếu **sống lâu hơn cần thiết** (ví dụ một listener quên gỡ)."

// ── Anatomy trees per state ──────────────────────────────────────────────────
const USER_BUBBLE: AnatomyNode = { name: "ChatBubble.User", tier: "primitive", role: "tin nhắn người dùng — canh phải, nền accent-soft" }

const EMPTY_PARTS: Array<AnatomyNode> = [
    { name: "Typography.Suggestion", tier: "primitive", role: "dòng gợi ý khi thread rỗng (muted)" },
    { name: "Button.Suggestion", tier: "primitive", role: "nút gợi ý / kỹ năng truy hồi (lặp ×N)" },
]

/** Rỗng — scope="content" (bài học đang mở): hint + cụm 3 nút gợi ý + cụm 2 nút kỹ năng. */
const EMPTY_CONTENT_SCOPE_PARTS: Array<AnatomyNode> = [
    { name: "Typography.Suggestion", tier: "primitive", role: "dòng hint scope bài học (muted) — 'Hỏi bất cứ điều gì về nội dung này.'" },
    {
        name: "ChipButtonList.Suggestion",
        tier: "primitive",
        role: "cụm 3 nút câu hỏi mẫu (tóm tắt / khó nhất / ví dụ) — chỉ hiện khi scope=\"content\", vì chỉ lesson mới có 'bài này' để tóm tắt",
        children: [{ name: "Button", tier: "primitive", role: "nút gợi ý (lặp ×3)" }],
    },
    {
        name: "ChipButtonList.Skill",
        tier: "primitive",
        role: "cụm 2 nút kỹ năng truy hồi (tìm challenges của bài · tìm thẻ ôn của bài)",
        children: [{ name: "Button", tier: "primitive", role: "nút kỹ năng (lặp ×2)" }],
    },
]

/** Rỗng — scope="course" (chưa mở bài nào): hint khác + KHÔNG có cụm gợi ý + cụm 3 nút kỹ năng. */
const EMPTY_COURSE_SCOPE_PARTS: Array<AnatomyNode> = [
    { name: "Typography.Suggestion", tier: "primitive", role: "dòng hint scope khoá (muted) — 'Bạn chưa mở bài nào. Cứ hỏi bất cứ điều gì về cả khoá này.'" },
    {
        name: "ChipButtonList.Skill",
        tier: "primitive",
        role: "cụm 3 nút kỹ năng (tìm bài học · tìm challenges · tìm thẻ ôn trong khoá) — KHÔNG có cụm gợi ý vì course không có 'bài này' để tóm tắt",
        children: [{ name: "Button", tier: "primitive", role: "nút kỹ năng (lặp ×3)" }],
    },
]

/** Rỗng khi đang bôi đen — không render gì (gap có chủ đích của source). */
const EMPTY_SELECTION_PARTS: Array<AnatomyNode> = []

const SESSION_ERROR_PARTS: Array<AnatomyNode> = [
    USER_BUBBLE,
    {
        name: "ChatBubble.Assistant",
        tier: "primitive",
        role: "tin nhắn trợ lý báo tạo phiên thất bại — text THƯỜNG, không phải quota/error state",
        children: [{ name: "MarkdownContent", tier: "block", role: "'⚠️ Không gửi được — không tạo được hội thoại…' render như markdown thường, KHÔNG có CTA nâng cấp hay nút thử lại" }],
    },
]

const CONVERSATION_PARTS: Array<AnatomyNode> = [
    USER_BUBBLE,
    {
        name: "ChatBubble.Assistant",
        tier: "primitive",
        role: "tin nhắn trợ lý — canh trái",
        children: [{ name: "MarkdownContent", tier: "block", role: "câu trả lời render markdown (đậm/xuống dòng/code)" }],
    },
]

const TOOLRESULT_PARTS: Array<AnatomyNode> = [
    USER_BUBBLE,
    {
        name: "ChatBubble.Assistant",
        tier: "primitive",
        role: "tin nhắn trợ lý ôm kết quả RAG",
        children: [{ name: "ChatToolResult", tier: "block", role: "kết quả RAG — 1 block (NestedCard + EntityResultRow + SeeMoreLink)" }],
    },
]

const THINKING_PARTS: Array<AnatomyNode> = [
    USER_BUBBLE,
    {
        name: "ChatBubble.Assistant",
        tier: "primitive",
        role: "tin nhắn trợ lý đang stream",
        children: [{ name: "Typography.Thinking", tier: "primitive", role: "dòng 'Đang soạn…' (muted) khi content rỗng" }],
    },
]

const QUOTA_PARTS: Array<AnatomyNode> = [
    USER_BUBBLE,
    {
        name: "ChatBubble.Assistant",
        tier: "primitive",
        role: "tin nhắn trợ lý báo hết quota",
        children: [
            { name: "MarkdownContent", tier: "block", role: "thông báo hết credit (markdown)" },
            { name: "Button.Upgrade", tier: "primitive", role: "CTA nâng cấp gói AI (primary sm + mũi tên)" },
        ],
    },
]

const SKELETON_PARTS: Array<AnatomyNode> = [
    {
        name: "ChatBubble.Skeleton",
        tier: "primitive",
        role: "bubble giả mirror hình dạng tin nhắn (user ngắn + assistant nhiều dòng) — lặp khi tải",
        state: "skeleton",
    },
]

const ERROR_PARTS: Array<AnatomyNode> = [
    USER_BUBBLE,
    {
        name: "ChatBubble.Assistant",
        tier: "primitive",
        role: "tin nhắn trợ lý gặp lỗi — không trả lời được",
        state: "error",
        children: [
            { name: "InlineIconLabel.Error", tier: "primitive", role: "dòng lỗi (icon cảnh báo + text tone danger)" },
            { name: "Button.Retry", tier: "primitive", role: "CTA thử lại (secondary sm + icon xoay)" },
        ],
    },
]

/** EMPTY — a fresh thread: a muted hint + suggestion / retrieval-skill chips. */
export const Empty: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="ChatThread"
                tier="block"
                leaf="Empty"
                parts={EMPTY_PARTS}
                reason="Thread rỗng cần mời người học bắt đầu: 1 dòng gợi ý + các nút câu hỏi mẫu / kỹ năng truy hồi. Không có ChatBubble nào."
            >
                <ChatThread
                    messages={[]}
                    emptyHint="Hỏi AI bất cứ điều gì về bài học này — giải thích khái niệm, gợi ý ví dụ, hoặc tìm nội dung liên quan."
                    suggestions={[
                        { label: "Tóm tắt bài", icon: <SparkleIcon aria-hidden focusable="false" /> },
                        { label: "Phần khó nhất?", icon: <SparkleIcon aria-hidden focusable="false" /> },
                        { label: "Tìm flashcard", icon: <ListMagnifyingGlassIcon aria-hidden focusable="false" /> },
                    ]}
                    showAnatomy
                />
            </BlockAnatomy>,
        ),
}

/** CONVERSATION — a user turn + a normal assistant answer (markdown). */
export const Conversation: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="ChatThread"
                tier="block"
                leaf="Conversation"
                parts={CONVERSATION_PARTS}
                note="Một lượt hỏi–đáp: bubble user (text) + bubble trợ lý render câu trả lời qua MarkdownContent."
            >
                <ChatThread messages={[Q, { id: "a1", role: "assistant", content: ANSWER_MD }]} showAnatomy />
            </BlockAnatomy>,
        ),
}

/** WITH TOOL RESULT — the assistant turn carries a RAG ChatToolResult. */
export const WithToolResult: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="ChatThread"
                tier="block"
                leaf="WithToolResult"
                parts={TOOLRESULT_PARTS}
                note="Lượt trợ lý mang toolResult → intro ngắn + ChatToolResult (danh sách flashcard) ngay trong bubble."
            >
                <ChatThread
                    messages={[
                        Q,
                        {
                            id: "a1",
                            role: "assistant",
                            content: "",
                            toolResult: {
                                intro: "Dưới đây là vài thẻ ôn liên quan:",
                                label: "Flashcard liên quan",
                                icon: <CardsIcon aria-hidden focusable="false" />,
                                items: TOOL_ITEMS,
                                onViewAll: () => {},
                                viewAllLabel: "Xem tất cả kết quả",
                            },
                        },
                    ]}
                    onSelectHit={() => {}}
                    showAnatomy
                />
            </BlockAnatomy>,
        ),
}

/** THINKING — an in-flight assistant turn (empty content → muted “đang soạn”). */
export const Thinking: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="ChatThread"
                tier="block"
                leaf="Thinking"
                parts={THINKING_PARTS}
                note="Trợ lý đang stream (content rỗng) → bubble chỉ có dòng 'Đang soạn…' (muted), chưa có nội dung."
            >
                <ChatThread messages={[Q, { id: "a1", role: "assistant", content: "" }]} showAnatomy />
            </BlockAnatomy>,
        ),
}

/** SKELETON — past turns are loading → mirror bubbles (a short user + a taller assistant). */
export const Skeleton: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="ChatThread"
                tier="block"
                leaf="Skeleton"
                parts={SKELETON_PARTS}
                note="Đang tải lịch sử tin nhắn → bubble giả (Skeleton.Typography) giữ đúng hình dạng thread, không giật khi resolve."
            >
                <ChatThread messages={[]} isLoading showAnatomy />
            </BlockAnatomy>,
        ),
}

/** ERROR — the assistant turn failed (couldn't respond) → an error line + a retry CTA. */
export const Error: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="ChatThread"
                tier="block"
                leaf="Error"
                parts={ERROR_PARTS}
                note="Yêu cầu thất bại (mạng/dịch vụ) → lượt trợ lý hiện dòng lỗi (InlineIconLabel tone danger) + nút thử lại, thay cho câu trả lời."
            >
                <ChatThread
                    messages={[Q, { id: "a1", role: "assistant", isError: true, content: "" }]}
                    onRetry={() => {}}
                    showAnatomy
                />
            </BlockAnatomy>,
        ),
}

/** QUOTA ERROR — the assistant turn hit the AI quota → an upgrade CTA instead of an answer. */
export const QuotaError: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="ChatThread"
                tier="block"
                leaf="QuotaError"
                parts={QUOTA_PARTS}
                note="Lượt trợ lý gặp giới hạn AI → MarkdownContent báo hết credit + nút nâng cấp (thay cho câu trả lời)."
            >
                <ChatThread
                    messages={[
                        Q,
                        {
                            id: "a1",
                            role: "assistant",
                            isQuotaError: true,
                            content: "Bạn đã **dùng hết credit AI tuần này**. Nâng cấp để tiếp tục hỏi không giới hạn.",
                        },
                    ]}
                    onUpgrade={() => {}}
                    showAnatomy
                />
            </BlockAnatomy>,
        ),
}

/** RỖNG — PHẠM VI BÀI HỌC — a lesson is open: hint + 3 suggestion chips (tóm tắt/khó nhất/ví dụ) + 2 skill chips (challenges/flashcards). */
export const EmptyContentScope: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="ChatThread"
                tier="block"
                leaf="EmptyContentScope"
                parts={EMPTY_CONTENT_SCOPE_PARTS}
                note={"scope=\"content\" (đang mở 1 bài) → hint riêng + cụm gợi ý (3 nút, chỉ scope này có) + cụm kỹ năng (2 nút)."}
                reason="Chỉ lesson mới có 'bài này' để tóm tắt/hỏi khó nhất/xin ví dụ — course hay task/challenge/foundation không có, nên cụm gợi ý CHỈ hiện ở scope content (source isContentScope gate, index.tsx:1329)."
            >
                <ChatThread
                    messages={[]}
                    scope="content"
                    emptyHint="Hỏi bất cứ điều gì về nội dung này."
                    suggestions={[
                        { label: "Tóm tắt bài này trong 3 ý chính" },
                        { label: "Giải thích phần khó nhất" },
                        { label: "Cho mình ví dụ thực tế" },
                    ]}
                    skills={[
                        { label: "Tìm thử thách của bài này", icon: <PuzzlePieceIcon aria-hidden focusable="false" /> },
                        { label: "Tìm thẻ ôn của bài này", icon: <CardsIcon aria-hidden focusable="false" /> },
                    ]}
                    showAnatomy
                />
            </BlockAnatomy>,
        ),
}

/** RỖNG — PHẠM VI KHOÁ — no lesson open: hint khác + KHÔNG có cụm gợi ý + 3 skill chips (lessons/challenges/flashcards). */
export const EmptyCourseScope: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="ChatThread"
                tier="block"
                leaf="EmptyCourseScope"
                parts={EMPTY_COURSE_SCOPE_PARTS}
                note={"scope=\"course\" (chưa mở bài nào) → hint khác + KHÔNG có cụm gợi ý (0 nút) + cụm kỹ năng dẫn đầu bằng 'tìm bài học' (3 nút)."}
                reason="Course-wide không có 'bài này' để tóm tắt, nên cụm gợi ý biến mất hoàn toàn (không phải rỗng-ẩn, mà KHÔNG render); cụm kỹ năng thêm 'tìm bài học' lên đầu vì việc hữu ích đầu tiên khi chưa ở trong bài nào là tìm một bài (source EMPTY_STATE_SKILLS, index.tsx:138-147)."
            >
                <ChatThread
                    messages={[]}
                    scope="course"
                    emptyHint="Bạn chưa mở bài nào. Cứ hỏi bất cứ điều gì về cả khoá này."
                    skills={[
                        { label: "Tìm bài học trong khoá", icon: <BookOpenIcon aria-hidden focusable="false" /> },
                        { label: "Tìm thử thách trong khoá", icon: <PuzzlePieceIcon aria-hidden focusable="false" /> },
                        { label: "Tìm thẻ ôn trong khoá", icon: <CardsIcon aria-hidden focusable="false" /> },
                    ]}
                    showAnatomy
                />
            </BlockAnatomy>,
        ),
}

/** RỖNG — ĐANG BÔI ĐEN — a passage is selected and no turn has happened yet: the thread renders NOTHING. */
export const EmptySelection: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="ChatThread"
                tier="block"
                leaf="EmptySelection"
                parts={EMPTY_SELECTION_PARTS}
                note="Có đoạn được bôi đen (selection) NHƯNG chưa có lượt hỏi nào → thread rỗng HOÀN TOÀN: không hint, không nút."
                reason="Đây là GAP có chủ đích của source (gate `messages.length === 0 && !selection`, index.tsx:1319): khi có selection, đoạn được chọn + quick-asks của riêng nó đã hiện Ở TRÊN (trong rail, ngoài block này) — nên bản thân vùng thread không cần lặp lại hint/gợi ý, chấp nhận trống."
            >
                <ChatThread messages={[]} hasSelection showAnatomy />
            </BlockAnatomy>,
        ),
}

/** LỖI TẠO PHIÊN — session creation failed on first send → a plain-markdown assistant turn, distinct from Error/QuotaError. */
export const SessionCreateError: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="ChatThread"
                tier="block"
                leaf="SessionCreateError"
                parts={SESSION_ERROR_PARTS}
                note="Gửi câu hỏi đầu tiên nhưng tạo phiên (conversation) thất bại → lượt trợ lý hiện thông điệp '⚠️ gửi thất bại' như MỘT CÂU TRẢ LỜI THƯỜNG (MarkdownContent), KHÔNG phải trạng thái isError hay isQuotaError."
                reason="Phân biệt với leaf Error (InlineIconLabel tone danger + nút thử lại) và leaf QuotaError (CTA nâng cấp): ở đây source chỉ push một tin nhắn assistant có content bắt đầu bằng '⚠️' rồi return — không gắn cờ isError/isQuotaError, không có CTA nào (source :744-749)."
            >
                <ChatThread
                    messages={[
                        Q,
                        { id: "a1", role: "assistant", content: "⚠️ Không gửi được — không tạo được hội thoại. Kiểm tra kết nối rồi thử lại." },
                    ]}
                    showAnatomy
                />
            </BlockAnatomy>,
        ),
}
