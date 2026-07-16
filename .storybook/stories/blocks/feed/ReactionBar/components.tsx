import { useState } from "react"
import { ReactionBar } from "@/components/blocks/feed/ReactionBar"
import { ReactionType } from "@/modules/api/graphql/queries/types/discussion"

/**
 * The block's role, the same across every story — the right to react is decided by the caller
 * passing or omitting `onReact`; each story describes its own state via the Label + description.
 *
 * The props are just `count` + `myReaction` (+ optional `onReact`): the closed bar shows only 1 emoji
 * (the viewer's reaction or a smiley icon) and the total count. The multi-icon group only appears when
 * the picker is open (6 fixed emoji: Like / Love / Haha / Wow / Sad / Angry). There's no
 * summary/counts prop for a stacked top-reactions view like the old Discussion ReactionBar.
 */
export const usage = "A reaction bar attached below a piece of community content (a post, a comment, a feed activity): shows the total reaction count and lets the viewer add or remove their own reaction. The right to react is decided by the caller passing or omitting onReact, there's no separate readOnly prop. When closed it's just 1 emoji + count; the multi-icon group is the 6-emoji picker when open — there's no stacked top-reactions summary."

/** Wrapper that owns local state, simulating selecting/removing a reaction as in the real flow. */
export const Controlled = ({
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
