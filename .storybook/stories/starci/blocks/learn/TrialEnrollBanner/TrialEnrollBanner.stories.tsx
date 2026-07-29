import type { Meta, StoryObj } from "@storybook/nextjs"
import { TrialEnrollBanner } from "@sb-components/starci/blocks/learn/TrialEnrollBanner/TrialEnrollBanner"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `TrialEnrollBanner`: the ambient "you're on a trial" nudge, reused
 * verbatim across every free surface a trial learner can reach (foundations,
 * flashcard study, leaderboard, and this Quiz screen).
 *
 * 📐 **TWO LEAVES** (§14d.2), same split as its closest relative
 * `CourseTeamGate`: "shown" and "hidden" differ in STRUCTURE (a node vs an
 * empty tree). The two grounds for hiding (status not known yet · already
 * enrolled) land on the exact same empty tree ⇒ they're two `states[]`
 * entries of ONE `Hidden` leaf, not two leaves.
 *
 * ⛔ No `isSkeleton` leaf — the block deliberately has none (see the
 * component's file header): the real banner only appears or stays absent,
 * it never shimmers.
 */
const meta: Meta<typeof TrialEnrollBanner> = {
    title: "StarCi/Blocks/Learn/TrialEnrollBanner/TrialEnrollBanner",
    component: TrialEnrollBanner,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof TrialEnrollBanner>

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "FeedbackCallout": {
        tier: "composite",
        role: "every bit of the visible shape comes from this frame — icon, one-line title and the CTA it builds itself from actionLabel; the block only supplies the fixed copy and the hide condition",
        storyId: "composites-feedback-feedback-feedbackcallout--with-action",
    },
}

/** LEAF — trial learner, status resolved ⇒ shows the nudge. The only leaf with a node. */
export const Banner: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="TrialEnrollBanner"
                tier="block"
                leaf="Banner"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "isKnown = true, isEnrolled = false",
                        why: "Enrollment status has come back and the viewer is on a trial, so the strip renders as one accent-tinted line: lock glyph, the fixed nudge sentence, and an inline \"Mở khoá ngay\" CTA. This is the shape every free surface (foundations, flashcard study, leaderboard) shows a trial learner.",
                        code: "<TrialEnrollBanner isKnown isEnrolled={false} onEnroll={handleEnroll} />",
                        render: (
                            <TrialEnrollBanner
                                anatPart="FeedbackCallout"
                                showAnatomy
                                isKnown
                                isEnrolled={false}
                                onEnroll={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/**
 * LEAF — **self-hides**, empty tree. Two different grounds land on the same
 * result: status not resolved yet · already enrolled.
 */
export const Hidden: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="TrialEnrollBanner"
                tier="block"
                leaf="Self-hides"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "isKnown = false",
                        why: "Enrollment status hasn't resolved yet, so the block renders nothing rather than guess. Showing the nudge and then yanking it away once the real answer turns out to be \"already enrolled\" would be a worse experience than a beat of silence.",
                        code: "<TrialEnrollBanner isKnown={false} isEnrolled={false} onEnroll={handleEnroll} />",
                        render: <TrialEnrollBanner isKnown={false} isEnrolled={false} onEnroll={() => {}} />,
                    },
                    {
                        name: "isKnown = true, isEnrolled = true",
                        why: "Status is resolved and the viewer is already enrolled, so there is nothing left to nudge them toward — the block renders the same empty tree as the not-yet-known case above.",
                        code: "<TrialEnrollBanner isKnown isEnrolled onEnroll={handleEnroll} />",
                        render: <TrialEnrollBanner isKnown isEnrolled onEnroll={() => {}} />,
                    },
                ]}
            />
        </div>
    ),
}
