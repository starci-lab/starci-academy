import type { GraphQLResponse, QueryVariables } from "../../types"
import type { CvGenerationStatus } from "@/modules/types/enums/cv-generation-status"

/** Whether a CV generation run builds a new CV or revises an existing submission. */
export enum CvGenerationMode {
    /** Build a brand-new CV from the learner's supplied prompts. */
    Generate = "generate",
    /** Revise an existing CV submission using the learner's supplied prompts. */
    Revise = "revise",
}

/** Origin of a CV (system-generated vs. user-uploaded). */
export enum CvSource {
    /** AI-built CV assembled from the learner's activity / free-text prompts. */
    Generated = "generated",
    /** Learner's own CV file uploaded into the platform. */
    Uploaded = "uploaded",
}

/** A single AI CV generation/revision row. */
export interface CvGenerationPayload {
    /** Primary identifier — `cv_generations.id`. */
    id: string
    /** Whether this run builds a new CV or revises an existing submission. */
    mode: CvGenerationMode
    /** Current lifecycle status. */
    status: CvGenerationStatus
    /** Origin of this CV (system-generated vs. user-uploaded). */
    source: CvSource
    /** Holistic CV score (0–100); null until the scoring step fills it. */
    score?: number | null
    /** User-facing name for this CV; null when unset (frontend falls back). */
    label?: string | null
    /** Id of the course this CV is tied to; null when untied. */
    courseId?: string | null
    /** Target role this CV is aimed at (free-text); null when unset. */
    targetRole?: string | null
    /** Language/locale this CV is written in (free-text); null when unset. */
    language?: string | null
    /** Source `cv_submissions.id` when `mode` is `Revise`; null otherwise. */
    sourceCvSubmissionId?: string | null
    /** Raw LaTeX (`.tex`) source once `status` is `Done`; null until ready/failed. */
    latexSource?: string | null
    /** Free-text context the learner supplied for this generation; null when none. */
    extraPrompts?: string | null
    /** Assembled CV JSON (header/summary/skills/experience/education); null until ready. */
    structuredData?: Record<string, unknown> | null
    /** Failure detail when `status` is `Failed`; null otherwise. */
    errorMessage?: string | null
    /** ISO 8601 timestamp when this generation finished processing; null until done. */
    processedAt?: string | null
    /** ISO 8601 timestamp when this generation was created (server UTC). */
    createdAt: string
}

/** GraphQL `CvGenerationRequest` body (fetch one generation by id). */
export interface CvGenerationRequest {
    /** `cv_generations.id` to fetch. */
    id: string
}

/** Apollo variables bag for the `cvGeneration` query. */
export type QueryCvGenerationVariables = QueryVariables<CvGenerationRequest>

/** Apollo response shape for the `cvGeneration` query. */
export interface QueryCvGenerationResponse {
    /** Top-level `cvGeneration` field wrapping the standard API response; null when not found. */
    cvGeneration: GraphQLResponse<CvGenerationPayload | null>
}

/** GraphQL `MyCvGenerationsRequest` body — pagination for the caller's runs. */
export interface MyCvGenerationsListRequest {
    /** Max rows to return (clamped server-side). */
    limit?: number
    /** Rows to skip before the page (defaults to 0). */
    offset?: number
}

/** Apollo response shape for the `myCvGenerations` query (flat array, newest first). */
export interface QueryMyCvGenerationsResponse {
    /** Top-level `myCvGenerations` field wrapping the standard API response. */
    myCvGenerations: GraphQLResponse<Array<CvGenerationPayload>>
}
