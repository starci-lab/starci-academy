"use client"

import { CheckCircleIcon } from "@phosphor-icons/react"
import React from "react"
import type {
    ProcessResult,
} from "../../types"
import { Box } from "@/components/frames/Box"

/** Props for {@link ProcessResultBanner}. */
export interface ProcessResultBannerProps {
    /** Process-video result to show, or null to render nothing. */
    processResult: ProcessResult | null
}

/**
 * Success banner shown after a process-video job is enqueued.
 *
 * Presentational: renders the message + job id, or nothing when null. "use
 * client" only to stay within the upload tool's client boundary.
 * @param props - the process result (or null)
 */
export const ProcessResultBanner = ({
    processResult,
}: ProcessResultBannerProps) => {
    if (!processResult) {
        return null
    }
    return (
        <Box identity={{ tier: "page", component: "ProcessResultBanner" }} principle="card-padding" className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-2"
            explain="Card body inset — not page-pad, because this is the surface padding of a card rather than the page chrome.">
            <Box principle="identity" className="flex items-center gap-2"
                explain="Keeps avatar and identity text as one peer unit so the person label stays beside the face.">
                <CheckCircleIcon className="h-5 w-5 text-emerald-400" />
                <span className="text-sm font-medium text-emerald-300">
                    {processResult.message}
                </span>
            </Box>
            <p className="text-xs text-slate-400 font-mono">
                Job ID: {processResult.jobId}
            </p>
        </Box>
    )
}
