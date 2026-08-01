import {
    ArrowsInIcon,
    ArrowsOutIcon,
    MagnifyingGlassMinusIcon,
    MagnifyingGlassPlusIcon,
} from "@phosphor-icons/react"
import { ButtonBase } from "@sb-components/atoms/buttons/Button/ButtonBase"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `MindMapFullscreenButton`: the floating zoom + fullscreen cluster that
 * sits bottom-right over a mind-map canvas.
 *
 * ⭐ REUSE FIRST, checked before writing this file (per the run's own warning
 * about `ContentTabBar` reaching past `Toolbar`): there is no existing
 * composite that draws a vertical rail of icon-only buttons over a canvas —
 * `ButtonGroup` is a single connected row/segment for ONE choice, not three
 * independent actions stacked with a gap, so it is the wrong shape here. This
 * block is a thin, DOMAIN-flavoured composition of `ButtonBase` (iconOnly) ×3
 * inside `StackV` — nothing here is hand-rolled that an atom or frame already
 * owns.
 *
 * WHY A BLOCK AND NOT A BARE CLUSTER OF ATOMS: it fixes the ORDER (zoom in →
 * zoom out → fullscreen), the ICON PER SLOT, and — the one real decision —
 * which of two opposite icons the fullscreen button shows. That last part is
 * DOMAIN knowledge (what "currently fullscreen" looks like on a canvas
 * control), so it belongs here rather than on the mind-map screen.
 *
 * LEAF vs STATE (§14d.2): there is exactly one LEAF — the three-button rail
 * never loses or gains a button, so its structure never changes. `isFullscreen`
 * only swaps which glyph + aria-label the third button carries, which is a
 * DATA condition inside that one leaf, not a new shape — so it is a STATE, not
 * a second leaf.
 *
 * §7 — THIS BLOCK NEVER SWALLOWS A PRESS. All three handlers fire on every
 * press regardless of `isFullscreen`; the block does not guess what "cannot
 * zoom further" means, because it has no zoom-bounds data to guess from. Any
 * min/max clamping is the CALLER's concern (it owns the canvas transform).
 *
 * `ariaLabels` is a caller-supplied, per-button table rather than three loose
 * string props, because the three labels are one COHESIVE piece of data (the
 * localized names for this one control cluster) and a named shape beats three
 * parallel strings that could silently get passed in the wrong order.
 * ─────────────────────────────────────────────────────────────────────────────
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
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
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
    showAnatomy = false,
    anatPart,
}: MindMapFullscreenButtonProps) => {
    const buttonAnatPart = showAnatomy ? "ButtonBase" : undefined

    return (
        <div data-anat-part={anatPart}>
            <StackV
                gap={2}
                showAnatomy={showAnatomy}
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
                            showAnatomy={showAnatomy}
                        />
                        <ButtonBase
                            isIconOnly
                            isSkeleton={isSkeleton}
                            variant="ghost"
                            size="sm"
                            prefixIcon={MagnifyingGlassMinusIcon}
                            ariaLabel={ariaLabels.zoomOut}
                            onPress={onZoomOut}
                            showAnatomy={showAnatomy}
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
                            showAnatomy={showAnatomy}
                        />
                    </>
                }
            />
        </div>
    )
}

export { MindMapFullscreenButton }
