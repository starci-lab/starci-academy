"use client"

import React from "react"
import type {
    Icon,
} from "@phosphor-icons/react"

/** Props for {@link TabTrigger}. */
export interface TabTriggerProps {
    /** Phosphor icon rendered before the label. */
    icon: Icon
    /** Translated tab label. */
    label: string
}

/**
 * Icon + label content for a single content tab trigger.
 *
 * Presentational: renders the icon/label pair only; the surrounding
 * `Tabs.Tab` wrapper lives in {@link ContentTabBar}. No logic.
 * @param props - icon and label for this trigger
 */
export const TabTrigger = ({
    icon: TabIcon,
    label,
}: TabTriggerProps) => {
    return (
        <div className="flex items-center gap-2">
            <TabIcon className="size-5" />
            <span>{label}</span>
        </div>
    )
}
