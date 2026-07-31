"use client"

import React, {
    useDeferredValue,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from "react"
import { Document, Page, pdfjs } from "react-pdf"
import { cn, Skeleton as HeroSkeleton } from "@heroui/react"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STORYBOOK-LOCAL DESIGN SPEC — faithful port of
 * `@/components/blocks/rendering/PDFView` (+ its colocated `PdfViewportPage` and
 * `constants`, inlined here as sibling helpers). Authored in Storybook (not
 * `src`); synced back to `src` later.
 *
 * NOTE: like the real component, the pdf.js worker is loaded from the unpkg CDN
 * (below) and each rendered page needs a reachable PDF file — so the actual
 * canvas rendering requires NETWORK access in Storybook. The `Empty` story
 * (`src=""`) renders fully offline; the file-backed stories use a tiny inline
 * data-URI PDF and only paint when the worker CDN is reachable.
 * ─────────────────────────────────────────────────────────────────────────────
 */

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

/** Fallback aspect ratio (height / width) for a page placeholder before its canvas mounts (A4-ish). */
const PAGE_ASPECT_FALLBACK = 1.414

/** Debounce window (ms) before reacting to container resize observations. */
const RESIZE_DEBOUNCE_MS = 120

/** Props for {@link PdfViewportPage}. */
interface PdfViewportPageProps {
    /** 1-based page index. */
    pageNumber: number
    /** Scroll container ref used as the IntersectionObserver root. */
    scrollRootRef: React.RefObject<HTMLDivElement | null>
    /** Rendered page width (deferred during resize). */
    width: number
    /** When true, mount the canvas immediately (no IntersectionObserver). */
    eager: boolean
    /** Extra classes on the page wrapper. */
    className?: string
}

/**
 * Renders one PDF page once it nears the viewport to avoid painting every page at once.
 *
 * Presentational: uses only UI-local hooks (`useState`/`useRef`/`useEffect`) to lazily
 * mount the page canvas via an IntersectionObserver.
 * @param props - {@link PdfViewportPageProps}
 */
const PdfViewportPage = (props: PdfViewportPageProps) => {
    const {
        pageNumber,
        scrollRootRef,
        width,
        eager,
        className,
    } = props
    const wrapRef = useRef<HTMLDivElement | null>(null)
    const [showCanvas, setShowCanvas] = useState(eager)
    const placeholderMinH = Math.max(
        160,
        Math.round(width * PAGE_ASPECT_FALLBACK),
    )

    useEffect(() => {
        if (eager) {
            setShowCanvas(true)
            return
        }
        if (showCanvas) {
            return
        }
        const el = wrapRef.current
        if (!el) {
            return
        }
        const root = scrollRootRef.current ?? undefined
        const io = new IntersectionObserver(
            (entries) => {
                const entry = entries[0]
                if (entry?.isIntersecting) {
                    setShowCanvas(true)
                }
            },
            {
                root,
                rootMargin: "100% 0px 120% 0px",
                threshold: 0.01,
            },
        )
        io.observe(el)
        return () => io.disconnect()
    }, [
        eager,
        scrollRootRef,
        showCanvas,
        pageNumber,
    ])

    return (
        <div
            ref={wrapRef}
            className={cn("flex justify-center", className)}
        >
            {
                showCanvas ? (
                    <Page
                        pageNumber={pageNumber}
                        width={width}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                    />
                ) : (
                    <div
                        className="w-full max-w-full"
                        style={{ minHeight: placeholderMinH }}
                        aria-hidden
                    >
                        <HeroSkeleton className="size-full rounded-medium" />
                    </div>
                )
            }
        </div>
    )
}

interface PDFViewOwnProps {
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
    /**
     * `true` → shimmer the WHOLE viewer footprint, no `Document` mounted at
     * all — the per-page `HeroSkeleton` mirror above only covers a page not
     * yet scrolled into view, not "the file itself hasn't arrived yet".
     */
    isSkeleton?: boolean
    /** Extra classes on the wrapper. */
    className?: string
    /** Where this sits inside its parent, from the closed positioning union. */
    classNames?: Array<AllowedClassName>
    /** Anatomy tag: names the ROOT part so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
    /** `true` → tag the whole-file skeleton with `data-anat-part="Skeleton"`. */
    showAnatomy?: boolean
}

/**
 * Props for {@link PDFView}. `src`/`title` are REQUIRED unless `isSkeleton`
 * (§12b) — a shimmer viewer has no real file to preview yet.
 */
export type PDFViewProps = PDFViewOwnProps &
    (
        | { isSkeleton: true; src?: string; title?: string }
        | {
            isSkeleton?: false
            /** Source URL of the PDF file to preview. */
            src: string
            /** Accessible title for the iframe viewer. */
            title: string
        }
    )

/**
 * Reusable PDF preview viewer built on react-pdf.
 *
 * Presentational: uses only UI-local hooks (refs, resize/layout effects, deferred width)
 * to size pages to the container; no business logic. Marked `"use client"` for the DOM
 * observers and react-pdf canvas rendering.
 * @param props - {@link PDFViewProps}
 */
export const PDFView = ({
    src,
    title,
    heightClassName = "h-[560px]",
    pageWidth = 840,
    showAllPages = true,
    allowVerticalScroll = false,
    fitToContainer = false,
    isSkeleton = false,
    className,
    classNames,
    anatPart,
    showAnatomy = false,
}: PDFViewProps) => {
    const file = useMemo(() => (src ? src : undefined), [src])
    const [numPages, setNumPages] = useState(0)
    const containerRef = useRef<HTMLDivElement | null>(null)
    const scrollRootRef = useRef<HTMLDivElement | null>(null)
    const [containerWidth, setContainerWidth] = useState(0)
    const computedPageWidth = fitToContainer && containerWidth > 0
        ? Math.max(320, Math.floor(containerWidth) - 24)
        : pageWidth
    const deferredPageWidth = useDeferredValue(computedPageWidth)
    const renderWidth = deferredPageWidth > 0 ? deferredPageWidth : computedPageWidth

    const assignContainerRef = (node: HTMLDivElement | null) => {
        containerRef.current = node
        scrollRootRef.current = node
    }

    useLayoutEffect(() => {
        if (!fitToContainer) {
            return
        }
        const el = containerRef.current
        if (!el) {
            return
        }
        const w = Math.floor(el.getBoundingClientRect().width)
        if (w > 0) {
            setContainerWidth(w)
        }
    }, [
        fitToContainer,
        src,
        heightClassName,
    ])

    useEffect(() => {
        if (!fitToContainer) {
            return
        }
        const element = containerRef.current
        if (!element) {
            return
        }
        let timeoutId: NodeJS.Timeout | undefined
        const observer = new ResizeObserver((entries) => {
            const nextWidth = Math.floor(entries[0]?.contentRect.width ?? 0)
            clearTimeout(timeoutId)
            timeoutId = setTimeout(
                () => {
                    setContainerWidth(nextWidth)
                }, RESIZE_DEBOUNCE_MS
            )
        })
        observer.observe(element)
        return () => {
            clearTimeout(timeoutId)
            observer.disconnect()
        }
    }, [
        fitToContainer,
        src,
    ])

    const pageCount = showAllPages ? numPages : Math.min(1, numPages)

    // Checked AFTER every hook above has run (rules of hooks) — the whole file hasn't
    // arrived yet, distinct from the per-page mirror `PdfViewportPage` already draws
    // for a page that just hasn't scrolled into view.
    if (isSkeleton) {
        return (
            <HeroSkeleton
                className={cn(heightClassName, "w-full rounded-medium", className, classNames)}
                data-anat-part={anatPart ?? (showAnatomy ? "Skeleton" : undefined)}
            />
        )
    }

    return (
        <div
            ref={assignContainerRef}
            className={cn(
                heightClassName,
                "overflow-x-auto bg-surface scrollbar-thin scrollbar-thumb-accent scrollbar-track-surface-secondary",
                allowVerticalScroll ? "overflow-y-auto" : "overflow-y-hidden",
                className,
                classNames,
            )}
            data-anat-part={anatPart}
        >
            {file ? (
                <Document
                    key={src}
                    file={file}
                    loading={<div className="text-sm text-muted">{title}</div>}
                    error={<div className="text-sm text-danger-soft-foreground">Failed to render PDF.</div>}
                    noData={<div className="text-sm text-muted">No PDF selected.</div>}
                    onLoadSuccess={(pdf) => setNumPages(pdf.numPages)}
                >
                    <StackV
                        gap="grouped"
                        body={Array.from({ length: pageCount }, (_, index) => {
                            const pageNumber = index + 1
                            const eager = !showAllPages || pageNumber <= 2
                            return (
                                <PdfViewportPage
                                    key={`pdf-page-${pageNumber}-${src}`}
                                    eager={eager}
                                    pageNumber={pageNumber}
                                    scrollRootRef={scrollRootRef}
                                    width={renderWidth}
                                />
                            )
                        })}
                    />
                </Document>
            ) : (
                <div className="text-sm text-muted">No PDF selected.</div>
            )}
        </div>
    )
}
