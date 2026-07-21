import type { ArchitectureSceneData } from "@/components/blocks/marketing/ArchitectureScene/types"

/** A small custom diagram: client → load balancer → 2 services → database, with one node reporting an error. */
export const SMALL_DATA: ArchitectureSceneData = {
    board: { cols: [0, 2], rows: [0, 1], cell: 2 },
    camera: { position: [8, 8, 8], zoom: 34 },
    nodes: [
        { id: "client", name: "Browser", sub: "web client", cell: [0, 0], kind: "client" },
        { id: "lb", name: "Load Balancer", cell: [1, 0], kind: "loadBalancer" },
        { id: "api", name: "API Service", sub: "nestjs", cell: [2, 0], kind: "container", tone: "danger", status: { tone: "danger", text: "overloaded" } },
        { id: "db", name: "PostgreSQL", sub: "primary", cell: [2, 1], kind: "database", tone: "success" },
    ],
    edges: [
        { from: "client", to: "lb", flow: true },
        { from: "lb", to: "api", congested: true },
        { from: "api", to: "db", tone: "success" },
    ],
}
