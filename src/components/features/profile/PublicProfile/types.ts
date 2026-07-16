/**
 * The top-level tabs of the public profile, now routed (`/profile/<username>/<tab>`,
 * bare = "overview") rather than a Zustand store + `?tab=` query param. Owned here
 * (the feature that renders them) — {@link ProfileTabsBar} derives the active tab
 * from the URL, and each route's `page.tsx` renders the matching panel directly.
 * "challenges" surfaces graded-challenge proof (repo submissions); "skills" holds
 * coding-practice stats.
 */
export type ProfileTab = "overview" | "challenges" | "projects" | "skills" | "cv" | "activity"

/**
 * Tabs rendered in order, left to right (id + i18n label key suffix under
 * `publicProfile.tabs.*`). "Projects" (verified capstone work) leads, then
 * "Challenges" (graded-challenge repo proof); "Skills" holds coding-practice
 * (judge) stats; "CV" is the owner's résumé tool (withheld from the strip for
 * non-owner visitors — see {@link ProfileTabsBar}); "Activity" absorbs
 * achievements, joined courses, and the timeline.
 */
export const PROFILE_TABS: ReadonlyArray<ProfileTab> = [
    "overview",
    "projects",
    "challenges",
    "skills",
    "cv",
    "activity",
]
