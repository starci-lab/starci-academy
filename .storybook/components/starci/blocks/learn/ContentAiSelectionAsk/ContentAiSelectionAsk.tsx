import { SparkleIcon } from "@phosphor-icons/react"
import { cn } from "@heroui/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { StackH } from "@sb-components/frames/Stack/Stack"

/**
 * `ContentAiSelectionAsk` — the "Ask AI" pill that pops up next to a text
 * selection inside lesson content. Selection tracking and portal positioning are
 * DOM behaviour handled outside the block; it takes an `anchor` point. `isNew`
 * toggles a "New" chip beside the pill.
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
    /** `true` -> carries a "New" chip, for the first releases while readers learn the feature exists. */
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
    // rhythm) — the `Button`<->`Chip` seam is owned by `StackH` below, never hand-written here.
    <div
        style={{ position: "fixed", left: anchor.x, top: anchor.y }}
        className={cn("z-50 -translate-x-1/2 -translate-y-full", className)}
    >
        <StackH
            identity={{ tier: "block", component: "ContentAiSelectionAsk" }}
            gap={2}
            principle="icon-text"
            explain="Icon beside its label — not name-handle, because this pairs a glyph with text rather than a name/handle identity."
            align="center"
            items={[
                () => (
                    <Button
                        label="Ask AI"
                        variant="primary"
                        size="sm"
                        prefixIcon={SparkleIcon}
                        onPress={onOpen}
                        isElevated
                    />
                ),
                ...(isNew ? [() => (
                    <Chip
                        text="New"
                        tone="accent"
                    />
                )] : []),
            ]}
        />
    </div>
)

export { ContentAiSelectionAsk }
