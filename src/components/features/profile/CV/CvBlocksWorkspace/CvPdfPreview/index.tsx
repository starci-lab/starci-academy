"use client"

import React, { useEffect, useRef, useState } from "react"
import { Spinner, Typography, cn } from "@heroui/react"
import { useTranslations } from "next-intl"
import { WarningCircleIcon } from "@phosphor-icons/react"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { CvExportFormat } from "@/modules/types/enums/cv-export-format"
import { useMutateRenderCvBlocksSwr } from "@/hooks/swr/api/graphql/mutations/useMutateRenderCvBlocksSwr"

/** How long to wait after the last `.tex` change before recompiling the preview. */
const COMPILE_DEBOUNCE_MS = 1500

/** Props for {@link CvPdfPreview}. */
export interface CvPdfPreviewProps extends WithClassNames<undefined> {
    /** `cv_blocks.id` of the document being previewed (compile scope + `tex_source` persistence). */
    cvId: string
    /**
     * The CV's current LaTeX source — from `buildCvTexSource(draft)` in block
     * mode, or the user's hand-edited buffer in LaTeX mode. Debounced, compiled
     * server-side (tectonic → PDF), and rendered as an embedded PDF below.
     */
    tex: string
}

/**
 * Right pane of the block editor — the COMPILED-PDF live preview (full-LaTeX
 * pivot). Debounces the current `.tex`, calls `renderCvBlocks` (tectonic → PDF,
 * which also persists `tex_source` BE-side), and embeds the resulting presigned
 * PDF. Keeps the last good PDF on screen while recompiling (a subtle overlay
 * spinner marks the in-flight compile) and surfaces a compile error inline so a
 * bad LaTeX edit shows a message instead of a blank pane.
 *
 * Presented as an A4-proportioned "paper" surface (white card) inside a
 * scrollable frame — same framing the previous client-HTML preview used.
 *
 * @param props - {@link CvPdfPreviewProps}
 */
export const CvPdfPreview = ({ className, cvId, tex }: CvPdfPreviewProps) => {
    const t = useTranslations()
    const { trigger } = useMutateRenderCvBlocksSwr()
    const [url, setUrl] = useState<string | null>(null)
    const [isCompiling, setIsCompiling] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    // Guards against a stale (slower) compile overwriting a newer one's result.
    const requestIdRef = useRef(0)

    useEffect(() => {
        if (!tex.trim()) {
            return
        }
        const timer = setTimeout(() => {
            const requestId = ++requestIdRef.current
            setIsCompiling(true)
            setErrorMessage(null)
            void (async () => {
                try {
                    const result = await trigger({ id: cvId, tex, format: CvExportFormat.Pdf })
                    if (requestId !== requestIdRef.current) {
                        return
                    }
                    const payload = result.data?.renderCvBlocks
                    if (payload?.success && payload.data?.url) {
                        setUrl(payload.data.url)
                    } else {
                        setErrorMessage(payload?.message || t("cv.builder.preview.compileError"))
                    }
                } catch {
                    if (requestId !== requestIdRef.current) {
                        return
                    }
                    setErrorMessage(t("cv.builder.preview.compileError"))
                } finally {
                    if (requestId === requestIdRef.current) {
                        setIsCompiling(false)
                    }
                }
            })()
        }, COMPILE_DEBOUNCE_MS)
        return () => clearTimeout(timer)
    }, [tex, cvId, trigger, t])

    return (
        <div className={cn("h-[420px] lg:h-full", className)}>
            <div className="relative mx-auto flex h-full max-w-[820px] flex-col overflow-hidden rounded-3xl bg-white shadow-surface">
                {/* First-compile placeholder — nothing rendered yet. */}
                {!url && !errorMessage ? (
                    <div className="flex flex-1 items-center justify-center">
                        <Spinner size="lg" />
                    </div>
                ) : null}

                {/* Compile-error state — a bad LaTeX edit shows the message instead of a blank. */}
                {errorMessage ? (
                    <div className="flex flex-1 flex-col items-center justify-center gap-2 p-8 text-center">
                        <WarningCircleIcon aria-hidden className="size-8 text-danger" weight="fill" />
                        <Typography type="body-sm" color="muted">
                            {errorMessage}
                        </Typography>
                    </div>
                ) : null}

                {/* The compiled PDF (kept mounted while recompiling so it never flashes blank). */}
                {url && !errorMessage ? (
                    <iframe
                        title={t("cv.builder.previewTitle")}
                        src={url}
                        className="h-full w-full flex-1 border-0"
                    />
                ) : null}

                {/* In-flight recompile overlay — visible only when a PDF/error is already shown. */}
                {isCompiling && (url || errorMessage) ? (
                    <div className="absolute right-3 top-3 rounded-full bg-foreground/70 p-2 shadow-surface">
                        <Spinner size="sm" color="current" className="text-white" />
                    </div>
                ) : null}
            </div>
        </div>
    )
}
