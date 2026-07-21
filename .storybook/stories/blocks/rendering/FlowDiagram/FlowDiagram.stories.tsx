import type { Meta, StoryObj } from "@storybook/nextjs"
import type { Edge, Node } from "@xyflow/react"
import { FlowDiagram, FLOW_DIAGRAM_CARD_NODE_TYPE } from "./FlowDiagram"

const meta: Meta<typeof FlowDiagram> = {
    title: "Primitives/Rendering/FlowDiagram",
    component: FlowDiagram,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof FlowDiagram>

/** 6 basic web architecture concepts, connected along a real request flow. */
const ARCHITECTURE_NODES: Array<Node> = [
    { id: "client", type: FLOW_DIAGRAM_CARD_NODE_TYPE, position: { x: 0, y: 80 }, data: { label: "Browser", description: "Sends a request" } },
    { id: "cdn", type: FLOW_DIAGRAM_CARD_NODE_TYPE, position: { x: 220, y: 0 }, data: { label: "CDN", description: "Caches static assets" } },
    { id: "gateway", type: FLOW_DIAGRAM_CARD_NODE_TYPE, position: { x: 220, y: 160 }, data: { label: "API Gateway", description: "Routing + auth" } },
    { id: "service", type: FLOW_DIAGRAM_CARD_NODE_TYPE, position: { x: 460, y: 160 }, data: { label: "Service", description: "Business logic" } },
    { id: "cache", type: FLOW_DIAGRAM_CARD_NODE_TYPE, position: { x: 700, y: 80 }, data: { label: "Redis", description: "Caches results" } },
    { id: "db", type: FLOW_DIAGRAM_CARD_NODE_TYPE, position: { x: 700, y: 240 }, data: { label: "PostgreSQL", description: "Primary storage" } },
]

const ARCHITECTURE_EDGES: Array<Edge> = [
    { id: "client-cdn", source: "client", target: "cdn" },
    { id: "client-gateway", source: "client", target: "gateway" },
    { id: "gateway-service", source: "gateway", target: "service" },
    { id: "service-cache", source: "service", target: "cache" },
    { id: "service-db", source: "service", target: "db" },
]

/** A general architecture/flow diagram using the built-in card node — branches + descriptions. */
export const Architecture: Story = {
    render: () => (
        <div className="p-8">
            <FlowDiagram nodes={ARCHITECTURE_NODES} edges={ARCHITECTURE_EDGES} />
        </div>
    ),
}

/** A simple linear chain of steps (a process, a user journey) — no branches, no custom node type. */
export const LinearSequence: Story = {
    render: () => (
        <div className="p-8">
            <FlowDiagram
                nodes={[
                    { id: "enroll", type: FLOW_DIAGRAM_CARD_NODE_TYPE, position: { x: 0, y: 0 }, data: { label: "Enroll in course" } },
                    { id: "learn", type: FLOW_DIAGRAM_CARD_NODE_TYPE, position: { x: 220, y: 0 }, data: { label: "Study the lesson" } },
                    { id: "practice", type: FLOW_DIAGRAM_CARD_NODE_TYPE, position: { x: 440, y: 0 }, data: { label: "Practice" } },
                    { id: "certificate", type: FLOW_DIAGRAM_CARD_NODE_TYPE, position: { x: 660, y: 0 }, data: { label: "Get certificate" } },
                ]}
                edges={[
                    { id: "enroll-learn", source: "enroll", target: "learn" },
                    { id: "learn-practice", source: "learn", target: "practice" },
                    { id: "practice-certificate", source: "practice", target: "certificate" },
                ]}
            />
        </div>
    ),
}
