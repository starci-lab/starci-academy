import type { Meta, StoryObj } from "@storybook/nextjs"
import { Divider } from "@sb-components/atoms/display/Divider/Divider"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `Divider`: wraps HeroUI `Separator` directly (HeroUI has no
 * "Divider", renamed for the app's vocabulary). A leaf atom — it doesn't build
 * any atom OF OURS with its own story, so it has no atom-tier dep. `Label` is an
 * INTERNAL span holding the free-form label content (a slot, nowhere else to jump
 * to), not a dep.
 *
 * ⚠️ 2026-07-28 (naming pass): every rule this atom draws IS a direct HeroUI
 * `Separator` render — renamed from the role-word `Line` to the real import name,
 * `tier: "heroui"` (no `storyId`). Previously the tree showed nothing at all for
 * this atom (no `annotate`), hiding that HeroUI usage entirely.
 *
 * 📐 **1 PROP = 1 LEAF** (§12g): `orientation` · `variant` · `label`, each prop
 * one leaf, and the leaf renders EVERY value in full. The previous version split
 * `Horizontal`/`Vertical` into two separate leaves — that's splitting by the
 * VALUE of the SAME prop `orientation`, exactly what §12g forbids (its own
 * example calls out `Small`/`Medium`/`OnDark` as wrong) — merged back into one
 * `Orientation` leaf rendering both values in full. `variant` previously had no
 * leaf at all, even though it's also a prop with a visible shape — added
 * `Variants` to complete the set.
 *
 * MIGRATED TO `states` (2026-07-27): each prop's values used to be stacked by
 * hand in one `children` block with no room to explain any single value on its
 * own. Now each value is its own `states[]` entry — its own `why` and its own
 * `code` — reachable through the leaf's state tabs.
 */
/** The only node this atom ever draws is a direct HeroUI `Separator`. */
const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Separator": {
        tier: "heroui",
        role: "the rule itself — one per side of the label when labelled, or the bare standalone line",
    },
}

const meta: Meta<typeof Divider> = {
    title: "Atoms/Display/Divider/Divider",
    component: Divider,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Divider>

/** Bare leaf — default orientation (horizontal), default variant, no label. Migrated to `states` 2026-07-27. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Divider"
                tier="atom"
                leaf="Bare divider"
                annotate={ANNOTATE}
                reason="The one rule in the system. Every leaf below it differs by exactly one prop, so this is the baseline you compare against."
                states={[
                    {
                        name: "no props set (bare horizontal line)",
                        why: "A single horizontal rule renders at the default weight, with no label attached. This is the plain separator every other leaf on this page differs from by exactly one prop.",
                        code: "<Divider />",
                        render: (
                            <div data-tier="fixture" className="w-72">
                                <Divider />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf prop `orientation` — BOTH values: horizontal (default) and vertical. Migrated to `states` 2026-07-27. */
export const Orientation: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Divider"
                tier="atom"
                leaf="Prop `orientation`"
                annotate={ANNOTATE}
                states={[
                    {
                        name: "orientation = \"horizontal\" (default)",
                        why: "A single full-width rule renders on its own line. This is the default reading-flow separator, used to break up stacked sections in a column.",
                        code: "<Divider />",
                        render: (
                            <div data-tier="fixture" className="w-72">
                                <Divider />
                            </div>
                        ),
                    },
                    {
                        name: "orientation = \"vertical\"",
                        why: "A standing rule renders between inline items instead of one horizontal line spanning the width. A vertical line needs a parent with a set height to show against, which is why it only makes sense between items sitting on the same row, like separating three lesson stages.",
                        code: "<Divider orientation=\"vertical\" />",
                        render: (
                            <div data-tier="fixture" className="flex h-16 items-center gap-4">
                                <span className="text-muted text-sm">Lesson</span>
                                <Divider orientation="vertical" />
                                <span className="text-muted text-sm">Exercise</span>
                                <Divider orientation="vertical" />
                                <span className="text-muted text-sm">Discussion</span>
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf prop `variant` — the FULL weight/tone union of the line. Migrated to `states` 2026-07-27. */
export const Variants: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Divider"
                tier="atom"
                leaf="Prop `variant`"
                annotate={ANNOTATE}
                states={[
                    {
                        name: "variant = \"default\"",
                        why: "One horizontal rule renders at the default weight and tone. This is the everyday separator used between ordinary sections.",
                        code: "<Divider variant=\"default\" />",
                        render: (
                            <div data-tier="fixture" className="w-72">
                                <Divider variant="default" />
                            </div>
                        ),
                    },
                    {
                        name: "variant = \"secondary\"",
                        why: "The same single rule renders, only its weight and tone step down one notch from default. A quieter seam is needed where a full-strength line would compete with more important content nearby.",
                        code: "<Divider variant=\"secondary\" />",
                        render: (
                            <div data-tier="fixture" className="w-72">
                                <Divider variant="secondary" />
                            </div>
                        ),
                    },
                    {
                        name: "variant = \"tertiary\"",
                        why: "The same single rule renders at the lightest weight and tone in the union. The faintest seam is for a boundary that should barely register, like inside a dense list.",
                        code: "<Divider variant=\"tertiary\" />",
                        render: (
                            <div data-tier="fixture" className="w-72">
                                <Divider variant="tertiary" />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf prop `label` — horizontal only: rule · label · rule. Migrated to `states` 2026-07-27. */
export const WithLabel: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Divider"
                tier="atom"
                leaf="Prop `label`"
                annotate={ANNOTATE}
                states={[
                    {
                        name: "label set (horizontal only)",
                        why: "Two `flex-1` rules render on either side of the centered label text instead of one continuous line. A labelled break — like an 'OR' divider on a sign-in form — needs the text itself to interrupt the line, not just sit beside it.",
                        code: "<Divider label=\"OR\" />",
                        render: (
                            <div data-tier="fixture" className="w-72">
                                <Divider label="OR" />
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
