import type { GraphQLResponse } from "../../types"

/** Request body for the `playgrounds` query. */
export interface PlaygroundsRequest {
    /** Course to list Playground exercises for. */
    courseId: string
}

/** One playground summarised for the hub list (mirrors backend `PlaygroundSummary`). */
export interface PlaygroundSummary {
    /** Stable id. */
    id: string
    /** URL slug — the route segment under `.../learn/playground/<slug>`. */
    slug: string
    /** Display title. */
    title: string
    /** Icon key (mirrors the course-icon convention) picked by the block per exercise kind. */
    icon: string
    /** Number of guided steps in this exercise — shown on the card. */
    stepCount: number
}

/** Apollo response shape for `playgrounds`. */
export interface QueryPlaygroundsResponse {
    /** Top-level `playgrounds` field wrapping the standard API response. */
    playgrounds: GraphQLResponse<Array<PlaygroundSummary>>
}

/** Request body for the `playground` query. */
export interface PlaygroundRequest {
    /** The playground's URL slug. */
    slug: string
}

/** One guided step of a playground exercise. */
export interface PlaygroundStep {
    /** 0-based index, in walkthrough order (mirrors backend `PlaygroundStepEntity.sortIndex`). */
    sortIndex: number
    /** Step title. */
    title: string
    /** Step body — markdown, rendered via `MarkdownContent`. */
    body: string
    /** Optional shell command shown as a copyable hint for this step. */
    commandHint?: string | null
}

/** Full playground exercise detail, keyed by slug. */
export interface Playground {
    /** Stable id. */
    id: string
    /** URL slug. */
    slug: string
    /** Display title. */
    title: string
    /** Guided steps, in order. */
    steps: Array<PlaygroundStep>
}

/** Apollo response shape for `playground`. */
export interface QueryPlaygroundResponse {
    /** Top-level `playground` field wrapping the standard API response. */
    playground: GraphQLResponse<Playground>
}
