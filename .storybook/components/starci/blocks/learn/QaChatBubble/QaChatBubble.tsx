import type { ReactNode } from "react"
import { cn } from "@heroui/react"

/**
 * `QaChatBubble` — the surface every message in a `QaQuestionThread` renders
 * inside: accent-tinted and right-aligned for the viewer's own messages, neutral
 * and left-aligned otherwise. `rounded-2xl` (a named exception to the card
 * `rounded-3xl` rule). Deliberately dumb — it owns only the surface and a corner
 * clip reading as a speech-bubble tail; alignment and the author/time line are
 * the caller's job.
 */

/** Props for {@link QaChatBubble}. */
export interface QaChatBubbleProps {
    /** `"user"` → the viewer's own message (accent, tail on the right). `"assistant"` → anyone else's (neutral, tail on the left). */
    role: "user" | "assistant"
    /** Bubble content — typically a compact {@link import("@sb-components/composites/viewers/MarkdownContent/MarkdownContent").MarkdownContent}. */
    children: ReactNode
    /** `true` → the bubble draws a shimmer block instead of `children`. */
    isSkeleton?: boolean
}

/**
 * The one message-bubble surface a `QaQuestionThread` conversation renders,
 * tinted and tailed toward the viewer's own side or the other party's.
 *
 * @param props - {@link QaChatBubbleProps}
 */
const QaChatBubble = ({ role, children, isSkeleton = false }: QaChatBubbleProps) => (
    <div

        className={cn(
            "min-w-0 rounded-2xl px-3 py-3",
            role === "user"
                ? "rounded-tr-md bg-accent-soft text-accent-soft-foreground"
                : "rounded-tl-md bg-default text-foreground",
            isSkeleton && "h-10 w-40 animate-pulse",
        )}
    >
        {!isSkeleton ? children : null}
    </div>
)

export { QaChatBubble }
