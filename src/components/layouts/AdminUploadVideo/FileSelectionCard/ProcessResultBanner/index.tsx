"use client"

import { CircleCheck as CheckCircleIcon } from "@gravity-ui/icons"
import React from "react"
import type {

    ProcessResult,
} from "../../types"

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
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-1">
            <div className="flex items-center gap-2">
                <CheckCircleIcon className="h-4 w-4 text-emerald-400" />
                <span className="text-sm font-medium text-emerald-300">
                    {processResult.message}
                </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
                Job ID: {processResult.jobId}
            </p>
        </div>
    )
}
