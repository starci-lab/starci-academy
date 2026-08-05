import React, { useEffect, useRef, useState } from "react"
import {
    BookOpenIcon,
    MedalIcon,
    StackIcon,
    UsersIcon,
    type Icon as PhosphorIcon,
} from "@phosphor-icons/react"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { Typography } from "@/components/atoms/text/Typography"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { Box } from "@/components/frames/Box"

/** How long a figure counts up from 0 → its value (ms). */
const COUNT_DURATION = 1500

/** A stat cell's glyph — a COMPONENT REFERENCE (`icon={UsersIcon}`), never a built node. */
export type StatStripIcon = PhosphorIcon

/** The four public counters {@link _StatStrip} shows, already resolved by the connected `StatStrip` (real data, or its fallback on fetch error). */
export interface StatStripStats {
    totalLearners: number
    totalLessons: number
    totalCourses: number
    totalBadgesEarned: number
}

/** All display text, already localized by the connected `StatStrip`; a story passes i18n keys. */
export interface StatStripLabels {
    learners: string
    lessons: string
    courses: string
    badges: string
}

/** One entry of the fixed stat order — icon + which counter/label it reads. */
interface StatCellSpec {
    key: keyof StatStripStats
    icon: StatStripIcon
    labelKey: keyof StatStripLabels
}

/** Fixed reading order of the four cells — icon paired with its counter + label. */
const STAT_CELLS: ReadonlyArray<StatCellSpec> = [
    { key: "totalLearners", icon: UsersIcon, labelKey: "learners" },
    { key: "totalLessons", icon: BookOpenIcon, labelKey: "lessons" },
    { key: "totalCourses", icon: StackIcon, labelKey: "courses" },
    { key: "totalBadgesEarned", icon: MedalIcon, labelKey: "badges" },
]

/** Props for {@link _StatStrip} — presentational; all data/text resolved, no fetch/store/i18n. */
export type StatStripProps = WithClassNames<undefined> & {
    /** First load, nothing in hand → the whole strip shimmers in place (co-located). Owned by the connected file. */
    isSkeleton?: boolean
    /** The four counters. Ignored while `isSkeleton` — each cell shows a placeholder instead of a real value. */
    stats: StatStripStats
    labels: StatStripLabels
    /**
     * Locale to format the count-up figures with (`Number.toLocaleString`). Passed as a
     * resolved prop rather than read via `useLocale()` here — `component.tsx` takes no
     * session of its own (`tiers/split.md`'s test: renderable from plain props alone).
     */
    locale: string
}

/**
 * Counts a number from 0 → `target` the first time it scrolls into view, eased
 * out via requestAnimationFrame. Respects `prefers-reduced-motion` (snaps to the
 * final figure, no animation). Returns the ref to attach + the current value.
 *
 * Skips entirely while `isSkeleton` — there is no real figure to animate toward
 * yet, and the effect re-fires on its own once `target`/`isSkeleton` change and
 * the real value arrives, so the count-up still plays exactly once.
 */
const useCountUp = (target: number, isSkeleton: boolean) => {
    const ref = useRef<HTMLDivElement>(null)
    const [value, setValue] = useState(0)

    useEffect(() => {
        if (isSkeleton) {
            return
        }
        const element = ref.current
        if (!element) {
            return
        }
        // reduced motion → show the final figure immediately
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            setValue(target)
            return
        }
        let raf = 0
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) {
                    return
                }
                // fire once — the count-up should not replay on re-entry
                observer.disconnect()
                const start = performance.now()
                const tick = (now: number) => {
                    const progress = Math.min((now - start) / COUNT_DURATION, 1)
                    // ease-out cubic: fast then settling
                    const eased = 1 - Math.pow(1 - progress, 3)
                    setValue(Math.round(target * eased))
                    if (progress < 1) {
                        raf = requestAnimationFrame(tick)
                    }
                }
                raf = requestAnimationFrame(tick)
            },
            { threshold: 0.4 },
        )
        observer.observe(element)
        return () => {
            observer.disconnect()
            cancelAnimationFrame(raf)
        }
    }, [target, isSkeleton])

    return { ref, value }
}

/** Props for {@link StatCell}. */
interface StatCellProps {
    icon: StatStripIcon
    value: number
    label: string
    locale: string
    /** Co-located shimmer — same wrapper box, icon/number/label swapped for placeholders. */
    isSkeleton?: boolean
}

/**
 * One editorial stat — a small accent icon over a count-up number over a small
 * muted label, with a left divider on desktop so the four read as a flush strip.
 * `isSkeleton` threads straight to the icon glyph, the number, and the label so
 * the shimmer mirrors this exact box (`loading-and-skeleton.md` §1).
 */
const StatCell = ({ icon: Icon, value, label, locale, isSkeleton = false }: StatCellProps) => {
    const { ref, value: shown } = useCountUp(value, isSkeleton)

    return (
        <div
            ref={ref}
            className="flex flex-col items-center gap-2 px-4 @app-md:border-l @app-md:border-default @app-md:first:border-l-0"
        >
            {isSkeleton ? (
                <Skeleton className="size-6 rounded-full" />
            ) : (
                <span className="text-accent-soft-foreground [&>svg]:size-6">
                    <Icon aria-hidden focusable="false" />
                </span>
            )}
            {isSkeleton ? (
                <Skeleton className="h-11 w-20 rounded-lg" />
            ) : (
                <div className="text-4xl font-semibold tracking-tight tabular-nums text-foreground @app-md:text-5xl">
                    {shown.toLocaleString(locale)}
                </div>
            )}
            <Typography size="sm" color="muted" text={label} isSkeleton={isSkeleton} />
        </div>
    )
}

/**
 * Live platform proof strip — the presentational half of `StatStrip` — four
 * counters (learners / lessons / courses / badges) rendered EDITORIAL: a small
 * icon over a number that counts up from 0 over a small label, separated by
 * vertical dividers (no metric cards) so the figures carry it.
 *
 * ONE tree, `isSkeleton` threaded to every leaf (`loading-and-skeleton.md` §1) —
 * there is no separate hand-kept skeleton tree. This strip never showed a
 * dedicated error or empty message: on fetch error the connected `StatStrip`
 * substitutes fallback figures (99 for every counter) so the strip still
 * renders as normal content instead of hiding or apologising — so there is no
 * `AsyncContentError`/`AsyncContentEmpty` branch here to preserve.
 *
 * @param props - {@link StatStripProps}
 */
export const _StatStrip = ({ className, isSkeleton = false, stats, labels, locale }: StatStripProps) => (
    <Box identity={{ tier: "block", component: "StatStrip" }} className={className}>
        <div className="grid grid-cols-2 gap-y-8 @app-md:grid-cols-4 @app-md:gap-0">
            {STAT_CELLS.map(({ key, icon, labelKey }) => (
                <StatCell
                    key={key}
                    icon={icon}
                    value={stats[key]}
                    label={labels[labelKey]}
                    locale={locale}
                    isSkeleton={isSkeleton}
                />
            ))}
        </div>
    </Box>
)
