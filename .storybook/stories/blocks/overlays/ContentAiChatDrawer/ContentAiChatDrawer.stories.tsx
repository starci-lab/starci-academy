import type { Meta, StoryObj } from "@storybook/nextjs"
import React from "react"
import { Button as HeroButton } from "@heroui/react"
import { CardsIcon, PuzzlePieceIcon } from "@phosphor-icons/react"
import { ContentAiChatDrawer, HistoryLink } from "@sb-components/_blocks/overlays/ContentAiChatDrawer/ContentAiChatDrawer"
import { ChatThread, type ChatThreadMessage } from "@sb-components/_blocks/learn/ChatThread/ChatThread"
import { ChatComposer } from "@sb-components/_blocks/learn/ChatComposer/ChatComposer"
import { SelectionBanner } from "@sb-components/_blocks/learn/SelectionBanner/SelectionBanner"
import { ConversationList, type ConversationListItem } from "@sb-components/_blocks/learn/ConversationList/ConversationList"
import { ContentSearchList } from "@sb-components/_blocks/learn/ContentSearchList/ContentSearchList"
import { BackLink } from "@sb-components/atoms/navigation/BackLink/BackLink"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"
import type { SearchCourseContentItem } from "@sb-components/_blocks/learn/EntityResultRow/EntityResultRow"

/**
 * OVERLAY — the in-lesson AI chat drawer, rendered as a static leaf inside a SQUARE
 * surface panel (NOT the live HeroUI Drawer portal). FOUR LEAVES = four distinct
 * STRUCTURES (which blocks the shell composes); empty/loading/error/streaming are
 * STATE inside each block's own story, never a leaf here.
 *
 * The shell composes the REAL learn/* blocks (`ChatThread` · `ChatComposer` ·
 * `SelectionBanner` · `ConversationList` · `ContentSearchList`) — no hand-rolled
 * duplicates. ANATOMY IS BLOCK-FIRST (§11a): each block is ONE opaque node (its
 * internals are drilled in that block's own story), plus the shell's header primitives.
 */
const meta: Meta<typeof ContentAiChatDrawer> = {
    title: "Overlays/ContentAiChatDrawer",
    component: ContentAiChatDrawer,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}
export default meta

type Story = StoryObj<typeof ContentAiChatDrawer>

/** Frame each leaf right-aligned like a side drawer. */
const frame = (node: React.ReactNode) => <div className="flex justify-end p-8">{node}</div>

const LESSON_TITLE = "Closure trong JavaScript"
const noop = () => {}

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
        kind: "content",
        title: "Memory leak trong Node/Memory leak trong Node.js là gì",
        breadcrumb: "Module 4 · Debug hiệu năng",
        snippet: "Memory leak thường xuất phát từ closure giữ tham chiếu lâu hơn cần thiết.",
        score: 0.82,
        moduleId: "m4",
        contentId: "lesson-leak",
        deckId: null,
        taskId: null,
        isLocked: false,
    },
]

const CHAT_MESSAGES: Array<ChatThreadMessage> = [
    { id: "u1", role: "user", content: "closure trong JS là gì và khi nào dễ gây memory leak?" },
    {
        id: "a1",
        role: "assistant",
        content: "",
        toolResult: {
            intro: "Dưới đây là vài nội dung liên quan:",
            label: "Nội dung liên quan",
            icon: <CardsIcon aria-hidden focusable="false" />,
            items: TOOL_ITEMS,
            onViewAll: noop,
            viewAllLabel: "Xem tất cả kết quả",
        },
    },
]

/** Model-picker slot stand-in (real UI = GradeModelDropdown). */
const ModelPicker = () => <HeroButton size="sm" variant="ghost">Auto</HeroButton>

const COMPOSER_SKILLS = [
    { label: "Tìm bài học", icon: <CardsIcon aria-hidden focusable="false" /> },
    { label: "Tìm challenges", icon: <PuzzlePieceIcon aria-hidden focusable="false" /> },
]

const CONVERSATIONS: Array<ConversationListItem> = [
    { id: "c1", title: "Closure & memory leak", subtitle: "Bài 4 · 6 lượt", isActive: true },
    { id: "c2", title: "Event loop hỏi nhanh", subtitle: "Cả khoá · 3 lượt", isActive: false },
    { id: "c3", title: null, subtitle: "2 lượt", isActive: false },
]

/** Shell header primitives shared by every leaf. */
const HEADER_PARTS: Array<AnatomyNode> = [
    { name: "Title", tier: "primitive", role: "tên bài học — tiêu đề drawer" },
    { name: "ModeSwitch", tier: "primitive", role: "chuyển hiển thị rail ⇄ drawer (segmented 2 icon)" },
]

/** LEAF 1 — Chat thường: HistoryLink + ChatThread + ChatComposer(normal). */
export const ChatThuong: Story = {
    name: "Chat thường",
    render: () =>
        frame(
            <BlockAnatomy
                name="ContentAiChatDrawer"
                tier="block"
                leaf="Chat thường"
                parts={[
                    ...HEADER_PARTS,
                    { name: "HistoryLink", tier: "primitive", role: "mở lịch sử phiên trò chuyện" },
                    { name: "ChatThread", tier: "block", role: "vùng hội thoại — luồng tin nhắn (states ở story ChatThread)", storyId: "block-learn-chatthread--conversation" },
                    { name: "ChatComposer", tier: "block", role: "ô soạn — input + model picker + gửi (states ở story ChatComposer)" },
                ]}
                reason="Leaf gốc: KHÔNG có đoạn bôi đen — composer là MỘT hộp liền. Shell compose 2 block THẬT ChatThread + ChatComposer."
            >
                <ContentAiChatDrawer title={LESSON_TITLE} headerSecondary={<HistoryLink anatPart="HistoryLink" />} showAnatomy>
                    <ChatThread messages={CHAT_MESSAGES} onSelectHit={noop} anatPart="ChatThread" />
                    <ChatComposer
                        value=""
                        onChange={noop}
                        onSubmit={noop}
                        isSkillMenuOpen={false}
                        onToggleSkillMenu={noop}
                        skills={COMPOSER_SKILLS}
                        modelPicker={<ModelPicker />}
                        anatPart="ChatComposer"
                    />
                </ContentAiChatDrawer>
            </BlockAnatomy>,
        ),
}

