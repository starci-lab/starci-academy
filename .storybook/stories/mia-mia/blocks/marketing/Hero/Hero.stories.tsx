import type { Meta, StoryObj } from "@storybook/nextjs"
import { Hero, type HeroProps } from "@sb-components/mia-mia/blocks/marketing/Hero"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `Hero`: the landing hero, the first screen a visitor sees. An eyebrow
 * pill, a two-line headline with two hand-drawn scribble accents, a supporting
 * paragraph, primary + secondary CTAs, and a floating cluster of three sticker
 * cards.
 *
 * One prop = one leaf: every string and object field renders text or a shape a
 * reader can see, so every field in `HeroProps` gets its own leaf below — nine in
 * total. Presentational and props-only: the two scribbles and the cluster
 * arrangement are intrinsic to the block, everything else is passed in.
 *
 * One per page, directly under the header.
 */
const meta: Meta<typeof Hero> = {
    title: "MiaMia/Hero",
    component: Hero,
    tags: ["autodocs"],
}

export default meta

type Story = StoryObj<typeof Hero>

/**
 * `Hero` composes three nested components: the eyebrow `NbPill`, the primary and
 * secondary `ChunkyButton` CTAs, and three `StickerCard`s (one component reused
 * per `variant`). The two scribble SVGs and the headline/paragraph text are
 * elements the block draws itself, so they get no entry of their own.
 */
const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "NbPill": { tier: "atom", role: "the eyebrow pill above the headline, carrying the star icon and the sun tone", storyId: "miamia-nbpill--default" },
    "ChunkyButton": { tier: "atom", role: "the primary and secondary CTA pair — pink leads to the app, sun with a trailing play glyph opens a sample exam", storyId: "miamia-chunkybutton--default" },
    "StickerCard": { tier: "composite", role: "the three floating cards in the hero cluster — a submitted paper, a flashcard, and a tutor bubble — one component reused per `variant`", storyId: "miamia-stickercard--default" },
}

/** Every field at its shipped default — each leaf overrides exactly one of these. */
const HERO_BASE: HeroProps = {
    eyebrow: "National exam prep · play to get better",
    headlineLead: "Get better at English,",
    headlineUnderline: "pass the exam",
    headlineBreakLead: "with no",
    headlineCircled: "limits",
    description:
        "Real national exam papers, graded instantly with no leaked answers. Learn vocabulary through games, race friends in a live exam room, and keep Mia — your AI teaching assistant — coaching you around the clock.",
    primaryCta: { label: "Start learning free", href: "#" },
    secondaryCta: { label: "View a real exam", href: "#" },
    stickers: {
        paper: { title: "National exam 2026", metaLabel: "50 questions · 60 min", scoreLabel: "Your score", score: "8.5", statusLabel: "Submitted" },
        flashcard: { word: "resilient", phonetic: "/rɪˈzɪliənt/ · adj", meaning: "resilient, persistent" },
        tutor: { avatarText: "M", quote: "This one traps you on the present perfect — try again!" },
    },
}

