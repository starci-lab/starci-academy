"use client"

import React, { useId, useState } from "react"
import { MagnifyingGlassPlusIcon } from "@phosphor-icons/react"
import mermaid from "mermaid"
import useSWR from "swr"
import { Modal, cn } from "@heroui/react"
import { StackV } from "@sb-components/frames/Stack/Stack"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STORYBOOK-LOCAL DESIGN SPEC — faithful port of
 * `@/components/blocks/rendering/MarkdownContent/MermaidDiagram`. Authored in
 * Storybook (not `src`); synced back to `src` later. Sibling of
 * `MarkdownContent.tsx` in this same composite folder (this repo keeps a
 * component's helper pieces FLAT inside its own folder rather than the
 * `Name/index.tsx` sub-folder shape `src` uses — see `SurfaceCard`/`ProgressMeter`
 * for the same convention).
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Props for {@link MermaidDiagram}. */
export interface MermaidDiagramProps {
    /** Mermaid source string. */
    code: string
    /** Mermaid theme key resolved from the current Storybook toolbar theme. */
    theme: "default" | "dark"
    /** Loading text shown while the diagram is rendering. */
    loadingLabel: string
    /** Accessible label for the click-to-zoom trigger. */
    expandLabel: string
    /** Figure caption paragraph that follows the diagram (e.g. "Figure 1: ..."), if any. */
    caption?: string
    /** Generic caption shown in the zoom modal when the diagram has no authored caption. */
    fallbackLabel: string
    /**
     * Where the root `<figure>` sits inside its parent, from the closed
     * positioning union. `map.tsx` owns the block-rhythm margin between fences
     * by wrapping this component's output in a plain `<div>` — margins have no
     * slot in `AllowedClassName` (see `principles/margin.md`).
     */
    classNames?: Array<AllowedClassName>
}

/**
 * Renders mermaid code blocks to SVG, cached per theme + source via SWR.
 *
 * Presentational: uses only UI-local hooks (`useId`, `useState`) plus SWR's local cache to
 * render the diagram and toggle a full-screen preview; no business logic. Marked
 * `"use client"` for the browser-side mermaid renderer.
 * @param props - {@link MermaidDiagramProps}
 */
export const MermaidDiagram = ({ code, theme, loadingLabel, expandLabel, caption, fallbackLabel, classNames }: MermaidDiagramProps) => {
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
        <figure className={cn("overflow-hidden rounded-3xl border border-default bg-background", classNames)}>
            {/* Header row matches `CodeToHtml`'s exact chrome (label left, action right) — a
                mermaid block is "a fence with a name" the same way a code fence is: the WORD
                "mermaid" is the label, same as a code fence names its own language. The zoom
                trigger is icon-only too, matching `SnippetIcon`'s copy button — always visible,
                not a hover-only overlay. */}
            <div className="flex items-center justify-between border-b border-default px-3 py-2">
                <span className="font-mono text-xs text-muted">mermaid</span>
                {data ? (
                    <button type="button" aria-label={expandLabel} title={expandLabel} onClick={() => setOpen(true)} className="text-muted">
                        <MagnifyingGlassPlusIcon className="size-4" />
                    </button>
                ) : null}
            </div>
            {data ? (
                <>
                    {/* mermaid stamps an inline `style="max-width:Npx"` on the <svg> that
                        outranks our `max-w-full` class, so a wide diagram would otherwise push
                        the reading column past the viewport. Wrap it in an x-scroll box: it
                        scales to fit when it can, and scrolls inside the figure when it can't. */}
                    <div
                        className="overflow-x-auto p-3 [&_svg]:h-auto [&_svg]:!w-auto [&_svg]:!max-w-none"
                        dangerouslySetInnerHTML={{ __html: data }}
                    />
                    {/* Authored caption ("Figure N: …") as a real figcaption — the source paragraph
                        is stripped upstream so it isn't shown twice. Generic fallback stays modal-only. */}
                    {caption ? (
                        <figcaption className="px-3 pb-3 text-center text-sm italic text-muted">
                            {caption}
                        </figcaption>
                    ) : null}
                    <Modal isOpen={isOpen} onOpenChange={setOpen}>
                        <Modal.Backdrop>
                            <Modal.Container size="full">
                                <Modal.Dialog>
                                    <Modal.CloseTrigger />
                                    {/* `p-6` — the composite viewer tier caps padding to the house
                                        scale (`AllowedPadding` steps `1..6`, see `scripts/check-padding.mjs`);
                                        `src`'s `p-4` is off that scale, so the full-screen preview gets the
                                        closest generous step instead. */}
                                    <Modal.Body className="p-6">
                                        {/* Full-screen figure: diagram scaled to fill, caption beneath. */}
                                        <StackV
                                            as="figure"
                                            gap={3}
                                            pattern="sibling-stack"
                                            align="center"
                                            justify="center"
                                            classNames={["h-full"]}
                                            items={[
                                                () => (
                                                    <div className="flex w-full flex-1 items-center justify-center overflow-auto">
                                                        <div
                                                            className="[&_svg]:h-auto [&_svg]:w-full [&_svg]:max-w-full"
                                                            dangerouslySetInnerHTML={{ __html: data }}
                                                        />
                                                    </div>
                                                ),
                                                () => (
                                                    <figcaption className="text-center text-sm italic text-muted">
                                                        {figureCaption}
                                                    </figcaption>
                                                ),
                                            ]}
                                        />
                                    </Modal.Body>
                                </Modal.Dialog>
                            </Modal.Container>
                        </Modal.Backdrop>
                    </Modal>
                </>
            ) : (
                <div className="p-3 text-sm text-muted">{loadingLabel}</div>
            )}
        </figure>
    )
}
