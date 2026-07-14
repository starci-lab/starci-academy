"use client"

import React from "react"
import {
    Chip,
    Typography,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import { useQueryMyAiQuotaSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyAiQuotaSwr"

/**
 * AI quota modal title row — tier chip from `myAiQuota` when subscribed.
 *
 * Renders bare content only (no `Modal.Header` wrapper) — the caller passes
 * this as `<ModalShell header={<AiQuotaHeader />}>`, and `ModalShell` supplies
 * the `Modal.Header` wrapper itself.
 */
export const AiQuotaHeader = () => {
    const t = useTranslations()
    const { data: quota } = useQueryMyAiQuotaSwr()

    return (
        <div className="pr-8">
            <div className="flex items-center gap-2">
                <Typography type="body" weight="semibold">
                    {t("aiQuota.title")}
                </Typography>
                {quota?.tier ? (
                    <Chip size="sm" color={quota.tier === "max" ? "warning" : "default"} variant="soft">
                        {quota.tier.toUpperCase()}
                    </Chip>
                ) : null}
            </div>
        </div>
    )
}
