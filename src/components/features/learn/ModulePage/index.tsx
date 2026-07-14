"use client"

import React, {
    useCallback,
    useMemo,
} from "react"
import {
    Button,
    Typography,
} from "@heroui/react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    useParams,
    useRouter,
} from "next/navigation"
import {
    ArrowRightIcon,
    CheckCircleIcon,
    CircleIcon,
    ClockIcon,
    LockIcon,
    PlayIcon,
    PuzzlePieceIcon,
    StackIcon,
} from "@phosphor-icons/react"
import { LearnBreadcrumb } from "../shared/LearnBreadcrumb"
import { EnrollGate } from "../shared/EnrollGate"
import {
    pathConfig,
} from "@/resources/path"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"
import {
    toDifficulty,
} from "../CourseContents/map"
import {
    ModulePageSkeleton,
} from "./ModulePageSkeleton"
import { useAppSelector } from "@/redux/hooks"
import { useQueryModuleSwr } from "@/hooks/swr/api/graphql/queries/useQueryModuleSwr"
import { useQueryMyCourseOutlineSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyCourseOutlineSwr"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { DifficultyChip } from "@/components/blocks/chips/DifficultyChip"
import { HighlightChip } from "@/components/blocks/chips/HighlightChip"
import { StatusChip } from "@/components/blocks/chips/StatusChip"
import {
    SurfaceListCard,
    SurfaceListCardRow,
} from "@/components/blocks/cards/SurfaceListCard"
import { PageHeader } from "@/components/blocks/layout/PageHeader"
import { ProgressMeter } from "@/components/blocks/stats/ProgressMeter"
import { CourseContentTier } from "@/modules/types/enums/course-content-tier"
import { ContentTab } from "@/redux/slices/tabs"

/** Props for {@link ModulePage}. */
export type ModulePageProps = WithClassNames<undefined>

/** Chip tone per learning tier (foundation → advanced reads easy → hard). */
const TIER_TONE: Record<CourseContentTier, "success" | "warning" | "danger"> = {
    [CourseContentTier.Foundation]: "success",
    [CourseContentTier.Intermediate]: "warning",
    [CourseContentTier.Advanced]: "danger",
}

/**
 * Dedicated module page (`/learn/content/modules/<moduleId>`) — a "module home"
 * mirroring the course-content dashboard's chrome (flat continue + progress
 * block, TIER-1 breadcrumb, TIER-2 header), but with a Hybrid lesson list: each
 * row still carries a status icon + resume highlight (course-home resume-first
 * pattern) while ALSO showing rich per-lesson meta (minutes · difficulty ·
 * challenge count), so the page works both as "where am I" and as a scannable
 * syllabus for this one module. The full module → lesson TREE still lives in the
 * left content-map rail — this page never redraws it, only "this module + where
 * I am in it".
 *
 * Identity (title/description/tier/premium/previewContents) comes from the
 * `module` shell query (route-param driven); progress + the lesson/challenge
 * list with the viewer's read/completion flags comes from the SAME
 * `myCourseOutline` tree the rail + course-home already fetch (SWR-deduped, no
 * extra round trip for progress).
 *
 * @param props - {@link ModulePageProps}
 */
export const ModulePage = ({ className }: ModulePageProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const params = useParams()
    const moduleId = params.moduleId as string | undefined

    const displayId = useAppSelector((state) => state.course.displayId)
    const courseId = useAppSelector((state) => state.course.id)
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

    return (
        <div className={className}>
            <AsyncContent
                isLoading={isLoading}
                skeleton={<ModulePageSkeleton className="mx-auto max-w-3xl" />}
                isEmpty={isEmpty}
                emptyContent={{ title: t("modulePage.empty") }}
                error={error}
                errorContent={{
                    title: t("modulePage.error"),
                    onRetry: () => {
                        void moduleSwr.mutate()
                        void outlineSwr.mutate()
                    },
                    retryLabel: t("modulePage.retry"),
                }}
            >
                {moduleEntity && outlineModule ? (
                    <div className="mx-auto flex max-w-3xl flex-col gap-10">
                        {/* tier: PageHeader (header) → content cluster, gap-10 between — mirrors CourseContents */}
                        <PageHeader
                            breadcrumb={<LearnBreadcrumb current={moduleEntity.title} />}
                            title={moduleEntity.title}
                            description={moduleEntity.description || undefined}
                            meta={(
                                <div className="flex flex-wrap items-center gap-2">
                                    {moduleEntity.contentTier ? (
                                        <StatusChip tone={TIER_TONE[moduleEntity.contentTier]}>
                                            {t(`courseLanding.tier.${moduleEntity.contentTier}`)}
                                        </StatusChip>
                                    ) : null}
                                    <HighlightChip
                                        icon={<StackIcon className="size-4" />}
                                        value={lessons.length}
                                        label={t("modulePage.metaLessonsLabel")}
                                    />
                                    <HighlightChip
                                        icon={<ClockIcon className="size-4" />}
                                        value={outlineModule.lessons.reduce((sum, lesson) => sum + lesson.minutesRead, 0)}
                                        label={t("modulePage.metaMinutesLabel")}
                                    />
                                    {challenges.length > 0 ? (
                                        <HighlightChip
                                            icon={<PuzzlePieceIcon className="size-4" />}
                                            value={challenges.length}
                                            label={t("modulePage.metaChallengesLabel")}
                                        />
                                    ) : null}
                                </div>
                            )}
                        />

                        {isLocked ? (
                            <EnrollGate
                                title={t("enrollGate.title", { surface: moduleEntity.title })}
                                description={t("enrollGate.description")}
                            />
                        ) : (
                            <div className="flex flex-col gap-6">
                                {/* continue + progress — flat (no card frame), mirrors course-home */}
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex min-w-0 flex-col gap-0">
                                            <Typography type="body-xs" color="muted">
                                                {resumeLesson ? t("modulePage.continueEyebrow") : t("modulePage.allDone")}
                                            </Typography>
                                            {resumeLesson ? (
                                                <Typography type="body" weight="semibold" truncate title={resumeLesson.title}>
                                                    {resumeLesson.title}
                                                </Typography>
                                            ) : null}
                                        </div>
                                        {resumeLesson ? (
                                            <Button
                                                variant="primary"
                                                size="lg"
                                                className="shrink-0"
                                                onPress={onResume}
                                            >
                                                {t("modulePage.resume")}
                                                <ArrowRightIcon aria-hidden focusable="false" className="size-5" />
                                            </Button>
                                        ) : null}
                                    </div>
                                    <ProgressMeter
                                        value={readCount}
                                        max={lessons.length}
                                        label={t("modulePage.completion")}
                                        showValue
                                    />
                                    <Typography type="body-xs" color="muted">
                                        {[
                                            t("modulePage.lessonsStat", { read: readCount, total: lessons.length }),
                                            challenges.length > 0
                                                ? t("modulePage.challengesStat", { done: challengesDone, total: challenges.length })
                                                : null,
                                        ].filter(Boolean).join(" · ")}
                                    </Typography>
                                </div>

                                {/* rich lesson list — status icon (resume-first) + title + meta
                                    (minutes · difficulty · challenge count), scannable syllabus */}
                                <div className="flex flex-col gap-3">
                                    <Typography type="body-sm" weight="semibold" color="muted">
                                        {t("modulePage.lessonsHeading")}
                                    </Typography>
                                    <SurfaceListCard>
                                        {lessons.map((lesson) => (
                                            <SurfaceListCardRow
                                                key={lesson.id}
                                                leading={lesson.id === resumeLesson?.id ? (
                                                    <PlayIcon
                                                        aria-hidden
                                                        focusable="false"
                                                        className="size-5 text-accent"
                                                    />
                                                ) : lesson.isRead ? (
                                                    <CheckCircleIcon
                                                        aria-label={t("modulePage.read")}
                                                        focusable="false"
                                                        className="size-5 text-success"
                                                    />
                                                ) : (
                                                    <CircleIcon
                                                        aria-label={t("modulePage.unread")}
                                                        focusable="false"
                                                        className="size-5 text-muted"
                                                    />
                                                )}
                                                title={lesson.title}
                                                subtitle={[
                                                    t("content.minutesRead", { minutes: lesson.minutesRead }),
                                                    lesson.challenges.length > 0
                                                        ? t("modulePage.challengeCount", { count: lesson.challenges.length })
                                                        : null,
                                                ].filter(Boolean).join(" · ")}
                                                onPress={() => onSelectLesson(lesson.id)}
                                                meta={(
                                                    <>
                                                        {lesson.difficulty ? (
                                                            <DifficultyChip difficulty={toDifficulty(lesson.difficulty)} />
                                                        ) : null}
                                                        {lesson.isPremium ? (
                                                            <LockIcon
                                                                aria-label={t("modulePage.premium")}
                                                                focusable="false"
                                                                className="size-5 text-muted"
                                                            />
                                                        ) : null}
                                                    </>
                                                )}
                                            />
                                        ))}
                                    </SurfaceListCard>
                                </div>

                                {/* challenge list — every challenge across this module's lessons */}
                                {challenges.length > 0 ? (
                                    <div className="flex flex-col gap-3">
                                        <Typography type="body-sm" weight="semibold" color="muted">
                                            {t("modulePage.challengesHeading")}
                                        </Typography>
                                        <SurfaceListCard>
                                            {challenges.map((challenge) => (
                                                <SurfaceListCardRow
                                                    key={challenge.id}
                                                    leading={(
                                                        <PuzzlePieceIcon
                                                            aria-hidden
                                                            focusable="false"
                                                            className={challenge.completed ? "size-5 text-success" : "size-5 text-muted"}
                                                        />
                                                    )}
                                                    title={challenge.title}
                                                    subtitle={challenge.completed ? t("modulePage.challengeDone") : undefined}
                                                    onPress={() => onSelectChallenge(challenge.lessonId)}
                                                    meta={<DifficultyChip difficulty={toDifficulty(challenge.difficulty)} />}
                                                />
                                            ))}
                                        </SurfaceListCard>
                                    </div>
                                ) : null}
                            </div>
                        )}
                    </div>
                ) : null}
            </AsyncContent>
        </div>
    )
}

export default ModulePage
