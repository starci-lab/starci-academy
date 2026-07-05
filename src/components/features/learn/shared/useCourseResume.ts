"use client"

import { useMemo } from "react"
import { useLocale } from "next-intl"
import { useAppSelector } from "@/redux/hooks"
import { useQueryMyCourseOutlineSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyCourseOutlineSwr"
import { resolveResumeHref } from "../CourseContents/map"
import type {
    MyCourseOutlineCurrentTask,
    MyCourseOutlinePayload,
} from "@/modules/api/graphql/queries/types/my-course-outline"

/** Result of {@link useCourseResume}. */
export interface UseCourseResumeResult {
    /** Raw SWR handle (for `isLoading` / `error` / `mutate`). */
    outlineSwr: ReturnType<typeof useQueryMyCourseOutlineSwr>
    /** The loaded outline payload, or `null` while loading / on error. */
    outline: MyCourseOutlinePayload | null
    /** The resume pointer the "Tiếp tục" action targets (content-first), or null. */
    resumePointer: MyCourseOutlineCurrentTask | null
    /** Deep link the resume action opens, or `null` when nothing is resolvable. */
    resumeHref: string | null
    /** Title of the resume target (walked from the tree), or `null`. */
    resumeTitle: string | null
    /** Whether the resume target is the capstone (all content done). */
    isCapstoneResume: boolean
    /** Overall completion percent (0-100), 0 while loading. */
    completionPercent: number
}

/**
 * The single source for the course "Tiếp tục học" (resume) pointer — shared by the
 * content home ({@link import("../CourseContents").CourseContents}) and the sidebar
 * resume rail ({@link import("../LearnShell/ResumeRail").ResumeRail}) so both read
 * ONE computation off ONE SWR cache (deduped by key). CONTENT-FIRST: prefers
 * `nextContentTask` (next unread lesson / uncompleted challenge) over the capstone,
 * falling back to `currentTask` only once all content is done.
 *
 * @returns {@link UseCourseResumeResult}
 */
export const useCourseResume = (): UseCourseResumeResult => {
    const locale = useLocale()
    const courseId = useAppSelector((state) => state.course.id)
    const displayId = useAppSelector((state) => state.course.displayId)
    const outlineSwr = useQueryMyCourseOutlineSwr(courseId ?? null)
    const outline = outlineSwr.data ?? null

    // content-first: next unread lesson / uncompleted challenge, else capstone task
    const resumePointer = useMemo(
        () => outline?.nextContentTask ?? outline?.currentTask ?? null,
        [outline],
    )

    const isCapstoneResume = resumePointer?.kind === "milestoneTask"

    const resumeHref = useMemo(
        () => (outline && resumePointer
            ? resolveResumeHref(resumePointer, outline.modules, locale, displayId)
            : null),
        [outline, resumePointer, locale, displayId],
    )

    // walk the tree to recover the resume target's title for the continue line
    const resumeTitle = useMemo(() => {
        if (!outline || !resumePointer) {
            return null
        }
        if (resumePointer.kind === "milestoneTask") {
            for (const milestone of outline.milestones) {
                const task = milestone.tasks.find((entry) => entry.id === resumePointer.id)
                if (task) {
                    return task.title
                }
            }
            return null
        }
        for (const module of outline.modules) {
            if (resumePointer.kind === "lesson") {
                const lesson = module.lessons.find((entry) => entry.id === resumePointer.id)
                if (lesson) {
                    return lesson.title
                }
                continue
            }
            for (const lesson of module.lessons) {
                const challenge = lesson.challenges.find((entry) => entry.id === resumePointer.id)
                if (challenge) {
                    return challenge.title
                }
            }
        }
        return null
    }, [outline, resumePointer])

    return {
        outlineSwr,
        outline,
        resumePointer,
        resumeHref,
        resumeTitle,
        isCapstoneResume,
        completionPercent: outline?.progress.completionPercent ?? 0,
    }
}
