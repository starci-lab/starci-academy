import type { ReactNode } from "react"
import { Container } from "@sb-components/frames/Container/Container"
import { StackV } from "@sb-components/frames/Stack/Stack"
import { ProfileHero, type ProfileHeroUser } from "@sb-components/starci/blocks/profile/ProfileHero/ProfileHero"
import { ProfileTabsBar, type ProfileTab } from "@sb-components/starci/blocks/navigation/ProfileTabsBar/ProfileTabsBar"
import { ProfileLoadingState } from "@sb-components/starci/blocks/profile/ProfileLoadingState/ProfileLoadingState"
import { ProfileNotFoundState } from "@sb-components/starci/blocks/profile/ProfileNotFoundState/ProfileNotFoundState"
import { ProfileLockedState } from "@sb-components/starci/blocks/profile/ProfileLockedState/ProfileLockedState"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * LAYOUT — `PublicProfileLayout`: the wrapper mounted once per
 * `/profile/[username]/**` scope (maps to the real `profile/[username]/layout.tsx`
 * → `PublicProfile`). Owns the ONE state-switch the real component owns —
 * loading → not-found → locked → main — and, only in the main branch, the
 * two-column shell (identity aside beside the active tab's content) with the
 * tab strip mounted as chrome above it.
 *
 * ⭐ WHY THIS IS A `layouts/` FILE, NOT A `blocks/` ONE (RULE 12 — canon
 * `steps/11-overlays-layouts-brainstorm.md` §4/§6). `profile/[username]/page.tsx`
 * (the bare "overview" route) is a genuinely EMPTY stub that renders only its own
 * tab panel — the brainstorm flagged this pairing AMBIGUOUS pending a read of the
 * real component. Read: `layout.tsx` wraps `children` in `<PublicProfile>` and
 * ALSO wraps five sibling tab routes (`projects`/`challenges`/`skills`/`activity`,
 * plus the always-own `/profile/cv`) — a REAL `children` slot that outlives every
 * tab switch, not a mis-filed screen. So this is a `layouts/` citizen, same
 * resolution `LearnShell`'s own header reached for its two ambiguous siblings.
 *
 * ⭐⭐ A LAYOUT MAY ITSELF BRANCH/GATE (RULE 12's own carve-out, `LearnShell`'s
 * `isEnrollGated` is the direct precedent for a full-body replace). This one
 * needs ONE MORE branch than `AsyncContent.Base`'s stock 3 (loading → empty →
 * content) because the real component folds TWO business gates on top of the
 * plain async lifecycle: "does this user exist at all" (not-found) and "did the
 * owner lock it" (locked, `profileLocked && !isSelf`) — four total, in the exact
 * priority order the real `PublicProfile` checks them (loading first, then
 * not-found, then locked, else main). This layout does not invent that ordering;
 * it PORTS it.
 *
 * ⭐ THE TAB STRIP IS "REGISTERED AS CHROME", NOT LITERALLY REGISTERED. The real
 * `PublicProfile` calls `useRegisterNavbarBottomLayer(tabsNode)` so `ProfileTabsBar`
 * actually renders inside the global `Navbar`, one level ABOVE this component's own
 * DOM — a Zustand-store handoff, the same "app wiring, out of scope" discipline
 * Rule 13 already applies to overlays (`ContentAiSelectionAsk`'s selection tracking
 * in `LearnShell`). This design-system leaf has no global `Navbar` mounted around
 * it to hand a node to, so it renders `ProfileTabsBar` directly, immediately above
 * the two-column body — the same visual position the registered node ends up in,
 * just drawn locally instead of teleported there by a store this tier does not own.
 *
 * ⭐⭐ THIS LAYOUT COMPUTES `visibleTabs`/`hiddenTabs`, `ProfileTabsBar` DOES NOT.
 * Ground truth (`blocks/navigation/ProfileTabsBar`, already built by a sibling
 * agent — read its own file header before doubting this): that block takes the
 * ALREADY-GATED destination list as a plain prop and explicitly assigns the
 * `isSelf`/`hasPublicCv`/`sectionVisibility` → `visibleTabs`/`hiddenTabs`
 * computation to "the screen (real `[username]/layout.tsx` counterpart)" — which
 * is THIS file. So the gating filter below (ported from the real
 * `ProfileTabsBar/index.tsx`'s `visibleTabs`/`isSectionHidden`) lives here, not
 * pushed down into the tab-strip block.
 *
 * ⭐⭐ `canHire` IS COMPUTED HERE TOO, NOT PASSED IN RAW. Ground truth
 * (`blocks/profile/ProfileHero`, already built): it takes `canHire?: boolean` +
 * `onHire?: () => void` directly rather than deriving them from `user` fields —
 * the same "caller resolves the business gate, block only renders its result"
 * split as `visibleTabs` above. This layout reproduces the real `PublicProfile`'s
 * own `canHire = !isSelf && Boolean(user.openToWork) && Boolean(user.social?.github)`
 * one level up, from the two fields THIS layout's `PublicProfileUser` carries
 * beyond `ProfileHeroUser` (`openToWork`) and the one `ProfileHeroUser` already
 * has (`social.github`).
 *
 * ⭐ OUTER ROW/COLUMN SWITCH, NOT A `StackH`. Mirrors `SettingsLayout`'s own
 * "outer switch" note verbatim: the real body is `flex-col @app-md:flex-row
 * @app-md:items-start` — column-first (identity above content on a narrow
 * screen) becoming a row from `@app-md`. `StackH` is fixed to one axis, so this
 * composes `StackV` (native column) plus the SAME responsive override className
 * `SettingsLayout` already uses for the identical shape, rather than inventing a
 * second technique for one axis-switching row.
 *
 * ⭐ `gap="flush"` between `ProfileTabsBar` and the two-column body, mirroring
 * `SettingsLayout`'s own "flush is deliberate" note: `ProfileTabsBar`'s own file
 * contract (ported from `src`) states it carries no border/sticky/bg of its own —
 * the real `Navbar` root draws the one seam. Adding a gap here on top of that
 * would be a second, competing seam for one boundary (§10a).
 *
 * `gap="page"` inside the two-column body: identity aside and the active tab's
 * content are "separate FEATURES on one page, one block beside another" per the
 * §10c seam table — matches the real `gap-8` on that same row.
 *
 * ⚠️ JUDGEMENT CALL — `Container size="xl"`. The real body measures `max-w-6xl`
 * (72rem), which sits exactly between this system's `lg` (64rem) and `xl` (80rem)
 * tokens — no tier matches it exactly. Chose `xl` (room for a full identity
 * column plus a wide tab body) over `lg` (would pinch the two-column layout);
 * revisit if a `6xl`-equivalent token is ever added to the `Container` scale.
 *
 * ⭐ NOT-FOUND COPY IS HARDCODED, NOT A PROP. `ProfileNotFoundState` (the sibling
 * block this composes) takes `title`/`description` as typed, pre-translated
 * strings — but this layout's own prop list only relays `onGoHome`, no copy
 * override, because the "this profile does not exist" message never varies by
 * caller (same reasoning `ProfileNotFoundState`'s own header gives for hardcoding
 * its CTA label). This layout owns that fixed sentence, not each screen that
 * mounts it.
 *
 * ⭐ `onHire`/`onShare` ARE ADDITIONS BEYOND THE TASK BRIEF'S LITERAL PROP LIST —
 * same move `LearnShell`'s own header made for `onOpenAiChat`/`selectionAsk`:
 * necessary because `ProfileHero` cannot offer the "hire" CTA or the share action
 * at all without somewhere for the press to go (§7 — a block never decides what a
 * press means, but SOMEONE above it must).
 *
 * ⭐ EVERY LEAF THIS LAYOUT COMPOSES WAS BUILT BY A SIBLING AGENT IN THIS SAME
 * RUN (`ProfileHero`/`ProfileTabsBar`/`ProfileLoadingState`/`ProfileNotFoundState`/
 * `ProfileLockedState`) — all FIVE had landed by the time this file was finished,
 * so every import below is that sibling's ACTUAL shipped contract (verified by
 * reading each file, not guessed):
 *   - `ProfileNotFoundState` (`blocks/profile/…`) — `title`/`description`/`onGoHome`.
 *   - `ProfileLockedState` (`blocks/profile/…`) — bare `user`/`onGoCourses` only
 *     (no `isSelf`/follow props at all — confirms a locked view never offers them).
 *   - `ProfileTabsBar` (`blocks/navigation/…`, NOT `blocks/profile/…` — a sibling
 *     placed it beside `SettingsSidebarNav` instead) — `activeTab`/`visibleTabs`/
 *     `onTabChange`/`hiddenTabs`/`ariaLabel`, per the note above.
 *   - `ProfileHero` (`blocks/profile/…`) — `user: ProfileHeroUser` (its OWN identity
 *     shape: `fullName`/`handle`/`avatarUrl`/`joinedAt`/`social.{github,linkedin,
 *     website}`/`rank`/`followersCount`/`badges`, materially different field names
 *     from this task brief's original `displayName`/`username`/`avatar`/`createdAt`/
 *     `githubUsername`/`linkedinUrl`/`websiteUrl` list) + `isSelf`/`canHire`/
 *     `following`/`isFollowPending`/`onToggleFollow`/`onHire`/`onEdit`/`onShare`.
 *     `PublicProfileUser` below adopts `ProfileHeroUser`'s naming wholesale
 *     (via `extends`) instead of keeping the brief's original names, per the
 *     "does not invent a second profile-user shape" rule `ProfileLockedState`'s
 *     own header states — this layout's public `onEditProfile` prop still maps
 *     onto `ProfileHero`'s `onEdit` (name kept from the brief since it is THIS
 *     layout's own prop, not a passthrough of the child's literal prop name).
 *   - `ProfileLoadingState` (`blocks/profile/…`) — pure skeleton, no data props
 *     beyond anatomy (it never receives or displays data).
 *
 * ⭐ `PublicProfileUser` EXTENDS `ProfileHeroUser` RATHER THAN RE-DECLARING IT.
 * Adds exactly THREE fields neither `ProfileHero` nor `ProfileLockedState` have
 * any reason to carry: `profileLocked` (drives THIS layout's own locked branch),
 * `sectionVisibility` (relayed into the `visibleTabs`/`hiddenTabs` computation
 * above), and `openToWork` (the other half of the `canHire` computation above,
 * alongside `ProfileHeroUser`'s own `social.github`).
 * ─────────────────────────────────────────────────────────────────────────────
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
const NOT_FOUND_TITLE = "Không tìm thấy hồ sơ"
const NOT_FOUND_DESCRIPTION = "Hồ sơ này không tồn tại, đã bị gỡ, hoặc đường dẫn không đúng."

/** Accessible name for the tab strip — layout-owned wording (§14d.1), `ProfileTabsBar` carries no i18n of its own. */
const PROFILE_TABS_ARIA_LABEL = "Chuyên mục hồ sơ công khai"

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
    // the "· ẩn" marker only makes sense for the OWNER's own view of a tab they hid from everyone else
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
    /** Fired when a recruiter presses "Thuê tôi" — only reachable when the computed `canHire` gate is on (relayed into {@link ProfileHero}'s `onHire`). See file header. */
    onHire: () => void
    /** Fired when the share action is pressed (relayed into {@link ProfileHero}'s `onShare`). See file header. */
    onShare: () => void
    /** Fired from the not-found branch's one way out. */
    onGoHome: () => void
    /** Fired from the locked branch's one way forward (browse courses instead). */
    onGoCourses: () => void
    /** The active tab's own panel — rendered by that tab's own route. Mandatory — RULE 12. */
    children: ReactNode
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this layout so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
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
    showAnatomy = false,
    anatPart,
}: PublicProfileLayoutProps) => {
    if (isLoading) {
        return (
            <div data-anat-part={anatPart}>
                <ProfileLoadingState
                    showAnatomy={showAnatomy}
                    anatPart={showAnatomy ? "ProfileLoadingState" : undefined}
                />
            </div>
        )
    }

    if (!user) {
        return (
            <div data-anat-part={anatPart}>
                <ProfileNotFoundState
                    title={NOT_FOUND_TITLE}
                    description={NOT_FOUND_DESCRIPTION}
                    onGoHome={onGoHome}
                    showAnatomy={showAnatomy}
                    anatPart={showAnatomy ? "ProfileNotFoundState" : undefined}
                />
            </div>
        )
    }

    // Locked profile viewed by a non-owner — mirrors the real `isLocked = Boolean(user?.profileLocked) && !isSelf`.
    if (user.profileLocked && !isSelf) {
        return (
            <div data-anat-part={anatPart}>
                <ProfileLockedState
                    user={user}
                    onGoCourses={onGoCourses}
                    showAnatomy={showAnatomy}
                    anatPart={showAnatomy ? "ProfileLockedState" : undefined}
                />
            </div>
        )
    }

    const { visibleTabs, hiddenTabs } = resolveProfileTabs(user, isSelf, hasPublicCv)
    // mirrors the real `PublicProfile`'s own `canHire` gate — see file header
    const canHire = !isSelf && Boolean(user.openToWork) && Boolean(user.social?.github)

    return (
        <div data-anat-part={anatPart}>
            <StackV
                gap="flush"
                anatPart={showAnatomy ? "StackV" : undefined}
                showAnatomy={showAnatomy}
            >
                {/* chrome above the body — mirrors the real Navbar bottom-layer position; see file header */}
                <ProfileTabsBar
                    activeTab={activeTab}
                    visibleTabs={visibleTabs}
                    onTabChange={onTabChange}
                    hiddenTabs={hiddenTabs}
                    ariaLabel={PROFILE_TABS_ARIA_LABEL}
                    showAnatomy={showAnatomy}
                    anatPart={showAnatomy ? "ProfileTabsBar" : undefined}
                />

                <Container
                    size="xl"
                    padding="roomy"
                    anatPart={showAnatomy ? "Container" : undefined}
                    showAnatomy={showAnatomy}
                >
                    {/* column-first, becomes a row from @app-md — same technique SettingsLayout uses for its own outer switch (see file header) */}
                    <StackV
                        gap="page"
                        className="@app-md:flex-row @app-md:items-start"
                        anatPart={showAnatomy ? "StackV" : undefined}
                        showAnatomy={showAnatomy}
                    >
                        <aside className="w-full @app-md:w-72 @app-md:shrink-0">
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
                                showAnatomy={showAnatomy}
                                anatPart={showAnatomy ? "ProfileHero" : undefined}
                            />
                        </aside>

                        <main className="min-w-0 flex-1">
                            {children}
                        </main>
                    </StackV>
                </Container>
            </StackV>
        </div>
    )
}

export { PublicProfileLayout }
