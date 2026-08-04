import { LinkSeeMore } from "@sb-components/atoms/navigation/Link/Link"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `OfferingsSummaryCard` — the operating-loop tile over the site's offerings.
 * One composition: a titled tile holding the offering count and a drill-in
 * link to the offerings editor, worded differently once there are none yet so
 * the empty tile invites the first offering instead of reading as broken. Two
 * DATA states of the single shape: `empty` and `with-offerings`. Grounded in
 * the real `ExpertSiteOfferingEntity`.
 */

/** Props for {@link OfferingsSummaryCard}. */
export interface OfferingsSummaryCardProps {
    /** Number of offerings currently on the site. */
    count: number
    /** Drill into the offerings editor — the connected layer opens `ExpertSiteOfferingsEditor`. */
    onOpenEditor: () => void
    /**
     * `true` → the tile's own first fetch is in flight: the count and the
     * caption/link row shimmer in place of the resolved offerings (§12b).
     * Threaded straight down — never fed to a separate skeleton tree.
     */
    isSkeleton?: boolean
    /** Already-localized copy. */
    labels: OfferingsSummaryCardLabels
}

/** The already-resolved copy the tile renders. */
export interface OfferingsSummaryCardLabels {
    /** Tile title (e.g. "Offerings"). */
    title: string
    /** Caption under the count once at least one offering exists. */
    description: string
    /** Caption under the count while there are none yet — invites the first offering. */
    emptyDescription: string
    /** Drill-in link label once at least one offering exists (e.g. "Edit offerings"). */
    drillLabel: string
    /** Drill-in link label while there are none yet (e.g. "Add your first offering"). */
    emptyDrillLabel: string
}

/**
 * The offerings summary tile. See the file header for why empty vs
 * with-offerings are states of one shape rather than separate leaves.
 *
 * @param props - {@link OfferingsSummaryCardProps}
 */
const OfferingsSummaryCard = ({ count, onOpenEditor, isSkeleton = false, labels }: OfferingsSummaryCardProps) => {
    const isEmpty = !isSkeleton && count === 0
    const description = isEmpty ? labels.emptyDescription : labels.description
    const drillLabel = isEmpty ? labels.emptyDrillLabel : labels.drillLabel

    return (
        <div data-tier="block" data-component="OfferingsSummaryCard">
            <SurfaceCard
                padding={3}
                label={labels.title}
                isSkeleton={isSkeleton}
                body={() => (
                    <StackV
                        gap={2}
                        isSkeleton={isSkeleton}
                        items={[
                            () => (
                                <Typography size="h2" weight="bold" tabularNums isSkeleton={isSkeleton} text={String(count)} />
                            ),
                            () => <Typography size="sm" color="muted" isSkeleton={isSkeleton} text={description} />,
                            () => (
                                <LinkSeeMore
                                    size="sm"
                                    isSkeleton={isSkeleton}
                                    label={drillLabel}
                                    onPress={isSkeleton ? undefined : onOpenEditor}
                                />
                            ),
                        ]}
                    />
                )}
            />
        </div>
    )
}

export { OfferingsSummaryCard }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "OfferingsSummaryCard" } as const
