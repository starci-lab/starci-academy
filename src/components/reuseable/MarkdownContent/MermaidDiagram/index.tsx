"use client"

import React, { useId, useState } from "react"
import mermaid from "mermaid"
import useSWR from "swr"
import { Modal } from "@heroui/react"
import { MagnifyingGlassPlusIcon } from "@phosphor-icons/react"

/** Props for {@link MermaidDiagram}. */
export interface MermaidDiagramProps {
    /** Mermaid source string. */
    code: string
    /** Mermaid theme key resolved from the app theme. */
    theme: "default" | "dark"
    /** Translated loading text while the diagram is rendering. */
    loadingLabel: string
    /** Translated accessible label for the click-to-zoom trigger. */
    expandLabel: string
    /** Figure caption paragraph that follows the diagram (e.g. "Hình 1: ..."), if any. */
    caption?: string
    /** Translated generic caption shown when the diagram has no authored caption. */
    fallbackLabel: string
}

/**
 * Renders mermaid code blocks to SVG, cached per theme + source via SWR.
 *
 * Presentational: uses only UI-local hooks (`useId`, `useState`) plus SWR's local cache to
 * render the diagram and toggle a full-screen preview; no business logic. Marked
 * `"use client"` for the browser-side mermaid renderer.
 * @param props - {@link MermaidDiagramProps}
 */
export const MermaidDiagram = ({ code, theme, loadingLabel, expandLabel, caption, fallbackLabel }: MermaidDiagramProps) => {
    // Stable id so concurrent diagrams never collide on mermaid's render target id.
    const renderId = useId().replace(/:/g, "-")
    // Local open flag for the full-screen preview dialog (per-diagram, not a global modal).
    const [isOpen, setOpen] = useState(false)
    // Authored caption wins; otherwise show a generic figure label.
    const figureCaption = caption ?? fallbackLabel
    const { data } = useSWR(
        `mermaid:${theme}:${code}`,
        async () => {
            mermaid.initialize({
                startOnLoad: false,
                theme,
                securityLevel: "strict",
            })
            const { svg } = await mermaid.render(`mermaid-${renderId}`, code)
            return svg
        },
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
        },
    )

    return (
        <div className="rounded-xl border border-default bg-background p-3">
            {data ? (
                <>
                    {/* Clickable inline diagram — opens the full-screen preview on press. */}
                    <button
                        type="button"
                        aria-label={expandLabel}
                        title={expandLabel}
                        onClick={() => setOpen(true)}
                        className="group relative block w-full cursor-zoom-in"
                    >
                        <div
                            className="[&_svg]:h-auto [&_svg]:max-w-full"
                            dangerouslySetInnerHTML={{ __html: data }}
                        />
                        {/* Hover affordance hinting the diagram can be enlarged. */}
                        <span className="pointer-events-none absolute right-2 top-2 rounded-medium bg-default/60 p-1.5 text-muted opacity-0 transition-opacity group-hover:opacity-100">
                            <MagnifyingGlassPlusIcon className="size-4" />
                        </span>
                    </button>
                    <Modal isOpen={isOpen} onOpenChange={setOpen}>
                        <Modal.Backdrop>
                            <Modal.Container size="full">
                                <Modal.Dialog>
                                    <Modal.CloseTrigger />
                                    <Modal.Body className="p-4">
                                        {/* Full-screen figure: diagram scaled to fill, caption beneath. */}
                                        <figure className="flex h-full flex-col items-center justify-center gap-4">
                                            <div className="flex w-full flex-1 items-center justify-center overflow-auto">
                                                <div
                                                    className="[&_svg]:h-auto [&_svg]:w-full [&_svg]:max-w-full"
                                                    dangerouslySetInnerHTML={{ __html: data }}
                                                />
                                            </div>
                                            <figcaption className="text-center text-sm italic text-muted">
                                                {figureCaption}
                                            </figcaption>
                                        </figure>
                                    </Modal.Body>
                                </Modal.Dialog>
                            </Modal.Container>
                        </Modal.Backdrop>
                    </Modal>
                </>
            ) : (
                <div className="text-sm text-muted">{loadingLabel}</div>
            )}
        </div>
    )
}
