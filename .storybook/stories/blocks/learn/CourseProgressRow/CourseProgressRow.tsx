import React from "react"
import type { ReactNode } from "react"
import { Typography, cn } from "@heroui/react"
import { IconTile } from "../../identity/IconTile/IconTile"
import type { IconTileTone } from "../../identity/IconTile/IconTile"
import { StatusChip } from "../../chips/StatusChip/StatusChip"
import { SegmentBar } from "../../stats/SegmentBar/SegmentBar"
import { Skeleton } from "../../skeleton/Skeleton/Skeleton"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — NEW block, ported faithfully from the enrolled-course
 * row shape used by `@/components/features/dashboard/CoursesTab/MyCoursesProgress/CourseRow`
 * (dashboard "hub" list) — tile · title · trial chip · % · progress bar, one whole-row
 * item inside a `SurfaceListCard`. Authored in Storybook (not `src`); synced to `src`
 * later. NO `@/components` imports.
 *
 * This block owns only the ROW CONTENT (icon + title + chip + percent + bar + meta) —
 * NOT the pressable list-row frame (`SurfaceListCardItem`/`SurfaceListCard`), which stays
 * a separate primitive the consumer wraps this in. `onPress` here only decides whether
 * the row itself renders as a plain `<div>` or a bare `<button>` with the "go-there"
 * underline-on-hover treatment (title underlines, no fill — mirrors
 * `hover-style-matches-clickable-nature`: nav rows underline, they don't tint).
 */

/** Props for {@link CourseProgressRow}. */
export interface CourseProgressRowProps {
    /** The icon (phosphor `*Icon`) — fallback when no {@link CourseProgressRowProps.src}. */
    icon: ReactNode
    /** Optional cover image filling the tile (course thumbnail); falls back to `icon`. */
    src?: string | null
    /** Alt text for the cover image. */
    alt?: string
    /** Tile tint. Defaults to "accent" (matches `IconTile`'s own default). */
    tone?: IconTileTone
    /** Primary line — the course title. */
    title: ReactNode
    /**
     * Optional trial-badge label (e.g. "Học thử"). Renders a warning-tone
     * {@link StatusChip} next to the title when set; omit for an enrolled/paid course
     * (mark the exception, not the norm — mirrors `CourseTrialChip`'s self-hiding rule).
     */
    trialLabel?: ReactNode
    /** Overall completion, 0–100 (clamped). */
    percent: number
    /** Optional secondary line under the bar (e.g. a task count or last-active date). */
    meta?: ReactNode
    /** Accessible summary of the progress bar. Defaults to a generic `"<percent>% completed"`. */
    ariaLabel?: string
    /** Press handler — renders the row as a bare interactive `<button>` (underline-hover title). */
    onPress?: () => void
    /** Extra classes on the row root. */
    className?: string
    /**
     * `true` → render the skeleton MIRROR of this row (tile + title + percent + bar),
     * keeping the exact box so a list of rows never jumps when data resolves. Every
     * other prop is ignored. Replaces a standalone skeleton component — skeleton is a
     * PROP, not a separate component (§6).
     */
    isSkeleton?: boolean
    /** Skeleton-only: reserve width for the trial-chip placeholder. Defaults to `false`. */
    withTrialChip?: boolean
    /** Skeleton-only: reserve a line for the meta placeholder. Defaults to `false`. */
    withMeta?: boolean
    /** Storybook anatomy: emit `data-anat-part` on each part so the anatomy panel can anchor badges. */
    showAnatomy?: boolean
}

/**
 * One enrolled-course progress row: tile + title + optional trial chip + percent +
 * a two-tone {@link SegmentBar} progress track, with an optional meta line — the
 * shape of a "hub" row (dashboard / settings / profile learning lists). Owns its whole
 * look so features just feed the course data; the pressable list-row frame
 * (`SurfaceListCard`/`SurfaceListCardItem`) stays a separate concern the consumer wraps
 * this in.
 *
 * @param props - {@link CourseProgressRowProps}
 */
export const CourseProgressRow = ({
    icon,
    src,
    alt = "",
    tone = "accent",
    title,
    trialLabel,
    percent,
    meta,
    ariaLabel,
    onPress,
    className,
    isSkeleton = false,
    withTrialChip = false,
    withMeta = false,
    showAnatomy = false,
}: CourseProgressRowProps) => {
    if (isSkeleton) {
        return (
            <div className={cn("flex w-full items-center gap-3 p-3", className)}>
                <Skeleton className="size-12 shrink-0 rounded-xl" />
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <div className="flex items-center justify-between gap-2">
                        <Skeleton.Typography type="body-sm" width="1/2" />
                        {withTrialChip ? <Skeleton.Chip className="h-6 w-14 shrink-0" /> : null}
                        <Skeleton className="h-3 w-8 shrink-0 rounded" />
                    </div>
                    <Skeleton.ProgressBar className="h-1" />
                    {withMeta ? <Skeleton.Typography type="body-xs" width="1/3" /> : null}
                </div>
            </div>
        )
    }

    const clamped = Math.min(100, Math.max(0, percent))
    const interactive = Boolean(onPress)

    const content = (
        <>
            <IconTile size="sm" icon={icon} src={src} alt={alt} tone={tone} anatPart={showAnatomy ? "IconTile" : undefined} />
            <div className="flex min-w-0 flex-1 flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                    <Typography
                        type="body-sm"
                        weight="medium"
                        truncate
                        className={cn(
                            "min-w-0 flex-1",
                            interactive && "underline-offset-4 decoration-[var(--separator-tertiary)] group-hover:underline",
                        )}
                        data-anat-part={showAnatomy ? "Typography · title" : undefined}
                    >
                        {title}
                    </Typography>
                    {trialLabel ? <StatusChip tone="warning" anatPart={showAnatomy ? "StatusChip" : undefined}>{trialLabel}</StatusChip> : null}
                    <Typography type="body-xs" color="muted" className="shrink-0" data-anat-part={showAnatomy ? "Typography · percent" : undefined}>
                        {clamped}%
                    </Typography>
                </div>
                <SegmentBar
                    hideLegend
                    ariaLabel={ariaLabel ?? `${clamped}% completed`}
                    anatPart={showAnatomy ? "SegmentBar" : undefined}
                    segments={[
                        { key: "done", label: "Done", value: clamped, color: "var(--success)" },
                        { key: "remaining", label: "Remaining", value: 100 - clamped, color: "var(--default)" },
                    ]}
                />
                {meta ? (
                    <Typography type="body-xs" color="muted" data-anat-part={showAnatomy ? "Typography · meta" : undefined}>
                        {meta}
                    </Typography>
                ) : null}
            </div>
        </>
    )

    // interactive row = a "go-there" nav (pressing navigates into the course), so it
    // underlines the title on hover with NO row fill — never a tinted background
    // (`hover-style-matches-clickable-nature`).
    const rowClassName = cn(
        "flex w-full items-center gap-3 p-3 text-left",
        interactive && "group cursor-pointer rounded-3xl outline-none transition-colors focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent",
        className,
    )

    if (onPress) {
        return (
            <button type="button" onClick={onPress} className={rowClassName}>
                {content}
            </button>
        )
    }
    return <div className={rowClassName}>{content}</div>
}
