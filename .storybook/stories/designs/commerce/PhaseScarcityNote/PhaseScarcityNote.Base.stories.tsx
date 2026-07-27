import type { ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    PhaseScarcityNote,
    PricingPhase,
} from "@sb-components/designs/commerce/PhaseScarcityNote/PhaseScarcityNote"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * DESIGN — `PhaseScarcityNote.Base`: the REAL scarcity line for a pricing phase.
 *
 * EVERY number comes from the backend's `coursePricePreview`. This component
 * ABSOLUTELY does not fabricate a countdown or a seat count — fake scarcity is a
 * forbidden dark pattern. Consequence: a phase with no seat cap stays **silent**.
 *
 * ONE LEAF (teacher, 2026-07-27). Every difference this line can show comes from BACKEND
 * DATA — the seat count, whether a next-phase price exists, whether the phase is capped —
 * so they are STATES stacked inside a single leaf. A leaf is earned by a trục the CALLER
 * toggles, and the caller here always passes the same three props.
 */
const meta: Meta<typeof PhaseScarcityNote.Base> = {
    title: "Designs/Commerce/PhaseScarcityNote/PhaseScarcityNote.Base",
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

/** One labelled row of the scarcity ladder, so the reader can tell the states apart. */
const Rung = ({ label, node }: RungProps) => (
    <div className="flex flex-col gap-1">
        <Typography.Base size="xs" color="muted" text={label} />
        {node}
    </div>
)

/** Props for {@link Rung}. */
interface RungProps {
    /** What data produced this row (not product copy — a label for the reader). */
    label: string
    /** The component rendered in that state. */
    node: ReactNode
}

/**
 * The ONLY leaf. Every difference below comes from BACKEND DATA — seat count, whether a
 * next-phase price exists, whether the phase is capped at all — so they are STATES of one
 * line, not separate leaves (teacher, 2026-07-27: "coi như state đi, render nhiều state
 * trong 1 leaf").
 *
 * A leaf would be earned by a trục the CALLER toggles. Nothing here is caller-toggled: the
 * caller always passes the same three props and the backend decides which rung shows.
 *
 * This replaces three leaves (`FullClause` · `NoPriceRise` · `Silent`). Split apart, the
 * reader had to open three stories and hold them in memory to see that the last two rungs
 * drop nodes; stacked, the drop is visible in one glance.
 */
export const Default: Story = {
    render: () =>
        leafShell(
            "Default",
            <div className="flex flex-col gap-4">
                <Rung
                    label="seats 14 · next price 2,490,000 — both clauses"
                    node={
                        <PhaseScarcityNote.Base
                            showAnatomy
                            currentPhase={PricingPhase.EarlyBird}
                            seatsRemaining={14}
                            nextPhasePriceVnd={2_490_000}
                        />
                    }
                />
                <Rung
                    label="seats 3 · another phase — same nodes, only the number and the label change"
                    node={
                        <PhaseScarcityNote.Base
                            currentPhase={PricingPhase.Pioneer}
                            seatsRemaining={3}
                            nextPhasePriceVnd={1_990_000}
                        />
                    }
                />
                <Rung
                    label="next price null — Separator + PriceRiseClause DROP OUT"
                    node={
                        <PhaseScarcityNote.Base
                            currentPhase={PricingPhase.Regular}
                            seatsRemaining={5}
                            nextPhasePriceVnd={null}
                        />
                    }
                />
                <Rung
                    label="seats null (uncapped phase) — renders NOTHING, and the blank below is the contract"
                    node={
                        <PhaseScarcityNote.Base
                            currentPhase={PricingPhase.Regular}
                            seatsRemaining={null}
                            nextPhasePriceVnd={2_990_000}
                        />
                    }
                />
            </div>,
            "All four rungs are driven by data: the seat count, whether a next-phase price exists, and whether the phase is capped. The third rung is two nodes shorter than the first, and the fourth renders nothing at all — with no seat cap there is no honest 'when does the price rise' claim to make, so silence is the contract rather than a render bug.",
            `<PhaseScarcityNote.Base
    currentPhase={PricingPhase.EarlyBird}
    seatsRemaining={14}
    nextPhasePriceVnd={2490000}
/>`,
        ),
}
