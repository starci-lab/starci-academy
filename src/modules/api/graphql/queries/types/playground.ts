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
    /** Optional shell command shown as a copyable hint for this step (terminal-kind steps). */
    commandHint?: string | null
    /** Optional action to perform in the RAG widget for this step (rag-kind steps). */
    actionHint?: string | null
}

/** Interaction kind of a playground — drives the right-hand widget + the step-hint field. */
export type PlaygroundKind = "terminal" | "rag"

/** Full playground exercise detail, keyed by slug. */
export interface Playground {
    /** Stable id. */
    id: string
    /** URL slug. */
    slug: string
    /** Display title. */
    title: string
    /** Interaction kind — `terminal` (CLI agent + Terminal/Resources) or `rag` (import→ask→cite widget). */
    kind: PlaygroundKind
    /** Guided steps, in order. */
    steps: Array<PlaygroundStep>
}

/** Apollo response shape for `playground`. */
export interface QueryPlaygroundResponse {
    /** Top-level `playground` field wrapping the standard API response. */
    playground: GraphQLResponse<Playground>
}

/**
 * A session the learner can RESUME for this playground — returned by
 * `myOpenPlaygroundSession`, or `null` when there is nothing to resume.
 *
 * Exists so reloading Setup stops minting a fresh session (and pairing code)
 * every time, which used to orphan the agent already running in the terminal.
 */
export interface MyOpenPlaygroundSession {
    /** `playground_sessions.id` to re-subscribe to. */
    id: string
    /** The pairing code already shown for this session. */
    pairingCode: string
    /** When that code stops being accepted (ISO-8601, server-derived). */
    pairingCodeExpiresAt: string
    /** Whether an agent is currently paired to it. */
    connected: boolean
}

/** Request for `myOpenPlaygroundSession`. */
export interface MyOpenPlaygroundSessionRequest {
    /** Playground whose open session to look up. */
    playgroundId: string
}

/** Apollo response shape for `myOpenPlaygroundSession`. */
export interface QueryMyOpenPlaygroundSessionResponse {
    /** Top-level field wrapping the standard API response; `data` is null when nothing is resumable. */
    myOpenPlaygroundSession: GraphQLResponse<MyOpenPlaygroundSession | null>
}
