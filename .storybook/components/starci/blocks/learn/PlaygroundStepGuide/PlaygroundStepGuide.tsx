import React from "react"
import { Skeleton as HeroSkeleton } from "@heroui/react"
import { CheckCircleIcon } from "@phosphor-icons/react"
import { MarkdownContent } from "@sb-components/composites/viewers/MarkdownContent/MarkdownContent"
import { FeedbackEmpty } from "@sb-components/composites/feedback/Feedback/Feedback"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Spinner } from "@sb-components/atoms/display/Spinner/Spinner"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `PlaygroundStepGuide`: the LEFT pane of a playground run. Read the
 * current step's instructions and the exact command to run on the learner's
 * own machine, then ask the connected agent to verify it. Owns the "every step
 * is done" completion state too, because that state replaces this exact pane —
 * it is not a different screen.
 *
 * ⭐ REUSE-FIRST CHECK (this run exists because a sibling block once skipped
 * it — see `ContentModeNav`'s file header). Grepped the catalog before writing
 * a line: no composite draws "instructions + a runnable command + a verify
 * action" as one shape, so there is nothing to reach past here. What DOES
 * exist and gets composed straight: `MarkdownContent` (the body AND the
 * command fence — same viewer, twice, matching the real
 * `PlaygroundStepGuide.tsx` source's dual use: prose through the standard
 * grammar, the command through the SAME renderer's fenced-code-with-copy
 * skin instead of a hand-rolled `<pre>`), `Feedback.Empty` for completion
 * (not a bespoke "all done" card), `Typography`/`Button`/`Spinner` at the
 * atom tier, `StackV`/`StackH` for every seam.
 *
 * ⭐ THE COMMAND IS MARKDOWN, NOT A CODE ATOM. `MarkdownContent` already owns
 * "fenced block → language tag + copy button" (`SnippetIcon` inside its own
 * `pre` renderer). Wrapping `commandHint` in a single fenced-code document and
 * handing it to the SAME viewer gets that skin for free and keeps exactly one
 * code-rendering code path in the tree, instead of a second one this block
 * would have to keep in sync forever.
 *
 * ⭐ THE ACTION SLOT IS ONE WRAPPER, FOUR DATA STATES (§14d.2 — a state, not a
 * leaf, because none of the four adds or removes the SLOT itself, only what
 * sits inside it):
 *   • `waitingForConnection` — a quiet hint, no button: nothing can be
 *     verified before an agent is even attached, so offering a press that
 *     can't do anything would be a lie in button form.
 *   • `ready` — the `Verify` button alone.
 *   • `pending` — the button is REPLACED by a manual `Spinner` + status line,
 *     not `Button`'s own `isPending` skin. Judgement call, flagged rather than
 *     silent: every other pending button in this tree (`QuizSetup`,
 *     `LeaderboardToolbar`) keeps the button on screen because their action
 *     resolves in a network round-trip. This one waits on a command the
 *     learner is running by hand on a REMOTE machine — open-ended, no local
 *     timeout to promise — so parking an interactive control in a
 *     disabled-but-still-a-button state overstates how soon it will resolve.
 *     A bare status row says "watching for it" instead.
 *   • `missed` — the button returns (so retrying costs one press, not a
 *     re-read of the instructions) WITH a hint line below it explaining the
 *     miss, exactly the shape asked for.
 *
 * 📐 TWO LEAVES BY STRUCTURE, matching `ContentHeader`'s `Full`/`NoOutcomes`
 * precedent, NOT the abbreviated one-leaf summary this task started from.
 * `step.commandHint` is optional, and losing it drops the second
 * `MarkdownContent` node entirely — a node appearing/disappearing is exactly
 * the structural test §14d.2 uses to promote a condition from state to leaf,
 * the same test that made `ContentHeader`'s outcomes card its own leaf rather
 * than a state of `Full`. So: `Step` (has a command) and `StepNoCommand` (a
 * read-only explainer step) are two leaves; `verifyState` stays a STATE inside
 * each, since it never changes which nodes are on screen. `Complete` is the
 * third leaf — swapping the entire pane for `Feedback.Empty` is the largest
 * structural change this block can make.
 *
 * A BLOCK OWNS ITS WORDING (§14d.1). The verify label, the pending/missed/
 * waiting hints, and the completion title/description/back-label are ALL
 * authored here — none of them cross the prop boundary as a string.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Fenced-code wrapper so the command reuses `MarkdownContent`'s own code-block skin. */
const commandFence = (command: string) => "```bash\n" + command + "\n```"

/** One step's authored content. */
export interface PlaygroundStep {
    /** Step heading, e.g. "Bước 2 · Build image". */
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
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
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
    showAnatomy = false,
    anatPart,
}: PlaygroundStepGuideProps) => {
    if (isSkeleton) {
        const loadingStep = (
            <>
                <HeroSkeleton className="h-6 w-48 rounded" />
                <StackV
                    gap="tight"
                    anatPart={showAnatomy ? "StackV" : undefined}
                    body={
                        <>
                            <HeroSkeleton className="h-4 w-full rounded" />
                            <HeroSkeleton className="h-4 w-2/3 rounded" />
                        </>
                    }
                />
                <HeroSkeleton className="h-9 w-36 rounded-xl" />
            </>
        )
        return (
            <div data-anat-part={anatPart}>
                <StackV gap="section" anatPart={showAnatomy ? "StackV" : undefined} body={loadingStep} />
            </div>
        )
    }
    if (step == null) {
        return (
            <div data-anat-part={anatPart}>
                <FeedbackEmpty
                    icon={CheckCircleIcon}
                    tone="neutral"
                    title="Đã hoàn thành mọi bước!"
                    description="Bạn đã đi hết lộ trình playground này. Quay lại trung tâm để chọn bài tiếp theo."
                    anatPart={showAnatomy ? "FeedbackEmpty" : undefined}
                >
                    <Button
                        label="Về trung tâm Playground"
                        variant="secondary"
                        onPress={onLeaveComplete}
                        anatPart={showAnatomy ? "Button" : undefined}
                    />
                </FeedbackEmpty>
            </div>
        )
    }

    // Manual spinner, not `Button`'s own `isPending` skin — see the file header
    // for why an open-ended remote check gets a status row instead of a parked
    // button.
    const verifyPendingStatus = (
        <StackH
            gap="related"
            anatPart={showAnatomy ? "StackH" : undefined}
            body={
                <>
                    <Spinner size="sm" tone="accent" showAnatomy={showAnatomy} />
                    <Typography size="sm" color="muted" text="Đang kiểm tra…" anatPart={showAnatomy ? "Typography" : undefined} />
                </>
            }
        />
    )

    const verifyControls = (
        <StackV
            gap="tight"
            anatPart={showAnatomy ? "StackV" : undefined}
            body={
                <>
                    {verifyState === "waitingForConnection" ? (
                        <Typography
                            size="sm"
                            color="muted"
                            text="Đang chờ kết nối tới máy học của bạn…"
                            anatPart={showAnatomy ? "Typography" : undefined}
                        />
                    ) : null}

                    {verifyState === "ready" || verifyState === "missed" ? (
                        <Button
                            label="Xác minh bước này"
                            variant="primary"
                            onPress={onVerify}
                            anatPart={showAnatomy ? "Button" : undefined}
                        />
                    ) : null}

                    {verifyState === "pending" ? verifyPendingStatus : null}

                    {verifyState === "missed" ? (
                        <Typography
                            size="xs"
                            color="danger"
                            text="Chưa thấy kết quả đúng — chạy lại lệnh rồi xác minh lần nữa nhé."
                            anatPart={showAnatomy ? "Typography" : undefined}
                        />
                    ) : null}
                </>
            }
        />
    )

    const commandSection = step.commandHint != null ? (
        <StackV
            gap="tight"
            anatPart={showAnatomy ? "StackV" : undefined}
            body={
                <>
                    <Typography size="xs" weight="medium" color="muted" text="Lệnh cần chạy" anatPart={showAnatomy ? "Typography" : undefined} />
                    <MarkdownContent
                        source={commandFence(step.commandHint)}
                        measure="compact"
                        anatPart={showAnatomy ? "MarkdownContent" : undefined}
                    />
                </>
            }
        />
    ) : null

    const guideBody = (
        <>
            <Typography size="h4" weight="bold" text={step.title} anatPart={showAnatomy ? "Typography" : undefined} />
            <MarkdownContent source={step.body} measure="reading" anatPart={showAnatomy ? "MarkdownContent" : undefined} />
            {commandSection}
            {verifyControls}
        </>
    )

    return (
        <div data-anat-part={anatPart}>
            <StackV gap="section" anatPart={showAnatomy ? "StackV" : undefined} body={guideBody} />
        </div>
    )
}

export { PlaygroundStepGuide }
