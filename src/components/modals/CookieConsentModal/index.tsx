"use client"

import React, { useCallback } from "react"
import { useTranslations } from "next-intl"
import { useCookieConsentStore } from "@/hooks/zustand/cookieConsent/store"
import { useCookiePreferencesOverlayState } from "@/hooks/zustand/overlay/hooks"
import { _CookieConsentModal } from "./component"

/**
 * Cookie preferences modal — the CONNECTED half: reads the overlay open-state
 * ({@link useCookiePreferencesOverlayState}) and the committed choice
 * ({@link useCookieConsentStore}), resolves every label, and hands them to the
 * presentational {@link _CookieConsentModal}. Save / Reject / Accept-all each
 * commit through the store, then close the modal. Mounted once, prop-less, in
 * `ModalContainer`. See `tiers/split.md`.
 */
export const CookieConsentModal = () => {
    const t = useTranslations()
    const { isOpen, setOpen, close } = useCookiePreferencesOverlayState()
    const analyticsAllowed = useCookieConsentStore((state) => state.analyticsAllowed)
    const save = useCookieConsentStore((state) => state.save)
    const acceptAll = useCookieConsentStore((state) => state.acceptAll)
    const rejectAll = useCookieConsentStore((state) => state.rejectAll)

    const onSave = useCallback(
        (nextAnalyticsAllowed: boolean) => {
            save(nextAnalyticsAllowed)
            close()
        },
        [save, close],
    )
    const onReject = useCallback(
        () => {
            rejectAll()
            close()
        },
        [rejectAll, close],
    )
    const onAcceptAll = useCallback(
        () => {
            acceptAll()
            close()
        },
        [acceptAll, close],
    )

    return (
        <_CookieConsentModal
            isOpen={isOpen}
            onOpenChange={setOpen}
            analyticsAllowed={analyticsAllowed}
            onSave={onSave}
            onReject={onReject}
            onAcceptAll={onAcceptAll}
            labels={{
                modalTitle: t("cookieConsent.modalTitle"),
                modalBody: t("cookieConsent.modalBody"),
                necessaryLabel: t("cookieConsent.necessaryLabel"),
                necessaryHint: t("cookieConsent.necessaryHint"),
                analyticsLabel: t("cookieConsent.analyticsLabel"),
                analyticsHint: t("cookieConsent.analyticsHint"),
                save: t("cookieConsent.save"),
                reject: t("cookieConsent.reject"),
                acceptAll: t("cookieConsent.acceptAll"),
            }}
        />
    )
}
