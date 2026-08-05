import React from "react"
import type { ReactNode } from "react"
import { SidebarIcon } from "@phosphor-icons/react"
import { RailShell } from "@/components/frames/RailShell"
import { AsyncContentEmpty } from "@/components/composites/async/AsyncContent"
import type { ComponentTypeWithSkeleton } from "@/components/composites/_slot"

/**
 * `HeadhuntingCompaniesLayout` — the wrapper for every route under
 * `courses/[courseId]/headhunting-companies/**`, a thinner sibling of
 * `LearnShell`. Composed on `RailShell` (leading rail, growing body) — the
 * same rail-plus-body shape `LearnShell`'s own nav rail and
 * `SettingsLayout`'s settings rail already own, here with the rail leg still
 * a marked gap. One leaf: the layout takes no prop besides `children`, so the
 * ambient container width is a state, not a second shape.
 */

/** Props for {@link _HeadhuntingCompaniesLayout}. */
export interface HeadhuntingCompaniesLayoutProps {
    /**
     * The routed page content for this scope. MANDATORY (RULE 12) — a layout
     * with no children would be a page pretending to wrap something it doesn't.
     */
    children: ReactNode
}

/**
 * The rail slot — the course chapter/lesson tree is not built in this pass,
 * so the slot is a marked gap rather than a rebuilt block.
 */
const NavRail: ComponentTypeWithSkeleton = () => (
    <AsyncContentEmpty
        title="Course navigation"
        description="The course chapter/lesson tree is not built in this pass — the slot is here, the content comes later."
        icon={SidebarIcon}
    />
)

/**
 * The scope wrapper for `headhunting-companies/**`. See the file header for
 * why it is a layout, why it is thinner than `LearnShell`, and why its rail
 * is a marked gap rather than a rebuilt block.
 *
 * @param props - {@link HeadhuntingCompaniesLayoutProps}
 */
const _HeadhuntingCompaniesLayout = ({
    children,
}: HeadhuntingCompaniesLayoutProps) => (
    <div data-tier="layout" data-component="HeadhuntingCompaniesLayout">
        {/* CALLER SLOT — deliberately unbadged; whatever sits inside belongs to
            whoever passed it, the same restraint `RailShell`'s own slots take. */}
        <RailShell at="lg" rail={NavRail} body={() => <>{children}</>} />
    </div>
)

export { _HeadhuntingCompaniesLayout }
