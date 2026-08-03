import React from "react"
import { NbPill } from "@sb-components/mia-mia/atoms/data-display/NbPill"
import { cn } from "../../../_cn"

/** Tilt of the sticker on the board. */
export type StickerTilt = "left" | "right" | "straight"

interface StickerBase {
    /** Resting rotation — the stickers fan out at slightly different angles. */
    tilt?: StickerTilt
    /** Whether the card bobs with the gentle float animation. */
    float?: boolean
    /** Placement class from the caller (position + width in the hero cluster). */
    className?: string
}

/**
 * Props for {@link StickerCard} — a discriminated union on `variant`, so each shape
 * carries exactly the fields it renders and no others.
 */
export type StickerCardProps = StickerBase & (
    | {
        /** A submitted mock-exam paper: title, timing, score, status. */
        variant: "paper"
        title: React.ReactNode
        metaLabel: React.ReactNode
        scoreLabel: React.ReactNode
        score: React.ReactNode
        statusLabel: React.ReactNode
    }
    | {
        /** A vocabulary flashcard: the word, its phonetics, its meaning. */
        variant: "flashcard"
        word: React.ReactNode
        phonetic: React.ReactNode
        meaning: React.ReactNode
    }
    | {
        /** A tutor speech bubble: Mia's avatar letter beside a line of coaching. */
        variant: "tutor"
        avatarText: React.ReactNode
        quote: React.ReactNode
    }
)

const TILT: Record<StickerTilt, string> = {
    left: "-rotate-6",
    right: "rotate-6",
    straight: "rotate-0",
}

const SURFACE: Record<StickerCardProps["variant"], string> = {
    paper: "bg-[var(--nb-blush)]",
    flashcard: "bg-white",
    tutor: "bg-[var(--nb-mint)]",
}

/**
 * The neo-brutalist "study sticker": a tilted, hard-shadowed card that comes in three
 * content shapes — a submitted `paper`, a `flashcard`, and a `tutor` bubble. It is the
 * repeating shape of the hero cluster and is reused wherever the product's three pillars
 * need a tangible face. Purely presentational and props-only; a discriminated `variant`
 * keeps each shape's fields honest, and colour comes from `var(--nb-*)` alone.
 *
 * `tilt` and `float` are the sticker's placement on the board; the caller passes width
 * and absolute position through `className`.
 *
 * @param props - {@link StickerCardProps}
 * @see Story: .storybook/stories/mia-mia/composites/cards/StickerCard/StickerCard.stories
 */
export const StickerCard = (props: StickerCardProps) => {
    const { tilt = "straight", float = false, className } = props
    return (
        <div
            className={cn(
                "rounded-3xl border-2 border-[var(--nb-ink)] p-3 shadow-[var(--nb-shadow)]",
                TILT[tilt],
                SURFACE[props.variant],
                float && "nbFloat",
                className,
            )}
        >
            {props.variant === "paper" && (
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between text-sm font-extrabold text-[var(--nb-ink)]">
                        <span>{props.title}</span>
                        <NbPill tone="white" size="sm">{props.metaLabel}</NbPill>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="h-2 rounded border border-[var(--nb-ink)] bg-white" />
                        <div className="h-2 w-3/5 rounded border border-[var(--nb-ink)] bg-white" />
                    </div>
                    <div className="flex items-end justify-between">
                        <div className="flex flex-col gap-0">
                            <span className="text-xs font-bold text-[var(--nb-muted)]">{props.scoreLabel}</span>
                            <span className="text-4xl font-extrabold leading-none text-[var(--nb-pink-deep)]">{props.score}</span>
                        </div>
                        <NbPill tone="sun" size="sm">{props.statusLabel}</NbPill>
                    </div>
                </div>
            )}

            {props.variant === "flashcard" && (
                <div className="flex flex-col gap-1">
                    <span className="text-2xl font-extrabold text-[var(--nb-ink)]">{props.word}</span>
                    <span className="text-sm font-semibold text-[var(--nb-muted)]">{props.phonetic}</span>
                    <span className="font-semibold text-[var(--nb-ink)]">{props.meaning}</span>
                </div>
            )}

            {props.variant === "tutor" && (
                <div className="flex items-start gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl border-2 border-[var(--nb-ink)] bg-[var(--nb-pink)] font-extrabold text-white shadow-[2px_2px_0_0_var(--nb-ink)]">
                        {props.avatarText}
                    </span>
                    <span className="text-sm font-semibold text-[var(--nb-ink)]">{props.quote}</span>
                </div>
            )}
        </div>
    )
}
