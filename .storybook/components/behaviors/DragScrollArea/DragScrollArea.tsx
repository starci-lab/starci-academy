"use client"

import React, { useCallback, useRef, useState } from "react"
import { ScrollShadow, cn } from "@heroui/react"
import { motion, type PanInfo } from "framer-motion"

/**
 * `DragScrollArea.*` — the pointer-pan scroll-region frame namespace.
 *
 * `.Base` is a wrapper frame holding ONE region (the scrollable content), so it
 * keeps plain `children` — no `header`/`footer`, no `items`. Over a plain
 * `ScrollShadow` it adds Framer-Motion pointer-pan behaviour (drag → `scrollTop`)
 * that makes a hidden-scrollbar region usable on Windows, plus the grab/grabbing
 * cursor state. Namespace only — no bare component export.
 */

/** Props for {@link DragScrollArea}. */
export interface DragScrollAreaBaseProps {
    /** Scrollable content. */
    children: React.ReactNode
    /** Hide the native scrollbar (default true). */
    hideScrollBar?: boolean
    /** ScrollShadow edge fade size in px. */
    size?: number
    /** Extra classes on the scroll region. */
    className?: string
}

/**
 * Vertical scroll region with hidden scrollbar and Framer Motion pointer pan.
 *
 * Wheel/trackpad/touch scroll still work; `onPan` maps drag delta to `scrollTop`
 * so Windows users can scroll when the bar is hidden. Cursor is `grab` /
 * `grabbing` while panning. Presentational only.
 *
 * @param props - {@link DragScrollAreaBaseProps}
 */
const Base = ({
    className,
    children,
    hideScrollBar = true,
    size = 40,
}: DragScrollAreaBaseProps) => {
    const scrollRef = useRef<HTMLDivElement>(null)
    const [isPanning, setIsPanning] = useState(false)

    const onPan = useCallback((_event: PointerEvent, info: PanInfo) => {
        const element = scrollRef.current
        if (!element) {
            return
        }
        element.scrollTop -= info.delta.y
    }, [])

    return (
        <ScrollShadow
            ref={scrollRef}
            hideScrollBar={hideScrollBar}
            size={size}
            className={cn("overflow-y-auto", className)}
        >
            <motion.div
                className={cn(
                    "min-h-min select-none",
                    isPanning ? "cursor-grabbing" : "cursor-grab",
                )}
                onPanStart={() => setIsPanning(true)}
                onPan={onPan}
                onPanEnd={() => setIsPanning(false)}
            >
                {children}
            </motion.div>
        </ScrollShadow>
    )
}

/**
 * The pointer-pan scroll-region KHUNG namespace — one member:
 *
 * | Member | Content channel |
 * |---|---|
 * | `.Base` | `children` (one scrollable region) |
 */
export { Base as DragScrollArea }
