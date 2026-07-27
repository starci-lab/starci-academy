import type { ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    PhaseScarcityNote,
    PricingPhase,
} from "@sb-components/designs/commerce/PhaseScarcityNote/PhaseScarcityNote"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * DESIGN — `PhaseScarcityNote.Base`: the REAL scarcity line for a pricing phase.
 *
 * EVERY number comes from the backend's `coursePricePreview`. This component
 * ABSOLUTELY does not fabricate a countdown or a seat count — fake scarcity is a
 * forbidden dark pattern. Consequence: a phase with no seat cap stays **silent**.
 *
 * 📐 **LEAF by STRUCTURE** (§14d.2): the three leaves below are REAL leaves because
 * each one **loses a node**. Switching phase (Pioneer/Early Bird/Regular) only
 * changes text ⇒ a STATE, rendered together within the both-clauses leaf.
 */
const meta: Meta<typeof PhaseScarcityNote.Base> = {
    title: "Designs/Commerce/PhaseScarcityNote.Base",
    component: PhaseScarcityNote.Base,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof PhaseScarcityNote.Base>

/** All three text clauses are `Typography.Base` ⇒ the same single door. */
const TYPOGRAPHY_STORY = "atoms-text-typography-typography-base--plain"

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    // ⭐ 2026-07-27: this line is now built with the layouts tier's `Cluster` FRAME
    // (no more hand-typed `<div className="flex flex-wrap gap-2">`), so the frame must
    // SHOW UP in the tree — using a frame the panel can't see leaves the reader thinking
    // this is still a hand-rolled div.
    Cluster: { tier: "primitive", role: "a ONE-TRACK frame that wraps on its own — `gap` is pinned to the §10 scale instead of a hand-typed class", storyId: "layouts-layout-cluster-cluster-base--default" },
    // ⚠️ The panel only accepts a part with a REAL `storyId` (§11a whitelist) — the three
    // text lines below used to declare a role but were MISSING `storyId`, so they never
    // made it into the tree. They're built by THIS component itself (not a child's guts)
    // ⇒ per §11a.1 they must be declared.
    // `WarningCircleIcon` has NO `storyId`: it's a Phosphor glyph, not a component of the
    // system — there's no story to jump to, so standing outside the tree is correct.
    WarningCircleIcon: { tier: "atom", role: "warning mark — opens the line" },
    SeatCountLine: { tier: "atom", role: "the REQUIRED clause: N seats left at the {phase} price", storyId: TYPOGRAPHY_STORY },
    Separator: { tier: "atom", role: "the · separating the two clauses", storyId: TYPOGRAPHY_STORY },
    PriceRiseClause: { tier: "atom", role: "the OPTIONAL clause: what the price rises to afterwards", storyId: TYPOGRAPHY_STORY },
}

const leafShell = (leaf: string, node: ReactNode, note?: ReactNode, code?: string) => (
    <div className="p-8">
        <BlockAnatomy
            name="PhaseScarcityNote.Base"
            tier="design"
            leaf={leaf}
            parts={[]}
            annotate={ANNOTATE}
            note={note}
            code={code}
        >
            {node}
        </BlockAnatomy>
    </div>
)

/** LEAF — both clauses present. All three phases render together: switching phase only changes TEXT, not the node. */
export const FullClause: Story = {
    render: () =>
        leafShell(
            "Both clauses",
            <div className="flex flex-col gap-3">
                <PhaseScarcityNote.Base
                    showAnatomy
                    currentPhase={PricingPhase.EarlyBird}
                    seatsRemaining={14}
                    nextPhasePriceVnd={2_490_000}
                />
                <PhaseScarcityNote.Base
                    currentPhase={PricingPhase.Pioneer}
                    seatsRemaining={3}
                    nextPhasePriceVnd={1_990_000}
                />
            </div>,
            "Three phases with different labels but the same DOM tree ⇒ state, not a leaf.",
            `<PhaseScarcityNote.Base
    currentPhase={PricingPhase.EarlyBird}
    seatsRemaining={14}
    nextPhasePriceVnd={2490000}
/>`,
        ),
}

/** LEAF — the last phase, no next price ⇒ **loses** `Separator` + `PriceRiseClause`. */
export const NoPriceRise: Story = {
    render: () =>
        leafShell(
            "No price rise",
            <PhaseScarcityNote.Base
                showAnatomy
                currentPhase={PricingPhase.Regular}
                seatsRemaining={5}
                nextPhasePriceVnd={null}
            />,
            "Two fewer nodes than the leaf above — that's the actual reason to split leaves.",
            `<PhaseScarcityNote.Base
    currentPhase={PricingPhase.Regular}
    seatsRemaining={5}
    nextPhasePriceVnd={null}
/>`,
        ),
}

/**
 * LEAF — no seat cap ⇒ **renders NULL**. With no seat cap there's no honest "when does
 * the price rise" story to tell, so it stays silent instead of making one up.
 */
export const Silent: Story = {
    render: () =>
        leafShell(
            "No seat cap",
            <PhaseScarcityNote.Base
                showAnatomy
                currentPhase={PricingPhase.Regular}
                seatsRemaining={null}
                nextPhasePriceVnd={2_990_000}
            />,
            "No parts at all — silence is the contract here, not a render bug.",
            `<PhaseScarcityNote.Base
    currentPhase={PricingPhase.Regular}
    seatsRemaining={null}
    nextPhasePriceVnd={2990000}
/>`,
        ),
}
