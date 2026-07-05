import type { GraphQLResponse } from "../../types"
import type { CvBlocksDocumentPayload } from "../../queries/types/cv-blocks"
import type { CvBlock, CvStyle } from "@/components/features/profile/CV/types"

/** GraphQL `UpdateCvBlocksRequest` body — partial update (autosave), all fields but `id` optional. */
export interface UpdateCvBlocksRequest {
    /** `cv_blocks.id` to update. */
    id: string
    /** New name for this CV; omit to leave unchanged. */
    label?: string
    /** New ordered blocks; omit to leave unchanged. */
    blocks?: Array<CvBlock>
    /** New `{font, accent}`; omit to leave unchanged. */
    style?: CvStyle
}

/** Apollo response shape for the `updateCvBlocks` mutation. */
export interface MutateUpdateCvBlocksResponse {
    /** Top-level `updateCvBlocks` field wrapping the standard API response. */
    updateCvBlocks: GraphQLResponse<CvBlocksDocumentPayload>
}
