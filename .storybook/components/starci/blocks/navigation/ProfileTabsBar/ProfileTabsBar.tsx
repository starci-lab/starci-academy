import React from "react"
import { Tabs as HeroTabs } from "@heroui/react"
import {
    CodeIcon,
    FileTextIcon,
    HouseIcon,
    PulseIcon,
    PuzzlePieceIcon,
    RocketIcon,
} from "@phosphor-icons/react"
import { TabsExtended } from "@sb-components/atoms/navigation/Tabs/Tabs"
import type { IconComponent } from "@sb-components/atoms/navigation/Tabs/Tabs"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { StackH } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `ProfileTabsBar`: the public-profile route strip (overview / projects
 * / challenges / skills / cv / activity), sibling of `SettingsSidebarNav` under
 * `blocks/navigation/` — same idea (a block-owned destination vocabulary over a
 * generic nav atom), different shape (a full-width top strip vs a side rail).
 *
 * ⭐ GROUND TRUTH: `src/components/features/profile/PublicProfile/ProfileTabsBar`
 * already exists and is what this ports. Its real props are `username` +
 * `isSelf` + `hasPublicCv` + `sectionVisibility` — it computes `visibleTabs`/
 * `activeTab` ITSELF from those, via `useMemo`, then `router.push`es a built
 * href on selection, and reads the active tab back off `usePathname()`. ALL of
 * that — routing, the URL↔tab derivation, and the gating computation from raw
 * viewer/user flags — is APP WIRING (same discipline as an overlay never owning
 * its store, brief rule 13, extended here to a routed nav strip): this block
 * takes the ALREADY-COMPUTED result as plain props (`activeTab`, `visibleTabs`,
 * `onTabChange`, `hiddenTabs`) and never touches `next/navigation` or a gating
 * flag itself. The screen (real `[username]/layout.tsx` counterpart) is where
 * `isSelf`/`hasPublicCv`/`sectionVisibility` actually get read and turned into
 * these three arrays.
 *
 * ⭐ `hiddenTabs` is NOT "tabs to remove" — those are already absent from
 * `visibleTabs` (a visitor never receives a withheld section's key at all, per
 * the real `visibleTabs` filter). `hiddenTabs` is the OWNER-ONLY "· ẩn" marker:
 * a subset of `visibleTabs` the owner sees annotated because they turned that
 * section off for everyone else. A caller viewing as a visitor simply never
 * passes a tab here (their withheld tabs already never reached `visibleTabs`).
 *
 * ⭐ WHY `TabsExtended`, NOT `TabsBase` — this is the exact "read the file header
 * first" case the task brief calls out. `TabsBase` is data-driven (`items`,
 * `label: ReactNode` + `icon` as ONE atom-owned glyph), which cannot express
 * this row's actual chrome: the icon stays visible on every width while the
 * LABEL (and the marker riding beside it) specifically drops out below
 * `@app-md` — two independently-toggled regions inside one tab, not one label
 * slot. `TabsExtended` is the named exception for exactly this ("each tab may
 * carry chrome a `TabItem` cannot", see its own file header) — and it is the
 * SAME atom the real `ProfileTabsBar` composes with (`ExtendedTabs` there).
 * Reaching for `TabsBase` here would repeat the very mistake ("ContentTabBar")
 * the brief opens with, just in the other direction — bending a data-only atom
 * to fit chrome it was never given.
 *
 * ⭐ THE DESTINATION VOCABULARY IS AN ENUM THE BLOCK OWNS (§14d.1), same call as
 * `ContentModeNav`'s `MODE_LABEL`/`MODE_ICON` and `SettingsSidebarNav`'s
 * `DESTINATION_LABEL`/`DESTINATION_ICON` — icons ported 1:1 from the real
 * `TAB_ICONS` table so this reads as ONE control, not a second guess at it.
 *
 * NEVER SKELETONISED, on purpose — same call as `ContentModeNav`/
 * `SettingsSidebarNav`/`LeaderboardCategoryNav`: by the time this block mounts,
 * the caller already resolved `visibleTabs` from profile data, so there is no
 * partial-chrome state for this row to own.
 *
 * ONE LEAF by STRUCTURE: every tab is the same `icon + responsive label(+
 * marker)` shape: which tabs are present, which is active, and which carries
 * the owner marker are DATA, not a structural fork — so this ships one leaf
 * with states, not several leaves.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Every public-profile destination this strip can offer — ported from the real `ProfileTab`. */
export type ProfileTab = "overview" | "projects" | "challenges" | "skills" | "cv" | "activity"

/** Tab → label. Block-owned wording (§14d.1), ported verbatim from `publicProfile.tabs.*`. */
const TAB_LABEL: Record<ProfileTab, string> = {
    overview: "Tổng quan",
    projects: "Dự án",
    challenges: "Thử thách",
    skills: "Kỹ năng",
    cv: "CV",
    activity: "Hoạt động",
}

/** Tab → icon. Ported 1:1 from the real `TAB_ICONS` table. */
const TAB_ICON: Record<ProfileTab, IconComponent> = {
    overview: HouseIcon,
    projects: RocketIcon,
    challenges: PuzzlePieceIcon,
    skills: CodeIcon,
    cv: FileTextIcon,
    activity: PulseIcon,
}

/**
 * Glyph scale for a `text-sm` (14px) label — same §5a pairing `TabsBase` already
 * uses for its own icon column, ported here since this block hand-composes the
 * tab's inside instead of going through that atom's `items`.
 */
const TAB_ICON_CLASS = "size-3.5"
const TAB_ICON_WEIGHT = "bold" as const

/** The owner-only marker riding beside a hidden section tab's label. */
const HIDDEN_MARKER = "· ẩn"

/** Props for {@link ProfileTabsBar}. */
export interface ProfileTabsBarProps {
    /** Which destination's route is being viewed now. */
    activeTab: ProfileTab
    /**
     * Destinations to render, in display order — ALREADY gated by the caller
     * (owner sees every tab; a visitor never receives a tab their
     * `sectionVisibility`/`hasPublicCv` withheld). This block draws exactly this
     * list, nothing more.
     */
    visibleTabs: ReadonlyArray<ProfileTab>
    /** Fired with the tab the visitor picked. The screen decides how to navigate. */
    onTabChange: (tab: ProfileTab) => void
    /**
     * Section tabs (a subset of {@link visibleTabs}) the OWNER has switched off
     * for other visitors — rendered with a "· ẩn" marker beside the label so the
     * owner can tell at a glance. Omit (or leave empty) for a visitor's own view.
     */
    hiddenTabs?: ReadonlyArray<ProfileTab>
    /** Accessible name for the tab list, localized by the caller (blocks carry no i18n). */
    ariaLabel: string
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
}

/**
 * The profile's route-derived tab strip. See the file header for why the gating
 * computation and routing stay out of this block, and why `TabsExtended` (not
 * `TabsBase`) composes it.
 *
 * @param props - {@link ProfileTabsBarProps}
 */
const ProfileTabsBar = ({
    activeTab,
    visibleTabs,
    onTabChange,
    hiddenTabs,
    ariaLabel,
    showAnatomy = false,
    anatPart,
}: ProfileTabsBarProps) => {
    return (
        <div className="w-full" data-anat-part={anatPart}>
            <TabsExtended
                selectedKey={activeTab}
                onSelectionChange={(key) => onTabChange(key as ProfileTab)}
                classNames={["w-full"]}
                showAnatomy={showAnatomy}
            >
                <HeroTabs.ListContainer>
                    <HeroTabs.List aria-label={ariaLabel}>
                        {visibleTabs.map((tabId) => {
                            const Icon = TAB_ICON[tabId]
                            const isHidden = hiddenTabs?.includes(tabId) ?? false
                            return (
                                <HeroTabs.Tab
                                    key={tabId}
                                    id={tabId}
                                    data-anat-part={showAnatomy ? "Tabs.Tab" : undefined}
                                >
                                    <StackH
                                        gap="tight"
                                        align="center"
                                        anatPart={showAnatomy ? "StackH" : undefined}
                                        body={(
                                            <>
                                                <Icon aria-hidden focusable="false" className={TAB_ICON_CLASS} weight={TAB_ICON_WEIGHT} />
                                                {/* Icon-only below @app-md — label (and its marker) only
                                                    from a tablet-wide profile strip up. */}
                                                <span className="hidden @app-md:inline">
                                                    <Typography size="sm" text={TAB_LABEL[tabId]} anatPart={showAnatomy ? "Typography" : undefined} />
                                                    {isHidden ? (
                                                        <>
                                                            {" "}
                                                            <Typography size="sm" color="muted" text={HIDDEN_MARKER} anatPart={showAnatomy ? "Typography" : undefined} />
                                                        </>
                                                    ) : null}
                                                </span>
                                            </>
                                        )}
                                    />
                                    <HeroTabs.Indicator data-anat-part={showAnatomy ? "Tabs.Indicator" : undefined} />
                                </HeroTabs.Tab>
                            )
                        })}
                    </HeroTabs.List>
                </HeroTabs.ListContainer>
            </TabsExtended>
        </div>
    )
}

export { ProfileTabsBar }
