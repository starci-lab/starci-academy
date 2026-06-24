"use client"

import React from "react"
import { ResponsiveBreadcrumb } from "@/components/blocks"
import { useHeadhuntingsBreadcrumbs } from "../../hooks"

/**
 * Breadcrumb trail for the headhuntings list page.
 *
 * Self-contained section (single-use): builds its own trail from the active
 * course in Redux + i18n + router via {@link useHeadhuntingsBreadcrumbs}, so the
 * container just renders `<HeadhuntingsBreadcrumbs />`.
 */
export const HeadhuntingsBreadcrumbs = () => {
    const items = useHeadhuntingsBreadcrumbs()

    return <ResponsiveBreadcrumb items={items} />
}
