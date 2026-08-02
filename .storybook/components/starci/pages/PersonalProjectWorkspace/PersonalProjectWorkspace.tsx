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
 * `PersonalProjectWorkspace` — the personal-project route group's content switch
 * (`/personal-project`, `/personal-project/tasks/[taskId]`, and its `/result`). A thin
 * discriminated dispatch: a `view` tag selects which of three already-built screens
 * renders — `PersonalProjectDashboard`, `PersonalProjectTaskPage`, or
 * `PersonalProjectResultScreen` — and each screen's own prop surface passes through
 * untouched.
 *
 * Renders no DOM of its own; the chosen child owns its own anatomy. `view` stands in
 * for the router state (`taskId` present? pathname ends in `/result`?) the caller has
 * already resolved.
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
