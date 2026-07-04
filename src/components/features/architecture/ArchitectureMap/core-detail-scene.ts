import type {
    ArchitectureEdge,
    ArchitectureNode,
    ArchitectureSceneData,
} from "@/components/blocks/marketing/ArchitectureScene/types"
import type { HealthByName } from "../hooks/useSystemHealthPoll"
import { ARCHITECTURE_COMPONENT_MAP } from "../constants"
import { buildMemberNodeState, type MemberStatusLabels } from "./scene"

/** The reserved `?pod=` value that opens the Core-module drill-down. */
export const CORE_DETAIL_ID = "core"

/** The Core node id inside the Core-module sub-scene. */
const CORE_ID = "core"

/** i18n'd labels for the Core-module sub-scene. */
export interface CoreDetailLabels extends MemberStatusLabels {
    /** Core API node name / sub. */
    core: string
    coreSub: string
    /** Resolver for a module's display name (`architecture.module.<id>.name`). */
    moduleName: (id: string) => string
}

/**
 * One business-domain module INSIDE the Core API container — the C4
 * "Component" level (Container → Components). Grounded in `src/modules/bussiness/*`
 * + the GraphQL surface; a curated ~10 (achievement · daily-quest · community ·
 * jobs · loyalty are folded away to keep the ≤30s read). Each module is a plain
 * `container` node on its own INTEGER cell, wired Core → module, plus a few
 * dashed module → infra edges (the real component names it leans on). A module
 * carries NO status dot — only the 17 probed infra components are independently
 * health-checked; modules aren't, so tone stays neutral (honesty).
 */
interface CoreModuleSeed {
    /** Module id (i18n key suffix `architecture.module.<id>.name`). */
    id: string
    /** INTEGER grid cell — laid out in two flanks around Core. */
    cell: [number, number]
    /** Real infra component names this module leans on (dashed module → infra). */
    infra: Array<string>
}

/**
 * The ~10 grounded Core modules, on a tidy two-flank INTEGER grid around Core
 * `[0,0]` (five to the left column-pair, five to the right) so every module +
 * label snaps to its own tile without collision. Infra links reference REAL
 * probed component names (so the dashed wires land on nodes that also appear on
 * the flat map).
 */
const CORE_MODULES: Array<CoreModuleSeed> = [
    { id: "auth", cell: [-4, -3], infra: ["keycloak"] },
    { id: "user", cell: [-4, -1], infra: ["postgres"] },
    { id: "transactions", cell: [-4, 1], infra: ["stripe", "payos"] },
    { id: "coding", cell: [-4, 3], infra: ["judge0", "redis"] },
    { id: "flashcard", cell: [-2, 4], infra: ["postgres"] },
    { id: "progress", cell: [2, 4], infra: ["postgres", "kafka"] },
    { id: "discussion", cell: [4, 3], infra: ["postgres"] },
    { id: "aiLab", cell: [4, 1], infra: ["aiBalancer", "qdrant"] },
    { id: "league", cell: [4, -1], infra: ["redis"] },
    { id: "notification", cell: [4, -3], infra: ["nats", "mail"] },
]

/**
 * Fixed INTEGER cells for the infra components the modules touch, ringed OUTSIDE
 * the module flanks (top + bottom bands) so the dashed module → infra wires
 * don't cross the module column. Every id is a real probed component name; each
 * carries a live status dot (they ARE probed, unlike modules).
 */
const CORE_INFRA_CELLS: Record<string, [number, number]> = {
    keycloak: [-6, -4],
    postgres: [0, -4],
    redis: [-2, -4],
    kafka: [2, -4],
    aiBalancer: [6, -4],
    qdrant: [6, 5],
    judge0: [-6, 5],
    stripe: [-2, 6],
    payos: [0, 6],
    nats: [2, 6],
    mail: [4, 6],
}

/**
 * Builds the Core API DRILL-DOWN: the Core container at the centre, its ~10
 * business-domain modules on INTEGER cells around it (Core → module edges), and
 * dashed module → infra edges to the real components each leans on. This is the
 * C4 Component view of today's monolith — and doubles as the map that motivates
 * the Future (microservices) tab: each module is a service candidate.
 *
 * Modules have NO status dot (tone neutral) — only the probed infra nodes carry
 * a live tone/status via the shared member-state helper. Core carries no dot.
 *
 * @param healthByName - Latest poll result, or `null` before the first resolve.
 * @param labels - i18n'd Core name + module names + infra status badge texts.
 */
export const buildCoreDetailScene = (
    healthByName: HealthByName | null,
    labels: CoreDetailLabels,
): ArchitectureSceneData => {
    const moduleNodes: Array<ArchitectureNode> = CORE_MODULES.map((mod) => ({
        id: `module:${mod.id}`,
        name: labels.moduleName(mod.id),
        cell: mod.cell,
        kind: "container",
        tone: "normal", // modules aren't probed → neutral, NO status dot (honesty)
    }))

    // the distinct real infra components any module touches (deduped)
    const infraIds = Array.from(new Set(CORE_MODULES.flatMap((mod) => mod.infra)))
    const infraNodes: Array<ArchitectureNode> = infraIds.map((id) => {
        const component = ARCHITECTURE_COMPONENT_MAP[id]
        const { tone, status } = buildMemberNodeState(id, healthByName, labels)
        return {
            id,
            name: component?.name ?? id,
            sub: component?.mapSub,
            cell: CORE_INFRA_CELLS[id] ?? [0, 0],
            kind: component?.kind ?? "container",
            tone,
            status,
        }
    })

    const nodes: Array<ArchitectureNode> = [
        { id: CORE_ID, name: labels.core, sub: labels.coreSub, cell: [0, 0], kind: "container", tone: "normal" },
        ...moduleNodes,
        ...infraNodes,
    ]

    const edges: Array<ArchitectureEdge> = [
        // Core → each module (sync, animated packet)
        ...CORE_MODULES.map((mod): ArchitectureEdge => ({ from: CORE_ID, to: `module:${mod.id}`, flow: true })),
        // module → infra (dashed / eventual — "leans on")
        ...CORE_MODULES.flatMap((mod) =>
            mod.infra.map((infra): ArchitectureEdge => ({ from: `module:${mod.id}`, to: infra, eventual: true })),
        ),
    ]

    return {
        board: { cols: [-7, 7], rows: [-5, 7], cell: 1 },
        camera: { position: [12, 12, 12], zoom: 26 },
        nodes,
        edges,
    }
}
