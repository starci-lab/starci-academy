import React from "react"
import type { ReactNode } from "react"
import { CheckCircleIcon } from "@phosphor-icons/react"
import { ListRow } from "./ListRow"
import { IconTile } from "./IconTile"
import { StatusChip } from "./StatusChip"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — ported faithfully from
 * `@/components/blocks/feedback/ReadinessChecklist`. Authored in Storybook (not
 * `src`); synced to `src` later. Its `ListRow`, `IconTile`, and `StatusChip`
 * dependencies are faithful local copies in sibling files (`./ListRow`,
 * `./IconTile`, `./StatusChip`) since no local ports exist elsewhere yet.
 */

/** One row of a {@link ReadinessChecklist}. */
export interface ReadinessChecklistItem {
    /** Stable row key. */
    id: string
    /** Icon shown when the item is NOT ready (a `ready` row swaps it for a check). */
    icon: ReactNode
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
}

/**
 * A vertical list of prerequisite/setup checks, each rendered as a {@link ListRow}:
 * a leading `IconTile` (success-toned check when ready, the caller's own icon in
 * neutral tone while pending), the item's label as title, a ready/pending
 * description as subtitle, and a trailing {@link StatusChip} spelling out the state.
 * Purely presentational.
 *
 * @param props - See {@link ReadinessChecklistProps}.
 */
export const ReadinessChecklist = ({ items, readyLabel, pendingLabel, className }: ReadinessChecklistProps) => {
    return (
        <div className={className}>
            {items.map((item, index) => (
                <ListRow
                    key={item.id}
                    // p-3, not ListRow's bare py-2: this checklist always renders
                    // INSIDE a bounded card, where a row with no horizontal padding
                    // sits flush against the card edge. Padding on the ROW keeps the
                    // divider full-width (border-b is on the row box, outside padding).
                    className="p-3"
                    divider={index < items.length - 1}
                    leading={(
                        <IconTile
                            // circle-check, not a bare tick — icon.md §2: every
                            // "done / passed" mark is `CheckCircleIcon`.
                            icon={item.ready ? <CheckCircleIcon aria-hidden focusable="false" /> : item.icon}
                            tone={item.ready ? "success" : "neutral"}
                            size="sm"
                        />
                    )}
                    title={item.label}
                    subtitle={item.ready ? item.readyDescription : item.pendingDescription}
                    trailing={(
                        <StatusChip tone={item.ready ? "success" : "neutral"}>
                            {item.ready ? readyLabel : pendingLabel}
                        </StatusChip>
                    )}
                />
            ))}
        </div>
    )
}
