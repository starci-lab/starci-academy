"use client"

import React, { useMemo } from "react"
import { useTranslations } from "next-intl"
import { AiModelCategory } from "@/modules/api/graphql/queries/query-ai-models"
import { useAiModelLatency } from "@/hooks/socketio/useAiModelLatency"
import {
    _GradeModelDropdown,
    TIER_FILTERS,
    type GradeModelDropdownProps,
    type GradeModelSelection,
} from "./component"

export type { GradeModelSelection }

/** Props the connected {@link GradeModelDropdown} takes from its caller. */
export type GradeModelDropdownConnectedProps = Omit<
    GradeModelDropdownProps,
    | "latency"
    | "autoLaneLabel"
    | "pickModelLabel"
    | "searchModelLabel"
    | "searchModelEmptyLabel"
    | "filterTierLabel"
    | "filterAllLabel"
    | "tierLabels"
    | "modelUnavailableLabel"
    | "subscribeToGradeLabel"
    | "belowFloorWarningLabel"
    | "offTaskWarningLabel"
    | "hideHiddenModelsLabel"
    | "showHiddenModelsLabel"
    | "latencyLabel"
    | "downLabel"
>

/**
 * Shared lane + model picker — the CONNECTED half: subscribes to live
 * per-model health over socket.io and resolves every label via `t()`. See
 * `design/storybook/architecture/split.md`.
 *
 * @param props - {@link GradeModelDropdownConnectedProps}
 */
export const GradeModelDropdown = (props: GradeModelDropdownConnectedProps) => {
    const t = useTranslations()
    const latency = useAiModelLatency()

    const tierLabels = useMemo<Record<AiModelCategory, string>>(
        () => {
            const labels = {} as Record<AiModelCategory, string>
            for (const tier of TIER_FILTERS) {
                if (tier !== "all") {
                    labels[tier] = t(`aiSettings.categories.${tier}`)
                }
            }
            return labels
        },
        [t],
    )

    return (
        <_GradeModelDropdown
            {...props}
            latency={latency}
            autoLaneLabel={t("aiSettings.lanes.auto.title")}
            pickModelLabel={t("aiSettings.pickModel")}
            searchModelLabel={t("aiSettings.searchModel")}
            searchModelEmptyLabel={t("aiSettings.searchModelEmpty")}
            filterTierLabel={t("aiSettings.filterTier")}
            filterAllLabel={t("aiSettings.filterAll")}
            tierLabels={tierLabels}
            modelUnavailableLabel={t("aiSettings.modelUnavailable")}
            subscribeToGradeLabel={t("aiSettings.subscribeToGrade")}
            belowFloorWarningLabel={t("aiSettings.belowFloorWarning")}
            offTaskWarningLabel={t("aiSettings.offTaskWarning")}
            hideHiddenModelsLabel={t("aiSettings.hideHiddenModels")}
            showHiddenModelsLabel={(count) => t("aiSettings.showHiddenModels", { count })}
            latencyLabel={(ms) => t("status.latency", { ms })}
            downLabel={t("status.componentStatus.down")}
        />
    )
}
