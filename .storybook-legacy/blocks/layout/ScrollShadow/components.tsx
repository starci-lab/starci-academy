import { useCallback, useRef, useState } from "react"
import { Button, Label, ScrollShadow, Typography, cn } from "@heroui/react"
import { motion, type PanInfo } from "framer-motion"

/**
 * Horizontal drag: map pan delta → scrollLeft (still draggable on Windows / with the scrollbar hidden).
 * Cursor: `grab` ready to drag, `grabbing` while onPan.
 */
export const HorizontalDragDemo = () => {
    const scrollRef = useRef<HTMLDivElement>(null)
    const [isPanning, setIsPanning] = useState(false)

    const onPan = useCallback((_event: PointerEvent, info: PanInfo) => {
        const element = scrollRef.current
        if (!element) {
            return
        }
        element.scrollLeft -= info.delta.x
    }, [])

    return (
        <div className="flex max-w-sm flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Horizontal scroll</Label>
                <Typography type="body-sm" color="muted">
                    A row of chips wider than the frame — fade on the left/right. Hand cursor (`cursor-grab` / `cursor-grabbing` while onPan).
                </Typography>
            </div>
            <ScrollShadow
                ref={scrollRef}
                orientation="horizontal"
                hideScrollBar
                offset={8}
                className="overflow-x-auto"
            >
                <motion.div
                    className={cn(
                        "flex w-max select-none gap-2 px-0.5 py-1",
                        isPanning ? "cursor-grabbing" : "cursor-grab",
                    )}
                    onPanStart={() => setIsPanning(true)}
                    onPan={onPan}
                    onPanEnd={() => setIsPanning(false)}
                >
                    {["All", "Frontend", "Backend", "DevOps", "System Design", "AI/LLM", "Mobile", "Cloud"].map((tag) => (
                        <Button key={tag} variant="tertiary" size="sm" className="shrink-0">
                            {tag}
                        </Button>
                    ))}
                </motion.div>
            </ScrollShadow>
        </div>
    )
}
