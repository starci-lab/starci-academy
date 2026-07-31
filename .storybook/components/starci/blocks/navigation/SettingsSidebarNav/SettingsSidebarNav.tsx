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
import { Divider } from "@sb-components/atoms/display/Divider/Divider"
import { Typography, type TypographyIcon } from "@sb-components/atoms/text/Typography/Typography"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"
import { CollapsibleSidebar, useSidebarCollapsed } from "@sb-components/starci/blocks/navigation/CollapsibleSidebar/CollapsibleSidebar"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `SettingsSidebarNav`: owns the domain vocabulary of the account-
 * settings destination list (which grouped destinations exist, their icon,
 * their order) and renders it as the two structurally different navigation
 * surfaces the real screen needs — a collapsible desktop rail, and a mobile
 * pill-bar fallback below the `@app-md` tier.
 *
 * ⭐⭐ ONE COMPOSITE GAP REUSED, TWO STILL INLINED — read before touching the
 * shape. The real `src` builds this from THREE reusable pieces:
 *   • `CollapsibleSidebar` — collapse/expand in place, persists the flag to
 *     `localStorage`, owns the width chrome + scroll. ✅ ALREADY PORTED, by a
 *     sibling pass, at `starci/blocks/navigation/CollapsibleSidebar` (same
 *     run, same restriction to `blocks/`+`stories/` — its own file header
 *     flags it as composite-tier chrome misfiled under `blocks/` for that
 *     reason). REUSED HERE VERBATIM, not rebuilt — the exact discipline this
 *     task's brief opens with (`ContentTabBar` rebuilding a worse `Toolbar`).
 *   • `SidebarNavGroup` — a divider above the group (except the first).
 *   • `SidebarNavItem` — one icon+label row, `aria-current`, accent-soft fill
 *     when active, icon-only when the rail is collapsed
 *     (`useSidebarCollapsed()`, exported by the ported `CollapsibleSidebar`).
 * Neither of the last two exists anywhere in this Storybook yet, and this run
 * writes exactly two files for THIS block — so, per §B3 scope discipline, they
 * are reproduced here as a PRIVATE, non-exported `DesktopNavRow` + an inline
 * `Divider`-per-group loop (verified against `src/components/blocks/navigation/
 * SidebarNavGroup` + `.../SidebarNavItem`), not left as a placeholder: unlike
 * `HeadhuntingCompaniesLayout`'s marked `AsyncContentEmpty` gap, this chrome
 * IS the deliverable of this task, not domain content out of reach. ⚠️ MARKED
 * GAP for a future pass: the day a second screen needs the same nav-row shape,
 * promote `DesktopNavRow` into a real `SidebarNavItem` composite so both
 * consumers share one definition instead of two copies drifting apart.
 *
 * ⭐ JUDGEMENT CALL — THE DESTINATION VOCABULARY IS AN ENUM THE BLOCK OWNS
 * (§14d.1), not a `ReactNode` icon + i18n key handed down the way `src`'s
 * `nav.tsx` does it. Same call as `ContentModeNav`'s `MODE_ICON`/`MODE_LABEL`
 * and `LeaderboardCategoryNav`'s `CATEGORY_ICON`/`CATEGORY_LABEL`: a caller
 * that could pass an icon component or a formatted label owns wording that
 * belongs to this block, and canon avoids a bare `ReactNode` prop above frame
 * tier. `groups`/`items` carry only a stable `key` (closed
 * {@link SettingsDestinationKey} union) + `href` — typed domain data, nothing
 * pre-rendered.
 *
 * ⭐ JUDGEMENT CALL — `@app-md`, NOT `md:`. `src`'s `SettingsLayout` switches
 * on the Next.js viewport breakpoint (`md:hidden` / `hidden md:block`); this
 * codebase has since migrated every responsive block to CONTAINER queries
 * (`globals.css`: `--container-app-md: 48rem`, the exact same 768px step) —
 * see `HeadhuntingCompaniesLayout`/`ContentModeNav`/`NavLinks` for the same
 * `@app-*` vocabulary. Ported 1:1 onto the new variant, not re-derived.
 *
 * ⭐ JUDGEMENT CALL — THE MOBILE PILL ROW IS HAND-ROLLED, NOT A STRETCHED ATOM.
 * No existing atom fits: `ChipBase` is a static LABEL (no `onPress`), and
 * `Button`'s variant table has no bordered-pill / accent-soft-on-active shape.
 * Reaching for either would be exactly the `ContentTabBar` mistake this task's
 * brief warns about (bending an atom into a shape it was never given) rather
 * than the `WorkSessionHeader` precedent this follows instead: a plain
 * `<button>` for chrome nothing else owns, with `StackH`/`Typography` doing
 * all of the actual layout and text inside it so the hand-written part stays
 * colour/radius/border only — never a `flex`/`grid` + `gap-*` combo (kept
 * out of `check-seams`'s hand-rolled-layout rule).
 *
 * NEVER SKELETONISED, on purpose — same call as `ContentModeNav`/
 * `LeaderboardCategoryNav`: the destination list is static chrome, known
 * before any account fetch lands, so it paints immediately.
 *
 * TWO LEAVES, by STRUCTURE (unlike `NavLinks`'s single leaf, where narrowing
 * only ever HIDES the same row — here a genuinely different shape replaces
 * it, so the split earns two leaves rather than staying one structural fact):
 *   • Desktop rail   — visible from `@app-md`, sticky under the fixed navbar
 *     (`top-16`, matching the app's `h-16` bar), `CollapsibleSidebar`'s own
 *     scroll, a `Divider` between groups, `Link`-shaped rows.
 *   • Mobile pill bar — sticky horizontal strip of every destination
 *     flattened out of their groups (grouping only matters to the desktop
 *     rail's dividers), rounded-full chip buttons instead of the rail's rows.
 * Both subtrees are always in the DOM (CSS-toggled, not JS-conditional) —
 * the same progressive-disclosure shape `src`'s `SettingsLayout` uses, so
 * there is no hydration/layout-shift cost to hiding one of them.
 * ─────────────────────────────────────────────────────────────────────────────
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
    editProfile: "Chỉnh sửa hồ sơ",
    appearance: "Giao diện",
    security: "Bảo mật",
    sessions: "Phiên đăng nhập",
    courseHistory: "Lịch sử học tập",
    aiSettings: "Cài đặt AI",
    aiSubscription: "Gói AI",
    aiUsage: "Mức dùng AI",
    bookmarks: "Đã lưu",
    membership: "Gói học viên",
    installments: "Trả góp",
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
    /** Forwarded from the block's own `showAnatomy`. */
    showAnatomy: boolean
}

/**
 * One destination row in the desktop rail: a leading icon + truncating label, icon-only
 * when `CollapsibleSidebar` is collapsed (read via `useSidebarCollapsed`, exported by that
 * composite so any nav-row content can drop to a rail without owning the flag itself).
 * A plain `<button>` rather than a HeroUI `Link` — see the file header's hand-roll call.
 *
 * @param props - {@link DesktopNavRowProps}
 */
const DesktopNavRow = ({ item, isActive, onNavigate, showAnatomy }: DesktopNavRowProps) => {
    const collapsed = useSidebarCollapsed()
    const Icon = DESTINATION_ICON[item.key]
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
            <StackH gap="tight" align="center" justify={collapsed ? "center" : "start"} anatPart={showAnatomy ? "StackH" : undefined}>
                <Icon aria-hidden focusable="false" className="size-5 shrink-0" />
                {!collapsed ? (
                    <Typography
                        size="sm"
                        weight={isActive ? "medium" : undefined}
                        text={DESTINATION_LABEL[item.key]}
                        truncate
                        anatPart={showAnatomy ? "Typography" : undefined}
                    />
                ) : null}
            </StackH>
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
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
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
    showAnatomy = false,
    anatPart,
}: SettingsSidebarNavProps) => {
    // Mobile leaf flattens every group into one scroll strip — grouping only matters to the
    // desktop rail's dividers, the mobile bar has no room to spare on a section caption.
    const flatItems = groups.flatMap((group) => group.items)

    return (
        <div data-anat-part={anatPart}>
            {/* ── Desktop rail — hidden below @app-md; wraps the reused `CollapsibleSidebar`
                (chrome) with this block's own rows/dividers (domain content). */}
            <div className="hidden shrink-0 @app-md:sticky @app-md:top-16 @app-md:block @app-md:h-[calc(100dvh-4rem)]">
                <CollapsibleSidebar
                    title={title}
                    collapseLabel={collapseLabel}
                    expandLabel={expandLabel}
                    storageKey={storageKey}
                    className="h-full"
                    showAnatomy={showAnatomy}
                    anatPart={showAnatomy ? "CollapsibleSidebar" : undefined}
                >
                    {groups.map((group, index) => (
                        <React.Fragment key={group.key}>
                            {/* Divider above every group but the first — the inlined
                                `SidebarNavGroup` gap (see file header). Spacing between it
                                and its neighbours is owned by `CollapsibleSidebar`'s own
                                `StackV gap="grouped"`, not a margin on this Divider. */}
                            {index > 0 ? <Divider anatPart={showAnatomy ? "Divider" : undefined} /> : null}
                            <StackV gap="flush" anatPart={showAnatomy ? "StackV" : undefined}>
                                {group.items.map((item) => (
                                    <DesktopNavRow
                                        key={item.key}
                                        item={item}
                                        isActive={item.href === activeHref}
                                        onNavigate={onNavigate}
                                        showAnatomy={showAnatomy}
                                    />
                                ))}
                            </StackV>
                        </React.Fragment>
                    ))}
                </CollapsibleSidebar>
            </div>

            {/* ── Mobile pill bar — the OTHER leaf: chip-shaped buttons in a horizontal
                scroll strip, not the rail's row shape. Visible only below @app-md. */}
            <nav aria-label={mobileNavAriaLabel ?? title} className="sticky top-16 z-30 @app-md:hidden">
                <StackH
                    gap="related"
                    className="overflow-x-auto border-b border-default bg-background/80 px-3 py-2 backdrop-blur-xl"
                    anatPart={showAnatomy ? "StackH" : undefined}
                >
                    {flatItems.map((item) => {
                        const isActive = item.href === activeHref
                        const Icon = DESTINATION_ICON[item.key]
                        return (
                            <button
                                key={item.key}
                                type="button"
                                aria-current={isActive ? "page" : undefined}
                                onClick={() => onNavigate(item.href)}
                                className={cn(
                                    "shrink-0 rounded-full border px-3 py-2 transition-colors",
                                    isActive ? "border-accent bg-accent-soft text-accent-soft-foreground" : "border-default text-muted hover:bg-default",
                                )}
                            >
                                <StackH gap="tight" align="center" anatPart={showAnatomy ? "StackH" : undefined}>
                                    <Icon aria-hidden focusable="false" className="size-4 shrink-0" />
                                    <Typography size="sm" text={DESTINATION_LABEL[item.key]} noWrap anatPart={showAnatomy ? "Typography" : undefined} />
                                </StackH>
                            </button>
                        )
                    })}
                </StackH>
            </nav>
        </div>
    )
}

export { SettingsSidebarNav }
