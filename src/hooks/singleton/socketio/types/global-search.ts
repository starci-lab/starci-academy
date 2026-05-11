/**
 * One hit row in the global search modal (grouped list UI).
 */
export interface GlobalSearchItem {
    /** Stable row id for React keys and selection. */
    id: string
    /** Primary heading line. */
    title?: string
    /** Secondary lines (may contain `<em>` for highlight). */
    texts?: Array<string>
    /** Fallback label when title is missing. */
    displayId?: string
}

/**
 * Entity kinds the global search API can return; must stay aligned with backend / GraphQL search.
 */
export type SearchableEntity =
    | "CourseEntity"
    | "ModuleEntity"
    | "ContentEntity"
    | "LessonVideoEntity"
    | "ChallengeEntity"

/**
 * Payload shape for global search subscription results (mirrors UI `GlobalSearchContent`).
 */
export interface GlobalSearchSocketIoMessage {
    /** Grouped hits returned from the search service. */
    data?: {
        courses?: Array<GlobalSearchItem>
        modules?: Array<GlobalSearchItem>
        challenges?: Array<GlobalSearchItem>
        contents?: Array<GlobalSearchItem>
        lessonVideos?: Array<GlobalSearchItem>
    }
}
