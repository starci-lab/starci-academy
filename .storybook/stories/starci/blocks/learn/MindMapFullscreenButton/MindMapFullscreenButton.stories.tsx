import type { Meta, StoryObj } from "@storybook/nextjs"
import { MindMapFullscreenButton } from "@sb-components/starci/blocks/learn/MindMapFullscreenButton/MindMapFullscreenButton"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `MindMapFullscreenButton` — the floating zoom + fullscreen rail over a mind-map
 * canvas, bottom-right: three `ButtonBase` (iconOnly) actions in a `StackV`, fixed
 * order, always present. `isFullscreen` swaps only the third button's glyph and
 * label between "enter" and "exit". The block never disables at a zoom limit —
 * that judgement belongs to the screen holding the canvas transform.
 */
const meta: Meta<typeof MindMapFullscreenButton> = {
    title: "StarCi/Blocks/Learn/MindMapFullscreenButton/MindMapFullscreenButton",
    component: MindMapFullscreenButton,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof MindMapFullscreenButton>

const ARIA_LABELS_EXPAND = {
    zoomIn: "Zoom in",
    zoomOut: "Zoom out",
    toggleFullscreen: "Fullscreen",
}

const ARIA_LABELS_COLLAPSE = {
    zoomIn: "Zoom in",
    zoomOut: "Zoom out",
    toggleFullscreen: "Exit fullscreen",
}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "StackV": { tier: "frame", role: "the vertical frame stacking the three buttons with one tight seam between them, owning the rail's gap", storyId: "frames-stack-stackv--default" },
    "ButtonBase": { tier: "atom", role: "one icon-only action in the rail — zoom in, zoom out, or the fullscreen toggle, real or its skeleton mirror", storyId: "atoms-buttons-button-button--is-icon-only" },
}

/** LEAF — the three-button rail. `isFullscreen` toggles the third button's glyph + label. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="relative h-64 rounded-2xl bg-default-100 p-8">
            <BlockAnatomy
                name="MindMapFullscreenButton"
                tier="block"
                leaf="Default"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="absolute bottom-8 right-8"
                states={[
                    {
                        name: "isFullscreen = false",
                        why: "The canvas is windowed, so the third button offers to ENTER fullscreen and shows the expand glyph. This is the resting state a reader sees on first opening the mind map.",
                        code: `<MindMapFullscreenButton
    onZoomIn={handleZoomIn}
    onZoomOut={handleZoomOut}
    onToggleFullscreen={handleToggleFullscreen}
    isFullscreen={false}
    ariaLabels={{ zoomIn: "Zoom in", zoomOut: "Zoom out", toggleFullscreen: "Fullscreen" }}
/>`,
                        render: (
                            <MindMapFullscreenButton


                                onZoomIn={() => {}}
                                onZoomOut={() => {}}
                                onToggleFullscreen={() => {}}
                                isFullscreen={false}
                                ariaLabels={ARIA_LABELS_EXPAND}
                            />
                        ),
                    },
                    {
                        name: "isFullscreen = true",
                        why: "The canvas already fills the screen, so the third button flips to the collapse glyph and its label now reads as EXIT. The zoom buttons are unaffected — fullscreen only changes what the third slot means.",
                        code: `<MindMapFullscreenButton
    onZoomIn={handleZoomIn}
    onZoomOut={handleZoomOut}
    onToggleFullscreen={handleToggleFullscreen}
    isFullscreen={true}
    ariaLabels={{ zoomIn: "Zoom in", zoomOut: "Zoom out", toggleFullscreen: "Exit fullscreen" }}
/>`,
                        render: (
                            <MindMapFullscreenButton
                                onZoomIn={() => {}}
                                onZoomOut={() => {}}
                                onToggleFullscreen={() => {}}
                                isFullscreen={true}
                                ariaLabels={ARIA_LABELS_COLLAPSE}
                            />
                        ),
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The canvas has not loaded yet, so all three buttons swap to their shimmer mirror while keeping the exact rail shape they will hand back — the flag reaches the real `ButtonBase` atoms rather than a parallel skeleton tree.",
                        code: `<MindMapFullscreenButton
    onZoomIn={handleZoomIn}
    onZoomOut={handleZoomOut}
    onToggleFullscreen={handleToggleFullscreen}
    isFullscreen={false}
    ariaLabels={ariaLabels}
    isSkeleton
/>`,
                        render: (
                            <MindMapFullscreenButton
                                onZoomIn={() => {}}
                                onZoomOut={() => {}}
                                onToggleFullscreen={() => {}}
                                isFullscreen={false}
                                ariaLabels={ARIA_LABELS_EXPAND}
                                isSkeleton
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
