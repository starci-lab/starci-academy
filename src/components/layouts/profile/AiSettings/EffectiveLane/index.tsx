"use client"

import React from "react"
import {
    Chip,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import {
    useQueryMyAiSettingsSwr,
} from "@/hooks"

/**
 * Shows the lane the user is on right now + their tier chip.
 *
 * Reads the resolved values straight off the AI settings SWR singleton; only
 * rendered once the snapshot is ready (gated by the parent).
 */
export const EffectiveLane = () => {
    const t = useTranslations()
    const { data: settings } = useQueryMyAiSettingsSwr()
    if (!settings) {
        return null
    }
    return (
        <div className="flex items-center gap-2">
            <span className="text-sm text-muted">{t("aiSettings.effectiveNow")}:</span>
            <Chip
                size="sm"
                color="accent"
                variant="primary"
            >
                {t(`aiSettings.lanes.${settings.effectiveMode}.title`)}
            </Chip>
            {settings.tier ? (
                <Chip
                    size="sm"
                    color="warning"
                    variant="soft"
                >
                    {settings.tier.toUpperCase()}
                </Chip>
            ) : null}
        </div>
    )
}
