"use client"

import React from "react"
import { useTranslations } from "next-intl"
import { CourseRow } from "./CourseRow"
import { useProfileUsername } from "../../hooks/useProfileUsername"
import { useQueryUserCoursesSwr } from "@/hooks/swr/api/graphql/queries/useQueryUserCoursesSwr"
import { useQueryUserProfileSwr } from "@/hooks/swr/api/graphql/queries/useQueryUserProfileSwr"
import { AsyncContentEmpty, AsyncContentError } from "@/components/composites/async/AsyncContent"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { SurfaceListCard } from "@/components/blocks/cards/SurfaceListCard"
import { useAppSelector } from "@/redux/hooks"

/** Placeholder course rows shown while the list loads. */
const SKELETON_ROWS = 2

/** Props for {@link OverviewCourses}. */
export interface OverviewCoursesProps {
    /** Section label, rendered outside the card (owned here, like every other self-contained section). */
    label: React.ReactNode
    /** Optional "see more" link on the label row. */
    onSeeMore?: () => void
    /** Text for the see-more link. */
    seeMoreLabel?: React.ReactNode
}

/**
 * Overview content — courses the profile owner has joined. Each course is one
 * compact row: a course icon, the title + overall completion %, and a single
 * segmented bar that folds the three dimensions (content / challenge / milestone)
 * into one honest progress bar (filled to the real total, coloured by dimension).
 *
 * Owns its own `LabeledCard`, with `frameless` computed HERE (not hardcoded) so the
 * list — self-framed as a `SurfaceListCard` — skips the outer card, while the empty
 * and error states, which have no bounded surface of their own, still get one. The
 * placeholder rows are the SAME `CourseRow` resting, inside the SAME list, so no
 * second description of the row exists (`loading-and-skeleton.md`).
 *
 * @param props - {@link OverviewCoursesProps}
 */
export const OverviewCourses = ({ label, onSeeMore, seeMoreLabel }: OverviewCoursesProps) => {
    const t = useTranslations()
    const username = useProfileUsername()
    const { data: user } = useQueryUserProfileSwr(username)
    const userId = user?.id ?? null
    // only the profile OWNER sees the "Free trial" chip — don't broadcast "hasn't paid"
    // for a course on someone else's public profile.
    const viewerId = useAppSelector((state) => state.user.user?.id)
    const isOwnProfile = Boolean(viewerId) && viewerId === userId
    const { data, isLoading, error, mutate } = useQueryUserCoursesSwr(userId)

    const courses = data ?? []
    const isSkeleton = (isLoading || !userId) && courses.length === 0
    // the list frames itself; every other state needs the card's own surface
    const hasCourses = !isSkeleton && !error && courses.length > 0

    // error beats a stale loading flag; empty only once settled (BLOCK-8 order).
    const body = () => {
        if (error && courses.length === 0) {
            return (
                <AsyncContentError
                    title={t("publicProfile.loadError")}
                    onRetry={() => { void mutate() }}
                    retryLabel={t("publicProfile.loadErrorRetry")}
                />
            )
        }
        if (!isSkeleton && courses.length === 0) {
            return <AsyncContentEmpty title={t("publicProfile.coursesEmpty")} />
        }
        return (
            <SurfaceListCard>
                {isSkeleton
                    ? Array.from({ length: SKELETON_ROWS }, (_row, index) => (
                        <CourseRow key={index} isSkeleton />
                    ))
                    : courses.map((item) => (
                        <CourseRow key={item.globalId} item={item} isOwnProfile={isOwnProfile} />
                    ))}
            </SurfaceListCard>
        )
    }

    return (
        <LabeledCard
            identity={{ tier: "block", component: "OverviewCourses" }}
            label={label}
            onSeeMore={onSeeMore}
            seeMoreLabel={seeMoreLabel}
            frameless={hasCourses || isSkeleton}
        >
            {body()}
        </LabeledCard>
    )
}
