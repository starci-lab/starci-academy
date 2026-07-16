"use client"

import React from "react"
import {
    Button,
    Typography,
    cn,
} from "@heroui/react"
import {
    ArrowRightIcon,
} from "@phosphor-icons/react"
import { ProgressMeter } from "@/components/blocks/stats/ProgressMeter"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"

/** Goal-gradient progress toward the next rank/tier, shown as a thin meter. */
export interface StandingHeroProgress {
    /** Fill ratio, clamped to `0..1`. */
    ratio: number
    /** Muted line above the meter (e.g. "Còn 40 điểm nữa để vào top thăng hạng"). */
    label: React.ReactNode
}

/** Props for the {@link StandingHeroCard} block. */
export interface StandingHeroCardProps extends WithClassNames<undefined> {
    /** Leading badge/icon — a `LeagueTierBadge` (weekly) or a scope icon (global). */
    badge?: React.ReactNode
    /** Primary standing line (e.g. "Hạng #1 · Bronze" / "Hạng #9 toàn nền tảng"). */
    rankLabel: React.ReactNode
    /** Secondary meta under the rank — points · movement · reset countdown. */
    meta?: React.ReactNode
    /** Optional goal-gradient meter toward the next rank/tier. */
    progress?: StandingHeroProgress
    /** CTA label — the north-star funnel to courses ("Làm challenge để leo hạng"). */
    ctaLabel: React.ReactNode
    /** CTA press handler. */
    onCta: () => void
}

/**
 * The "your standing" hero at the top of each leaderboard board — the emotional
 * hook + the ONE conversion action. Shows the viewer's own rank/tier/points, an
 * optional goal-gradient meter toward the next rank (motivation), and a single
 * primary CTA that funnels to courses (the north-star: climb by learning).
 *
 * Presentational + props-only; the board owns the data + the CTA target. Accent
 * lives only in the meter fill + the primary CTA (a bounded hero, NOT an
 * accent-flooded section — `accent-system`).
 *
 * @param props - {@link StandingHeroCardProps}
 */
export const StandingHeroCard = ({
    badge,
    rankLabel,
    meta,
    progress,
    ctaLabel,
    onCta,
    className,
}: StandingHeroCardProps) => (
    <div className={cn("flex flex-col gap-4 rounded-3xl bg-surface p-5 shadow-surface", className)}>
        <div className="flex items-center gap-4">
            {badge ? <div className="shrink-0">{badge}</div> : null}
            <div className="flex min-w-0 flex-col gap-1">
                <Typography type="h6" weight="bold" truncate>
                    {rankLabel}
                </Typography>
                {meta ? (
                    <Typography type="body-sm" color="muted">
                        {meta}
                    </Typography>
                ) : null}
            </div>
        </div>

        {progress ? (
            /* canonical goal-gradient meter (ProgressMeter) — label above + accent fill */
            <ProgressMeter
                value={Math.min(1, Math.max(0, progress.ratio)) * 100}
                max={100}
                label={progress.label}
            />
        ) : null}

        <Button variant="primary" className="w-fit" onPress={onCta}>
            {ctaLabel}
            <ArrowRightIcon aria-hidden focusable="false" className="size-5" />
        </Button>
    </div>
)

export default StandingHeroCard
