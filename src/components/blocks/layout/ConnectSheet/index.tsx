"use client"

import React, { useCallback, useEffect, useRef } from "react"
import { cn } from "@heroui/react"
import type { PointerEvent as ReactPointerEvent, ReactNode } from "react"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Height (px) of the grabber handle strip above the peek row. */
const GRABBER_HEIGHT = 26
/** Fallback peek height (px) before the peek row has measured. */
const PEEK_FALLBACK = 52
/** Fraction of the viewport the expanded sheet may occupy at most. */
const MAX_VIEWPORT_FRACTION = 0.6
/** Drag distance (px) under which a pointer gesture counts as a tap (toggle), not a drag. */
const TAP_THRESHOLD = 5

/** Props for the {@link ConnectSheet} block. */
export interface ConnectSheetProps extends WithClassNames<undefined> {
    /** Whether the sheet is expanded (controlled — the feature owns snap state). */
    open: boolean
    /** Fired when the user drags/taps to change the snap (or taps the peek row). */
    onOpenChange: (open: boolean) => void
    /** Collapsed PEEK row content — always visible (status + summary + optional action). */
    peek: ReactNode
    /** Expanded BODY content, revealed on drag-up / tap. */
    children: ReactNode
    /** Accessible label for the drag/toggle grabber. */
    toggleLabel: string
}

/**
 * A PERSISTENT, draggable bottom sheet docked to the bottom of a `relative`
 * parent (NOT a modal — no backdrop, the content above stays interactive). Two
 * snap points: COLLAPSED (grabber + peek row only) ↔ EXPANDED (peek + body,
 * capped at {@link MAX_VIEWPORT_FRACTION} of the viewport). Drag the grabber ↕
 * to resize then snap on release; a small drag (< {@link TAP_THRESHOLD}) or a tap
 * on the peek row toggles. `open` is CONTROLLED so the feature can auto-snap per
 * phase (e.g. expand while waiting, collapse once connected). Self-contained
 * pointer drag — no framer-motion dependency. Card-like → `rounded-t-3xl`.
 *
 * Refs: dock = `StickyBottomBar`; drag = `CollapsibleSidebar`.
 * @param props - {@link ConnectSheetProps}
 */
export const ConnectSheet = ({
    open,
    onOpenChange,
    peek,
    children,
    toggleLabel,
    className,
}: ConnectSheetProps) => {
    const sheetRef = useRef<HTMLDivElement>(null)
    const peekRef = useRef<HTMLDivElement>(null)
    const bodyRef = useRef<HTMLDivElement>(null)
    const drag = useRef<{ startY: number; startH: number; moved: boolean } | null>(null)
    // set true after a DRAG so the trailing synthetic click (fired on pointerup)
    // doesn't also toggle — a tap (no drag) falls through to the native click.
    const suppressClick = useRef(false)

    const collapsedHeight = useCallback(
        () => GRABBER_HEIGHT + (peekRef.current?.offsetHeight ?? PEEK_FALLBACK),
        [],
    )
    const expandedHeight = useCallback(() => {
        const cap = typeof window !== "undefined"
            ? Math.round(window.innerHeight * MAX_VIEWPORT_FRACTION)
            : 480
        const wanted = collapsedHeight() + (bodyRef.current?.scrollHeight ?? 0) + 16
        return Math.max(collapsedHeight(), Math.min(wanted, cap))
    }, [collapsedHeight])

    const applyHeight = useCallback((isOpen: boolean, instant = false) => {
        const el = sheetRef.current
        if (!el) {
            return
        }
        if (instant) {
            el.style.transition = "none"
        }
        el.style.height = `${isOpen ? expandedHeight() : collapsedHeight()}px`
        if (instant) {
            requestAnimationFrame(() => { el.style.transition = "" })
        }
    }, [collapsedHeight, expandedHeight])

    // snap to the controlled `open` state, and re-measure when the peek/body
    // content changes (per-phase) or the viewport resizes.
    useEffect(() => { applyHeight(open) })
    useEffect(() => {
        const onResize = () => applyHeight(open, true)
        window.addEventListener("resize", onResize)
        return () => window.removeEventListener("resize", onResize)
    }, [open, applyHeight])

    const onPointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
        event.currentTarget.setPointerCapture(event.pointerId)
        drag.current = {
            startY: event.clientY,
            startH: sheetRef.current?.getBoundingClientRect().height ?? collapsedHeight(),
            moved: false,
        }
        if (sheetRef.current) {
            sheetRef.current.style.transition = "none"
        }
    }
    const onPointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
        const current = drag.current
        if (!current || !sheetRef.current) {
            return
        }
        const delta = current.startY - event.clientY
        if (Math.abs(delta) > TAP_THRESHOLD) {
            current.moved = true
        }
        const height = Math.max(collapsedHeight(), Math.min(current.startH + delta, expandedHeight()))
        sheetRef.current.style.height = `${height}px`
    }
    const onPointerUp = () => {
        const current = drag.current
        if (!current || !sheetRef.current) {
            return
        }
        drag.current = null
        sheetRef.current.style.transition = ""
        if (!current.moved) {
            // a TAP — let the native button click toggle (keyboard-accessible path).
            return
        }
        // a DRAG — snap by threshold; suppress the trailing synthetic click.
        suppressClick.current = true
        const height = sheetRef.current.getBoundingClientRect().height
        const midpoint = (collapsedHeight() + expandedHeight()) / 2
        const next = height > midpoint
        onOpenChange(next)
        applyHeight(next)
    }

    // native click = keyboard (Enter/Space) + tap toggle; skipped right after a drag.
    const onToggleClick = () => {
        if (suppressClick.current) {
            suppressClick.current = false
            return
        }
        onOpenChange(!open)
        applyHeight(!open)
    }

    return (
        <div
            ref={sheetRef}
            className={cn(
                // BORDER delineates the docked sheet from the content above — NOT a
                // shadow: `shadow-surface` casts DOWNWARD + is very subtle, so on a
                // bottom-docked sheet it can't mark the top seam (axis-1 §16: when a
                // shadow can't delineate, use a border instead). No ad-hoc shadow-md —
                // the design system only has surface/field/overlay shadow tokens.
                "absolute inset-x-0 bottom-0 z-30 flex flex-col overflow-hidden rounded-t-3xl border border-default bg-surface",
                "[transition:height_280ms_cubic-bezier(0.32,0.72,0,1)]",
                className,
            )}
            style={{ height: GRABBER_HEIGHT + PEEK_FALLBACK }}
        >
            <button
                type="button"
                aria-label={toggleLabel}
                aria-expanded={open}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
                onClick={onToggleClick}
                className="flex shrink-0 cursor-grab touch-none items-center justify-center py-2 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent active:cursor-grabbing"
            >
                <span className="h-[5px] w-9 rounded-full bg-default" />
            </button>
            <div ref={peekRef} className="shrink-0 px-4 pb-3">
                {peek}
            </div>
            <div
                ref={bodyRef}
                className={cn(
                    "min-h-0 flex-1 overflow-auto px-4 pb-5",
                    !open && "pointer-events-none opacity-40",
                )}
            >
                {children}
            </div>
        </div>
    )
}
