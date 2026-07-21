import type { Edge, Node } from "@xyflow/react"
import { FLOW_DIAGRAM_CARD_NODE_TYPE } from "@/components/blocks/rendering/FlowDiagram"

/** 6 basic web architecture concepts, connected along a real request flow. */
export const ARCHITECTURE_NODES: Array<Node> = [
    {
        id: "client",
        type: FLOW_DIAGRAM_CARD_NODE_TYPE,
        position: { x: 0, y: 80 },
        data: { label: "Browser", description: "Sends a request" },
    },
    {
        id: "cdn",
        type: FLOW_DIAGRAM_CARD_NODE_TYPE,
        position: { x: 220, y: 0 },
        data: { label: "CDN", description: "Caches static assets" },
    },
    {
        id: "gateway",
        type: FLOW_DIAGRAM_CARD_NODE_TYPE,
        position: { x: 220, y: 160 },
        data: { label: "API Gateway", description: "Routing + auth" },
    },
    {
        id: "service",
        type: FLOW_DIAGRAM_CARD_NODE_TYPE,
        position: { x: 460, y: 160 },
        data: { label: "Service", description: "Business logic" },
    },
    {
        id: "cache",
        type: FLOW_DIAGRAM_CARD_NODE_TYPE,
        position: { x: 700, y: 80 },
        data: { label: "Redis", description: "Caches results" },
    },
    {
        id: "db",
        type: FLOW_DIAGRAM_CARD_NODE_TYPE,
        position: { x: 700, y: 240 },
        data: { label: "PostgreSQL", description: "Primary storage" },
    },
]

export const ARCHITECTURE_EDGES: Array<Edge> = [
    { id: "client-cdn", source: "client", target: "cdn" },
    { id: "client-gateway", source: "client", target: "gateway" },
    { id: "gateway-service", source: "gateway", target: "service" },
    { id: "service-cache", source: "service", target: "cache" },
    { id: "service-db", source: "service", target: "db" },
]
