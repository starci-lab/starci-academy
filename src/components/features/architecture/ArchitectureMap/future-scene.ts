import type {
    ArchitectureEdge,
    ArchitectureNode,
    ArchitectureSceneData,
} from "@/components/blocks/marketing/ArchitectureScene/types"

/** i18n'd labels for the future / roadmap scene's authored nodes. */
export interface FutureSceneLabels {
    /** Event bus node name / sub. */
    bus: string
    busSub: string
    /** i18n'd name for a future service by its key (`architecture.future.<key>`). */
    service: (key: string) => string
}

/** The event-bus hub id in the future topology. */
const BUS_ID = "event-bus"

/** Authored future services: the current `Core API` monolith decomposed into
 *  the services StarCi plans to split out, each wired through the event bus.
 *  This is a VISION — NO live status, NO probe. */
interface FutureServiceSeed {
    id: string
    /** i18n key suffix (`architecture.future.<key>`). */
    key: string
    /** INTEGER grid cell (staggered around the bus — one grid system, snap-to-tile). */
    cell: [number, number]
}

/** The 6 planned services from the rule doc, snapped to a staggered ring of
 *  INTEGER cells around the event bus `[0,0]` (Direction A — every node on its
 *  own tile, no fractional `cos/sin`). */
const FUTURE_SERVICES: Array<FutureServiceSeed> = [
    { id: "order-service", key: "order", cell: [0, -3] },
    { id: "payment-service", key: "payment", cell: [3, -2] },
    { id: "ai-service", key: "ai", cell: [3, 2] },
    { id: "grading-service", key: "grading", cell: [0, 3] },
    { id: "media-service", key: "media", cell: [-3, 2] },
    { id: "notification-service", key: "notification", cell: [-3, -2] },
]

/**
 * Builds the "Tương lai — microservices" ROADMAP scene: the monolith `Core API`
 * decomposed into the planned services, all wired through an event bus with
 * dashed `eventual` edges. HONESTY (rule doc §Luật 5): every node is tone
 * `normal` (ghost/neutral) with NO status badge — this scene is never bound to
 * health and never shows "checking". The "Coming soon" framing lives in the UI
 * chrome around it (a caption / chip), not as a fake dot here.
 *
 * @param labels - i18n'd node names.
 */
export const buildFutureScene = (labels: FutureSceneLabels): ArchitectureSceneData => {
    const serviceNodes: Array<ArchitectureNode> = FUTURE_SERVICES.map((service) => ({
        id: service.id,
        name: labels.service(service.key),
        cell: service.cell,
        kind: "container",
        tone: "normal",
    }))

    const nodes: Array<ArchitectureNode> = [
        { id: BUS_ID, name: labels.bus, sub: labels.busSub, cell: [0, 0], kind: "broker", tone: "normal" },
        ...serviceNodes,
    ]

    // every wire dashed + eventual (faint) — reads as "planned async links", not live traffic
    const edges: Array<ArchitectureEdge> = FUTURE_SERVICES.map((service) => ({
        from: BUS_ID,
        to: service.id,
        eventual: true,
    }))

    return {
        board: { cols: [-3, 3], rows: [-3, 3], cell: 1 },
        camera: { position: [11, 9.5, 11], zoom: 34 },
        nodes,
        edges,
    }
}
