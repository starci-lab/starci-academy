import React from "react"
import { SealCheckIcon } from "@phosphor-icons/react"
import { AsyncContentEmpty, AsyncContentError } from "@/components/composites/async/AsyncContent"
import { CheckListCard, CheckListItem } from "@/components/blocks/cards/CheckListCard"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { Typography } from "@/components/atoms/text/Typography"

/** How many placeholder rows the co-located skeleton shows while the course is first loading. */
const SKELETON_ROW_COUNT = 4

/** One value-proposition bullet line. */
export interface CourseValuePropsItem {
    id: string
    text: string
}

/** All display text, already localized by the connected `CourseValueProps`; a story passes i18n keys. */
export interface CourseValuePropsLabels {
    /** Section label rendered above the card by `LabeledCard`. */
    label: string
    errorTitle: string
    retry: string
    emptyTitle: string
    emptyDescription: string
}

/** Props for {@link _CourseValueProps} — presentational; all data resolved, no fetch/store/i18n. */
export interface CourseValuePropsProps {
    /** First load, nothing in hand → the row list shimmers in place (co-located). Owned by the connected file. */
    isSkeleton?: boolean
    /** Settled with zero value props → the empty message (beats content, loses to loading). */
    isEmpty?: boolean
    /** Truthy → the error message (beats loading + empty). The connected file passes its fetch error. */
    error?: unknown
    /** Retry handler, paired with `labels.retry` on the error branch. */
    onRetry?: () => void
    /** The value-proposition rows, in display order. */
    items?: Array<CourseValuePropsItem>
    labels: CourseValuePropsLabels
}

/**
 * "What you'll get" section: the course value propositions as a checked-list card,
 * placed high (right after the hero) so the benefit lands before the price. Presentational
 * half of {@link CourseValueProps} — three states in the fixed order error → loading →
 * empty → content: `error` falls to the shared `AsyncContentError` frame, settled-empty to
 * `AsyncContentEmpty`, and otherwise the same `CheckListCard` renders with `isSkeleton`
 * threaded into every row's `Typography` so the shimmer mirrors the loaded shape
 * (loading-and-skeleton.md). The section label stays visible in every branch — only the
 * card body switches. See `tiers/split.md` — the connected `index.tsx` owns the fetch and i18n.
 *
 * @param props - {@link CourseValuePropsProps}
 */
const _CourseValueProps = ({
    isSkeleton = false,
    isEmpty = false,
    error,
    onRetry,
    items = [],
    labels,
}: CourseValuePropsProps) => {
    // error beats a stale loading flag; empty only once settled (BLOCK-8 order).
    const body = () => {
        if (error) {
            return <AsyncContentError title={labels.errorTitle} onRetry={onRetry} retryLabel={labels.retry} />
        }
        if (!isSkeleton && isEmpty) {
            return (
                <AsyncContentEmpty
                    icon={SealCheckIcon}
                    title={labels.emptyTitle}
                    description={labels.emptyDescription}
                />
            )
        }

        // ROWS — while shimmering, placeholder rows keep the SAME `CheckListItem` shape/count
        // (loading-and-skeleton.md §1: same row component, same count shape).
        const rows: Array<CourseValuePropsItem> = isSkeleton
            ? Array.from({ length: SKELETON_ROW_COUNT }, (_unused, index) => ({ id: `pending-${index}`, text: "" }))
            : items

        return (
            <CheckListCard>
                {rows.map((item) => (
                    <CheckListItem key={item.id}>
                        <Typography size="sm" text={item.text} isSkeleton={isSkeleton} />
                    </CheckListItem>
                ))}
            </CheckListCard>
        )
    }

    return (
        <LabeledCard
            label={labels.label}
            frameless
            identity={{ tier: "block", component: "CourseValueProps" }}
        >
            {body()}
        </LabeledCard>
    )
}

export { _CourseValueProps }
