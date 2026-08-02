import React from "react"
import { CardsIcon, MicrophoneStageIcon, TrophyIcon, type Icon } from "@phosphor-icons/react"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { SurfaceListCard, SurfaceListCardRow } from "@/components/blocks/cards/SurfaceListCard"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"

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
    onPress: () => void
}

/** Props for {@link _LearnNudges} — presentational; all data resolved, no fetch/store/i18n. */
export interface LearnNudgesProps extends WithClassNames<undefined> {
    /** The nudges to show, already resolved + ranked. Empty → the strip renders nothing. */
    items: Array<LearnNudgeItem>
    /** `true` while the underlying counts are still loading → a 2-row shimmer instead of self-hiding. */
    isPending?: boolean
}

/**
 * Contextual "next actions" strip on the content home — the aids that orbit the course spine
 * (due flashcards, mock-interview, rank), surfaced with their REAL state so they read as timely
 * nudges, not a static link grid. Each nudge self-hides when absent from `items`; the whole strip
 * renders nothing when `items` is empty. While `isPending` it shimmers rather than flashing empty.
 * See `design/storybook/architecture/split.md` — the connected {@link import("./index").LearnNudges}
 * owns the fetch and i18n.
 *
 * @param props - {@link LearnNudgesProps}
 */
export const _LearnNudges = ({ items, isPending = false, className }: LearnNudgesProps) => {
    if (isPending) {
        return (
            <SurfaceListCard className={className}>
                {[0, 1].map((row) => (
                    <div key={row} className="flex items-center gap-3 px-4 py-3">
                        <Skeleton className="size-5 shrink-0 rounded" />
                        <Skeleton.Typography type="body-sm" width="1/2" />
                    </div>
                ))}
            </SurfaceListCard>
        )
    }

    // No timely nudge → render nothing (no empty card).
    if (items.length === 0) {
        return null
    }

    return (
        <SurfaceListCard className={className}>
            {items.map((item) => {
                const Glyph = KIND_ICON[item.kind]
                return (
                    <SurfaceListCardRow
                        key={item.key}
                        hover="underline"
                        leading={<Glyph aria-hidden focusable="false" className="size-5 text-foreground" />}
                        title={item.label}
                        onPress={item.onPress}
                    />
                )
            })}
        </SurfaceListCard>
    )
}
