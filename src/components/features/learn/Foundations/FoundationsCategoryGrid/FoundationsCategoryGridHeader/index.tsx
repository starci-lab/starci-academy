"use client"

import React from "react"
import { Typography, cn } from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import type {
    WithClassNames,
} from "@/modules/types"

/** Props for {@link FoundationsCategoryGridHeader}. */
export type FoundationsCategoryGridHeaderProps = WithClassNames<undefined>

/**
 * Title and description for the foundations category hub.
 *
 * Self-contained section (single-use). The topic count lives on the search row
 * (right-aligned) in the layout, mirroring the resource count on the category
 * learn page.
 * @param props.className - Optional root class names.
 */
export const FoundationsCategoryGridHeader = ({
    className,
}: FoundationsCategoryGridHeaderProps) => {
    const t = useTranslations()

    return (
        <div className={cn("flex flex-col gap-2", className)}>
            <Typography type="h1" weight="bold">{t("foundations.title")}</Typography>
            <Typography type="body-sm" color="muted">{t("foundations.gridDescription")}</Typography>
        </div>
    )
}
