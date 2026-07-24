import type { Meta, StoryObj } from "@storybook/nextjs"
import React from "react"
import {
    BookOpenIcon,
    CardsIcon,
    PuzzlePieceIcon,
    SparkleIcon,
} from "@phosphor-icons/react"
import { ChatComposer, type ChipButtonItem } from "./ChatComposer"
import { Button } from "../../buttons/Button/Button"
import { BlockAnatomy, type AnatomyNode } from "../../layout/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — the AI-chat COMPOSER ("soạn & gửi tin"), ported from
 * `features/learn/ContentAiChat` (~:1400-1493). One function: everything the
 * learner touches to type, pick a model, open the retrieval-skill menu, and send.
 * Distinct from the thread block (`Block/Learn/ChatThread`) which only renders
 * past turns.
 *
 * ANATOMY IS PER-LEAF: each story below is its OWN leaf with its OWN BlockAnatomy
 * axis reflecting the parts THAT leaf composes — normal / sending / skill-menu
 * open / selection (with + without quick-asks) / empty-disabled. There is no
 * single consolidated "Anatomy" story.
 */
const meta: Meta<typeof ChatComposer> = {
    title: "Block/Learn/ChatComposer",
    component: ChatComposer,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}
export default meta

type Story = StoryObj<typeof ChatComposer>

/** Frame each leaf on the panel surface the composer actually sits on. */
const frame = (node: React.ReactNode) => (
    <div className="p-8">
        <div className="w-full max-w-md">{node}</div>
    </div>
)

// The real picker is `GradeModelDropdown` (task="chatting", placement="top start",
// source :908-920) — a full model catalog is tangential to this block's own 6
// states, so each leaf passes a lightweight stand-in trigger instead.
// TODO port: swap for the real `GradeModelDropdown` when wiring this block live
// (see `Block/Grading/GradeModelDropdown` for the full port).
const modelPickerStandIn = (showAnatomy: boolean) => (
    <Button
        variant="tertiary"
        size="sm"
        className="max-w-40"
        anatPart={showAnatomy ? "Button.ModelPicker" : undefined}
    >
        <SparkleIcon aria-hidden focusable="false" />
        Tự động
    </Button>
)

// 4 retrieval skills (source `RETRIEVAL_SKILLS`, index.tsx:124-129).
const SKILLS: Array<ChipButtonItem> = [
    { id: "challenges", label: "Tìm challenges liên quan bài này", icon: <PuzzlePieceIcon aria-hidden focusable="false" /> },
    { id: "flashcards", label: "Tìm flashcard liên quan bài này", icon: <CardsIcon aria-hidden focusable="false" /> },
    { id: "lessons", label: "Tìm bài học liên quan", icon: <BookOpenIcon aria-hidden focusable="false" /> },
    { id: "related", label: "Tìm nội dung liên quan bài này", icon: <SparkleIcon aria-hidden focusable="false" /> },
]

// 3 selected-passage quick-asks (source `SELECTION_SUGGESTION_KEYS`, index.tsx:88).
const QUICK_ASKS: Array<ChipButtonItem> = [
    { id: "explain", label: "Giải thích đoạn này" },
    { id: "example", label: "Cho ví dụ minh hoạ" },
    { id: "simplify", label: "Diễn giải đơn giản hơn" },
]

// ── Anatomy trees per state ──────────────────────────────────────────────────
const MODEL_PICKER_NODE: AnatomyNode = {
    name: "Button.ModelPicker",
    tier: "block",
    role: "slot picker model — trong app thật là GradeModelDropdown (task=\"chatting\", placement=\"top start\")",
}
const TOGGLE_NODE: AnatomyNode = { name: "Button.ToggleSkill", tier: "primitive", role: "mở/đóng skill-menu (kính lúp, iconOnly tertiary)" }
const SEND_NODE: AnatomyNode = { name: "Button.Send", tier: "primitive", role: "gửi câu hỏi (iconOnly primary, PaperPlaneTiltIcon)" }
const INPUT_NODE: AnatomyNode = { name: "input", tier: "primitive", role: "ô gõ trần — Enter gửi, Escape đóng skill-menu" }

