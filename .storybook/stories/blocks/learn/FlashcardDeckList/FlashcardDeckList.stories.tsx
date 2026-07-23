import type { Meta, StoryObj } from "@storybook/nextjs"
import { FlashcardDeckList, type FlashcardDeckListDeck } from "./FlashcardDeckList"

/**
 * BLOCK — the flashcard-deck browse REGION (search + count + grid/line toggle +
 * the deck grid), not a lone card. It owns the real states through `AsyncContent`:
 * loading (skeleton grid) · empty (no decks) · error · search-empty · data. The
 * grid composes the `DeckCard` item.
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

const shell = (node: React.ReactNode) => <div className="mx-auto max-w-4xl p-8">{node}</div>

/** DATA — the real region with decks (grid view, search + count + toggle). */
export const Default: Story = {
    render: () => shell(<FlashcardDeckList decks={DECKS} onOpenDeck={() => {}} />),
}

/**
 * ANATOMY — the composition tree made visible: the block (amber) frames the
 * region; inside, primitives (accent) — TextField/Input · Typography · TabsCard ·
 * AsyncContent — and the DeckCard design (green) are each tagged.
 */
export const Anatomy: Story = {
    render: () => shell(<FlashcardDeckList decks={DECKS.slice(0, 2)} showAnatomy onOpenDeck={() => {}} />),
}

/** SEARCH (no result) — a query that matches nothing → the search-empty line. */
export const SearchNoResult: Story = {
    render: () => shell(<FlashcardDeckList decks={DECKS} defaultQuery="zzz-không-khớp" onOpenDeck={() => {}} />),
}

/** SEARCH (filtered) — a query that narrows the grid. */
export const SearchFiltered: Story = {
    render: () => shell(<FlashcardDeckList decks={DECKS} defaultQuery="API" onOpenDeck={() => {}} />),
}

/** LOADING — no decks yet + isLoading → skeleton deck grid (same footprint). */
export const Loading: Story = {
    render: () => shell(<FlashcardDeckList decks={[]} isLoading onOpenDeck={() => {}} />),
}

/** EMPTY — loaded, zero decks → EmptyContent. */
export const Empty: Story = {
    render: () => shell(<FlashcardDeckList decks={[]} onOpenDeck={() => {}} />),
}

/** ERROR — load failed with no cached decks → ErrorContent + retry. */
export const Error: Story = {
    render: () => shell(<FlashcardDeckList decks={[]} error={new globalThis.Error("network")} onRetry={() => {}} onOpenDeck={() => {}} />),
}
