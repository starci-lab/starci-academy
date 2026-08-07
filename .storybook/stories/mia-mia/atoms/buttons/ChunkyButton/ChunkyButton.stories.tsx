import type { Meta, StoryObj } from "@storybook/nextjs"
import { ChunkyButton } from "@sb-components/mia-mia/atoms/buttons/ChunkyButton"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const Arrow = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 12h13M13 6l6 6-6 6" />
    </svg>
)

/**
 * ATOM — `ChunkyButton`: the neo-brutalist marketing CTA link, hard-shadowed and
 * pressable, that the surface repeats everywhere — nav, hero, feature links, the
 * closing banner.
 *
 * One prop = one leaf: `tone` · `size` · `shadow` · `endIcon`.
 *
 * Not leafed (wiring/content props with no enumerable visual state of their own):
 *   - `children` — freeform label content; every leaf supplies its own.
 *   - `href` — the link destination, not an appearance choice.
 *   - `className` — placement from the caller; appearance stays owned here.
 */
const meta: Meta<typeof ChunkyButton> = {
    title: "MiaMia/ChunkyButton",
    component: ChunkyButton,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ChunkyButton>

/**
 * `ChunkyButton` renders a single `<a>` with no wrapped HeroUI element and no
 * sub-component of its own to name — the border, shadow and press motion all live
 * on that one node — so there is nothing to annotate.
 */
const ANNOTATE: Record<string, AnatomyAnnotation> = {}

/** Bare leaf — no prop turned on, showing the default look (`tone="pink"`, `size="md"`, `shadow="ink"`). */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ChunkyButton"
                tier="atom"
                annotate={ANNOTATE}
                leaf="No prop turned on"
                reason="The one CTA link the whole marketing surface repeats. This leaf is the baseline: tone falls back to pink, size to md, shadow to ink, so every leaf below differs from it by exactly one prop."
                states={[
                    {
                        name: "no prop turned on (tone = pink, size = md, shadow = ink)",
                        why: "A hard-shadowed pink link at its default box height, the shape the button takes whenever a caller passes nothing but href and a label. This is the plainest call the atom accepts.",
                        code: "<ChunkyButton href=\"#\">Start learning free</ChunkyButton>",
                        render: <ChunkyButton href="#">Start learning free</ChunkyButton>,
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `tone` — 3 colour ROLES, rendering the FULL union. */
export const Tones: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ChunkyButton"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Prop `tone`"
                reason="tone is a colour ROLE, never a hex picked at the call site: pink carries the primary action, sun the secondary, ink is reserved. Choosing by role keeps every CTA on the surface using the same two working colours in the same two jobs."
                states={[
                    {
                        name: "tone = \"pink\"",
                        why: "The primary CTA, white text on the filled pink surface — the one action a beat wants most, such as starting the free trial. Only one pink button belongs in a given view.",
                        code: "<ChunkyButton href=\"#\" tone=\"pink\">Start learning free</ChunkyButton>",
                        render: <ChunkyButton href="#" tone="pink">Start learning free</ChunkyButton>,
                    },
                    {
                        name: "tone = \"sun\"",
                        why: "The secondary action, ink text on the sunny fill, sitting beside a pink primary without competing with it — the shape a \"view a real exam\" link takes next to \"start learning free\".",
                        code: "<ChunkyButton href=\"#\" tone=\"sun\">View a real exam</ChunkyButton>",
                        render: <ChunkyButton href="#" tone="sun">View a real exam</ChunkyButton>,
                    },
                    {
                        name: "tone = \"ink\"",
                        why: "The reserved role: a dark-filled, cream-text button for a spot the two live roles do not yet cover. No surface reaches for it today, but the atom carries the fill so a future dark-on-dark CTA does not have to invent one.",
                        code: "<ChunkyButton href=\"#\" tone=\"ink\">Reserved</ChunkyButton>",
                        render: <ChunkyButton href="#" tone="ink">Reserved</ChunkyButton>,
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
                name="ChunkyButton"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Prop `size`"
                reason="size is scale only, it never changes tone or shadow. md fits a nav or inline CTA; lg is reserved for the hero and the closing banner, where the button is the one thing the eye should land on."
                states={[
                    {
                        name: "size = \"md\" (default)",
                        why: "The button renders at its default padding, the scale a nav bar or an inline CTA next to body text takes.",
                        code: "<ChunkyButton href=\"#\">Start learning free</ChunkyButton>",
                        render: <ChunkyButton href="#" size="md">Start learning free</ChunkyButton>,
                    },
                    {
                        name: "size = \"lg\"",
                        why: "The button grows to its largest padding and its text jumps a step, the scale reserved for a hero headline's CTA or the closing banner, where nothing on the surface should out-weigh it.",
                        code: "<ChunkyButton href=\"#\" size=\"lg\">Start learning free</ChunkyButton>",
                        render: <ChunkyButton href="#" size="lg">Start learning free</ChunkyButton>,
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `shadow` — the offset hard-shadow colour cast, `ink` on light surfaces and `cream` on the dark banner. */
export const Shadow: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ChunkyButton"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Prop `shadow`"
                reason="The offset shadow is drawn in a fixed colour, so it must be told what it is sitting on: ink reads on every light fill, but an ink shadow against the dark banner disappears into it, which is what the cream variant exists to fix."
                states={[
                    {
                        name: "shadow = \"ink\" (default, on a light surface)",
                        why: "The default ink shadow casts a visible dark offset behind the button on the page's own light background, giving it the hard-edged lift the whole system uses.",
                        code: "<ChunkyButton href=\"#\" shadow=\"ink\">Start learning free</ChunkyButton>",
                        render: <ChunkyButton href="#" shadow="ink">Start learning free</ChunkyButton>,
                    },
                    {
                        name: "shadow = \"cream\", on the dark banner",
                        why: "Switched to cream the moment the button sits on the ink-filled closing banner — an ink shadow on an ink surface would vanish, so this is the one place the prop is ever turned on.",
                        code: "<div className=\"rounded-3xl bg-[var(--nb-ink)] p-8\"><ChunkyButton href=\"#\" shadow=\"cream\">Start learning free</ChunkyButton></div>",
                        render: (
                            <div className="rounded-3xl bg-[var(--nb-ink)] p-8">
                                <ChunkyButton href="#" shadow="cream">Start learning free</ChunkyButton>
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf for prop `endIcon` — a trailing slot, coverage declared by call shape (present / absent) since the prop is not a union. */
export const EndIcon: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ChunkyButton"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Prop `endIcon`"
                reason="A trailing glyph slot, typically an arrow or a play triangle, for a CTA that wants to read as forward motion. Left unset, the button is label-only, the shape most in-body links take."
                states={[
                    {
                        name: "endIcon not set",
                        why: "The button renders as label only, the shape a plain link such as \"View a real exam\" takes when no onward motion needs signalling.",
                        code: "<ChunkyButton href=\"#\">Start learning free</ChunkyButton>",
                        render: <ChunkyButton href="#">Start learning free</ChunkyButton>,
                    },
                    {
                        name: "endIcon = <Arrow />",
                        why: "The arrow grows after the label, the shape the primary hero CTA takes to read as forward motion — start, then go.",
                        code: "<ChunkyButton href=\"#\" endIcon={<Arrow />}>Start learning free</ChunkyButton>",
                        render: <ChunkyButton href="#" endIcon={<Arrow />}>Start learning free</ChunkyButton>,
                    },
                ]}
            />
        </div>
    ),
}
