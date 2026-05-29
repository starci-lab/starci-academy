import type { GraphQLResponse } from "../../types"

/** Discriminated union of entity type names supported by the global search index. */
export type SearchableEntity =
    | "CourseEntity"
    | "ModuleEntity"
    | "ContentEntity"
    | "LessonVideoEntity"
    | "ChallengeEntity"

/** One result item returned from the autocomplete global search endpoint. */
export interface AutocompleteGlobalSearchItem {
    /** Primary identifier of the entity. */
    id: string
    /** Short public identifier used in URLs (e.g. `course-001`). */
    displayId?: string
    /** Display title of the entity. */
    title?: string
    /** Array of additional matched text snippets. */
    texts?: Array<string>
}

/** Payload inside `autocompleteGlobalSearch.data` after the standard API wrapper. */
export interface AutocompleteGlobalSearchData {
    /** Matching course results. */
    courses?: Array<AutocompleteGlobalSearchItem>
    /** Matching module results. */
    modules?: Array<AutocompleteGlobalSearchItem>
    /** Matching challenge results. */
    challenges?: Array<AutocompleteGlobalSearchItem>
    /** Matching content results. */
    contents?: Array<AutocompleteGlobalSearchItem>
    /** Matching lesson video results. */
    lessonVideos?: Array<AutocompleteGlobalSearchItem>
}

/** Apollo variables for `autocompleteGlobalSearch(request: AutocompleteGlobalSearchRequest!)`. */
export interface QueryAutocompleteGlobalSearchRequest {
    /** Free-text search query string. */
    query: string
    /** Optional subset of entity types to search within; omit to search all. */
    entities?: Array<SearchableEntity>
    /** Maximum number of results to return per entity type. */
    size?: number
}

/** Apollo response shape for the `autocompleteGlobalSearch` query. */
export interface QueryAutocompleteGlobalSearchResponse {
    /** Top-level `autocompleteGlobalSearch` field wrapping the standard API response. */
    autocompleteGlobalSearch: GraphQLResponse<AutocompleteGlobalSearchData>
}
