import React from "react"
import { cn } from "@heroui/react"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { StackH } from "@sb-components/frames/Stack/Stack"
import { useSidebarCollapsed } from "@sb-components/starci/blocks/navigation/CollapsibleSidebar/CollapsibleSidebar"
import { DESTINATION_ICON, DESTINATION_LABEL } from "../SettingsSidebarNav"
import type { SettingsNavItem } from "../SettingsSidebarNav"

/** Props for {@link DesktopNavRow}. */
export interface DesktopNavRowProps {
    /** Which destination this row is. */
    item: SettingsNavItem
    /** Whether this row's `href` is the one being viewed right now. */
    isActive: boolean
    /** Fired with the row's `href` when it is pressed. */
    onNavigate: (href: string) => void
}

/**
 * One destination row in the desktop rail: a leading icon + truncating label, icon-only
 * when `CollapsibleSidebar` is collapsed (read via `useSidebarCollapsed`, exported by that
 * composite so any nav-row content can drop to a rail without owning the flag itself).
 * A plain `<button>` rather than a HeroUI `Link` — see the file header's hand-roll call.
 */
export const DesktopNavRow = ({ item, isActive, onNavigate }: DesktopNavRowProps) => {
    const collapsed = useSidebarCollapsed()
    const Icon = DESTINATION_ICON[item.key]
    const rowContent = (
        <>
            <Icon aria-hidden focusable="false" className="size-5 shrink-0" />
            {!collapsed ? (
                <Typography
                    size="sm"
                    weight={isActive ? "medium" : undefined}
                    text={DESTINATION_LABEL[item.key]}
                    truncate

                />
            ) : null}
        </>
    )
    return (
        <button
            type="button"
            aria-label={DESTINATION_LABEL[item.key]}
            aria-current={isActive ? "page" : undefined}
            onClick={() => onNavigate(item.href)}
            className={cn(
                "w-full rounded-large text-start outline-none transition-colors focus-visible:ring-2 focus-visible:ring-accent",
                collapsed ? "px-2 py-2" : "px-3 py-2",
                isActive ? "bg-accent-soft text-accent-soft-foreground" : "text-foreground hover:bg-default/40",
            )}
        >
            <StackH gap={2} principle="icon-text" align="center" justify={collapsed ? "center" : "start"} items={[() => rowContent]} />
        </button>
    )
}
