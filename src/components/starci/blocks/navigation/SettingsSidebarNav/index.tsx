import React from "react"
import { cn } from "@heroui/react"
import {
    BookmarkSimpleIcon,
    ChartBarIcon,
    CreditCardIcon,
    DesktopIcon,
    GraduationCapIcon,
    PaintBrushIcon,
    PencilSimpleIcon,
    ShieldCheckIcon,
    SlidersHorizontalIcon,
    StarIcon,
    WalletIcon,
} from "@phosphor-icons/react"
import { Divider } from "@/components/atoms/display/Divider"
import { Typography, type TypographyIcon } from "@/components/atoms/text/Typography"
import { StackH, StackV } from "@/components/frames/Stack"
import { CollapsibleSidebar, useSidebarCollapsed } from "@/components/starci/blocks/navigation/CollapsibleSidebar"

/**
 * `SettingsSidebarNav` — the account-settings destination list, drawn as a
 * collapsible desktop rail and, below `@app-md`, a sticky horizontal pill bar.
 * Two structural leaves — `DesktopRail` (collapsible `Link`-shaped rows with a
 * divider between groups) and `MobilePillBar` (a flattened rounded-full chip
 * row). Both render the same component; only the container width differs, so
 * each story shows the branch its own `@app-md` query resolves to. `activeHref`
 * is data, so within each leaf it is a state.
 */

/** Every account-settings destination this rail can offer — the closed vocabulary the block owns. */
export type SettingsDestinationKey =
    | "editProfile"
    | "appearance"
    | "security"
    | "sessions"
    | "courseHistory"
    | "aiSettings"
    | "aiSubscription"
    | "aiUsage"
    | "bookmarks"
    | "membership"
    | "installments"

/** One settings destination — TYPED DOMAIN DATA only: which one, and where it navigates. */
export interface SettingsNavItem {
    /** Which destination this row is — drives its icon + label (block-owned table below). */
    key: SettingsDestinationKey
    /** Absolute href the row navigates to. */
    href: string
}

/**
 * A cluster of destinations rendered together. No `label` field: every real group is
 * unlabelled (see `src`'s `getSettingsGroups` — only a divider separates them), so adding
 * an unused caption prop would be inventing a case no screen asks for (§14d.3).
 */
export interface SettingsNavGroup {
    /** Stable React key for the group — not shown, only used for reconciliation + the divider count. */
    key: string
    /** The destinations in this group, in display order. */
    items: Array<SettingsNavItem>
}

/** Destination → label. The block's own wording (§14d.1), never handed in by the caller. */
const DESTINATION_LABEL: Record<SettingsDestinationKey, string> = {
    editProfile: "Edit profile",
    appearance: "Appearance",
    security: "Security",
    sessions: "Login sessions",
    courseHistory: "Learning history",
    aiSettings: "AI settings",
    aiSubscription: "AI plan",
    aiUsage: "AI usage",
    bookmarks: "Saved",
    membership: "Membership plan",
    installments: "Installments",
}

/** Destination → icon. Same glyphs `src`'s `nav.tsx` maps, so porting this table reads as ONE control. */
const DESTINATION_ICON: Record<SettingsDestinationKey, TypographyIcon> = {
    editProfile: PencilSimpleIcon,
    appearance: PaintBrushIcon,
    security: ShieldCheckIcon,
    sessions: DesktopIcon,
    courseHistory: GraduationCapIcon,
    aiSettings: SlidersHorizontalIcon,
    aiSubscription: CreditCardIcon,
    aiUsage: ChartBarIcon,
    bookmarks: BookmarkSimpleIcon,
    membership: StarIcon,
    installments: WalletIcon,
}

/** Props for the private {@link DesktopNavRow} — the inlined `SidebarNavItem` gap (see file header). */
interface DesktopNavRowProps {
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
 *
 * @param props - {@link DesktopNavRowProps}
 */
const DesktopNavRow = ({ item, isActive, onNavigate }: DesktopNavRowProps) => {
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
            <StackH gap={2} pattern="icon-text" align="center" justify={collapsed ? "center" : "start"} items={[() => rowContent]} />
        </button>
    )
}

