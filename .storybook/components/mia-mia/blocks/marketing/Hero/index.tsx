import React from "react"
import { NbPill } from "@sb-components/mia-mia/atoms/data-display/NbPill"
import { ChunkyButton } from "@sb-components/mia-mia/atoms/buttons/ChunkyButton"
import { StickerCard } from "@sb-components/mia-mia/composites/cards/StickerCard"

/** A hero call-to-action target. */
export interface HeroCta {
    /** Button label. */
    label: string
    /** Destination. */
    href: string
}

/** Copy for the three floating stickers in the hero cluster. */
export interface HeroStickers {
    /** The submitted-paper sticker. */
    paper: { title: string, metaLabel: string, scoreLabel: string, score: string, statusLabel: string }
    /** The vocabulary flashcard sticker. */
    flashcard: { word: string, phonetic: string, meaning: string }
    /** The tutor speech-bubble sticker. */
    tutor: { avatarText: string, quote: string }
}

/** Props for {@link Hero}. */
export interface HeroProps {
    /** Eyebrow pill copy above the headline. */
    eyebrow: string
    /** Headline line 1, plain lead. */
    headlineLead: string
    /** Headline phrase that gets the pink underline scribble. */
    headlineUnderline: string
    /** Headline line 2, plain lead. */
    headlineBreakLead: string
    /** Headline phrase that gets the circle scribble (rendered pink). */
    headlineCircled: string
    /** Supporting paragraph. */
    description: string
    /** Primary CTA (into the app). */
    primaryCta: HeroCta
    /** Secondary CTA (see the real exams). */
    secondaryCta: HeroCta
    /** Copy for the floating sticker cluster. */
    stickers: HeroStickers
}

/** Eyebrow star. */
const StarIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1B1622" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 3l2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-.5z" />
    </svg>
)

/** Play triangle for the secondary CTA. */
const PlayIcon = () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#1B1622" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M8 5v14l11-7z" />
    </svg>
)

/**
 * The marketing hero: an eyebrow pill, a two-line headline with hand-drawn scribble
 * accents, a supporting paragraph, primary + secondary {@link ChunkyButton} CTAs, and a
 * floating cluster of three {@link StickerCard}s (a submitted paper, a flashcard, a tutor
 * bubble). Presentational and props-only — every string is passed in, the CTAs and pills
 * are atoms, the stickers are composites, and the block only arranges them and owns the
 * two decorative scribbles. Colour is `var(--nb-*)` throughout.
 *
 * @param props - {@link HeroProps}
 * @see Story: .storybook/stories/mia-mia/blocks/marketing/Hero/Hero.stories
 */
export const Hero = ({
    eyebrow,
    headlineLead,
    headlineUnderline,
    headlineBreakLead,
    headlineCircled,
    description,
    primaryCta,
    secondaryCta,
    stickers,
}: HeroProps) => (
    <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 text-[var(--nb-ink)] md:grid-cols-[1.05fr_0.95fr]">
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-5">
                <NbPill tone="sun" size="md" shadow icon={<StarIcon />} className="nbRise">{eyebrow}</NbPill>
                <h1 className="nbRise2 text-[clamp(2.6rem,6vw,4.2rem)] font-extrabold leading-[1.02] tracking-tight text-balance">
                    {headlineLead}{" "}
                    <span className="relative whitespace-nowrap">{headlineUnderline}
                        <svg className="absolute -left-[2%] -bottom-3 h-5 w-[104%]" viewBox="0 0 300 22" fill="none" preserveAspectRatio="none" aria-hidden="true"><path d="M3 14 C 60 4, 120 20, 175 10 S 260 4, 297 12" stroke="var(--nb-pink)" strokeWidth="6" strokeLinecap="round" /></svg>
                    </span>
                    <br />{headlineBreakLead}{" "}
                    <span className="relative text-[var(--nb-pink-deep)]">{headlineCircled}
                        <svg className="pointer-events-none absolute -left-[9%] -top-[16%] h-[132%] w-[118%]" viewBox="0 0 220 90" fill="none" aria-hidden="true"><path d="M110 8 C 40 6, 8 26, 12 46 C 16 70, 80 84, 140 80 C 196 76, 214 52, 206 34 C 198 16, 150 8, 96 12" stroke="var(--nb-pink)" strokeWidth="4" strokeLinecap="round" /></svg>
                    </span>
                </h1>
            </div>
            <p className="nbRise3 max-w-[34ch] text-lg font-medium text-[var(--nb-muted)]">
                {description}
            </p>
            <div className="nbRise3 flex flex-wrap items-center gap-4">
                <ChunkyButton href={primaryCta.href} tone="pink" size="md">{primaryCta.label}</ChunkyButton>
                <ChunkyButton href={secondaryCta.href} tone="sun" size="md" endIcon={<PlayIcon />}>{secondaryCta.label}</ChunkyButton>
            </div>
        </div>

        <div className="relative mx-auto min-h-[420px] w-full max-w-[440px]" aria-hidden="true">
            <StickerCard
                variant="paper"
                tilt="left"
                className="nbFloat absolute left-[4%] top-0 w-56"
                title={stickers.paper.title}
                metaLabel={stickers.paper.metaLabel}
                scoreLabel={stickers.paper.scoreLabel}
                score={stickers.paper.score}
                statusLabel={stickers.paper.statusLabel}
            />
            <StickerCard
                variant="flashcard"
                tilt="right"
                className="nbFloat2 absolute right-[2%] top-11 w-52"
                word={stickers.flashcard.word}
                phonetic={stickers.flashcard.phonetic}
                meaning={stickers.flashcard.meaning}
            />
            <StickerCard
                variant="tutor"
                className="nbFloat3 absolute bottom-2 left-[14%] w-64 rotate-3"
                avatarText={stickers.tutor.avatarText}
                quote={stickers.tutor.quote}
            />
        </div>
    </section>
)
