import type { GraphQLResponse } from "../../types"
import type { CvExportFormat } from "@/modules/types/enums/cv-export-format"

/** GraphQL `RenderCvBlocksRequest` body (full-LaTeX: `.tex` → tectonic → PDF). */
export interface RenderCvBlocksRequest {
    /** `cv_blocks.id` to export (ownership scope + PDF/.tex persistence). */
    id: string
    /** The CV's LaTeX (`.tex`) source — compiled server-side via tectonic. */
    tex: string
    /** Target file format — PDF only now (kept for API compatibility). */
    format?: CvExportFormat
}

/** Payload inside `renderCvBlocks.data` after the standard API wrapper. */
export interface RenderCvBlocksResponseData {
    /** Presigned GET URL for the exported file (open/download immediately). */
    url: string
    /** MinIO/CDN key of the exported file. */
    cdnKey: string
    /** The format that was produced. */
    format: CvExportFormat
}

/** Apollo response shape for the `renderCvBlocks` mutation. */
export interface MutateRenderCvBlocksResponse {
    /** Top-level `renderCvBlocks` field wrapping the standard API response. */
    renderCvBlocks: GraphQLResponse<RenderCvBlocksResponseData>
}
