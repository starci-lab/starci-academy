import React from "react"
import { LinkBack } from "@sb-components/atoms/navigation/Link/Link"
import { PageHeader } from "@sb-components/composites/layout/Page/Page"

/**
 * `PlaygroundSetupHeader` — the identity cluster atop the playground Setup
 * screen: a `LinkBack` to the hub, the exercise title, and its one-line intro.
 * Sibling of `ContentHeader`/`CourseBrief` on the same `PageHeader` frame, but
 * carries no meta cluster (a playground exercise has no read state, outcomes, or
 * counts). The back link stays live through loading (its data is caller-supplied
 * synchronously); only `title`/`description` switch to their `Typography`
 * skeleton mirror.
 */

/** Props for {@link PlaygroundSetupHeader}. */
export interface PlaygroundSetupHeaderProps {
    /** Label on the back link, e.g. "Playground" — the hub this exercise was opened from. */
    breadcrumbLabel: string
    /** Fired when the back link is pressed — the caller owns the routing. */
    onBack: () => void
    /** Exercise title. */
    title: string
    /** One-line intro to the exercise. */
    description?: string
    /**
     * `true` → title/description switch to their shimmer mirror while the
     * exercise is loading. The flag flows down into the real text atoms
     * rather than a parallel skeleton tree (§12c); the back link stays live
     * (see file header).
     */
    isSkeleton?: boolean
}

/**
 * Identity cluster at the top of the playground Setup screen. See the file
 * header for the full contract.
 *
 * @param props - {@link PlaygroundSetupHeaderProps}
 */
const PlaygroundSetupHeader = ({
    breadcrumbLabel,
    onBack,
    title,
    description,
    isSkeleton = false,
}: PlaygroundSetupHeaderProps) => {
    return (
        <div>
            <PageHeader

                isSkeleton={isSkeleton}
                breadcrumb={() => (
                    <div className="w-fit">
                        <LinkBack label={breadcrumbLabel} onPress={onBack} />
                    </div>
                )}
                title={title}
                description={description}
            />
        </div>
    )
}

export { PlaygroundSetupHeader }
