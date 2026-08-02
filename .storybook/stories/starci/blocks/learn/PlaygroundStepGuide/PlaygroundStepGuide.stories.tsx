import type { Meta, StoryObj } from "@storybook/nextjs"
import { PlaygroundStepGuide } from "@sb-components/starci/blocks/learn/PlaygroundStepGuide/PlaygroundStepGuide"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `PlaygroundStepGuide` — the left pane of a playground run: read the current step,
 * run its command on your own machine, ask the agent to verify it. Three shapes:
 *   • `Step` — a step with a command fence; `verifyState` moves through its four
 *     data states inside the one action slot.
 *   • `StepNoCommand` — a read-only explainer step with `commandHint` missing, so the
 *     second `MarkdownContent` node is gone.
 *   • `Complete` — `step` is `undefined`, so the pane is replaced end to end by `EmptyState`.
 */
const meta: Meta<typeof PlaygroundStepGuide> = {
    title: "StarCi/Blocks/Learn/PlaygroundStepGuide/PlaygroundStepGuide",
    component: PlaygroundStepGuide,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof PlaygroundStepGuide>

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "StackV": { tier: "frame", role: "the vertical track holding the step title, its body, the optional command fence and the action slot, one seam between each", storyId: "frames-stack-stackv--default" },
    "StackH": { tier: "frame", role: "the horizontal track pairing the manual spinner with its status line while a verify check is in flight", storyId: "frames-stack-stackh--default" },
    "Typography": { tier: "atom", role: "one of the block's own text lines — the step title, the command-fence label, or a verify-state hint", storyId: "atoms-text-typography-typography--plain" },
    "MarkdownContent": { tier: "composite", role: "the markdown viewer, composed twice: once for the step's prose body, once for the command wrapped in a fenced code block so it gets the same copy-button skin", storyId: "composites-viewers-markdowncontent--reading" },
    "Button": { tier: "atom", role: "the Verify action (or, in the completion leaf, the back-to-hub action)", storyId: "atoms-buttons-button-button--default" },
    "Spinner": { tier: "atom", role: "the manual busy indicator standing in for the button while a remote verify check is open-ended", storyId: "atoms-display-spinner-spinner--default" },
    "EmptyState": { tier: "composite", role: "the completion placeholder replacing the whole pane once every step is done", storyId: "composites-feedback-emptystate-emptystate--action" },
    "Skeleton": { tier: "heroui", role: "the shimmer mirror standing in for the step title, body lines and verify button while `isSkeleton`" },
}

const STEP_BODY = `Set up a local Postgres container to hold data for this exercise.

Run the command below in your own terminal, wait for the container to report \`healthy\`, then click **Verify this step**.`

