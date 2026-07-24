import type { Meta, StoryObj } from "@storybook/nextjs"
import React from "react"
import { Typography } from "@heroui/react"
import { CardsIcon } from "@phosphor-icons/react"
import {
    ChatComposer,
    ChatThread,
    ContentAiChatDrawer,
    ContentSearchList,
    ConversationList,
    HistoryLink,
    SelectionBanner,
} from "./ContentAiChatDrawer"
import { ChatBubble } from "../../feed/ChatBubble/ChatBubble"
import { ChatToolResult } from "../../learn/ChatToolResult/ChatToolResult"
import { BackLink } from "../../navigation/BackLink/BackLink"
import { BlockAnatomy, type AnatomyNode } from "../../layout/BlockAnatomy/BlockAnatomy"
import type { SearchCourseContentItem } from "../../learn/EntityResultRow/EntityResultRow"

/**
 * OVERLAY — the in-lesson AI chat drawer's CONTENT, rendered as a static leaf inside a
 * SQUARE surface panel (a `bg-surface` sheet standing in for the portal `Drawer.Dialog`,
 * NOT a rounded floating card). The portal/placement/backdrop are the app's concern.
 *
 * FOUR LEAVES = four distinct STRUCTURES (`ChatThread`/`ChatComposer`/`SelectionBanner`/
 * `ConversationList`/`ContentSearchList` regions appear/disappear/reshape) — NOT the
 * `chat`/`empty`/`error`/`loading` STATE inside any one of them; those states are that
 * block's own concern, drilled in its own future story once ported (see
 * `ContentAiChatDrawer.tsx` header comment for the "TODO port" list).
 *
 * ANATOMY IS BLOCK-FIRST: only functional-region nodes (`ChatThread` / `ChatComposer` /
 * `SelectionBanner` / `ConversationList` / `ContentSearchList`) plus a handful of header
 * primitives (`Typography · tiêu đề`, `ModeSwitch`, `HistoryLink`/`BackLink`) — never the
 * primitives those blocks compose internally (`ChatBubble`, `ChatToolResult`,
 * `EntityResultRow`…).
 */
const meta: Meta<typeof ContentAiChatDrawer> = {
    title: "Overlays/ContentAiChatDrawer",
    component: ContentAiChatDrawer,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}
export default meta

type Story = StoryObj<typeof ContentAiChatDrawer>

/** Frame each leaf like a block story — right-aligned like a side drawer. */
const frame = (node: React.ReactNode) => <div className="flex justify-end p-8">{node}</div>

const LESSON_TITLE = "Closure trong JavaScript"

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

/** Header primitives shared by every leaf. */
const HEADER_PARTS: Array<AnatomyNode> = [
    { name: "Typography · tiêu đề", tier: "primitive", role: "tên bài học — tiêu đề drawer" },
    { name: "ModeSwitch", tier: "design", role: "chuyển hiển thị rail ⇄ drawer (segmented, 2 icon)" },
]

// ─────────────────────────────────────────────────────────────────────────────
// LEAF 1 — Chat thường: HistoryLink + ChatThread + ChatComposer(normal)
// ─────────────────────────────────────────────────────────────────────────────
const NORMAL_PARTS: Array<AnatomyNode> = [
    ...HEADER_PARTS,
    { name: "HistoryLink", tier: "primitive", role: "mở lịch sử phiên trò chuyện" },
    { name: "ChatThread", tier: "block", role: "vùng hội thoại — luồng tin nhắn (đào sâu ở story ChatThread)" },
    { name: "ChatComposer", tier: "block", role: "ô soạn — input + model picker (Auto) + tìm nguồn + gửi" },
]

export const ChatThuong: Story = {
    name: "Chat thường",
    render: () =>
        frame(
            <BlockAnatomy
                name="ContentAiChatDrawer"
                tier="block"
                leaf="Chat thường"
                parts={NORMAL_PARTS}
                reason="Leaf gốc: KHÔNG có đoạn bôi đen — composer là MỘT hộp (input + action row liền nhau), không tách hộp quick-ask. Đây là cấu trúc mặc định khi mở drawer từ trong bài học."
            >
                <ContentAiChatDrawer
                    title={LESSON_TITLE}
                    headerSecondary={<HistoryLink anatPart="HistoryLink" />}
                    showAnatomy
                >
                    <ChatThread anatPart="ChatThread">
                        <ChatBubble role="user">
                            <Typography type="body-sm">closure trong JS là gì và khi nào dễ gây memory leak?</Typography>
                        </ChatBubble>
                        <ChatBubble role="assistant">
                            <div className="flex flex-col gap-2">
                                <Typography type="body-sm">
                                    Closure là hàm “nhớ” được scope nơi nó sinh ra — nó giữ tham chiếu tới biến ngoài ngay
                                    cả sau khi hàm cha đã return. Memory leak xảy ra khi closure giữ tham chiếu sống lâu hơn
                                    cần thiết. Dưới đây là vài thẻ ôn liên quan:
                                </Typography>
                                <ChatToolResult
                                    items={TOOL_ITEMS}
                                    label="Flashcard liên quan"
                                    icon={<CardsIcon aria-hidden focusable="false" />}
                                    onSelect={() => {}}
                                    onViewAll={() => {}}
                                    viewAllLabel="Xem tất cả kết quả"
                                />
                            </div>
                        </ChatBubble>
                    </ChatThread>
                    <ChatComposer mode="normal" anatPart="ChatComposer" />
                </ContentAiChatDrawer>
            </BlockAnatomy>,
        ),
}

