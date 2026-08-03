import React from "react"
import { SurfaceCardNested, type SurfaceCardNestedSection } from "@/components/composites/cards/SurfaceCard"
import { AsyncContent, type AsyncContentErrorProps } from "@/components/composites/async/AsyncContent"
import { Typography } from "@/components/atoms/text/Typography"

/**
 * `ChangelogList` — the dashboard right-rail "What's new" list: dated rows with
 * an optional category, a title that links to the entry when it has a
 * destination, and an optional one-line body. `SurfaceCardNested` owns the
 * card-in-card frame; `AsyncContent` owns the error/loading/empty/content
 * switch. `isLoading` and `error` each swap the whole region; an empty
 * `entries` array renders nothing.
 */

/** Category of a changelog entry — mirrors `ChangelogCategory` (backend-sourced enum). */
export type ChangelogCategory = "feature" | "fix" | "announcement"

/** One changelog row — plain DATA; the block builds the meta line, link target and body styling. */
export interface ChangelogListEntry {
    /** Stable id — the React key. */
    id: string
    /** Headline. */
    title: string
    /** Short body under the title. Row has no third line when absent. */
    body?: string | null
    /** Drives the meta line's trailing label via {@link CATEGORY_LABEL}. Row has no category text when absent. */
    category?: ChangelogCategory | null
    /** ISO publish date — the block formats it (`vi-VN`). */
    publishedAt: string
    /** "Read more" destination. Present → the whole row becomes a link (see file header). */
    linkUrl?: string | null
}

/** Props for {@link ChangelogList}. */
export interface ChangelogListProps {
    /** The recent changelog entries, newest first. REQUIRED — see file header §R0. */
    entries: Array<ChangelogListEntry>
    /** `true` → the list's own fetch is in flight; own LEAF (see file header). */
    isLoading: boolean
    /** Truthy → the list falls to its error message; own LEAF (beats loading/empty). */
    error?: unknown
    /** Fired when the reader presses "Retry" on the error branch. Omit to render the error with no action. */
    onRetry?: () => void
    /** Extra classes on the root. */
    className?: string
}

/** The block's own section label — matches `dashboard.changelog` in `vi.json`. */
const TITLE = "What's new"

/** category → meta-line label — the block's own vocabulary (§14d.1), never handed in by a caller. */
const CATEGORY_LABEL: Record<ChangelogCategory, string> = {
    feature: "Feature",
    fix: "Fix",
    announcement: "Announcement",
}

const ERROR_TITLE = "Couldn't load the changelog. Please try again."
const RETRY_LABEL = "Retry"

/** How many placeholder rows mirror the list while `entries` hasn't landed yet. */
const SKELETON_ROW_COUNT = 4

/** Formats an ISO date the same way across every row — the block's one date rule. */
const formatDate = (iso: string) => new Date(iso).toLocaleDateString("vi-VN")

/** One row's meta line: the formatted date, plus the category label when present. */
const metaLine = (entry: ChangelogListEntry): string => {
    const category = entry.category ? CATEGORY_LABEL[entry.category] : null
    return category ? `${formatDate(entry.publishedAt)} · ${category}` : formatDate(entry.publishedAt)
}

/** Placeholder rows for the loading mirror — no data, no press target (§12c). */
const skeletonItems = (): Array<SurfaceCardNestedSection> =>
    Array.from({ length: SKELETON_ROW_COUNT }, (_unused, index) => ({
        key: `skeleton-${index}`,
        eyebrow: "x",
        title: "x",
        content: () => <Typography size="sm" color="muted" isSkeleton text="x" />,
    }))

/** One real row: meta line, title (linked when `linkUrl` is set), optional body. */
const entryItem = (entry: ChangelogListEntry): SurfaceCardNestedSection => ({
    key: entry.id,
    eyebrow: metaLine(entry),
    title: entry.title,
    content: entry.body ? () => <Typography size="sm" color="muted" text={entry.body} /> : undefined,
    href: entry.linkUrl ?? undefined,
})

/**
 * The dashboard "What's new" rail. See the file header for the full contract,
 * the leaf boundary reasoning and the judgement calls (meta-line text instead
 * of a chip, whole-row link, no outer label wrapper, plain-text body).
 *
 * @param props - {@link ChangelogListProps}
 */
const ChangelogList = ({
    entries,
    isLoading,
    error,
    onRetry,
    className,
}: ChangelogListProps) => {
    const errorContent: AsyncContentErrorProps = {
        title: ERROR_TITLE,
        onRetry,
        retryLabel: onRetry ? RETRY_LABEL : undefined,

    }

    return (
        <div className={className}>
            <AsyncContent
                isLoading={isLoading}
                skeleton={() => (
                    <SurfaceCardNested
                        title={TITLE}
                        items={skeletonItems()}
                        isSkeleton
                    />
                )}
                isEmpty={entries.length === 0}
                error={error}
                errorContent={errorContent}
                content={() => (
                    <SurfaceCardNested
                        title={TITLE}
                        items={entries.map(entryItem)}
                    />
                )}
            />
        </div>
    )
}

export { ChangelogList }
