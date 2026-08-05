import type { ComponentType } from "react"
import type { ComponentTypeWithSkeleton } from "@/components/composites/_slot"
import { Container } from "@/components/frames/Container"
import { RailShell } from "@/components/frames/RailShell"
import { StackV } from "@/components/frames/Stack"
import { ProfileHero, type ProfileHeroUser } from "@/components/starci/blocks/profile/ProfileHero"
import { ProfileTabsBar, type ProfileTab } from "@/components/blocks/navigation/ProfileTabsBar"
import { ProfileLoadingState } from "@/components/blocks/profile/ProfileLoadingState"
import { ProfileNotFoundState } from "@/components/starci/blocks/profile/ProfileNotFoundState"
import { ProfileLockedState } from "@/components/starci/blocks/profile/ProfileLockedState"

/**
 * `_PublicProfileLayout` — the wrapper mounted once per `/profile/[username]/**`
 * scope. It owns the loading → not-found → locked → main state switch (checked in
 * that priority order); only the main branch renders the two-column shell (identity
 * aside beside the active tab's content) with the tab strip as chrome above it.
 * Body switches column-first to row at `@app-md`.
 *
 * Computes `visibleTabs`/`hiddenTabs` (from `isSelf`/`hasPublicCv`/`sectionVisibility`)
 * and `canHire` here, then hands the results down. `PublicProfileUser` extends
 * `ProfileHeroUser` with `profileLocked`, `sectionVisibility`, and `openToWork`.
 * Not-found copy is fixed; `onGoHome`/`onHire`/`onShare`/`onEditProfile`/`onGoCourses`
 * are the exits. Ported 1:1 from the storybook blueprint
 * (`.storybook/components/starci/layouts/PublicProfileLayout/PublicProfileLayout.tsx`);
 * `body` is a buildable, uncalled `ComponentType` slot (never `ReactNode`) — the
 * connected {@link PublicProfileLayout} (`index.tsx`) supplies the active tab's route panel.
 */

/** Per-section tab visibility for a VISITOR (the owner always sees every tab) — feeds the `visibleTabs`/`hiddenTabs` computation below. */
export interface PublicProfileSectionVisibility {
    /** Show the "Projects" tab to visitors. */
    projects: boolean
    /** Show the "Challenges" tab to visitors. */
    challenges: boolean
    /** Show the "Skills" tab to visitors. */
    skills: boolean
    /** Show the "Activity" tab to visitors. */
    activity: boolean
}

/**
 * The full profile entity this layout branches on. Extends {@link ProfileHeroUser}
 * (see file header) with the three fields only THIS layout needs.
 */
export interface PublicProfileUser extends ProfileHeroUser {
    /** `true` → the owner has locked the profile. Only bites a VISITOR (`profileLocked && !isSelf`). */
    profileLocked?: boolean
    /** Absent = every section tab shows. */
    sectionVisibility?: PublicProfileSectionVisibility
    /** `true` → this person is open to hiring offers — half of the `canHire` gate (paired with `social.github`). */
    openToWork?: boolean
}

/** Fixed copy for the not-found branch — see file header for why this is not a prop. */
const NOT_FOUND_TITLE = "Profile not found"
const NOT_FOUND_DESCRIPTION = "This profile does not exist, has been removed, or the link is wrong."

/** Accessible name for the tab strip — layout-owned wording (§14d.1), `ProfileTabsBar` carries no i18n of its own. */
const PROFILE_TABS_ARIA_LABEL = "Public profile sections"

/** Every public-profile destination, in display order — ported from the real `PROFILE_TABS`. */
const PROFILE_TABS: ReadonlyArray<ProfileTab> = ["overview", "projects", "challenges", "skills", "cv", "activity"]

/** The section tabs gated by {@link PublicProfileSectionVisibility} (overview + cv are never gated this way). */
const SECTION_TABS: ReadonlyArray<ProfileTab> = ["projects", "challenges", "skills", "activity"]

/**
 * Which tabs to draw for THIS viewer, and (owner-only) which of those the owner
 * switched off for everyone else — ported from the real `ProfileTabsBar/index.tsx`'s
 * `visibleTabs`/`isSectionHidden`, now living here per the file header.
 */
const resolveProfileTabs = (
    user: PublicProfileUser,
    isSelf: boolean,
    hasPublicCv: boolean,
): { visibleTabs: ReadonlyArray<ProfileTab>, hiddenTabs: ReadonlyArray<ProfileTab> | undefined } => {
    const isSectionHidden = (tabId: ProfileTab): boolean =>
        !isSelf && SECTION_TABS.includes(tabId) && user.sectionVisibility?.[tabId as keyof PublicProfileSectionVisibility] === false
    const visibleTabs = PROFILE_TABS.filter((tabId) => {
        if (tabId === "cv") {
            return isSelf || hasPublicCv
        }
        return !isSectionHidden(tabId)
    })
    // the "· hidden" marker only makes sense for the OWNER's own view of a tab they hid from everyone else
    const hiddenTabs = isSelf
        ? SECTION_TABS.filter((tabId) => user.sectionVisibility?.[tabId as keyof PublicProfileSectionVisibility] === false)
        : undefined
    return { visibleTabs, hiddenTabs }
}

