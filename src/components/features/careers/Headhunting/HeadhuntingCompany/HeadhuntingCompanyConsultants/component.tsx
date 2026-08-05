import React from "react"
import { AsyncContentEmpty, AsyncContentError } from "@/components/composites/async/AsyncContent"
import { SurfaceCard } from "@/components/composites/cards/SurfaceCard"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { Grid, type GridItem } from "@/components/frames/Grid"
import { StackV } from "@/components/frames/Stack"
import type { ConsultantEntity } from "@/modules/types/entities/consultant"
import { ConsultantCard } from "../../Headhuntings/ConsultantCard"

/** Placeholder card count while the first load is in flight. */
const SKELETON_CARD_COUNT = 3

/** All display text, already localized by the connected `HeadhuntingCompanyConsultants`; a story passes i18n keys. */
export interface HeadhuntingCompanyConsultantsLabels {
    /** Title shown once settled with zero consultants for the active company. */
    emptyTitle: string
    /** Title shown once the loader queries settle with an error. */
    errorTitle: string
    /** Retry button label, paired with {@link HeadhuntingCompanyConsultantsProps.onRetry}. */
    retry: string
}

/** Props for {@link _HeadhuntingCompanyConsultants} — presentational; all data resolved, no fetch/store/i18n. */
export interface HeadhuntingCompanyConsultantsProps {
    /** First load, nothing in hand → the grid shimmers in place (co-located). Owned by the connected file. */
    isSkeleton?: boolean
    /** Settled with zero consultants for the active company → the empty message. */
    isEmpty?: boolean
    /** Truthy → the error message (beats loading + empty). The connected file passes its settled fetch error. */
    error?: unknown
    /** Retries both loader queries (companies + consultants). */
    onRetry?: () => void
    /** Consultants for the active company, already filtered + sorted. */
    consultants: Array<ConsultantEntity>
    labels: HeadhuntingCompanyConsultantsLabels
}

/**
 * One placeholder card for the loading grid. `ConsultantCard` carries no
 * `isSkeleton` prop of its own (reported in `missingSkeletonSupport`), so this
 * mirrors its box MINIMALLY — square avatar + two text lines — with
 * `Skeleton.*` pieces, co-located right here rather than as a separate
 * hand-kept skeleton component.
 */
const ConsultantSkeletonCard = () => (
    <SurfaceCard
        isSkeleton
        body={() => (
            <StackV gap={3} items={[
                () => <Skeleton className="aspect-square w-full rounded-2xl" />,
                () => <Skeleton.Typography type="h5" width="3/4" />,
                () => <Skeleton.Typography type="body-sm" width="1/2" />,
            ]} />
        )}
    />
)

/**
 * `_HeadhuntingCompanyConsultants` — grid of consultant cards for one
 * headhunting company; the presentational half of {@link
 * import("./index").HeadhuntingCompanyConsultants}. Three states in the fixed
 * order error → empty → content: `error` falls to the shared
 * `AsyncContentError` composite, settled `isEmpty` to `AsyncContentEmpty`,
 * otherwise the responsive card grid renders — while shimmering it shows
 * {@link SKELETON_CARD_COUNT} placeholder cards holding the SAME grid shape
 * (loading-and-skeleton.md). See `tiers/split.md` — the connected
 * `index.tsx` owns the fetch, the redux reads, and every `t()` call.
 *
 * @param props - {@link HeadhuntingCompanyConsultantsProps}
 */
export const _HeadhuntingCompanyConsultants = ({
    isSkeleton = false,
    isEmpty = false,
    error,
    onRetry,
    consultants,
    labels,
}: HeadhuntingCompanyConsultantsProps) => {
    // error beats a stale loading flag; empty only once settled (BLOCK-8) — the
    // empty/error surfaces are the shared `AsyncContent*` composites, not
    // hand-written JSX (loading-and-skeleton.md §6).
    if (error) {
        return <AsyncContentError title={labels.errorTitle} onRetry={onRetry} retryLabel={labels.retry} />
    }
    if (!isSkeleton && isEmpty) {
        return <AsyncContentEmpty title={labels.emptyTitle} />
    }

    // While shimmering, placeholder cards keep the SAME grid shape; otherwise
    // one cell per real consultant.
    const items: Array<GridItem> = isSkeleton
        ? Array.from({ length: SKELETON_CARD_COUNT }, (_unused, index) => ({
            key: `pending-${index}`,
            content: ConsultantSkeletonCard,
        }))
        : consultants.map((consultant) => ({
            key: consultant.id,
            content: () => <ConsultantCard consultant={consultant} />,
        }))

    return (
        <div data-tier="block" data-component="HeadhuntingCompanyConsultants">
            <Grid columns={{ base: 1, sm: 2, lg: 3 }} gap={3} items={items} />
        </div>
    )
}
