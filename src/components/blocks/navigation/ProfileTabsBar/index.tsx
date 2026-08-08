import React from "react"
import {
    CodeIcon,
    FileTextIcon,
    HouseIcon,
    PulseIcon,
    PuzzlePieceIcon,
    RocketIcon,
} from "@phosphor-icons/react"
import {
    TabsExtended,
    TabsIndicator,
    TabsList,
    TabsListContainer,
    TabsTab,
    type IconComponent,
} from "@/components/atoms/navigation/Tabs"
import { Typography } from "@/components/atoms/text/Typography"
import { StackH } from "@/components/frames/Stack"

/**
 * `ProfileTabsBar` — the public-profile route strip (overview / projects /
 * challenges / skills / cv / activity). Draws the already-gated tab list the
 * caller hands it and reports a pick back via `onTabChange`; visibility gating
 * stays upstream. Uses `TabsExtended` (composing the `Tabs.*` children
 * directly) so one region (icon) can stay visible while another (label + owner
 * marker) drops below `@app-md`. One leaf: which tabs show, which is active,
 * and which carries the "· hidden" marker are data.
 */

/** Every public-profile destination this strip can offer — ported from the real `ProfileTab`. */
export type ProfileTab = "overview" | "projects" | "challenges" | "skills" | "cv" | "activity"

/** Tab → label. Block-owned wording (§14d.1), ported verbatim from `publicProfile.tabs.*`. */
const TAB_LABEL: Record<ProfileTab, string> = {
    overview: "Overview",
    projects: "Projects",
    challenges: "Challenges",
    skills: "Skills",
    cv: "CV",
    activity: "Activity",
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
const HIDDEN_MARKER = "· hidden"

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
     * for other visitors — rendered with a "· hidden" marker beside the label so the
     * owner can tell at a glance. Omit (or leave empty) for a visitor's own view.
     */
    hiddenTabs?: ReadonlyArray<ProfileTab>
    /** Accessible name for the tab list, localized by the caller (blocks carry no i18n). */
    ariaLabel: string
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
}: ProfileTabsBarProps) => {
    // TabsExtended size md already owns full-width stretch — no wrapper host.
    return (
        <TabsExtended
            selectedKey={activeTab}
            onSelectionChange={(key) => onTabChange(key as ProfileTab)}
        >
            <TabsListContainer>
                <TabsList aria-label={ariaLabel}>
                    {visibleTabs.map((tabId) => {
                        const Icon = TAB_ICON[tabId]
                        const isHidden = hiddenTabs?.includes(tabId) ?? false
                        return (
                            <TabsTab
                                key={tabId}
                                id={tabId}
                            >
                                <StackH
                                    gap={2}
                                    principle="icon-text"
                                    explain="Icon beside its label — not name-handle, because this pairs a glyph with text rather than a name/handle identity."
                                    align="center"
                                    items={[
                                        () => <Icon aria-hidden focusable="false" className={TAB_ICON_CLASS} weight={TAB_ICON_WEIGHT} />,
                                        // Icon-only below @app-md — label (and its marker) only
                                        // from a tablet-wide profile strip up.
                                        () => (
                                            <span className="hidden @app-md:inline">
                                                <Typography size="sm" text={TAB_LABEL[tabId]} />
                                                {isHidden ? (
                                                    <>
                                                        {" "}
                                                        <Typography size="sm" color="muted" text={HIDDEN_MARKER} />
                                                    </>
                                                ) : null}
                                            </span>
                                        ),
                                    ]}
                                />
                                <TabsIndicator />
                            </TabsTab>
                        )
                    })}
                </TabsList>
            </TabsListContainer>
        </TabsExtended>
    )
}

export { ProfileTabsBar }
