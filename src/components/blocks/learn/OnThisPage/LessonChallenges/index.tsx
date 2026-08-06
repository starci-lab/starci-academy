"use client"

import React from "react"
import useSWR from "swr"
import { useTranslations } from "next-intl"
import { usePathname, useRouter } from "next/navigation"
import { ArrowRightIcon } from "@phosphor-icons/react"
import { GraphQLHeadersKey } from "@/modules/api/graphql/types"
import { queryChallenges } from "@/modules/api/graphql/queries/query-challenges"
import { DifficultyChip } from "@/components/blocks/chips/DifficultyChip"
import { LabeledList } from "@/components/blocks/lists/LabeledList"
import { Button } from "@/components/atoms/buttons/Button"
import { Typography } from "@/components/atoms/text/Typography"
import { StackH } from "@/components/frames/Stack"
import { toDifficulty } from "@/modules/utils/difficulty"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { ContentTab, setContentTab } from "@/redux/slices/tabs"
import { useQueryContentSwr } from "@/hooks/swr/api/graphql/queries/useQueryContentSwr"
import { usePremiumGateOverlayState } from "@/hooks/zustand/overlay/hooks"

/** Placeholder challenge rows shown while the lesson's challenges load. */
const SKELETON_ROWS = 3

/**
 * Right-rail "practice this lesson" panel: the challenges attached to the lesson
 * currently being read, with a primary CTA that opens the lesson's Challenges tab.
 * Closes the read → review → practice loop next to the on-this-page outline.
 *
 * Uses its OWN read-only SWR for `challenges({ contentId })` (NOT the tab-coupled
 * {@link import("@/hooks").useQueryChallengesSwr}, which gates on the active tab and
 * writes Redux). Self-hides once settled with no challenges, so it never leaves an
 * empty box.
 *
 * The label and the CTA are static i18n — known before the query returns — so only
 * the CHALLENGE ROWS rest, inside the same `LabeledList` the loaded rows use.
 */
export const LessonChallenges = () => {
    const t = useTranslations()
    const dispatch = useAppDispatch()
    const router = useRouter()
    const pathname = usePathname()
    const courseId = useAppSelector((state) => state.course.entity?.id)
    const contentId = useAppSelector((state) => state.content.id)
    const { data: content } = useQueryContentSwr()
    const { open: openPremiumGate } = usePremiumGateOverlayState()

    // challenges of THIS lesson; key null until both ids hydrate
    const { data, isLoading } = useSWR(
        courseId && contentId ? ["lesson-challenges", courseId, contentId] : null,
        async () => {
            const response = await queryChallenges({
                request: {
                    contentId: contentId as string,
                    // omit pageNumber/limit → server defaults (mirrors the proven
                    // tab hook); avoids an off-by-one page that would return empty
                    filters: { sorts: [] },
                },
                headers: { [GraphQLHeadersKey.XCourseId]: courseId as string },
            })
            return response.data?.challenges?.data?.data ?? null
        },
    )

    const challenges = data ?? []

    // open the lesson's Challenges tab in place (same content route)
    const onPractice = () => {
        if (content?.isPremium) {
            openPremiumGate()
            return
        }
        dispatch(setContentTab(ContentTab.Challenges))
        router.replace(`${pathname}?tab=${ContentTab.Challenges}`)
    }

    const isSkeleton = isLoading && !data
    if (!isSkeleton && challenges.length === 0) {
        return null
    }

    return (
        <LabeledList
            label={t("lessonRail.challenges.title")}
            action={(
                <Button
                    label={t("lessonRail.challenges.practice")}
                    size="sm"
                    variant="primary"
                    suffixIcon={ArrowRightIcon}
                    onPress={onPractice}
                    classNames={["self-start"]}
                />
            )}
        >
            {isSkeleton
                ? Array.from({ length: SKELETON_ROWS }, (_row, index) => (
                    <Typography key={index} size="sm" color="muted" isSkeleton />
                ))
                : challenges.map((challenge) => (
                    <StackH
                        key={challenge.id}
                        gap={3}
                        principle="chip-row"
                        explain="Lets chips share one wrapping row so related tags stay together without stacking as a column."
                        align="center"
                        justify="between"
                        items={[
                            () => <Typography size="sm" color="muted" truncate text={challenge.title} />,
                            ...(challenge.difficulty
                                ? [() => <DifficultyChip difficulty={toDifficulty(challenge.difficulty)} />]
                                : []),
                        ]}
                    />
                ))}
        </LabeledList>
    )
}
