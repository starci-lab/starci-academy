"use client"

import React from "react"
/** Props for {@link ContentDetailError}. */
export interface ContentDetailErrorProps {
    /** Optional message from the failed query; falls back to a generic copy. */
    message?: string
}

/**
 * Error / not-found panel for the public content article.
 *
 * Presentational: renders the supplied message (or a fallback) plus a hint
 * that the content may be premium or removed. No logic.
 * @param props - optional error message to display
 */
export const ContentDetailError = ({
    message,
}: ContentDetailErrorProps) => {
    return (
        <div className="mx-auto max-w-4xl p-6">
            <div className="rounded-2xl border border-danger/30 bg-danger/5 p-6 text-center">
                <div className="text-lg font-semibold text-danger">
                    {message ?? "Content not found."}
                </div>
                <div className="mt-2 text-sm text-muted">
                    This content may be premium or no longer available.
                </div>
            </div>
        </div>
    )
}
