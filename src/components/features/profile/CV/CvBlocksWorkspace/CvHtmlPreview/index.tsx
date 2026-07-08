"use client"

import React from "react"
import { ScrollShadow, cn } from "@heroui/react"
import type { WithClassNames } from "@/modules/types/base/class-name"
import type { CvDocument } from "../../types"
import { CvHtmlDocument } from "../CvHtmlDocument"

/** Props for {@link CvHtmlPreview}. */
export interface CvHtmlPreviewProps extends WithClassNames<undefined> {
    /** The CV document to preview (the live draft). */
    doc: CvDocument
}

/**
 * Right pane of the split-pane block editor — the INSTANT live preview. Renders
 * the shared {@link CvHtmlDocument} template directly (client-side, no server
 * round-trip, no `react-pdf`), so it updates the moment a block changes
 * (`CV-BUILDER-BLOCK-EDITOR-BRAINSTORM.md`, "PIVOT: RENDER = HTML-FIRST"). The
 * same template's serialized HTML is what the PDF/Word export sends to the
 * backend converter, so preview and export never drift.
 *
 * Presented as a "paper" surface (white card on the page) inside a scrollable
 * frame roughly A4-proportioned.
 *
 * @param props - {@link CvHtmlPreviewProps}
 */
export const CvHtmlPreview = ({ className, doc }: CvHtmlPreviewProps) => {
    return (
        <ScrollShadow
            hideScrollBar
            className={cn("h-[420px] lg:h-full", className)}
        >
            <div className="mx-auto max-w-[820px] overflow-hidden rounded-3xl bg-white shadow-surface">
                <CvHtmlDocument doc={doc} />
            </div>
        </ScrollShadow>
    )
}