/** LEAF — a step with a command fence. `verifyState` moves through the action slot's four states. */
export const Step: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="PlaygroundStepGuide"
                tier="block"
                leaf="Step"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-2xl"
                states={[
                    {
                        name: "verifyState = waitingForConnection",
                        why: "The agent on the learner's machine has not attached yet, so nothing can be checked. The action slot shows a quiet hint instead of a button that would press into nothing.",
                        code: `<PlaygroundStepGuide
    step={step}
    verifyState="waitingForConnection"
    onVerify={handleVerify}
    onLeaveComplete={handleLeaveComplete}
/>`,
                        render: (
                            <PlaygroundStepGuide

                               
                                step={{
                                    title: "Step 1 · Start Postgres",
                                    body: STEP_BODY,
                                    commandHint: "docker run --name pg-lab -e POSTGRES_PASSWORD=lab -p 5432:5432 -d postgres:16",
                                }}
                                verifyState="waitingForConnection"
                                onVerify={() => {}}
                                onLeaveComplete={() => {}}
                            />
                        ),
                    },
                    {
                        name: "verifyState = ready",
                        why: "The agent is connected and the learner has not asked for a check yet, so the slot shows the plain Verify button. This is the resting state most of a step's reading time is spent in.",
                        code: `<PlaygroundStepGuide
    step={step}
    verifyState="ready"
    onVerify={handleVerify}
    onLeaveComplete={handleLeaveComplete}
/>`,
                        render: (
                            <PlaygroundStepGuide
                                step={{
                                    title: "Step 1 · Start Postgres",
                                    body: STEP_BODY,
                                    commandHint: "docker run --name pg-lab -e POSTGRES_PASSWORD=lab -p 5432:5432 -d postgres:16",
                                }}
                                verifyState="ready"
                                onVerify={() => {}}
                                onLeaveComplete={() => {}}
                            />
                        ),
                    },
                    {
                        name: "verifyState = pending",
                        why: "A check is running against the learner's own machine, which has no local timeout to promise. The button is replaced by a manual spinner and status line rather than a locked button that overstates how soon it resolves.",
                        code: `<PlaygroundStepGuide
    step={step}
    verifyState="pending"
    onVerify={handleVerify}
    onLeaveComplete={handleLeaveComplete}
/>`,
                        render: (
                            <PlaygroundStepGuide
                                step={{
                                    title: "Step 1 · Start Postgres",
                                    body: STEP_BODY,
                                    commandHint: "docker run --name pg-lab -e POSTGRES_PASSWORD=lab -p 5432:5432 -d postgres:16",
                                }}
                                verifyState="pending"
                                onVerify={() => {}}
                                onLeaveComplete={() => {}}
                            />
                        ),
                    },
                    {
                        name: "verifyState = missed",
                        why: "The check ran but did not find what it expected. The button returns so retrying costs one press, and a hint line explains the miss right under it rather than at the top of the pane.",
                        code: `<PlaygroundStepGuide
    step={step}
    verifyState="missed"
    onVerify={handleVerify}
    onLeaveComplete={handleLeaveComplete}
/>`,
                        render: (
                            <PlaygroundStepGuide
                                step={{
                                    title: "Step 1 · Start Postgres",
                                    body: STEP_BODY,
                                    commandHint: "docker run --name pg-lab -e POSTGRES_PASSWORD=lab -p 5432:5432 -d postgres:16",
                                }}
                                verifyState="missed"
                                onVerify={() => {}}
                                onLeaveComplete={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — a read-only explainer step: **loses** the whole command-fence `MarkdownContent` node. */
export const StepNoCommand: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="PlaygroundStepGuide"
                tier="block"
                leaf="No command"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-2xl"
                states={[
                    {
                        name: "step.commandHint = undefined",
                        why: "This step only explains what is about to happen — nothing to run yet — so the command fence and its label are not drawn at all. A step with no command should not show an empty code block claiming one exists.",
                        code: `<PlaygroundStepGuide
    step={{ title: "Step 0 · Before you begin", body: intro }}
    verifyState="ready"
    onVerify={handleVerify}
    onLeaveComplete={handleLeaveComplete}
/>`,
                        render: (
                            <PlaygroundStepGuide

                               
                                step={{
                                    title: "Step 0 · Before you begin",
                                    body: "This step assumes your machine already has Docker Desktop installed and the playground agent running in the background. Once you've read it, click **Verify this step** to move to the next one — there's no command to run here.",
                                }}
                                verifyState="ready"
                                onVerify={() => {}}
                                onLeaveComplete={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — every step is done: the whole pane is **replaced** by `EmptyState`. */
export const Complete: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="PlaygroundStepGuide"
                tier="block"
                leaf="Complete"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-2xl"
                states={[
                    {
                        name: "step = undefined",
                        why: "currentStepIndex has run past the last step, so there is no instruction left to show. The pane swaps end to end for a completion placeholder with one way back to the hub, rather than a blank space where the last step used to be.",
                        code: `<PlaygroundStepGuide
    step={undefined}
    verifyState="ready"
    onVerify={handleVerify}
    onLeaveComplete={handleLeaveComplete}
/>`,
                        render: (
                            <PlaygroundStepGuide

                               
                                step={undefined}
                                verifyState="ready"
                                onVerify={() => {}}
                                onLeaveComplete={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — the caller flips `isSkeleton`; a third, distinct state checked BEFORE the `step == null` completion branch. */
export const Skeleton: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="PlaygroundStepGuide"
                tier="block"
                leaf="Prop `isSkeleton`"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-2xl"
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "The pane is still fetching the current step, which is a loading state, not a business one. Checked FIRST, before `step == null`, so a guide that has not loaded yet is never mistaken for a run that has already finished every step.",
                        code: `<PlaygroundStepGuide
    isSkeleton
    verifyState="ready"
    onVerify={handleVerify}
    onLeaveComplete={handleLeaveComplete}
/>`,
                        render: (
                            <PlaygroundStepGuide

                               
                                isSkeleton
                                verifyState="ready"
                                onVerify={() => {}}
                                onLeaveComplete={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
