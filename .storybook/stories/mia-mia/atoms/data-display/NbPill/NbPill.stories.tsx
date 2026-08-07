import type { Meta, StoryObj } from "@storybook/nextjs"
import { NbPill } from "@sb-components/mia-mia/atoms/data-display/NbPill"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const Star = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1B1622" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 3l2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-.5z" />
    </svg>
)

/**
 * ATOM — `NbPill`: the smallest labelled value on the marketing surface — a hero
 * eyebrow, a card's meta tag, a status chip.
 *
 * One prop = one leaf: `tone` · `shape` · `size` · `icon` · `bordered` · `shadow`.
 *
 * Not leafed (wiring/content props with no enumerable visual state of their own):
 *   - `children` — freeform label content; every leaf supplies its own.
 *   - `className` — placement from the caller; appearance stays owned here.
 */
const meta: Meta<typeof NbPill> = {
    title: "MiaMia/NbPill",
    component: NbPill,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof NbPill>

/**
 * `NbPill` renders a single `<span>` with no wrapped HeroUI element and no
 * sub-component of its own to name — border, shadow, fill and icon slot all sit
 * on that one node — so there is nothing to annotate.
 */
const ANNOTATE: Record<string, AnatomyAnnotation> = {}

/** Bare leaf — no prop turned on, showing the default look (`tone="white"`, `shape="round"`, `size="md"`, `bordered=true`, `shadow=false`). */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="NbPill"
                tier="atom"
                annotate={ANNOTATE}
                leaf="No prop turned on"
                reason="The marketing surface's smallest labelled value. This leaf is the baseline: tone falls back to white, shape to round, size to md, bordered to true, shadow to false, so every leaf below differs from it by exactly one prop."
                states={[
                    {
                        name: "no prop turned on (tone = white, shape = round, size = md, bordered = true, shadow = false)",
                        why: "A flat white bordered pill at the default md padding, the shape a bare NbPill call renders before any prop is turned on.",
                        code: "<NbPill>50 questions · 60 min</NbPill>",
                        render: <NbPill>50 questions · 60 min</NbPill>,
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `tone` — 6 colour ROLES, rendering the FULL union. */
export const Tones: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="NbPill"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Prop `tone`"
                reason="tone is the pill's fill role, chosen for what the label means, not for the colour a designer liked that day."
                states={[
                    {
                        name: "tone = \"sun\"",
                        why: "The shadowed hero eyebrow's fill — the sunniest, most attention-getting role, reserved for the one label that sits above the headline.",
                        code: "<NbPill tone=\"sun\">National exam prep · play to get better</NbPill>",
                        render: <NbPill tone="sun">National exam prep · play to get better</NbPill>,
                    },
                    {
                        name: "tone = \"white\" (default)",
                        why: "The flat neutral fill for a card's own meta tag, low-key enough to sit inside a sticker without competing with its content.",
                        code: "<NbPill tone=\"white\">50 questions · 60 min</NbPill>",
                        render: <NbPill tone="white">50 questions · 60 min</NbPill>,
                    },
                    {
                        name: "tone = \"pink\"",
                        why: "The same fill role the primary CTA carries, white text on pink, for a pill that wants to read with the same weight as the surface's main action.",
                        code: "<NbPill tone=\"pink\">New</NbPill>",
                        render: <NbPill tone="pink">New</NbPill>,
                    },
                    {
                        name: "tone = \"mint\"",
                        why: "The tutor surface's own fill, for a pill sitting near Mia's coaching bubble rather than the exam or vocabulary lanes.",
                        code: "<NbPill tone=\"mint\">Tutor tip</NbPill>",
                        render: <NbPill tone="mint">Tutor tip</NbPill>,
                    },
                    {
                        name: "tone = \"blush\"",
                        why: "The feature card's accent fill, for a pill that needs to match the middle card of a three-across row.",
                        code: "<NbPill tone=\"blush\">Popular</NbPill>",
                        render: <NbPill tone="blush">Popular</NbPill>,
                    },
                    {
                        name: "tone = \"ink\"",
                        why: "The dark fill, cream text, for a status pill that needs to read against a light card without borrowing sun or pink's louder roles.",
                        code: "<NbPill tone=\"ink\">Submitted</NbPill>",
                        render: <NbPill tone="ink">Submitted</NbPill>,
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `shape` — round vs soft radius, the FULL union. */
export const Shapes: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="NbPill"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Prop `shape`"
                reason="shape decides how far the corners round, independent of tone or size — the pill's radius, not its colour or padding."
                states={[
                    {
                        name: "shape = \"round\" (default)",
                        why: "A full pill radius, the shape almost every eyebrow and tag on the surface takes.",
                        code: "<NbPill shape=\"round\">National exam prep · play to get better</NbPill>",
                        render: <NbPill shape="round">National exam prep · play to get better</NbPill>,
                    },
                    {
                        name: "shape = \"soft\"",
                        why: "A rounded rectangle instead of a full pill, for the rare label that needs to read as a small tag rather than a capsule.",
                        code: "<NbPill shape=\"soft\">National exam prep · play to get better</NbPill>",
                        render: <NbPill shape="soft">National exam prep · play to get better</NbPill>,
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `size` — 2 SCALE tiers. */
export const Sizes: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="NbPill"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Prop `size`"
                reason="sm is the compact meta or status tag riding inside a card; md is the hero eyebrow, sized to stand on its own above the headline."
                states={[
                    {
                        name: "size = \"sm\"",
                        why: "The tight padding and small text that fit a card's own meta line or status chip without crowding the content around it.",
                        code: "<NbPill size=\"sm\">50 questions · 60 min</NbPill>",
                        render: <NbPill size="sm">50 questions · 60 min</NbPill>,
                    },
                    {
                        name: "size = \"md\" (default)",
                        why: "The larger padding and text a standalone hero eyebrow needs to hold its own above a big headline.",
                        code: "<NbPill>National exam prep · play to get better</NbPill>",
                        render: <NbPill size="md">National exam prep · play to get better</NbPill>,
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `icon` — a leading slot, coverage declared by call shape (present / absent) since the prop is not a union. */
export const Icon: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="NbPill"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Prop `icon`"
                reason="A leading glyph slot, typically the eyebrow's star. Left unset, the pill is label only, the shape a meta tag or status chip usually takes."
                states={[
                    {
                        name: "icon not set",
                        why: "Label only, no leading glyph — the shape a card's meta tag or a status chip takes, where a decorative icon would just add noise.",
                        code: "<NbPill tone=\"white\">50 questions · 60 min</NbPill>",
                        render: <NbPill tone="white">50 questions · 60 min</NbPill>,
                    },
                    {
                        name: "icon = <Star />",
                        why: "The leading star grows before the label, the shape the hero eyebrow takes to draw the eye before the reader hits the headline underneath it.",
                        code: "<NbPill tone=\"sun\" icon={<Star />}>National exam prep · play to get better</NbPill>",
                        render: <NbPill tone="sun" icon={<Star />}>National exam prep · play to get better</NbPill>,
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `bordered` — both booleans, the 2px ink border on or off. */
export const Bordered: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="NbPill"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Prop `bordered`"
                reason="The 2px ink border is the neo-brutalist family's signature edge; turning it off is for the rare pill that needs to sit flush against a surface that already carries its own border."
                states={[
                    {
                        name: "bordered = true (default)",
                        why: "The pill carries its own 2px ink border, the edge every pill in the system shows by default.",
                        code: "<NbPill bordered>50 questions · 60 min</NbPill>",
                        render: <NbPill bordered>50 questions · 60 min</NbPill>,
                    },
                    {
                        name: "bordered = false",
                        why: "The border drops and the pill reads as a plain colour fill, for a spot where an outline would double up against a border already drawn by the card around it.",
                        code: "<NbPill bordered={false}>50 questions · 60 min</NbPill>",
                        render: <NbPill bordered={false}>50 questions · 60 min</NbPill>,
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `shadow` — both booleans, the offset hard shadow on or off. */
export const Shadow: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="NbPill"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Prop `shadow`"
                reason="The offset hard shadow lifts the pill off the page the same way the buttons and cards do; it is reserved for the one pill that stands alone above the hero headline, not for every tag on the surface."
                states={[
                    {
                        name: "shadow = false (default)",
                        why: "Flat against the page, no offset shadow — the shape a card's own meta tag or status chip takes, since it already sits inside a shadowed card.",
                        code: "<NbPill shadow={false}>50 questions · 60 min</NbPill>",
                        render: <NbPill shadow={false}>50 questions · 60 min</NbPill>,
                    },
                    {
                        name: "shadow = true",
                        why: "The offset hard shadow lifts the pill off the page, the shape the hero eyebrow takes standing alone above the headline with nothing else to lean on.",
                        code: "<NbPill tone=\"sun\" shadow icon={<Star />}>National exam prep · play to get better</NbPill>",
                        render: <NbPill tone="sun" shadow icon={<Star />}>National exam prep · play to get better</NbPill>,
                    },
                ]}
            />
        </div>
    ),
}
