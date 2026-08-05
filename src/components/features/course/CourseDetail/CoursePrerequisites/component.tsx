import React from "react"
import { ListBulletsIcon } from "@phosphor-icons/react"
import { AsyncContentEmpty, AsyncContentError } from "@/components/composites/async/AsyncContent"
import { CheckListCard, CheckListItem } from "@/components/blocks/cards/CheckListCard"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { Typography } from "@/components/atoms/text/Typography"

/** How many placeholder rows the co-located skeleton shows. */
const SKELETON_ROW_COUNT = 3

/** One prerequisite row, already sorted/resolved by the connected `CoursePrerequisites`. */
export interface CoursePrerequisiteItem {
    id: string
    text: string
}

/** All display text, already localized by the connected `CoursePrerequisites`; a story passes i18n keys. */
export interface CoursePrerequisitesLabels {
    /** Section label, rendered above the card by `LabeledCard`. */
    label: string
    errorTitle: string
    retry: string
    emptyTitle: string
    emptyDescription: string
}

/** Props for {@link _CoursePrerequisites} — presentational; all data resolved, no fetch/store/i18n. */
export interface CoursePrerequisitesProps {
    /** First load, nothing in hand → the whole tree shimmers in place (co-located). Owned by the connected file. */
    isSkeleton?: boolean
    /** Settled with an empty list → the empty message. */
    isEmpty?: boolean
    /** Truthy → the error message (beats loading + empty). The connected file passes its settled fetch error. */
    error?: unknown
    /** Retry handler — paired with `labels.retry` to show a retry button on the error branch. */
    onRetry?: () => void
    /** The prerequisite rows, already sorted by `sortIndex`. */
    items?: Array<CoursePrerequisiteItem>
    labels: CoursePrerequisitesLabels
}

/**
 * "Before you start" section — the presentational half of {@link CoursePrerequisites}: the course
 * prerequisites as a neutral bullet list (informational, NOT a warning alert; prerequisites are
 * things you need beforehand, not achievements, so rows carry no tick). Four states in the fixed
 * order error → loading → empty → content: `error` falls to the shared `AsyncContentError` frame,
 * `isEmpty` to `AsyncContentEmpty`, and otherwise the ONE real tree renders with `isSkeleton`
 * threaded to every leaf so the shimmer mirrors the loaded shape (loading-and-skeleton.md). See
 * `tiers/split.md` — the connected `index.tsx` owns the fetch, redux read, and i18n.
 *
 * @param props - {@link CoursePrerequisitesProps}
 */
export const _CoursePrerequisites = ({
    isSkeleton = false,
    isEmpty = false,
    error,
    onRetry,
    items = [],
    labels,
}: CoursePrerequisitesProps) => {
    // error beats a stale loading flag; empty only once settled (loading-and-skeleton.md §1)
    if (error) {
        return (
            <LabeledCard
                label={labels.label}
                frameless
                identity={{ tier: "block", component: "CoursePrerequisites" }}
            >
                <AsyncContentError title={labels.errorTitle} onRetry={onRetry} retryLabel={labels.retry} />
            </LabeledCard>
        )
    }
    if (!isSkeleton && isEmpty) {
        return (
            <LabeledCard
                label={labels.label}
                frameless
                identity={{ tier: "block", component: "CoursePrerequisites" }}
            >
                <AsyncContentEmpty
                    icon={ListBulletsIcon}
                    title={labels.emptyTitle}
                    description={labels.emptyDescription}
                />
            </LabeledCard>
        )
    }

    // while shimmering, placeholder rows keep the SAME CheckListCard/CheckListItem shape as the
    // resolved list, at the same fixed count the old hand-built skeleton mirrored (loading-and-skeleton.md §2)
    const rows = isSkeleton
        ? Array.from({ length: SKELETON_ROW_COUNT }, (_unused, index) => ({ id: `pending-${index}`, text: "" }))
        : items

    return (
        <LabeledCard
            label={labels.label}
            frameless
            identity={{ tier: "block", component: "CoursePrerequisites" }}
        >
            <CheckListCard>
                {rows.map((item) => (
                    <CheckListItem key={item.id} showCheck={false}>
                        <Typography size="sm" text={item.text} isSkeleton={isSkeleton} />
                    </CheckListItem>
                ))}
            </CheckListCard>
        </LabeledCard>
    )
}
