import type { GraphQLResponse } from "../../types"
import type { CvExportFormat } from "@/modules/types/enums/cv-export-format"

/** GraphQL `RenderCvBlocksRequest` body (HTML-first export). */
export interface RenderCvBlocksRequest {
    /** `cv_blocks.id` to export (ownership scope + PDF key persistence). */
    id: string
    /** Self-contained HTML of the rendered CV template (converted server-side). */
    html: string
    /** Target file format (PDF or DOCX). */
    format: CvExportFormat
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
