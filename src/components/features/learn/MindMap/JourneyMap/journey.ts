import type { Locale } from "next-intl"
import { pathConfig } from "@/resources/path"
import { resolveContentHref } from "../progress"
import type {
    MyCourseOutlineCurrentTask,
    MyCourseOutlineModule,
    MyCourseOutlinePayload,
} from "@/modules/api/graphql/queries/types/my-course-outline"

/** Coarse position of a waypoint along the journey path. */
export type WaypointStatus = "done" | "current" | "upcoming"

/** One child of a waypoint (a lesson / task) or side-quest (a challenge). */
export interface JourneyChild {
    /** Stable id (used as key + navigation anchor). */
    id: string
    /** Display label (locale-resolved). */
    label: string
    /** Whether the viewer has finished it (read lesson / completed challenge or task). */
    done: boolean
    /** In-app href to open it, or null when unroutable. */
    href: string | null
}

/** A major stop on the journey path — a module (learning) or a milestone (capstone). */
export interface JourneyWaypoint {
    id: string
    title: string
    status: WaypointStatus
    /** Premium paywall flag → lock overlay (does not change status). */
    premium: boolean
    /** Primary children: lessons (learning) / tasks (capstone). */
    children: Array<JourneyChild>
    childrenDone: number
    childrenTotal: number
    /** Side-quests: challenges (learning only; empty for capstone). */
    quests: Array<JourneyChild>
    questsDone: number
    questsTotal: number
    /** Where clicking the waypoint navigates (first undone child, else first child). */
    href: string | null
}

/** A full serpentine journey — one tab of the mind-map (learning or capstone). */
export interface Journey {
    kind: "learning" | "capstone"
    waypoints: Array<JourneyWaypoint>
    /** 0-based index of the current waypoint (`-1` when there are none). */
    currentIndex: number
    /** Resume href for the tab's single CTA, or null when all done. */
    resumeHref: string | null
    /** Overall completion percent for the HUD (0-100). */
    progressPercent: number
}

/** `learn()` path builder root for a course, or null when the slug is unknown. */
const learnBase = (locale: Locale, displayId: string | undefined) =>
    (displayId ? pathConfig().locale(locale).course(displayId).learn() : null)

/** Does a module own a content pointer (its lesson, or a challenge under its lesson)? */
const moduleOwns = (module: MyCourseOutlineModule, pointer: MyCourseOutlineCurrentTask): boolean => {
    if (pointer.kind === "lesson") {
        return module.lessons.some((lesson) => lesson.id === pointer.id)
    }
    if (pointer.kind === "challenge") {
        return module.lessons.some((lesson) =>
            lesson.challenges.some((challenge) => challenge.id === pointer.id))
    }
    return false
}

/** Apply `done`/`current`/`upcoming` tint by position relative to the current waypoint. */
const withStatuses = (waypoints: Array<JourneyWaypoint>, currentIndex: number): Array<JourneyWaypoint> =>
    waypoints.map((waypoint, index) => ({
        ...waypoint,
        status: (index < currentIndex ? "done" : index === currentIndex ? "current" : "upcoming") as WaypointStatus,
    }))

/**
 * Build the LEARNING journey (module → lesson · challenge) from the outline: each
 * module is a waypoint whose lessons are children and challenges are side-quests.
 * The current waypoint owns the viewer's `nextContentTask` (else the first module
 * with an unread lesson). Href everything so nodes navigate straight into the reader.
 */
