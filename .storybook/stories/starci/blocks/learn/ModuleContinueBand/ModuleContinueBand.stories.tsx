import type { Meta, StoryObj } from "@storybook/nextjs"
import { ModuleContinueBand } from "@sb-components/starci/blocks/learn/ModuleContinueBand/ModuleContinueBand"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `ModuleContinueBand` — the flat "resume + progress" cluster that opens both
 * course-home and module-home. A flat cluster, not a card (distinct from
 * `ContinueLearning` / `ContinueCardHero`). `resumeLessonTitle` presence drops two
 * nodes together (the title and the resume button), so "resume available" vs "all
 * done" are separate shapes; `isSkeleton` is its own too. Which numbers show in the
 * meter/sentence are data states inside the resume-available shape.
 */
const meta: Meta<typeof ModuleContinueBand> = {
    title: "StarCi/Blocks/Learn/ModuleContinueBand/ModuleContinueBand",
    component: ModuleContinueBand,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ModuleContinueBand>

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "StackH": { tier: "frame", role: "the resume row: eyebrow-plus-title on the left, the resume button on the right, one seam between them", storyId: "frames-stack-stackh--default" },
    "StackV": { tier: "frame", role: "the vertical text cluster inside the row — eyebrow flush above the resume title, since the two read as one unit of meaning", storyId: "frames-stack-stackv--default" },
    "Typography": { tier: "atom", role: "one of the block's own text lines — the eyebrow, the resume title, or the stat sentence it writes itself, real or its skeleton mirror", storyId: "atoms-text-typography-typography--overview" },
    "Button": { tier: "atom", role: "the resume CTA, only present while there is a lesson left to jump to", storyId: "atoms-buttons-button-button--default" },
    "ProgressMeter": { tier: "composite", role: "the lessons-read meter, the one progress signal this band shows", storyId: "composites-stats-progressmeter--label-and-value" },
    "Skeleton": { tier: "heroui", role: "the loading mirror standing in for the progress bar — `ProgressMeter` has no `isSkeleton` shape of its own yet, so the block builds this shimmer bar directly, matching the real track's height" },
}

/** LEAF — a lesson is still waiting: eyebrow + title + button all render. */
export const ResumeAvailable: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ModuleContinueBand"
                tier="block"
                leaf="Resume available"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-2xl"
                states={[
                    {
                        name: "lessonsRead = 4/12, challengesDone = 1/5",
                        why: "Early into the module: the eyebrow reads \"Keep learning\", the next unread lesson's title sits under it, and the button is live. The meter and the sentence below both read off the same numbers, so a learner never sees the bar and the sentence disagree.",
                        code: `<ModuleContinueBand
    resumeLessonTitle="Writing an optimized Dockerfile"
    lessonsRead={4}
    lessonsTotal={12}
    challengesDone={1}
    challengesTotal={5}
    onResume={onResume}
/>`,
                        render: (
                            <ModuleContinueBand


                                resumeLessonTitle="Writing an optimized Dockerfile"
                                lessonsRead={4}
                                lessonsTotal={12}
                                challengesDone={1}
                                challengesTotal={5}
                                onResume={() => {}}
                            />
                        ),
                    },
                    {
                        name: "lessonsRead = 11/12, challengesDone = 5/5",
                        why: "Near the end of the module: only one lesson is left to resume, so the meter is nearly full while the challenges half of the sentence already reads complete — the two counters do not have to finish together.",
                        code: `<ModuleContinueBand
    resumeLessonTitle="Quick notes on BuildKit"
    lessonsRead={11}
    lessonsTotal={12}
    challengesDone={5}
    challengesTotal={5}
    onResume={onResume}
/>`,
                        render: (
                            <ModuleContinueBand
                                resumeLessonTitle="Quick notes on BuildKit"
                                lessonsRead={11}
                                lessonsTotal={12}
                                challengesDone={5}
                                challengesTotal={5}
                                onResume={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — every lesson read: title + button drop out together, only the eyebrow changes shape. */
export const AllDone: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ModuleContinueBand"
                tier="block"
                leaf="All done"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-2xl"
                states={[
                    {
                        name: "resumeLessonTitle = undefined, lessonsRead = 12/12",
                        why: "There is genuinely no lesson left to jump to, so the block omits the title and the button rather than disabling them — a content-driven omission, not an event the block chose to swallow. The eyebrow switches to the all-done message and the meter still shows the full count.",
                        code: `<ModuleContinueBand
    lessonsRead={12}
    lessonsTotal={12}
    challengesDone={5}
    challengesTotal={5}
/>`,
                        render: (
                            <ModuleContinueBand


                                lessonsRead={12}
                                lessonsTotal={12}
                                challengesDone={5}
                                challengesTotal={5}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — the caller flips `isSkeleton`, so every composed part swaps to its own mirror. */
export const Skeleton: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ModuleContinueBand"
                tier="block"
                leaf="Prop `isSkeleton`"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-2xl"
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "Loading doesn't yet know whether a lesson is left to resume, so the shimmer always paints the fuller shape — title bar plus button pill — rather than guessing \"all done\", which is why nothing jumps once the real data lands and turns out to have a lesson waiting.",
                        code: `<ModuleContinueBand
    lessonsRead={0}
    lessonsTotal={0}
    challengesDone={0}
    challengesTotal={0}
    isSkeleton
/>`,
                        render: (
                            <ModuleContinueBand


                                lessonsRead={0}
                                lessonsTotal={0}
                                challengesDone={0}
                                challengesTotal={0}
                                isSkeleton
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
