import React from "react"
import { PageHeader } from "@/components/composites/layout/Page"

/**
 * `PlaygroundHubHeader` — the hub-identity cluster at the top of the
 * Docker/Kubernetes exercise grid: a title and an optional one-sentence purpose
 * line. Sibling of `ContentHeader`/`FoundationsHeader` but thinnest — no breadcrumb,
 * meta row, or secondary card. One shape: `isSkeleton` only swaps which state the
 * `Typography` renders inside the same `PageHeader`.
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
        <PageHeader
            isSkeleton={isSkeleton}
            title={title}
            description={description}
        />
    )
}

export { PlaygroundHubHeader }
