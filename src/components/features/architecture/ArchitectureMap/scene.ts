import type {
    ArchitectureBoard,
    ArchitectureEdge,
    ArchitectureNode,
    ArchitectureSceneData,
    SceneTone,
} from "@/components/blocks/marketing/ArchitectureScene/types"
import type { HealthByName } from "../hooks/useSystemHealthPoll"
import { ARCHITECTURE_COMPONENT_MAP } from "../constants"

/**
 * Derives a scene's floor-grid bounds from its ACTUAL node cells (+ a fixed
 * margin), instead of a hardcoded `cols`/`rows` guess — a scene builder that
 * scales node spacing by count (fan rings, chain steps) would otherwise draw a
 * grid that's too small (clipping nodes at the edge) or too big (a tiny board
 * floating in an oversized floor) for the topology it just laid out.
 *
 * @param nodes - The scene's placed nodes (post-layout).
 * @param cell - World units per cell.
 * @param margin - Extra cells of floor padding beyond the outermost node.
 */
export const boardFromNodes = (nodes: ArchitectureNode[], cell: number, margin = 2): ArchitectureBoard => {
    if (nodes.length === 0) return { cols: [-margin, margin], rows: [-margin, margin], cell }
    const xs = nodes.map((n) => n.cell[0])
    const zs = nodes.map((n) => n.cell[1])
    return {
        cols: [Math.min(...xs) - margin, Math.max(...xs) + margin],
        rows: [Math.min(...zs) - margin, Math.max(...zs) + margin],
        cell,
    }
}

/**
 * Fixed topology (grid cells + edges) for the architecture atlas — grounded in
 * the same 17 components {@link import("../constants").ARCHITECTURE_COMPONENTS}
 * lists, laid out as two clusters on one board: StarCi's own system (edge →
 * data → async → platform, extending the blog masthead's 10-node layout with
 * the missing Elasticsearch/NATS/mail nodes) and, set apart on the right, the
 * external SaaS dependencies it talks to over the network.
 *
 * Cell positions are static (authored, not computed) — only each node's
 * `tone`/`status` is overwritten per live poll by {@link buildLiveScene}.
 */
const NODE_CELLS: Record<string, [number, number]> = {
    // own system — edge
    client: [0, -4],
    gateway: [0, -3],
    core: [0, -2],
    // own system — platform (in-process / sidecar to Core)
    keycloak: [-3, -1],
    aiBalancer: [-1, -1],
    judge0: [1, -1],
    ollama: [3, -1],
    // own system — data
    redis: [-3, 0],
    postgres: [-1, 0],
    qdrant: [1, 0],
    elasticsearch: [3, 0],
    minio: [-3, 1],
    mail: [3, 1],
    // own system — async
    kafka: [-1, 2],
    nats: [1, 2],
    // external SaaS — set apart, far right column
    github: [6, -3],
    stripe: [6, -2],
    paypal: [6, -1],
    payos: [6, 0],
    sepay: [6, 1],
}

/** The synthetic "Client" node isn't a probed backend component — it's the
 *  page itself, always shown as reachable (this atlas IS the client). */
const CLIENT_ID = "client"
const GATEWAY_ID = "gateway"
const CORE_ID = "core"

const OWN_EDGES: Array<ArchitectureEdge> = [
    { from: CLIENT_ID, to: GATEWAY_ID, flow: true },
    { from: GATEWAY_ID, to: CORE_ID, flow: true },
    { from: CORE_ID, to: "keycloak", flow: true },
    { from: CORE_ID, to: "aiBalancer", flow: true },
    { from: CORE_ID, to: "judge0", flow: true },
    { from: "aiBalancer", to: "ollama", eventual: true },
    { from: CORE_ID, to: "redis", flow: true },
    { from: CORE_ID, to: "postgres", flow: true },
    { from: CORE_ID, to: "qdrant", flow: true },
    { from: CORE_ID, to: "elasticsearch", flow: true },
    { from: CORE_ID, to: "minio", flow: true },
    { from: CORE_ID, to: "mail", flow: true },
    { from: "postgres", to: "kafka", eventual: true },
    { from: CORE_ID, to: "nats", flow: true },
]

const EXTERNAL_EDGES: Array<ArchitectureEdge> = [
    { from: CORE_ID, to: "github", eventual: true },
    { from: CORE_ID, to: "stripe", eventual: true },
    { from: CORE_ID, to: "paypal", eventual: true },
    { from: CORE_ID, to: "payos", eventual: true },
    { from: CORE_ID, to: "sepay", eventual: true },
]

