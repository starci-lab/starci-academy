import type { AbstractEntity } from "./abstract"
import type { DayOfWeek } from "../enums"
import type { LivestreamSessionTranslationEntity } from "./livestream-session-translation"

/**
 * Minimal course fields returned with a livestream session list item.
 */
export interface LivestreamSessionCourseRef {
    id: string
    /** Present when API loads `course` relation (Nest `defaultLocale`). */
    defaultLocale?: string
}

/**
 * Recurring weekly livestream slot for a course (calendar template).
 *
 * Mirrors Nest `LivestreamSessionEntity` / `livestream_sessions`.
 */
export interface LivestreamSessionEntity extends AbstractEntity {
    /** Parent course id (`RelationId` / GraphQL). */
    courseId: string
    dayOfWeek: DayOfWeek
    /** Wall-clock start (`HH:mm:ss`). */
    startTime: string
    /** Wall-clock expected end (`HH:mm:ss`). */
    expectedEndTime: string
    note: string | null
    /**
     * When true, UI may hide this row (superseded / overridable slot); backend may still return it.
     */
    isOverridable?: boolean
    orderIndex: number
    course?: LivestreamSessionCourseRef
    translations?: Array<LivestreamSessionTranslationEntity>
}
