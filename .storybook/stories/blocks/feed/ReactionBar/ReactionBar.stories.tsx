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
}: {
    initialCount: number
    initialReaction: ReactionType | null
}) => {
    const [count, setCount] = useState(initialCount)
    const [myReaction, setMyReaction] = useState<ReactionType | null>(initialReaction)
    return (
        <ReactionBar
            count={count}
            myReaction={myReaction}
            onReact={(type) => {
                setCount((previous) => previous + (type ? (myReaction ? 0 : 1) : -1))
                setMyReaction(type)
            }}
        />
    )
}

// Interactive leaves (onReact passed): react trigger + count + emoji picker.
const INTERACTIVE_PARTS: Array<AnatomyNode> = [
    { name: "SmileyIcon", tier: "primitive", role: "icon trigger neutral khi người xem chưa react" },
    { name: "Typography", tier: "primitive", role: "số đếm reaction (body-xs), ẩn khi count = 0" },
    { name: "Emoji picker", tier: "design", role: "popover 6 emoji (framer-motion) — chọn / gỡ cảm xúc" },
]

// Read-only leaf (onReact omitted, count > 0): just the viewer's emoji + count, no picker.
const READONLY_PARTS: Array<AnatomyNode> = [
    { name: "Emoji", tier: "primitive", role: "emoji cảm xúc của người xem (span)" },
    { name: "Typography", tier: "primitive", role: "số đếm reaction (body-xs, muted)" },
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
                leaf="Chưa react"
                parts={INTERACTIVE_PARTS}
                note="Người xem chưa react → trigger là SmileyIcon neutral, count = 0 nên Typography số đếm ẩn."
                reason="Leaf feed block: gói trigger react + picker 6 emoji + số đếm vào một đơn vị, để mọi surface cộng đồng (post, comment, activity) dùng chung một cách thả cảm xúc. Quyền react do caller quyết định qua có truyền onReact hay không — không có prop readOnly riêng."
            >
                <Controlled initialCount={0} initialReaction={null} />
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
                leaf="Đã react"
                parts={INTERACTIVE_PARTS}
                note="Đã react → trigger đổi SmileyIcon sang emoji cảm xúc, Typography số đếm hiện (accent). CÙNG composition với leaf 'Chưa react'."
            >
                <Controlled initialCount={12} initialReaction={ReactionType.Love} />
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
                leaf="Chỉ đọc"
                parts={READONLY_PARTS}
                note="Không truyền onReact → bỏ nút trigger + picker, chỉ còn emoji người xem + số đếm."
            >
                <ReactionBar count={7} myReaction={ReactionType.Like} />
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
                leaf="Chỉ đọc, rỗng"
                parts={EMPTY_PARTS}
                note="Chỉ-đọc + count 0 → ReactionBar trả về null (khác leaf 'Chỉ đọc'), không chiếm chỗ trong hàng meta."
            >
                <div className="flex items-center gap-2">
                    <ReactionBar count={0} myReaction={null} />
                    <span className="text-xs text-muted">(bar trả về null — không để lại khoảng trống)</span>
                </div>
            </BlockAnatomy>,
        ),
}
