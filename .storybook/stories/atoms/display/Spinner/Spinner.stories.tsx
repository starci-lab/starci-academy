import type { Meta, StoryObj } from "@storybook/nextjs"
import { Spinner } from "@sb-components/atoms/display/Spinner/Spinner"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `Spinner`: wraps HeroUI Spinner directly, only forcing `size`/`tone` (§4).
 *
 * ⭐ LEAF atom — it composes NO atom OF OUR OWN with its own story, so it has no
 * atom-tier dep. But `data-anat-part="Spinner"` is attached to `HeroSpinner` itself —
 * ONE `@heroui/react` IMPORT rendered directly, so it still enters the tree with
 * `tier: "heroui"` (no `storyId`, the library has no story of ours to jump to) —
 * §heroui, teacher's call 2026-07-27/28. The previous version dropped `annotate`
 * entirely, conflating two different rules: "no storyId ⇒ skip the dep" (true for
 * OUR OWN atoms) was wrongly applied to the heroui node too.
 */
const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Spinner": {
        tier: "heroui",
        role: "the spinning glyph itself — the only thing this atom renders",
    },
}
const meta: Meta<typeof Spinner> = {
    title: "Atoms/Display/Spinner/Spinner",
    component: Spinner,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Spinner>

/** Bare leaf — spinner md, tone accent; `label` is the a11y name (not shown as text). */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Spinner"
                tier="atom"
                leaf="Default"
                annotate={ANNOTATE}
                reason="A busy indicator: one spinning glyph wrapping HeroUI Spinner, size/tone set by prop. No isSkeleton branch here, the spin itself IS the loading signal."
                states={[
                    {
                        name: "size = \"md\", tone = \"accent\"",
                        why: "A single spinning ring renders at the medium diameter in the accent colour, with no visible label text on screen. The `label` prop only feeds the accessible name, so a screen reader announces it while sighted users see just the glyph.",
                        code: "<Spinner label=\"Loading\" />",
                        render: <Spinner showAnatomy />,
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf prop `size` — sm · md · lg · xl, the atom forces the size itself (§4). */
export const Sizes: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Spinner"
                tier="atom"
                leaf="Prop `size`"
                annotate={ANNOTATE}
                reason="The atom owns the size scale so callers never hand-set a diameter, matching the same rule Button and IconTile follow for their own scales."
                states={[
                    {
                        name: "size = \"sm\"",
                        why: "The ring renders at its smallest diameter, the step reached for inline next to a short line of text or inside a small button. Only the diameter changes across the four size states, the ring shape and stroke stay the same.",
                        code: "<Spinner size=\"sm\" />",
                        render: <Spinner size="sm" showAnatomy />,
                    },
                    {
                        name: "size = \"md\"",
                        why: "The ring steps up to the default diameter, the size used when a spinner stands on its own rather than inline with text. Nothing else about the ring changes from the sm step.",
                        code: "<Spinner size=\"md\" />",
                        render: <Spinner size="md" showAnatomy />,
                    },
                    {
                        name: "size = \"lg\"",
                        why: "The ring grows again for a spot that needs more visual weight, such as the centre of an otherwise empty panel. The stroke thickens along with the diameter so the ring never looks thin and stretched.",
                        code: "<Spinner size=\"lg\" />",
                        render: <Spinner size="lg" showAnatomy />,
                    },
                    {
                        name: "size = \"xl\"",
                        why: "The ring reaches its largest diameter, reserved for a full-page loading moment where the spinner is the only thing on screen. It is the last step of the same four-step scale as the other three sizes.",
                        code: "<Spinner size=\"xl\" />",
                        render: <Spinner size="xl" showAnatomy />,
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf prop `tone` — accent · success · warning · danger · current (reads the container's text colour). */
export const Tones: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Spinner"
                tier="atom"
                leaf="Prop `tone`"
                annotate={ANNOTATE}
                reason="Tone lets a spinner sitting inside a coloured surface (a danger button, a success banner) read as part of that surface instead of always shipping the same accent ring."
                states={[
                    {
                        name: "tone = \"accent\"",
                        why: "The ring spins in the accent colour, the default identity tone used for a generic loading moment. Every other tone below keeps the same ring shape and only swaps this colour.",
                        code: "<Spinner tone=\"accent\" />",
                        render: <Spinner tone="accent" showAnatomy />,
                    },
                    {
                        name: "tone = \"success\"",
                        why: "The ring spins in the success colour, for a moment that is confirming something already agreed to succeed rather than a neutral wait. Only the colour differs from the accent state.",
                        code: "<Spinner tone=\"success\" />",
                        render: <Spinner tone="success" showAnatomy />,
                    },
                    {
                        name: "tone = \"warning\"",
                        why: "The ring spins in the warning colour, for a wait that carries some risk or cost if it fails. Only the colour differs from the accent state.",
                        code: "<Spinner tone=\"warning\" />",
                        render: <Spinner tone="warning" showAnatomy />,
                    },
                    {
                        name: "tone = \"danger\"",
                        why: "The ring spins in the danger colour, matching a destructive action that is currently in flight (such as an unenroll request). Only the colour differs from the accent state.",
                        code: "<Spinner tone=\"danger\" />",
                        render: <Spinner tone="danger" showAnatomy />,
                    },
                    {
                        name: "tone = \"current\"",
                        why: "The ring inherits whatever text colour surrounds it instead of picking one of its own, shown here against a foreground-coloured wrapper. This is the step reached for when the spinner sits inside a coloured button and must match the button's own label colour.",
                        code: "<Spinner tone=\"current\" />",
                        render: (
                            <span data-tier="fixture" className="text-foreground inline-flex">
                                <Spinner tone="current" showAnatomy />
                            </span>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
