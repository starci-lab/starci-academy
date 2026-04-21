"use client"

import React from "react"
import { useTranslations } from "next-intl"
import { WithClassNames } from "@/modules/types"
import { cn } from "@heroui/react"

export type EmptyProps = WithClassNames<undefined>

/**
 * Empty state for module content grid.
 * @param {EmptyProps} props Empty props.
 */
export const Empty = ({ className }: EmptyProps) => {
    const t = useTranslations()
    return (
        <div className={cn("rounded-2xl border border-divider p-4 text-sm text-muted", className)}>
            {t("content.empty")}
        </div>
    )
}
