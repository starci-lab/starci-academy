import React from "react"
import type { ReactNode } from "react"
import { SidebarIcon } from "@phosphor-icons/react"
import { RailShell } from "@sb-components/frames/RailShell/RailShell"
import { AsyncContentEmpty } from "@sb-components/composites/async/AsyncContent/AsyncContent"
import type { ComponentTypeWithSkeleton } from "@sb-components/frames/_slot"

/**
 * `HeadhuntingCompaniesLayout` — the wrapper for every route under
 * `courses/[courseId]/headhunting-companies/**`, a thinner sibling of
 * `LearnShell`. Composed on `RailShell` (leading rail, growing body) at `@app-lg`
 * — same shape as the src twin. One leaf: the layout takes no prop besides
 * `children`, so the ambient container width is a state, not a second shape.
 */

/** Props for {@link HeadhuntingCompaniesLayout}. */
export interface HeadhuntingCompaniesLayoutProps {
    /**
     * The routed page content for this scope. MANDATORY (RULE 12) — a layout
     * with no children would be a page pretending to wrap something it doesn't.
     */
    children: ReactNode
}

/**
 * Storybook rail placeholder — the real LearnSidebar mounts in src; this pass
 * keeps the marked gap visible in the blueprint.
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
 * why it is a layout, why it is thinner than `LearnShell`, and why its aside
 * is a marked gap rather than a rebuilt block.
 *
 * @param props - {@link HeadhuntingCompaniesLayoutProps}
 */
const HeadhuntingCompaniesLayout = ({
    children,
}: HeadhuntingCompaniesLayoutProps) => (
    <RailShell
        at="lg"
        principle="layout-split"
        explain="Major layout split — not block-boundary, because this separates primary page regions rather than adjacent blocks."
        isRailSticky
        rail={NavRail}
        body={() => <>{children}</>}
        identity={{ tier: "layout", component: "HeadhuntingCompaniesLayout" }}
    />
)

export { HeadhuntingCompaniesLayout }