/** Props for {@link SettingsSidebarNav}. */
export interface SettingsSidebarNavProps {
    /** Grouped destinations, in display order. */
    groups: Array<SettingsNavGroup>
    /** Which destination's `href` is being viewed right now. */
    activeHref: string
    /** Fired with a destination's `href` when its row/pill is pressed. */
    onNavigate: (href: string) => void
    /** Heading shown atop the desktop rail (hidden while collapsed). */
    title: string
    /** Accessible label for the collapse toggle (expanded state). */
    collapseLabel: string
    /** Accessible label for the expand toggle (collapsed state). */
    expandLabel: string
    /** `localStorage` key the collapsed flag persists under, so the choice survives navigation. */
    storageKey: string
    /** Accessible name for the mobile pill nav landmark. Defaults to {@link title}. */
    mobileNavAriaLabel?: string
}

/**
 * The settings destination rail. See the file header for the reused `CollapsibleSidebar`
 * gap, the two still-inlined gaps, the enum-owned vocabulary, the `@app-md` port, and the
 * two structural leaves.
 *
 * @param props - {@link SettingsSidebarNavProps}
 */
const SettingsSidebarNav = ({
    groups,
    activeHref,
    onNavigate,
    title,
    collapseLabel,
    expandLabel,
    storageKey,
    mobileNavAriaLabel,
}: SettingsSidebarNavProps) => {
    // Mobile leaf flattens every group into one scroll strip — grouping only matters to the
    // desktop rail's dividers, the mobile bar has no room to spare on a section caption.
    const flatItems = groups.flatMap((group) => group.items)

    return (
        <div>
            {/* ── Desktop rail — hidden below @app-md; wraps the reused `CollapsibleSidebar`
                (chrome) with this block's own rows/dividers (domain content). */}
            <div className="hidden shrink-0 @app-md:sticky @app-md:top-16 @app-md:block @app-md:h-[calc(100dvh-4rem)]">
                <CollapsibleSidebar
                    title={title}
                    collapseLabel={collapseLabel}
                    expandLabel={expandLabel}
                    storageKey={storageKey}
                    className="h-full"


                >
                    {groups.map((group, index) => (
                        <React.Fragment key={group.key}>
                            {/* Divider above every group but the first — the inlined
                                `SidebarNavGroup` gap (see file header). Spacing between it
                                and its neighbours is owned by `CollapsibleSidebar`'s own
                                `StackV gap={4}`, not a margin on this Divider. */}
                            {index > 0 ? <Divider /> : null}
                            <StackV
                                gap={1}

                                items={group.items.map((item) => () => (
                                    <DesktopNavRow
                                        item={item}
                                        isActive={item.href === activeHref}
                                        onNavigate={onNavigate}

                                    />
                                ))}
                            />
                        </React.Fragment>
                    ))}
                </CollapsibleSidebar>
            </div>

            {/* ── Mobile pill bar — the OTHER leaf: chip-shaped buttons in a horizontal
                scroll strip, not the rail's row shape. Visible only below @app-md. */}
            <nav aria-label={mobileNavAriaLabel ?? title} className="sticky top-16 z-30 @app-md:hidden">
                <div className="overflow-x-auto border-b border-default bg-background/80 backdrop-blur-xl">
                    <StackH
                        gap={3}
                        pattern="flex-action"
                        padding={{ x: 4, y: 3 }}
                        items={flatItems.map((item) => () => {
                            const isActive = item.href === activeHref
                            const Icon = DESTINATION_ICON[item.key]
                            const pillContent = (
                                <>
                                    <Icon aria-hidden focusable="false" className="size-4 shrink-0" />
                                    <Typography size="sm" text={DESTINATION_LABEL[item.key]} noWrap />
                                </>
                            )
                            return (
                                <button
                                    type="button"
                                    aria-current={isActive ? "page" : undefined}
                                    onClick={() => onNavigate(item.href)}
                                    className={cn(
                                        "shrink-0 rounded-full border px-3 py-2 transition-colors",
                                        isActive ? "border-accent bg-accent-soft text-accent-soft-foreground" : "border-default text-muted hover:bg-default",
                                    )}
                                >
                                    <StackH gap={2} pattern="icon-text" align="center" items={[() => pillContent]} />
                                </button>
                            )
                        })}
                    />
                </div>
            </nav>
        </div>
    )
}

export { SettingsSidebarNav }
