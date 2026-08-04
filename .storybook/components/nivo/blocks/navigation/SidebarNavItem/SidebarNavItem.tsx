import type { ComponentType, ReactNode, SVGProps } from "react"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { Tooltip } from "@sb-components/atoms/overlay/Tooltip/Tooltip"

/**
 * `SidebarNavItem` — one destination row inside a `SidebarNavGroup`: a leading
 * icon + truncating label. The ONLY filled state is `isActive` (tonal
 * `bg-accent/10` + accent text — never a hard fill); hover is a faint tint,
 * focus is a ring, never a second fill. Collapsed drops the label and centers
 * the icon alone, moving the destination's name into a `Tooltip` so it stays
 * reachable on hover/focus. Ported from starci-academy's
 * `blocks/navigation/SidebarNavItem`.
 */

/** A nav-row glyph passed as a COMPONENT reference, rendered at row scale. */
export type SidebarNavItemIcon = ComponentType<SVGProps<SVGSVGElement> & { weight?: "regular" | "bold" }>

/** Props for {@link SidebarNavItem}. */
export interface SidebarNavItemProps {
    /** Leading glyph as a COMPONENT reference. */
    icon: SidebarNavItemIcon
    /** Visible label — already localized by the caller. */
    label: string
    /** `true` → this row matches the current route (tonal accent treatment). */
    isActive?: boolean
    /** `true` → the rail is collapsed to an icon-only strip: label hidden, icon centered, name moved into a `Tooltip`. */
    isCollapsed?: boolean
    /** Optional trailing content pinned to the row's right edge (e.g. a count badge). Hidden when collapsed. */
    endContent?: ReactNode
    /** Render the icon + label in their skeleton (loading) state. */
    isSkeleton?: boolean
    /** Fired when the row is pressed. */
    onPress: () => void
}

/** Row chrome, written out per state so the block never composes a class string at runtime. */
const ROW_BASE = "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition-colors"
const ROW_COLLAPSED = "flex w-full items-center justify-center rounded-xl p-2.5 text-sm transition-colors"
const ROW_ACTIVE = "bg-accent/10 font-medium text-accent"
const ROW_IDLE = "text-muted hover:bg-default/40 hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"

/**
 * One sidebar nav row. See the file header for the tonal-active/no-second-fill
 * contract and the collapsed → tooltip behaviour.
 *
 * @param props - {@link SidebarNavItemProps}
 */
const SidebarNavItem = ({
    icon: Icon,
    label,
    isActive = false,
    isCollapsed = false,
    endContent,
    isSkeleton = false,
    onPress,
}: SidebarNavItemProps) => {
    if (isSkeleton) {
        return (
            <div
                data-tier="block"
                data-component="SidebarNavItem"
                className={isCollapsed ? ROW_COLLAPSED : ROW_BASE}
            >
                <div className="size-5 shrink-0 rounded-md bg-default" />
                {!isCollapsed && <Typography size="sm" isSkeleton />}
            </div>
        )
    }

    const row = (
        <button
            type="button"
            data-tier="block"
            data-component="SidebarNavItem"
            onClick={onPress}
            aria-current={isActive ? "page" : undefined}
            aria-label={label}
            className={`${isCollapsed ? ROW_COLLAPSED : ROW_BASE} ${isActive ? ROW_ACTIVE : ROW_IDLE}`}
        >
            <Icon aria-hidden focusable="false" className="size-5 shrink-0" />
            {!isCollapsed && (
                <Typography
                    size="sm"
                    weight={isActive ? "medium" : undefined}
                    color={isActive ? "accent" : "muted"}
                    truncate
                    classNames={["flex-1"]}
                    text={label}
                />
            )}
            {!isCollapsed && endContent ? <span className="ml-auto shrink-0">{endContent}</span> : null}
        </button>
    )

    // Collapsed → the destination's name moves into a Tooltip (trailing edge,
    // toward the body) so it stays reachable on hover/focus once the label is gone.
    return isCollapsed ? (
        <Tooltip label={label} placement="right">
            {row}
        </Tooltip>
    ) : row
}

export { SidebarNavItem }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "SidebarNavItem" } as const
