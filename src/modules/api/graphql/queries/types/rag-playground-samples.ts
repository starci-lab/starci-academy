import type { GraphQLResponse } from "../../types"

/** One selectable entry in the public RAG Playground's built-in sample catalog. */
export interface RagPlaygroundSample {
    /** Stable id — passed back as `sampleId` on the `indexRagPlayground` mutation. */
    id: string
    /** Human-readable label shown in the Sample-tab picker. */
    label: string
}

/** Apollo response shape for the public `ragPlaygroundSamples` query. */
export interface QueryRagPlaygroundSamplesResponse {
    /** Top-level `ragPlaygroundSamples` field wrapping the standard API response. */
    ragPlaygroundSamples: GraphQLResponse<Array<RagPlaygroundSample>>
}
