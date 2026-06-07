"use client"

import React from "react"
import {
    Chip,
    Modal,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import {
    useQueryMyAiQuotaSwr,
} from "@/hooks"

/**
 * AI quota modal title row — tier chip from `myAiQuota` when subscribed.
 */
export const AiQuotaHeader = () => {
    const t = useTranslations()
    const { data: quota } = useQueryMyAiQuotaSwr()

    return (
        <Modal.Header>
            <div className="pr-8">
                <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold text-foreground">
                        {t("aiQuota.title")}
                    </span>
                    {quota?.tier ? (
                        <Chip size="sm" color="warning" variant="soft">
                            {quota.tier.toUpperCase()}
                        </Chip>
                    ) : null}
                </div>
            </div>
        </Modal.Header>
    )
}
