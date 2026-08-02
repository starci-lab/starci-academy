import { SparkleIcon } from "@phosphor-icons/react"
import { cn } from "@heroui/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { StackH } from "@sb-components/frames/Stack/Stack"

/**
 * `ContentAiSelectionAsk` — a BLOCK: the "Ask AI about this passage" pill that
 * appears next to a text selection inside lesson content.
 *
 * Scope: tracking which text is selected and where the pill should sit (portalling,
 * following the selection rect, repositioning, dismissing) is pure DOM behaviour
 * with no reusable surface, so it belongs to the screen. This block owns exactly
 * one thing: given a point, render the pill there. `anchor` is a plain `{ x, y }`
 * the caller supplies (a `getBoundingClientRect()` viewport point in the real app).
 *
 * Earns its layer over a bare `Button` by fixing the pill at a viewport point,
 * choosing the "ask AI" wording + glyph, and layering an optional "New" chip badge.
 * Uses `position: fixed` (a viewport point), not `absolute`. Never skeletonised —
 * it only exists because a real, current selection triggered it.
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
