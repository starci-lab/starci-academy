import React from "react"
import { CheckCircleIcon } from "@phosphor-icons/react"
import { List } from "@sb-components/composites/lists/List/List"
import { IconTile, type IconComponent } from "@sb-components/atoms/display/IconTile/IconTile"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { AnatomyOverlay } from "@sb-utils/AnatomyOverlay/AnatomyOverlay"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — ported faithfully from
 * `@/components/blocks/feedback/ReadinessChecklist`. Authored in Storybook (not
 * `src`); synced to `src` later. Its `List.Row`, `IconTile`, and `StatusChip`
 * dependencies are the real local ports (`../../lists/List/List`,
 * `../../identity/IconTile/IconTile`, `../../chips/StatusChip/StatusChip`).
 */

/** One row of a {@link ReadinessChecklist}. */
export interface ReadinessChecklistItem {
    /** Stable row key. */
    id: string
    /** Icon shown when the item is NOT ready (a `ready` row swaps it for a check). */
    icon: IconComponent
    /** Row title — the thing being checked (e.g. "Ollama agent"). */
    label: string
    /** Subtitle shown when {@link ReadinessChecklistItem.ready} is true. */
    readyDescription: string
    /** Subtitle shown when {@link ReadinessChecklistItem.ready} is false. */
    pendingDescription: string
    /** Whether this prerequisite/step is satisfied. */
    ready: boolean
}

/** Props for the {@link ReadinessChecklist} block. */
export interface ReadinessChecklistProps {
    /** Rows, top to bottom. */
    items: Array<ReadinessChecklistItem>
    /** Trailing chip label for a ready row (i18n-driven by the caller). */
    readyLabel: string
    /** Trailing chip label for a pending row (i18n-driven by the caller). */
    pendingLabel: string
    /** Extra classes on the wrapper. */
    className?: string
    /**
     * Storybook-only: when true, badges each row's directly-composed parts —
     * `List.Row` (leading·title·subtitle·trailing, opaque here — no `data-anat-part`
     * of its own, so it's badged via an {@link AnatomyOverlay} marker), plus the
     * `IconTile` and `StatusChip` this block wires directly into that row's
     * `leading`/`trailing` slots. No visual effect.
     */
    showAnatomy?: boolean
}

/**
 * A vertical list of prerequisite/setup checks, each rendered as a {@link List.Row}:
 * a leading `IconTile` (success-toned check when ready, the caller's own icon in
 * neutral tone while pending), the item's label as title, a ready/pending
 * description as subtitle, and a trailing {@link StatusChip} spelling out the state.
 * Purely presentational.
 *
 * @param props - See {@link ReadinessChecklistProps}.
 */
export const ReadinessChecklist = ({ items, readyLabel, pendingLabel, className, showAnatomy = false }: ReadinessChecklistProps) => {
    return (
        <div className={className}>
            {items.map((item, index) => {
                const row = (
                    <List.Row
                        // p-3, not List.Row's bare py-2: this checklist always renders
                        // INSIDE a bounded card, where a row with no horizontal padding
                        // sits flush against the card edge. Padding on the ROW keeps the
                        // divider full-width (border-b is on the row box, outside padding).
                        className="p-3"
                        divider={index < items.length - 1}
                        leading={(
                            <IconTile.Base
                                // circle-check, not a bare tick — icon.md §2: every
                                // "done / passed" mark is `CheckCircleIcon`.
                                icon={item.ready ? CheckCircleIcon : item.icon}
                                tone={item.ready ? "success" : "neutral"}
                                size="sm"
                                anatPart={showAnatomy ? "IconTile" : undefined}
                            />
                        )}
                        title={item.label}
                        subtitle={item.ready ? item.readyDescription : item.pendingDescription}
                        trailing={(
                            <Chip.Base
                                tone={item.ready ? "success" : "neutral"}
                                anatPart={showAnatomy ? "StatusChip" : undefined}
                                text={item.ready ? readyLabel : pendingLabel}
                            />
                        )}
                    />
                )
                // List.Row doesn't accept `data-anat-part` itself — badge it via an
                // AnatomyOverlay marker on a `relative` wrapper instead (§11a: List.Row
                // is the DIRECT part; its own leading/title/subtitle/trailing are its
                // internals, not drilled here — see List.Row's own story).
                return showAnatomy ? (
                    <div key={item.id} className="relative" data-anat>
                        {row}
                        <AnatomyOverlay label="List.Row" tier="design" />
                    </div>
                ) : (
                    <React.Fragment key={item.id}>{row}</React.Fragment>
                )
            })}
        </div>
    )
}
