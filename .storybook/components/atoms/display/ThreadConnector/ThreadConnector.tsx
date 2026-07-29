import { cn } from "@heroui/react"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ATOM — `ThreadConnector`: the curved guide line that visually links a
 * comment's avatar down into a reply composer's own avatar (thầy 2026-07-29,
 * "khi trả lời thì nested avatar like facebook, với có thể line màu cam được
 * k?"). Same family as `Stack.nested`'s straight indent-guide border — this is
 * that same idea BENT into a corner instead of a straight drop, so no block
 * ever hand-writes `border-l`/`border-b`/`rounded-bl-*` itself.
 *
 * Genuinely NEW capability, not a `src` port — real `CommentComposer` never
 * shows an avatar for a reply at all (see `ContentCommentComposer`'s own file
 * header).
 *
 * ⭐ HEIGHT IS FIXED, NOT `self-stretch` (thầy 2026-07-29: "cái mốc bị lệch" —
 * caught after the first cut stretched to match the WHOLE composer, including
 * the textarea+button rows below the avatar, so the curve never landed on the
 * avatar's actual center). The reply composer's own avatar is `size="sm"`
 * (`size-8`/32px) and top-aligned (`align="start"` on the composer's own row,
 * see its file header) — this connector's height is exactly HALF that
 * (`h-4`/16px), so its bottom border lands precisely at the avatar's vertical
 * center, not somewhere down the middle of a much taller box.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Props for {@link ThreadConnector}. */
export interface ThreadConnectorProps {
    /** Extra classes (placement only). */
    className?: string
}

/**
 * The reply-thread connector line. See the file header for the full contract.
 *
 * @param props - {@link ThreadConnectorProps}
 */
const ThreadConnector = ({ className }: ThreadConnectorProps) => (
    <div
        aria-hidden
        className={cn("ml-4 h-4 w-4 rounded-bl-2xl border-b border-l border-default", className)}
    />
)

export { ThreadConnector }
