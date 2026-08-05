import { cn } from "@heroui/react"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"

/**
 * @noSkeleton draws a guide line, not a value — there is nothing behind it to wait for.
 *
 * ATOM — `ThreadConnector`: the curved guide line linking a comment's avatar down into a
 * reply composer's own avatar (Facebook-style nested reply). Same family as `Stack.nested`'s
 * straight indent-guide border, bent into a corner instead of a straight drop.
 */

/** Props for {@link ThreadConnector}. */
export interface ThreadConnectorProps {
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     * Prefer this over `className`; the string form is going away.
     */
    classNames?: Array<AllowedClassName>
}

/**
 * The reply-thread connector line.
 *
 * @param props - {@link ThreadConnectorProps}
 */
const ThreadConnector = ({ classNames }: ThreadConnectorProps) => (
    <div
        aria-hidden
        data-tier="atom"
        data-component="ThreadConnector"
        className={cn("ml-4 h-4 w-4 rounded-bl-2xl border-b border-l border-default", classNames)}
    />
)

export { ThreadConnector }

export const meta = { tier: "atom", name: "ThreadConnector" } as const