/** Props for {@link _PublicProfileLayout}. */
export interface PublicProfileLayoutProps {
    /** `true` while the profile read is still in flight (first load). */
    isLoading: boolean
    /** The resolved profile, or `null` once the read has SETTLED with nothing found. */
    user: PublicProfileUser | null
    /** `true` → the route's username IS the signed-in viewer. */
    isSelf: boolean
    /** `true` → the viewed user has a PUBLIC cv — shows the "CV" tab to visitors too (feeds the tab-gating computation). */
    hasPublicCv: boolean
    /** Which profile tab is active right now (relayed to {@link ProfileTabsBar}). */
    activeTab: ProfileTab
    /** Fired with the tab the reader picked (relayed to {@link ProfileTabsBar}). */
    onTabChange: (tab: ProfileTab) => void
    /** `true` → the viewer already follows this user (relayed into {@link ProfileHero}). */
    following: boolean
    /** `true` → a follow/unfollow request is in flight (relayed into {@link ProfileHero}). */
    isFollowPending: boolean
    /** Fired when the follow/unfollow action is pressed (relayed into {@link ProfileHero}). */
    onToggleFollow: () => void
    /** Fired when the profile owner takes the "edit profile" action (relayed into {@link ProfileHero}'s `onEdit`). */
    onEditProfile: () => void
    /** Fired when a recruiter presses "Hire me" — only reachable when the computed `canHire` gate is on (relayed into {@link ProfileHero}'s `onHire`). See file header. */
    onHire: () => void
    /** Fired when the share action is pressed (relayed into {@link ProfileHero}'s `onShare`). See file header. */
    onShare: () => void
    /** Fired from the not-found branch's one way out. */
    onGoHome: () => void
    /** Fired from the locked branch's one way forward (browse courses instead). */
    onGoCourses: () => void
    /**
     * The active tab's own panel — rendered by that tab's own route. Buildable, uncalled
     * slot — RULE 12 (never `ReactNode`). Named `body`, not `children`: React reserves
     * `children` for nested elements, so a ComponentType handed in under that name reads
     * as an element to every linter and every reader.
     */
    body: ComponentType
}

/**
 * The public-profile shell. See the file header for the four-branch switch, the
 * "registered as chrome" tab strip, and every judgement call. See
 * {@link PublicProfileLayoutProps} for the full contract.
 *
 * @param props - {@link PublicProfileLayoutProps}
 */
const _PublicProfileLayout = ({
    isLoading,
    user,
    isSelf,
    hasPublicCv,
    activeTab,
    onTabChange,
    following,
    isFollowPending,
    onToggleFollow,
    onEditProfile,
    onHire,
    onShare,
    onGoHome,
    onGoCourses,
    body,
}: PublicProfileLayoutProps) => {
    // the active tab's own panel — an uncalled component reference (RULE 12), never a built element
    const BodySlot = body

    if (isLoading) {
        return (
            <ProfileLoadingState
                identity={{ tier: "layout", component: "PublicProfileLayout" }}
            />
        )
    }

    if (!user) {
        return (
            <ProfileNotFoundState
                title={NOT_FOUND_TITLE}
                description={NOT_FOUND_DESCRIPTION}
                onGoHome={onGoHome}
                identity={{ tier: "layout", component: "PublicProfileLayout" }}
            />
        )
    }

    // Locked profile viewed by a non-owner — mirrors the real `isLocked = Boolean(user?.profileLocked) && !isSelf`.
    if (user.profileLocked && !isSelf) {
        return (
            <ProfileLockedState
                user={user}
                onGoCourses={onGoCourses}
                identity={{ tier: "layout", component: "PublicProfileLayout" }}
            />
        )
    }

    const { visibleTabs, hiddenTabs } = resolveProfileTabs(user, isSelf, hasPublicCv)
    // mirrors the real `PublicProfile`'s own `canHire` gate — see file header
    const canHire = !isSelf && Boolean(user.openToWork) && Boolean(user.social?.github)

    // identity rail (ProfileHero) beside the active tab's routed panel — RailShell owns the
    // column-first → row-at-@app-md switch, the fixed rail width, and the shrink strategy
    // (SettingsLayout's own outer switch uses the same frame — see file header).
    const profileShell: ComponentTypeWithSkeleton = () => (
        <RailShell
            rail={() => (
                <ProfileHero
                    user={user}
                    isSelf={isSelf}
                    canHire={canHire}
                    following={following}
                    isFollowPending={isFollowPending}
                    onToggleFollow={onToggleFollow}
                    onHire={onHire}
                    onEdit={onEditProfile}
                    onShare={onShare}

                />
            )}
            body={() => <BodySlot />}
        />
    )

    // chrome above the body — mirrors the real Navbar bottom-layer position; see file header
    const tabsAndBody = [
        () => (
            <ProfileTabsBar
                activeTab={activeTab}
                visibleTabs={visibleTabs}
                onTabChange={onTabChange}
                hiddenTabs={hiddenTabs}
                ariaLabel={PROFILE_TABS_ARIA_LABEL}

            />
        ),
        () => (
            <Container
                size="xl"
                padding={6}

                body={profileShell}
            />
        ),
    ]

    return (
        <StackV
            gap={1}
            identity={{ tier: "layout", component: "PublicProfileLayout" }}
            items={tabsAndBody}
        />
    )
}

export { _PublicProfileLayout }
