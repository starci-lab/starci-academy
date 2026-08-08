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
import { CollapsibleSidebar } from "@/components/blocks/navigation/CollapsibleSidebar"
import { DesktopNavRow } from "./DesktopNavRow"

/**
 * `SettingsSidebarNav` — the account-settings destination list, drawn as a
 * collapsible desktop rail and, below `@app-md`, a sticky horizontal pill bar.
 * Two structural leaves — `DesktopRail` (collapsible `Link`-shaped rows with a
 * divider between groups) and `MobilePillBar` (a flattened rounded-full chip
 * row). Both render the same component; only the container width differs, so
 * each story shows the branch its own `@app-md` query resolves to. `activeHref`
 * is data, so within each leaf it is a state.
 *
 * Held: sticky-under-navbar desktop height host, mobile sticky pill surface, and
 * active/inactive chip `cn` — no existing frame/composite owns those shapes
 * (`ShowFrom`/`HideAbove` lack sticky+height; `NavigationRail` owns column fill;
 * `RailShell` sticky uses `top-24`, not `top-16`).
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
export const DESTINATION_LABEL: Record<SettingsDestinationKey, string> = {
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
export const DESTINATION_ICON: Record<SettingsDestinationKey, TypographyIcon> = {
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
        <StackV
            identity={{ tier: "block", component: "SettingsSidebarNav" }}
            principle="group-boundary"
            explain="Separates the desktop rail from the mobile pill bar so each leaf keeps its own seam owner — not sibling-stack, because these are alternate structural leaves rather than repeating peers."
            items={[
                () => (
                    // Held: sticky-under-navbar + viewport-minus-chrome height — no named frame.
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
                                    {index > 0 ? <Divider /> : null}
                                    <StackV
                                        principle="sibling-stack"
                                        explain="Same-kind peer stack of settings rows — not group-boundary, because rows are repeating siblings rather than section groups."
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
                ),
                () => (
                    // Held: mobile sticky pill landmark + chip active/inactive cn.
                    <nav aria-label={mobileNavAriaLabel ?? title} className="sticky top-16 z-30 @app-md:hidden">
                        <div className="overflow-x-auto border-b border-default bg-background/80 backdrop-blur-xl">
                            <StackH
                                principle="flex-action"
                                explain="Groups action controls on one horizontal peer row so they share a single hit baseline."
                                items={flatItems.map((item) => () => {
                                    const isActive = item.href === activeHref
                                    const Icon = DESTINATION_ICON[item.key]
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
                                            <StackH
                                                principle="icon-text"
                                                explain="Icon beside its label — not name-handle, because this pairs a glyph with text rather than a name/handle identity."
                                                items={[
                                                    () => <Icon aria-hidden focusable="false" className="size-4 shrink-0" />,
                                                    () => <Typography size="sm" text={DESTINATION_LABEL[item.key]} noWrap />,
                                                ]}
                                            />
                                        </button>
                                    )
                                })}
                            />
                        </div>
                    </nav>
                ),
            ]}
        />
    )
}

export { SettingsSidebarNav }
