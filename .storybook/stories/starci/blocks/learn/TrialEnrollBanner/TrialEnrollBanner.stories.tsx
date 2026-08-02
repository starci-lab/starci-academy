import type { Meta, StoryObj } from "@storybook/nextjs"
import { TrialEnrollBanner } from "@sb-components/starci/blocks/learn/TrialEnrollBanner/TrialEnrollBanner"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `TrialEnrollBanner` — the ambient "you're on a trial" nudge, reused across every
 * free surface a trial learner can reach (foundations resource page and grid, and
 * leaderboard). A caller-resolved `isVisible` drives shown vs hidden; it renders
 * both a title and a description, and `isSkeleton` covers the enrollment check still
 * being in flight. Three leaves: "shown"/"hidden" differ in structure (a node vs an
 * empty tree), and the skeleton (two text bars, no CTA) is a third structure.
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
    "Callout": {
        tier: "composite",
        role: "the accent-tinted strip shape — icon-less frame holding the fixed title/description and the composed CTA child",
        storyId: "composites-feedback-callout--with-action",
    },
    "Button": {
        tier: "atom",
        role: "the CTA, composed as a real child (not Callout's actionLabel shorthand) so it stays a badgeable node with its own slide-arrow affordance",
        storyId: "atoms-buttons-button-button--default",
    },
    "Alert": {
        tier: "atom",
        role: "the skeleton branch calls this directly — Callout has no isSkeleton of its own, and Alert already draws two safe shimmer bars in place of title/description",
        storyId: "atoms-feedback-alert-alert--skeleton",
    },
}

/** LEAF — trial learner, status resolved ⇒ shows the nudge. The only leaf with a node. */
export const Banner: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="TrialEnrollBanner"
                tier="block"
                leaf="Banner"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "isVisible = true",
                        why: "Enrollment status has come back and the viewer is on a trial, so the strip renders as one accent-tinted line: the fixed nudge sentence, its supporting sentence, and an \"Unlock the course\" CTA with a slide-arrow. This is the shape every free surface (foundations, leaderboard) shows a trial learner.",
                        code: "<TrialEnrollBanner isVisible onEnroll={handleEnroll} />",
                        render: (
                            <TrialEnrollBanner

                               
                                isVisible
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
 * LEAF — **self-hides**, empty tree. The caller has resolved `isVisible` to
 * `false` (whether because status isn't known yet or the learner is already
 * enrolled — that resolution happens on the caller's side of the prop now).
 */
export const Hidden: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="TrialEnrollBanner"
                tier="block"
                leaf="Self-hides"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "isVisible = false",
                        why: "The caller has resolved this learner as not needing the nudge (already enrolled, or the check simply came back negative), so the block renders nothing rather than an empty-looking strip.",
                        code: "<TrialEnrollBanner isVisible={false} onEnroll={handleEnroll} />",
                        render: <TrialEnrollBanner isVisible={false} onEnroll={() => {}} />,
                    },
                ]}
            />
        </div>
    ),
}

/**
 * LEAF — `isSkeleton`, reserves the banner's footprint while the enrollment
 * check that feeds `isVisible` is still in flight. Wins over `isVisible`.
 */
export const Skeleton: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="TrialEnrollBanner"
                tier="block"
                leaf="Skeleton"
                parts={[]}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "The enrollment check hasn't resolved yet, so the block shimmers two text bars in the strip's exact shape instead of guessing `isVisible` — the surrounding list/header does not jump once the real check lands. Wins over whatever `isVisible` currently holds.",
                        code: "<TrialEnrollBanner isVisible={false} isSkeleton onEnroll={handleEnroll} />",
                        render: <TrialEnrollBanner isVisible={false} isSkeleton onEnroll={() => {}} />,
                    },
                ]}
            />
        </div>
    ),
}
