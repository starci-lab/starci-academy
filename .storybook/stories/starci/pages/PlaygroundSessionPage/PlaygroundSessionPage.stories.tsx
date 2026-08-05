import type { Meta, StoryObj } from "@storybook/nextjs"
import { PlaygroundSessionPage } from "@sb-components/starci/pages/PlaygroundSessionPage/PlaygroundSessionPage"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * SCREEN — `PlaygroundSessionPage`: run one playground exercise. See the
 * component's file header for the full function list and the two-pane layout's
 * precedent; this file only builds on top of that.
 *
 * ONE LEAF, THREE DATA STATES (§14d.2/§11f) — every state renders the SAME four
 * blocks in the SAME two-pane-plus-docked-sheet shape; only what each block is
 * told changes (a step vs. no step left, a live pairing vs. a first-time wait).
 * None of the three removes or adds a node at the SCREEN's own tier — the
 * structural forks that exist (the guide's completion leaf, the sheet's device
 * body) already live one tier down, inside `PlaygroundStepGuide` and
 * `PlaygroundConnectSheet`'s own leaf/state splits.
 */
const meta: Meta<typeof PlaygroundSessionPage> = {
    title: "StarCi/Pages/PlaygroundSessionPage/PlaygroundSessionPage",
    component: PlaygroundSessionPage,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof PlaygroundSessionPage>

const STEP_BODY = `Build the app image from the Dockerfile at the root of the repo.

Run the command below in your own terminal, wait for the build to finish, then click **Verify this step**.`

const RESOURCES = [
    { kind: "container", name: "web-app-1", status: "Up 2 hours" },
    { kind: "container", name: "worker-queue", status: "Restarting (1) 4 seconds ago" },
    { kind: "image", name: "node:20-alpine", status: "Ready" },
    { kind: "image", name: "lab-app:latest", status: "Ready" },
]

const DEVICE = {
    platform: "Windows",
    arch: "x64",
    hostname: "HOC-VIEN-01",
    cpuCores: 12,
    cpuModel: "Intel Core i7-13700H",
    totalMemBytes: 34_359_738_368,
    freeMemBytes: 12_884_901_888,
    gpu: "NVIDIA RTX 4060 Laptop",
    vramTotalMb: 8192,
    vramFreeMb: 6144,
}

const AGENT_LOG = [
    { level: "info" as const, line: "Agent starting up, probing port 41230…" },
    { level: "success" as const, line: "Handshake with the playground server succeeded." },
    { level: "info" as const, line: "Syncing workspace container…" },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "StackV": { tier: "frame", role: "the screen's own vertical rhythm — the top-level session column, the workspace region wrapper, each pane's own inset, and the sheet's absolute-positioned anchor", storyId: "frames-stack-stackv--default" },
    "StackH": { tier: "frame", role: "the two-pane row itself — the step guide and the resource panel side by side, with `divider` drawing the seam between them", storyId: "frames-stack-stackh--with-divider" },
    "WorkSessionHeader": { tier: "block", role: "the session band — back link, position in the run, and the progress rail — shared with Quiz's own active/recap phases", storyId: "starci-blocks-navigation-worksessionheader-worksessionheader--full" },
    "PlaygroundStepGuide": { tier: "block", role: "the left pane: the current step's instructions, its command, and the verify action", storyId: "starci-blocks-learn-playgroundstepguide-playgroundstepguide--step" },
    "PlaygroundResourcePanel": { tier: "block", role: "the right pane: the live resource snapshot the paired machine reports, grouped by kind", storyId: "starci-blocks-learn-playgroundresourcepanel-playgroundresourcepanel--panel" },
    "PlaygroundConnectSheet": { tier: "block", role: "the docked connection console anchored to the bottom of the workspace region — status, reconnect, device specs and the agent log", storyId: "starci-blocks-learn-playgroundconnectsheet-playgroundconnectsheet--sheet" },
}

/** LEAF — the session: one two-pane workspace plus a docked sheet, three DATA states. */
export const Session: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="PlaygroundSessionPage"
                tier="screen"
                leaf="Session"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="w-full"
                states={[
                    {
                        name: "step set, verifyState = ready, connection = connected, sheet closed",
                        why: "The everyday moment of a run: the agent is paired, the resource panel shows what is actually running, and the guide's Verify button sits ready. The connect sheet stays collapsed to its peek row — the learner only opens it when something needs checking, not while things are working.",
                        code: `<PlaygroundSessionPage
    backLabel="Leave the lab"
    onBack={handleBack}
    counter="Step 2 / 5"
    total={5}
    current={2}
    doneSteps={[1]}
    step={step}
    verifyState="ready"
    onVerify={handleVerify}
    onLeaveGuideComplete={handleLeaveComplete}
    connection="connected"
    latencyMs={42}
    device={device}
    agentLog={agentLog}
    onReconnect={handleReconnect}
    resources={resources}
    isConnectSheetOpen={false}
    onConnectSheetOpenChange={setSheetOpen}
/>`,
                        render: (
                            <PlaygroundSessionPage

                                backLabel="Leave the lab"
                                onBack={() => {}}
                                title="Docker for a web app"
                                counter="Step 2 / 5"
                                total={5}
                                current={2}
                                doneSteps={[1]}
                                step={{
                                    title: "Step 2 · Build the app image",
                                    body: STEP_BODY,
                                    commandHint: "docker build -t lab-app:latest .",
                                }}
                                verifyState="ready"
                                onVerify={() => {}}
                                onLeaveGuideComplete={() => {}}
                                connection="connected"
                                latencyMs={42}
                                device={DEVICE}
                                agentLog={AGENT_LOG}
                                onReconnect={() => {}}
                                resources={RESOURCES}
                                isConnectSheetOpen={false}
                                onConnectSheetOpenChange={() => {}}
                            />
                        ),
                    },
                    {
                        name: "step set, verifyState = waitingForConnection, connection = waiting, sheet open",
                        why: "The learner opened the lab before their local agent finished attaching: the guide shows a quiet hint instead of a Verify button that would press into nothing, the resource panel invites pairing rather than showing an empty accordion, and the sheet is open on its not-connected hint — the one moment the learner most needs the console visible without having to ask for it.",
                        code: `<PlaygroundSessionPage
    …
    verifyState="waitingForConnection"
    connection="waiting"
    agentLog={[]}
    resources={[]}
    isConnectSheetOpen
/>`,
                        render: (
                            <PlaygroundSessionPage
                                backLabel="Leave the lab"
                                onBack={() => {}}
                                title="Docker for a web app"
                                counter="Step 1 / 5"
                                total={5}
                                current={1}
                                step={{
                                    title: "Step 1 · Start Postgres",
                                    body: STEP_BODY,
                                    commandHint: "docker run --name pg-lab -e POSTGRES_PASSWORD=lab -p 5432:5432 -d postgres:16",
                                }}
                                verifyState="waitingForConnection"
                                onVerify={() => {}}
                                onLeaveGuideComplete={() => {}}
                                connection="waiting"
                                agentLog={[]}
                                onReconnect={() => {}}
                                resources={[]}
                                isConnectSheetOpen
                                onConnectSheetOpenChange={() => {}}
                            />
                        ),
                    },
                    {
                        name: "step = undefined (every step verified), connection = connected, sheet closed",
                        why: "The run itself is finished — `step` is undefined so the guide swaps end to end for its own completion leaf — but the workspace is not torn down: the resource panel keeps showing what is still running, because the learner may want to look at their own containers a moment longer before leaving. The session band's rail reads full and `onFinish` is how they actually leave.",
                        code: `<PlaygroundSessionPage
    …
    step={undefined}
    doneSteps={[1, 2, 3, 4, 5]}
    finishLabel="Finish"
    onFinish={handleFinish}
/>`,
                        render: (
                            <PlaygroundSessionPage
                                backLabel="Leave the lab"
                                onBack={() => {}}
                                title="Docker for a web app"
                                counter="Finished 5 / 5"
                                total={5}
                                current={5}
                                doneSteps={[1, 2, 3, 4, 5]}
                                finishLabel="Finish"
                                onFinish={() => {}}
                                step={undefined}
                                verifyState="ready"
                                onVerify={() => {}}
                                onLeaveGuideComplete={() => {}}
                                connection="connected"
                                latencyMs={38}
                                device={DEVICE}
                                agentLog={AGENT_LOG}
                                onReconnect={() => {}}
                                resources={RESOURCES}
                                isConnectSheetOpen={false}
                                onConnectSheetOpenChange={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
