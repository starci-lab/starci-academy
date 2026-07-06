import type {
    ArchitectureBoard,
    ArchitectureEdge,
    ArchitectureNode,
    ArchitectureSceneData,
    SceneTone,
} from "@/components/blocks/marketing/ArchitectureScene/types"
import type { HealthByName } from "../hooks/useSystemHealthPoll"
import { ARCHITECTURE_COMPONENT_MAP } from "../constants"
import { ARCHITECTURE_MODULES } from "../modules"

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
 * Fixed topology (integer grid cells) for the ATLAS — one flat tier, no pods, no
 * "Core API" hub. Every element snaps to exactly ONE cell (1 node = 1 tile,
 * never overlapping — the pod scenes' fractional coords were the "xấu rối"),
 * laid out in three spatial bands read top→bottom:
 *
 *  - **Ứng dụng** (rows -5,-4): the ~10 feature modules the Core API splits into
 *    (C4 Container→Component) — {@link import("../modules").ARCHITECTURE_MODULES}.
 *  - **Hạ tầng** (rows -2..0): the 12 own infra components (live dot).
 *  - **Dịch vụ ngoài** (col 7): the 5 external SaaS deps (live dot).
 *
 * Only infra/external cells carry a live `tone`/`status`; module cells are
 * always neutral (no health probe exists for them — honesty).
 */
const NODE_CELLS: Record<string, [number, number]> = {
    // entry
    client: [0, -7],
    gateway: [0, -6],
    // Ứng dụng — feature modules (2 rows × 5)
    auth: [-4, -5],
    learning: [-2, -5],
    coding: [0, -5],
    ai: [2, -5],
    payment: [4, -5],
    community: [-4, -4],
    careers: [-2, -4],
    notify: [0, -4],
    ranking: [2, -4],
    media: [4, -4],
    // Hạ tầng — own infra (3 rows × 4)
    postgres: [-3, -2],
    redis: [-1, -2],
    kafka: [1, -2],
    nats: [3, -2],
    minio: [-3, -1],
    qdrant: [-1, -1],
    elasticsearch: [1, -1],
    keycloak: [3, -1],
    judge0: [-3, 0],
    ollama: [-1, 0],
    mail: [1, 0],
    aiBalancer: [3, 0],
    // Dịch vụ ngoài — external SaaS, set apart on the far-right column
    github: [7, -3],
    stripe: [7, -2],
    paypal: [7, -1],
    payos: [7, 0],
    sepay: [7, 1],
}

/** The synthetic "Client" node isn't a probed backend component — it's the
 *  page itself, always shown as reachable (this atlas IS the client). */
const CLIENT_ID = "client"
const GATEWAY_ID = "gateway"

/**
 * Structural edges: client → gateway (the one animated request path), gateway
 * fans into every module, and each module wires to the real infra it uses
 * (`usesInfra`). All the module/infra wiring is drawn `eventual` (faint) so it
 * recedes into structure — until a module is selected, when {@link buildLiveScene}
 * brightens the edges that touch it ("light up the infra this module runs on").
 */
const buildAtlasEdges = (): Array<ArchitectureEdge> => {
    const edges: Array<ArchitectureEdge> = [{ from: CLIENT_ID, to: GATEWAY_ID, flow: true }]
    for (const module of ARCHITECTURE_MODULES) {
        edges.push({ from: GATEWAY_ID, to: module.id, eventual: true })
        for (const infra of module.usesInfra) {
            edges.push({ from: module.id, to: infra, eventual: true })
        }
    }
    return edges
}

const ATLAS_EDGES: Array<ArchitectureEdge> = buildAtlasEdges()

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

/** i18n'd labels for the atlas scene's synthetic + module nodes + status badges. */
export interface FlatSceneLabels extends MemberStatusLabels {
    /** Client node name / sub. */
    client: string
    clientSub: string
    /** API Gateway node name / sub. */
    gateway: string
    gatewaySub: string
    /** Feature-module name / sub, by module id (`architecture.module.<id>.*`). */
    moduleName: (id: string) => string
    moduleSub: (id: string) => string | undefined
}

/** Set of module ids for O(1) "is this a neutral module node?" checks. */
const MODULE_IDS = new Set(ARCHITECTURE_MODULES.map((module) => module.id))

/**
 * Builds the live ATLAS scene: the fixed flat topology above (17 infra/external
 * + 10 feature modules on one grid, no Core hub / no pods), with each
 * infra/external node's tone/status driven by the current health poll and every
 * module node neutral (never a fake status). `healthByName === null` renders
 * every probed node as "checking…".
 *
 * When `selectedId` names a MODULE, the edges touching it are brightened (the
 * module → the real infra it runs on) — the architecture story, on demand.
 *
 * @param healthByName - Latest poll result, or `null` before the first resolve.
 * @param labels - i18n'd node names + status badge texts.
 * @param selectedId - Currently selected node id (drives edge emphasis), if any.
 */
export const buildLiveScene = (
    healthByName: HealthByName | null,
    labels: FlatSceneLabels,
    selectedId?: string,
): ArchitectureSceneData => {
    const nodes: Array<ArchitectureNode> = Object.entries(NODE_CELLS).map(([id, cell]) => {
        // the synthetic client node is this very page — always "us", always up
        if (id === CLIENT_ID) {
            return { id, name: labels.client, sub: labels.clientSub, cell, kind: "client", tone: "success" }
        }
        // the gateway isn't an independently probed component (it's the request
        // path every OTHER probe travels through) — tone it by whether any/all
        // probes succeeded, so a total outage still reads red.
        if (id === GATEWAY_ID) {
            const anyUp = healthByName ? Object.values(healthByName).some((c) => c.status === "up") : false
            const allDown = healthByName ? Object.values(healthByName).every((c) => c.status === "down") : false
            return {
                id,
                name: labels.gateway,
                sub: labels.gatewaySub,
                cell,
                kind: "loadBalancer",
                tone: !healthByName ? "normal" : allDown ? "danger" : anyUp ? "success" : "normal",
            }
        }
        // feature modules — ALWAYS neutral, never a status dot (no health probe
        // exists for them; faking green would be dishonest)
        if (MODULE_IDS.has(id)) {
            return { id, name: labels.moduleName(id), sub: labels.moduleSub(id), cell, kind: "container", tone: "normal" }
        }
        // infra / external — the live-probed nodes
        const component = ARCHITECTURE_COMPONENT_MAP[id]
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

    // brighten the wiring that touches the selected module (module → its infra +
    // gateway → module); everything else stays faint/structural.
    const edges = ATLAS_EDGES.map((edge) => {
        if (selectedId && (edge.from === selectedId || edge.to === selectedId)) {
            return { ...edge, eventual: false }
        }
        return edge
    })

    return {
        board: boardFromNodes(nodes, 2.4),
        // re-fit at render time to the actual bounding box (see `CameraFit`);
        // this is only the fallback viewing angle/distance before that runs.
        camera: { position: [14, 11, 12], zoom: 20 },
        nodes,
        edges,
    }
}
