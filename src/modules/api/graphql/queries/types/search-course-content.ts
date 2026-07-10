import type { GraphQLResponse } from "../../types"

/** One distinct source matched by a course content search (mirrors backend `SearchCourseContentItem`). */
export interface SearchCourseContentItem {
    /** `"content"` | `"challenge"` | `"flashcard"` | `"milestone"` — which surface this result jumps to. */
    kind: string
    /** The matched source's title, resolved in the locale it was embedded in. */
    title: string
    /** Short context line above the title (module name / milestone name); null for flashcard decks. */
    breadcrumb: string | null
    /** The best-matching chunk's text (raw — truncate/escape before rendering). */
    snippet: string
    /** Cosine similarity of the best-matching chunk (0-1, higher = closer). */
    score: number
    /** kind=content/challenge: the module id the target content lives in. */
    moduleId: string | null
    /** kind=content/challenge: the content (lesson) id to jump to. */
    contentId: string | null
    /** kind=flashcard: the flashcard deck id to jump to. */
    deckId: string | null
    /** kind=milestone: the milestone task id to jump to. */
    taskId: string | null
}

/** Payload inside `searchCourseContent.data`. */
export interface SearchCourseContentData {
    /** Distinct matched sources, best match first. */
    results: Array<SearchCourseContentItem>
}

/** Apollo response for the `searchCourseContent` query. */
export interface QuerySearchCourseContentResponse {
    /** Top-level `searchCourseContent` field. */
    searchCourseContent: GraphQLResponse<SearchCourseContentData>
}
