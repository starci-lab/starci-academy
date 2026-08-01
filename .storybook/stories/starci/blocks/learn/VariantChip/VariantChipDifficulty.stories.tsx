import type { Meta, StoryObj } from "@storybook/nextjs"
import { VariantChipDifficulty, type Difficulty } from "@sb-components/starci/blocks/learn/VariantChip/VariantChip"
import { BlockAnatomy, type AnatomyAnnotation, type AnatomyState } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * DESIGN — `VariantChipDifficulty`: applies the **DIFFICULTY** semantic role
 * onto the `Chip` atom.
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
const meta: Meta<typeof VariantChipDifficulty> = {
    title: "StarCi/Blocks/Learn/VariantChip/VariantChipDifficulty",
    component: VariantChipDifficulty,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof VariantChipDifficulty>

/** The SINGLE axis of this design — `difficulty` decides both the label and the color. */
const LEVELS: Array<Difficulty> = ["beginner", "intermediate", "advanced", "insane"]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    // ⚠️ The wrapping `<span>` this design draws around `Chip` ALSO emits its own
    // badge (default `anatPart ?? "VariantChipDifficulty"`, teacher caught 2026-07-26):
    // without a real DOM node named after the design itself, `Chip`'s own insides
    // (`Dot`/`Label`) would climb the ancestor chain past this design entirely, so it
    // needs a self-entry the same way any other real component of ours does — same
    // `storyId` a CALLER declares when it embeds this chip (see `KeepGoingPath`'s dep on
    // `"starci-blocks-learn-variantchip-variantchipdifficulty--levels"`).
    "VariantChipDifficulty": {
        storyId: "starci-blocks-learn-variantchip-variantchipdifficulty--levels",
        tier: "block",
        role: "The design's own root span — it exists so `Chip` (and its dot/label inside) nests correctly beneath it in the tree instead of floating loose.",
    },
    "Chip": {
        storyId: "atoms-chips-chip-chip--default",
        tier: "atom",
        role: "The whole shape comes from here. Design only adds meaning and the dot colour.",
    },
}

/** One state per difficulty level, resting (not skeleton). */
const LEVEL_STATES: Array<AnatomyState> = LEVELS.map((level) => ({
    name: `difficulty = "${level}"`,
    why: "The label and dot colour come from a level on the palette ramp rather than from one of the five semantic tokens, because difficulty is a level, not a state, and forcing four levels into semantic tokens would collide twice on danger. Every level shares the same pill shape from Chip, so the level only ever changes what's written and what colour reads it.",
    code: `<VariantChipDifficulty difficulty="${level}" />`,
    render: <VariantChipDifficulty difficulty={level} showAnatomy />,
}))

/** One state per difficulty level, `isSkeleton`. */
const SKELETON_STATES: Array<AnatomyState> = LEVELS.map((level) => ({
    name: `difficulty = "${level}", isSkeleton = true`,
    why: "The same pill swaps its label for a shimmer bar while keeping the level's own footprint, so the ramp never shifts width once the real label lands. The pill shape is still the atom's own default, since design never opens a shape axis even for the loading mirror.",
    code: `<VariantChipDifficulty difficulty="${level}" isSkeleton />`,
    render: <VariantChipDifficulty difficulty={level} isSkeleton showAnatomy />,
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
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="VariantChipDifficulty"
                tier="block"
                leaf="Difficulty chip"
                annotate={ANNOTATE}
                reason="difficulty decides both the label and the color together, and every level renders through the exact same Chip shape, so the four levels plus their skeleton mirrors are states of one leaf rather than eight separate leaves."
                states={[...LEVEL_STATES, ...SKELETON_STATES]}
            />
        </div>
    ),
}
