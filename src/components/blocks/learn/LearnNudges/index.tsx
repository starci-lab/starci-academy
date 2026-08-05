"use client"

import React from "react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { pathConfig } from "@/resources/path"
import { useCourseResume } from "@/components/features/learn/shared/useCourseResume"
import { useAppSelector } from "@/redux/hooks"
import { useQueryMyDueFlashcardsSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyDueFlashcardsSwr"
import { useLeaderboardSwr } from "@/hooks/swr/api/graphql/queries/useLeaderboardSwr"
import { _LearnNudges, type LearnNudgeItem } from "./component"

/**
 * Contextual "next actions" strip on the content home — the CONNECTED half: it reads its own SWR
 * (due flashcards · leaderboard) + redux (course · enrolment) + resume outline, resolves each
 * nudge's label and route, and hands the ranked list to the presentational {@link _LearnNudges}.
 * Each nudge is surfaced only when its state is timely (due count > 0, enrolled-with-capstone, a
 * known rank). See `design/storybook/architecture/split.md`.
 */
export const LearnNudges = () => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const displayId = useAppSelector((state) => state.course.displayId)
    const courseId = useAppSelector((state) => state.course.id)
    const enrolled = useAppSelector((state) => state.user.enrolled)
    // `enrolled` defaults to false before the status query settles — gate on this too so
    // an enrolled viewer doesn't see the mock-interview nudge disappear-then-reappear on load.
    const enrollKnown = useAppSelector((state) => state.user.enrollKnown)

    const { outline } = useCourseResume()
    const dueSwr = useQueryMyDueFlashcardsSwr(courseId ?? undefined)
    const leaderboardSwr = useLeaderboardSwr()

    const dueCount = dueSwr.data?.dueCount ?? 0
    const rank = leaderboardSwr.data?.myRank?.rank ?? null
    // the mock-interview is enrolled-only and grounds its prompts in the capstone,
    // so only nudge it when the viewer is enrolled AND the course has capstone tasks
    const hasCapstone = outline?.milestones.some((milestone) => milestone.tasks.length > 0) ?? false
    const showInterview = enrollKnown && enrolled && hasCapstone

    const learn = pathConfig().locale(locale).course(displayId).learn()

    const items: Array<LearnNudgeItem> = []
    if (dueCount > 0) {
        items.push({
            key: "due",
            kind: "due",
            label: t("courseContents.nudges.dueFlashcards", { count: dueCount }),
            onPress: () => router.push(learn.flashcards().build()),
        })
    }
    if (showInterview) {
        items.push({
            key: "interview",
            kind: "interview",
            label: t("courseContents.nudges.mockInterview"),
            onPress: () => router.push(learn.mockInterview().build()),
        })
    }
    if (rank !== null) {
        items.push({
            key: "rank",
            kind: "rank",
            label: t("courseContents.nudges.rank", { rank }),
            onPress: () => router.push(learn.leaderboard().build()),
        })
    }

    // dueSwr/leaderboardSwr resolve strictly after `outline` has rendered the rest of the page —
    // while they're still in flight, `dueCount`/`rank` default to 0/null, so the strip would
    // self-hide (indistinguishable from "genuinely nothing") then pop in a beat later. Shimmer
    // while either is pending; only self-hide once BOTH resolve and there's truly nothing.
    const isLoading = (dueSwr.isLoading && !dueSwr.data) || (leaderboardSwr.isLoading && !leaderboardSwr.data)

    // The connected file owns WHEN to shimmer (counts still loading); it hands that
    // condition to the presentational leaf as the universal `isSkeleton`.
    return <_LearnNudges items={items} isSkeleton={isLoading} />
}
