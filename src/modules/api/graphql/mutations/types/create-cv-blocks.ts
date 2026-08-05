import type { GraphQLResponse } from "../../types"
import type { CvBlocksDocumentPayload } from "../../queries/types/cv-blocks"
import type { CvBlock, CvStyle } from "@/modules/types/entities/cv"

/** GraphQL `CreateCvBlocksRequest` body — a fresh CvGalleryPage document (all fields optional, defaulted server-side). */
export interface CreateCvBlocksRequest {
    /** User-facing name for the new CvGalleryPage; server defaults when omitted. */
    label?: string
    /** Initial ordered blocks; server defaults to an empty/starter set when omitted. */
    blocks?: Array<CvBlock>
    /** Initial `{font, accent}`; server defaults when omitted. */
    style?: CvStyle
}

/** Apollo response shape for the `createCvBlocks` mutation. */
export interface MutateCreateCvBlocksResponse {
    /** Top-level `createCvBlocks` field wrapping the standard API response. */
    createCvBlocks: GraphQLResponse<CvBlocksDocumentPayload>
}
