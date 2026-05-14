"use client"

import React from "react"
import {
    Chip,
    cn,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import {
    SparkleIcon,
} from "@phosphor-icons/react"

export interface StarCiAIBadgeProps {
    /** Extra classes on the root {@link Chip}. */
    className?: string
    /** Extra classes on the sparkle icon (default `size-5`). */
    iconClassName?: string
}

/**
 * Compact “StarCi AI” label with accent chip styling (sparkle + translated brand).
 * @param props - {@link StarCiAIBadgeProps}
 */
export const StarCiAIBadge = (props: StarCiAIBadgeProps) => {
    const {
        className,
        iconClassName,
    } = props
    const t = useTranslations()
    return (
        <Chip
            className={cn(className)}
            color="accent"
            variant="secondary"
        >
            <SparkleIcon className={cn("size-5 shrink-0", iconClassName)} />
            <Chip.Label>{t("cv.submission.aiBrand")}</Chip.Label>
        </Chip>
    )
}
