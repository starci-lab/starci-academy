import type { Meta, StoryObj } from "@storybook/nextjs"
import { TaskLockedAlert } from "@sb-components/starci/blocks/learn/TaskLockedAlert/TaskLockedAlert"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `TaskLockedAlert`: warning shown while previewing a personal-project
 * task that isn't unlocked yet, with a "go to current task" CTA.
 *
 * Composed from `Callout` (which itself is an `Alert` + one owned CTA
 * `Button`) rather than hand-rolled — see the component's file header for why
 * (the `CourseTeamGate` precedent + the `ContentTabBar` cautionary tale).
 *
 * 📐 LEAF by STRUCTURE: whether the CTA button exists is a real structural
 * difference (`Callout` renders no action node at all without it), so
 * "with CTA" vs "no CTA" are two leaves, not one leaf with a toggled prop.
 */
const meta: Meta<typeof TaskLockedAlert> = {
    title: "StarCi/Blocks/Learn/TaskLockedAlert/TaskLockedAlert",
    component: TaskLockedAlert,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof TaskLockedAlert>

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Callout": { tier: "composite", role: "the warning-tinted alert frame this block builds its title/description/CTA into, owning the Alert+Button pairing so this block doesn't hand-roll it", storyId: "composites-feedback-callout-callout--default" },
}

/** LEAF — a target task is known, so the "go to current task" CTA renders. */
export const WithCta: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="TaskLockedAlert"
                tier="block"
                leaf="With CTA"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-2xl"
                states={[
                    {
                        name: "onGoToCurrentTask provided",
                        why: "The learner is previewing an earlier, still-locked task while a different task is already unlocked and in progress — the caller knows where \"the current task\" is, so it passes the handler and the CTA appears.",
                        code: `<TaskLockedAlert
    message="You can still view this task's criteria. AI grading, feedback, history, and the GitHub section will unlock once you finish the previous step."
    onGoToCurrentTask={() => router.push(currentTaskPath)}
/>`,
                        render: (
                            <TaskLockedAlert
                                anatPart="TaskLockedAlert"
                                showAnatomy
                                message="You can still view this task's criteria. AI grading, feedback, history, and the GitHub section will unlock once you finish the previous step."
                                onGoToCurrentTask={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — no known target task ⇒ **loses** the whole CTA `Button` node. */
export const NoCta: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="TaskLockedAlert"
                tier="block"
                leaf="No CTA"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-2xl"
                states={[
                    {
                        name: "onGoToCurrentTask omitted",
                        why: "There is no other unlocked task to jump to yet, so the caller does not pass a handler — the alert still explains why this task is locked, but ends without a dangling button that would go nowhere.",
                        code: `<TaskLockedAlert
    message="You can still view this task's criteria. AI grading, feedback, history, and the GitHub section will unlock once you finish the previous step."
/>`,
                        render: (
                            <TaskLockedAlert
                                anatPart="TaskLockedAlert"
                                showAnatomy
                                message="You can still view this task's criteria. AI grading, feedback, history, and the GitHub section will unlock once you finish the previous step."
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
