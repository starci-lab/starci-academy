import type { GraphQLResponse } from "../../types"

/**
 * The one CV a user has flagged PUBLIC, as shown on their public profile
 * (`/profile/<username>/cv`). Read-only: only the compiled PDF is exposed, never
 * the editable blocks/`.tex`. `pdfUrl` is a presigned GET URL that is `null` when
 * the public CV was flagged but never compiled once (`renderCvBlocks` never ran).
 * The WHOLE `data` is `null` when the user has no public CV at all.
 */
export interface PublicUserCvPayload {
    /** `cv_blocks.id` of the public CV. */
    id: string
    /** User-facing name for this CV (document-tab label); null when unset. */
    label: string | null
    /** Presigned GET URL for the compiled PDF; null until the first compile. */
    pdfUrl: string | null
    /** ISO 8601 last-update timestamp. */
    updatedAt: string
}

/** Apollo response shape for the `publicUserCv` query (nullable data). */
export interface QueryPublicUserCvResponse {
    /** Top-level `publicUserCv` field wrapping the standard API response. */
    publicUserCv: GraphQLResponse<PublicUserCvPayload | null>
}
