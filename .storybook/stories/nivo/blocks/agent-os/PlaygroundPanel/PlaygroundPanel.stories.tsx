import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    PlaygroundPanel,
    type PlaygroundTurn,
    type PlaygroundPanelLabels,
} from "@sb-components/nivo/blocks/agent-os/PlaygroundPanel/PlaygroundPanel"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `PlaygroundPanel` — the Agent OS pod's "Playground" tab: a chat-test panel
 * to try an agent's replies before it goes live. Two DATA states of the
 * single shape: `empty` (no turns sent yet) and `with-turns`. A BASIC
 * stub-section shell — sending a message is real, agent picking and
 * transcript history are deferred to a later pass.
 */
const meta: Meta<typeof PlaygroundPanel> = {
    title: "Nivo/Blocks/AgentOs/PlaygroundPanel/PlaygroundPanel",
    component: PlaygroundPanel,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof PlaygroundPanel>

const LABELS: PlaygroundPanelLabels = {
    title: "Playground",
    description: "Test how this agent replies before it goes live on a real channel.",
    roleOptions: { user: "You", agent: "Agent" },
    composerPlaceholder: "Type a message to test…",
    sendLabel: "Send",
    composerAriaLabel: "Playground test message",
    emptyTitle: "No test messages yet",
    emptyDescription: "Send a message to see how this agent responds.",
}

const TURNS: Array<PlaygroundTurn> = [
    { id: "turn-1", role: "user", body: "Do you ship to Can Tho, and how long does it take?" },
    { id: "turn-2", role: "agent", body: "Yes — Can Tho usually takes 2–3 business days with our standard carrier." },
]

const NOOP = () => {}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    SurfaceCard: { tier: "composite", role: "the outer card, and one nested bubble per turn" },
    EmptyState: { tier: "composite", role: "shown before the first test message is sent" },
    "Input.Textarea": { tier: "atom", role: "the composer where a test message is typed" },
    Button: { tier: "atom", role: "sends the test message" },
    Typography: { tier: "atom", role: "the agent caption, turn author, and turn body" },
}

/** LEAF — one shape; empty vs with-turns are DATA ⇒ states. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="PlaygroundPanel"
                tier="block"
                leaf="Playground"
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-xl"
                reason="Blocks take no `className`: the block owns the test conversation, so empty vs with-turns are states of one shape — the same bubble shape `TicketThread` uses, with `user`/`agent` roles instead of `user`/`staff`. Which agent is under test and its full transcript history are out of scope for this BASIC stub-section; `agentLabel` is an already-resolved caption, not a picker."
                states={[
                    {
                        name: "turns = [] (empty)",
                        why: "No test message sent yet — the panel points at typing the first one instead of showing a blank conversation.",
                        code: `<PlaygroundPanel
    agentLabel="Testing — Sales · Mai"
    turns={[]}
    composerValue=""
    onComposerChange={setValue}
    onSend={send}
    labels={labels}
/>`,
                        render: (
                            <PlaygroundPanel
                                agentLabel="Testing — Sales · Mai"
                                turns={[]}
                                composerValue=""
                                onComposerChange={NOOP}
                                onSend={NOOP}
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "with turns, sending",
                        why: "One exchange already sent, aligned by role — the tester's turn on the end, the agent's reply on the start — with a second message in flight (composer text kept, send busy).",
                        code: `<PlaygroundPanel
    agentLabel="Testing — Sales · Mai"
    turns={turns}
    composerValue="Do you offer a student discount?"
    onComposerChange={setValue}
    onSend={send}
    isSending
    labels={labels}
/>`,
                        render: (
                            <PlaygroundPanel
                                agentLabel="Testing — Sales · Mai"
                                turns={TURNS}
                                composerValue="Do you offer a student discount?"
                                onComposerChange={NOOP}
                                onSend={NOOP}
                                isSending
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The panel's own first fetch hasn't resolved (which agent is under test), so the caption, a fixed pair of turn bubbles, and the composer all shimmer, and send is dropped.",
                        code: `<PlaygroundPanel
    agentLabel=""
    turns={[]}
    composerValue=""
    onComposerChange={setValue}
    onSend={send}
    labels={labels}
    isSkeleton
/>`,
                        render: (
                            <PlaygroundPanel
                                agentLabel=""
                                turns={[]}
                                composerValue=""
                                onComposerChange={NOOP}
                                onSend={NOOP}
                                labels={LABELS}
                                isSkeleton
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
