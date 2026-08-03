import { HeartIcon } from "@phosphor-icons/react"
import { cn } from "@heroui/react"
import { Typography } from "@/components/atoms/text/Typography"

/**
 * BLOCK — `QaReactionBar`: the like-and-count control under a message
 * bubble. Renders one heart toggle rather than the full six-reaction picker
 * — see the component's own file header for why.
 */

/** Mirrors `QaQuestionThread`'s own `QaReactionType` (kept local — see that file's ASSUMED CONTRACTS note). */
export type QaReactionType = "like" | "love" | "haha" | "wow" | "sad" | "angry"

/** Props for {@link QaReactionBar}. */
export interface QaReactionBarProps {
    /** Total reactions on the message. */
    count: number
    /** The viewer's own reaction, or `null` if they haven't reacted. */
    myReaction: QaReactionType | null
    /** Fires with the new reaction (`"like"` to react, `null` to clear). */
    onReact: (type: QaReactionType | null) => void
    /** `true` → renders a shimmer mirror instead of the live control. */
    isSkeleton?: boolean
}

/**
 * One like-and-count toggle under a message bubble.
 *
 * @param props - {@link QaReactionBarProps}
 */
const QaReactionBar = ({
    count,
    myReaction,
    onReact,
    isSkeleton = false,
}: QaReactionBarProps) => {
    const hasReacted = myReaction != null

    if (isSkeleton) {
        return (
            <span

                className="inline-block h-5 w-10 animate-pulse rounded-full bg-default"
            />
        )
    }

    return (
        <button
            type="button"

            onClick={() => onReact(hasReacted ? null : "like")}
            aria-pressed={hasReacted}
            aria-label={hasReacted ? "Unlike" : "Like"}
            className={cn(
                // inset-exception: pill geometry, the same px-2 py-1 HeroUI ships in chip.css
                "inline-flex items-center gap-1 rounded-full px-2 py-1 transition-colors hover:bg-default",
                hasReacted && "text-danger-soft-foreground",
            )}
        >
            <HeartIcon weight={hasReacted ? "fill" : "regular"} aria-hidden focusable="false" className="size-3.5 shrink-0" />
            {count > 0 ? (
                <Typography size="xs" text={String(count)} />
            ) : null}
        </button>
    )
}

export { QaReactionBar }
