import React from "react"
import {
    PersonalProjectDashboard,
    type PersonalProjectDashboardProps,
} from "@sb-components/starci/blocks/learn/PersonalProjectDashboard/PersonalProjectDashboard"
import {
    PersonalProjectTaskPage,
    type PersonalProjectTaskPageProps,
} from "@sb-components/starci/pages/PersonalProjectTaskPage/PersonalProjectTaskPage"
import {
    PersonalProjectResultScreen,
    type PersonalProjectResultScreenProps,
} from "@sb-components/starci/blocks/learn/PersonalProjectResultScreen/PersonalProjectResultScreen"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * SCREEN — `PersonalProjectWorkspace`: the personal-project ROUTE GROUP's own
 * content switch (`/personal-project`, `/personal-project/tasks/[taskId]`,
 * `/personal-project/tasks/[taskId]/result`).
 *
 * ⭐⭐ INVESTIGATED PER RULE 12, DECIDED "PAGE" — NOT "LAYOUT". Read the real
 * `src/components/features/learn/PersonalProject/PersonalProjectWorkspace/
 * index.tsx` in full before writing anything here (also confirmed against
 * `.claude/fe/steps/11-overlays-layouts-brainstorm.md` §4/§6.3/§7, which flags
 * this exact component as one of only two "read it yourself first" cases in
 * the whole inventory). The real component:
 *   • takes NO `children` prop at all, and never renders `{children}` anywhere;
 *   • is mounted from `personal-project/layout.tsx`, whose OWN `page.tsx`
 *     sibling is a truly empty stub (`<></>`)  — so nothing downstream of it
 *     was ever going to fill a children slot even if one existed;
 *   • decides its ENTIRE output by reading `useParams()`/`usePathname()` itself
 *     and returning one of three DISJOINT bodies (dashboard / task+panel split
 *     / graded result) — i.e. it is a route-content switch wearing a
 *     `layout.tsx` filename, not a wrapper that persists across child routes.
 * The RULE 12 test ("does it render a REAL children slot?") comes back NO, so
 * per RULE 12 this is a SCREEN mis-filed as a layout in `src` — built here
 * under `pages/`, exactly as `PersonalProjectTaskPage`'s own file header
 * (written by the sibling pass that built it) already independently concluded.
 *
 * ⭐ WHY THIS FILE STILL EXISTS, GIVEN THE THREE BODIES ARE ALREADY BUILT. The
 * planner's tree note for this run says the right decomposition is "3 separate
 * `pages/`/`blocks/` screens, not 1 screen with a view-switch" — and that DID
 * happen: `PersonalProjectDashboard` (block), `PersonalProjectTaskPage`
 * (page), `PersonalProjectResultScreen` (block) are each already complete,
 * independently storied, and gate-clean. This screen adds NO new domain UI —
 * it is the one place that still needs to exist because the real app funnels
 * three different ROUTES through one physical component instead of three
 * separate `page.tsx` files (arguably the anti-pattern that caused RULE 12's
 * ambiguity in the first place). Faithfully mirroring that, this is a THIN
 * discriminated dispatch: a `view` tag selects which of the three already-built
 * screens renders, and every prop from here down is that screen's own,
 * untouched, prop surface — nothing is renamed, reshaped, or re-guessed.
 *
 * ⭐ THE DISCRIMINANT IS A REAL DECISION, NOT A RENAME. `view` stands in for
 * what the real component computes from router state (`taskId` present? does
 * the pathname end in `/result`?) — reading the router is app wiring, out of
 * scope for a presentational prop list (same discipline as every other
 * screen's `onPress`/`onOpen*` callbacks), so the caller hands over the
 * already-resolved tag instead of a raw pathname.
 *
 * NO OWN `anatPart`/WRAPPER: this screen renders none of its own DOM — it is
 * exactly one of its three children, chosen by `view`, spread through
 * untouched. Each child already owns its own `showAnatomy` and badges its own
 * parts; adding a wrapping `<div>` here just to hang a badge on would be the
 * bare-`div` mistake §13z warns about, for a node with no content of its own
 * to describe.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Props for {@link PersonalProjectWorkspace} — see the file header for the `view` split. */
export type PersonalProjectWorkspaceProps =
    | ({ view: "dashboard" } & PersonalProjectDashboardProps)
    | ({ view: "task" } & PersonalProjectTaskPageProps)
    | ({ view: "result" } & PersonalProjectResultScreenProps)

/**
 * The personal-project route group's content switch. See the file header for
 * why this screen exists and why it owns none of its own DOM.
 *
 * @param props - {@link PersonalProjectWorkspaceProps}
 */
const PersonalProjectWorkspace = (props: PersonalProjectWorkspaceProps) => {
    if (props.view === "dashboard") {
        return <PersonalProjectDashboard {...props} />
    }
    if (props.view === "task") {
        return <PersonalProjectTaskPage {...props} />
    }
    return <PersonalProjectResultScreen {...props} />
}

export { PersonalProjectWorkspace }
