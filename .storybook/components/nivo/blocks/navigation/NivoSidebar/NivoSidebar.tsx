import type { ComponentType, ReactNode, SVGProps } from "react"
import { SidebarSimpleIcon } from "@phosphor-icons/react"
import { cn } from "@heroui/react"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Avatar } from "@sb-components/atoms/display/Avatar/Avatar"
import { Chip, type ChipTone } from "@sb-components/atoms/chips/Chip/Chip"
import { SidebarNavGroup } from "@sb-components/nivo/blocks/navigation/SidebarNavGroup/SidebarNavGroup"
import { SidebarNavItem } from "@sb-components/nivo/blocks/navigation/SidebarNavItem/SidebarNavItem"

/**
 * `NivoSidebar` — the left-rail navigation block for the nivo dashboard shell.
 * THREE regions: a header (brand + collapse toggle), a scrollable column of
 * GROUPED nav rows, and an account row pinned OUTSIDE the scroll at the very
 * bottom. `isCollapsed` is the viewer's OWN choice — the connected layer
 * persists it, mirroring starci-academy's `CollapsibleSidebar`. Grounded in
 * the real `AppSidebar`; the shell mounts it on the LEFT (`RailShell
 * side="start"`).
 */

/** A nav-row glyph passed as a COMPONENT reference (e.g. `GaugeIcon`), rendered at row scale. */
export type NivoNavIcon = ComponentType<SVGProps<SVGSVGElement> & { weight?: "regular" | "bold" }>

/** The brand mark pinned in the header, above the scrollable nav. */
export interface NivoSidebarBrand {
    /** App name shown as the brand mark — already localized by the caller. */
    name: string
    /** Fired when the brand mark is pressed — routing "home" is the caller's call. */
    onLogoPress: () => void
}

/** One active (navigable) destination in the rail. */
export interface NivoSidebarItem {
    /** Stable id. */
    id: string
    /** Visible label — already localized by the caller. */
    label: string
    /** Leading glyph as a COMPONENT reference. */
    icon: NivoNavIcon
    /** Destination the row points at — the connected layer swaps in a real router link. */
    href: string
    /** `true` → this row matches the current route (tonal accent treatment). */
    isActive?: boolean
    /** Optional trailing content (e.g. an unpaid-invoice count). Hidden when collapsed. */
    endContent?: ReactNode
    /** Fired when the row is pressed. */
    onPress: () => void
}

/**
 * One cluster of destinations. The FIRST group in {@link NivoSidebarProps.groups}
 * never draws a divider (there is nothing above it to split from); every group
 * after it does — whether or not it carries a `label`, per the four-cluster
 * shape (`Overview` alone → `Business` → `Billing` → an unlabelled cluster).
 */
export interface NivoSidebarGroup {
    /** Stable id. */
    id: string
    /** Uppercase caption shown above the group's rows — omit for an unlabelled cluster. */
    label?: string
    /** The group's destinations, in display order. */
    items: Array<NivoSidebarItem>
}

/** The pinned account row's data — the `UserCell`-shaped identity block. */
export interface NivoSidebarAccount {
    /** Display name — the row's primary label. */
    name: string
    /** Email — the row's secondary line. */
    email: string
    /** Uploaded avatar URL; the `Avatar` atom's own fallback chain covers the rest. */
    avatarUrl?: string | null
    /** Plan chip text, e.g. `"Pro"` / `"Free"`. */
    planLabel: string
    /** Plan chip tone. Default `"accent"`. */
    planTone?: ChipTone
    /** Fired when the row is pressed — routes to `/account`. */
    onPress: () => void
}

/** Props for {@link NivoSidebar}. */
export interface NivoSidebarProps {
    /** Brand mark pinned in the header. */
    brand: NivoSidebarBrand
    /** The rail's clusters, in display order — the ONE source the nav column reads. */
    groups: Array<NivoSidebarGroup>
    /** The pinned account row, outside the scroll. */
    account: NivoSidebarAccount
    /**
     * Collapse to an icon-only rail: the brand mark, every group caption, and
     * every row label disappear; rows centre on their icon and the account row
     * drops to avatar-only. The viewer's OWN choice — a manual toggle, not a
     * width breakpoint.
     */
    isCollapsed?: boolean
    /** Fired when the collapse toggle is pressed. */
    onToggleCollapse: () => void
    /** Accessible label for the toggle when expanded (offers to collapse). */
    collapseLabel: string
    /** Accessible label for the toggle when collapsed (offers to expand). */
    expandLabel: string
    /** Render the brand, rows, and account block in their skeleton (loading) state. */
    isSkeleton?: boolean
}

