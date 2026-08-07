import { cn } from "@heroui/react"

/**
 * @noSkeleton draws a guide line, not a value — there is nothing behind it to wait for.
 *
 * ATOM — `ThreadConnector`: the curved guide line linking a comment's avatar down into a
 * reply composer's own avatar (Facebook-style nested reply). Same family as `Stack.nested`'s
 * straight indent-guide border, bent into a corner instead of a straight drop.
 */

/**
 * The reply-thread connector line.
 */
const ThreadConnector = () => (
    <div
        aria-hidden
        data-tier="atom"
        data-component="ThreadConnector"
        className={cn("ml-4 h-4 w-4 rounded-bl-2xl border-b border-l border-default")}
    />
)

export { ThreadConnector }

/** Tier metadata for `ThreadConnector`, used by the component registry/Storybook lookup. */
export const meta = { tier: "atom", name: "ThreadConnector" } as const
