import { SparkleIcon } from "@phosphor-icons/react"
import { cn } from "@heroui/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { StackH } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `ContentAiSelectionAsk`: the "Ask AI about this passage" pill that appears
 * next to a text selection inside lesson content.
 *
 * ⭐ SCOPE CUT (§B3, per task instruction): tracking WHICH text is selected and
 * computing WHERE the pill should sit (portal into `document.body`, follow the
 * selection rect, reposition on scroll/resize, dismiss on blur/selection-clear)
 * is pure DOM behaviour with no reusable presentational surface — there is no
 * "shape" to draw for it, only event wiring. That belongs to the SCREEN
 * (`ContentArticle`'s owner), same discipline as a screen never wiring a real
 * router. This block owns exactly one thing: given a point, render the pill
 * there. `anchor` is a plain `{ x, y }` the caller/story supplies — in the real
 * app that is `selection.getBoundingClientRect()` turned into a viewport point;
 * here it is a fixed demo position.
 *
 * WHY THIS EARNS A LAYER OVER A BARE `Button` (§10 check-passthrough-block): it
 * is not a passthrough — it fixes the pill at a VIEWPORT point (the one part of
 * this widget that is genuinely its job), picks the "ask AI" wording + glyph so
 * every call site asks the same way, and layers the optional "New" chip badge
 * on top without the caller having to know a second leaf exists.
 *
 * `position: fixed` (not `absolute`): the anchor is a VIEWPORT point (matches
 * `getBoundingClientRect()` in the real caller), not an offset inside whatever
 * DOM ancestor happens to be positioned — `absolute` would drift if that
 * ancestor scrolls independently of the viewport.
 *
 * NEVER SKELETONISED, on purpose — same reasoning as `ContentModeNav`: this
 * pill only exists because a real, current text selection just triggered it,
 * so there is no "waiting for data" moment for it to shimmer through.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** A viewport point (already resolved by the caller — e.g. a selection rect). */
export interface ContentAiSelectionAskAnchor {
    /** Distance from the left edge of the viewport, in pixels. */
    x: number
    /** Distance from the top edge of the viewport, in pixels. */
    y: number
}

/** Props for {@link ContentAiSelectionAsk}. */
export interface ContentAiSelectionAskProps {
    /** Fired when the reader taps the pill — the caller opens the AI side-thread. */
    onOpen: () => void
    /** Where to plant the pill, in viewport coordinates. */
    anchor: ContentAiSelectionAskAnchor
    /** `true` → carries a "New" chip, for the first releases while readers learn the feature exists. */
    isNew?: boolean
    className?: string
}

/**
 * The "ask AI about this passage" pill, planted at a caller-supplied viewport
 * point. See the file header for the scope cut around selection tracking.
 *
 * @param props - {@link ContentAiSelectionAskProps}
 */
const ContentAiSelectionAsk = ({
    onOpen,
    anchor,
    isNew = false,
    className,
}: ContentAiSelectionAskProps) => (
    // Positioning ONLY on this outer box (§13z exempts the anchor point itself, not a row
    // rhythm) — the `Button`↔`Chip` seam is owned by `StackH` below, never hand-written here.
    <div
        style={{ position: "fixed", left: anchor.x, top: anchor.y }}
        className={cn("z-50 -translate-x-1/2 -translate-y-full", className)}

    >
        <StackH
            gap={2}
            align="center"
            body={
                <>
                    <Button
                        label="Ask AI"
                        variant="primary"
                        size="sm"
                        prefixIcon={SparkleIcon}
                        onPress={onOpen}
                        isElevated

                    />
                    {isNew ? (
                        <Chip
                            text="New"
                            tone="accent"

                        />
                    ) : null}
                </>
            }
        />
    </div>
)

export { ContentAiSelectionAsk }
