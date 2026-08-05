import React from "react"
import { AsyncContent, type AsyncContentEmptyProps } from "@sb-components/composites/async/AsyncContent/AsyncContent"
import { Grid, type GridItem } from "@sb-components/frames/Grid/Grid"
import { StackV } from "@sb-components/frames/Stack/Stack"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { ConsultantCard, type ConsultantCardConsultant } from "@sb-components/starci/blocks/consultant/ConsultantCard/ConsultantCard"

/**
 * `ConsultantDirectoryGrid` — the consultant directory's browse surface: a
 * match count above the cards, across the loading → empty → content lifecycle.
 * `AsyncContent` owns the branch switch, `Grid` the responsive track,
 * `ConsultantCard` one tile. The count line renders inside the `content` branch
 * only, beside real cards.
 */

/** Props for {@link ConsultantDirectoryGrid}. */
export interface ConsultantDirectoryGridProps {
    /**
     * The current page's consultants, already sorted by the caller. `undefined`
     * ⇒ the list has not resolved yet (see {@link ConsultantDirectoryGridProps.isLoading}).
     */
    consultants?: Array<ConsultantCardConsultant>
    /**
     * How many consultants the directory lists in total. `undefined` ⇒ the
     * count line does not render yet (see file header's judgement call).
     */
    count?: number
    /**
     * `true` while the consultant list's own fetch has not resolved. Passed
     * straight to `AsyncContent` — this block never infers it from
     * `consultants` itself (see file header).
     */
    isLoading: boolean
    /** Fired with a consultant's id when their card is pressed. */
    onOpenConsultant: (id: string) => void
    /** The empty-state message, already localized by the caller (see file header for why this stays a caller prop). */
    emptyTitle: string
    /** Accessible name for the directory region — the block has no visible heading of its own. */
    ariaLabel: string
}

/** How many placeholder tiles mirror the grid while the list hasn't resolved — ported from the real `ConsultantGrid`'s `SKELETON_COUNT`. */
const SKELETON_TILE_COUNT = 6

/** Skeleton tiles pass this as `onOpen` — `ConsultantCard.isSkeleton` disables its own press, so it never fires. */
const NOOP = () => {}

/** The block's own wording for the count line (§14d.1) — the caller only ever hands over a bare number. */
const countLabel = (count: number): string => `${count} consultants`

/**
 * The consultant directory's browse surface. See the file header for the full
 * contract and why the count line only shows beside real cards.
 *
 * @param props - {@link ConsultantDirectoryGridProps}
 */
const ConsultantDirectoryGrid = ({
    consultants,
    count,
    isLoading,
    onOpenConsultant,
    emptyTitle,
    ariaLabel,
}: ConsultantDirectoryGridProps) => {
    // Resolved-but-zero, matching the real `ConsultantGrid`'s Redux-driven gating
    // (`!consultants` = loading, `sortedConsultants.length === 0` = empty).
    const isEmpty = !isLoading && (consultants?.length ?? 0) === 0

    const skeletonTiles: Array<GridItem> = Array.from({ length: SKELETON_TILE_COUNT }, (_unused, index) => ({
        key: `skeleton-${index}`,
        content: () => (
            <ConsultantCard
                consultant={{ id: `skeleton-${index}`, fullName: "" }}
                onOpen={NOOP}
                isSkeleton


            />
        ),
    }))

    const tiles: Array<GridItem> = (consultants ?? []).map((consultant) => ({
        key: consultant.id,
        content: () => (
            <ConsultantCard
                consultant={consultant}
                onOpen={onOpenConsultant}


            />
        ),
    }))

    const emptyContent: AsyncContentEmptyProps = {
        title: emptyTitle,

    }

    return (
        <div role="region" aria-label={ariaLabel}>
            <AsyncContent
                isLoading={isLoading}
                skeleton={() => (
                    <div>
                        <Grid columns={{ base: 1, sm: 2, lg: 3 }} gap={4} principle="sibling-stack" items={skeletonTiles} />
                    </div>
                )}
                isEmpty={isEmpty}
                emptyContent={emptyContent}

                content={() => (
                    <StackV gap={4} principle="group-boundary" items={[
                        ...(count !== undefined ? [() => (
                            <Typography size="sm" color="muted" text={countLabel(count)} />
                        )] : []),
                        () => (
                            <div>
                                <Grid columns={{ base: 1, sm: 2, lg: 3 }} gap={4} principle="sibling-stack" items={tiles} />
                            </div>
                        ),
                    ]} />
                )}
            />
        </div>
    )
}

export { ConsultantDirectoryGrid }
