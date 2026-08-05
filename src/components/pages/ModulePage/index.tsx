"use client"

import React, {
    useCallback,
    useMemo,
} from "react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    useParams,
    useRouter,
} from "next/navigation"
import { useAppSelector } from "@/redux/hooks"
import { useQueryModuleSwr } from "@/hooks/swr/api/graphql/queries/useQueryModuleSwr"
import { useQueryMyCourseOutlineSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyCourseOutlineSwr"
import { useQueryCoursePricePreviewSwr } from "@/hooks/swr/api/graphql/queries/useQueryCoursePricePreviewSwr"
import { usePaymentOverlayState } from "@/hooks/zustand/overlay/hooks"
import { PaymentFlow } from "@/modules/types/payment"
import { pathConfig } from "@/resources/path"
import { ContentTab } from "@/redux/slices/tabs"
import { toArticlePricingPhase } from "@/components/pages/_map"
import { toDifficulty } from "@/modules/utils/difficulty"
import type { ModuleHeaderCrumb } from "@/components/blocks/learn/ModuleHeader"
import type { ModuleLessonListLesson } from "@/components/blocks/learn/ModuleLessonList"
import type { ModuleChallengeItem } from "@/components/blocks/learn/ModuleChallengeList"
import { _ModulePage } from "./component"

/**
 * A module's own page (`/learn/content/modules/<moduleId>`) — the CONNECTED half
 * of {@link _ModulePage}. Ports the exact data wiring of the v1
 * `features/learn/ModulePage`: identity (title/description/tier/premium) comes
 * from the `module` shell query (route-param driven); progress + the
 * lesson/challenge list with the viewer's read/completion flags comes from the
 * SAME `myCourseOutline` tree the rail + course-home already fetch
 * (SWR-deduped, no extra round trip for progress). The paywall reuses the SAME
 * loyalty-aware price preview + payment-modal flow `ContentArticle`'s own
 * paywall already uses — same wall, same reason.
 *
 * @see .storybook/components/starci/pages/ModulePage/ModulePage.tsx — the blueprint.
 */
export const ModulePage = () => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const params = useParams()
    const moduleId = params.moduleId as string | undefined

    const displayId = useAppSelector((state) => state.course.displayId)
    const courseId = useAppSelector((state) => state.course.id)
    const courseTitle = useAppSelector((state) => state.course.entity?.title)
    const enrolled = useAppSelector((state) => state.user.enrolled)

    const moduleSwr = useQueryModuleSwr()
    const moduleEntity = moduleSwr.data?.module.data

    const outlineSwr = useQueryMyCourseOutlineSwr(courseId ?? null)
    const outline = outlineSwr.data
    const outlineModule = useMemo(
        () => outline?.modules.find((module) => module.id === moduleId),
        [outline, moduleId],
    )

    const lessons = outlineModule?.lessons ?? []
    const readCount = lessons.filter((lesson) => lesson.isRead).length
    const challenges = useMemo(
        () => lessons.flatMap((lesson) => lesson.challenges.map((challenge) => ({
            ...challenge,
            lessonId: lesson.id,
        }))),
        [lessons],
    )
    const challengesDone = challenges.filter((challenge) => challenge.completed).length

    const isLoading = (!moduleSwr.data && !moduleSwr.error) || (!outlineSwr.data && !outlineSwr.error)
    const isEmpty = !moduleEntity || !outlineModule || lessons.length === 0
    const error = moduleSwr.error ?? outlineSwr.error

    const isLocked = Boolean(moduleEntity?.isPremium) && !enrolled

    /** First unread lesson (else undefined once every lesson is read — "all done"). */
    const resumeLesson = useMemo(
        () => lessons.find((lesson) => !lesson.isRead),
        [lessons],
    )

    /** Navigate into the reader for a lesson within this module. */
    const onSelectLesson = useCallback(
        (lessonId: string) => {
            if (!displayId || !moduleId) {
                return
            }
            router.push(
                pathConfig().locale(locale).course(displayId).learn().module(moduleId).content(lessonId).build(),
            )
        },
        [router, locale, displayId, moduleId],
    )

    /** Open the owning lesson's challenges tab. */
    const onSelectChallenge = useCallback(
        (lessonId: string) => {
            if (!displayId || !moduleId) {
                return
            }
            const base = pathConfig().locale(locale).course(displayId).learn().module(moduleId).content(lessonId).build()
            router.push(`${base}?tab=${ContentTab.Challenges}`)
        },
        [router, locale, displayId, moduleId],
    )

    const onResume = useCallback(() => {
        if (resumeLesson) {
            onSelectLesson(resumeLesson.id)
        }
    }, [resumeLesson, onSelectLesson])

    /** Trail: Courses -> this course -> this module (current, no link). */
    const breadcrumbItems = useMemo<Array<ModuleHeaderCrumb>>(() => [
        {
            key: "courses",
            label: t("nav.courses"),
            onPress: () => router.push(pathConfig().locale(locale).course().build()),
        },
        {
            key: "course",
            label: courseTitle || t("nav.courses"),
            onPress: () => router.push(pathConfig().locale(locale).course(displayId ?? "").build()),
        },
        {
            key: "module",
            label: moduleEntity?.title ?? "",
        },
    ], [t, locale, router, courseTitle, displayId, moduleEntity?.title])

    // ---- premium offer (loyalty-aware price preview, SAME source/flow as `ContentArticle`'s paywall) ----

    const { open: openPaymentModal } = usePaymentOverlayState()
    const onPurchase = useCallback(
        () => openPaymentModal({ flow: PaymentFlow.CourseEnroll }),
        [openPaymentModal],
    )
    const priceSwr = useQueryCoursePricePreviewSwr(isLocked ? courseId : undefined)
    const price = priceSwr.data

    // The current module's lessons/challenges -> the block twins' own row shapes
    // (difficulty resolved here, so the presentational file takes typed enums).
    const moduleLessons = useMemo<Array<ModuleLessonListLesson>>(
        () => lessons.map((lesson) => ({
            id: lesson.id,
            title: lesson.title,
            minutesRead: lesson.minutesRead,
            challengeCount: lesson.challenges.length,
            isRead: lesson.isRead,
            isPremium: lesson.isPremium,
            difficulty: lesson.difficulty ? toDifficulty(lesson.difficulty) : undefined,
        })),
        [lessons],
    )

    const moduleChallenges = useMemo<Array<ModuleChallengeItem>>(
        () => challenges.map((challenge) => ({
            id: challenge.id,
            title: challenge.title,
            difficulty: toDifficulty(challenge.difficulty),
            completed: challenge.completed,
            lessonId: challenge.lessonId,
        })),
        [challenges],
    )

    return (
        <_ModulePage
            isLoading={isLoading}
            error={error}
            onRetry={() => {
                void moduleSwr.mutate()
                void outlineSwr.mutate()
            }}
            isEmpty={isEmpty}
            emptyTitle={t("modulePage.empty")}
            errorTitle={t("modulePage.error")}
            retryLabel={t("modulePage.retry")}
            breadcrumbItems={breadcrumbItems}
            title={moduleEntity?.title ?? ""}
            description={moduleEntity?.description || undefined}
            tier={moduleEntity?.contentTier}
            lessonCount={lessons.length}
            minutesTotal={lessons.reduce((sum, lesson) => sum + lesson.minutesRead, 0)}
            challengeCount={challenges.length}
            isLocked={isLocked}
            paywallTitle={t("course.paywall.title")}
            paywallDescription={t("course.paywall.description")}
            discountedPriceVnd={price?.discountedPriceVnd}
            originalPriceVnd={price?.originalPriceVnd}
            currentPhase={price?.currentPhase ? toArticlePricingPhase(price.currentPhase) : undefined}
            seatsRemaining={price?.seatsRemainingInCurrentPhase}
            nextPhasePriceVnd={price?.nextPhasePriceVnd}
            paywallCtaLabel={t("course.paywall.buy")}
            onPurchase={onPurchase}
            resumeLessonTitle={resumeLesson?.title}
            lessonsRead={readCount}
            lessonsTotal={lessons.length}
            challengesDone={challengesDone}
            challengesTotal={challenges.length}
            onResume={onResume}
            lessons={moduleLessons}
            resumeLessonId={resumeLesson?.id}
            onSelectLesson={onSelectLesson}
            challenges={moduleChallenges}
            onSelectChallenge={onSelectChallenge}
        />
    )
}

export default ModulePage
