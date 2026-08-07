import type { Meta, StoryObj } from "@storybook/nextjs"
import { FeatureCard } from "@sb-components/mia-mia/composites/cards/FeatureCard"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const DocIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1B1622" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M6 2h9l5 5v15H6zM15 2v5h5M9 13h6M9 17h6" />
    </svg>
)

/**
 * COMPOSITE — `FeatureCard`: one cell of the "three ways to get better" row — an
 * icon tile, a title, a short pitch, and a learn-more link, on a tilted
 * hard-shadowed surface.
 *
 * One prop = one leaf: `tone` · `tilt`.
 *
 * Not leafed (wiring/content props with no enumerable visual state of their own):
 *   - `icon` — a required slot, but purely content: the tile is a fixed size-12
 *     box regardless of which SVG is passed, so there is no state to enumerate,
 *     only which glyph. Every leaf below supplies its own.
 *   - `title` / `description` / `ctaLabel` — freeform text content; every leaf
 *     supplies its own.
 *   - `ctaHref` — the link destination, not an appearance choice.
 *   - `className` — placement from the caller; appearance stays owned here.
 */
const meta: Meta<typeof FeatureCard> = {
    title: "MiaMia/FeatureCard",
    component: FeatureCard,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof FeatureCard>

/**
 * `FeatureCard` renders its own tile, heading, paragraph and link directly — no
 * wrapped HeroUI element and no sub-component of its own with a story to jump to
 * — so there is nothing to annotate.
 */
const ANNOTATE: Record<string, AnatomyAnnotation> = {}

/** Bare leaf — no prop turned on, showing the default look (`tone="white"`, `tilt="left"`). */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="max-w-sm p-8">
            <BlockAnatomy
                name="FeatureCard"
                tier="composite"
                annotate={ANNOTATE}
                leaf="No prop turned on"
                reason="The repeating cell of the product-pillars row. This leaf is the baseline: tone falls back to white, tilt to left, so every leaf below differs from it by exactly one prop."
                states={[
                    {
                        name: "no prop turned on (tone = white, tilt = left)",
                        why: "A white, left-leaning card carrying the icon tile, title, description and CTA link — the shape a bare FeatureCard call renders before tone or tilt is turned on.",
                        code: "<FeatureCard icon={<DocIcon />} title=\"National exam practice\" description=\"Real provincial exams, graded instantly against the server key.\" ctaLabel=\"Try a sample exam\" ctaHref=\"#\" />",
                        render: (
                            <FeatureCard
                                icon={<DocIcon />}
                                title="National exam practice"
                                description="Real provincial exams, graded instantly against the server key."
                                ctaLabel="Try a sample exam"
                                ctaHref="#"
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `tone` — 2 surface fills, the FULL union. */
export const Tones: Story = {
    render: () => (
        <div data-tier="fixture" className="max-w-sm p-8">
            <BlockAnatomy
                name="FeatureCard"
                tier="composite"
                annotate={ANNOTATE}
                leaf="Prop `tone`"
                reason="The three-across pillar row alternates white and blush so neighbouring cards read as distinct stickers rather than one continuous block."
                states={[
                    {
                        name: "tone = \"white\" (default)",
                        why: "The default surface, taken by the first and third card in the row.",
                        code: "<FeatureCard icon={<DocIcon />} title=\"National exam practice\" description=\"Real provincial exams, graded instantly against the server key.\" ctaLabel=\"Try a sample exam\" ctaHref=\"#\" tone=\"white\" />",
                        render: (
                            <FeatureCard
                                icon={<DocIcon />}
                                title="National exam practice"
                                description="Real provincial exams, graded instantly against the server key."
                                ctaLabel="Try a sample exam"
                                ctaHref="#"
                                tone="white"
                            />
                        ),
                    },
                    {
                        name: "tone = \"blush\"",
                        why: "The accent surface, taken by the middle card of the row, so the eye lands on it between two white siblings.",
                        code: "<FeatureCard icon={<DocIcon />} title=\"Vocabulary by game\" description=\"Four speed games: beat monsters to remember words, defend a base, match pairs.\" ctaLabel=\"Play now\" ctaHref=\"#\" tone=\"blush\" />",
                        render: (
                            <FeatureCard
                                icon={<DocIcon />}
                                title="Vocabulary by game"
                                description="Four speed games: beat monsters to remember words, defend a base, match pairs."
                                ctaLabel="Play now"
                                ctaHref="#"
                                tone="blush"
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `tilt` — 2 resting rotations, the FULL union. */
export const Tilts: Story = {
    render: () => (
        <div data-tier="fixture" className="max-w-sm p-8">
            <BlockAnatomy
                name="FeatureCard"
                tier="composite"
                annotate={ANNOTATE}
                leaf="Prop `tilt`"
                reason="The cards lean alternately for the sticker-board feel — this is placement rotation, independent of which surface colour the card carries."
                states={[
                    {
                        name: "tilt = \"left\" (default)",
                        why: "A slight counter-clockwise lean, the resting angle the first card in the row takes.",
                        code: "<FeatureCard icon={<DocIcon />} title=\"National exam practice\" description=\"Real provincial exams, graded instantly against the server key.\" ctaLabel=\"Try a sample exam\" ctaHref=\"#\" tilt=\"left\" />",
                        render: (
                            <FeatureCard
                                icon={<DocIcon />}
                                title="National exam practice"
                                description="Real provincial exams, graded instantly against the server key."
                                ctaLabel="Try a sample exam"
                                ctaHref="#"
                                tilt="left"
                            />
                        ),
                    },
                    {
                        name: "tilt = \"right\"",
                        why: "The mirrored lean, so the middle or last card of the row tips the opposite way and the row reads as scattered stickers rather than a grid.",
                        code: "<FeatureCard icon={<DocIcon />} title=\"Vocabulary by game\" description=\"Four speed games: beat monsters to remember words, defend a base, match pairs.\" ctaLabel=\"Play now\" ctaHref=\"#\" tilt=\"right\" />",
                        render: (
                            <FeatureCard
                                icon={<DocIcon />}
                                title="Vocabulary by game"
                                description="Four speed games: beat monsters to remember words, defend a base, match pairs."
                                ctaLabel="Play now"
                                ctaHref="#"
                                tilt="right"
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