/** Leaf for prop `eyebrow` — the pill copy above the headline. */
export const Eyebrow: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Hero"
                tier="block"
                annotate={ANNOTATE}
                leaf="Prop `eyebrow`"
                reason="The eyebrow names who this page is for before the headline makes its promise — it is the smallest, first-read line in the block, sitting inside the `NbPill` atom rather than plain text."
                states={[
                    {
                        name: "eyebrow = \"National exam prep · play to get better\" (typical)",
                        why: "A two-clause eyebrow sizes the pill to a comfortable line of copy, the length the hero actually ships with.",
                        code: "<Hero {...HERO_BASE} eyebrow=\"National exam prep · play to get better\" />",
                        render: <Hero {...HERO_BASE} eyebrow="National exam prep · play to get better" />,
                    },
                    {
                        name: "eyebrow = short phrase",
                        why: "The pill shrinks to fit a shorter phrase rather than stretching to a fixed width, since it is an inline-flex label sized to its own content.",
                        code: "<Hero {...HERO_BASE} eyebrow=\"Play. Learn. Score higher.\" />",
                        render: <Hero {...HERO_BASE} eyebrow="Play. Learn. Score higher." />,
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `headlineLead` — headline line 1, the plain lead before the underlined phrase. */
export const HeadlineLead: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Hero"
                tier="block"
                annotate={ANNOTATE}
                leaf="Prop `headlineLead`"
                reason="The lead sets up the sentence the underlined phrase finishes, so it renders in the same plain weight as the rest of the headline, with none of the two scribble accents."
                states={[
                    {
                        name: "headlineLead = \"Get better at English,\" (typical)",
                        why: "A short lead clause leaves most of the first line to the underlined phrase that follows it.",
                        code: "<Hero {...HERO_BASE} headlineLead=\"Get better at English,\" />",
                        render: <Hero {...HERO_BASE} headlineLead="Get better at English," />,
                    },
                    {
                        name: "headlineLead = long clause",
                        why: "At the headline's clamp'd size a longer lead pushes the underlined phrase further along the line, or onto a wrap, rather than overflowing the column.",
                        code: "<Hero {...HERO_BASE} headlineLead=\"Prepare for the national exam the fun way,\" />",
                        render: <Hero {...HERO_BASE} headlineLead="Prepare for the national exam the fun way," />,
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `headlineUnderline` — the phrase carrying the pink underline scribble. */
export const HeadlineUnderline: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Hero"
                tier="block"
                annotate={ANNOTATE}
                leaf="Prop `headlineUnderline`"
                reason="The underline scribble SVG sits at a width relative to its own wrapping span, so it always tracks whatever text this prop carries rather than a fixed pixel width."
                states={[
                    {
                        name: "headlineUnderline = \"pass the exam\" (typical)",
                        why: "A short phrase keeps the underline scribble within the first headline line, the length the hero ships with.",
                        code: "<Hero {...HERO_BASE} headlineUnderline=\"pass the exam\" />",
                        render: <Hero {...HERO_BASE} headlineUnderline="pass the exam" />,
                    },
                    {
                        name: "headlineUnderline = single word",
                        why: "The scribble's width is a percentage of the span it sits under, so a single short word still gets a underline sized to it rather than one calibrated for the longer default phrase.",
                        code: "<Hero {...HERO_BASE} headlineUnderline=\"win\" />",
                        render: <Hero {...HERO_BASE} headlineUnderline="win" />,
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `headlineBreakLead` — headline line 2, the plain lead before the circled phrase. */
export const HeadlineBreakLead: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Hero"
                tier="block"
                annotate={ANNOTATE}
                leaf="Prop `headlineBreakLead`"
                reason="This lead opens the headline's second line, right after the hard `<br />`, in the same plain weight the first line's lead uses — it carries neither scribble accent."
                states={[
                    {
                        name: "headlineBreakLead = \"with no\" (typical)",
                        why: "A short lead sets up the circled phrase that finishes the sentence right after it, the shape the hero ships with.",
                        code: "<Hero {...HERO_BASE} headlineBreakLead=\"with no\" />",
                        render: <Hero {...HERO_BASE} headlineBreakLead="with no" />,
                    },
                    {
                        name: "headlineBreakLead = long clause",
                        why: "A longer lead pushes the circled phrase further along the second line, verifying the line still reads cleanly at the headline's largest clamp'd size.",
                        code: "<Hero {...HERO_BASE} headlineBreakLead=\"and never hit a single\" />",
                        render: <Hero {...HERO_BASE} headlineBreakLead="and never hit a single" />,
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `headlineCircled` — the phrase carrying the pink circle scribble. */
export const HeadlineCircled: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Hero"
                tier="block"
                annotate={ANNOTATE}
                leaf="Prop `headlineCircled`"
                reason="The circle scribble is drawn with fixed percentage offsets calibrated for a short word, and the phrase itself renders in the pink-deep colour rather than the headline's ink — the one word in the whole headline that is both circled and coloured."
                states={[
                    {
                        name: "headlineCircled = \"limits\" (typical)",
                        why: "A single short word sits inside the hand-drawn circle exactly the way the scribble's offsets were calibrated for.",
                        code: "<Hero {...HERO_BASE} headlineCircled=\"limits\" />",
                        render: <Hero {...HERO_BASE} headlineCircled="limits" />,
                    },
                    {
                        name: "headlineCircled = shorter word",
                        why: "A shorter word still sits inside the circle since the scribble's own width also scales off the span, though the circle was drawn for a word close to this length rather than a much longer phrase.",
                        code: "<Hero {...HERO_BASE} headlineCircled=\"cap\" />",
                        render: <Hero {...HERO_BASE} headlineCircled="cap" />,
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `description` — the supporting paragraph, capped at `max-w-[34ch]`. */
export const Description: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Hero"
                tier="block"
                annotate={ANNOTATE}
                leaf="Prop `description`"
                reason="The paragraph is the one place the hero can spell out what the product actually does, once the headline has already made the emotional pitch — it renders muted and capped narrow so it never competes with the headline above it."
                states={[
                    {
                        name: "description = full paragraph (typical)",
                        why: "At the 34-character cap a three-sentence paragraph wraps across several short lines rather than stretching wide, the length the hero ships with.",
                        code: "<Hero {...HERO_BASE} description=\"Real national exam papers, graded instantly with no leaked answers. Learn vocabulary through games, race friends in a live exam room, and keep Mia — your AI teaching assistant — coaching you around the clock.\" />",
                        render: <Hero {...HERO_BASE} description="Real national exam papers, graded instantly with no leaked answers. Learn vocabulary through games, race friends in a live exam room, and keep Mia — your AI teaching assistant — coaching you around the clock." />,
                    },
                    {
                        name: "description = one short line",
                        why: "A terse one-line description still sits comfortably under the headline, confirming the block does not depend on a paragraph of a particular length to look finished.",
                        code: "<Hero {...HERO_BASE} description=\"Real exams. Real scores. No limits.\" />",
                        render: <Hero {...HERO_BASE} description="Real exams. Real scores. No limits." />,
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `primaryCta` — the pink `ChunkyButton` into the app. */
export const PrimaryCta: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Hero"
                tier="block"
                annotate={ANNOTATE}
                leaf="Prop `primaryCta`"
                reason="The primary CTA is the one action the hero wants most, so it renders as the pink `ChunkyButton` with no icon — the heaviest, plainest shape the atom offers, matched against the secondary's sun tone and play glyph."
                states={[
                    {
                        name: "primaryCta = { label: \"Start learning free\", href: \"#\" } (typical)",
                        why: "A short imperative label keeps the button compact beside the secondary CTA, the shape the hero ships with.",
                        code: "<Hero {...HERO_BASE} primaryCta={{ label: \"Start learning free\", href: \"#\" }} />",
                        render: <Hero {...HERO_BASE} primaryCta={{ label: "Start learning free", href: "#" }} />,
                    },
                    {
                        name: "primaryCta = long label",
                        why: "A longer label grows the button along with it instead of truncating, since `ChunkyButton` sizes to its own content.",
                        code: "<Hero {...HERO_BASE} primaryCta={{ label: \"Create your free study account now\", href: \"#\" }} />",
                        render: <Hero {...HERO_BASE} primaryCta={{ label: "Create your free study account now", href: "#" }} />,
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `secondaryCta` — the sun `ChunkyButton`, trailing a play glyph. */
export const SecondaryCta: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Hero"
                tier="block"
                annotate={ANNOTATE}
                leaf="Prop `secondaryCta`"
                reason="The secondary CTA offers a lower-stakes way to see the product first — the sun tone and the trailing play triangle are the block's own decision, not part of this prop, so only the label and destination come from the caller."
                states={[
                    {
                        name: "secondaryCta = { label: \"View a real exam\", href: \"#\" } (typical)",
                        why: "A short label pairs beside the primary CTA without competing with its pink weight, the shape the hero ships with.",
                        code: "<Hero {...HERO_BASE} secondaryCta={{ label: \"View a real exam\", href: \"#\" }} />",
                        render: <Hero {...HERO_BASE} secondaryCta={{ label: "View a real exam", href: "#" }} />,
                    },
                    {
                        name: "secondaryCta = long label",
                        why: "A longer label grows the sun button the same way a longer primary label grows the pink one, confirming both CTAs follow one sizing rule.",
                        code: "<Hero {...HERO_BASE} secondaryCta={{ label: \"Watch a sample exam walkthrough\", href: \"#\" }} />",
                        render: <Hero {...HERO_BASE} secondaryCta={{ label: "Watch a sample exam walkthrough", href: "#" }} />,
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `stickers` — copy for the three floating `StickerCard`s. */
export const Stickers: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Hero"
                tier="block"
                annotate={ANNOTATE}
                leaf="Prop `stickers`"
                reason="The three sticker cards are the hero's tangible proof — a submitted paper, a flashcard, a tutor bubble — and every field they show comes from this one object; the block only decides their tilt, float and position."
                states={[
                    {
                        name: "stickers = default cluster",
                        why: "A finished paper (8.5, Submitted), a mid-difficulty flashcard, and an encouraging tutor line together read as three different proof points, the content the hero ships with.",
                        code: `<Hero
    {...HERO_BASE}
    stickers={{
        paper: { title: "National exam 2026", metaLabel: "50 questions · 60 min", scoreLabel: "Your score", score: "8.5", statusLabel: "Submitted" },
        flashcard: { word: "resilient", phonetic: "/rɪˈzɪliənt/ · adj", meaning: "resilient, persistent" },
        tutor: { avatarText: "M", quote: "This one traps you on the present perfect — try again!" },
    }}
/>`,
                        render: (
                            <Hero
                                {...HERO_BASE}
                                stickers={{
                                    paper: { title: "National exam 2026", metaLabel: "50 questions · 60 min", scoreLabel: "Your score", score: "8.5", statusLabel: "Submitted" },
                                    flashcard: { word: "resilient", phonetic: "/rɪˈzɪliənt/ · adj", meaning: "resilient, persistent" },
                                    tutor: { avatarText: "M", quote: "This one traps you on the present perfect — try again!" },
                                }}
                            />
                        ),
                    },
                    {
                        name: "stickers = a paper still in progress",
                        why: "Every field in the cluster is a straight pass-through, so a mid-grading paper, a different word, and a different tutor line all render exactly as given, with no formatting or validation of their own.",
                        code: `<Hero
    {...HERO_BASE}
    stickers={{
        paper: { title: "National exam 2026", metaLabel: "50 questions · 60 min", scoreLabel: "Your score", score: "—", statusLabel: "Grading…" },
        flashcard: { word: "ambiguous", phonetic: "/æmˈbɪɡjuəs/ · adj", meaning: "unclear, open to more than one meaning" },
        tutor: { avatarText: "M", quote: "Watch the tense here — the exam loves this trap." },
    }}
/>`,
                        render: (
                            <Hero
                                {...HERO_BASE}
                                stickers={{
                                    paper: { title: "National exam 2026", metaLabel: "50 questions · 60 min", scoreLabel: "Your score", score: "—", statusLabel: "Grading…" },
                                    flashcard: { word: "ambiguous", phonetic: "/æmˈbɪɡjuəs/ · adj", meaning: "unclear, open to more than one meaning" },
                                    tutor: { avatarText: "M", quote: "Watch the tense here — the exam loves this trap." },
                                }}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
