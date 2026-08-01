"use client"

import React, {
    useCallback,
    useEffect,
    useRef,
    useState,
    type ReactNode,
} from "react"
import { cn } from "@heroui/react"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STORYBOOK-LOCAL DESIGN SPEC — `ResizableRail.*`, the drag-to-resize side-rail
 * FRAME namespace (teacher 2026-07-25, canon §13a). Authored in Storybook (not
 * `src`); synced to `src` later. No `@/components` imports (design-spec ports
 * stay self-contained).
 *
 * KHUNG API LAW (§13b): `.Base` is a WRAPPER frame that holds ONE region (the
 * rail body) — nothing is being crammed into a single slot, so it keeps plain
 * `children` and grows no `header`/`footer`. No repeating list → no `items`.
 * Namespace only — no bare component export.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Props for {@link ResizableRail}. */
export interface ResizableRailBaseProps {
    /** Rail content (e.g. the content-map tree). */
    children: ReactNode
    /** localStorage key the chosen width is persisted under. */
    storageKey: string
    /** Initial width in px before any persisted value loads. */
    defaultWidth?: number
    /** Smallest allowed width in px. */
    minWidth?: number
    /** Largest allowed width in px. */
    maxWidth?: number
    /** Accessible name for the drag handle (separator). */
    ariaLabel?: string
    /**
     * Which edge the drag handle sits on. `"right"` (default) suits a LEFT rail
     * (drag right = wider). `"left"` suits a RIGHT rail (handle on the inner edge,
     * drag left = wider) — e.g. a right-docked chat panel.
     */
    handleSide?: "left" | "right"
    /**
     * Publish the live width to this CSS custom property on `:root` (e.g.
     * `"--app-rail-w"`), resetting it to `0px` while unmounted. Lets
     * viewport-anchored `fixed` chrome dodge the rail via
     * `right-[var(--app-rail-w,0px)]`.
     */
    widthVar?: string
    /** Extra classes on the rail root. */
    className?: string
    /**
     * When `true`, each composed part emits `data-anat-part="<name>"` so a
     * BlockAnatomy panel can badge it on-render. Off by default (production).
     */
    showAnatomy?: boolean
}

/**
 * A side rail whose width the reader can drag to resize, with the chosen width
 * persisted to `localStorage`. A thin handle pinned to an edge is the splitter:
 * drag (pointer) or focus + Arrow keys to resize; the surrounding content
 * reflows. Tier-3 frame — owns the handle styling + the ephemeral width state;
 * the rail body arrives via `children`.
 *
 * Positioning (sticky / hidden-on-mobile / max-height) is supplied by the caller
 * through `className`; this frame only owns the width + the handle.
 *
 * @param props - {@link ResizableRailBaseProps}
 */
