import type { Meta, StoryObj } from "@storybook/nextjs"
import { PDFView } from "@sb-components/composites/viewers/PDFView/PDFView"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta<typeof PDFView> = {
    title: "Composites/Viewers/PDFView",
    component: PDFView,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof PDFView>

/**
 * A tiny, valid single-page PDF encoded as a data URI — an INLINE sample so the
 * file-backed stories have something real to load without a live storage URL.
 * NOTE: pdf.js still fetches its worker from the unpkg CDN (see PDFView.tsx), so
 * these canvas-rendering stories only paint when Storybook has network access.
 */
const SAMPLE_PDF = "data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iago8PCAvVHlwZSAvQ2F0YWxvZyAvUGFnZXMgMiAwIFIgPj4KZW5kb2JqCjIgMCBvYmoKPDwgL1R5cGUgL1BhZ2VzIC9LaWRzIFszIDAgUl0gL0NvdW50IDEgPj4KZW5kb2JqCjMgMCBvYmoKPDwgL1R5cGUgL1BhZ2UgL1BhcmVudCAyIDAgUiAvTWVkaWFCb3ggWzAgMCA2MTIgNzkyXSAvUmVzb3VyY2VzIDw8IC9Gb250IDw8IC9GMSA0IDAgUiA+PiA+PiAvQ29udGVudHMgNSAwIFIgPj4KZW5kb2JqCjQgMCBvYmoKPDwgL1R5cGUgL0ZvbnQgL1N1YnR5cGUgL1R5cGUxIC9CYXNlRm9udCAvSGVsdmV0aWNhID4+CmVuZG9iago1IDAgb2JqCjw8IC9MZW5ndGggNTIgPj4Kc3RyZWFtCkJUIC9GMSAyNCBUZiA3MiA3MDAgVGQgKFN0YXJDaSBQREZWaWV3IHNhbXBsZSkgVGogRVQKZW5kc3RyZWFtCmVuZG9iagp4cmVmCjAgNgowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMDkgMDAwMDAgbiAKMDAwMDAwMDA1OCAwMDAwMCBuIAowMDAwMDAwMTE1IDAwMDAwIG4gCjAwMDAwMDAyNDEgMDAwMDAgbiAKMDAwMDAwMDMxMSAwMDAwMCBuIAp0cmFpbGVyCjw8IC9TaXplIDYgL1Jvb3QgMSAwIFIgPj4Kc3RhcnR4cmVmCjQxMwolJUVPRg=="

/**
 * Empty — `src=""` → the viewer shows "No PDF selected." instead of a blank frame.
 * This state renders fully OFFLINE (no worker / no file needed).
 */
export const Empty: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <div className="w-[420px]">
                <PDFView src="" title="No document yet" heightClassName="h-[200px]" />
            </div>
        </div>
    ),
}

/** Single page (`showAllPages=false`) — a quick preview / thumbnail of the first page. */
export const SinglePage: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <div className="w-[420px]">
                <PDFView
                    src={SAMPLE_PDF}
                    title="NestJS lecture slides"
                    showAllPages={false}
                    heightClassName="h-[320px]"


                />
            </div>
        </div>
    ),
}

/** All pages, vertical scroll — read a multi-page document inline. */
export const AllPagesScroll: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <div className="w-[420px]">
                <PDFView
                    src={SAMPLE_PDF}
                    title="System Design lecture slides"
                    allowVerticalScroll
                    heightClassName="h-[420px]"


                />
            </div>
        </div>
    ),
}

/** `fitToContainer` — the PDF re-measures the container width (responsive modal / drawer). */
export const FitToContainer: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <div className="w-full max-w-2xl">
                <PDFView
                    src={SAMPLE_PDF}
                    title="StarCi service agreement"
                    fitToContainer
                    allowVerticalScroll
                    heightClassName="h-[400px]"


                />
            </div>
        </div>
    ),
}

/** Error — `src` points at an unreachable file → react-pdf shows "Failed to render PDF." (needs the worker to reach the error path). */
export const LoadError: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <div className="w-[420px]">
                <PDFView
                    src="https://storage.example.invalid/file-not-found.pdf"
                    title="Document failed to load"
                    heightClassName="h-[200px]"


                />
            </div>
        </div>
    ),
}

const ANNOTATE_SKELETON: Record<string, AnatomyAnnotation> = {
    "PDFView": { tier: "composite", role: "the viewer itself: a bordered, scrollable canvas that lazily paints each page of the given PDF file", storyId: "composites-viewers-pdfview--single-page" },
    "Skeleton": { tier: "heroui", role: "shimmers the WHOLE viewer footprint because the file itself hasn't arrived yet — no `Document` mounted at all; distinct from `PdfViewportPage`'s own per-page `HeroSkeleton`, which only stands in for a page not yet scrolled into view once the file HAS loaded" },
}

/** LEAF — the caller flips `isSkeleton`; the whole viewer shimmers because the file itself hasn't arrived, distinct from the per-page mirror `PdfViewportPage` already draws for a page not yet scrolled into view once the file HAS loaded. */
export const Skeleton: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="PDFView"
                tier="composite"
                leaf="Prop `isSkeleton`"
                parts={[]}
                annotate={ANNOTATE_SKELETON}
                renderClassName="mx-auto max-w-2xl"
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "Covers 'the whole PDF file hasn't arrived yet' — no `Document` mounted, just one full-footprint `HeroSkeleton` sized by `heightClassName`. Distinct from the per-page shimmer `PdfViewportPage` draws once the file HAS loaded but a given page hasn't scrolled into view yet.",
                        code: "<PDFView isSkeleton />",
                        render: <PDFView isSkeleton />,
                    },
                ]}
            />
        </div>
    ),
}
