import React from "react"
import {
    PersonalProjectDashboard,
    type PersonalProjectDashboardProps,
} from "@/components/blocks/learn/PersonalProjectDashboard"
import {
    PersonalProjectTaskPage,
    type PersonalProjectTaskPageProps,
} from "@/components/pages/PersonalProjectTaskPage"
import {
    PersonalProjectResultScreen,
    type PersonalProjectResultScreenProps,
} from "@/components/blocks/learn/PersonalProjectResultScreen"

/**
 * `_PersonalProjectWorkspaceLayout` — the SRC TWIN of `.storybook/components/starci/
 * pages/PersonalProjectWorkspace/PersonalProjectWorkspace.tsx`. Presentational:
 * typed props, already resolved; no fetch/store/i18n (that's the connected half,
 * `./index.tsx`).
 *
 * SCREEN — the personal-project route group's own content switch. See the
 * blueprint's file header for the full RULE 12 investigation (why this is a
 * `pages/` screen, not a `layouts/` wrapper) and for why this file is a thin
 * dispatch rather than a rebuild of any content.
 *
 * THREE LEAVES, one per `view` — a STRUCTURAL fork (which of three disjoint
 * screens mounts), not a data state of one shape: `Dashboard` (`/personal-
 * project`), `Task` (`/personal-project/tasks/[taskId]`), `Result`
 * (`…/result`). Each leaf hands the real, untouched prop surface of the screen
 * it dispatches to straight through — this file invents no data shape of its
 * own. Each leaf renders the CONNECTED child export (`PersonalProjectDashboard`,
 * `PersonalProjectTaskPage`, `PersonalProjectResultScreen`), which in these twins
 * happen to be presentational (the children own no data of their own).
 */

/** Props for {@link _PersonalProjectWorkspaceLayout} — see the file header for the `view` split. */
export type PersonalProjectWorkspaceLayoutProps =
    | ({ view: "dashboard" } & PersonalProjectDashboardProps)
    | ({ view: "task" } & PersonalProjectTaskPageProps)
    | ({ view: "result" } & PersonalProjectResultScreenProps)

/**
 * The personal-project route group's content switch. See the file header for
 * why this screen exists and why it owns none of its own DOM.
 *
 * @param props - {@link PersonalProjectWorkspaceLayoutProps}
 */
const _PersonalProjectWorkspaceLayout = (props: PersonalProjectWorkspaceLayoutProps) => {
    // No wrapper div (BLOCK-2): each of the three leaves below is this
    // screen's own root for the branch it renders. None of the three yet
    // accepts the `identity` prop from `_identity.ts` (`PersonalProjectDashboard`,
    // `PersonalProjectTaskPage`, `PersonalProjectResultScreen` all still draw
    // their OWN `data-tier="block"`/`"page"` on their own root) and none is
    // wrapped in a sibling frame here to carry this screen's identity instead
    // — so this screen currently renders with no `data-tier="page"
    // data-component="PersonalProjectWorkspace"` node of its own anywhere in
    // the tree, rather than re-adding the raw div BLOCK-2 forbids.
    if (props.view === "dashboard") return <PersonalProjectDashboard {...props} />
    if (props.view === "task") return <PersonalProjectTaskPage {...props} />
    return <PersonalProjectResultScreen {...props} />
}

export { _PersonalProjectWorkspaceLayout }
