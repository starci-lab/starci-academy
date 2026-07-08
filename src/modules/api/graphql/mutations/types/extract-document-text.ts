import type { GraphQLResponse } from "../../types"

/** GraphQL `ExtractDocumentTextRequest` body. */
export interface ExtractDocumentTextRequest {
    /** Storage object key of the already-uploaded file (from the presign step). */
    cdnKey: string
}

/** Payload inside `extractDocumentText.data` after the standard API wrapper. */
export interface ExtractDocumentTextResponseData {
    /** Plain text extracted from the uploaded file — NOT persisted; the caller loads it into the paste field. */
    text: string
}

/** Apollo response shape for the `extractDocumentText` mutation. */
export interface MutateExtractDocumentTextResponse {
    /** Top-level `extractDocumentText` field wrapping the standard API response. */
    extractDocumentText: GraphQLResponse<ExtractDocumentTextResponseData>
}
