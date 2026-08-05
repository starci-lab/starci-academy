import React from "react"
import type {
    FoundationEntity,
} from "@/modules/types/entities/foundation"
import type {
    FoundationsBreadcrumbItem,
} from "../types"
import {
    FoundationsBreadcrumbs,
} from "../shared/FoundationsBreadcrumbs"
import {
    FoundationMeta,
} from "../shared/FoundationMeta"
import {
    FoundationResourceBody,
} from "../FoundationResourceBody"
import { TrialEnrollHook } from "../../shared/TrialEnrollHook"
import { AsyncContentEmpty } from "@/components/composites/async/AsyncContent"
import { PageHeader } from "@/components/blocks/layout/PageHeader"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { Container } from "@/components/frames/Container"
import { StackV } from "@/components/frames/Stack"
import type { SkeletonProps } from "@/components/composites/_slot"

/** Props for {@link _FoundationResourceLayout}. */
export interface FoundationResourceLayoutProps {
    /** Home → courses → course → foundations hub → category → this resource, already resolved. */
    breadcrumbItems: Array<FoundationsBreadcrumbItem>
    /** First load, nothing in hand → the whole tree shimmers in place (co-located). Owned by the connected file. */
    isSkeleton?: boolean
    /** Settled with no resolved entity (bad deep-link id) → the empty message. */
    isEmpty?: boolean
    /** The resource to render. Omitted while `isSkeleton`/`isEmpty`. */
    foundation?: FoundationEntity
    /** Already-translated empty-state title. */
    emptyTitle: string
}

/**
 * Dedicated foundation resource page (replaces the old viewer modal) — the
 * presentational half of {@link FoundationResourceLayout}. Route
 * `/foundations/[categoryId]/[foundationId]`: breadcrumb → trial-enroll hook →
 * H3 header + full {@link FoundationMeta} → the markdown/video body. Capped at
 * the `md` measure (48rem, matches every other content page).
 *
 * The three body leaves — {@link PageHeader}, {@link FoundationMeta},
 * {@link FoundationResourceBody} — take no `isSkeleton` of their own and require
 * a resolved {@link FoundationEntity}, so the loading mirror for that one zone is
 * hand-built here with `Skeleton.*`, co-located in the SAME tree it stands in
 * for rather than a parallel skeleton component (loading-and-skeleton.md §1).
 *
 * @param props - {@link FoundationResourceLayoutProps}
 */
const _FoundationResourceLayout = ({
    breadcrumbItems,
    isSkeleton = false,
    isEmpty = false,
    foundation,
    emptyTitle,
}: FoundationResourceLayoutProps) => {
    // error is never surfaced by this route today (see apiChanged); the order
    // that remains is: empty (settled, nothing resolved) → content → the
    // hand-mirrored loading zone for the three leaves with no `isSkeleton`.
    const detailBody = () => {
        if (!isSkeleton && isEmpty) {
            return <AsyncContentEmpty title={emptyTitle} />
        }
        if (isSkeleton || !foundation) {
            return (
                <StackV gap={6} items={[
                    () => (
                        <StackV gap={3} items={[
                            () => <Skeleton.Typography type="h3" width="2/3" />,
                            () => <Skeleton className="h-4 w-full rounded" />,
                            () => <Skeleton className="h-5 w-40 rounded-full" />,
                        ]} />
                    ),
                    () => <Skeleton.Paragraph lines={6} />,
                ]} />
            )
        }
        return (
            <StackV gap={6} items={[
                () => (
                    <StackV gap={3} items={[
                        () => <PageHeader title={foundation.title} description={foundation.description ?? undefined} />,
                        () => <FoundationMeta foundation={foundation} />,
                    ]} />
                ),
                () => <FoundationResourceBody foundation={foundation} />,
            ]} />
        )
    }

    const rootBody = ({ isSkeleton }: SkeletonProps) => (
        <StackV gap={8} isSkeleton={isSkeleton} items={[
            () => <FoundationsBreadcrumbs items={breadcrumbItems} />,
            () => <TrialEnrollHook />,
            detailBody,
        ]} />
    )

    return (
        <Container
            size="md"
            padding={1}
            isSkeleton={isSkeleton}
            body={rootBody}
            identity={{ tier: "block", component: "FoundationResourceLayout" }}
        />
    )
}

export { _FoundationResourceLayout }
