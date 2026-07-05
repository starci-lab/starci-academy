import type {
    ArchitectureEdge,
    ArchitectureNode,
    ArchitectureSceneData,
} from "@/components/blocks/marketing/ArchitectureScene/types"
import type { HealthByName } from "../hooks/useSystemHealthPoll"
import { ARCHITECTURE_COMPONENT_MAP } from "../constants"
import { ARCHITECTURE_POD_MAP, type PodFlowEdge } from "../pods"
import { boardFromNodes, buildMemberNodeState, type MemberStatusLabels } from "./scene"

/** i18n'd labels for the pod-detail sub-scene. */
export interface PodDetailLabels extends MemberStatusLabels {
    /** Core API node name / sub. */
    core: string
    coreSub: string
}

/** The Core node id in a pod-detail sub-scene. */
const CORE_ID = "core"

/**
 * Radius (in cells) Core→member fan nodes sit at when there's ROOM to spread —
 * only reached once a ring holds few enough nodes to space them evenly at this
 * distance (see {@link fanCellFor}). Kept the pre-existing "~3 cells out" feel
 * for small pods; bigger pods grow the radius instead of overlapping.
 */
const FAN_BASE_RADIUS = 3
/** Minimum straight-line cell distance kept between two neighbouring fan
 *  nodes on the same ring, so their floating labels never visually overlap
 *  (found empirically against the label's `max-w-28` box). */
const FAN_MIN_ARC_SPACING = 2.6

/**
 * Computes a FAN/TREE ring position for the `index`-th (of `total`) non-chain
 * node around Core, SCALING THE RADIUS WITH THE NODE COUNT instead of a fixed
 * 8-slot table — a pod with 2 members and a pod with 8 members both get evenly
 * spaced, non-overlapping tiles. Snapped to the nearest INTEGER cell (the board
 * is an integer grid) so hex meshes still centre cleanly on a tile.
 *
 * The radius grows just enough that the ring's circumference divided by
 * `total` nodes stays ≥ {@link FAN_MIN_ARC_SPACING} cells apart — i.e. more
 * members automatically pushes the ring outward rather than crowding it.
 */
const fanCellFor = (index: number, total: number): [number, number] => {
    const count = Math.max(total, 1)
    const angleStep = (2 * Math.PI) / count
    // circumference = 2πr must fit `count` nodes each ≥ FAN_MIN_ARC_SPACING apart
    const radiusForSpacing = (count * FAN_MIN_ARC_SPACING) / (2 * Math.PI)
    const radius = Math.max(FAN_BASE_RADIUS, radiusForSpacing)
    // start at "north" (12 o'clock) like the old table's first `[0, -3]` slot
    const angle = -Math.PI / 2 + angleStep * index
    return [Math.round(Math.cos(angle) * radius), Math.round(Math.sin(angle) * radius)]
}

/**
 * Places nodes for a CHAIN flow (`Core → a → b → c …`) stepwise along a diagonal
 * so the arrows read sequentially left→right / top→bottom, every node on its own
 * cell. Any node NOT on the chain's spine (e.g. a Core → Qdrant branch, or a
 * back-edge target) is dropped to the fan fallback. Returns null when the flow
 * isn't a clean linear chain from Core.
 *
 * The step multiplier SCALES with the chain's length: a longer chain (more
 * hops) spaces each hop further apart so a long name (e.g. "elasticsearch")
 * has room for its label without crowding the next node in the sequence —
 * a fixed `+2/+1` step (the old behaviour) works for 2-3 hops but visibly
 * overlaps once a chain runs 4+ nodes deep.
 */
const CHAIN_MIN_STEP = 2
const CHAIN_STEP_PER_EXTRA_HOP = 0.4

const layoutChain = (orderedIds: Array<string>): Record<string, [number, number]> | null => {
    const extraHops = Math.max(orderedIds.length - 3, 0) // chains ≤3 keep the classic step
    const step = CHAIN_MIN_STEP + extraHops * CHAIN_STEP_PER_EXTRA_HOP
    const cells: Record<string, [number, number]> = {}
    orderedIds.forEach((id, index) => {
        cells[id] = [Math.round(index * step), Math.round(index * (step / 2))]
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

    // how many nodes will actually land on the fan ring (everything NOT Core
    // and NOT already placed by the chain) — sizes the ring's radius so it
    // scales with THIS pod's member count instead of a fixed 8-slot table
    const fanNodeCount = referenced.filter((id) => id !== CORE_ID && !chainCells?.[id]).length

    const cellFor = (id: string, fanIndex: () => number): [number, number] => {
        if (id === CORE_ID) return chainCells?.[CORE_ID] ?? [0, 0]
        if (chainCells?.[id]) return chainCells[id]
        return fanCellFor(fanIndex(), fanNodeCount)
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
        board: boardFromNodes(nodes, 1),
        // the camera is re-fit to the actual node bounding box at render time
        // (see `ArchitectureScene`'s `CameraFit`) — this is only the fallback
        // viewing angle/distance before that first fit runs.
        camera: { position: [11, 10, 11], zoom: 34 },
        nodes,
        edges,
    }
}
