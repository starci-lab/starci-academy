"use client"

import { Button, cn } from "@heroui/react"
import type { FoundationEntity } from "@/modules/types"
import { FoundationKind } from "@/modules/types"
import { useTranslations } from "next-intl"
import React, { useMemo } from "react"
import { useOpenFoundationResource } from "../hooks"
import { FoundationMeta } from "../FoundationMeta"

export interface FoundationContentPanelProps {
    /** Selected foundation to render; when undefined shows placeholder. */
    foundation?: FoundationEntity
}

/**
 * Right-hand panel: summary for the selected foundation and action to open content.
 * @param props.foundation - Active foundation row from Redux.
 */
export const FoundationContentPanel = ({ foundation }: FoundationContentPanelProps) => {
    const t = useTranslations()
    const openFoundationResource = useOpenFoundationResource()

    const actionLabel = useMemo(() => {
        if (!foundation) {
            return ""
        }
        switch (foundation.kind) {
        case FoundationKind.Document:
            return t("foundations.openDocument")
        case FoundationKind.Video:
            return t("foundations.openVideo")
        case FoundationKind.ExternalLink:
            return t("foundations.openLink")
        default:
            return t("foundations.openLink")
        }
    }, [foundation, t])

    if (!foundation) {
        return (
            <div className="card card--default flex min-h-[240px] items-center justify-center p-6">
                <p className="text-muted text-center text-sm">{t("foundations.selectPrompt")}</p>
            </div>
        )
    }

    return (
        <div className="card card--default flex flex-col gap-4 p-4 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
            <div>
                <h2 className="text-xl font-bold">{foundation.title}</h2>
                <div className="mt-2">
                    <FoundationMeta foundation={foundation} />
                </div>
                {foundation.description ? (
                    <p className="text-muted mt-2 text-sm">{foundation.description}</p>
                ) : null}
            </div>
            <Button
                className={cn("w-fit")}
                variant="secondary"
                onPress={() => openFoundationResource(foundation)}
            >
                {actionLabel}
            </Button>
        </div>
    )
}
