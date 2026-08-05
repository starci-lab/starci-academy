import React from "react"
import { AsyncContentEmpty, AsyncContentError } from "@/components/composites/async/AsyncContent"
import { ConsultantCard, type ConsultantCardConsultant } from "@/components/blocks/consultant/ConsultantCard"
import { Grid, type GridItem } from "@/components/frames/Grid"

/** Placeholder card count while the first load is in flight. */
const SKELETON_CARD_COUNT = 3

/** Resting tiles hand this as `onOpen` — `ConsultantCard.isSkeleton` refuses presses, so it never fires. */
const NOOP = () => {}

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
    consultants: Array<ConsultantCardConsultant>
    /** Fired with the pressed consultant's id — the connected half owns what opening means. */
    onOpenConsultant: (id: string) => void
    labels: HeadhuntingCompanyConsultantsLabels
}

/**
 * `_HeadhuntingCompanyConsultants` — grid of consultant cards for one
 * headhunting company; the presentational half of {@link
 * import("./index").HeadhuntingCompanyConsultants}. Three states in the fixed
 * order error → empty → content: `error` falls to the shared
 * `AsyncContentError` composite, settled `isEmpty` to `AsyncContentEmpty`,
 * otherwise the responsive card grid renders.
 *
 * While shimmering the grid maps over the SAME {@link ConsultantCard} with its
 * own `isSkeleton` — one description of a tile, so the resting shape cannot
 * drift from the loaded one (`loading-and-skeleton.md`). See `tiers/split.md` —
 * the connected `index.tsx` owns the fetch, the redux reads, and every `t()`.
 *
 * @param props - {@link HeadhuntingCompanyConsultantsProps}
 */
export const _HeadhuntingCompanyConsultants = ({
    isSkeleton = false,
    isEmpty = false,
    error,
    onRetry,
    consultants,
    onOpenConsultant,
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

    const items: Array<GridItem> = isSkeleton
        ? Array.from({ length: SKELETON_CARD_COUNT }, (_unused, index) => ({
            key: `pending-${index}`,
            content: () => (
                <ConsultantCard
                    consultant={{ id: `pending-${index}`, fullName: "" }}
                    onOpen={NOOP}
                    isSkeleton
                />
            ),
        }))
        : consultants.map((consultant) => ({
            key: consultant.id,
            content: () => <ConsultantCard consultant={consultant} onOpen={onOpenConsultant} />,
        }))

    return (
        <Grid
            identity={{ tier: "block", component: "HeadhuntingCompanyConsultants" }}
            columns={{ base: 1, sm: 2, lg: 3 }}
            gap={3}
            items={items}
        />
    )
}
