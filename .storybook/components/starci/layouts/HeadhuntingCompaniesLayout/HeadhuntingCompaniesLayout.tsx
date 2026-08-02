import React from "react"
import type { ReactNode } from "react"
import { SidebarIcon } from "@phosphor-icons/react"
import { StackH } from "@sb-components/frames/Stack/Stack"
import { AsyncContentEmpty } from "@sb-components/composites/async/AsyncContent/AsyncContent"

/**
 * `HeadhuntingCompaniesLayout` — the wrapper for every route under
 * `courses/[courseId]/headhunting-companies/**`: a sticky desktop course-nav rail
 * beside the routed content, and nothing else. The rail disappears below the
 * desktop tier; the layout owns no reading-column padding. Takes a mandatory
 * `children`.
 */

/** Props for {@link HeadhuntingCompaniesLayout}. */
export interface HeadhuntingCompaniesLayoutProps {
    /**
     * The routed page content for this scope. MANDATORY (RULE 12) — a layout
     * with no children would be a page pretending to wrap something it doesn't.
     */
    children: ReactNode
    /** Extra class on the root track. */
    className?: string
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
    className,
}: HeadhuntingCompaniesLayoutProps) => {
    const navAndContent = (
        <>
            {/* Desktop-only rail: below the `@app-lg` tier it does not collapse into
                anything, it is simply absent — the real screen has no mobile bar. */}
            <div className="hidden shrink-0 @app-lg:sticky @app-lg:top-0 @app-lg:block @app-lg:w-64">
                <AsyncContentEmpty
                    title="Course navigation"
                    description="The course chapter/lesson tree is not built in this pass — the slot is here, the content comes later."
                    icon={SidebarIcon}

                />
            </div>
            {/* CALLER SLOT — deliberately unbadged, see file header. */}
            <div className="min-w-0 flex-1">
                {children}
            </div>
        </>
    )

    return (
        <StackH gap={6} align="start" className={className} body={navAndContent} />
    )
}

export { HeadhuntingCompaniesLayout }
