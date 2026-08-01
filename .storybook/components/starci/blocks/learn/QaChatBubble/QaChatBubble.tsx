import type { ReactNode } from "react"
import { cn } from "@heroui/react"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `QaChatBubble`: the one-note surface every message in a
 * `QaQuestionThread` conversation renders inside — accent-tinted and
 * right-aligned for the viewer's own messages, neutral and left-aligned for
 * everyone else's. `rounded-2xl` (not the usual card `rounded-3xl`) because
 * chat bubbles are one of the named exceptions to that rule (alongside
 * group/popover/media/field surfaces).
 *
 * Deliberately DUMB: it owns only the surface + one corner clip that reads as
 * a speech-bubble tail toward its own side. Alignment (`justify-end` vs
 * `justify-start`) and the author/time line above it are the CALLER's job
 * (`QaQuestionThread` already wraps each message in its own aligned column) —
 * this block would otherwise have to know who the viewer is, which is a
 * domain fact it has no business holding.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Props for {@link QaChatBubble}. */
export interface QaChatBubbleProps {
    /** `"user"` → the viewer's own message (accent, tail on the right). `"assistant"` → anyone else's (neutral, tail on the left). */
    role: "user" | "assistant"
    /** Bubble content — typically a compact {@link import("@sb-components/composites/viewers/MarkdownContent/MarkdownContent").MarkdownContent}. */
    children: ReactNode
    /** `true` → the bubble draws a shimmer block instead of `children`. */
    isSkeleton?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it. */
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
