"use client"

import type { IconComponent } from "@/types"
import { LockIcon } from "@phosphor-icons/react"
import React from "react"
import { cn } from "@heroui/react"
import type { WithClassNames } from "@/modules/types"


/** Props for {@link TabTrigger}. */
export interface TabTriggerProps extends WithClassNames<undefined> {
    /** Icon rendered before the label. */
    icon: IconComponent
    /** Translated tab label. */
    label: string
    /** When true, append a lock glyph marking the tab as a gated premium feature. */
    locked?: boolean
}

/**
 * IconComponent + label content for a single content tab trigger.
 *
 * Presentational: renders the icon/label pair (and a trailing lock glyph for
 * gated tabs); the surrounding `Tabs.Tab` wrapper lives in {@link ContentTabBar}.
 * @param props - icon, label and locked flag for this trigger
 */
export const TabTrigger = ({
    icon: TabIcon,
    label,
    locked,
    className,
}: TabTriggerProps) => {
    return (
        <div className={cn("flex items-center gap-2", className)}>
            <TabIcon className="size-5" />
            <span>{label}</span>
            {locked ? <LockIcon className="size-5" /> : null}
        </div>
    )
}
