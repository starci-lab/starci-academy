import type { ReactNode } from "react"
import { Divider } from "@sb-components/atoms/display/Divider/Divider"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"

/**
 * `SidebarNavGroup` — a cluster of `SidebarNavItem` rows: an optional full-width
 * divider above the group (splits it from the previous cluster), an optional
 * muted uppercase caption, then the rows. The caption is hidden while the rail
 * is collapsed so only the divider still separates icon clusters. Ported from
 * starci-academy's `blocks/navigation/SidebarNavGroup`.
 */

/** Props for {@link SidebarNavGroup}. */
export interface SidebarNavGroupProps {
    /** Uppercase section caption shown above the rows (omit for an unlabelled group). */
    label?: string
    /** Render a `Divider` above the group (use to split it from the group before it — never on the first). */
    divider?: boolean
    /** `true` → the rail is collapsed to an icon-only strip: the caption disappears, only the divider still separates clusters. */
    isCollapsed?: boolean
    /** Render the caption in its skeleton (loading) state. */
    isSkeleton?: boolean
    /** The {@link import("../SidebarNavItem").SidebarNavItem} rows. */
    children: ReactNode
}

/**
 * The nav group. See the file header for why the caption is hidden collapsed
 * and why the divider renders as its own leading leaf rather than a border on
 * the group itself.
 *
 * @param props - {@link SidebarNavGroupProps}
 */
const SidebarNavGroup = ({
    label,
    divider = false,
    isCollapsed = false,
    isSkeleton = false,
    children,
}: SidebarNavGroupProps) => (
    <div data-tier="block" data-component="SidebarNavGroup" className="flex flex-col gap-2">
        {divider ? <Divider /> : null}
        {label && !isCollapsed ? (
            <header className="px-3 pb-1 pt-1">
                {isSkeleton ? (
                    <Typography size="xs" isSkeleton />
                ) : (
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                        {label}
                    </span>
                )}
            </header>
        ) : null}
        <div className="flex flex-col gap-1">{children}</div>
    </div>
)

export { SidebarNavGroup }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "SidebarNavGroup" } as const
