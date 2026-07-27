import type { Meta, StoryObj } from "@storybook/nextjs"
import { VariantChip, type Difficulty } from "@sb-components/designs/chips/VariantChip/VariantChip"
import { BlockAnatomy, type AnatomyAnnotation, type AnatomyState } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * DESIGN — `VariantChip.Difficulty`: applies the **DIFFICULTY** semantic role
 * onto the `Chip.Base` atom.
 *
 * ⚠️ 2026-07-26: the atom dropped the `Chip.Dot` member — the dot is now a
 * PROP of the single chip (`dotClassName`). This design doesn't change shape,
 * only what it calls down into.
 *
 * Members of the `VariantChip.*` family split by **ROLE** (§14d), not by
 * shape — that's where the design tier differs from the atom tier.
 *
 * ⛔ **NO `custom`, NO `bare`** (teacher's call 2026-07-26): from the design
 * tier up, nothing opens a lane for picking your own label or changing shape.
 * Open one lane and callers exploit it, and the standard stops being a
 * standard. Want a free-form chip → call the `Chip.*` atom directly.
 *
 * 📐 **ONE SINGLE LEAF** (§11f): leaves split by STRUCTURE. All four difficulty
 * levels share the same DOM tree, differing only in content ⇒ they're STATES,
 * not four leaves. So one leaf, with every difficulty level as its own state.
 *
 * Skeleton is ALSO not a separate leaf — same structure, just swaps text for
 * bars. (The `isSkeleton` prop still exists, §12c — two different things.)
 */
const meta: Meta<typeof VariantChip.Difficulty> = {
    title: "Designs/Chips/VariantChip/VariantChip.Difficulty",
    component: VariantChip.Difficulty,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof VariantChip.Difficulty>

/** The SINGLE axis of this design — `difficulty` decides both the label and the color. */
const LEVELS: Array<Difficulty> = ["beginner", "intermediate", "advanced", "insane"]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Chip.Base": {
        storyId: "atoms-chips-chip-chip-base--default",
        tier: "atom",
        role: "The whole shape comes from here. Design only adds meaning and the dot colour.",
    },
}

/** One state per difficulty level, resting (not skeleton). */
const LEVEL_STATES: Array<AnatomyState> = LEVELS.map((level) => ({
    name: `difficulty = "${level}"`,
    why: "The label and dot colour come from a level on the palette ramp rather than from one of the five semantic tokens, because difficulty is a level, not a state, and forcing four levels into semantic tokens would collide twice on danger. Every level shares the same pill shape from Chip.Base, so the level only ever changes what's written and what colour reads it.",
    code: `<VariantChip.Difficulty difficulty="${level}" />`,
    render: <VariantChip.Difficulty difficulty={level} showAnatomy />,
}))

/** One state per difficulty level, `isSkeleton`. */
const SKELETON_STATES: Array<AnatomyState> = LEVELS.map((level) => ({
    name: `difficulty = "${level}", isSkeleton = true`,
    why: "The same pill swaps its label for a shimmer bar while keeping the level's own footprint, so the ramp never shifts width once the real label lands. The pill shape is still the atom's own default, since design never opens a shape axis even for the loading mirror.",
    code: `<VariantChip.Difficulty difficulty="${level}" isSkeleton />`,
    render: <VariantChip.Difficulty difficulty={level} isSkeleton showAnatomy />,
}))

/**
 * The single leaf — every level, resting and skeleton, each its own state.
 *
 * The ramp uses the palette, NOT the 5 semantic tokens: difficulty is a
 * **LEVEL**, not a **STATE** — forcing 4 levels into tokens would collide
 * on `danger` twice.
 */
export const Levels: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="VariantChip.Difficulty"
                tier="design"
                leaf="Difficulty chip"
                annotate={ANNOTATE}
                reason="difficulty decides both the label and the color together, and every level renders through the exact same Chip.Base shape, so the four levels plus their skeleton mirrors are states of one leaf rather than eight separate leaves."
                states={[...LEVEL_STATES, ...SKELETON_STATES]}
            />
        </div>
    ),
}
