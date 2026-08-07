import type { Meta, StoryObj } from "@storybook/nextjs"
import { StickerCard } from "@sb-components/mia-mia/composites/cards/StickerCard"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * COMPOSITE — `StickerCard`: the tilted, hard-shadowed "study sticker" that comes
 * in three content shapes — a submitted `paper`, a `flashcard`, and a `tutor`
 * bubble — reused wherever the hero cluster needs a tangible face for the
 * product's three pillars.
 *
 * One prop = one leaf: `variant` · `tilt` · `float`.
 *
 * Not leafed (freeform content fields the discriminated `variant` carries, and
 * placement props with no enumerable visual state of their own):
 *   - `title` / `metaLabel` / `scoreLabel` / `score` / `statusLabel` (`paper`),
 *     `word` / `phonetic` / `meaning` (`flashcard`), `avatarText` / `quote`
 *     (`tutor`) — freeform text content; every leaf supplies its own.
 *   - `className` — placement (width, absolute position) from the caller;
 *     appearance stays owned here.
 */
const meta: Meta<typeof StickerCard> = {
    title: "MiaMia/StickerCard",
    component: StickerCard,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof StickerCard>

/**
 * `StickerCard` renders its `NbPill` tags and its own text nodes directly inside
 * one bordered `div` — `NbPill` has no `data-component` marker of its own to pick
 * up from the DOM, so there is nothing the anatomy scan can name here.
 */
const ANNOTATE: Record<string, AnatomyAnnotation> = {}

/** Bare leaf — no prop turned on, showing the default look (`variant="paper"`, `tilt="straight"`, `float=false`). */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="w-56 p-8">
            <BlockAnatomy
                name="StickerCard"
                tier="composite"
                annotate={ANNOTATE}
                leaf="No prop turned on"
                reason="The repeating sticker shape of the hero cluster. This leaf is the baseline: variant is required so the plain paper shape stands in for it, tilt falls back to straight, float to false, so every leaf below differs from it by exactly one prop."
                states={[
                    {
                        name: "no prop turned on but variant (variant = paper, tilt = straight, float = false)",
                        why: "A flat, untilted, unfloating paper sticker carrying its title, timing tag, score and status — the shape the shape most naturally sits in before tilt or float is turned on.",
                        code: "<StickerCard variant=\"paper\" title=\"National exam 2026\" metaLabel=\"50 questions · 60 min\" scoreLabel=\"Your score\" score=\"8.5\" statusLabel=\"Submitted\" />",
                        render: (
                            <StickerCard
                                variant="paper"
                                title="National exam 2026"
                                metaLabel="50 questions · 60 min"
                                scoreLabel="Your score"
                                score="8.5"
                                statusLabel="Submitted"
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `variant` — 3 content SHAPES, the FULL discriminated union. */
export const Variants: Story = {
    render: () => (
        <div data-tier="fixture" className="flex flex-col gap-6 p-8">
            <BlockAnatomy
                name="StickerCard"
                tier="composite"
                annotate={ANNOTATE}
                leaf="Prop `variant`"
                reason="variant is picked by the CONTENT the sticker must carry, never by the colour wanted: a submitted exam is paper, a vocabulary item is flashcard, a line of coaching is tutor. Each shape's own surface fill and field set follow from the choice."
                states={[
                    {
                        name: "variant = \"paper\"",
                        why: "A submitted mock exam: title and timing at the top, a score readout, a status tag — the blush surface fill this variant always carries.",
                        code: "<StickerCard variant=\"paper\" tilt=\"left\" title=\"National exam 2026\" metaLabel=\"50 questions · 60 min\" scoreLabel=\"Your score\" score=\"8.5\" statusLabel=\"Submitted\" />",
                        render: (
                            <div className="w-56">
                                <StickerCard variant="paper" tilt="left" title="National exam 2026" metaLabel="50 questions · 60 min" scoreLabel="Your score" score="8.5" statusLabel="Submitted" />
                            </div>
                        ),
                    },
                    {
                        name: "variant = \"flashcard\"",
                        why: "One vocabulary item: the word, its phonetics, its meaning, on the plain white surface this variant always carries.",
                        code: "<StickerCard variant=\"flashcard\" tilt=\"right\" word=\"resilient\" phonetic=\"/rɪˈzɪliənt/ · adj\" meaning=\"resilient, persistent\" />",
                        render: (
                            <div className="w-52">
                                <StickerCard variant="flashcard" tilt="right" word="resilient" phonetic="/rɪˈzɪliənt/ · adj" meaning="resilient, persistent" />
                            </div>
                        ),
                    },
                    {
                        name: "variant = \"tutor\"",
                        why: "A line of coaching from Mia beside her avatar letter, on the mint surface reserved for the tutor lane.",
                        code: "<StickerCard variant=\"tutor\" avatarText=\"M\" quote=\"This one traps you on the present perfect -- try again!\" />",
                        render: (
                            <div className="w-64">
                                <StickerCard variant="tutor" avatarText="M" quote="This one traps you on the present perfect -- try again!" />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `tilt` — 3 resting rotations, the FULL union, independent of `variant`. */
export const Tilts: Story = {
    render: () => (
        <div data-tier="fixture" className="flex flex-col gap-6 p-8">
            <BlockAnatomy
                name="StickerCard"
                tier="composite"
                annotate={ANNOTATE}
                leaf="Prop `tilt`"
                reason="tilt is the sticker's placement rotation on the board, independent of which content shape it carries — the hero cluster fans its stickers out at slightly different angles."
                states={[
                    {
                        name: "tilt = \"left\"",
                        why: "A stronger counter-clockwise lean, the angle a sticker takes on the left side of the cluster.",
                        code: "<StickerCard variant=\"paper\" tilt=\"left\" title=\"National exam 2026\" metaLabel=\"50 questions · 60 min\" scoreLabel=\"Your score\" score=\"8.5\" statusLabel=\"Submitted\" />",
                        render: (
                            <div className="w-56">
                                <StickerCard variant="paper" tilt="left" title="National exam 2026" metaLabel="50 questions · 60 min" scoreLabel="Your score" score="8.5" statusLabel="Submitted" />
                            </div>
                        ),
                    },
                    {
                        name: "tilt = \"right\"",
                        why: "The mirrored lean, the angle a sticker takes on the right side of the cluster, so the fan reads as scattered rather than mirrored.",
                        code: "<StickerCard variant=\"paper\" tilt=\"right\" title=\"National exam 2026\" metaLabel=\"50 questions · 60 min\" scoreLabel=\"Your score\" score=\"8.5\" statusLabel=\"Submitted\" />",
                        render: (
                            <div className="w-56">
                                <StickerCard variant="paper" tilt="right" title="National exam 2026" metaLabel="50 questions · 60 min" scoreLabel="Your score" score="8.5" statusLabel="Submitted" />
                            </div>
                        ),
                    },
                    {
                        name: "tilt = \"straight\" (default)",
                        why: "No rotation at all, the angle reserved for a sticker that must sit flush rather than fan out, such as one placed alone.",
                        code: "<StickerCard variant=\"paper\" tilt=\"straight\" title=\"National exam 2026\" metaLabel=\"50 questions · 60 min\" scoreLabel=\"Your score\" score=\"8.5\" statusLabel=\"Submitted\" />",
                        render: (
                            <div className="w-56">
                                <StickerCard variant="paper" tilt="straight" title="National exam 2026" metaLabel="50 questions · 60 min" scoreLabel="Your score" score="8.5" statusLabel="Submitted" />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `float` — both booleans, the gentle bob animation on or off. */
export const Float: Story = {
    render: () => (
        <div data-tier="fixture" className="flex flex-col gap-6 p-8">
            <BlockAnatomy
                name="StickerCard"
                tier="composite"
                annotate={ANNOTATE}
                leaf="Prop `float`"
                reason="float turns on the `nbFloat` bob animation reserved for the stickers scattered in the hero cluster; a sticker used flat inside a list or a grid leaves it off."
                states={[
                    {
                        name: "float = false (default)",
                        why: "The sticker sits still, the shape it takes anywhere outside the hero cluster, such as a card in a plain grid.",
                        code: "<StickerCard variant=\"paper\" float={false} title=\"National exam 2026\" metaLabel=\"50 questions · 60 min\" scoreLabel=\"Your score\" score=\"8.5\" statusLabel=\"Submitted\" />",
                        render: (
                            <div className="w-56">
                                <StickerCard variant="paper" float={false} title="National exam 2026" metaLabel="50 questions · 60 min" scoreLabel="Your score" score="8.5" statusLabel="Submitted" />
                            </div>
                        ),
                    },
                    {
                        name: "float = true",
                        why: "The sticker bobs gently in place, the motion reserved for the hero cluster where a handful of stickers hang scattered above the fold.",
                        code: "<StickerCard variant=\"paper\" float title=\"National exam 2026\" metaLabel=\"50 questions · 60 min\" scoreLabel=\"Your score\" score=\"8.5\" statusLabel=\"Submitted\" />",
                        render: (
                            <div className="w-56">
                                <StickerCard variant="paper" float title="National exam 2026" metaLabel="50 questions · 60 min" scoreLabel="Your score" score="8.5" statusLabel="Submitted" />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
