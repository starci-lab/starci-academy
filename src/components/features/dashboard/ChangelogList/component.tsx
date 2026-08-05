import React from "react"
import { AsyncContentError } from "@/components/composites/async/AsyncContent"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { SurfaceListCard, SurfaceListCardItem } from "@/components/blocks/cards/SurfaceListCard"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { Typography } from "@/components/atoms/text/Typography"
import { StackH, StackV } from "@/components/frames/Stack"
import { ChangelogCategory } from "@/modules/api/graphql/queries/types/changelog-entries"

/** How many placeholder rows the co-located skeleton shows while entries load. */
const SKELETON_ROW_COUNT = 4

/**
 * Tailwind classes for each category chip. Style, not data — stays in the
 * presentational half; the connected file only resolves the chip's LABEL text.
 */
const CATEGORY_CLASS: Record<ChangelogCategory, string> = {
    [ChangelogCategory.Feature]: "bg-success/15 text-success-soft-foreground",
    [ChangelogCategory.Fix]: "bg-warning/15 text-warning-soft-foreground",
    [ChangelogCategory.Announcement]: "bg-secondary/15 text-secondary",
}

/** One render-ready row: dates/labels already resolved by the connected `ChangelogList`. */
export interface ChangelogListEntry {
    /** Entry id — used as the row key. */
    id: string
    /** Publish date, already locale-formatted. */
    formattedDate: string
    /** Category chip, or `undefined` when the entry carries none. */
    category?: ChangelogCategory
    /** Already-translated category label — paired with `category` (both or neither). */
    categoryLabel?: string
    /** Optional "read more" destination — present renders the title as a link. */
    linkUrl?: string
    /** Headline. */
    title: string
    /** Optional short body. */
    body?: string
}

/** All display text, already localized by the connected `ChangelogList`; a story passes i18n keys. */
export interface ChangelogListLabels {
    /** Section heading, shown as the `LabeledCard` label (framed) or the inline heading (flat). */
    title: string
    /** Error-branch title (settled fetch error, nothing in hand). */
    loadError: string
    /** Error-branch retry button label — paired with `onRetry`. */
    retry: string
}

/** Props for {@link _ChangelogList} — presentational; all data resolved, no fetch/store/i18n. */
export interface ChangelogListProps {
    /** First load, nothing in hand → the whole tree shimmers in place (co-located). Owned by the connected file. */
    isSkeleton?: boolean
    /** Settled with zero entries and no error → the whole block hides (label/frame included). */
    isEmpty?: boolean
    /** Truthy → the error message (beats a stale loading flag). The connected file passes its settled fetch error. */
    error?: unknown
    /** Retry handler — paired with `labels.retry` to show a retry button on the error branch. */
    onRetry?: () => void
    /** The dated changelog rows, newest first. */
    entries?: Array<ChangelogListEntry>
    /**
     * When true, render inside a `LabeledCard` (title as a Label OUTSIDE the card) —
     * used on the dashboard Overview tab. Defaults to the flat heading + list.
     */
    framed?: boolean
    labels: ChangelogListLabels
}

/**
 * One placeholder row — mirrors a real row's shape (meta line + title + body) so the
 * loaded list does not jump in when it resolves (loading-and-skeleton.md). `SurfaceListCard`/
 * `SurfaceListCardItem` carry no `isSkeleton` of their own, so this hand-mirrors the row's
 * content right where it sits instead of pulling in a separate skeleton tree.
 */
const SkeletonRow = () => (
    <SurfaceListCardItem>
        <StackV gap={2} items={[
            () => (
                <StackH gap={2} items={[
                    () => <Skeleton.Typography type="body-xs" width="1/4" />,
                    () => <Skeleton className="h-4 w-16 shrink-0 rounded-full" />,
                ]} />
            ),
            () => <Skeleton.Typography type="body-sm" width="3/4" />,
            () => <Skeleton.Typography type="body-sm" width="1/2" />,
        ]} />
    </SurfaceListCardItem>
)

/** One real row: date + optional category chip, title (link when `linkUrl` is set), optional body. */
const EntryRow = ({ entry }: { entry: ChangelogListEntry }) => {
    // local consts (not `entry.category` property reads) so narrowing survives into the
    // nested `items` closures below — TS drops property narrowing across a callback boundary.
    const { formattedDate, category, categoryLabel, linkUrl, title, body } = entry
    return (
        <SurfaceListCardItem>
            <StackV gap={2} items={[
                () => (
                    <StackH gap={2} items={[
                        () => <Typography size="xs" color="muted" text={formattedDate} />,
                        ...(category && categoryLabel ? [() => (
                            <span className={`rounded-full px-2 py-0 text-xs font-medium ${CATEGORY_CLASS[category]}`}>
                                {categoryLabel}
                            </span>
                        )] : []),
                    ]} />
                ),
                () => (linkUrl ? (
                    <Typography
                        size="sm"
                        weight="medium"
                        isLink
                        underlineOnHover
                        href={linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        text={title}
                    />
                ) : (
                    <Typography size="sm" weight="medium" text={title} />
                )),
                ...(body ? [() => <Typography size="sm" color="muted" text={body} />] : []),
            ]} />
        </SurfaceListCardItem>
    )
}

/**
 * GitHub-style "Latest from our changelog" list for the dashboard right rail — the
 * presentational half of {@link import("./index").ChangelogList}. Each row shows the
 * published date, an optional colored category chip and the title (linked when the
 * entry has a destination). Four states in the fixed order error → loading → empty →
 * content: `error` falls to the shared `AsyncContentError` frame; settled + empty +
 * no error hides the WHOLE block (label/frame included, unchanged behaviour); otherwise
 * the one row tree renders with `isSkeleton` threaded to every leaf, and placeholder
 * rows keep the SAME `SurfaceListCard` shape while shimmering (loading-and-skeleton.md).
 * See `tiers/split.md` — the connected `index.tsx` owns the fetch and i18n.
 *
 * @param props - {@link ChangelogListProps}
 */
export const _ChangelogList = ({
    isSkeleton = false,
    isEmpty = false,
    error,
    onRetry,
    entries = [],
    framed = false,
    labels,
}: ChangelogListProps) => {
    // settled, no error, nothing to show → hide the whole block, label included (unchanged behaviour)
    if (!isSkeleton && !error && isEmpty) {
        return null
    }

    const list = error ? (
        <AsyncContentError title={labels.loadError} onRetry={onRetry} retryLabel={labels.retry} />
    ) : (
        <SurfaceListCard>
            {isSkeleton
                ? Array.from({ length: SKELETON_ROW_COUNT }, (_unused, index) => <SkeletonRow key={index} />)
                : entries.map((entry) => <EntryRow key={entry.id} entry={entry} />)}
        </SurfaceListCard>
    )

    if (framed) {
        return (
            <LabeledCard
                frameless
                label={labels.title}
                identity={{ tier: "block", component: "ChangelogList" }}
            >
                {list}
            </LabeledCard>
        )
    }

    // flat: inline heading + list (legacy placement).
    return (
        <StackV
            gap={3}
            identity={{ tier: "block", component: "ChangelogList" }}
            items={[
                () => <Typography size="base" weight="semibold" text={labels.title} />,
                () => list,
            ]}
        />
    )
}
