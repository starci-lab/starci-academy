import React from "react"
import { Card, CardContent, Typography, cn } from "@heroui/react"
import { StatusChip } from "../../chips/StatusChip/StatusChip"
import type { StatusChipTone } from "../../chips/StatusChip/StatusChip"
import { Skeleton } from "../../skeleton/Skeleton/Skeleton"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STORYBOOK-LOCAL DESIGN SPEC — ported faithfully from the per-feedback row
 * rendered inline inside `@/components/features/profile/Settings/MyFeedback`
 * (no standalone component existed in `src` — this factors that row out into
 * its own reusable block). Authored in Storybook (not `src`); synced later.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Which surface produced the feedback — drives the {@link StatusChip} tone. */
export type FeedbackSource = "challenge" | "task" | "cv"

/** Maps a {@link FeedbackSource} to a {@link StatusChipTone} (mirrors `SOURCE_COLOR_MAP`). */
const SOURCE_TONE_MAP: Record<FeedbackSource, StatusChipTone> = {
    challenge: "accent",
    task: "warning",
    cv: "success",
}

/** Props for {@link FeedbackListItem}. */
export interface FeedbackListItemProps {
    /** Which surface produced this feedback — drives the leading chip's tone. */
    source: FeedbackSource
    /** Localised label rendered inside the source chip (e.g. "Challenge"). The
     * block stays presentational — the caller resolves the i18n string. */
    sourceLabel: string
    /** Feedback title/headline. */
    title: string
    /** Already-formatted date string (the caller owns locale formatting). */
    date: string
    /** Related course title, when the feedback is course-scoped. Omit to hide the line. */
    courseTitle?: string | null
    /** The feedback body/summary text. */
    summary: string
    /** `true` → render the skeleton MIRROR (same Card frame, same rows) instead of content. */
    isSkeleton?: boolean
    /** Extra classes on the card root. */
    className?: string
}

/**
 * A single received-feedback row: source chip (tone by {@link FeedbackSource}),
 * title, right-aligned date, an optional related-course line, and the feedback
 * summary. Purely presentational — stack these inside a `flex flex-col gap-3`
 * list (as `MyFeedback` does).
 *
 * @param props - {@link FeedbackListItemProps}
 */
export const FeedbackListItem = ({
    source,
    sourceLabel,
    title,
    date,
    courseTitle,
    summary,
    isSkeleton = false,
    className,
}: FeedbackListItemProps) => {
    if (isSkeleton) {
        return (
            <Card className={cn(className)}>
                <CardContent className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <Skeleton.Chip />
                        <Skeleton.Typography type="body-sm" width="1/3" />
                    </div>
                    <Skeleton.Typography type="body-sm" width="3/4" />
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className={cn(className)}>
            <CardContent className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center gap-3">
                    <StatusChip tone={SOURCE_TONE_MAP[source] ?? "accent"}>
                        {sourceLabel}
                    </StatusChip>
                    <Typography type="body-sm" weight="medium">
                        {title}
                    </Typography>
                    <Typography type="body-xs" color="muted" className="ml-auto">
                        {date}
                    </Typography>
                </div>
                {courseTitle ? (
                    <Typography type="body-xs" color="muted">
                        {courseTitle}
                    </Typography>
                ) : null}
                <Typography type="body-sm" color="muted">
                    {summary}
                </Typography>
            </CardContent>
        </Card>
    )
}
