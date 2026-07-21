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
 * STORYBOOK-LOCAL DESIGN SPEC — the target `ResizableRail` layout primitive.
 * Authored in Storybook (not `src`); synced to `src` later. No `@/components`
 * imports (design-spec ports stay self-contained).
 */

/** Props for the {@link ResizableRail} block. */
export interface ResizableRailProps {
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
}

/**
 * A side rail whose width the reader can drag to resize, with the chosen width
 * persisted to `localStorage`. A thin handle pinned to an edge is the splitter:
 * drag (pointer) or focus + Arrow keys to resize; the surrounding content
 * reflows. Tier-3 block — owns the handle styling + the ephemeral width state;
 * the rail body arrives via `children`.
 *
 * Positioning (sticky / hidden-on-mobile / max-height) is supplied by the caller
 * through `className`; this block only owns the width + the handle.
 *
 * @param props - {@link ResizableRailProps}
 */
export const ResizableRail = ({
    children,
    storageKey,
    defaultWidth = 320,
    minWidth = 256,
    maxWidth = 560,
    ariaLabel,
    handleSide = "right",
    widthVar,
    className,
}: ResizableRailProps) => {
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
            {/* splitter: a thin line at the chosen edge that thickens to accent on hover/drag */}
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
