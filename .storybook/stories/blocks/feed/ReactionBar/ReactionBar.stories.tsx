import type { Meta, StoryObj } from "@storybook/nextjs"
import React, { useState } from "react"
import { ReactionBar, ReactionType } from "./ReactionBar"
import { BlockAnatomy, type AnatomyNode } from "../../layout/BlockAnatomy/BlockAnatomy"

/**
 * DESIGN — the Facebook-style reaction bar for a feed item: a react trigger that
 * pops a 6-emoji picker, beside the total count. Whether the viewer may react is
 * decided by the caller passing `onReact` (interactive) or omitting it (read-only,
 * count display only — and nothing at all when there are no reactions).
 *
 * ANATOMY IS PER-LEAF: each story below is its OWN leaf and carries its OWN
 * BlockAnatomy axis (Sơ đồ + Cây) reflecting the parts THAT leaf composes — there
 * is no separate consolidated "Anatomy" story. The bar emits no overlay anchors,
 * so `Sơ đồ` is a clean render + numbered legend.
 */
const meta: Meta<typeof ReactionBar> = {
    title: "Design/Feed/ReactionBar",
    component: ReactionBar,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof ReactionBar>

/** Plain canvas for each leaf's anatomy panel. */
const shell = (node: React.ReactNode) => <div className="p-8">{node}</div>

/** Wrapper that owns local state, simulating selecting/removing a reaction. */
const Controlled = ({
    initialCount,
    initialReaction,
    showAnatomy,
}: {
    initialCount: number
    initialReaction: ReactionType | null
    showAnatomy?: boolean
}) => {
    const [count, setCount] = useState(initialCount)
    const [myReaction, setMyReaction] = useState<ReactionType | null>(initialReaction)
    return (
        <ReactionBar
            count={count}
            myReaction={myReaction}
            showAnatomy={showAnatomy}
            onReact={(type) => {
                setCount((previous) => previous + (type ? (myReaction ? 0 : 1) : -1))
                setMyReaction(type)
            }}
        />
    )
}

// Interactive leaves (onReact passed) — mirror the real DOM: root div → { trigger
// button, picker popover }. The glyph icon + count Typography INSIDE the trigger
// button are ELEMENTS rendering the trigger's own state (current glyph, `count`
// prop) — folded into the "button · React trigger" node itself, not tracked as
// separate parts (same as "count" in the CẮT rule's example list). The six emoji
// options live INSIDE the picker as their own real button controls.
const INTERACTIVE_PARTS: Array<AnatomyNode> = [
    {
        name: "Button.ReactTrigger",
        tier: "primitive",
        role: "nút bấm mở/đóng picker; hiển thị glyph hiện tại (neutral/emoji cảm xúc) + số đếm",
    },
    {
        name: "EmojiPicker",
        tier: "design",
        role: "popover 6 emoji (framer-motion), chỉ hiện khi mở — chọn / gỡ cảm xúc",
        children: [
            { name: "Button.EmojiOption", tier: "primitive", role: "6 nút emoji map từ REACTIONS — bấm để chọn / gỡ", state: "×6" },
        ],
    },
]

// Read-only leaf (onReact omitted, count > 0): the viewer's emoji span + the count
// Typography are ReactionBar's OWN direct renders at the root (no wrapping button
// control here, unlike the interactive trigger) — each gets its own node
// (§ granularity, same as DeckCard's title/description/count Typography).
const READONLY_PARTS: Array<AnatomyNode> = [
    { name: "Span.ViewerEmoji", tier: "primitive", role: "emoji người xem đã chọn trước đó — chỉ khi có myReaction", state: "tuỳ chọn" },
    { name: "Typography", tier: "primitive", role: "số đếm cảm xúc" },
]

// Read-only + count 0 leaf: the bar returns null, leaving no gap.
const EMPTY_PARTS: Array<AnatomyNode> = [
    { name: "ReactionBar", tier: "design", role: "chế độ chỉ-đọc + count 0 → trả về null, không để lại khoảng trống", state: "null" },
]

/** CHƯA REACT — interactive, no reaction yet → neutral smiley trigger + picker. */
export const NoInteraction: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="ReactionBar"
                tier="design"
                leaf="NoInteraction"
                parts={INTERACTIVE_PARTS}
                note="Người xem chưa react → nút trigger hiện glyph neutral, ẩn số đếm vì count = 0 (cả hai đều là giá trị inline trong nút trigger, không phải part riêng)."
                reason="Leaf feed block: gói trigger react + picker 6 emoji + số đếm vào một đơn vị, để mọi surface cộng đồng (post, comment, activity) dùng chung một cách thả cảm xúc. Quyền react do caller quyết định qua có truyền onReact hay không — không có prop readOnly riêng."
            >
                <Controlled initialCount={0} initialReaction={null} showAnatomy />
            </BlockAnatomy>,
        ),
}

/** ĐÃ REACT — interactive with the viewer's own reaction → emoji trigger + count + picker. */
export const Reacted: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="ReactionBar"
                tier="design"
                leaf="Reacted"
                parts={INTERACTIVE_PARTS}
                note="Đã react → nút trigger đổi glyph sang emoji cảm xúc, số đếm hiện (accent) — CÙNG composition với leaf 'Chưa react'."
            >
                <Controlled initialCount={12} initialReaction={ReactionType.Love} showAnatomy />
            </BlockAnatomy>,
        ),
}

/** CHỈ ĐỌC — onReact omitted, count > 0 → viewer's emoji + count, no trigger/picker. */
export const ReadOnly: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="ReactionBar"
                tier="design"
                leaf="ReadOnly"
                parts={READONLY_PARTS}
                note="Không truyền onReact → bỏ nút trigger + picker; emoji người xem + số đếm render trực tiếp trên root, mỗi cái một node riêng (không còn gói trong nút trigger)."
            >
                <ReactionBar count={7} myReaction={ReactionType.Like} showAnatomy />
            </BlockAnatomy>,
        ),
}

/** CHỈ ĐỌC, RỖNG — read-only with zero reactions → the bar returns null. */
export const ReadOnlyEmpty: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="ReactionBar"
                tier="design"
                leaf="ReadOnlyEmpty"
                parts={EMPTY_PARTS}
                note="Chỉ-đọc + count 0 → ReactionBar trả về null (khác leaf 'Chỉ đọc'), không chiếm chỗ trong hàng meta."
            >
                <div className="flex items-center gap-2">
                    <ReactionBar count={0} myReaction={null} showAnatomy />
                    <span className="text-xs text-muted">(bar trả về null — không để lại khoảng trống)</span>
                </div>
            </BlockAnatomy>,
        ),
}
