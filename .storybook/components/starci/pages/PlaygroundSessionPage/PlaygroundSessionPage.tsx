import React from "react"
import { WorkSessionHeader } from "@sb-components/starci/blocks/navigation/WorkSessionHeader/WorkSessionHeader"
import {
    PlaygroundStepGuide,
    type PlaygroundStep,
    type PlaygroundStepVerifyState,
} from "@sb-components/starci/blocks/learn/PlaygroundStepGuide/PlaygroundStepGuide"
import {
    PlaygroundResourcePanel,
    type PlaygroundResourceEntry,
    type PlaygroundConnectionState as PlaygroundResourcePanelConnection,
} from "@sb-components/starci/blocks/learn/PlaygroundResourcePanel/PlaygroundResourcePanel"
import {
    PlaygroundConnectSheet,
    type PlaygroundConnectionState,
    type PlaygroundDeviceSpec,
    type PlaygroundAgentLogLine,
} from "@sb-components/starci/blocks/learn/PlaygroundConnectSheet/PlaygroundConnectSheet"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `PlaygroundSessionPage` — the screen for running one playground exercise: read the
 * current step, run its command on your own machine, watch your live workspace report
 * back, and monitor the pairing. It composes blocks in frames and hands each typed
 * data, drawing no shape of its own.
 *
 * Four functions: `WorkSessionHeader` (position + two ways to leave),
 * `PlaygroundStepGuide` (read and verify the step), `PlaygroundResourcePanel` (the
 * live workspace snapshot), and `PlaygroundConnectSheet` (the pairing, docked and
 * floating over the two-pane workspace). Two-pane workspace, no `Container`. One
 * `connection` prop drives both the sheet's three-state wording and the panel's binary
 * reading. No `isSkeleton` (no composed block accepts one).
 */

/** Props for {@link PlaygroundSessionPage}. */
export interface PlaygroundSessionPageProps {
    // ── session band (`WorkSessionHeader`) ──
    /** Back-link label — leave, run stays resumable. */
    backLabel: string
    /** Fired when the learner leaves without ending the run. */
    onBack: () => void
    /** Session title, e.g. the exercise name. */
    title?: string
    /** Where the learner is, already worded, e.g. "Step 2 / 5". */
    counter: string
    /** How many steps this run has. */
    total: number
    /** Which step is being viewed, 1-based. */
    current: number
    /** Steps already verified, 1-based. */
    doneSteps?: Array<number>
    /** Fired with a 1-based step when the learner taps the rail. */
    onStepPress?: (step: number) => void
    /** Finish-now label. Present with `onFinish` → the end-now control shows. */
    finishLabel?: string
    /** Fired when the learner ends the run early. */
    onFinish?: () => void

    // ── left pane: the step guide ──
    /** The step being read. Omit → every step is done, the guide shows its completion leaf. */
    step?: PlaygroundStep
    /** Where the current step's verify action stands. Ignored once `step` is omitted. */
    verifyState: PlaygroundStepVerifyState
    /** Fired when the learner presses `Verify` (or retries after a miss). */
    onVerify: () => void
    /** Fired from the guide's completion leaf, back to the Playground hub. */
    onLeaveGuideComplete: () => void

    // ── shared pairing state (right pane + docked sheet) ──
    /** How the paired machine's connection currently stands. */
    connection: PlaygroundConnectionState
    /** Round-trip time to the local agent. Only read while `connection === "connected"`. */
    latencyMs?: number
    /** The paired machine's specs, once the agent has reported at least once. */
    device?: PlaygroundDeviceSpec
    /** Live tail of the local agent's log, oldest first. */
    agentLog: Array<PlaygroundAgentLogLine>
    /** Fired when the learner presses the sheet's reconnect action. */
    onReconnect: () => void

    // ── right pane: the live resource snapshot ──
    /** The flat resource snapshot as the socket reports it. */
    resources: Array<PlaygroundResourceEntry>

    // ── docked sheet open state ──
    /** Whether the connect sheet's body (device specs + log) is expanded. Controlled. */
    isConnectSheetOpen: boolean
    /** Fired with the next expanded state when the learner presses the sheet's toggle. */
    onConnectSheetOpenChange: (open: boolean) => void

}

/**
 * The playground run screen. See the file header for the function list and the
 * two-pane layout's precedent.
 *
 * @param props - {@link PlaygroundSessionPageProps}
 */
const PlaygroundSessionPage = ({
    backLabel,
    onBack,
    title,
    counter,
    total,
    current,
    doneSteps,
    onStepPress,
    finishLabel,
    onFinish,
    step,
    verifyState,
    onVerify,
    onLeaveGuideComplete,
    connection,
    latencyMs,
    device,
    agentLog,
    onReconnect,
    resources,
    isConnectSheetOpen,
    onConnectSheetOpenChange,
}: PlaygroundSessionPageProps) => {
    // See the file header's "ONE CONNECTION ENUM, TWO VOCABULARIES" note — the
    // resource panel only ever asks a binary question.
    const resourcePanelConnection: PlaygroundResourcePanelConnection =
        connection === "connected" ? "connected" : "notConnected"

    const guidePane = (
        <StackV
            gap={1}
            padding={6}
            className="overflow-y-auto"
            classNames={["min-w-0", "flex-1"]}

            items={[
                () => (
                    <PlaygroundStepGuide

                        step={step}
                        verifyState={verifyState}
                        onVerify={onVerify}
                        onLeaveComplete={onLeaveGuideComplete}

                    />
                ),
            ]}
        />
    )

    const resourcePane = (
        <StackV
            gap={1}
            padding={6}
            className="overflow-y-auto @app-xl:w-[24rem]"
            classNames={["w-full", "shrink-0"]}

            items={[
                () => (
                    <PlaygroundResourcePanel

                        connection={resourcePanelConnection}
                        resources={resources}

                    />
                ),
            ]}
        />
    )

    // The workspace region: two panes side by side, plus the docked sheet
    // anchored (not laid out) against this box — see the file header.
    const workspaceRegion = (
        <>
            <StackH
                gap={6}
                align="start"
                divider
                className="overflow-hidden"
                classNames={["h-full", "min-h-0"]}

                items={[
                    () => guidePane,
                    () => resourcePane,
                ]}
            />
            <StackV
                gap={1}
                className="absolute inset-x-0 bottom-0 z-10"

                items={[
                    () => (
                        <PlaygroundConnectSheet

                            connection={connection}
                            latencyMs={latencyMs}
                            device={device}
                            agentLog={agentLog}
                            onReconnect={onReconnect}
                            open={isConnectSheetOpen}
                            onOpenChange={onConnectSheetOpenChange}

                        />
                    ),
                ]}
            />
        </>
    )

    const sessionSections = (
        <>
            <WorkSessionHeader

                backLabel={backLabel}
                onBack={onBack}
                title={title}
                counter={counter}
                total={total}
                current={current}
                doneSteps={doneSteps}
                onStepPress={onStepPress}
                finishLabel={finishLabel}
                onFinish={onFinish}

            />
            <StackV
                gap={1}
                className="relative"
                classNames={["min-h-0", "flex-1"]}

                items={[() => workspaceRegion]}
            />
        </>
    )

    return <StackV gap={1} className="h-[calc(100vh-4rem)]" items={[() => sessionSections]} />
}

export { PlaygroundSessionPage }
