import type { Meta, StoryObj } from "@storybook/nextjs"
import { VariantChipDifficulty, type Difficulty } from "@sb-components/starci/blocks/learn/VariantChip/VariantChip"
import { BlockAnatomy, type AnatomyAnnotation, type AnatomyState } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `VariantChipDifficulty` — a design-tier chip that applies the DIFFICULTY
 * semantic role onto the `Chip` atom. Members of the `VariantChip.*` family
 * split by role, not by shape; there is no `custom`/`bare` lane, so callers
 * wanting a free-form chip use the `Chip.*` atom directly. The dot is a prop
 * (`dotClassName`) of the single chip. All four difficulty levels share one
 * DOM tree and differ only in content, so they are states of one leaf; the
 * skeleton (`isSkeleton`) swaps text for bars within that same structure.
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
    // badge (default `anatPart ?? "VariantChipDifficulty"`):
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
    render: <VariantChipDifficulty difficulty={level} />,
}))

/** One state per difficulty level, `isSkeleton`. */
const SKELETON_STATES: Array<AnatomyState> = LEVELS.map((level) => ({
    name: `difficulty = "${level}", isSkeleton = true`,
    why: "The same pill swaps its label for a shimmer bar while keeping the level's own footprint, so the ramp never shifts width once the real label lands. The pill shape is still the atom's own default, since design never opens a shape axis even for the loading mirror.",
    code: `<VariantChipDifficulty difficulty="${level}" isSkeleton />`,
    render: <VariantChipDifficulty difficulty={level} isSkeleton />,
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
