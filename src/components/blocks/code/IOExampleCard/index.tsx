import React from "react"
import type { ReactNode } from "react"
import { cn } from "@heroui/react"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Semantic tone of one IO row's label (drives the label colour only). */
export type IORowTone = "default" | "success" | "danger"

/** One labelled monospace block inside an {@link IOExampleCard}. */
export interface IOExampleRow {
    /** Stable key. */
    key: string
    /** Small muted label above the value (e.g. "Đầu vào", "Mong đợi"). */
    label: ReactNode
    /** The literal value, rendered monospace and pre-wrapped. */
    value: string
    /** Label tone — `success`/`danger` tint the label for a expected-vs-got diff. */
    tone?: IORowTone
}

/** Props for the {@link IOExampleCard} block. */
export interface IOExampleCardProps extends WithClassNames<undefined> {
    /** The labelled blocks, in order — separated by a dashed inset rule. */
    rows: Array<IOExampleRow>
}

/** Label colour per tone. */
const TONE_CLASS: Record<IORowTone, string> = {
    default: "text-muted",
    success: "text-success",
    danger: "text-danger",
}

/**
 * A bounded card that renders one or more LABELLED monospace blocks — a sample
 * testcase (input → output), or a failed-case diff (input · expected · got with
 * tinted labels). Replaces the hand-rolled `<pre className="bg-default-100">`
 * scattered across the coding surfaces so every IO block reads the same: a small
 * muted label over a mono, pre-wrapped value, rows split by a dashed inset rule.
 * Presentational + props-only.
 *
 * @param props - {@link IOExampleCardProps}
 * @see Story: .storybook/stories/blocks/code/IOExampleCard/IOExampleCard.stories
 */
export const IOExampleCard = ({ rows, className }: IOExampleCardProps) => {
    return (
        <div className={cn("overflow-hidden rounded-3xl border border-default bg-surface", className)}>
            {rows.map((row, index) => (
                <div
                    key={row.key}
                    className={cn("px-3 py-2", index > 0 && "border-t border-dashed border-default")}
                >
                    <div className={cn("text-xs font-medium", TONE_CLASS[row.tone ?? "default"])}>
                        {row.label}
                    </div>
                    <pre className="mt-1 whitespace-pre-wrap break-words font-mono text-sm text-foreground">
                        {row.value}
                    </pre>
                </div>
            ))}
        </div>
    )
}
