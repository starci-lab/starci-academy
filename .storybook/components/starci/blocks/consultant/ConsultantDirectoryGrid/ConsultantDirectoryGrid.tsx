import React from "react"
import { AsyncContent, type AsyncContentEmptyProps } from "@sb-components/composites/async/AsyncContent/AsyncContent"
import { Grid, type GridItem } from "@sb-components/frames/Grid/Grid"
import { StackV } from "@sb-components/frames/Stack/Stack"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { ConsultantCard, type ConsultantCardConsultant } from "@sb-components/starci/blocks/consultant/ConsultantCard/ConsultantCard"

/**
 * `ConsultantDirectoryGrid` — a BLOCK: the browse surface of the consultant
 * directory — how many consultants matched, then the cards, across the
 * loading → empty → content lifecycle.
 *
 * Composes rather than rebuilds: `AsyncContent` (the error → loading → empty →
 * content switch), `Grid` (the responsive tile track), `Typography` (the count
 * line), and `ConsultantCard` (one tile, unchanged). It decides how many tiles, in
 * what shape, and what the count line says — never how one card looks.
 *
 * Owns the count-line wording ("N consultants"); the caller passes a bare `count`
 * number. `emptyTitle` stays a caller prop because the "nothing matched" copy
 * depends on context this block never receives.
 *
 * `isLoading` is a separate prop from `consultants` (never inferred from content
 * presence). `count` is separate from `consultants.length` — it is the directory
 * total, not the fetched page size; `count === undefined` renders no count line.
 *
 * One leaf (`Default`): `isLoading`/`isEmpty` swap the `AsyncContent` branch but
 * the shape never changes. The count line lives inside the `content` slot beside
 * the grid, not as permanent chrome. Skeleton tiles carry a blank placeholder
 * `consultant`, never a live press handler.
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
        content: (
            <ConsultantCard
                consultant={{ id: `skeleton-${index}`, fullName: "" }}
                onOpen={NOOP}
                isSkeleton


            />
        ),
    }))

    const tiles: Array<GridItem> = (consultants ?? []).map((consultant) => ({
        key: consultant.id,
        content: (
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
                skeleton={
                    <div>
                        <Grid columns={{ base: 1, sm: 2, lg: 3 }} gap={4} items={skeletonTiles} />
                    </div>
                }
                isEmpty={isEmpty}
                emptyContent={emptyContent}

                content={
                    <StackV gap={4} body={
                        <>
                            {count !== undefined ? (
                                <Typography size="sm" color="muted" text={countLabel(count)} />
                            ) : null}
                            <div>
                                <Grid columns={{ base: 1, sm: 2, lg: 3 }} gap={4} items={tiles} />
                            </div>
                        </>
                    } />
                }
            />
        </div>
    )
}

export { ConsultantDirectoryGrid }
