import React from "react"
import type { ReactNode } from "react"
import { RailShell } from "@/components/frames/RailShell"
import { LearnSidebar } from "@/components/blocks/learn/LearnSidebar"
import type { ComponentTypeWithSkeleton } from "@/components/frames/_slot"

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
 * The rail slot — the SAME course chapter/lesson tree the learn shell uses. It
 * was a marked gap in an earlier pass; the real block exists, so it goes in
 * rather than a placeholder shipping to readers.
 */
const NavRail: ComponentTypeWithSkeleton = () => <LearnSidebar />

/**
 * The scope wrapper for `headhunting-companies/**`. See the file header for
 * why it is a layout, why it is thinner than `LearnShell`, and why its rail
 * mounts the learn shell's own nav rail.
 *
 * @param props - {@link HeadhuntingCompaniesLayoutProps}
 */
const _HeadhuntingCompaniesLayout = ({
    children,
}: HeadhuntingCompaniesLayoutProps) => (
    // CALLER SLOT — deliberately unbadged; whatever sits inside belongs to
    // whoever passed it, the same restraint `RailShell`'s own slots take.
    <RailShell
        at="lg"
        principle="layout-split"
        rail={NavRail}
        body={() => <>{children}</>}
        identity={{ tier: "layout", component: "HeadhuntingCompaniesLayout" }}
    />
)

export { _HeadhuntingCompaniesLayout }
