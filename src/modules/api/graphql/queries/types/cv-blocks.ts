import type { GraphQLResponse } from "../../types"
import type { CvBlock, CvStyle } from "@/components/features/profile/CV/types"

/**
 * One CV block-editor document (`cv_blocks` row) — mirrors the BE
 * `CvBlocksDocument` GraphQL type. `blocks`/`style` are JSON scalars; Apollo
 * hands them back already parsed into plain JS values, so the FE casts
 * straight to {@link CvBlock}/{@link CvStyle} (the FE-owned shapes — see
 * `components/features/profile/CV/types.ts`) with no `JSON.parse` step.
 */
export interface CvBlocksDocumentPayload {
    /** `cv_blocks.id`. */
    id: string
    /** User-facing name for this CV (document-tab label). */
    label: string
    /** Ordered blocks (JSON scalar). */
    blocks: Array<CvBlock>
    /** `{font, accent}` (JSON scalar). */
    style: CvStyle
    /** MinIO/CDN key of the last rendered PDF; null until `renderCvBlocks` has run once. */
    pdfCdnKey: string | null
    /** The CV's LaTeX (`.tex`) source — user-editable; null until the first compile. */
    texSource: string | null
    /** Whether this CV is the user's ONE public résumé (single-public-per-user). */
    isPublic: boolean
    /** ISO 8601 creation timestamp. */
    createdAt: string
    /** ISO 8601 last-update timestamp. */
    updatedAt: string
}

/** Apollo response shape for the `myCvBlocks` query (flat array, newest first). */
export interface QueryMyCvBlocksResponse {
    /** Top-level `myCvBlocks` field wrapping the standard API response. */
    myCvBlocks: GraphQLResponse<Array<CvBlocksDocumentPayload>>
}
