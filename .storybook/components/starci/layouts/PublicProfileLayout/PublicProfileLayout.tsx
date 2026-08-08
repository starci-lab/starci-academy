import type { ReactNode } from "react"
import { Container } from "@sb-components/frames/Container/Container"
import { RailShell } from "@sb-components/frames/RailShell/RailShell"
import { StackV } from "@sb-components/frames/Stack/Stack"
import type { ComponentTypeWithSkeleton } from "@sb-components/frames/_slot"
import { ProfileHero, type ProfileHeroUser } from "@sb-components/starci/blocks/profile/ProfileHero/ProfileHero"
import { ProfileTabsBar, type ProfileTab } from "@sb-components/starci/blocks/navigation/ProfileTabsBar/ProfileTabsBar"
import { ProfileLoadingState } from "@sb-components/starci/blocks/profile/ProfileLoadingState/ProfileLoadingState"
import { ProfileNotFoundState } from "@sb-components/starci/blocks/profile/ProfileNotFoundState/ProfileNotFoundState"
import { ProfileLockedState } from "@sb-components/starci/blocks/profile/ProfileLockedState/ProfileLockedState"

/**
 * `PublicProfileLayout` — the wrapper mounted once per `/profile/[username]/**`
 * scope. Four structural leaves, in the "loading → not-found → locked →
 * content" branch order, each swapping the whole composed body:
 *   - `Loading`  — `ProfileLoadingState` alone.
 *   - `NotFound` — `ProfileNotFoundState` alone.
 *   - `Locked`   — `ProfileLockedState` alone (identity visible, tabs withheld).
 *   - `Content`  — `ProfileTabsBar` chrome above a two-column `ProfileHero` +
 *     route-panel body; owner-vs-visitor tab gating and the `canHire` CTA fork
 *     are data states within this leaf.
 *
 * Mirrored from src `layouts/PublicProfileLayout`: `RailShell` owns the
 * column-first → row-at-`@app-md` switch, fixed rail width, and shrink strategy.
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

/** Props for {@link PublicProfileLayout}. */
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
    /** The active tab's own panel — rendered by that tab's own route. Mandatory — RULE 12. */
    children: ReactNode
}

/**
 * The public-profile shell. See the file header for the four-branch switch, the
 * "registered as chrome" tab strip, and every judgement call. See
 * {@link PublicProfileLayoutProps} for the full contract.
 *
 * @param props - {@link PublicProfileLayoutProps}
 */
const PublicProfileLayout = ({
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
    children,
}: PublicProfileLayoutProps) => {
    if (isLoading) {
        return <ProfileLoadingState />
    }

    if (!user) {
        return (
            <ProfileNotFoundState
                title={NOT_FOUND_TITLE}
                description={NOT_FOUND_DESCRIPTION}
                onGoHome={onGoHome}
            />
        )
    }

    // Locked profile viewed by a non-owner — mirrors the real `isLocked = Boolean(user?.profileLocked) && !isSelf`.
    if (user.profileLocked && !isSelf) {
        return (
            <ProfileLockedState
                user={user}
                onGoCourses={onGoCourses}
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
            body={() => <>{children}</>}
            principle="layout-split"
            explain="Major layout split — not block-boundary, because this separates primary page regions rather than adjacent blocks."
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
                principle="page-pad"
                explain="Page chrome inset — not card-padding, because this pads the whole page rather than a nested card surface."
                body={profileShell}
            />
        ),
    ]

    return (
        <StackV
            principle="group-boundary"
            explain="Separates the profile tab chrome from the measured body so each region keeps its own seam owner — not sibling-stack, because these are distinct section roles rather than repeating peers."
            identity={{ tier: "layout", component: "PublicProfileLayout" }}
            items={tabsAndBody}
        />
    )
}

export { PublicProfileLayout }
