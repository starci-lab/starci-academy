import { HeartIcon } from "@phosphor-icons/react"
import { cn } from "@heroui/react"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `QaReactionBar`: the like-and-count control under a question or
 * answer bubble in `QaQuestionThread`. Split out because `QaQuestionThread`'s
 * own file header names it as one of four siblings it composes but does not
 * itself build (§"ASSUMED CONTRACTS").
 *
 * ⭐ SCOPE CUT, DOCUMENTED: the backend's `QaReactionType` carries six kinds
 * (`like`/`love`/`haha`/`wow`/`sad`/`angry`), matching `src`'s own reaction
 * picker. Nothing in `QaQuestionThread`'s task brief named a six-way picker
 * UI, and its own call site only ever toggles a single reaction on and off
 * (`applyReaction` treats "pressed again" as "clear"). This block renders ONE
 * heart toggle — pressing it sends `"like"` when the viewer had no reaction,
 * or `null` (clear) when they already reacted with anything — rather than
 * guess a six-glyph popover no caller asked for. The full type stays on the
 * wire so a future picker can widen this without a prop-shape change.
 * ─────────────────────────────────────────────────────────────────────────────
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
    /** When on, emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it. */
    anatPart?: string
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
    showAnatomy = false,
    anatPart,
}: QaReactionBarProps) => {
    const hasReacted = myReaction != null

    if (isSkeleton) {
        return (
            <span
                data-anat-part={anatPart}
                className="inline-block h-5 w-10 animate-pulse rounded-full bg-default"
            />
        )
    }

    return (
        <button
            type="button"
            data-anat-part={anatPart}
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
                <Typography size="xs" text={String(count)} showAnatomy={showAnatomy} />
            ) : null}
        </button>
    )
}

export { QaReactionBar }