const NORMAL_PARTS: Array<AnatomyNode> = [INPUT_NODE, MODEL_PICKER_NODE, TOGGLE_NODE, SEND_NODE]

const SENDING_PARTS: Array<AnatomyNode> = [
    INPUT_NODE,
    MODEL_PICKER_NODE,
    TOGGLE_NODE,
    { ...SEND_NODE, role: "đang gửi — Spinner thay icon, khoá press", state: "pending" },
]

const SKILL_MENU_PARTS: Array<AnatomyNode> = [
    { name: "Typography.Hint", tier: "primitive", role: "dòng hint đầu skill-menu (muted, body-xs)" },
    { name: "ChipButtonList.Skills", tier: "primitive", role: "4 hàng kỹ năng truy hồi — challenges/flashcards/lessons/related" },
    INPUT_NODE,
    MODEL_PICKER_NODE,
    { ...TOGGLE_NODE, role: "đang MỞ menu", state: "mở" },
    SEND_NODE,
]

const SELECTION_NO_MSG_PARTS: Array<AnatomyNode> = [
    { name: "ChipButtonList.QuickAsk", tier: "primitive", role: "3 nút hỏi nhanh (giải thích/ví dụ/diễn giải) — chỉ hiện khi CHƯA có tin nhắn nào" },
    { ...INPUT_NODE, role: "RỜI khỏi composer sang hộp trích đoạn (border riêng)" },
    MODEL_PICKER_NODE,
    TOGGLE_NODE,
    SEND_NODE,
]

const SELECTION_WITH_MSG_PARTS: Array<AnatomyNode> = [
    { ...INPUT_NODE, role: "ở hộp trích đoạn — KHÔNG có quick-ask vì đã có tin nhắn" },
    MODEL_PICKER_NODE,
    TOGGLE_NODE,
    SEND_NODE,
]

const DISABLED_EMPTY_PARTS: Array<AnatomyNode> = [
    { ...INPUT_NODE, role: "rỗng + disabled — chưa có gì để gửi", state: "disabled" },
    { ...MODEL_PICKER_NODE, state: "disabled" },
    { ...TOGGLE_NODE, state: "disabled" },
    { ...SEND_NODE, state: "disabled" },
]

/** THƯỜNG — input sống trong composer, không selection, không skill-menu. */
export const Normal: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="ChatComposer"
                tier="block"
                leaf="Normal"
                parts={NORMAL_PARTS}
                reason="Composer mặc định: input trần + hàng action (model picker trái · skill-menu toggle + gửi phải). Input KHÔNG dùng field HeroUI để khỏi lồng 2 viền trong ring của composer."
            >
                <ChatComposer
                    value="closure trong JS là gì?"
                    onChange={() => {}}
                    onSubmit={() => {}}
                    isSkillMenuOpen={false}
                    onToggleSkillMenu={() => {}}
                    skills={SKILLS}
                    modelPicker={modelPickerStandIn(true)}
                    showAnatomy
                />
            </BlockAnatomy>,
        ),
}

/** ĐANG GỬI — nút gửi isPending (Spinner thay icon, khoá press). */
export const Sending: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="ChatComposer"
                tier="block"
                leaf="Sending"
                parts={SENDING_PARTS}
                note="isStreaming=true → nút gửi chuyển isPending (Button primitive tự vẽ Spinner thay PaperPlaneTiltIcon + khoá press)."
            >
                <ChatComposer
                    value="closure trong JS là gì?"
                    onChange={() => {}}
                    onSubmit={() => {}}
                    isStreaming
                    isSkillMenuOpen={false}
                    onToggleSkillMenu={() => {}}
                    skills={SKILLS}
                    modelPicker={modelPickerStandIn(true)}
                    showAnatomy
                />
            </BlockAnatomy>,
        ),
}

