"use client"

import React from "react"
import {
    _HeadhuntingCompaniesLayout,
    type HeadhuntingCompaniesLayoutProps,
} from "./component"

/**
 * `HeadhuntingCompaniesLayout` — the CONNECTED half of the SRC TWIN, staged in
 * this batch but NOT yet wired to a route (the real
 * `courses/[courseId]/headhunting-companies/**` layout is left untouched; call-site
 * wiring is deferred debt, `src-tier-ported-but-unused`).
 *
 * This is a net-new layout with no v1 to lift wiring from. The presentational
 * half owns the whole shape — the desktop nav-rail slot (a §B3 `AsyncContentEmpty`
 * gap marker whose copy is baked into the blueprint) beside the routed `children`.
 * There is therefore nothing for this connected half to resolve: no parent props,
 * no store slice, no request, and no dynamic text. It stays a thin shell that
 * only threads `children` into {@link _HeadhuntingCompaniesLayout}. Should this
 * scope later grow real course-nav-tree data, that request/store belongs here.
 */
export const HeadhuntingCompaniesLayout = ({
    children,
}: Pick<HeadhuntingCompaniesLayoutProps, "children">) => {
    return (
        <_HeadhuntingCompaniesLayout>
            {children}
        </_HeadhuntingCompaniesLayout>
    )
}
