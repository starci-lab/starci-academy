import React from "react"
import {
    PersonalProjectDashboard,
    type PersonalProjectDashboardProps,
} from "@/components/starci/blocks/learn/PersonalProjectDashboard"
import {
    PersonalProjectTaskPage,
    type PersonalProjectTaskPageProps,
} from "@/components/page/PersonalProjectTaskPage"
import {
    PersonalProjectResultScreen,
    type PersonalProjectResultScreenProps,
} from "@/components/starci/blocks/learn/PersonalProjectResultScreen"

/**
 * `_PersonalProjectWorkspace` — the SRC TWIN of `.storybook/components/starci/
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

/** Props for {@link _PersonalProjectWorkspace} — see the file header for the `view` split. */
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
const _PersonalProjectWorkspace = (props: PersonalProjectWorkspaceProps) => {
    const inner = props.view === "dashboard"
        ? <PersonalProjectDashboard {...props} />
        : props.view === "task"
            ? <PersonalProjectTaskPage {...props} />
            : <PersonalProjectResultScreen {...props} />

    return (
        <div data-tier="page" data-component="PersonalProjectWorkspace">
            {inner}
        </div>
    )
}

export { _PersonalProjectWorkspace }
