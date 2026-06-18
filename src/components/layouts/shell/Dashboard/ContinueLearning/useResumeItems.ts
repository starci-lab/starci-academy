"use client"

import {
    useMemo,
} from "react"
import {
    useAppSelector,
} from "@/redux"
import {
    useQueryMyCoursesSwr,
    useQueryMyInProgressChallengesSwr,
    useQueryMyLearnedLessonsSwr,
} from "@/hooks"
import type {
    QueryMyDashboardRefItemData,
} from "@/modules/api"

/** Kind of resume target — drives the chip icon + label. */
export type ResumeKind = "challenge" | "lesson"

/** One "pick up where you left off" card item. */
export interface ResumeItem {
    /** Opaque global id — resolved to a route on click. */
    globalId: string
    /** Title to show. */
    label: string
    /** Challenge vs lesson (chip styling). */
    kind: ResumeKind
}

/** Max number of resume cards shown in the hero. */
export const RESUME_LIMIT = 3

/** Shape returned by {@link useResumeItems}. */
export interface UseResumeItemsResult {
    /** Readable name — chosen display name, else the part before "@". */
    displayName: string
    /** Resume targets, in-progress challenges first, capped + de-duplicated. */
    resumeItems: Array<ResumeItem>
    /** Whether the viewer has joined at least one course. */
    hasCourses: boolean
    /** Whether any underlying leaf query is still loading. */
    isLoading: boolean
}

/**
 * Self-fetches the dashboard hero's leaf queries (courses / in-progress
 * challenges / learned lessons) and derives the data the "pick up where you left
 * off" hero renders: a readable greeting name, the prioritised + de-duplicated
 * resume targets, and whether the viewer has joined any course. Keeps the
 * component pure markup. `"use client"` for redux + SWR.
 * @returns greeting name, resume items, hasCourses flag, and loading state.
 */
export const useResumeItems = (): UseResumeItemsResult => {
    const user = useAppSelector((state) => state.user.user)

    const courses = useQueryMyCoursesSwr()
    const inProgressChallenges = useQueryMyInProgressChallengesSwr()
    const learnedLessons = useQueryMyLearnedLessonsSwr()

    const isLoading = courses.isLoading
        || inProgressChallenges.isLoading
        || learnedLessons.isLoading

    /** Readable name — chosen display name, else the part before "@". */
    const displayName = useMemo(
        () => {
            const explicit = user?.displayName?.trim()
            if (explicit) {
                return explicit
            }
            const base = user?.email ?? user?.username ?? ""
            return base.split("@")[0]
        },
        [
            user,
        ],
    )

    /**
     * Resume targets, in-progress challenges first (the viewer is actively working
     * them) then recent lessons, capped at {@link RESUME_LIMIT} and de-duplicated.
     */
    const resumeItems = useMemo<Array<ResumeItem>>(
        () => {
            const toItem = (kind: ResumeKind) => (ref: QueryMyDashboardRefItemData): ResumeItem => ({
                globalId: ref.globalId,
                label: ref.label,
                kind,
            })
            const merged = [
                ...(inProgressChallenges.data ?? []).map(toItem("challenge")),
                ...(learnedLessons.data ?? []).map(toItem("lesson")),
            ]
            const seen = new Set<string>()
            const unique = merged.filter((item) => {
                if (seen.has(item.globalId)) {
                    return false
                }
                seen.add(item.globalId)
                return true
            })
            return unique.slice(0, RESUME_LIMIT)
        },
        [
            inProgressChallenges.data,
            learnedLessons.data,
        ],
    )

    const hasCourses = (courses.data?.length ?? 0) > 0

    return {
        displayName,
        resumeItems,
        hasCourses,
        isLoading,
    }
}
