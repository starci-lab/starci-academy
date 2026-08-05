import type { ComponentType, SVGProps } from "react"
import { BellIcon } from "@phosphor-icons/react"
import { cn } from "@heroui/react"
import type { ComponentTypeWithSkeleton, SkeletonProps } from "@sb-components/frames/_slot"
import { Avatar } from "@sb-components/atoms/display/Avatar/Avatar"
import { Badge } from "@sb-components/atoms/display/Badge/Badge"
import { Divider } from "@sb-components/atoms/display/Divider/Divider"
import { InputSearch } from "@sb-components/atoms/forms"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { RailShell } from "@sb-components/frames/RailShell/RailShell"

/**
 * `ExpertDashboardShell` — the layout every `apps/expert` dashboard route sits
 * in: a full-width top bar (search · account · notifications) above a
 * `RailShell` whose leading rail is the nine-destination nav (three clusters
 * — Operations / Business / Automation) and whose body is the routed page.
 */

/** A nav-row glyph passed as a COMPONENT reference, rendered at row scale. */
export type ExpertNavIcon = ComponentType<SVGProps<SVGSVGElement> & { weight?: "regular" | "bold" }>

/** One destination in the rail. */
export interface ExpertDashboardNavItem {
    /** Stable id. */
    id: string
    /** Visible label — already localized by the caller. */
    label: string
    /** Leading glyph as a COMPONENT reference. */
    icon: ExpertNavIcon
    /** Destination the row points at — the connected layer swaps in a real router link. */
    href: string
    /** `true` → this row matches the current route (tonal accent treatment). */
    isActive?: boolean
    /** Fired when the row is pressed. */
    onPress: () => void
}

/**
 * One cluster of destinations. The FIRST group in {@link ExpertDashboardShellProps.navGroups}
 * never draws a divider (nothing above it to split from); every group after it does.
 */
export interface ExpertDashboardNavGroup {
    /** Stable id. */
    id: string
    /** Uppercase caption shown above the group's rows — omit for an unlabelled cluster. */
    label?: string
    /** The group's destinations, in display order. */
    items: Array<ExpertDashboardNavItem>
}

/** The brand mark pinned at the top of the rail. */
export interface ExpertDashboardShellBrand {
    /** The academy's display name — already localized/resolved by the caller. */
    name: string
    /** Subtitle under the name (e.g. the tenant's live domain). */
    domainLabel: string
    /** Fired when the brand mark is pressed — routing "home" is the caller's call. */
    onLogoPress: () => void
}

/** The identity summary pinned at the bottom of the rail — read-only display. */
export interface ExpertDashboardShellIdentity {
    /** Display name. */
    name: string
    /** Role/plan line under the name (e.g. "Academy owner"). */
    roleLabel: string
    /** Uploaded avatar URL; the `Avatar` atom's own fallback chain covers the rest. */
    avatarUrl?: string | null
}

/** The top bar's search box — controlled. */
export interface ExpertDashboardShellSearch {
    /** Current query text. */
    value: string
    /** Fires as the query changes. */
    onValueChange: (value: string) => void
    /** Field placeholder — already localized. */
    placeholder: string
}

/** The top bar's notification bell. */
export interface ExpertDashboardShellNotifications {
    /** Drives the bell's count badge; `0` hides it. */
    unreadCount: number
    /** Fired when the bell is pressed — the caller opens `NotificationsDrawer`. */
    onOpen: () => void
}

/** Props for {@link ExpertDashboardShell}. */
export interface ExpertDashboardShellProps {
    /** Brand mark pinned at the top of the rail. */
    brand: ExpertDashboardShellBrand
    /** The rail's clusters, in display order — the ONE source the nav column reads. */
    navGroups: Array<ExpertDashboardNavGroup>
    /** The identity summary pinned at the bottom of the rail. */
    identity: ExpertDashboardShellIdentity
    /** The top bar's search box. */
    search: ExpertDashboardShellSearch
    /** The top bar's notification bell. */
    notifications: ExpertDashboardShellNotifications
    /** Fired when the top bar's account avatar is pressed. */
    onAccountPress: () => void
    /** Accessible name for the search field. */
    searchLabel: string
    /** Accessible name for the top bar's account trigger. */
    accountLabel: string
    /** Accessible name for the notification bell. */
    notificationsLabel: string
    /** The routed page's own content, mounted in the body column. */
    content: ComponentTypeWithSkeleton
    /** Render the rail + content in their skeleton (loading) state. */
    isSkeleton?: boolean
}

/** Bell trigger chrome — a plain button because `Badge` must wrap the glyph (no atom hosts that). Mirrors `NivoTopBar`'s own constant. */
const BELL_TRIGGER = "inline-flex items-center justify-center rounded-full p-2 text-foreground transition-colors hover:bg-default/40"

