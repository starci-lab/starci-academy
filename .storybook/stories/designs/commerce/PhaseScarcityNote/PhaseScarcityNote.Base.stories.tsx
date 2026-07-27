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
    Cluster: { tier: "frame", role: "a ONE-TRACK frame that wraps on its own — `gap` is pinned to the §10 scale instead of a hand-typed class", storyId: "frames-cluster-cluster-base--default" },
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

/**
 * MỘT leaf, BỐN state — dùng API `states` (thầy chốt bố cục C, 2026-07-27).
 *
 * Bốn state đều do BACKEND DATA sinh ra: số suất · có/không giá tăng · phase có bị chặn suất
 * hay không. Vì vậy chúng là STATE của một leaf, không phải bốn leaf: leaf chỉ được đẻ ra bởi
 * một trục mà CALLER bật, còn ở đây caller luôn truyền đúng ba prop như nhau.
 *
 * Trước khi có `states`, bốn state này phải xếp tay trong `children` kèm nhãn tự chế — không
 * chỗ nào giải thích riêng từng state, không snippet riêng, và tệ nhất là cây deps suy từ DOM
 * của CẢ BỐN nên không đúng với state nào. Giờ mỗi state tự mang `why` + `code`, và chỉ state
 * đang chọn được mount nên cây deps thuộc đúng nó.
 */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="PhaseScarcityNote.Base"
                tier="design"
                leaf="Default"
                annotate={ANNOTATE}
                reason="An honest scarcity line: every number comes from the backend's price preview, so a phase with no seat cap has nothing truthful to claim and stays silent instead of inventing a countdown."
                states={[
                    {
                        name: "seats 14 · price rises",
                        why: "Both clauses present — four items in the cluster. This is the baseline the other three are read against.",
                        code: `<PhaseScarcityNote.Base
    currentPhase={PricingPhase.EarlyBird}
    seatsRemaining={14}
    nextPhasePriceVnd={2490000}
/>`,
                        render: (
                            <PhaseScarcityNote.Base
                                showAnatomy
                                currentPhase={PricingPhase.EarlyBird}
                                seatsRemaining={14}
                                nextPhasePriceVnd={2_490_000}
                            />
                        ),
                    },
                    {
                        name: "seats 3 · other phase",
                        why: "Same node set, only the number and the phase label change — which is exactly why this is a STATE and not a leaf of its own.",
                        code: `<PhaseScarcityNote.Base
    currentPhase={PricingPhase.Pioneer}
    seatsRemaining={3}
    nextPhasePriceVnd={1990000}
/>`,
                        render: (
                            <PhaseScarcityNote.Base
                                showAnatomy
                                currentPhase={PricingPhase.Pioneer}
                                seatsRemaining={3}
                                nextPhasePriceVnd={1_990_000}
                            />
                        ),
                    },
                    {
                        name: "nextPhasePriceVnd = null",
                        why: "`Separator` and `PriceRiseClause` DROP OUT — two nodes fewer than the first state. Nothing was toggled by the caller; the backend simply has no next-phase price to state.",
                        code: `<PhaseScarcityNote.Base
    currentPhase={PricingPhase.Regular}
    seatsRemaining={5}
    nextPhasePriceVnd={null}
/>`,
                        render: (
                            <PhaseScarcityNote.Base
                                showAnatomy
                                currentPhase={PricingPhase.Regular}
                                seatsRemaining={5}
                                nextPhasePriceVnd={null}
                            />
                        ),
                    },
                    {
                        name: "seatsRemaining = null",
                        why: "Renders NOTHING, and the blank is the contract: an uncapped phase has no honest \"when does the price rise\" milestone, so inventing one would be fake scarcity. Note the deps list is empty here too — that is the tree of THIS state, not a leftover from the others.",
                        code: `<PhaseScarcityNote.Base
    currentPhase={PricingPhase.Regular}
    seatsRemaining={null}
    nextPhasePriceVnd={2990000}
/>`,
                        render: (
                            <PhaseScarcityNote.Base
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
