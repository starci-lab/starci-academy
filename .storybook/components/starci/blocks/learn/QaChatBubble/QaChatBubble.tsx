import type { ReactNode } from "react"
import { cn } from "@heroui/react"

/**
 * BLOCK — `QaChatBubble`: the one surface every message in a Q&A
 * conversation renders inside — accent+right for the viewer's own message,
 * neutral+left for anyone else's. `rounded-2xl`, the documented chat
 * exception to the usual card `rounded-3xl`.
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