/** SKILL-MENU MỞ — region in-flow (không phải popover) nằm TRÊN composer. */
export const SkillMenuOpen: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="ChatComposer"
                tier="block"
                leaf="SkillMenuOpen"
                parts={SKILL_MENU_PARTS}
                note={"Nút kính lúp toggle một region role=\"listbox\" IN-FLOW ngay trên composer — không phải popover — nên nó ĐẨY composer xuống, không che gì."}
                reason="Thay grammar '/' cũ: tappable trên phone, mở được GIỮA cuộc hội thoại (không chỉ lúc rỗng)."
            >
                <ChatComposer
                    value=""
                    onChange={() => {}}
                    onSubmit={() => {}}
                    isSkillMenuOpen
                    onToggleSkillMenu={() => {}}
                    skills={SKILLS}
                    modelPicker={modelPickerStandIn(true)}
                    showAnatomy
                />
            </BlockAnatomy>,
        ),
}

/** SELECTION + CHƯA CÓ TIN — input rời sang hộp trích đoạn kèm 3 quick-ask. */
export const SelectionNoMessages: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="ChatComposer"
                tier="block"
                leaf="SelectionNoMessages"
                parts={SELECTION_NO_MSG_PARTS}
                note="Có đoạn bôi đen VÀ thread rỗng → input rời khỏi composer sang hộp riêng (border, ring riêng) kèm 3 nút hỏi nhanh; composer chỉ còn hàng action."
                reason="Quick-ask chỉ có ý nghĩa TRƯỚC lượt hỏi đầu — sau đó excerpt đã có ngữ cảnh trong thread, gợi ý lặp lại là thừa."
            >
                <ChatComposer
                    value=""
                    onChange={() => {}}
                    onSubmit={() => {}}
                    isSkillMenuOpen={false}
                    onToggleSkillMenu={() => {}}
                    skills={SKILLS}
                    selection={{ hasSelection: true, quickAsks: QUICK_ASKS, showQuickAsks: true }}
                    modelPicker={modelPickerStandIn(true)}
                    showAnatomy
                />
            </BlockAnatomy>,
        ),
}

/** SELECTION + ĐÃ CÓ TIN — hộp trích đoạn chỉ còn input, KHÔNG quick-ask. */
export const SelectionWithMessages: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="ChatComposer"
                tier="block"
                leaf="SelectionWithMessages"
                parts={SELECTION_WITH_MSG_PARTS}
                note="Vẫn đang chọn đoạn, nhưng đã có ít nhất 1 lượt hỏi–đáp → quick-ask biến mất, hộp trích đoạn chỉ còn input."
            >
                <ChatComposer
                    value=""
                    onChange={() => {}}
                    onSubmit={() => {}}
                    isSkillMenuOpen={false}
                    onToggleSkillMenu={() => {}}
                    skills={SKILLS}
                    selection={{ hasSelection: true, quickAsks: QUICK_ASKS, showQuickAsks: false }}
                    modelPicker={modelPickerStandIn(true)}
                    showAnatomy
                />
            </BlockAnatomy>,
        ),
}

/** RỖNG / DISABLED — chưa gõ gì + composer khoá (chưa có scope để hỏi). */
export const EmptyDisabled: Story = {
    render: () =>
        frame(
            <BlockAnatomy
                name="ChatComposer"
                tier="block"
                leaf="EmptyDisabled"
                parts={DISABLED_EMPTY_PARTS}
                note="isDisabled=true khoá toàn bộ composer (input + cả 2 nút) — vd. khi chưa xác định được scope (contentId/courseId…) để gắn câu hỏi vào."
            >
                <ChatComposer
                    value=""
                    onChange={() => {}}
                    onSubmit={() => {}}
                    isDisabled
                    isSkillMenuOpen={false}
                    onToggleSkillMenu={() => {}}
                    skills={SKILLS}
                    modelPicker={modelPickerStandIn(true)}
                    showAnatomy
                />
            </BlockAnatomy>,
        ),
}
