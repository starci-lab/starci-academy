import type { Meta, StoryObj } from "@storybook/nextjs"
import { TrialEnrollNudge } from "@sb-components/starci/blocks/commerce/TrialEnrollNudge/TrialEnrollNudge"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `TrialEnrollNudge`: the ambient, self-hiding "you're on a trial →
 * enroll" one-liner. Ported from `src`'s `TrialEnrollHook`
 * (`features/learn/shared/TrialEnrollHook`) — the SAME hook `src` reuses
 * verbatim across the leaderboard, Foundations, and flashcard-study surfaces,
 * which is why this port sits in `blocks/commerce` beside `TrialConversionStrip`
 * (its fuller, later-funnel sibling) rather than under `learn/Foundations`. See
 * the component file header for the full placement rationale — flagged for
 * confirmation before any screen wires it in.
 *
 * 📐 **TWO LEAVES** (§14d.2): "shown" and "hidden" differ in STRUCTURE (a node
 * vs an empty tree) — same shape as `CourseTeamGate`'s `Warning`/`Hidden` split.
 * `isVisible` is the ONE decision this block makes; the caller only ever hands
 * it an already-resolved boolean.
 */
const meta: Meta<typeof TrialEnrollNudge> = {
    title: "StarCi/Blocks/Commerce/TrialEnrollNudge/TrialEnrollNudge",
    component: TrialEnrollNudge,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof TrialEnrollNudge>

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "FeedbackCallout": {
        tier: "composite",
        role: "the tinted accent strip carrying the title/description; the CTA rides in its body slot as a real composed Button rather than the frame's own actionLabel shorthand",
        storyId: "composites-feedback-feedback-feedbackcallout--with-body",
    },
    "Button": {
        tier: "atom",
        role: "the enroll CTA, carrying the slide-arrow \"keep going\" affordance the frame's built-in action button can't express",
        storyId: "atoms-buttons-button-button--icon-slide",
    },
}

/** LEAF — visible: the accent strip with title, description and the enroll CTA. */
export const Visible: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="TrialEnrollNudge"
                tier="block"
                leaf="isVisible = true"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-xl"
                states={[
                    {
                        name: "isVisible = true",
                        why: "A learner still on a trial sees the nudge: an accent-toned strip naming what enrolling unlocks, with one CTA. The caller already resolved enrolled-vs-trial before mounting this block, so there is nothing left for it to check.",
                        code: `<TrialEnrollNudge
    title="Học thử — mở khoá toàn bộ khoá học"
    description="Bạn đang học thử. Mở khoá để xem hết bài giảng và làm mọi thử thách."
    ctaLabel="Mở khoá ngay"
    onEnroll={handleEnroll}
    isVisible
/>`,
                        render: (
                            <TrialEnrollNudge
                                anatPart="FeedbackCallout"
                                showAnatomy
                                title="Học thử — mở khoá toàn bộ khoá học"
                                description="Bạn đang học thử. Mở khoá để xem hết bài giảng và làm mọi thử thách."
                                ctaLabel="Mở khoá ngay"
                                onEnroll={() => {}}
                                isVisible
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/**
 * LEAF — self-hides, empty tree. The caller passes `isVisible={false}` once the
 * learner is known to be paid (or the trial status hasn't resolved yet), so
 * nothing renders rather than a flash of a nudge that doesn't apply.
 */
export const Hidden: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="TrialEnrollNudge"
                tier="block"
                leaf="isVisible = false"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-xl"
                states={[
                    {
                        name: "isVisible = false",
                        why: "The block renders nothing at all, no callout, no placeholder. A paid learner (or one whose trial status isn't known yet) has no honest reason to see an enroll nudge, so the caller passes `isVisible={false}` and the whole node disappears.",
                        code: `<TrialEnrollNudge
    title="Học thử — mở khoá toàn bộ khoá học"
    description="Bạn đang học thử. Mở khoá để xem hết bài giảng và làm mọi thử thách."
    ctaLabel="Mở khoá ngay"
    onEnroll={handleEnroll}
    isVisible={false}
/>`,
                        render: (
                            <TrialEnrollNudge
                                title="Học thử — mở khoá toàn bộ khoá học"
                                description="Bạn đang học thử. Mở khoá để xem hết bài giảng và làm mọi thử thách."
                                ctaLabel="Mở khoá ngay"
                                onEnroll={() => {}}
                                isVisible={false}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