export const buildLearningJourney = (
    outline: MyCourseOutlinePayload,
    locale: Locale,
    displayId: string | undefined,
): Journey => {
    const base = learnBase(locale, displayId)
    const waypoints: Array<JourneyWaypoint> = outline.modules.map((module) => {
        const children: Array<JourneyChild> = module.lessons.map((lesson) => ({
            id: lesson.id,
            label: lesson.title,
            done: lesson.isRead,
            href: base ? base.module(module.id).content(lesson.id).build() : null,
        }))
        const quests: Array<JourneyChild> = module.lessons.flatMap((lesson) =>
            lesson.challenges.map((challenge) => ({
                id: challenge.id,
                label: challenge.title,
                done: challenge.completed,
                // a challenge opens its owning lesson (challenges tab lives there)
                href: base ? base.module(module.id).content(lesson.id).build() : null,
            })))
        const firstUndone = module.lessons.find((lesson) => !lesson.isRead) ?? module.lessons[0]
        return {
            id: module.id,
            title: module.title,
            status: "upcoming" as WaypointStatus,
            premium: module.isPremium,
            children,
            childrenDone: children.filter((child) => child.done).length,
            childrenTotal: children.length,
            quests,
            questsDone: quests.filter((quest) => quest.done).length,
            questsTotal: quests.length,
            href: firstUndone && base ? base.module(module.id).content(firstUndone.id).build() : null,
        }
    })

    const pointer = outline.nextContentTask
    let currentIndex = pointer ? outline.modules.findIndex((module) => moduleOwns(module, pointer)) : -1
    if (currentIndex < 0) {
        currentIndex = outline.modules.findIndex((module) => module.lessons.some((lesson) => !lesson.isRead))
    }
    if (currentIndex < 0) {
        currentIndex = Math.max(0, outline.modules.length - 1)
    }

    return {
        kind: "learning",
        waypoints: withStatuses(waypoints, currentIndex),
        currentIndex,
        resumeHref: resolveContentHref(pointer, outline.modules, locale, displayId),
        progressPercent: outline.progress.completionPercent,
    }
}

/**
 * Build the CAPSTONE journey (milestone → task) from the outline: each milestone is
 * a waypoint whose tasks are children (no side-quests). The current waypoint owns
 * the viewer's capstone `currentTask` (else the first milestone with an undone task).
 */
export const buildCapstoneJourney = (
    outline: MyCourseOutlinePayload,
    locale: Locale,
    displayId: string | undefined,
): Journey => {
    const base = learnBase(locale, displayId)
    const waypoints: Array<JourneyWaypoint> = outline.milestones.map((milestone) => {
        const children: Array<JourneyChild> = milestone.tasks.map((task) => ({
            id: task.id,
            label: task.title,
            done: task.completed,
            href: base ? base.personalProject(task.id).build() : null,
        }))
        const firstUndone = milestone.tasks.find((task) => !task.completed) ?? milestone.tasks[0]
        return {
            id: milestone.id,
            title: milestone.title,
            status: "upcoming" as WaypointStatus,
            premium: false,
            children,
            childrenDone: children.filter((child) => child.done).length,
            childrenTotal: children.length,
            quests: [],
            questsDone: 0,
            questsTotal: 0,
            href: firstUndone && base ? base.personalProject(firstUndone.id).build() : null,
        }
    })

    const pointer = outline.currentTask
    let currentIndex = pointer && pointer.kind === "milestoneTask" && pointer.milestoneId
        ? outline.milestones.findIndex((milestone) => milestone.id === pointer.milestoneId)
        : -1
    if (currentIndex < 0) {
        currentIndex = outline.milestones.findIndex((milestone) => milestone.tasks.some((task) => !task.completed))
    }
    if (currentIndex < 0) {
        currentIndex = Math.max(0, outline.milestones.length - 1)
    }

    const resumeHref = pointer && pointer.kind === "milestoneTask" && base
        ? base.personalProject(pointer.id).build()
        : (waypoints[currentIndex]?.href ?? null)

    // capstone progress = tasks ratio (the outline's overall % also folds in content)
    const done = outline.progress.tasksCompleted
    const total = outline.progress.tasksTotal
    return {
        kind: "capstone",
        waypoints: withStatuses(waypoints, currentIndex),
        currentIndex,
        resumeHref,
        progressPercent: total > 0 ? Math.round((done / total) * 100) : 0,
    }
}
