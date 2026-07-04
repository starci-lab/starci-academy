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
    /** honeycomb-ish ring angle in radians (top, clockwise). */
    cell: [number, number]
}

/** Ring radius for the future services around the event bus. */
const RING_D = 2.9

/** The 6 planned services from the rule doc, on a ring around the event bus. */
const FUTURE_SERVICES: Array<Omit<FutureServiceSeed, "cell">> = [
    { id: "order-service", key: "order" },
    { id: "payment-service", key: "payment" },
    { id: "ai-service", key: "ai" },
    { id: "grading-service", key: "grading" },
    { id: "media-service", key: "media" },
    { id: "notification-service", key: "notification" },
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
    const count = FUTURE_SERVICES.length
    const serviceNodes: Array<ArchitectureNode> = FUTURE_SERVICES.map((service, index) => {
        const angle = (Math.PI / 2) - (index / count) * Math.PI * 2
        return {
            id: service.id,
            name: labels.service(service.key),
            cell: [
                Number((RING_D * Math.cos(angle)).toFixed(3)),
                Number((RING_D * -Math.sin(angle)).toFixed(3)),
            ],
            kind: "container",
            tone: "normal",
        }
    })

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
