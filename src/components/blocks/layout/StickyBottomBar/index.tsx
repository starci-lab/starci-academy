import React from "react"
import {
    cn,
} from "@heroui/react"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"

/** Props for the {@link StickyBottomBar} block. */
export interface StickyBottomBarProps extends WithClassNames<undefined> {
    /** Bar content (typically a price + a primary action). */
    children: React.ReactNode
}

/**
 * A fixed bottom action bar pinned to the viewport edge — owns the chrome
 * (fixed position, top divider, surface background, safe padding) so features
 * just drop a price + CTA inside. Typically `@app-md:hidden` for a mobile sticky
 * enroll/checkout bar.
 *
 * @param props - {@link StickyBottomBarProps}
 * @see Story: .storybook/stories/blocks/layout/StickyBottomBar/StickyBottomBar.stories
 */
export const StickyBottomBar = ({
    children,
    className,
}: StickyBottomBarProps) => {
    return (
        <div className={cn("fixed bottom-0 left-0 right-[var(--app-rail-w,0px)] z-40 border-t border-separator bg-background px-4 py-3", className)}>
            {children}
        </div>
    )
}
