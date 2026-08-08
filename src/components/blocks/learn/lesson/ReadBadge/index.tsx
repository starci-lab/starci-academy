"use client"

import { CheckCircleIcon } from "@phosphor-icons/react"
import React from "react"
import { Chip } from "@/components/atoms/chips/Chip"
import { useTranslations } from "next-intl"
import { useAppSelector } from "@/redux/hooks"

/**
 * Green "Read" badge driven by `state.content.isRead` from Redux.
 * Returns `null` when the active content is not yet marked as read.
 * Appearance is the house Chip `tone="success"` — no soft-tint className.
 */
export const ReadBadge = () => {
    const t = useTranslations()
    const isRead = useAppSelector((state) => state.content.isRead)

    if (!isRead) return null

    return (
        <Chip tone="success" icon={CheckCircleIcon} text={t("content.read")} />
    )
}