/** LEAF 2 — Chat có bôi đen: + SelectionBanner, ChatComposer(selection). */
export const ChatBoiDen: Story = {
    name: "Chat có bôi đen",
    render: () =>
        frame(
            <BlockAnatomy
                name="ContentAiChatDrawer"
                tier="block"
                leaf="Chat có bôi đen"
                parts={[
                    ...HEADER_PARTS,
                    { name: "HistoryLink", tier: "primitive", role: "mở lịch sử phiên" },
                    { name: "SelectionBanner", tier: "block", role: "đoạn văn đã bôi đen — ghim trên đầu thread", storyId: "block-learn-selectionbanner--overview" },
                    { name: "ChatThread", tier: "block", role: "hội thoại side-thread về đoạn đã chọn", storyId: "block-learn-chatthread--conversation" },
                    { name: "ChatComposer", tier: "block", role: "chế độ selection — input rời sang hộp quick-ask riêng" },
                ]}
                note="Khác leaf 1 ở CẤU TRÚC: thêm SelectionBanner + ChatComposer sang chế độ selection (input dời khỏi composer chính)."
            >
                <ContentAiChatDrawer title={LESSON_TITLE} headerSecondary={<HistoryLink anatPart="HistoryLink" />} showAnatomy>
                    <SelectionBanner
                        passage="Closure giữ tham chiếu tới biến ngoài scope ngay cả sau khi hàm cha đã return."
                        note="Phiên hỏi theo đoạn này được lưu trữ riêng."
                        onDismiss={noop}
                        anatPart="SelectionBanner"
                    />
                    <ChatThread messages={[]} hasSelection anatPart="ChatThread" />
                    <ChatComposer
                        value=""
                        onChange={noop}
                        onSubmit={noop}
                        isSkillMenuOpen={false}
                        onToggleSkillMenu={noop}
                        skills={COMPOSER_SKILLS}
                        modelPicker={<ModelPicker />}
                        selection={{
                            hasSelection: true,
                            showQuickAsks: true,
                            quickAsks: [{ label: "Giải thích đoạn này" }, { label: "Cho ví dụ" }, { label: "Đơn giản hoá" }],
                        }}
                        anatPart="ChatComposer"
                    />
                </ContentAiChatDrawer>
            </BlockAnatomy>,
        ),
}

/** LEAF 3 — Lịch sử phiên: BackLink + ConversationList, KHÔNG composer. */
export const LichSuPhien: Story = {
    name: "Lịch sử phiên",
    render: () =>
        frame(
            <BlockAnatomy
                name="ContentAiChatDrawer"
                tier="block"
                leaf="Lịch sử phiên"
                parts={[
                    ...HEADER_PARTS,
                    { name: "BackLink", tier: "primitive", role: "quay lại phiên chat" },
                    { name: "ConversationList", tier: "block", role: "danh sách/chọn phiên (states ở story ConversationList)", storyId: "block-learn-conversationlist--default" },
                ]}
                note="Cấu trúc KHÁC hẳn chat: HistoryLink → BackLink, body là ConversationList, KHÔNG composer."
            >
                <ContentAiChatDrawer
                    title={LESSON_TITLE}
                    headerSecondary={
                        <div data-anat-part="BackLink" className="w-fit">
                            <BackLink.Base label="Cuộc trò chuyện" onPress={noop} />
                        </div>
                    }
                    showAnatomy
                >
                    <div data-anat-part="ConversationList">
                        <ConversationList
                            items={CONVERSATIONS}
                            onSelect={noop}
                            onRenameStart={noop}
                            onRenameChange={noop}
                            onRenameCommit={noop}
                            onRenameCancel={noop}
                            onArchive={noop}
                            onDelete={noop}
                        />
                    </div>
                </ContentAiChatDrawer>
            </BlockAnatomy>,
        ),
}

/** LEAF 4 — Tìm nội dung khoá: BackLink + ContentSearchList, KHÔNG composer. */
export const TimNoiDung: Story = {
    name: "Tìm nội dung khoá",
    render: () =>
        frame(
            <BlockAnatomy
                name="ContentAiChatDrawer"
                tier="block"
                leaf="Tìm nội dung khoá"
                parts={[
                    ...HEADER_PARTS,
                    { name: "BackLink", tier: "primitive", role: "quay lại phiên chat" },
                    { name: "ContentSearchList", tier: "block", role: "tìm nội dung khoá (states ở story ContentSearchList)", storyId: "block-learn-contentsearchlist--with-results" },
                ]}
                note="Cấu trúc riêng: BackLink + ContentSearchList (ô tìm + danh sách kết quả), KHÔNG composer."
            >
                <ContentAiChatDrawer
                    title={LESSON_TITLE}
                    headerSecondary={
                        <div data-anat-part="BackLink" className="w-fit">
                            <BackLink.Base label="Tìm nội dung khoá" onPress={noop} />
                        </div>
                    }
                    showAnatomy
                >
                    <ContentSearchList items={TOOL_ITEMS} query="closure" onSelect={noop} anatPart="ContentSearchList" />
                </ContentAiChatDrawer>
            </BlockAnatomy>,
        ),
}
