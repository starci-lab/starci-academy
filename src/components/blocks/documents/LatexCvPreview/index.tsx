"use client"

import { DownloadSimpleIcon } from "@phosphor-icons/react"
import React, { useCallback, useEffect, useState } from "react"
import {
    Button,
    Skeleton,
    cn,
} from "@heroui/react"
import { useTranslations } from "next-intl"
import dynamic from "next/dynamic"
import type { WithClassNames } from "@/modules/types/base/class-name"

/**
 * latex.js renderer, loaded client-only. It touches `document` at construction and pulls in a
 * heavy bundle, so it must never SSR — mirrors how `ArchitectureScene` (R3F) is loaded. While
 * the chunk resolves, a sized skeleton keeps the paper surface from collapsing/jumping.
 */
const LatexCvRenderer = dynamic(
    () => import("./LatexCvRenderer").then((module) => module.LatexCvRenderer),
    {
        ssr: false,
        loading: () => (
            <div className="min-h-0 flex-1 space-y-3 rounded-2xl bg-white p-4 sm:p-6">
                <Skeleton className="h-7 w-1/2 rounded" />
                <Skeleton className="h-4 w-1/3 rounded" />
                <Skeleton className="h-24 w-full rounded" />
                <Skeleton className="h-4 w-2/3 rounded" />
                <Skeleton className="h-4 w-3/4 rounded" />
                <Skeleton className="h-24 w-full rounded" />
            </div>
        ),
    },
)

/** Props for {@link LatexCvPreview}. */
export interface LatexCvPreviewProps extends WithClassNames<undefined> {
    /** Raw LaTeX (`.tex`) source to preview read-only. */
    latexSource: string
    /** Download filename for the raw `.tex` (defaults to `cv.tex`). */
    fileName?: string
}

/**
 * Read-only LaTeX CV preview — a "read-only Overleaf" style page: renders a LaTeX-subset `.tex`
 * source to HTML via latex.js (client-only, isolated in a shadow root) on a bounded, scrollable
 * white "paper" surface. Because this is a document preview it owns its own visual context, so
 * plain white/black is correct even though the app is dark-themed.
 *
 * Degrades gracefully: if latex.js cannot parse the source it shows a short message and still
 * offers the raw `.tex` download. A "Download .tex" action is always available.
 *
 * @param props - {@link LatexCvPreviewProps}
 */
export const LatexCvPreview = ({
    latexSource,
    fileName = "cv.tex",
    className,
}: LatexCvPreviewProps) => {
    const t = useTranslations()
    const [renderFailed, setRenderFailed] = useState(false)

    // Reset the failure flag whenever a new source arrives (e.g. a re-generation).
    useEffect(() => {
        setRenderFailed(false)
    }, [latexSource])

    const onRenderError = useCallback(() => {
        setRenderFailed(true)
    }, [])

    /** Download the raw `.tex` as a blob via a throwaway anchor (revoked immediately). */
    const onDownloadTex = useCallback(() => {
        if (typeof window === "undefined" || !latexSource) {
            return
        }
        const blob = new Blob([latexSource], { type: "application/x-tex" })
        const url = URL.createObjectURL(blob)
        const anchor = document.createElement("a")
        anchor.href = url
        anchor.download = fileName
        document.body.appendChild(anchor)
        anchor.click()
        document.body.removeChild(anchor)
        URL.revokeObjectURL(url)
    }, [latexSource, fileName])

    return (
        <div className={cn("flex min-h-0 flex-col gap-3", className)}>
            {renderFailed ? (
                <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-default bg-surface p-6 text-center">
                    <p className="text-sm text-muted">
                        {t("cv.generate.renderFallback")}
                    </p>
                </div>
            ) : (
                <LatexCvRenderer
                    latexSource={latexSource}
                    onError={onRenderError}
                />
            )}
            <Button
                variant="secondary"
                isDisabled={!latexSource}
                onPress={onDownloadTex}
                className="shrink-0"
            >
                <DownloadSimpleIcon aria-hidden className="size-5" />
                {t("cv.generate.downloadTex")}
            </Button>
        </div>
    )
}
