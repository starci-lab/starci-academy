import type { Meta, StoryObj } from "@storybook/nextjs"
import React, { useState } from "react"
import { ReactionBar, ReactionType } from "./ReactionBar"
import { blockShell } from "../../../block-anatomy"

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

const ANATOMY = {
    primitives: [
        { name: "Typography", role: "số đếm reaction (body-xs, muted)" },
        { name: "SmileyIcon", role: "icon trigger khi người xem chưa react" },
    ],
    reason:
        "Leaf feed block: gói trigger react + picker 6 emoji + số đếm vào một đơn vị, để mọi surface cộng đồng (post, comment, activity) dùng chung một cách thả cảm xúc. Quyền react do caller quyết định qua có truyền onReact hay không — không có prop readOnly riêng.",
}

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

export const NoInteraction: Story = {
    render: () => blockShell(<Controlled initialCount={0} initialReaction={null} />, ANATOMY),
}

export const Reacted: Story = {
    render: () => blockShell(<Controlled initialCount={12} initialReaction={ReactionType.Love} />, ANATOMY),
}

export const ReadOnly: Story = {
    render: () => blockShell(<ReactionBar count={7} myReaction={ReactionType.Like} />, ANATOMY),
}

export const ReadOnlyEmpty: Story = {
    render: () =>
        blockShell(
            <div className="flex items-center gap-2">
                <ReactionBar count={0} myReaction={null} />
                <span className="text-xs text-muted">(bar trả về null — không để lại khoảng trống)</span>
            </div>,
            ANATOMY,
        ),
}
