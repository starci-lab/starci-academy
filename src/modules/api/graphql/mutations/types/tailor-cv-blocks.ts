import type { GraphQLResponse } from "../../types"
import type { CvBlock } from "@/components/features/profile/CV/types"
import type { ModelProvider } from "@/modules/api/graphql/queries/query-my-ai-settings"

/** GraphQL `TailorCvBlocksRequest` body. */
export interface TailorCvBlocksRequest {
    /** The current CV blocks to adjust toward the job description. */
    blocks: Array<CvBlock>
    /** The job description/posting text to tailor the CV toward. */
    jobDescription: string
    /** Pinned model name, or omitted for the Auto lane. */
    selectedModel?: string | null
    /** Provider of the pinned model, or omitted for the Auto lane. */
    selectedModelProvider?: ModelProvider | null
}

/** Payload inside `tailorCvBlocks.data` after the standard API wrapper. */
export interface TailorCvBlocksResponseData {
    /** The same blocks (same `id`/`type`), wording adjusted/reordered toward the job description. */
    blocks: Array<CvBlock>
}

/** Apollo response shape for the `tailorCvBlocks` mutation. */
export interface MutateTailorCvBlocksResponse {
    /** Top-level `tailorCvBlocks` field wrapping the standard API response. */
    tailorCvBlocks: GraphQLResponse<TailorCvBlocksResponseData>
}