const Base = ({
    children,
    storageKey,
    defaultWidth = 320,
    minWidth = 256,
    maxWidth = 560,
    ariaLabel,
    handleSide = "right",
    widthVar,
    className,
    showAnatomy = false,
}: ResizableRailBaseProps) => {
    // a left-edge handle widens when dragged LEFT (negative deltaX), so flip the sign.
    const dir = handleSide === "left" ? -1 : 1
    const [width, setWidth] = useState(defaultWidth)
    /** Latest width mirror so pointer-up can persist without a stale closure. */
    const widthRef = useRef(defaultWidth)
    /** Drag origin captured on pointer-down. */
    const dragRef = useRef<{ startX: number; startWidth: number } | null>(null)

    const clamp = useCallback(
        (value: number) => Math.min(Math.max(value, minWidth), maxWidth),
        [minWidth, maxWidth],
    )

    /** Commit a new width to state + the persistence ref. */
    const applyWidth = useCallback(
        (value: number) => {
            const next = clamp(value)
            widthRef.current = next
            setWidth(next)
        },
        [clamp],
    )

    // Hydrate the persisted width on mount (client-only; SSR/first paint uses
    // `defaultWidth` so markup matches and there is no hydration mismatch).
    useEffect(() => {
        const stored = window.localStorage.getItem(storageKey)
        if (stored === null) {
            return
        }
        const parsed = Number(stored)
        if (!Number.isNaN(parsed)) {
            applyWidth(parsed)
        }
    }, [storageKey, applyWidth])

    // Re-clamp when the BOUNDS move under us: a caller that narrows `maxWidth`
    // must snap the rail back on its own, without waiting for the next drag. The
    // persisted width is deliberately NOT overwritten — it is the reader's
    // PREFERENCE, and a temporarily small window must not clobber it.
    useEffect(() => {
        const bounded = clamp(widthRef.current)
        if (bounded !== widthRef.current) {
            widthRef.current = bounded
            setWidth(bounded)
        }
    }, [clamp])

    // Publish the live width so viewport-anchored `fixed` chrome can dodge the rail.
    // Reset to `0px` on unmount, NOT delete: consumers read it with a `0px` fallback.
    useEffect(() => {
        if (!widthVar) {
            return
        }
        const root = document.documentElement
        root.style.setProperty(widthVar, `${Math.round(width)}px`)
        return () => root.style.setProperty(widthVar, "0px")
    }, [widthVar, width])

    const onPointerDown = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
        event.preventDefault()
        event.currentTarget.setPointerCapture(event.pointerId)
        dragRef.current = { startX: event.clientX, startWidth: widthRef.current }
        document.body.style.cursor = "col-resize"
        document.body.style.userSelect = "none"
    }, [])

    const onPointerMove = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
        if (!dragRef.current) {
            return
        }
        applyWidth(dragRef.current.startWidth + dir * (event.clientX - dragRef.current.startX))
    }, [applyWidth, dir])

    const onPointerUp = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
        if (!dragRef.current) {
            return
        }
        dragRef.current = null
        event.currentTarget.releasePointerCapture(event.pointerId)
        document.body.style.removeProperty("cursor")
        document.body.style.removeProperty("user-select")
        window.localStorage.setItem(storageKey, String(Math.round(widthRef.current)))
    }, [storageKey])

    const onKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
        const step = event.shiftKey ? 32 : 16
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
            return
        }
        event.preventDefault()
        applyWidth(widthRef.current + (event.key === "ArrowLeft" ? -step : step))
        window.localStorage.setItem(storageKey, String(Math.round(widthRef.current)))
    }, [applyWidth, storageKey])

    return (
        <div className={cn(className)} style={{ width }}>
            {children}
            {/* ⚠️ 2026-07-28: this used to also emit an anatomy-only "Content" marker span
                here (an inset-0 marker for the rail body region). Dropped: `children` is a
                CALLER slot — whatever the caller renders as the rail body belongs to THEIR
                own anatomy, not this frame's, and no story ever declared "Content" (there is
                no component behind it to link to), so the marker only ever rendered into the
                DOM invisibly. */}
            {/* splitter: a thin line at the chosen edge that thickens to accent on hover/drag.
                ⚠️ 2026-07-28: `data-anat-part="Handle"` was dropped too — the splitter is this
                frame's own internal geometry (no component/story of its own to link a reader
                to, same as `Grid`'s per-cell wrapper), so the badge only ever rendered
                invisibly as well. */}
            <div
                role="separator"
                aria-orientation="vertical"
                aria-label={ariaLabel}
                tabIndex={0}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onKeyDown={onKeyDown}
                className={cn(
                    "group absolute inset-y-0 z-20 flex w-3 cursor-col-resize items-stretch justify-center outline-none",
                    handleSide === "left" ? "left-0 -translate-x-1/2" : "right-0 translate-x-1/2",
                )}
            >
                <span className="h-full w-px bg-separator transition-colors group-hover:bg-accent group-focus-visible:bg-accent" />
            </div>
        </div>
    )
}

/**
 * The resizable side-rail KHUNG namespace — one member:
 *
 * | Member | Content channel |
 * |---|---|
 * | `.Base` | `children` (one rail body) |
 */
export { Base as ResizableRail }
