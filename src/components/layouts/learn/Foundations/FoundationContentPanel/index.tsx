"use client"

import { Button, cn } from "@heroui/react"
import type { WithClassNames } from "@/modules/types"
import { FoundationKind } from "@/modules/types"
import { useTranslations } from "next-intl"
import React, { useMemo } from "react"
import { useAppSelector } from "@/redux"
import { useOpenFoundationResource } from "../hooks"
import { FoundationMeta } from "../shared/FoundationMeta"

/** Props for {@link FoundationContentPanel}. */
export type FoundationContentPanelProps = WithClassNames<undefined>

/**
 * Right-hand panel: summary for the selected foundation and action to open content.
 * Reads the active foundation from Redux (`state.foundation.entity`).
 * @param props.className - Optional root class names.
 */
export const FoundationContentPanel = ({ className }: FoundationContentPanelProps) => {
    const t = useTranslations()
    const foundation = useAppSelector((state) => state.foundation.entity)
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
            <div className={cn("card card--default flex min-h-[240px] items-center justify-center p-6", className)}>
                <p className="text-muted text-center text-sm">{t("foundations.selectPrompt")}</p>
            </div>
        )
    }

    return (
        <div className={cn("card card--default flex flex-col gap-6 p-4 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto", className)}>
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
