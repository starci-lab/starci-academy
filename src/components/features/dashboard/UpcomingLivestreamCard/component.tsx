import React from "react"
import {
    VideoCameraIcon,
} from "@phosphor-icons/react"
import { AsyncContentError } from "@/components/composites/async/AsyncContent"
import { SectionCard } from "@/components/blocks/cards/SectionCard"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { SurfaceListCard, SurfaceListCardRow } from "@/components/blocks/cards/SurfaceListCard"
import { IconTile } from "@/components/blocks/identity/IconTile"
import { Typography } from "@/components/atoms/text/Typography"

/** How many upcoming sessions to list (the soonest plus a few more). */
export const MAX_ROWS = 3

/** One resolved upcoming-livestream row, already localized by the connected `UpcomingLivestreamCard`. */
export interface UpcomingLivestreamCardSession {
    /** Stable row key — a course can carry more than one upcoming session. */
    key: string
    /** Row title — the session title, falling back to the course title. */
    title: string
    /** Row subtitle — the course title, shown only when the title above is the session's own. */
    subtitle?: string
    /** Already-formatted relative countdown ("in Nd Nh" / "in Nh Nm" / "now"). */
    relativeLabel: string
    /** Already-formatted absolute date, in the viewer's locale. */
    dateLabel: string
    /** Course page to navigate to on press. */
    href: string
}

/** All display text, already localized by the connected `UpcomingLivestreamCard`. */
export interface UpcomingLivestreamCardLabels {
    /** Card header title. */
    title: string
    /** Error-branch title. */
    errorTitle: string
    /** Error-branch retry button label. */
    retry: string
}

/** Props for {@link _UpcomingLivestreamCard} — presentational; all data resolved, no fetch/store/i18n. */
export interface UpcomingLivestreamCardProps {
    /** First load, nothing in hand → the whole row list shimmers in place. Owned by the connected file. */
    isSkeleton?: boolean
    /** Settled with nothing upcoming → the card hides itself entirely (no emptyContent — matches the sibling right-rail widgets, e.g. `WhoToFollow`). */
    isEmpty?: boolean
    /** Truthy → the error message (beats loading + empty). The connected file passes its settled fetch error. */
    error?: unknown
    /** Retry handler — paired with `labels.retry` to show a retry button on the error branch. */
    onRetry?: () => void
    /** The soonest few sessions, already sorted, capped, and formatted. */
    sessions?: Array<UpcomingLivestreamCardSession>
    labels: UpcomingLivestreamCardLabels
}

/**
 * Right-rail card surfacing the viewer's next live sessions across enrolled courses
 * (soonest first), so a scheduled stream is visible from the home surface instead of
 * buried in a course page — the presentational half of `UpcomingLivestreamCard`. The
 * soonest session leads with a relative countdown ("in Nd Nh"); a short list of the
 * next few follows. Three states in the fixed order error → loading → empty →
 * content (BLOCK-8): `error` falls to the shared `AsyncContentError` frame, `isEmpty`
 * hides the card (no emptyContent, matching the sibling right-rail widgets that
 * self-hide rather than render an empty state), and otherwise the row list renders —
 * while shimmering, `Skeleton.ListRow` placeholders keep the SAME `SectionCard` +
 * `SurfaceListCard` shape so the box neither shrinks nor jumps when data arrives
 * (loading-and-skeleton.md). See `tiers/split.md` — the connected `index.tsx` owns
 * the fetch and i18n.
 *
 * @param props - {@link UpcomingLivestreamCardProps}
 */
export const _UpcomingLivestreamCard = ({
    isSkeleton = false,
    isEmpty = false,
    error,
    onRetry,
    sessions = [],
    labels,
}: UpcomingLivestreamCardProps) => {
    if (error) {
        return <AsyncContentError title={labels.errorTitle} onRetry={onRetry} retryLabel={labels.retry} />
    }
    if (!isSkeleton && isEmpty) {
        return null
    }

    return (
        <SectionCard
            icon={<VideoCameraIcon className="size-5 text-accent-soft-foreground" />}
            title={labels.title}
        >
            <SurfaceListCard bordered>
                {isSkeleton
                    ? Array.from({ length: MAX_ROWS }, (_unused, index) => (
                        <Skeleton.ListRow key={index} withSubtitle className="px-4" />
                    ))
                    : sessions.map((session) => (
                        <SurfaceListCardRow
                            key={session.key}
                            leading={<IconTile icon={<VideoCameraIcon />} tone="accent" size="sm" />}
                            title={session.title}
                            subtitle={session.subtitle}
                            meta={(
                                <Typography
                                    size="xs"
                                    weight="medium"
                                    color="accent-soft"
                                    text={`${session.relativeLabel} · ${session.dateLabel}`}
                                />
                            )}
                            href={session.href}
                        />
                    ))}
            </SurfaceListCard>
        </SectionCard>
    )
}
