import React from "react"
import { ArrowRightIcon, CardsIcon, MicrophoneStageIcon, TrophyIcon, type Icon } from "@phosphor-icons/react"
import { SurfaceCardList, type SurfaceCardListItem } from "@/components/composites/cards/SurfaceCard"
import { Typography } from "@/components/atoms/text/Typography"
import type { AllowedClassName } from "@/components/atoms/_allowed-class-name"

/** Which contextual nudge a row is — the block picks the icon from this, the caller never passes a node. */
export type LearnNudgeKind = "due" | "interview" | "rank"

/** kind → leading icon (the block owns the glyph; the connected file passes only `kind`). */
const KIND_ICON: Record<LearnNudgeKind, Icon> = {
    due: CardsIcon,
    interview: MicrophoneStageIcon,
    rank: TrophyIcon,
}

/** One resolved nudge row — `kind` + already-localized `label` + its route handler. */
export interface LearnNudgeItem {
    /** Stable key. */
    key: string
    /** Which nudge — decides the leading icon. */
    kind: LearnNudgeKind
    /** Already-localized row label. */
    label: string
    /** Open the nudge's route. */
    onPress?: () => void
}

/** Props for {@link _LearnNudges} — presentational; all data resolved, no fetch/store/i18n. */
export interface LearnNudgesProps {
    /** The nudges to show, already resolved + ranked. Empty (and not shimmering) → the strip renders nothing. */
    items: Array<LearnNudgeItem>
    /**
     * `true` → a 2-row shimmer instead of self-hiding. The universal shimmer prop
     * (§ every presentational leaf speaks `isSkeleton`); the connected file decides
     * WHEN — here it forwards its own "counts still loading" flag as `isSkeleton`.
     */
    isSkeleton?: boolean
    /** Where this strip sits inside its parent. */
    classNames?: Array<AllowedClassName>
}

/**
 * Contextual "next actions" strip on the content home — the aids that orbit the course spine
 * (due flashcards, mock-interview, rank), surfaced with their REAL state so they read as timely
 * nudges, not a static link grid. Each nudge self-hides when absent from `items`; the whole strip
 * renders nothing when `items` is empty. While `isSkeleton` it shimmers the SAME `SurfaceCardList`
 * (one render path, row content swapped for bars) rather than flashing empty.
 * See `design/storybook/architecture/split.md` — the connected {@link import("./index").LearnNudges}
 * owns the fetch and i18n.
 *
 * @param props - {@link LearnNudgesProps}
 */
export const _LearnNudges = ({ items, isSkeleton = false, classNames }: LearnNudgesProps) => {
    // No timely nudge and not shimmering → render nothing (no empty card).
    if (!isSkeleton && items.length === 0) {
        return null
    }
    // ONE render path: still `SurfaceCardList`, only the row content is swapped for bars while shimmering.
    const rows: Array<SurfaceCardListItem> = isSkeleton
        ? Array.from({ length: 2 }, (_unused, index) => ({
            key: `pending-${index}`,
            content: () => <Typography size="sm" isSkeleton classNames={["w-1/2"]} />,
        }))
        : items.map((item) => ({
            key: item.key,
            leadingIcon: KIND_ICON[item.kind],
            title: item.label,
            trailingIcon: ArrowRightIcon,
            onPress: item.onPress,
        }))
    return <SurfaceCardList classNames={classNames} items={rows} />
}
