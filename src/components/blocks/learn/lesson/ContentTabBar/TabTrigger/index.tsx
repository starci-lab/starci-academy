"use client"

import type { IconComponent } from "@/types"
import { LockIcon } from "@phosphor-icons/react"
import React from "react"
import { StackH } from "@/components/frames/Stack"

/** Props for {@link TabTrigger}. */
export interface TabTriggerProps {
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
    locked}: TabTriggerProps) => {
    // When gated, the lock OVERRIDES the tab's own icon (one icon, not icon + lock).
    const Icon = locked ? LockIcon : TabIcon
    return (
        <StackH
            identity={{ tier: "block", component: "TabTrigger" }}
            gap={2}
            align="center"
            principle="icon-text"
            explain="Icon beside its label on one baseline — not title-subtitle, because these sit on one horizontal line rather than a stacked title voice; not label-field, because the text is not a form control label."
            items={[
                () => <Icon className="size-4" aria-label={locked ? label : undefined} />,
                () => <span>{label}</span>,
            ]}
        />
    )
}
