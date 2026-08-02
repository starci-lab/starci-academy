"use client"

import React, { useCallback, useRef, useState } from "react"
import { ScrollShadow, cn } from "@heroui/react"
import { motion, type PanInfo } from "framer-motion"

/**
 * `DragScrollArea` — a vertical scroll region with a hidden scrollbar plus
 * Framer-Motion pointer pan (drag → `scrollTop`), so a hidden-bar region is
 * still scrollable on Windows. One region → plain `children`, no named slots.
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
