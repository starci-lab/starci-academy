import type { GraphQLResponse } from "../../types"
import type { CvBlock } from "@/components/features/profile/CV/types"
import type { ModelProvider } from "@/modules/api/graphql/queries/query-my-ai-settings"

/** GraphQL `RewriteCvBlockRequest` body. */
export interface RewriteCvBlockRequest {
    /** The block to rewrite (sent whole; the BE may target one item's prose within it). */
    block: CvBlock
    /**
     * `user_milestone_task_attempts.id` of the capstone this block's item is
     * `verified` against — when set, the rewrite is grounded (RAG) on the real
     * capstone data instead of only the block's own free text.
     */
    capstoneAttemptId?: string
    /** Optional free-text steering for the rewrite (e.g. "làm ngắn gọn hơn"). */
    instruction?: string
    /** Pinned model name, or omitted for the Auto lane. */
    selectedModel?: string | null
    /** Provider of the pinned model, or omitted for the Auto lane. */
    selectedModelProvider?: ModelProvider | null
}

/** Payload inside `rewriteCvBlock.data` after the standard API wrapper. */
export interface RewriteCvBlockResponseData {
    /** The same block, with its prose rewritten by the AI. */
    block: CvBlock
}

/** Apollo response shape for the `rewriteCvBlock` mutation. */
export interface MutateRewriteCvBlockResponse {
    /** Top-level `rewriteCvBlock` field wrapping the standard API response. */
    rewriteCvBlock: GraphQLResponse<RewriteCvBlockResponseData>
}
