import React from "react"
import type { ReactNode } from "react"
import { SidebarIcon } from "@phosphor-icons/react"
import { StackH } from "@sb-components/frames/Stack/Stack"
import { AsyncContentEmpty } from "@sb-components/composites/async/AsyncContent/AsyncContent"

/**
 * `HeadhuntingCompaniesLayout` — the wrapper for every route under
 * `courses/[courseId]/headhunting-companies/**`, a thinner sibling of
 * `LearnShell`. `@app-lg` is a container query measuring the nearest
 * `@container`, not the viewport. One leaf: the layout takes no prop besides
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
 * The scope wrapper for `headhunting-companies/**`. See the file header for
 * why it is a layout, why it is thinner than `LearnShell`, and why its aside
 * is a marked gap rather than a rebuilt block.
 *
 * @param props - {@link HeadhuntingCompaniesLayoutProps}
 */
const HeadhuntingCompaniesLayout = ({
    children,
}: HeadhuntingCompaniesLayoutProps) => (
    <StackH
        gap={6}
        principle="block-boundary"
        explain="Block-to-block spacing — not group-boundary, because this separates major blocks rather than nested section groups."
        align="start"
        items={[
            // Desktop-only rail: below the `@app-lg` tier it does not collapse into
            // anything, it is simply absent — the real screen has no mobile bar.
            () => (
                <div className="hidden shrink-0 @app-lg:sticky @app-lg:top-0 @app-lg:block @app-lg:w-64">
                    <AsyncContentEmpty
                        title="Course navigation"
                        description="The course chapter/lesson tree is not built in this pass — the slot is here, the content comes later."
                        icon={SidebarIcon}
                    />
                </div>
            ),
            // CALLER SLOT — deliberately unbadged, see file header.
            () => (
                <div className="min-w-0 flex-1">
                    {children}
                </div>
            ),
        ]}
    />
)

export { HeadhuntingCompaniesLayout }
