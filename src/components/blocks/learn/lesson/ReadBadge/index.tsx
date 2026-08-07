"use client"

import { CheckCircleIcon } from "@phosphor-icons/react"
import React from "react"
import { Chip } from "@heroui/react"
import { useTranslations } from "next-intl"
import type { ChipProps } from "@heroui/react"
import { useAppSelector } from "@/redux/hooks"

/**
 * Props for {@link ReadBadge}.
 */
export interface ReadBadgeProps {
    /** Chip size — defaults to `"md"`. */
    size?: ChipProps["size"]
}

/**
 * Green "Read" badge driven by `state.content.isRead` from Redux.
 * Returns `null` when the active content is not yet marked as read.
 */
export const ReadBadge = ({ size}: ReadBadgeProps) => {
    const t = useTranslations()
    const isRead = useAppSelector((state) => state.content.isRead)

    if (!isRead) return null

    return (
        <Chip variant="secondary" color="success" size={size} className={"bg-success-soft text-success-soft-foreground"}>
            <CheckCircleIcon className="size-4" />
            <Chip.Label>{t("content.read")}</Chip.Label>
        </Chip>
    )
}
