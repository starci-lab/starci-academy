import type { Meta, StoryObj } from "@storybook/nextjs"
import { Label, Typography } from "@heroui/react"
import { FlowDiagram, FLOW_DIAGRAM_CARD_NODE_TYPE } from "@/components/blocks/rendering/FlowDiagram"
import { ARCHITECTURE_EDGES, ARCHITECTURE_NODES } from "./components"

/**
 * `FlowDiagram` — a shared `@xyflow/react` graph-render canvas, self-contained with its
 * own `ReactFlowProvider` + dot background + preset fit-view. Not tied to any one
 * feature's data (unlike MindMap/KnowledgeGraph/MockInterviewDiagram) — just pass
 * standard xyflow `nodes`/`edges`.
 */
const meta = {
    title: "Primitives/Rendering/FlowDiagram",
    component: FlowDiagram,
} satisfies Meta<typeof FlowDiagram>

export default meta

type Story = StoryObj<typeof meta>

/** A simple architecture diagram using the default card node (concept + short description). */
export const Default: Story = {
    args: {
        nodes: ARCHITECTURE_NODES,
        edges: ARCHITECTURE_EDGES,
    },
    parameters: {
        usage: "Use when you need to illustrate a generic flow/architecture diagram (concept, system architecture, process) without the feature-specific interaction logic of MindMap/KnowledgeGraph/MockInterviewDiagram — just pass nodes/edges and you get a canvas with a preset provider + dot background + fit-view.",
    },
    render: (args) => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Generic flow diagram</Label>
                <Typography type="body-sm" color="muted">
                    Pass standard xyflow nodes/edges and you get a canvas with a preset provider + dot background + fit-view — for concept/architecture/process diagrams.
                </Typography>
            </div>
            <div className="h-[420px] w-full">
                <FlowDiagram {...args} />
            </div>
        </div>
    ),
}

/** 4 learning-process steps connected sequentially, illustrating a linear graph. */
export const LinearFlow: Story = {
    args: {
        nodes: [
            {
                id: "enroll",
                type: FLOW_DIAGRAM_CARD_NODE_TYPE,
                position: { x: 0, y: 0 },
                data: { label: "Enroll in course" },
            },
            {
                id: "learn",
                type: FLOW_DIAGRAM_CARD_NODE_TYPE,
                position: { x: 220, y: 0 },
                data: { label: "Study the lesson" },
            },
            {
                id: "practice",
                type: FLOW_DIAGRAM_CARD_NODE_TYPE,
                position: { x: 440, y: 0 },
                data: { label: "Practice" },
            },
            {
                id: "certificate",
                type: FLOW_DIAGRAM_CARD_NODE_TYPE,
                position: { x: 660, y: 0 },
                data: { label: "Get certificate" },
            },
        ],
        edges: [
            { id: "enroll-learn", source: "enroll", target: "learn" },
            { id: "learn-practice", source: "learn", target: "practice" },
            { id: "practice-certificate", source: "practice", target: "certificate" },
        ],
    },
    parameters: {
        usage: "Use for a simple linear sequence of steps (a process, a user journey) — no branching or custom node types needed.",
    },
    render: (args) => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Linear sequence</Label>
                <Typography type="body-sm" color="muted">
                    A simple linear sequence of steps (a process, a user journey) — no branching, no custom node types.
                </Typography>
            </div>
            <div className="h-[420px] w-full">
                <FlowDiagram {...args} />
            </div>
        </div>
    ),
}
