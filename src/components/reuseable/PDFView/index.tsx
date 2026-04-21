"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
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
    /** Render all pages or only first page. */
    showAllPages?: boolean
    /** Allow vertical scroll in viewer container. */
    allowVerticalScroll?: boolean
    /** Auto fit rendered PDF width to container width. */
    fitToContainer?: boolean
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
    showAllPages = true,
    allowVerticalScroll = false,
    fitToContainer = false,
}: PDFViewProps) => {
    const file = useMemo(() => (src ? src : undefined), [src])
    const [numPages, setNumPages] = useState(0)
    const containerRef = useRef<HTMLDivElement | null>(null)
    const [containerWidth, setContainerWidth] = useState(0)
    const computedPageWidth = fitToContainer && containerWidth > 0
        ? Math.max(320, containerWidth - 24)
        : pageWidth

    useEffect(() => {
        if (!fitToContainer) return
        const element = containerRef.current
        if (!element) return
        const observer = new ResizeObserver((entries) => {
            const nextWidth = entries[0]?.contentRect.width ?? 0
            setContainerWidth(nextWidth)
        })
        observer.observe(element)
        return () => observer.disconnect()
    }, [fitToContainer])

    return (
        <div
            ref={containerRef}
            className={`${heightClassName} overflow-x-auto ${allowVerticalScroll ? "overflow-y-auto" : "overflow-y-hidden"} bg-surface scrollbar-thin scrollbar-thumb-accent scrollbar-track-surface-secondary`}
        >
            {file ? (
                <Document
                    file={file}
                    loading={<div className="text-sm text-foreground-500">{title}</div>}
                    error={<div className="text-sm text-danger">Failed to render PDF.</div>}
                    noData={<div className="text-sm text-foreground-500">No PDF selected.</div>}
                    onLoadSuccess={(pdf) => setNumPages(pdf.numPages)}
                >
                    <div className="flex flex-col gap-3">
                        {Array.from({ length: showAllPages ? numPages : Math.min(1, numPages) }, (_, index) => (
                            <Page
                                key={`pdf-page-${index + 1}`}
                                pageNumber={index + 1}
                                width={computedPageWidth}
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
