"use client"

import { CircleCheck as CheckCircleIcon } from "@gravity-ui/icons"
import React from "react"
import { Chip } from "@heroui/react"
import { useTranslations } from "next-intl"
import { useAppSelector } from "@/redux"
import type { ChipProps } from "@heroui/react"


/**
 * Props for {@link ReadBadge}.
 */
export interface ReadBadgeProps {
    /** Chip size — defaults to `"md"`. */
    size?: ChipProps["size"]
}

/**
 * Green "Đã đọc" badge driven by `state.content.isRead` from Redux.
 * Returns `null` when the active content is not yet marked as read.
 */
export const ReadBadge = ({ size }: ReadBadgeProps) => {
    const t = useTranslations()
    const isRead = useAppSelector((state) => state.content.isRead)

    if (!isRead) return null

    return (
        <Chip variant="secondary" color="success" size={size}>
            <CheckCircleIcon className={size === "sm" ? "size-4" : "size-5"} />
            <Chip.Label>{t("content.read")}</Chip.Label>
        </Chip>
    )
}
