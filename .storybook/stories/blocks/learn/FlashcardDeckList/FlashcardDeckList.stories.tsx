import type { Meta, StoryObj } from "@storybook/nextjs"
import { FlashcardDeckList, type FlashcardDeckListDeck } from "./FlashcardDeckList"
import { BlockAnatomy, type AnatomyNode } from "../../layout/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — the flashcard-deck browse REGION (search + count + grid/line toggle +
 * the deck grid), not a lone card. It owns the real states through `AsyncContent`:
 * loading (skeleton grid) · empty (no decks) · error · search-empty · data. The
 * grid composes the `DeckCard` item.
 *
 * ANATOMY IS PER-LEAF: each state below is its OWN leaf and carries its OWN
 * BlockAnatomy axis (Sơ đồ + Cây) reflecting the parts THAT leaf composes — there
 * is no separate consolidated "Anatomy" story.
 */
const meta: Meta<typeof FlashcardDeckList> = {
    title: "Block/Learn/FlashcardDeckList",
    component: FlashcardDeckList,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}
export default meta

type Story = StoryObj<typeof FlashcardDeckList>

const DECKS: Array<FlashcardDeckListDeck> = [
    { id: "1", title: "Module 1: Nền tảng Backend", description: "Câu hỏi phỏng vấn về những ý tưởng nền tảng của mọi backend framework — inversion of control, thứ tự tầng cố định.", difficulty: "advanced", dueCount: 20, masteredCount: 0, cardCount: 20 },
    { id: "2", title: "Thiết kế API: REST & GraphQL Contract", description: "Câu hỏi phỏng vấn về những contract mà một API HTTP/GraphQL phơi ra: semantics của method và status code.", difficulty: "advanced", dueCount: 20, masteredCount: 3, cardCount: 20 },
    { id: "3", title: "Auth, Phân quyền & Web Security", description: "Câu hỏi phỏng vấn về việc danh tính, kiểm soát truy cập, và niềm tin của trình duyệt thực sự vận hành ra sao.", difficulty: "advanced", dueCount: 20, masteredCount: 0, cardCount: 20 },
    { id: "4", title: "Cơ sở dữ liệu & ORM", description: "Câu hỏi phỏng vấn về mô hình dữ liệu quan hệ đằng sau mọi ORM — trade-off SQL vs NoSQL, cardinality.", difficulty: "advanced", dueCount: 20, masteredCount: 12, cardCount: 20 },
    { id: "5", title: "Caching, Hiệu Năng & Khả Năng Mở Rộng", description: "Câu hỏi phỏng vấn về việc làm cho backend nhanh và mở rộng được: ba tầng cache (in-process, Redis).", difficulty: "insane", dueCount: 20, masteredCount: 0, cardCount: 20 },
    { id: "6", title: "Module 5: Xử lý nền & Messaging", description: "Câu hỏi phỏng vấn về những ý tưởng nền tảng đằng sau mọi hệ job-queue / message-broker.", difficulty: "advanced", dueCount: 20, masteredCount: 5, cardCount: 20 },
]

/** Frame each leaf's anatomy panel with breathing room. */
const frame = (node: React.ReactNode) => <div className="mx-auto max-w-4xl p-8">{node}</div>

