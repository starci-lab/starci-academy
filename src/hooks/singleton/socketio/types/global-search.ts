import { SocketIoMessage } from "./ws-message"
import { SocketIoPayload } from "./ws-payload"

export type SearchableEntity = "CourseEntity" | "LessonVideoEntity" | "ChallengeEntity" | "ContentEntity" | "ModuleEntity"
/** Params for executing a global fuzzy search. */
export type GlobalSearchSocketIoPayload = SocketIoPayload<{
    /** The query to search for. */
    query: string
    /** The entities to search in. */
    entities: Array<SearchableEntity>
    /** The size of the results. */
    size: number
}>

/** Single search result item for a group (course/module/content/etc.). */
export interface GlobalSearchItem {
    /** The id of the item. */
    id: string
    /** The display id of the item. */
    displayId: string
    /** The texts of the item. */
    texts: Array<string>
    /** The title of the item (optional; UI may fall back to `texts[0]`). */
    title?: string
}
/** Response for a global fuzzy search. */
export type GlobalSearchSocketIoMessage = SocketIoMessage<{
    /** The courses of the search. */   
    courses: Array<GlobalSearchItem>
    /** The modules of the search. */
    modules: Array<GlobalSearchItem>
    /** The challenges of the search. */
    challenges: Array<GlobalSearchItem>
    /** The lessons of the search. */
    lessons: Array<GlobalSearchItem>
    /** The lesson videos of the search. */
    lessonVideos: Array<GlobalSearchItem>
    /** The contents of the search. */
    contents: Array<GlobalSearchItem>
}>