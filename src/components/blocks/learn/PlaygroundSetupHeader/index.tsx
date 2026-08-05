import React from "react"
import { LinkBack } from "@/components/atoms/navigation/Link"
import { PageHeader } from "@/components/composites/layout/Page"

/**
 * `PlaygroundSetupHeader` — the identity cluster at the top of the playground Setup
 * screen: a way back to the playground hub, the exercise title, and its one-line
 * intro. Sibling of `ContentHeader` / `CourseBrief` but carries no meta cluster —
 * a playground exercise has no read state, outcomes, or counts. The single hop back
 * is a `LinkBack` placed directly in `PageHeader.breadcrumb`. One shape:
 * `isSkeleton` swaps `title`/`description` to their shimmer mirror in the same
 * slots; the back link never waits on the fetch, so it gets no skeleton.
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
