import React from "react"
import { Skeleton as HeroSkeleton } from "@heroui/react"
import { CheckCircleIcon } from "@phosphor-icons/react"
import { MarkdownContent } from "@sb-components/composites/viewers/MarkdownContent/MarkdownContent"
import { EmptyState } from "@sb-components/composites/feedback/EmptyState/EmptyState"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Spinner } from "@sb-components/atoms/display/Spinner/Spinner"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `PlaygroundStepGuide` — the left pane of a playground run: the current step's
 * instructions and the exact command to run, then a verify action asking the
 * connected agent to check it. Owns the "all steps done" completion state too
 * (it replaces this pane via `EmptyState`). The command renders through
 * `MarkdownContent` (one code path for prose and the command fence). The action
 * slot has four data states — `waitingForConnection` (hint, no button), `ready`
 * (the Verify button), `pending` (a manual `Spinner` + status line, since the
 * command runs open-ended on a remote machine), and `missed` (button returns
 * with a hint). Three leaves: `Step` (has a command), `StepNoCommand`, and
 * `Complete`. The block owns all its wording.
 */

/** Fenced-code wrapper so the command reuses `MarkdownContent`'s own code-block skin. */
const commandFence = (command: string) => "```bash\n" + command + "\n```"

/** One step's authored content. */
export interface PlaygroundStep {
    /** Step heading, e.g. "Step 2 · Build image". */
    title: string
    /** Instructions body, markdown — what to do and why. */
    body: string
    /** The exact shell command to run. Omitted → a read-only explainer step with no command fence. */
    commandHint?: string
}

/** Where the verify action stands right now. */
export type PlaygroundStepVerifyState =
    | "waitingForConnection"
    | "ready"
    | "pending"
    | "missed"

/** Props for {@link PlaygroundStepGuide}. */
export interface PlaygroundStepGuideProps {
    /** The step being read. `undefined` → every step is done, render the completion leaf. */
    step?: PlaygroundStep
    /** State of the verify action for the current step. Ignored once `step` is `undefined`. */
    verifyState: PlaygroundStepVerifyState
    /** Fired when the learner presses `Verify` (from `ready` or to retry from `missed`). */
    onVerify: () => void
    /** Fired from the completion leaf's back-to-hub action. */
    onLeaveComplete: () => void
    /**
     * `true` → shimmer the step-reading shape, DISTINCT from `step` being
     * `undefined` (which means "run complete", a real business state, not a
     * loading one — see `step`'s own doc).
     */
    isSkeleton?: boolean
}

/**
 * The step-reading pane. See the file header for the leaf/state split and why
 * the pending state draws its own spinner instead of `Button`'s.
 *
 * @param props - {@link PlaygroundStepGuideProps}
 */
const PlaygroundStepGuide = ({
    step,
    verifyState,
    onVerify,
    onLeaveComplete,
    isSkeleton = false,
}: PlaygroundStepGuideProps) => {
    if (isSkeleton) {
        const loadingStep = (
            <>
                <HeroSkeleton className="h-6 w-48 rounded" />
                <StackV
                    gap={2}
                    isSkeleton={isSkeleton}
                    items={[
                        () => <HeroSkeleton className="h-4 w-full rounded" />,
                        () => <HeroSkeleton className="h-4 w-2/3 rounded" />,
                    ]}
                />
                <HeroSkeleton className="h-9 w-36 rounded-xl" />
            </>
        )
        return (
            <div>
                <StackV gap={6} isSkeleton={isSkeleton} items={[() => loadingStep]} />
            </div>
        )
    }
    if (step == null) {
        return (
            <div>
                <EmptyState
                    icon={CheckCircleIcon}
                    tone="neutral"
                    title="All steps completed!"
                    description="You've made it through this playground path. Head back to the hub to pick the next exercise."
                    body={() => (
                        <Button
                            label="Back to Playground hub"
                            variant="secondary"
                            onPress={onLeaveComplete}
                        />
                    )}
                />
            </div>
        )
    }

    // Manual spinner, not `Button`'s own `isPending` skin — see the file header
    // for why an open-ended remote check gets a status row instead of a parked
    // button.
    const verifyPendingStatus = (
        <StackH
            gap={3}
            isSkeleton={isSkeleton}
            items={[
                () => <Spinner size="sm" tone="accent" />,
                () => <Typography size="sm" color="muted" text="Checking…" />,
            ]}
        />
    )

    const verifyControls = (
        <StackV
            gap={2}
            isSkeleton={isSkeleton}
            items={[
                ...(verifyState === "waitingForConnection" ? [() => (
                    <Typography
                        size="sm"
                        color="muted"
                        text="Waiting for a connection to your learning machine…"

                    />
                )] : []),
                ...(verifyState === "ready" || verifyState === "missed" ? [() => (
                    <Button
                        label="Verify this step"
                        variant="primary"
                        onPress={onVerify}

                    />
                )] : []),
                ...(verifyState === "pending" ? [() => verifyPendingStatus] : []),
                ...(verifyState === "missed" ? [() => (
                    <Typography
                        size="xs"
                        color="danger"
                        text="Didn't see the expected result yet — rerun the command and verify again."

                    />
                )] : []),
            ]}
        />
    )

    const commandSection = step.commandHint != null ? (
        <StackV
            gap={2}
            isSkeleton={isSkeleton}
            items={[
                () => <Typography size="xs" weight="medium" color="muted" text="Command to run" />,
                () => (
                    <MarkdownContent
                        source={commandFence(step.commandHint ?? "")}
                        measure="compact"

                    />
                ),
            ]}
        />
    ) : null

    const guideBody = (
        <>
            <Typography size="h4" weight="bold" text={step.title} />
            <MarkdownContent source={step.body} measure="reading" />
            {commandSection}
            {verifyControls}
        </>
    )

    return (
        <div>
            <StackV gap={6} isSkeleton={isSkeleton} items={[() => guideBody]} />
        </div>
    )
}

export { PlaygroundStepGuide }
