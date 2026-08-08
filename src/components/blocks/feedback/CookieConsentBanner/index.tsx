"use client"

import React, { useEffect } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/atoms/buttons/Button"
import { Typography } from "@/components/atoms/text/Typography"
import { StackH, StackV } from "@/components/frames/Stack"
import { StickyBottomBar } from "@/components/blocks/layout/StickyBottomBar"
import { useCookieConsentStore } from "@/hooks/zustand/cookieConsent/store"
import { useCookiePreferencesOverlayState } from "@/hooks/zustand/overlay/hooks"

/**
 * Cookie consent banner — the non-blocking bottom bar shown until the visitor makes a choice.
 *
 * Reads the committed consent from {@link useCookieConsentStore}; renders only while `decided === false`
 * (hidden during pre-hydration `null` and once decided `true`). Buttons keep parity (Accept / Reject are
 * equal-size real buttons — GDPR/PDPD: reject must be as easy as accept); "Customize" opens the granular
 * preferences modal. Mounted once globally in `InnerLayout`. `"use client"` for the store + i18n.
 */
export const CookieConsentBanner = () => {
    const t = useTranslations()
    const decided = useCookieConsentStore((state) => state.decided)
    const hydrate = useCookieConsentStore((state) => state.hydrate)
    const acceptAll = useCookieConsentStore((state) => state.acceptAll)
    const rejectAll = useCookieConsentStore((state) => state.rejectAll)
    const preferences = useCookiePreferencesOverlayState()

    // read the consent cookie once on mount (idempotent in the store)
    useEffect(() => {
        hydrate()
    }, [hydrate])

    // null = not hydrated yet, true = already decided → render nothing
    if (decided !== false) {
        return null
    }

    return (
        <StackV
            principle="block-boundary"
            explain="Identity host for sticky consent chrome — not group-boundary, because this is the block's sole major seam rather than a mid-sized group, and not sibling-stack, because the sticky bar is not a repeating peer row."
            identity={{ tier: "block", component: "CookieConsentBanner" }}
            items={[
                () => (
                    <StickyBottomBar>
                        <StackH
                            principle="flex-action"
                            explain="Consent copy beside the Accept/Reject/Customize cluster — not sibling-stack, because the sides are asymmetric roles on one bar."
                            at="sm"
                            items={[
                                () => (
                                    <Typography
                                        size="sm"
                                        color="muted"
                                        text={t("cookieConsent.body")}
                                    />
                                ),
                                () => (
                                    <StackH
                                        principle="flex-action"
                                        explain="Equal-weight consent CTAs wrap as peers — not chip-row, because these are buttons rather than chips."
                                        at="sm"
                                        items={[
                                            () => (
                                                <Button
                                                    variant="primary"
                                                    size="sm"
                                                    label={t("cookieConsent.acceptAll")}
                                                    onPress={acceptAll}
                                                />
                                            ),
                                            () => (
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    label={t("cookieConsent.reject")}
                                                    onPress={rejectAll}
                                                />
                                            ),
                                            () => (
                                                <Button
                                                    variant="tertiary"
                                                    size="sm"
                                                    label={t("cookieConsent.customize")}
                                                    onPress={preferences.open}
                                                />
                                            ),
                                        ]}
                                    />
                                ),
                            ]}
                        />
                    </StickyBottomBar>
                ),
            ]}
        />
    )
}
