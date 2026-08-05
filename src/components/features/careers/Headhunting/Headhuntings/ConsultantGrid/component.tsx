import React from "react"
import type { ReactNode } from "react"
import { AsyncContentEmpty, AsyncContentError } from "@/components/composites/async/AsyncContent"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { Box } from "@/components/frames/Box"
import { Grid, type GridItem } from "@/components/frames/Grid"
import { StackH, StackV } from "@/components/frames/Stack"
import type { CallerIdentity } from "@/components/frames/_identity"
import { ConsultantCard } from "../ConsultantCard"
import type { ConsultantEntity } from "@/modules/types/entities/consultant"

/** Number of placeholder cards shown while the consultant list loads (mirrors the real grid's usual row). */
const SKELETON_COUNT = 6

/** This block's own identity, handed down to whichever frame stands in as its root (`_identity.ts`, BLOCK-2). */
const IDENTITY: CallerIdentity = { tier: "block", component: "ConsultantGrid" }

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
 * Loading placeholder for one consultant card — mirrors {@link ConsultantCard}'s
 * `PressableCard` shape (avatar, name, job title, a company link row, and a
 * 3-line description) so the grid does not jump when data resolves. Co-located
 * right here (not a separate hand-kept file) since `ConsultantCard` takes no
 * `isSkeleton` prop of its own to thread through (`loading-and-skeleton.md`).
 */
const ConsultantCardSkeleton = () => (
    <Box className="rounded-3xl bg-surface px-4 py-3 shadow-surface">
        <StackV
            gap={3}
            items={[
                () => <Skeleton className="aspect-square w-full rounded-2xl" />,
                () => (
                    <StackV
                        gap={2}
                        items={[
                            () => <Skeleton.Typography type="h5" width="3/4" />,
                            () => <Skeleton.Typography type="body-sm" width="1/2" />,
                            () => (
                                <StackH
                                    gap={2}
                                    align="center"
                                    items={[
                                        () => <Skeleton className="size-5 shrink-0 rounded" />,
                                        () => <Skeleton.Typography type="body-sm" width="1/3" />,
                                    ]}
                                />
                            ),
                            () => <Skeleton.Paragraph lines={3} />,
                        ]}
                    />
                ),
            ]}
        />
    </Box>
)

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
    // `AsyncContentError`/`AsyncContentEmpty` are composite MESSAGE frames — they
    // take no `identity` prop, so those two branches' roots stay unowned (BLOCK-2's
    // fallback: no sibling frame here to carry the identity instead, and a wrapper
    // div is exactly the shape being removed).
    let body: ReactNode
    if (error) {
        body = <AsyncContentError title={labels.errorTitle} onRetry={onRetry} retryLabel={labels.retry} />
    } else if (!isSkeleton && isEmpty) {
        body = <AsyncContentEmpty title={labels.emptyTitle} />
    } else {
        body = <Grid identity={IDENTITY} columns={{ base: 1, sm: 2, lg: 3 }} gap={6} items={items} />
    }

    return body
}
