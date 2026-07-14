"use client"

import React from "react"
import {
    useTranslations,
} from "next-intl"
import {
    AdBanner,
} from "@/components/features/dashboard/AdBanner"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { useAdModalOverlayState } from "@/hooks/zustand/overlay/hooks"
import { ModalShell } from "@/components/blocks/layout/ModalShell"

/**
 * Interstitial ad modal — shown immediately when a non-enrolled, non-member
 * viewer opens a lesson. Renders the active ad (image / video / carousel) via
 * the shared {@link AdBanner}. Dismissable, so the viewer can close it and keep
 * reading the free lesson.
 *
 * Container: reads the ad from {@link useAdModalOverlayState} context (stashed by
 * the lesson reader). The ad is already null-filtered server-side (members and
 * enrolled viewers never reach here), so this only mounts when there is an ad.
 */
export const AdModal = ({ className }: WithClassNames<undefined>) => {
    const t = useTranslations()
    const { isOpen, setOpen, context } = useAdModalOverlayState()

    // no ad stashed → nothing to render (modal stays closed)
    if (!context) {
        return null
    }

    return (
        <ModalShell
            isOpen={isOpen}
            onOpenChange={setOpen}
            className={className}
            title={t("dashboard.adModalTitle")}
            bodyClassName="gap-3"
        >
            <AdBanner ad={context} />
        </ModalShell>
    )
}
