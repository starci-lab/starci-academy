"use client"

import React from "react"
import type { ReactNode } from "react"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { TabsCard } from "../TabsCard"

/** One option of a {@link SegmentedControl}. */
export interface SegmentedControlItem<T extends string> {
    /** The value selected when this segment is pressed. */
    value: T
    /** Segment label (text / icon + text). */
    label: ReactNode
    /** When true the segment is shown dimmed and not pressable. */
    isDisabled?: boolean
}

/** Track/segment sizing for a {@link SegmentedControl}. */
export type SegmentedControlSize = "sm" | "md"

/** Props for the {@link SegmentedControl} block. */
export interface SegmentedControlProps<T extends string> extends WithClassNames<undefined> {
    /** The selectable segments (2+). */
    items: Array<SegmentedControlItem<T>>
    /** Currently selected value. */
    value: T
    /** Fired with the new value when a segment is pressed. */
    onChange: (value: T) => void
    /** Accessible label for the group. */
    ariaLabel?: string
    /**
     * Track/segment size. `"md"` (default) segments are equal-width, stretch
     * to fill the parent. `"sm"` segments shrink to their label (the track
     * becomes `w-fit`) — for a compact inline switch that shouldn't claim the
     * full row width (e.g. a secondary choice inside a modal panel).
     */
    size?: SegmentedControlSize
}

/**
 * A pill segmented control for a small mutually-exclusive choice that drives
 * LOCAL state (e.g. a currency toggle, a grid/line view switch) — never a
 * whole-panel/route change (that's `TabsCard`, underline tabs). Kept as its
 * own named block for that semantic distinction (a real `role="tablist"`
 * implies associated tabpanels; a plain settings toggle shouldn't claim that
 * relationship) — but internally it's a thin adapter over the real `TabsCard`
 * (`variant="primary"`, HeroUI's own segmented-pill rendering) rather than a
 * hand-rolled `<button>` group, so both surfaces share ONE real implementation
 * (keyboard roving-tabindex, ARIA tab/tabpanel wiring, visual skin) instead of
 * two components that happened to converge on the same look by coincidence.
 * The caller's API is unchanged (items + value + onChange + size) — only the
 * render internals moved onto `Tabs`.
 *
 * @param props - {@link SegmentedControlProps}
 */
export const SegmentedControl = <T extends string>({
    items,
    value,
    onChange,
    ariaLabel,
    size = "md",
    className,
}: SegmentedControlProps<T>) => (
        <TabsCard
            variant="primary"
            size={size}
            className={className}
            leftTabs={{
                items: items.map((item) => ({
                    key: item.value,
                    label: item.label,
                    isDisabled: item.isDisabled,
                })),
                selectedKey: value,
                ariaLabel: ariaLabel ?? "",
                onSelectionChange: (key) => onChange(String(key) as T),
            }}
        />
    )
