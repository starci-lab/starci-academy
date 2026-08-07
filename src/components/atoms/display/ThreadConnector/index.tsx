import { cn } from "@heroui/react"

/**
 * @noSkeleton draws a guide line, not a value — there is nothing behind it to wait for.
 *
 * The curved line linking a comment's avatar down into a reply composer's avatar. Same idea as
 * `Stack.nested`'s straight indent guide, bent into a corner, so no block hand-writes
 * `border-l` / `border-b` / `rounded-bl-*` of its own.
 *
 * The height is fixed at `h-4` and must not become `self-stretch`. The reply composer's avatar is
 * `size="sm"` (32px) and top-aligned, so its centre is 16px down and that is where the bottom
 * border has to land. Stretching makes the line track the whole composer, textarea and buttons
 * included, and the curve stops meeting the avatar.
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