/** Maps a probed status to the map's node tone (only `normal`/`success`/`danger`
 *  tones exist — `degraded` renders as `normal` shape + a `warning` status badge,
 *  same idea as `unknown`/"checking" rendering `normal` + an `info` badge). */
export const statusToTone = (status: string | undefined): SceneTone => {
    if (status === "up") return "success"
    if (status === "down") return "danger"
    return "normal"
}

/** Badge texts for a member node's live status line — passed in so the builder
 *  stays a pure data function (no `useTranslations`). */
export interface MemberStatusLabels {
    checking: string
    unknown: string
    degraded: string
    down: string
}

/** Derives a member node's live `tone` + optional `status` badge from the poll,
 *  the same honest mapping the flat map uses: gray "checking" before any probe,
 *  then real up (no badge) / degraded / down / unknown. Shared by the flat scene
 *  and the pod-detail sub-scenes so both read identically. */
export const buildMemberNodeState = (
    id: string,
    healthByName: HealthByName | null,
    labels: MemberStatusLabels,
): { tone: SceneTone; status?: ArchitectureNode["status"] } => {
    const health = healthByName?.[id]
    const tone = !health ? "normal" : statusToTone(health.status)
    const status: ArchitectureNode["status"] = !healthByName
        ? { tone: "info", text: labels.checking }
        : !health
            ? { tone: "info", text: labels.unknown }
            : health.status === "degraded"
                ? { tone: "warning", text: labels.degraded }
                : health.status === "down"
                    ? { tone: "danger", text: labels.down }
                    : undefined
    return { tone, status }
}

/** i18n'd labels for the flat scene's synthetic nodes + member status badges. */
export interface FlatSceneLabels extends MemberStatusLabels {
    /** Client node name / sub. */
    client: string
    clientSub: string
    /** API Gateway node name / sub. */
    gateway: string
    gatewaySub: string
    /** Core API node name / sub. */
    core: string
    coreSub: string
}

/**
 * Builds the live "show everything" flat scene: the fixed topology above, with
 * each node's tone/status badge driven by the current health poll.
 * `healthByName === null` (no probe has resolved yet) renders every node as
 * "checking…" (never a fake green).
 *
 * @param healthByName - Latest poll result, or `null` before the first resolve.
 * @param labels - i18n'd node names + status badge texts.
 */
export const buildLiveScene = (
    healthByName: HealthByName | null,
    labels: FlatSceneLabels,
): ArchitectureSceneData => {
    const nodes: Array<ArchitectureNode> = Object.entries(NODE_CELLS).map(([id, cell]) => {
        // the synthetic client node is this very page — always "us", always up
        if (id === CLIENT_ID) {
            return { id, name: labels.client, sub: labels.clientSub, cell, kind: "client", tone: "success" }
        }
        const component = ARCHITECTURE_COMPONENT_MAP[id]
        // gateway/core aren't independently probed components (they ARE the
        // request path every OTHER probe travels through) — tone them by
        // whether ANY probe of theirs succeeded, so a total outage still reads red
        if (id === GATEWAY_ID || id === CORE_ID) {
            const anyUp = healthByName ? Object.values(healthByName).some((c) => c.status === "up") : false
            const allDown = healthByName ? Object.values(healthByName).every((c) => c.status === "down") : false
            return {
                id,
                name: id === GATEWAY_ID ? labels.gateway : labels.core,
                sub: id === GATEWAY_ID ? labels.gatewaySub : labels.coreSub,
                cell,
                kind: id === GATEWAY_ID ? "loadBalancer" : "container",
                tone: !healthByName ? "normal" : allDown ? "danger" : anyUp ? "success" : "normal",
            }
        }
        const { tone, status } = buildMemberNodeState(id, healthByName, labels)
        return {
            id,
            name: component?.name ?? id,
            sub: component?.mapSub,
            cell,
            kind: component?.kind ?? "container",
            tone,
            status,
        }
    })

    return {
        board: boardFromNodes(nodes, 2.4),
        // re-fit at render time to the actual bounding box (see `CameraFit`);
        // this is only the fallback viewing angle/distance before that runs.
        camera: { position: [14, 11, 12], zoom: 20 },
        nodes,
        edges: [...OWN_EDGES, ...EXTERNAL_EDGES],
    }
}
