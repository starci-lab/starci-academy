import {
    ArrowsInIcon,
    ArrowsOutIcon,
    MagnifyingGlassMinusIcon,
    MagnifyingGlassPlusIcon,
} from "@phosphor-icons/react"
import { ButtonBase } from "@sb-components/atoms/buttons/Button/ButtonBase"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `MindMapFullscreenButton` — the floating zoom + fullscreen cluster bottom-right over a
 * mind-map canvas: three icon-only `ButtonBase` in a `StackV`. Fixes the order (zoom in →
 * zoom out → fullscreen), the icon per slot, and which of two icons the fullscreen button
 * shows (the one real decision). One leaf — `isFullscreen` only swaps the third button's
 * glyph/aria-label. All three handlers fire on every press (min/max clamping is the
 * caller's job). `ariaLabels` is a caller-supplied per-button table.
 */

/** Localized accessible names, one per button this block renders. */
export interface MindMapFullscreenButtonAriaLabels {
    /** Name for the zoom-in button. */
    zoomIn: string
    /** Name for the zoom-out button. */
    zoomOut: string
    /**
     * Name for the fullscreen toggle. The caller passes ONE label that already
     * reads correctly for the current `isFullscreen` state (e.g. "Fullscreen"
     * vs "Exit fullscreen") — the block does not invent english/vi wording,
     * per §14d.1.
     */
    toggleFullscreen: string
}

/** Props for {@link MindMapFullscreenButton}. */
export interface MindMapFullscreenButtonProps {
    /** Fired on every press of the zoom-in button. */
    onZoomIn: () => void
    /** Fired on every press of the zoom-out button. */
    onZoomOut: () => void
    /** Fired on every press of the fullscreen button, in EITHER direction. */
    onToggleFullscreen: () => void
    /** `true` → canvas is currently fullscreen, so the third button shows "exit" (collapse) instead of "enter" (expand). */
    isFullscreen: boolean
    /** Per-button accessible names — see {@link MindMapFullscreenButtonAriaLabels}. */
    ariaLabels: MindMapFullscreenButtonAriaLabels
    /** `true` → all three buttons render as their shimmer mirror (flows into `ButtonBase`, §6b). */
    isSkeleton?: boolean
}

/**
 * The bottom-right zoom + fullscreen rail for a mind-map canvas.
 *
 * @param props - {@link MindMapFullscreenButtonProps}
 */
const MindMapFullscreenButton = ({
    onZoomIn,
    onZoomOut,
    onToggleFullscreen,
    isFullscreen,
    ariaLabels,
    isSkeleton = false,
}: MindMapFullscreenButtonProps) => {
    return (
        <div>
            <StackV
                gap={2}

                body={
                    <>
                        <ButtonBase
                            isIconOnly
                            isSkeleton={isSkeleton}
                            variant="ghost"
                            size="sm"
                            prefixIcon={MagnifyingGlassPlusIcon}
                            ariaLabel={ariaLabels.zoomIn}
                            onPress={onZoomIn}

                        />
                        <ButtonBase
                            isIconOnly
                            isSkeleton={isSkeleton}
                            variant="ghost"
                            size="sm"
                            prefixIcon={MagnifyingGlassMinusIcon}
                            ariaLabel={ariaLabels.zoomOut}
                            onPress={onZoomOut}

                        />
                        <ButtonBase
                            isIconOnly
                            isSkeleton={isSkeleton}
                            variant="ghost"
                            size="sm"
                            // Collapse glyph while fullscreen (this button now means "exit"),
                            // expand glyph otherwise — the one real judgement call this block owns.
                            prefixIcon={isFullscreen ? ArrowsInIcon : ArrowsOutIcon}
                            ariaLabel={ariaLabels.toggleFullscreen}
                            onPress={onToggleFullscreen}

                        />
                    </>
                }
            />
        </div>
    )
}

export { MindMapFullscreenButton }
