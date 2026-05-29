"use client"

import React from "react"
import {
    ScrollShadow,
} from "@heroui/react"
import type {
    AttemptRow,
} from "../types"
import {
    CVCard,
} from "./CVCard"

/** Props for {@link AttemptsList}. */
export interface AttemptsListProps {
    /** Display-ready attempt rows to render. */
    rows: Array<AttemptRow>
    /** Fired with an attempt id when its analysis modal is requested. */
    onOpenAnalysis: (attemptId: string) => void
}

/**
 * Scrollable list of CV attempt cards.
 *
 * Presentational: maps rows → {@link CVCard}, no logic.
 * @param props - {@link AttemptsListProps}
 */
export const AttemptsList = ({
    rows,
    onOpenAnalysis,
}: AttemptsListProps) => {
    return (
        <ScrollShadow
            className="min-h-0 flex-1 overflow-x-hidden p-3"
            hideScrollBar
        >
            <div className="flex flex-col gap-3">
                {rows.map((row) => (
                    <CVCard
                        key={row.key}
                        attemptId={row.key}
                        attemptNumber={row.attemptNumber}
                        fileLabel={row.fileLabel}
                        fileUrl={row.fileUrl}
                        fileUrlIsPublic={row.fileUrlIsPublic}
                        submittedAtLabel={row.submittedAtLabel}
                        status={row.status}
                        feedbackPreview={row.feedbackPreview}
                        onOpenAnalysis={onOpenAnalysis}
                    />
                ))}
            </div>
        </ScrollShadow>
    )
}
