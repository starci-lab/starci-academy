import React from "react"

/** Props for the {@link StickyBottomBar} block. */
export interface StickyBottomBarProps {
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
}: StickyBottomBarProps) => {
    return (
        <div className="fixed bottom-0 left-0 right-[var(--app-rail-w,0px)] z-40 border-t border-separator bg-background px-4 py-3">
            {children}
        </div>
    )
}
