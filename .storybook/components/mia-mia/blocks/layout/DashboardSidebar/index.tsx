"use client"

import React from "react"
import {
    CollapsibleSidebar,
} from "@/components/blocks/navigation/CollapsibleSidebar"
import {
    SidebarNavGroup,
} from "@/components/blocks/navigation/SidebarNavGroup"
import {
    SidebarNavItem,
} from "@/components/blocks/navigation/SidebarNavItem"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"

/** One navigable destination in the dashboard sidebar. */
export interface DashboardNavItem {
    /** Stable key. */
    key: string
    /** Route this row navigates to (compared against `activeHref` for the highlight). */
    href: string
    /** Visible label. */
    label: string
    /** Leading icon. */
    icon: React.ReactNode
    /** Optional trailing badge (e.g. a count or a lock). */
    endContent?: React.ReactNode
}

/** A labelled cluster of rows, divided from the group above it. */
export interface DashboardNavGroup {
    /** Stable key. */
    key: string
    /** Uppercase caption (omit for an unlabelled group). */
    label?: string
    /** Rows in display order. */
    items: Array<DashboardNavItem>
}

/** Props for the {@link DashboardSidebar} block. */
export interface DashboardSidebarProps extends WithClassNames<undefined> {
    /** Heading in the panel header (product name / section). */
    title: string
    /** Grouped navigation rows. */
    groups: Array<DashboardNavGroup>
    /** The current route — the row whose `href` equals this gets the accent fill. */
    activeHref: string
    /** Fired with a row's `href` when it is activated (the caller navigates). */
    onNavigate: (href: string) => void
    /** Accessible label for the collapse toggle. */
    collapseLabel: string
    /** Accessible label for the expand toggle. */
    expandLabel: string
    /** localStorage key under which the collapsed flag persists. */
    storageKey: string
    /** Optional node pinned above the scrollable nav (e.g. a resume pill). */
    topSlot?: React.ReactNode
}

/**
 * The dashboard's left navigation shell: a {@link CollapsibleSidebar} filled with
 * grouped {@link SidebarNavItem} rows. Purely presentational — it owns no routing
 * and no data: the caller feeds the grouped nav model, marks the active route with
 * `activeHref`, and navigates in `onNavigate`. Active highlight is `href ===
 * activeHref`; the collapse chrome, persistence and the icon rail all come from
 * {@link CollapsibleSidebar}. Pair the connected half (router + nav config) in a
 * feature layout.
 *
 * @param props - {@link DashboardSidebarProps}
 * @see Story: .storybook/stories/mia-mia/DashboardSidebar/DashboardSidebar.stories
 */
export const DashboardSidebar = ({
    title,
    groups,
    activeHref,
    onNavigate,
    collapseLabel,
    expandLabel,
    storageKey,
    topSlot,
    className,
}: DashboardSidebarProps) => {
    return (
        <CollapsibleSidebar
            title={title}
            collapseLabel={collapseLabel}
            expandLabel={expandLabel}
            storageKey={storageKey}
            topSlot={topSlot}
            className={className}
        >
            {groups.map((group, index) => (
                <SidebarNavGroup key={group.key} label={group.label} divider={index > 0}>
                    {group.items.map((item) => (
                        <SidebarNavItem
                            key={item.key}
                            icon={item.icon}
                            label={item.label}
                            endContent={item.endContent}
                            isActive={item.href === activeHref}
                            onPress={() => onNavigate(item.href)}
                        />
                    ))}
                </SidebarNavGroup>
            ))}
        </CollapsibleSidebar>
    )
}
