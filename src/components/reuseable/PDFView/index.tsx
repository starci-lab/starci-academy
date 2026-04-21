"use client"

import React, { useMemo, useState } from "react"
import { Document, Page, pdfjs } from "react-pdf"

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

export interface PDFViewProps {
    /** Source URL of the PDF file to preview. */
    src: string
    /** Accessible title for the iframe viewer. */
    title: string
    /** Optional custom height class for wrapper. */
    heightClassName?: string
    /** Optional page width for PDF rendering. */
    pageWidth?: number
}

/**
 * Reusable PDF preview viewer with react-pdf.
 * @param {PDFViewProps} props PDF preview configuration.
 */
export const PDFView = ({
    src,
    title,
    heightClassName = "h-[560px]",
    pageWidth = 840,
}: PDFViewProps) => {
    const file = useMemo(() => (src ? src : undefined), [src])
    const [numPages, setNumPages] = useState(0)

    return (
        <div className={`${heightClassName} overflow-auto rounded-3xl bg-surface p-3 scrollbar-thin scrollbar-thumb-accent scrollbar-track-surface-secondary border border-divider`}>
            {file ? (
                <Document
                    file={file}
                    loading={<div className="text-sm text-foreground-500">{title}</div>}
                    error={<div className="text-sm text-danger">Failed to render PDF.</div>}
                    noData={<div className="text-sm text-foreground-500">No PDF selected.</div>}
                    onLoadSuccess={(pdf) => setNumPages(pdf.numPages)}
                >
                    <div className="flex flex-col gap-3">
                        {Array.from({ length: numPages }, (_, index) => (
                            <Page
                                key={`pdf-page-${index + 1}`}
                                pageNumber={index + 1}
                                width={pageWidth}
                                renderTextLayer={false}
                                renderAnnotationLayer={false}
                            />
                        ))}
                    </div>
                </Document>
            ) : (
                <div className="text-sm text-foreground-500">No PDF selected.</div>
            )}
        </div>
    )
}
