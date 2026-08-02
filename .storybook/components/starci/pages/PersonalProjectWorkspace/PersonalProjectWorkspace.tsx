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
 * SCREEN — `PersonalProjectWorkspace`: the personal-project route group's own
 * content switch. See the component's file header for the full RULE 12
 * investigation (why this is a `pages/` screen, not a `layouts/` wrapper) and
 * for why this file is a thin dispatch rather than a rebuild of any content.
 *
 * THREE LEAVES, one per `view` — a STRUCTURAL fork (which of three disjoint
 * screens mounts), not a data state of one shape: `Dashboard` (`/personal-
 * project`), `Task` (`/personal-project/tasks/[taskId]`), `Result`
 * (`…/result`). Each leaf hands the real, untouched prop surface of the screen
 * it dispatches to straight through — this file invents no data shape of its
 * own.
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
