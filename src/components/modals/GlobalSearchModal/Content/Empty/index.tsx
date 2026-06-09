"use client"

import React from "react"
import { useTranslations } from "next-intl"
import { cn } from "@heroui/react"
import { WithClassNames } from "@/modules/types"

/** Props for {@link GlobalSearchEmpty}. */
export interface GlobalSearchEmptyProps extends WithClassNames<undefined> {
    /** Whether the user has typed a (trimmed) query yet — switches idle hint vs no-match copy. */
    hasQuery: boolean
}

/**
 * Empty state for the global search palette.
 *
 * Renders an idle hint while the query is blank, and a "no matches" message once the
 * user has typed but nothing came back.
 *
 * @param props.hasQuery — `true` when a non-empty query is active.
 */
export const GlobalSearchEmpty = ({ hasQuery, className }: GlobalSearchEmptyProps) => {
    const t = useTranslations()
    return (
        <div className={cn("flex flex-col items-center justify-center px-4 py-10 text-center", className)}>
            <div className="text-sm text-muted">
                {hasQuery ? t("search.noResults") : t("search.idleHint")}
            </div>
        </div>
    )
}
