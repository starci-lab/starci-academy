import type { GraphQLResponse } from "../../types"
import type { CvBlock } from "@/components/features/profile/CV/types"

/** GraphQL `SplitCvFromTextRequest` body. */
export interface SplitCvFromTextRequest {
    /** Raw pasted CV text (from an existing résumé) to parse into blocks. */
    text: string
}

/** Payload inside `splitCvFromText.data` after the standard API wrapper. */
export interface SplitCvFromTextResponseData {
    /** AI-parsed blocks — NOT persisted; the caller loads these straight into the editor. */
    blocks: Array<CvBlock>
}

/** Apollo response shape for the `splitCvFromText` mutation. */
export interface MutateSplitCvFromTextResponse {
    /** Top-level `splitCvFromText` field wrapping the standard API response. */
    splitCvFromText: GraphQLResponse<SplitCvFromTextResponseData>
}
