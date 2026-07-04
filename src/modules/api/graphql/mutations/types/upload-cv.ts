import type { GraphQLResponse, QueryVariables } from "../../types"
import type { AiMode, ModelProvider } from "../../queries/query-my-ai-settings"

/**
 * GraphQL `UploadCvRequest` body: register a CV the user already PUT to storage
 * (via the presign flow) into the unified `cv_generations` table as
 * `source = uploaded`, then enqueue async scoring.
 */
export interface UploadCvRequest {
    /** Storage object key of the uploaded file — the `cdnKey` from `generateSubmitCvPresignUrl`. */
    cdnKey: string
    /** Optional user-facing name for this CV. */
    label?: string
    /** Optional course/track id to tie this CV to. */
    courseId?: string
    /** Optional target role this CV is aimed at (free-text). */
    targetRole?: string
    /** Optional language/locale for this CV (free-text, e.g. "en" / "vi"). */
    language?: string
    /** AI lane to score on (auto/premium); validated against entitlement at score time. */
    mode?: AiMode
    /** Concrete model the user picked for scoring; undefined = balancer default (Auto). */
    selectedModel?: string
    /** Provider serving {@link UploadCvRequest.selectedModel}. */
    selectedModelProvider?: ModelProvider
}

/** Payload inside `uploadCv.data` after the standard API wrapper. */
export interface UploadCvResponseData {
    /** `jobs.id` enqueued for scoring (poll `cvGeneration` until Done). */
    jobId: string
    /** `cv_generations.id` of the created (Pending, source=uploaded) row. */
    cvGenerationId: string
}

/** Apollo variables bag for the `uploadCv` mutation. */
export type MutateUploadCvVariables = QueryVariables<UploadCvRequest>

/** Apollo response shape for `uploadCv`. */
export interface MutateUploadCvResponse {
    /** Top-level `uploadCv` field wrapping the standard API response. */
    uploadCv: GraphQLResponse<UploadCvResponseData>
}
