"use client"

import React from "react"
import { useTranslations } from "next-intl"
import { useAdModalOverlayState } from "@/hooks/zustand/overlay/hooks"
import { _AdModal } from "./component"

/**
 * Interstitial ad modal — shown immediately when a non-enrolled, non-member
 * viewer opens a lesson. CONNECTED half: reads the ad from
 * {@link useAdModalOverlayState} (stashed by the lesson reader) and resolves the
 * title, handing both to the presentational {@link _AdModal}. The ad is already
 * null-filtered server-side (members and enrolled viewers never reach here), so
 * no ad stashed means nothing to render (modal stays closed). See `tiers/split.md`.
 *
 * Mounted prop-less by {@link ModalContainer}.
 */
export const AdModal = () => {
    const t = useTranslations()
    const { isOpen, setOpen, context } = useAdModalOverlayState()

    // no ad stashed → nothing to render (modal stays closed)
    if (!context) {
        return null
    }

    return (
        <_AdModal
            isOpen={isOpen}
            onOpenChange={setOpen}
            ad={context}
            labels={{
                title: t("dashboard.adModalTitle"),
            }}
        />
    )
}