// The region chrome (search row) — ALWAYS visible; only AsyncContent's body swaps
// per leaf. The DeckCard grid is the CONTENT branch of AsyncContent, so it nests
// UNDER AsyncContent.children (not as a sibling). Each DeckCard in turn composes
// its own title/chips/meter/count/CTA in DOM order.
const DATA_PARTS: Array<AnatomyNode> = [
    { name: "TextField · Input", tier: "primitive", role: "ô tìm bộ thẻ" },
    { name: "Typography", tier: "primitive", role: "đếm kết quả (\"Tìm thấy N bộ thẻ\")" },
    { name: "TabsCard", tier: "primitive", role: "đổi kiểu hiển thị lưới / danh sách" },
    {
        name: "AsyncContent",
        tier: "primitive",
        role: "switch error → loading → empty → content",
        state: "content",
        children: [
            {
                name: "DeckCard",
                tier: "design",
                role: "một bộ thẻ (block con, lặp ×N trong lưới)",
                children: [
                    { name: "Typography", tier: "primitive", role: "tên bộ thẻ (line-clamp 2)" },
                    { name: "StatusChip", tier: "primitive", role: "số thẻ đến hạn ôn", state: "warning" },
                    { name: "DifficultyChip", tier: "design", role: "tầng độ khó" },
                    { name: "Typography", tier: "primitive", role: "mô tả chủ đề (muted, line-clamp 2)" },
                    { name: "ProgressMeter", tier: "primitive", role: "tiến độ đã thuộc" },
                    { name: "Typography", tier: "primitive", role: "tổng số thẻ (\"N thẻ\", muted)" },
                    { name: "Button", tier: "primitive", role: "CTA \"Học\"" },
                ],
            },
        ],
    },
]

// search-empty leaf: decks.length > 0 so AsyncContent stays on the CONTENT branch,
// but filteredDecks is empty → the body swaps to a muted "không khớp" Typography
// (no DeckCard). It is NOT a distinct AsyncContent state — it lives inside content.
const SEARCH_EMPTY_PARTS: Array<AnatomyNode> = [
    { name: "TextField · Input", tier: "primitive", role: "ô tìm (giữ query)" },
    { name: "Typography", tier: "primitive", role: "đếm kết quả (\"Tìm thấy 0 bộ thẻ\")" },
    { name: "TabsCard", tier: "primitive", role: "toggle lưới / danh sách" },
    {
        name: "AsyncContent",
        tier: "primitive",
        role: "nhánh content — body đổi sang Typography muted \"Không tìm thấy bộ thẻ nào khớp…\" thay cho lưới DeckCard",
        state: "content",
        children: [
            { name: "Typography", tier: "primitive", role: "thông báo không khớp query (thay cho lưới DeckCard)" },
        ],
    },
]

// loading leaf: chrome stays (count slot → Skeleton.Typography), AsyncContent takes
// its loading branch → the skeleton grid of skeleton DeckCards nested under it.
const LOADING_PARTS: Array<AnatomyNode> = [
    { name: "TextField · Input", tier: "primitive", role: "ô tìm (vẫn hiện)" },
    { name: "Typography", tier: "primitive", role: "đếm — Skeleton.Typography mirror" },
    { name: "TabsCard", tier: "primitive", role: "toggle (vẫn hiện)" },
    {
        name: "AsyncContent",
        tier: "primitive",
        role: "nhánh loading → lưới skeleton",
        state: "loading",
        children: [
            { name: "DeckCard", tier: "design", role: "skeleton mirror ×4 (giữ đúng footprint)", state: "skeleton" },
        ],
    },
]

// empty leaf: chrome stays, AsyncContent falls to EmptyContent, which itself
// composes the EmptyState primitive (TrayIcon + title, no action button).
const EMPTY_PARTS: Array<AnatomyNode> = [
    { name: "TextField · Input", tier: "primitive", role: "ô tìm" },
    { name: "Typography", tier: "primitive", role: "đếm kết quả (\"Tìm thấy 0 bộ thẻ\")" },
    { name: "TabsCard", tier: "primitive", role: "toggle" },
    {
        name: "AsyncContent",
        tier: "primitive",
        role: "nhánh empty",
        state: "empty",
        children: [
            {
                name: "EmptyContent",
                tier: "design",
                role: "khung rỗng của region",
                children: [
                    { name: "EmptyState", tier: "primitive", role: "TrayIcon + \"Chưa có bộ thẻ nào\" (không nút)" },
                ],
            },
        ],
    },
]

