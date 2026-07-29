import type { Meta, StoryObj } from "@storybook/nextjs"
import { FoundationTrialEnrollBanner } from "@sb-components/starci/blocks/learn/FoundationTrialEnrollBanner/FoundationTrialEnrollBanner"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `FoundationTrialEnrollBanner`: the plain one-line "you're on a trial"
 * nudge, reused identically across leaderboard, foundations, and flashcard study.
 *
 * SIBLING OF `TrialConversionStrip`, NOT A DUPLICATE. That block is the
 * price-preview + phase-scarcity strip built for `CourseContents`; this one
 * carries no price at all — it is the `FeedbackCallout` variant the app's
 * `TrialEnrollHook` renders across three surfaces that never need a price.
 *
 * 📐 LEAF by STRUCTURE (§14d.2). There is exactly ONE leaf: the block always
 * composes the same `FeedbackCallout` shape. `isVisible = false` is NOT a leaf
 * (per §11f it's a data condition — the block just renders nothing, no
 * structure to show). `isSkeleton` does not open a second leaf either: it
 * swaps the two text nodes for their `Typography` skeleton mirrors and drops
 * the action, but that is the same "swap to loading mirror" content change
 * every skeleton state in this system is (see `ContentHeader`'s own file
 * header) — the states below capture it without inventing a leaf no screen asks for.
 */
const meta: Meta<typeof FoundationTrialEnrollBanner> = {
    title: "StarCi/Blocks/Learn/FoundationTrialEnrollBanner/FoundationTrialEnrollBanner",
    component: FoundationTrialEnrollBanner,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof FoundationTrialEnrollBanner>

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "FeedbackCallout": {
        tier: "composite",
        role: "the flat accent strip this block wraps — the block only supplies its own fixed copy, the icon, and the self-gating condition",
        storyId: "composites-feedback-feedback-feedbackcallout--default",
    },
    "Typography": {
        tier: "atom",
        role: "the loading mirror standing in for the title/description text while the enrollment check is still in flight",
        storyId: "atoms-text-typography-typography--loading",
    },
}

/** LEAF — the one shape this block ever draws: an accent `FeedbackCallout`. */
export const Default: Story = {
    name: "Default",
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="FoundationTrialEnrollBanner"
                tier="block"
                leaf="Default"
                annotate={ANNOTATE}
                reason="The ambient trial nudge shared by leaderboard, foundations, and flashcard study: one accent `FeedbackCallout` the block builds from its own fixed copy, gated by `isVisible` and reserved by `isSkeleton` while the caller is still resolving whether the learner is a trial learner."
                states={[
                    {
                        name: "isVisible = true",
                        why: "The caller has resolved the learner as a known trial learner, so the banner renders its fixed copy and CTA. This is the shape every one of the three surfaces shows while a trial learner is browsing them.",
                        code: `<FoundationTrialEnrollBanner
  isVisible
  onEnroll={() => {}}
/>`,
                        render: (
                            <FoundationTrialEnrollBanner
                                anatPart="FoundationTrialEnrollBanner"
                                showAnatomy
                                isVisible
                                onEnroll={() => {}}
                            />
                        ),
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The enrollment check that feeds `isVisible` is still in flight, so the strip's shape is reserved but its two text nodes swap to their `Typography` skeleton mirrors and the CTA drops out — there is nothing to press before the check lands. This wins over `isVisible` (see the component's file header), which is why it is passed here alongside `isVisible={false}` to show that the skeleton is not simply the hidden state.",
                        code: `<FoundationTrialEnrollBanner
  isVisible={false}
  isSkeleton
  onEnroll={() => {}}
/>`,
                        render: (
                            <FoundationTrialEnrollBanner
                                isVisible={false}
                                isSkeleton
                                onEnroll={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
