import React from "react"
import { ArrowRightIcon, CardsIcon, MicrophoneStageIcon, TrophyIcon } from "@phosphor-icons/react"
import { SurfaceCardList } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
/**
 * `LearnNudges` — the "things to do today" list. The caller passes only `kind`
 * (an enum); the block owns the `kind -> icon` table. Shares its `SurfaceCardList`
 * layout with `KeepGoingPath`. Full/single/bordered are all states of one tree;
 * `isSkeleton` gets its own leaf even though the DOM is identical.
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
    /** Task type -> decides the leading icon. */
    kind: LearnNudgeKind
    /**
 * The row's text.
 *
 * NO separate `count` field: the title
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
 * (pending) This strip's source is LATER the page's main data -> the waiting stage
 * must hold its PLACE, not disappear and reappear.
 *
 * `dueSwr`/`leaderboardSwr` resolve AFTER `outline`, so while waiting
 * `dueCount`/`rank` default to 0/null. Without this state the block would
 * `return null` then pop back in => the strip FLICKERS.
 */
    isSkeleton?: boolean
    /** Number of placeholder rows when `isSkeleton`. Default 2 — the most common nudge count. */
    skeletonRows?: number
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
}: LearnNudgesBaseProps) => (
    <SurfaceCardList
        // The heading is OWNED by the BLOCK — the caller does NOT pass `heading`.
        // This cluster always answers the same one question, so the lead-in is
        // a constant.
        label="Things to do today"

        items={
            isSkeleton
                // GO THROUGH THE EXACT SAME RENDER PATH: still `SurfaceCardList`,
                // only the row content is swapped for bars. No second frame-drawing
                // branch — the same lesson as "two render paths for one shape" from
                // `KeepGoingPath`.
                ? Array.from({ length: skeletonRows }).map((_, index) => ({
                    key: `pending-${index}`,
                    content: () => (
                        <Typography
                            size="sm"
                            isSkeleton


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
/** `LearnNudges.*` — single-component namespace => only `.Base`. */
export { LearnNudgesBase as LearnNudges }