// error leaf: chrome stays, AsyncContent falls to ErrorContent → EmptyState
// (tone danger, WarningIcon + title). NOTE: onRetry is passed but retryLabel is
// NOT, so EmptyState renders NO retry Button — the anatomy reflects that reality.
const ERROR_PARTS: Array<AnatomyNode> = [
    { name: "TextField · Input", tier: "primitive", role: "ô tìm" },
    { name: "Typography", tier: "primitive", role: "đếm kết quả (\"Tìm thấy 0 bộ thẻ\")" },
    { name: "TabsCard", tier: "primitive", role: "toggle" },
    {
        name: "AsyncContent",
        tier: "primitive",
        role: "nhánh error",
        state: "error",
        children: [
            {
                name: "ErrorContent",
                tier: "design",
                role: "khung lỗi của region",
                children: [
                    { name: "EmptyState", tier: "primitive", role: "WarningIcon + \"Không tải được bộ thẻ\" — KHÔNG nút thử lại (thiếu retryLabel)", state: "danger" },
                ],
            },
        ],
    },
]

/** DATA — the real region with decks (grid view, search + count + toggle). */
export const Default: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="FlashcardDeckList"
                tier="block"
                leaf="Có dữ liệu"
                parts={DATA_PARTS}
                reason="Gộp search + đếm kết quả + toggle lưới/danh sách + lưới thẻ vào MỘT region, để AsyncContent cầm mọi state (loading · empty · error · search-empty · content) tại một chỗ; mỗi thẻ tái dùng block con DeckCard thay vì dựng lại tay."
            >
                <FlashcardDeckList decks={DECKS.slice(0, 2)} showAnatomy onOpenDeck={() => {}} />
            </BlockAnatomy>,
        ),
}

/** SEARCH (filtered) — a query that narrows the grid; SAME composition as data. */
export const SearchFiltered: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="FlashcardDeckList"
                tier="block"
                leaf="Tìm có kết quả"
                parts={DATA_PARTS}
                note="Lọc query → lưới thu hẹp nhưng CÙNG composition với leaf 'Có dữ liệu'."
            >
                <FlashcardDeckList decks={DECKS} defaultQuery="API" showAnatomy onOpenDeck={() => {}} />
            </BlockAnatomy>,
        ),
}

/** SEARCH (no result) — a query that matches nothing → the search-empty line. */
export const SearchNoResult: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="FlashcardDeckList"
                tier="block"
                leaf="Tìm rỗng"
                parts={SEARCH_EMPTY_PARTS}
                note="Query không khớp → body đổi sang dòng muted 'Không tìm thấy…', KHÔNG có DeckCard (khác leaf data)."
            >
                <FlashcardDeckList decks={DECKS} defaultQuery="zzz-không-khớp" showAnatomy onOpenDeck={() => {}} />
            </BlockAnatomy>,
        ),
}

/** LOADING — no decks yet + isLoading → skeleton deck grid (same footprint). */
export const Loading: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="FlashcardDeckList"
                tier="block"
                leaf="Đang tải"
                parts={LOADING_PARTS}
                note="AsyncContent nhánh loading → lưới DeckCard skeleton mirror, composition khác leaf data (không thẻ thật)."
            >
                <FlashcardDeckList decks={[]} isLoading showAnatomy onOpenDeck={() => {}} />
            </BlockAnatomy>,
        ),
}

/** EMPTY — loaded, zero decks → EmptyContent. */
export const Empty: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="FlashcardDeckList"
                tier="block"
                leaf="Rỗng"
                parts={EMPTY_PARTS}
                note="Không có bộ thẻ → AsyncContent rơi về EmptyContent trong khung region."
            >
                <FlashcardDeckList decks={[]} showAnatomy onOpenDeck={() => {}} />
            </BlockAnatomy>,
        ),
}

/** ERROR — load failed with no cached decks → ErrorContent + retry. */
export const Error: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="FlashcardDeckList"
                tier="block"
                leaf="Lỗi"
                parts={ERROR_PARTS}
                note="Tải hỏng, không cache → AsyncContent rơi về ErrorContent → EmptyState (tone danger). Không truyền retryLabel nên KHÔNG có nút thử lại."
            >
                <FlashcardDeckList decks={[]} error={new globalThis.Error("network")} onRetry={() => {}} showAnatomy onOpenDeck={() => {}} />
            </BlockAnatomy>,
        ),
}
