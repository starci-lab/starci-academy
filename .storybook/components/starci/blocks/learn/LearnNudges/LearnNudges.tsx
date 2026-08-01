import React from "react"
import { ArrowRightIcon, CardsIcon, MicrophoneStageIcon, TrophyIcon } from "@phosphor-icons/react"
import { SurfaceCardList } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `LearnNudges`: WHAT TO DO TODAY.
 *
 * WHY IT EXISTS (§14a): every FUNCTION of a screen is ONE block. "What should I
 * do today" is a function, so it needs a name. Before 2026-07-25 the
 * `/learn/content` screen called `SurfaceCardList` (composite tier) directly and
 * plugged in items + picked icons itself — the screen was wiring up details on
 * the block's behalf, so reading the screen's code couldn't tell you what the
 * page does.
 *
 * §14b — THE CALLER ONLY GIVES DATA: `kind` is an ENUM, not an icon. The block
 * owns the `kind → icon` table; the screen must NOT know what "review
 * flashcards" looks like. If the prop were `leadingIcon`, the screen would have
 * to hold an atom/icon again ⇒ breaking the rule.
 *
 * §14c — the block only ASSEMBLES: shell and rhythm flow through
 * `SurfaceCardList`, the SAME layout as `KeepGoingPath` right below it. It
 * doesn't draw its own frame or pick its own border.
 * ─────────────────────────────────────────────────────────────────────────────
 */
/** Task type — a data ENUM; the block alone decides how it looks. */
export type LearnNudgeKind = "flashcards" | "interview" | "league"
/** Icon by task type — the block OWNS this table, the caller can't pick one. */
const NUDGE_ICON: Record<LearnNudgeKind, typeof CardsIcon> = {
    flashcards: CardsIcon,
    interview: MicrophoneStageIcon,
    league: TrophyIcon,
}
/** One task to do — plain DATA. */
export interface LearnNudge {
    /** Stable React key. */
    id: string
    /** Task type → decides the leading icon. */
    kind: LearnNudgeKind
    /**
     * The row's text.
     *
     * ⛔ NO separate `count` field (teacher's call 2026-07-26): the title
     * already contains the number ("Review 12 due flashcards"); showing a `12`
     * chip on the right too is **saying it twice**. One fact only ever appears
     * in ONE place within a row.
     */
    title: string
    /** Press the row. */
    onPress?: () => void
}
/** Props for {@link LearnNudges}. */
export interface LearnNudgesBaseProps {
    /** The tasks to do. */
    items: Array<LearnNudge>
    /**
     * ⏳ This strip's source is LATER the page's main data → the waiting stage
     * must hold its PLACE, not disappear and reappear.
     *
     * Real-bug anchor (source noted 2026-07-12): `dueSwr`/`leaderboardSwr`
     * resolve AFTER `outline`, so while waiting `dueCount`/`rank` default to
     * 0/null → the block used to `return null` then pop back in ⇒ **the strip
     * FLICKERED**. That's why this state exists; dropping it recreates that
     * exact bug.
     */
    isSkeleton?: boolean
    /** Number of placeholder rows when `isSkeleton`. Default 2 — the most common nudge count. */
    skeletonRows?: number
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
}
/**
 * What to do today — a shortcut list into the next learning task.
 *
 * @param props - {@link LearnNudgesBaseProps}
 */
const LearnNudgesBase = ({
    items,
    isSkeleton = false,
    skeletonRows = 2,
    showAnatomy = false,
    anatPart,
}: LearnNudgesBaseProps) => (
    <SurfaceCardList
        // The heading is OWNED by the BLOCK — the caller does NOT pass `heading`
        // (§14d.1, teacher's call 2026-07-26). This cluster always answers the
        // same one question, so the lead-in is a constant.
        label="Things to do today"
        anatPart={anatPart ?? (showAnatomy ? "SurfaceCardList" : undefined)}
        items={
            isSkeleton
                // GO THROUGH THE EXACT SAME RENDER PATH: still `SurfaceCardList`,
                // only the row content is swapped for bars. No second frame-drawing
                // branch — the same lesson as "two render paths for one shape" from
                // `KeepGoingPath`.
                ? Array.from({ length: skeletonRows }).map((_, index) => ({
                    key: `pending-${index}`,
                    title: (
                        <Typography
                            size="sm"
                            isSkeleton
                            classNames={["w-2/3"]}
                            showAnatomy={showAnatomy}
                        />
                    ),
                }))
                : items.map((item) => ({
                    key: item.id,
                    leadingIcon: NUDGE_ICON[item.kind],
                    title: item.title,
                    trailingIcon: ArrowRightIcon,
                    onPress: item.onPress,
                }))
        }
    />
)
/** `LearnNudges.*` — single-component namespace ⇒ only `.Base`. */
export { LearnNudgesBase as LearnNudges }