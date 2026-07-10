import { pathConfig } from "@/resources/path"
import type { Locale } from "next-intl"
import type { SearchCourseContentItem } from "@/modules/api/graphql/queries/types/search-course-content"

/**
 * Resolve a `searchCourseContent` hit to its real destination URL, branching
 * on `kind` — mirrors `ContentAiChat`'s `onSelectSearchResult` (the original
 * call-site for this exact routing logic, now shared so every "related
 * content" surface stays in sync with a single source of truth).
 *
 * @param item - The matched result.
 * @param locale - Active locale.
 * @param courseDisplayId - The owning course's `displayId` (slug), NOT its UUID.
 * @returns The destination URL, or null when the item lacks the ids its kind needs.
 */
export const resolveSearchResultHref = (
    item: SearchCourseContentItem,
    locale: Locale,
    courseDisplayId: string,
): string | null => {
    const learn = pathConfig().locale(locale).course(courseDisplayId).learn()
    if (item.kind === "flashcard" && item.deckId) {
        return learn.flashcards().review(item.deckId).build()
    }
    if (item.kind === "milestone" && item.taskId) {
        return learn.personalProject(item.taskId).build()
    }
    if (item.moduleId && item.contentId) {
        return learn.module(item.moduleId).content(item.contentId).build()
    }
    return null
}