/** One pressable nav row — icon + label, tonal accent treatment while active. */
const NavRow = ({ item, isSkeleton }: { item: ExpertDashboardNavItem; isSkeleton?: boolean }) => (
    <button
        type="button"
        disabled={isSkeleton}
        onClick={item.onPress}
        aria-current={item.isActive ? "page" : undefined}
        className={cn(
            "flex items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors disabled:cursor-default",
            item.isActive ? "bg-accent-soft text-accent-soft-foreground" : "text-muted hover:bg-default/60 hover:text-foreground",
        )}
    >
        <item.icon aria-hidden focusable="false" className={cn("size-[18px] shrink-0", item.isActive && "text-accent")} />
        <Typography size="sm" weight={item.isActive ? "semibold" : "medium"} isSkeleton={isSkeleton} text={item.label} />
    </button>
)

/** One cluster of nav rows, with a caption (when set) and a leading divider (every group but the first). */
const NavGroup = ({ group, isSkeleton, isFirst }: { group: ExpertDashboardNavGroup; isSkeleton?: boolean; isFirst: boolean }) => (
    <div className="flex flex-col gap-1">
        {!isFirst ? (
            <div className="py-2">
                <Divider />
            </div>
        ) : null}
        {group.label != null ? (
            <div className="px-3 pb-1">
                <Typography size="xs" weight="bold" color="muted" isSkeleton={isSkeleton} text={group.label} />
            </div>
        ) : null}
        <div className="flex flex-col gap-1">
            {group.items.map((item) => (
                <NavRow key={item.id} item={item} isSkeleton={isSkeleton} />
            ))}
        </div>
    </div>
)

/**
 * The dashboard shell. See the file header for why the top bar never takes
 * `isSkeleton` and why `RailShell` is the one frame carrying it into both the
 * rail and the body.
 *
 * @param props - {@link ExpertDashboardShellProps}
 */
const ExpertDashboardShell = ({
    brand,
    navGroups,
    identity,
    search,
    notifications,
    onAccountPress,
    searchLabel,
    accountLabel,
    notificationsLabel,
    content: Content,
    isSkeleton,
}: ExpertDashboardShellProps) => {
    // The rail is the brand + grouped nav + identity summary, fed the shell's skeleton
    // flag; it is a CALLER SLOT of `RailShell`, so it stays an uncalled component the
    // frame renders itself.
    const railSlot = ({ isSkeleton: skeleton }: SkeletonProps) => (
        <div className="flex h-full flex-col gap-4 border-r border-default p-3">
            <button type="button" onClick={brand.onLogoPress} disabled={skeleton} className="flex flex-col items-start gap-0.5 rounded-xl px-3 py-2 text-left disabled:cursor-default">
                <Typography size="lg" weight="bold" color="accent" isSkeleton={skeleton} text={brand.name} />
                <Typography size="xs" color="muted" isSkeleton={skeleton} text={brand.domainLabel} />
            </button>
            <nav className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto">
                {navGroups.map((group, index) => (
                    <NavGroup key={group.id} group={group} isSkeleton={skeleton} isFirst={index === 0} />
                ))}
            </nav>
            <div className="flex items-center gap-2 border-t border-default pt-3">
                <Avatar size="sm" name={identity.name} src={identity.avatarUrl ?? undefined} seed={identity.name} isSkeleton={skeleton} />
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <Typography size="sm" weight="medium" truncate isSkeleton={skeleton} text={identity.name} />
                    <Typography size="xs" color="muted" truncate isSkeleton={skeleton} text={identity.roleLabel} />
                </div>
            </div>
        </div>
    )

    // The routed page's own content — a CALLER SLOT `RailShell` mounts itself with the
    // shell's skeleton flag threaded straight through.
    const bodySlot = ({ isSkeleton: skeleton }: SkeletonProps) => <Content isSkeleton={skeleton} />

    return (
        <div data-tier="layout" data-component="ExpertDashboardShell" className="min-h-dvh bg-background text-foreground">
            <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-default bg-background/95 px-6 backdrop-blur">
                <div className="w-full max-w-md">
                    <InputSearch value={search.value} onValueChange={search.onValueChange} placeholder={search.placeholder} ariaLabel={searchLabel} />
                </div>

                <div className="flex-1" />

                <button type="button" onClick={onAccountPress} aria-label={accountLabel} className="rounded-full transition-opacity hover:opacity-80">
                    <Avatar size="sm" name={identity.name} src={identity.avatarUrl ?? undefined} seed={identity.name} />
                </button>

                {/* Bell — plain button so `Badge` can anchor its count around the glyph, the
                    same badge-around-glyph shape `NivoTopBar` uses. */}
                <button type="button" aria-label={notificationsLabel} onClick={notifications.onOpen} className={BELL_TRIGGER}>
                    <Badge color="danger" count={notifications.unreadCount}>
                        <BellIcon aria-hidden focusable="false" className="size-5" />
                    </Badge>
                </button>
            </header>

            <div className="mx-auto w-full max-w-7xl px-6 py-8">
                <RailShell side="start" isRailSticky rail={railSlot} body={bodySlot} isSkeleton={isSkeleton} />
            </div>
        </div>
    )
}

export { ExpertDashboardShell }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "layout", name: "ExpertDashboardShell" } as const