/** How many groups/rows the skeleton draws — mirrors the real four clusters / nine destinations. */
const SKELETON_GROUP_SIZES = [1, 3, 2, 3] as const

/** Placeholder groups — sized like the real four clusters so the shimmer mirrors the loaded shape. */
const SKELETON_GROUPS: Array<NivoSidebarGroup> = SKELETON_GROUP_SIZES.map((count, groupIndex) => ({
    id: `skeleton-group-${groupIndex}`,
    items: Array.from({ length: count }, (_unused, itemIndex) => ({
        id: `skeleton-item-${groupIndex}-${itemIndex}`,
        label: "",
        icon: SidebarSimpleIcon,
        href: "#",
        onPress: () => {},
    })),
}))

/**
 * The left-rail navigation. See the file header for the three-region shape and
 * how `isCollapsed` folds every leaf to its icon-only form.
 *
 * @param props - {@link NivoSidebarProps}
 */
const NivoSidebar = ({
    brand,
    groups,
    account,
    isCollapsed = false,
    onToggleCollapse,
    collapseLabel,
    expandLabel,
    isSkeleton = false,
}: NivoSidebarProps) => {
    const renderedGroups = isSkeleton ? SKELETON_GROUPS : groups

    return (
        <div
            data-tier="block"
            data-component="NivoSidebar"
            className="flex h-full flex-col border-r border-default"
        >
            {/* header — brand mark (hidden collapsed) + the collapse toggle, always present */}
            <div className={cn("flex items-center gap-2 p-3", isCollapsed ? "justify-center" : "justify-between")}>
                {!isCollapsed ? (
                    isSkeleton ? (
                        <Typography size="lg" isSkeleton />
                    ) : (
                        <Typography
                            size="lg"
                            weight="bold"
                            color="accent"
                            isButton
                            text={brand.name}
                            onPress={brand.onLogoPress}
                        />
                    )
                ) : null}
                <Button
                    isIconOnly
                    variant="ghost"
                    size="sm"
                    prefixIcon={SidebarSimpleIcon}
                    ariaLabel={isCollapsed ? expandLabel : collapseLabel}
                    onPress={onToggleCollapse}
                />
            </div>

            {/* scrollable grouped nav — the ONE source of destinations, never re-padded per row */}
            <nav className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-3">
                {renderedGroups.map((group, groupIndex) => (
                    <SidebarNavGroup
                        key={group.id}
                        label={group.label}
                        divider={groupIndex > 0}
                        isCollapsed={isCollapsed}
                        isSkeleton={isSkeleton}
                    >
                        {group.items.map((item) => (
                            <SidebarNavItem
                                key={item.id}
                                icon={item.icon}
                                label={item.label}
                                isActive={item.isActive}
                                isCollapsed={isCollapsed}
                                endContent={item.endContent}
                                isSkeleton={isSkeleton}
                                onPress={item.onPress}
                            />
                        ))}
                    </SidebarNavGroup>
                ))}
            </nav>

            {/* account block — pinned OUTSIDE the scroll (CollapsibleSidebar's own topSlot idiom,
                moved to the bottom); a "who am I" press target, distinct from the `Account` nav row above */}
            <button
                type="button"
                disabled={isSkeleton}
                onClick={account.onPress}
                className={cn(
                    "flex items-center gap-2 border-t border-default p-3 text-left transition-colors hover:bg-default/40 disabled:cursor-default disabled:hover:bg-transparent",
                    isCollapsed && "justify-center",
                )}
            >
                <Avatar size="sm" name={account.name} src={account.avatarUrl ?? undefined} seed={account.email} isSkeleton={isSkeleton} />
                {!isCollapsed && (
                    <>
                        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                            <Typography size="sm" weight="medium" truncate isSkeleton={isSkeleton} text={account.name} />
                            <Typography size="xs" color="muted" truncate isSkeleton={isSkeleton} text={account.email} />
                        </div>
                        {isSkeleton ? (
                            <Chip tone="default" isSkeleton text={account.planLabel} />
                        ) : (
                            <Chip tone={account.planTone ?? "accent"} text={account.planLabel} />
                        )}
                    </>
                )}
            </button>
        </div>
    )
}

export { NivoSidebar }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "NivoSidebar" } as const
