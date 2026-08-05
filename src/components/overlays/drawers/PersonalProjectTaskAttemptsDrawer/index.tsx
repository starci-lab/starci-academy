"use client"

import React, { useEffect, useMemo } from "react"
import { useLocale, useTranslations } from "next-intl"
import { dayjs } from "@/modules/dayjs"
import { useSmViewpoint } from "@/hooks/reuseables/useSmViewpoint"
import { usePersonalProjectTaskAttemptsDrawerOverlayState } from "@/hooks/zustand/overlay/hooks"
import { useQueryUserPersonalTaskAttemptsSwr } from "@/hooks/swr/api/graphql/queries/useQueryUserPersonalTaskAttemptsSwr"
import {
    _PersonalProjectTaskAttemptsDrawer,
    type PersonalProjectTaskAttempt,
} from "./component"

/**
 * The AI-review attempts drawer — the CONNECTED half of `PersonalProjectTaskAttemptsDrawer`:
 * reads the shared overlay open-state, fetches the selected milestone task's attempts
 * (SWR, revalidated whenever the drawer opens), formats each attempt's processed-time
 * label, resolves the mobile/desktop placement, and hands fully-typed data to the
 * presentational {@link _PersonalProjectTaskAttemptsDrawer}.
 */
export const PersonalProjectTaskAttemptsDrawer = () => {
    const t = useTranslations()
    const locale = useLocale()
    const { isOpen, setOpen } = usePersonalProjectTaskAttemptsDrawerOverlayState()
    const { isMobile } = useSmViewpoint()
    const swr = useQueryUserPersonalTaskAttemptsSwr()
    const attemptList = swr.data?.data
    const dayjsLocale = locale.startsWith("vi") ? "vi" : "en"

    // Revalidate whenever the drawer opens — the selected task may have changed
    // since the last time this data was fetched.
    useEffect(() => {
        if (!isOpen) {
            return
        }
        void swr.mutate()
    }, [isOpen, swr])

    const attempts = useMemo<Array<PersonalProjectTaskAttempt>>(
        () => (attemptList ?? []).map((attempt) => {
            const raw = attempt.processedAt
            const parsed = raw ? dayjs(raw) : null
            const processedAtLabel = parsed?.isValid()
                ? parsed.locale(dayjsLocale).format("HH:mm, D MMMM YYYY")
                : t("cv.submission.submittedAtPending")
            return {
                id: attempt.id,
                attemptNumber: attempt.attemptNumber,
                score: attempt.score ?? null,
                shortFeedback: attempt.shortFeedback,
                processedAtLabel,
            }
        }),
        [attemptList, dayjsLocale, t],
    )

    return (
        <_PersonalProjectTaskAttemptsDrawer
            isOpen={isOpen}
            onOpenChange={setOpen}
            placement={isMobile ? "bottom" : "right"}
            attempts={attempts}
            isLoading={swr.isLoading && !(attemptList?.length)}
            emptyLabel={t("finalProject.page.attemptsDrawer.empty")}
            error={attemptList ? undefined : swr.error}
        />
    )
}
