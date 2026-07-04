import type {
    ArchitectureEdge,
    ArchitectureNode,
    ArchitectureSceneData,
} from "@/components/blocks/marketing/ArchitectureScene/types"
import type { HealthByName } from "../hooks/useSystemHealthPoll"
import { ARCHITECTURE_COMPONENT_MAP } from "../constants"
import { ARCHITECTURE_POD_MAP, type PodFlowEdge } from "../pods"
import { buildMemberNodeState, type MemberStatusLabels } from "./scene"

/** i18n'd labels for the pod-detail sub-scene. */
export interface PodDetailLabels extends MemberStatusLabels {
    /** Core API node name / sub. */
    core: string
    coreSub: string
}

/** The Core node id in a pod-detail sub-scene. */
const CORE_ID = "core"

/**
 * Radial fallback offsets (INTEGER cells) for a FAN/TREE layout — Core at the
 * centre, members snapped to surrounding tiles. Used when the flow isn't a
 * simple single chain (or when a pod has no authored `flow`). Kept ~3 cells out
 * so hex meshes + floating labels stay clear.
 */
const FAN_CELLS: Array<[number, number]> = [
    [0, -3],
    [3, -2],
    [3, 2],
    [0, 3],
    [-3, 2],
    [-3, -2],
    [3, 0],
    [-3, 0],
]

/**
 * Places nodes for a CHAIN flow (`Core → a → b → c …`) stepwise along a diagonal
 * so the arrows read sequentially left→right / top→bottom, every node on its own
 * INTEGER cell. Any node NOT on the chain's spine (e.g. a Core → Qdrant branch,
 * or a back-edge target) is dropped to the fan fallback. Returns null when the
 * flow isn't a clean linear chain from Core.
 */
const layoutChain = (orderedIds: Array<string>): Record<string, [number, number]> | null => {
    // step diagonally down-right: each hop moves +2 col, +1 row → distinct tiles,
    // readable sequential arrows without overlap
    const cells: Record<string, [number, number]> = {}
    orderedIds.forEach((id, index) => {
        cells[id] = [index * 2, index]
    })
    return cells
}

/**
 * Tries to read the pod's authored `flow` as a single linear CHAIN starting at
 * Core (`core → n1 → n2 → …`), ignoring `webhook`/back edges (they return to an
 * earlier node) and treating each forward edge as the next hop. Returns the
 * ordered node ids if the FORWARD edges form one unbranched path from Core;
 * otherwise null (→ fan/tree layout).
 */
const readChain = (flow: Array<PodFlowEdge>): Array<string> | null => {
    // forward edges only (drop webhook/back returns to Core)
    const forward = flow.filter((edge) => !edge.webhook)
    // build adjacency; a chain has each node with at most one forward out-edge
    const outByFrom = new Map<string, Array<string>>()
    const targets = new Set<string>()
    for (const edge of forward) {
        const list = outByFrom.get(edge.from) ?? []
        list.push(edge.to)
        outByFrom.set(edge.from, list)
        targets.add(edge.to)
    }
    // a chain: exactly one out-edge per node that has any, single root = core
    for (const list of outByFrom.values()) {
        if (list.length !== 1) return null
    }
    if (!outByFrom.has(CORE_ID)) return null
    // walk from core; the last hop may loop back to core (read edge) → stop there
    const order: Array<string> = [CORE_ID]
    const seen = new Set<string>([CORE_ID])
    let cursor = CORE_ID
    while (outByFrom.has(cursor)) {
        const next = outByFrom.get(cursor)![0]
        if (next === CORE_ID) break // read-back loop closes the chain
        if (seen.has(next)) return null // cycle that isn't the core read-back → not a clean chain
        order.push(next)
        seen.add(next)
        cursor = next
    }
    // every forward target must be on the spine, else it's a branch (tree) → fan
    for (const target of targets) {
        if (target !== CORE_ID && !seen.has(target)) return null
    }
    return order
}

/**
 * Builds a pod's DRILL-DOWN sub-scene from its REAL authored `flow`
 * ({@link import("../pods").ArchitecturePod.flow}): collect every node the flow
 * references (Core + members + any BORROWED node), snap each to an INTEGER cell
 * laid out by the flow SHAPE — a linear CHAIN steps diagonally so arrows read in
 * sequence (data: Core→Postgres→Kafka→ES; auth: Core→Keycloak→GitHub; coding:
 * Core→Redis→Judge0), a FAN/TREE keeps Core centred with members on surrounding
 * tiles (payment, ai, events, notify) — then emit the exact directed edges with
 * their `flow`/`eventual` semantics (a `webhook` edge is a return arrow).
 *
 * Node tone/status come from live health via the shared member-state helper;
 * Core carries no status dot. Falls back to a Core→member fan when a pod has no
 * authored flow.
 *
 * @param podId - The selected pod id (`payment`, `ai`, …).
 * @param healthByName - Latest poll result, or `null` before the first resolve.
 * @param labels - i18n'd Core name + member status badge texts.
 */
export const buildPodDetailScene = (
    podId: string,
    healthByName: HealthByName | null,
    labels: PodDetailLabels,
): ArchitectureSceneData => {
    const pod = ARCHITECTURE_POD_MAP[podId]
    // an authored flow drives the real topology; else fall back to a Core→member fan
    const flow: Array<PodFlowEdge> = pod?.flow
        ?? (pod?.members ?? []).map((name) => ({ from: CORE_ID, to: name }))

    // every distinct node id the flow references (dedup), Core first
    const referenced: Array<string> = []
    const pushId = (id: string) => {
        if (!referenced.includes(id)) referenced.push(id)
    }
    pushId(CORE_ID)
    for (const edge of flow) {
        pushId(edge.from)
        pushId(edge.to)
    }

    // layout: CHAIN → stepwise diagonal; else FAN/TREE → Core centred + radial
    const chainOrder = readChain(flow)
    const chainCells = chainOrder ? layoutChain(chainOrder) : null

    const cellFor = (id: string, fanIndex: () => number): [number, number] => {
        if (id === CORE_ID) return chainCells?.[CORE_ID] ?? [0, 0]
        if (chainCells?.[id]) return chainCells[id]
        return FAN_CELLS[fanIndex() % FAN_CELLS.length]
    }

    let fanCursor = 0
    const nextFan = () => {
        const value = fanCursor
        fanCursor += 1
        return value
    }

    const nodes: Array<ArchitectureNode> = referenced.map((id) => {
        if (id === CORE_ID) {
            return { id: CORE_ID, name: labels.core, sub: labels.coreSub, cell: cellFor(CORE_ID, nextFan), kind: "container", tone: "normal" }
        }
        const component = ARCHITECTURE_COMPONENT_MAP[id]
        const { tone, status } = buildMemberNodeState(id, healthByName, labels)
        return {
            id,
            name: component?.name ?? id,
            sub: component?.mapSub,
            cell: cellFor(id, nextFan),
            kind: component?.kind ?? "container",
            tone,
            status,
        }
    })

    const edges: Array<ArchitectureEdge> = flow.map((edge) => ({
        from: edge.from,
        to: edge.to,
        // sync forward hops animate a packet; eventual/webhook run faint (dashed)
        flow: !edge.eventual,
        eventual: edge.eventual,
    }))

    return {
        board: { cols: [-4, 8], rows: [-4, 5], cell: 1 },
        camera: { position: [11, 10, 11], zoom: 34 },
        nodes,
        edges,
    }
}
