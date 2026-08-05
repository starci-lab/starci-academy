"use client"

import React, {
    useCallback,
    useEffect,
    useMemo,
} from "react"
import { toast } from "@/modules/toast/toast"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import numeral from "numeral"
import {
    useRouter,
} from "next/navigation"
import { useCourseTotals } from "@/hooks/useCourseTotals"
import {
    pathConfig,
} from "@/resources/path"
import {
    toDifficulty,
} from "@/components/pages/_map"
import { useCourseResume } from "@/components/features/learn/shared/useCourseResume"
import { useAppSelector } from "@/redux/hooks"
import { _CourseContents, type CourseContentsLesson } from "./component"
import type { MyCourseOutlineModule } from "@/modules/api/graphql/queries/types/my-course-outline"

/**
 * Course-content home — the CONNECTED half of the `/learn/content` dashboard: it reads the course +
 * resume state (SWR-deduped with the sidebar rail), fires the earned-moment nudge, resolves every
 * label (incl. interpolation), builds the lesson-path rows, and hands them to the presentational
 * {@link _CourseContents}. The full module → lesson tree lives in the left content-map rail, so the
 * body is a focused dashboard rather than a second tree. See `design/storybook/architecture/split.md`.
 */
export const CourseContents = () => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const displayId = useAppSelector((state) => state.course.displayId)
    const courseTitle = useAppSelector((state) => state.course.entity?.title)
    const courseDescription = useAppSelector((state) => state.course.entity?.description)
    const enrollmentCount = useAppSelector((state) => state.course.entity?.enrollmentCount) ?? 0
    const courseEntityId = useAppSelector((state) => state.course.entity?.id)
    // trial = logged-in learner who has NOT purchased; `enrollKnown` gates until the
    // status query settles so the conversion strip never flashes for a paid learner.
    const enrolled = useAppSelector((state) => state.user.enrolled)
    const enrollKnown = useAppSelector((state) => state.user.enrollKnown)

    // catalog meta (chapters · study hours · learners) — derived client-side from the loaded
    // course tree, identity facts the progress stat line below does NOT carry.
    const totals = useCourseTotals()
    const readingHours = Math.max(1, Math.round(totals.totalMinutes / 60))

    // resume pointer + progress from the single shared source (also feeds the
    // sidebar resume rail; SWR dedupes the underlying outline fetch)
    const {
        outlineSwr,
        outline,
        resumePointer,
        resumeHref,
        resumeTitle,
        isCapstoneResume,
    } = useCourseResume()

    /**
     * The module the learner is currently in: the one owning the resume pointer, else
     * the first module. Its lessons are the "keep going" path shown in the body.
     */
    const currentModule = useMemo<MyCourseOutlineModule | undefined>(() => {
        if (!outline) {
            return undefined
        }
        const pointer = outline.nextContentTask ?? outline.currentTask
        if (pointer) {
            const owning = outline.modules.find((module) =>
                module.lessons.some((lesson) =>
                    lesson.id === pointer.id
                    || lesson.challenges.some((challenge) => challenge.id === pointer.id)))
            if (owning) {
                return owning
            }
        }
        return outline.modules[0]
    }, [outline])

    // goal-gradient signal for the trial strip: FREE lessons the viewer hasn't read
    // yet ("N preview lessons left") — a near-a-milestone framing that beats "read X/Y".
    const freeLessonsRemaining = useMemo(() => {
        if (!outline) {
            return 0
        }
        return outline.modules.reduce(
            (sum, module) => sum + module.lessons.filter(
                (lesson) => !lesson.isPremium && !lesson.isRead,
            ).length,
            0,
        )
    }, [outline])

    // earned-moment (#9): once a TRIAL learner has proven serious engagement (read a
    // few free lessons or passed a challenge), fire ONE celebratory enroll nudge —
    // localStorage-gated per course so it never nags on return visits.
    useEffect(() => {
        if (!enrollKnown || enrolled || !courseEntityId || !outline) {
            return
        }
        if (typeof window === "undefined") {
            return
        }
        const key = `starci.trialEarned.${courseEntityId}`
        if (window.localStorage.getItem(key)) {
            return
        }
        const provenSerious = outline.progress.lessonsRead >= 3
            || outline.progress.challengesCompleted >= 1
        if (!provenSerious) {
            return
        }
        window.localStorage.setItem(key, "1")
        toast.success(t("courseContents.trial.earnedTitle"), {
            description: t("courseContents.trial.earnedDesc"),
        })
    }, [enrollKnown, enrolled, courseEntityId, outline, t])

    /** The lesson to highlight in the path: the resume lesson, or the resume challenge's owner. */
    const activeLessonId = useMemo(() => {
        if (!outline || !resumePointer) {
            return undefined
        }
        if (resumePointer.kind === "lesson") {
            return resumePointer.id
        }
        if (resumePointer.kind === "challenge") {
            for (const module of outline.modules) {
                const lesson = module.lessons.find((entry) =>
                    entry.challenges.some((challenge) => challenge.id === resumePointer.id))
                if (lesson) {
                    return lesson.id
                }
            }
        }
        return undefined
    }, [outline, resumePointer])

    /** Navigate into the reader for the chosen lesson. */
    const onSelectLesson = useCallback(
        (lessonId: string, moduleId: string) => {
            if (!displayId) {
                return
            }
            router.push(
                pathConfig().locale(locale).course(displayId).learn().module(moduleId).content(lessonId).build(),
            )
        },
        [router, locale, displayId],
    )

    /** Open the resume target. */
    const onResume = useCallback(() => {
        if (resumeHref) {
            router.push(resumeHref)
        }
    }, [router, resumeHref])

    // The current module's lessons → the keep-going path rows (state + difficulty + minutes-read
    // resolved here, so the presentational file takes plain strings).
    const lessons = useMemo<Array<CourseContentsLesson>>(() => {
        if (!currentModule) {
            return []
        }
        return currentModule.lessons.map((lesson) => ({
            id: lesson.id,
            title: lesson.title,
            minutesReadText: t("content.minutesRead", { minutes: lesson.minutesRead }),
            state: lesson.id === activeLessonId ? "active" : lesson.isRead ? "read" : "unread",
            difficulty: lesson.difficulty ? toDifficulty(lesson.difficulty) : undefined,
            isPremium: lesson.isPremium,
            onPress: () => onSelectLesson(lesson.id, currentModule.id),
        }))
    }, [currentModule, activeLessonId, onSelectLesson, t])

    return (
        <_CourseContents
            isLoading={!outlineSwr.data && !outlineSwr.error}
            error={!outlineSwr.data ? outlineSwr.error : undefined}
            onRetry={() => { void outlineSwr.mutate() }}
            isEmpty={!outline}
            title={courseTitle ?? outline?.course.title ?? ""}
            description={courseDescription || undefined}
            meta={totals.moduleCount > 0 ? {
                moduleCount: totals.moduleCount,
                hoursText: `~${readingHours}`,
                learnersText: enrollmentCount > 0 ? numeral(enrollmentCount).format("0,0") : undefined,
            } : undefined}
            trialStrip={enrollKnown && !enrolled && courseEntityId ? {
                courseId: courseEntityId,
                freeLessonsRemaining,
            } : undefined}
            resumeTitle={resumeHref && resumeTitle ? resumeTitle : undefined}
            onResume={resumeHref ? onResume : undefined}
            completionPercent={outline?.progress.completionPercent ?? 0}
            moduleTitle={currentModule?.title}
            lessons={lessons}
            labels={{
                emptyTitle: t("courseContents.empty"),
                errorTitle: t("courseContents.error"),
                retry: t("courseContents.retry"),
                metaModulesLabel: t("courseContents.metaModulesLabel"),
                metaHoursLabel: t("courseContents.metaHoursLabel"),
                metaLearnersLabel: t("courseContents.metaLearnersLabel"),
                eyebrow: resumeHref
                    ? (isCapstoneResume
                        ? t("courseContents.capstoneEyebrow")
                        : t("courseContents.continueEyebrow"))
                    : t("courseContents.allDone"),
                resumeButton: isCapstoneResume
                    ? t("courseContents.resumeCapstone")
                    : t("courseContents.resume"),
                completion: t("courseContents.completion"),
                progressStat: [
                    t("courseContents.lessonsStat", {
                        read: outline?.progress.lessonsRead ?? 0,
                        total: outline?.progress.lessonsTotal ?? 0,
                    }),
                    t("courseContents.challengesStat", {
                        done: outline?.progress.challengesCompleted ?? 0,
                        total: outline?.progress.challengesTotal ?? 0,
                    }),
                ].join(" · "),
                keepGoing: t("courseContents.keepGoing"),
                premiumLabel: t("courseContents.premium"),
            }}
        />
    )
}
