"use client"

import React, {
    useCallback,
} from "react"
import {
    useTranslations,
} from "next-intl"
import { Callout } from "@/components/composites/feedback/Callout"
import { useAppSelector } from "@/redux/hooks"
import { usePaymentOverlayState } from "@/hooks/zustand/overlay/hooks"
import { PaymentFlow } from "@/modules/types/payment"

/** Props for {@link TrialEnrollHook}. */
export type TrialEnrollHookProps = Record<string, never>
/**
 * A thin, self-gating "you're on a trial → unlock the course" banner for the
 * FREE learn surfaces (leaderboard, foundations, flashcard study) — the ambient
 * arm of the conversion spine ([[layout-must-funnel-to-courses]]). Renders NOTHING
 * once the status query settles as enrolled (or before it settles), so a paid
 * learner never sees it and it never flashes. Outcome-framed (build real job
 * proof), one line, non-interruptive — not a popup, not repeated. Reads the
 * course off Redux; opens the shared enroll payment flow.
 *
 * @param props - optional className (placement only).
 */
export const TrialEnrollHook = () => {
    const t = useTranslations()
    const enrolled = useAppSelector((state) => state.user.enrolled)
    const enrollKnown = useAppSelector((state) => state.user.enrollKnown)
    const { open } = usePaymentOverlayState()

    /** Open the shared payment modal in the course-enroll flow. */
    const onEnroll = useCallback(
        () => open({
            flow: PaymentFlow.CourseEnroll,
        }),
        [open],
    )

    // only a settled trial (logged-in, not purchased) sees the hook
    if (!enrollKnown || enrolled) {
        return null
    }

    return (
        <Callout
            identity={{ tier: "block", component: "TrialEnrollHook" }}
            status="accent"
            title={t("enrollGate.hookTitle")}
            description={t("enrollGate.hookDesc")}
            actionLabel={t("enrollGate.hookCta")}
            onAction={onEnroll}
        />
    )
}
