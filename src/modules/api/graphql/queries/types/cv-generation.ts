import type { GraphQLResponse, QueryVariables, SortInput } from "../../types"
import type { CvGenerationStatus } from "@/modules/types/enums/cv-generation-status"

/** How the CV generation was produced. */
export enum CvGenerationKind {
    /** Generated from scratch off the learner's StarCi activity. */
    Generate = "Generate",
    /** Revised from an uploaded CV submission. */
    Revise = "Revise",
}

/** A single AI CV generation/revision row. */
export interface CvGenerationPayload {
    /** Primary identifier — `cv_generations.id`. */
    id: string
    /** Whether this row was generated from scratch or revised from an upload. */
    kind: CvGenerationKind
    /** Current lifecycle status. */
    status: CvGenerationStatus
    /** Raw LaTeX (`.tex`) source once `status` is `Done`; null until ready/failed. */
    latexSource?: string | null
    /** Free-text context the learner supplied for this generation; null when none. */
    extraPrompts?: string | null
    /** Failure detail when `status` is `Failed`; null otherwise. */
    error?: string | null
    /** Source `cv_submissions.id` when `kind` is `Revise`; null for `Generate`. */
    cvSubmissionId?: string | null
    /** ISO 8601 timestamp when this generation was created (server UTC). */
    createdAt: string
}

/** GraphQL `CvGenerationRequest` body (fetch one generation by id). */
export interface CvGenerationRequest {
    /** `cv_generations.id` to fetch. */
    cvGenerationId: string
}

/** Apollo variables bag for the `cvGeneration` query. */
export type QueryCvGenerationVariables = QueryVariables<CvGenerationRequest>

/** Apollo response shape for the `cvGeneration` query. */
export interface QueryCvGenerationResponse {
    /** Top-level `cvGeneration` field wrapping the standard API response; null when not found. */
    cvGeneration: GraphQLResponse<CvGenerationPayload | null>
}

/** Paginated payload inside `myCvGenerations.data`. */
export interface MyCvGenerationsDataPayload {
    /** Total number of generations for the current user. */
    totalCount: number
    /** Array of generation rows for the current page (newest first). */
    data: Array<CvGenerationPayload>
}

/** Pagination and sort filters for the `myCvGenerations` list. */
export interface MyCvGenerationsListFilters {
    /** 0-based page index (matches API). */
    pageNumber?: number
    /** Maximum number of rows to return per page. */
    limit?: number
    /** Sort clauses to apply to the generations list. */
    sorts?: Array<SortInput<string>>
}

/** Apollo variables for `myCvGenerations(request: MyCvGenerationsRequest)`. */
export interface MyCvGenerationsListRequest {
    /** Optional filters for the generations list; defaults to server defaults when omitted. */
    filters?: MyCvGenerationsListFilters
}

/** Apollo response shape for the `myCvGenerations` query. */
export interface QueryMyCvGenerationsResponse {
    /** Top-level `myCvGenerations` field wrapping the standard API response. */
    myCvGenerations: GraphQLResponse<MyCvGenerationsDataPayload>
}
