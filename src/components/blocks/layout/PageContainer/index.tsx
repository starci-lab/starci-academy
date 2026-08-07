import React from "react"
import type { ReactNode } from "react"

/** Props for the {@link PageContainer} block. */
export interface PageContainerProps {
    /** Page content, composed by the caller. */
    children: ReactNode
}

/**
 * Standard page shell — full width of the parent with a right gutter + vertical
 * rhythm. No `mx-auto` centering and no left padding (flush start). Owns page
 * spacing so features (which must not use `p-*`) compose inside it.
 *
 * @param props - {@link PageContainerProps}
 * @see Story: .storybook/stories/blocks/layout/PageContainer/PageContainer.stories
 */
export const PageContainer = ({ children }: PageContainerProps) => {
    return (
        <div className="w-full py-16 pr-4 @app-sm:pr-6 @app-lg:pr-8">
            {children}
        </div>
    )
}
