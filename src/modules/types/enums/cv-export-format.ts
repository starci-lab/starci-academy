/**
 * The file format a CV document is exported to. Both are produced server-side
 * from the SAME HTML the block editor renders for its live preview (HTML-first,
 * single-source) — PDF via Puppeteer, DOCX via html-to-docx. Values mirror the
 * backend `CvExportFormat` GraphQL enum.
 */
export enum CvExportFormat {
    /** A print-quality PDF. */
    Pdf = "pdf",
    /** An editable Word document. */
    Docx = "docx",
}
