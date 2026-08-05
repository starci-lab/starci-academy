import React from "react"
import type { ReactNode } from "react"
import { AsyncContentEmpty, AsyncContentError } from "@/components/composites/async/AsyncContent"
import { Grid, type GridItem } from "@/components/frames/Grid"
import { ConsultantCard } from "../ConsultantCard"
import { ConsultantCardSkeleton } from "../ConsultantCardSkeleton"
import type { ConsultantEntity } from "@/modules/types/entities/consultant"

/** Number of placeholder cards shown while the consultant list loads (mirrors the real grid's usual row). */
const SKELETON_COUNT = 6

/** All display text, already localized by the connected {@link import("./index").ConsultantGrid}; a story passes i18n keys. */
export interface ConsultantGridLabels {
    /** Settled with zero consultants — the empty state's title. */
    emptyTitle: string
    /** Settled with a fetch error — the error state's title. */
    errorTitle: string
    /** Retry-button label on the error state. */
    retry: string
}

/** Props for {@link _ConsultantGrid} — presentational; all data resolved, no fetch/store/i18n. */
export interface ConsultantGridProps {
    /** First load, nothing in hand → the grid shimmers in place (co-located). Owned by the connected file. */
    isSkeleton?: boolean
    /** Settled with zero consultants → the empty state. */
    isEmpty?: boolean
    /** Truthy → the error message (beats loading + empty). The connected file passes its settled fetch error. */
    error?: unknown
    /** Retries the failed queries. */
    onRetry?: () => void
    /** The consultants to render, already sorted by `sortIndex`. */
    consultants: Array<ConsultantEntity>
    labels: ConsultantGridLabels
}

/**
 * `_ConsultantGrid` — the presentational half of {@link import("./index").ConsultantGrid}
 * (`tiers/split.md`): a responsive grid of {@link ConsultantCard}s, each card opening its own
 * profile modal. `ConsultantCard` owns self-contained state (modal open/close, a redux read) and
 * takes no `isSkeleton` prop of its own — it is not a leaf built to mirror itself — so the loading
 * grid swaps in the co-located {@link ConsultantCardSkeleton} at the same row position instead of
 * threading a flag through it (`loading-and-skeleton.md` §1's stated exception).
 *
 * @param props - {@link ConsultantGridProps}
 */
export const _ConsultantGrid = ({
    isSkeleton = false,
    isEmpty = false,
    error,
    onRetry,
    consultants,
    labels,
}: ConsultantGridProps) => {
    const items: Array<GridItem> = isSkeleton
        ? Array.from({ length: SKELETON_COUNT }, (_unused, index) => ({
            key: `skeleton-${index}`,
            content: () => <ConsultantCardSkeleton />,
        }))
        : consultants.map((consultant) => ({
            key: consultant.id,
            content: () => <ConsultantCard consultant={consultant} />,
        }))

    // error beats a stale loading flag; empty only once settled (BLOCK-8)
    let body: ReactNode
    if (error) {
        body = <AsyncContentError title={labels.errorTitle} onRetry={onRetry} retryLabel={labels.retry} />
    } else if (!isSkeleton && isEmpty) {
        body = <AsyncContentEmpty title={labels.emptyTitle} />
    } else {
        body = <Grid columns={{ base: 1, sm: 2, lg: 3 }} gap={6} items={items} />
    }

    return (
        <div data-tier="block" data-component="ConsultantGrid">
            {body}
        </div>
    )
}
