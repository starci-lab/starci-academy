"use client"

import React from "react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    useRouter,
} from "next/navigation"
import {
    ArrowRightIcon,
    CardsIcon,
    MicrophoneStageIcon,
    TrophyIcon,
} from "@phosphor-icons/react"
import {
    pathConfig,
} from "@/resources/path"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"
import { useCourseResume } from "../../shared/useCourseResume"
import { useAppSelector } from "@/redux/hooks"
import { useQueryMyDueFlashcardsSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyDueFlashcardsSwr"
import { useLeaderboardSwr } from "@/components/features/learn/Leaderboard/useLeaderboardSwr"
import {
    SurfaceListCard,
    SurfaceListCardRow,
} from "@/components/blocks/cards/SurfaceListCard"

/** One resolved nudge row. */
interface Nudge {
    /** Stable key. */
    key: string
    /** Leading icon node (already coloured). */
    icon: React.ReactNode
    /** Row label. */
    label: string
    /** Route the nudge opens. */
    href: string
}

/** Props for {@link LearnNudges}. */
export type LearnNudgesProps = WithClassNames<undefined>

/**
 * Contextual "next actions" strip on the content home — the aids that orbit the
 * course spine, surfaced with their REAL state so they read as timely nudges, not a
 * static link grid duplicating the sidebar: due flashcards (count), mock-interview
 * for the capstone (enrolled + has capstone), and the viewer's rank. Each nudge
 * self-hides when its state is empty; the whole strip renders nothing when none
 * apply. Container: reads its own SWR + redux. `"use client"` for the hooks.
 *
 * @param props - {@link LearnNudgesProps}
 */
export const LearnNudges = ({ className }: LearnNudgesProps) => {
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

    const nudges: Array<Nudge> = []
    if (dueCount > 0) {
        nudges.push({
            key: "due",
            icon: <CardsIcon aria-hidden focusable="false" className="size-5 text-warning" />,
            label: t("courseContents.nudges.dueFlashcards", { count: dueCount }),
            href: learn.flashcards().build(),
        })
    }
    if (showInterview) {
        nudges.push({
            key: "interview",
            icon: <MicrophoneStageIcon aria-hidden focusable="false" className="size-5 text-foreground" />,
            label: t("courseContents.nudges.mockInterview"),
            href: learn.mockInterview().build(),
        })
    }
    if (rank !== null) {
        nudges.push({
            key: "rank",
            icon: <TrophyIcon aria-hidden focusable="false" className="size-5 text-accent" />,
            label: t("courseContents.nudges.rank", { rank }),
            href: learn.leaderboard().build(),
        })
    }

    // no timely nudge → render nothing (no empty card)
    if (nudges.length === 0) {
        return null
    }

    return (
        <SurfaceListCard className={className}>
            {nudges.map((nudge) => (
                <SurfaceListCardRow
                    key={nudge.key}
                    hover="underline"
                    leading={nudge.icon}
                    title={nudge.label}
                    trailing={(
                        <ArrowRightIcon
                            aria-hidden
                            focusable="false"
                            className="size-5 text-muted"
                        />
                    )}
                    onPress={() => router.push(nudge.href)}
                />
            ))}
        </SurfaceListCard>
    )
}
