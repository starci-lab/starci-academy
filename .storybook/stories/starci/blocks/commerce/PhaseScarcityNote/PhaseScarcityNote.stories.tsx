import type { Meta, StoryObj } from "@storybook/nextjs"
import { PhaseScarcityNote, PricingPhase } from "@sb-components/starci/blocks/commerce/PhaseScarcityNote/PhaseScarcityNote"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * DESIGN — `PhaseScarcityNote`: the REAL scarcity line for a pricing phase.
 *
 * EVERY number comes from the backend's `coursePricePreview`. This component
 * ABSOLUTELY does not fabricate a countdown or a seat count — fake scarcity is a
 * forbidden dark pattern. Consequence: a phase with no seat cap stays **silent**.
 *
 * ONE LEAF (teacher, 2026-07-27). Every difference this line can show comes from BACKEND
 * DATA — the seat count, whether a next-phase price exists, whether the phase is capped —
 * so they are STATES stacked inside a single leaf. A leaf is earned by an axis the CALLER
 * toggles, and the caller here always passes the same three props.
 */
const meta: Meta<typeof PhaseScarcityNote> = {
    title: "StarCi/Blocks/Commerce/PhaseScarcityNote/PhaseScarcityNote",
    component: PhaseScarcityNote,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof PhaseScarcityNote>

/** All three text clauses are `Typography` ⇒ the same single door. */
const TYPOGRAPHY_STORY = "atoms-text-typography-typography--plain"

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    // ⭐ 2026-07-27: this line is now built with the layouts tier's `Cluster` FRAME
    // (no more hand-typed `<div className="flex flex-wrap gap-2">`), so the frame must
    // SHOW UP in the tree — using a frame the panel can't see leaves the reader thinking
    // this is still a hand-rolled div.
    "Cluster": { tier: "frame", role: "a ONE-TRACK frame that wraps on its own and draws its own `·` separator — `gap` is pinned to the §10 scale instead of a hand-typed class", storyId: "frames-cluster-cluster--default" },
    // ⚠️ The panel only accepts a part with a REAL `storyId` (§11a whitelist) — the two
    // text lines below used to declare a role but were MISSING `storyId`, so they never
    // made it into the tree. They're built by THIS component itself (not a child's guts)
    // ⇒ per §11a.1 they must be declared.
    // `WarningCircleIcon` has NO `storyId`: it's a Phosphor glyph, not a component of the
    // system — there's no story to jump to, so standing outside the tree is correct.
    WarningCircleIcon: { tier: "atom", role: "warning mark — opens the line" },
    "Typography": { tier: "atom", role: "one of this line's own clauses — the REQUIRED \"N seats left at the current phase price\", or the OPTIONAL \"price rises to\" clause that follows it", storyId: TYPOGRAPHY_STORY },
    "Skeleton": { tier: "heroui", role: "the single-bar shimmer standing in for the whole line while `isSkeleton` — the price preview hasn't arrived yet, so there is no phase/seat/price fact to shape a `Cluster` around" },
}

/**
 * ONE leaf, FOUR states — using the `states` API (teacher finalized layout C, 2026-07-27).
 *
 * All four states come from BACKEND DATA: the seat count, whether a next-phase price exists,
 * whether the phase caps seats at all. So they are STATES of one leaf, not four leaves: a leaf
 * is only earned by an axis the CALLER toggles, and here the caller always passes the same
 * three props.
 *
 * Before `states` existed, these four had to be stacked by hand inside `children` with
 * hand-rolled labels — nowhere explained each state individually, no snippet of its own, and
 * worst of all the deps tree was inferred from the DOM of ALL FOUR at once, so it never matched
 * any single state. Now each state carries its own `why` + `code`, and only the currently
 * selected state gets mounted, so the deps tree belongs to exactly that one.
 */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="PhaseScarcityNote"
                tier="block"
                leaf="Default"
                annotate={ANNOTATE}
                reason="Every number on this line comes from the backend price preview, so nothing here may be invented. A countdown or a seat count made up in the frontend is fake scarcity, which is why a phase that caps nothing stays silent instead of filling the space."
                states={[
                    {
                        name: "seatsRemaining = 14, nextPhasePriceVnd set",
                        why: "Both clauses render, so the cluster carries four items. This is the shape when the phase caps its seats and a later price already exists, so the line can state both facts at once.",
                        code: `<PhaseScarcityNote
    currentPhase={PricingPhase.EarlyBird}
    seatsRemaining={14}
    nextPhasePriceVnd={2490000}
/>`,
                        render: (
                            <PhaseScarcityNote
                                showAnatomy
                                currentPhase={PricingPhase.EarlyBird}
                                seatsRemaining={14}
                                nextPhasePriceVnd={2_490_000}
                            />
                        ),
                    },
                    {
                        name: "seatsRemaining = 3, another phase",
                        why: "The node tree is identical to the first state and only the number and the phase label change. A different phase is therefore a state of this one line rather than a leaf of its own.",
                        code: `<PhaseScarcityNote
    currentPhase={PricingPhase.Pioneer}
    seatsRemaining={3}
    nextPhasePriceVnd={1990000}
/>`,
                        render: (
                            <PhaseScarcityNote
                                showAnatomy
                                currentPhase={PricingPhase.Pioneer}
                                seatsRemaining={3}
                                nextPhasePriceVnd={1_990_000}
                            />
                        ),
                    },
                    {
                        name: "nextPhasePriceVnd = null",
                        why: "`Separator` and `PriceRiseClause` drop out, leaving two nodes fewer than the first state. The caller toggled nothing, the backend simply has no later price to name.",
                        code: `<PhaseScarcityNote
    currentPhase={PricingPhase.Regular}
    seatsRemaining={5}
    nextPhasePriceVnd={null}
/>`,
                        render: (
                            <PhaseScarcityNote
                                showAnatomy
                                currentPhase={PricingPhase.Regular}
                                seatsRemaining={5}
                                nextPhasePriceVnd={null}
                            />
                        ),
                    },
                    {
                        name: "seatsRemaining = null",
                        why: "The line renders nothing at all and the blank space is the contract. An uncapped phase has no honest moment at which the price rises, so there is no true sentence to write and silence is the only accurate answer.",
                        code: `<PhaseScarcityNote
    currentPhase={PricingPhase.Regular}
    seatsRemaining={null}
    nextPhasePriceVnd={2990000}
/>`,
                        render: (
                            <PhaseScarcityNote
                                showAnatomy
                                currentPhase={PricingPhase.Regular}
                                seatsRemaining={null}
                                nextPhasePriceVnd={2_990_000}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — the caller flips `isSkeleton`; a single-bar shimmer stands in for the line before the backend's price preview arrives (§12g.0a). */
export const Skeleton: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="PhaseScarcityNote"
                tier="block"
                leaf="Prop `isSkeleton`"
                parts={[]}
                annotate={ANNOTATE}
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "There is no honest phase/seat/price fact to show yet, so the shimmer is one plain bar rather than mirroring the icon + two-clause `Cluster` shape the real line eventually takes.",
                        code: "<PhaseScarcityNote isSkeleton />",
                        render: <PhaseScarcityNote isSkeleton anatPart="PhaseScarcityNote" showAnatomy />,
                    },
                ]}
            />
        </div>
    ),
}
