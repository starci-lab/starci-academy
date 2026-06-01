"use client"

import React from "react"
import type {
    Icon,
} from "@phosphor-icons/react"
import {
    LockSimpleIcon,
} from "@phosphor-icons/react"

/** Props for {@link TabTrigger}. */
export interface TabTriggerProps {
    /** Phosphor icon rendered before the label. */
    icon: Icon
    /** Translated tab label. */
    label: string
    /** When true, append a lock glyph marking the tab as a gated premium feature. */
    locked?: boolean
}

/**
 * Icon + label content for a single content tab trigger.
 *
 * Presentational: renders the icon/label pair (and a trailing lock glyph for
 * gated tabs); the surrounding `Tabs.Tab` wrapper lives in {@link ContentTabBar}.
 * @param props - icon, label and locked flag for this trigger
 */
export const TabTrigger = ({
    icon: TabIcon,
    label,
    locked,
}: TabTriggerProps) => {
    return (
        <div className="flex items-center gap-2">
            <TabIcon className="size-5" />
            <span>{label}</span>
            {locked ? <LockSimpleIcon className="size-4" /> : null}
        </div>
    )
}
