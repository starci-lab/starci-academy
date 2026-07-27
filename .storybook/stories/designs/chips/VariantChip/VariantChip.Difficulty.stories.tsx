import type { Meta, StoryObj } from "@storybook/nextjs"
import { VariantChip, type Difficulty } from "@sb-components/designs/chips/VariantChip/VariantChip"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

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
 * not four leaves. So one leaf, rendering all four levels inside it.
 *
 * Skeleton is ALSO not a separate leaf — same structure, just swaps text for
 * bars. (The `isSkeleton` prop still exists, §12c — two different things.)
 */
const meta: Meta<typeof VariantChip.Difficulty> = {
    title: "Designs/Chips/VariantChip.Difficulty",
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

/**
 * The single leaf — all 4 levels + a skeleton row (a state, not a leaf).
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
                parts={[]}
                annotate={ANNOTATE}
                note="The pill shape is the atom's own default — design never opens a shape axis."
                code={"<VariantChip.Difficulty difficulty=\"intermediate\" />"}
            >
                <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                        {LEVELS.map((level, index) => (
                            <VariantChip.Difficulty
                                key={level}
                                difficulty={level}
                                showAnatomy={index === 0}
                            />
                        ))}
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        {LEVELS.map((level) => (
                            <VariantChip.Difficulty key={level} difficulty={level} isSkeleton />
                        ))}
                    </div>
                </div>
            </BlockAnatomy>
        </div>
    ),
}
