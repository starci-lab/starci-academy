"use client"

import React from "react"
import {
    useTranslations,
} from "next-intl"
import {
    PageHeader,
} from "@/components/blocks"
import type {
    WithClassNames,
} from "@/modules/types"

/** Props for {@link FoundationsCategoryGridHeader}. */
export type FoundationsCategoryGridHeaderProps = WithClassNames<undefined>

/**
 * Title + description for the foundations category hub.
 *
 * Renders the house {@link PageHeader} block (H3 title + `body-sm` muted
 * description) so it reads at the exact same scale as the category learn page
 * header. The topic count lives on the search row (right-aligned) in the layout.
 * @param props.className - Optional root class names.
 */
export const FoundationsCategoryGridHeader = ({
    className,
}: FoundationsCategoryGridHeaderProps) => {
    const t = useTranslations()

    return (
        <PageHeader
            title={t("foundations.title")}
            description={t("foundations.gridDescription")}
            className={className}
        />
    )
}
