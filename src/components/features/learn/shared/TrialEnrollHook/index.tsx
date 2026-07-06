"use client"

import React, {
    useCallback,
} from "react"
import {
    Button,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import {
    ArrowRightIcon,
} from "@phosphor-icons/react"
import { Callout } from "@/components/blocks/feedback/Callout"
import { useAppSelector } from "@/redux/hooks"
import { usePaymentOverlayState } from "@/hooks/zustand/overlay/hooks"
import { PaymentFlow } from "@/modules/types/payment"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link TrialEnrollHook}. */
export type TrialEnrollHookProps = WithClassNames<undefined>

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
export const TrialEnrollHook = ({ className }: TrialEnrollHookProps) => {
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
            status="accent"
            className={className}
            title={t("enrollGate.hookTitle")}
            description={t("enrollGate.hookDesc")}
            action={(
                <Button
                    variant="primary"
                    size="sm"
                    className="shrink-0 self-start"
                    onPress={onEnroll}
                >
                    {t("enrollGate.hookCta")}
                    <ArrowRightIcon aria-hidden focusable="false" className="size-4" />
                </Button>
            )}
        />
    )
}
