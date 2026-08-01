import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    PlaygroundConnectSheet,
    type PlaygroundAgentLogLine,
    type PlaygroundConnectSheetProps,
    type PlaygroundDeviceSpec,
} from "@sb-components/starci/blocks/learn/PlaygroundConnectSheet/PlaygroundConnectSheet"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `PlaygroundConnectSheet`: the docked connection console under the lab
 * canvas — a peek row (status + reconnect) that never leaves the screen, and a
 * body the learner opens to see device specs and the live agent log.
 *
 * ONE LEAF, THREE DATA STATES (see the component's file header for the full
 * reasoning): `connected` shows the real device panel, `waiting` and `dropped`
 * share the same not-connected hint body and differ only in the peek chip's
 * wording/tone — `dropped` cannot happen without a prior connection, so no
 * extra `everConnected` prop is needed to tell the two apart.
 */
const meta: Meta<typeof PlaygroundConnectSheet> = {
    title: "StarCi/Blocks/Learn/PlaygroundConnectSheet/PlaygroundConnectSheet",
    component: PlaygroundConnectSheet,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof PlaygroundConnectSheet>

const DEVICE: PlaygroundDeviceSpec = {
    platform: "Windows",
    arch: "x64",
    hostname: "STUDENT-PC-01",
    cpuCores: 12,
    cpuModel: "Intel Core i7-13700H",
    totalMemBytes: 34_359_738_368,
    freeMemBytes: 12_884_901_888,
    gpu: "NVIDIA RTX 4060 Laptop",
    vramTotalMb: 8192,
    vramFreeMb: 6144,
}

const AGENT_LOG: Array<PlaygroundAgentLogLine> = [
    { level: "info", line: "Agent starting up, probing port 41230…" },
    { level: "success", line: "Handshake with the playground server succeeded." },
    { level: "info", line: "Syncing workspace container…" },
    { level: "warn", line: "Latency 210ms, higher than the usual threshold." },
]

// Plain `Omit` over a DISCRIMINATED UNION collapses the branches (only keys common to
// every member survive), losing the `isSkeleton` correlation to `connection`/`agentLog`
// — the well-known TS gotcha. A distributive Omit (naked type param in a conditional)
// applies `Omit` to EACH branch separately, keeping the union intact.
type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never

/** Local controlled wrapper — mirrors the component's fully-controlled `open` prop on the canvas. */
const ConnectSheetExample = (props: DistributiveOmit<PlaygroundConnectSheetProps, "open" | "onOpenChange"> & { defaultOpen?: boolean }) => {
    const { defaultOpen = true, ...rest } = props
    const [open, setOpen] = useState(defaultOpen)
    return <PlaygroundConnectSheet {...rest} open={open} onOpenChange={setOpen} />
}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "StackH": { tier: "frame", role: "the peek row's outer track (status cluster vs. action cluster, `justify=\"between\"`) and the two inner clusters that group the chip+latency and the reconnect+toggle buttons", storyId: "frames-stack-stackh--default" },
    "StackV": { tier: "frame", role: "the body's vertical track — the device ribbon over the log lines, or the lone hint line when not connected", storyId: "frames-stack-stackv--default" },
    "Chip": { tier: "atom", role: "the peek row's status dot chip — tone and wording keyed off `connection`", storyId: "atoms-chips-chip-chip--default" },
    "Button": { tier: "atom", role: "the always-visible reconnect action, and the trailing icon-only toggle that expands/collapses the body", storyId: "atoms-buttons-button-button--default" },
    "Typography": { tier: "atom", role: "the block's own text — latency, agent-log lines colored by level, or the not-connected hint", storyId: "atoms-text-typography-typography--plain" },
    "StatRibbon": { tier: "composite", role: "the device-spec cells (hostname·platform / CPU / RAM / GPU), reused as-is rather than rebuilt", storyId: "composites-stats-statribbon--overview" },
}

/** LEAF — the docked sheet: one peek+body chrome, three DATA states. */
export const Sheet: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="PlaygroundConnectSheet"
                tier="block"
                leaf="Sheet"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-2xl"
                states={[
                    {
                        name: "connection = \"connected\"",
                        why: "The pairing is live, so the peek chip reads success-toned and carries the round-trip latency. Opening the body shows the real device ribbon (host, CPU, RAM, GPU) plus the tail of the agent's live log — this is the state a learner checks to confirm their machine is what the lab is actually running against.",
                        code: `<PlaygroundConnectSheet
    connection="connected"
    latencyMs={42}
    device={device}
    agentLog={agentLog}
    onReconnect={reconnect}
    open={open}
    onOpenChange={setOpen}
/>`,
                        render: (
                            <ConnectSheetExample

                               
                                connection="connected"
                                latencyMs={42}
                                device={DEVICE}
                                agentLog={AGENT_LOG}
                                onReconnect={() => {}}
                            />
                        ),
                    },
                    {
                        name: "connection = \"waiting\" (first time)",
                        why: "No device has reported yet, so the peek chip switches to the warning \"waiting\" wording and the body — once opened — shows only the not-connected hint, not an empty ribbon pretending to have data. This is what a learner sees the first time they open the lab, before the agent has ever paired.",
                        code: `<PlaygroundConnectSheet
    connection="waiting"
    agentLog={[]}
    onReconnect={reconnect}
    open={open}
    onOpenChange={setOpen}
/>`,
                        render: (
                            <ConnectSheetExample
                                connection="waiting"
                                agentLog={[]}
                                onReconnect={() => {}}
                            />
                        ),
                    },
                    {
                        name: "connection = \"dropped\" (per `everConnected`, was connected before)",
                        why: "The pairing was live and then fell over, so the chip's wording says \"connection lost\" instead of \"waiting\" — a different sentence for a learner who had it working a moment ago — but the body renders the SAME not-connected hint as the waiting state above (stale specs are worse than none). `connection=\"dropped\"` already implies a prior connection, so no separate `everConnected` flag has to travel alongside it.",
                        code: `<PlaygroundConnectSheet
    connection="dropped"
    device={device}
    agentLog={agentLog}
    onReconnect={reconnect}
    open={open}
    onOpenChange={setOpen}
/>`,
                        render: (
                            <ConnectSheetExample
                                connection="dropped"
                                device={DEVICE}
                                agentLog={AGENT_LOG}
                                onReconnect={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — the caller flips `isSkeleton`; the pairing state itself hasn't resolved yet on first mount, so the sheet has nothing real to render for `connection`/`device`/`agentLog` yet. */
export const Skeleton: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="PlaygroundConnectSheet"
                tier="block"
                leaf="Prop `isSkeleton`"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-2xl"
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "The playground page mounts this sheet before the agent has ever reported in, so there is no `connection` value yet to pick a chip tone or wording from — the peek row shimmers as a status-shaped bar and an action-shaped bar until the first pairing state arrives.",
                        code: `<PlaygroundConnectSheet
    isSkeleton
    onReconnect={reconnect}
    open={open}
    onOpenChange={setOpen}
/>`,
                        render: (
                            <ConnectSheetExample

                               
                                isSkeleton
                                onReconnect={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