// ─────────────────────────────────────────────────────────────────────────────
// LEAF 2 — Chat có bôi đen: HistoryLink + SelectionBanner + ChatThread + ChatComposer(selection)
// ─────────────────────────────────────────────────────────────────────────────
const SELECTION_PARTS: Array<AnatomyNode> = [
    ...HEADER_PARTS,
    { name: "HistoryLink", tier: "primitive", role: "mở lịch sử phiên trò chuyện" },
    { name: "SelectionBanner", tier: "block", role: "đoạn văn đã bôi đen — ghim TRÊN đầu thread" },
    { name: "ChatThread", tier: "block", role: "vùng hội thoại của side-thread về đoạn đã chọn" },
    { name: "ChatComposer", tier: "block", role: "ô soạn — CHẾ ĐỘ selection: input rời sang hộp quick-ask riêng, action row chỉ còn model picker/tìm nguồn/gửi" },
]

export const ChatBoiDen: Story = {
    name: "Chat có bôi đen",
    render: () =>
        frame(
            <BlockAnatomy
                name="ContentAiChatDrawer"
                tier="block"
                leaf="Chat có bôi đen"
                parts={SELECTION_PARTS}
                note="Khác leaf 1 ở CẤU TRÚC: xuất hiện thêm SelectionBanner phía trên thread, và ChatComposer đổi hình dạng — input rời khỏi hộp composer chính, chuyển sang một hộp quick-ask riêng (kèm chip gợi ý) ngay dưới thread."
            >
                <ContentAiChatDrawer
                    title={LESSON_TITLE}
                    headerSecondary={<HistoryLink anatPart="HistoryLink" />}
                    showAnatomy
                >
                    <SelectionBanner
                        anatPart="SelectionBanner"
                        excerpt="“Closure là hàm giữ tham chiếu tới scope nơi nó được tạo ra, ngay cả sau khi hàm cha đã return.”"
                    />
                    <ChatThread anatPart="ChatThread">
                        <ChatBubble role="user">
                            <Typography type="body-sm">giải thích đoạn này bằng ví dụ đơn giản hơn?</Typography>
                        </ChatBubble>
                        <ChatBubble role="assistant">
                            <Typography type="body-sm">
                                Hãy tưởng tượng một hàm `createCounter` trả về hàm `increment` — `increment` vẫn "nhớ"
                                biến `count` dù `createCounter` đã chạy xong từ lâu. Đó chính là closure.
                            </Typography>
                        </ChatBubble>
                    </ChatThread>
                    <ChatComposer mode="selection" anatPart="ChatComposer" />
                </ContentAiChatDrawer>
            </BlockAnatomy>,
        ),
}

// ─────────────────────────────────────────────────────────────────────────────
// LEAF 3 — Lịch sử phiên: BackLink + ConversationList, KHÔNG có composer
// ─────────────────────────────────────────────────────────────────────────────
const HISTORY_PARTS: Array<AnatomyNode> = [
    ...HEADER_PARTS,
    { name: "BackLink", tier: "primitive", role: "quay lại thread chat" },
    { name: "ConversationList", tier: "block", role: "tìm + tạo mới + toggle lưu trữ + danh sách phiên trò chuyện (gộp 1 vùng chức năng)" },
]

export const LichSuPhien: Story = {
    name: "Lịch sử phiên",
    render: () =>
        frame(
            <BlockAnatomy
                name="ContentAiChatDrawer"
                tier="block"
                leaf="Lịch sử phiên"
                parts={HISTORY_PARTS}
                note="Khác hẳn 2 leaf chat ở CẤU TRÚC: ChatThread/SelectionBanner/ChatComposer biến mất hoàn toàn, HistoryLink được thay bằng BackLink (đi ngược), và toàn drawer là MỘT block quản lý phiên (ConversationList) — hoàn toàn KHÔNG có composer."
            >
                <ContentAiChatDrawer
                    title={LESSON_TITLE}
                    headerSecondary={(
                        <div data-anat-part="BackLink">
                            <BackLink label="Trở lại" onPress={() => {}} />
                        </div>
                    )}
                    showAnatomy
                >
                    <ConversationList anatPart="ConversationList" />
                </ContentAiChatDrawer>
            </BlockAnatomy>,
        ),
}

// ─────────────────────────────────────────────────────────────────────────────
// LEAF 4 — Tìm nội dung khoá: BackLink + ContentSearchList, KHÔNG có composer
// ─────────────────────────────────────────────────────────────────────────────
const CONTENT_SEARCH_PARTS: Array<AnatomyNode> = [
    ...HEADER_PARTS,
    { name: "BackLink", tier: "primitive", role: "quay lại thread chat" },
    { name: "ContentSearchList", tier: "block", role: "tìm + danh sách kết quả nội dung khoá (gộp 1 vùng chức năng)" },
]

export const TimNoiDungKhoa: Story = {
    name: "Tìm nội dung khoá",
    render: () =>
        frame(
            <BlockAnatomy
                name="ContentAiChatDrawer"
                tier="block"
                leaf="Tìm nội dung khoá"
                parts={CONTENT_SEARCH_PARTS}
                note="Cùng họ với leaf 'Lịch sử phiên' (BackLink, không composer) nhưng KHÁC block chức năng: ContentSearchList thay ConversationList — tìm nội dung khoá học (bài/flashcard/thử thách) thay vì tìm phiên chat cũ."
            >
                <ContentAiChatDrawer
                    title={LESSON_TITLE}
                    headerSecondary={(
                        <div data-anat-part="BackLink">
                            <BackLink label="Trở lại" onPress={() => {}} />
                        </div>
                    )}
                    showAnatomy
                >
                    <ContentSearchList anatPart="ContentSearchList" />
                </ContentAiChatDrawer>
            </BlockAnatomy>,
        ),
}
