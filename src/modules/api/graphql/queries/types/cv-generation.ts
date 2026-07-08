import type { GraphQLResponse, QueryVariables } from "../../types"
import type { CvGenerationStatus } from "@/modules/types/enums/cv-generation-status"
import type { SubmissionFeedbackSeverity } from "@/modules/types/enums/submission-feedback-severity"

/**
 * One CV scoring observation (a strength or a gap), with an optional fix
 * suggestion. Mirrors the BE's `CvFeedbackItem` GraphQL type.
 */
export interface CvFeedbackItem {
    /** Severity of this observation. */
    severity: SubmissionFeedbackSeverity
    /** The rubric section this item relates to (e.g. "impact", "clarity"). */
    section: string
    /** Human-readable explanation of the strength or gap. */
    message: string
    /** A concrete suggestion to address this observation, when the model gave one. */
    suggestion: string | null
}

/**
 * Structured CV scoring feedback (`cv_generations.feedback`, parsed server-side) —
 * a one-line summary plus the per-observation breakdown.
 */
export interface CvFeedback {
    /** One-line summary of the CV's overall quality. */
    shortFeedback: string
    /** The rubric level this CV was graded against (junior | mid | senior). */
    templateLevel: string
    /** Per-observation feedback items (strengths + gaps). */
    items: Array<CvFeedbackItem>
}

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
    /** Title of the course this CV is tied to; null when untied. */
    courseTitle?: string | null
    /** Target role this CV is aimed at (free-text); null when unset. */
    targetRole?: string | null
    /** Language/locale this CV is written in (free-text); null when unset. */
    language?: string | null
    /** Structured scoring feedback (parsed server-side); null until scored. */
    feedback?: CvFeedback | null
    /** Source `cv_submissions.id` when `mode` is `Revise`; null otherwise. */
    sourceCvSubmissionId?: string | null
    /** Raw LaTeX (`.tex`) source once `status` is `Done`; null until ready/failed. */
    latexSource?: string | null
    /** Presigned GET URL for the uploaded file (source = uploaded); null for generated CVs or a missing object. */
    uploadedCvUrl?: string | null
    /** Presigned GET URL for the PDF compiled server-side (tectonic) from the generated .tex (source = generated); null until compiled, on a failed compile, or for uploaded CVs. */
    generatedPdfUrl?: string | null
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

/**
 * One row of the caller's CV generation history — a lightweight projection
 * (no `structuredData`/`latexSource`/`uploadedCvUrl`, which are resolved
 * on-demand via the `cvGeneration(id)` query for the row actually opened).
 */
export interface CvGenerationListItem {
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
    /** Title of the course this CV is tied to; null when untied. */
    courseTitle?: string | null
    /** Target role this CV is aimed at (free-text); null when unset. */
    targetRole?: string | null
    /** Language/locale this CV is written in (free-text); null when unset. */
    language?: string | null
    /** Failure detail when `status` is `Failed`; null otherwise. */
    errorMessage?: string | null
    /** ISO 8601 timestamp when this generation finished processing; null until done. */
    processedAt?: string | null
    /** ISO 8601 timestamp when this generation was created (server UTC). */
    createdAt: string
}

/** Apollo response shape for the `myCvGenerations` query (flat array, newest first). */
export interface QueryMyCvGenerationsResponse {
    /** Top-level `myCvGenerations` field wrapping the standard API response. */
    myCvGenerations: GraphQLResponse<Array<CvGenerationListItem>>
}
