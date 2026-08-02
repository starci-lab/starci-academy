import React from "react"
import { PageHeader } from "@sb-components/composites/layout/Page/Page"

/**
 * `PlaygroundHubHeader` — the hub identity block at the top of the
 * Docker/Kubernetes exercise grid. Sibling of
 * `ContentHeader`/`FoundationsHeader`/`ModuleHeader`, placing identity into the
 * same `PageHeader` frame. The thinnest of the four: only a title and a muted
 * subtitle — no breadcrumb, meta row, or chip, since a hub is a flat entry
 * point. Owns the skeleton-vs-real decision for the title/description slots
 * (`PageHeader` has no `isSkeleton`). One leaf.
 */

/** Props for {@link PlaygroundHubHeader}. */
export interface PlaygroundHubHeaderProps {
    /** Hub title, e.g. "Playground". */
    title: string
    /** One-sentence purpose line explaining what the hub is for. */
    description?: string
    /**
     * `true` → the composed `Typography` slots switch to their own shimmer.
     * The flag FLOWS DOWN into the real atoms rather than building a parallel
     * skeleton tree (§12c).
     */
    isSkeleton?: boolean
}

/**
 * The playground-hub identity cluster at the top of the exercise grid. See
 * the file header for the full contract and why this stays thinner than its
 * `ContentHeader`/`FoundationsHeader` siblings.
 *
 * @param props - {@link PlaygroundHubHeaderProps}
 */
const PlaygroundHubHeader = ({
    title,
    description,
    isSkeleton = false,
}: PlaygroundHubHeaderProps) => {
    return (
        <div>
            <PageHeader

                isSkeleton={isSkeleton}
                title={title}
                description={description}
            />
        </div>
    )
}

export { PlaygroundHubHeader }
