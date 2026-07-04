import type {
    ArchitectureEdge,
    ArchitectureNode,
    ArchitectureSceneData,
} from "@/components/blocks/marketing/ArchitectureScene/types"
import type { HealthByName } from "../hooks/useSystemHealthPoll"
import { ARCHITECTURE_COMPONENT_MAP } from "../constants"
import { ARCHITECTURE_POD_MAP } from "../pods"
import { buildMemberNodeState, type MemberStatusLabels } from "./scene"

/** i18n'd labels for the pod-detail sub-scene. */
export interface PodDetailLabels extends MemberStatusLabels {
    /** Core API node name / sub. */
    core: string
    coreSub: string
}

/** The Core node id in a pod-detail sub-scene. */
const CORE_ID = "core"

/** Radius (board.cell units) of the member ring around the Core. */
const MEMBER_RING = 2.7

/**
 * Builds a pod's DRILL-DOWN sub-scene: the central `Core API` plus this pod's
 * REAL members (each rendered as its own component `kind`, toned by live
 * health), with an edge Core → each member. Payment is 2-way — its members also
 * get an `eventual` webhook edge running BACK to Core (SePay IPN / PayOS
 * callback), per the rule doc.
 *
 * Camera sits a touch tighter than the overview (fewer nodes).
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
    const members = pod?.members ?? []
    const count = Math.max(members.length, 1)
    const isPayment = podId === "payment"

    const memberNodes: Array<ArchitectureNode> = members.map((name, index) => {
        // fan the members in an arc/ring around Core; start at top, go clockwise
        const angle = (Math.PI / 2) - (index / count) * Math.PI * 2
        const component = ARCHITECTURE_COMPONENT_MAP[name]
        const { tone, status } = buildMemberNodeState(name, healthByName, labels)
        return {
            id: name,
            name: component?.name ?? name,
            sub: component?.mapSub,
            cell: [
                Number((MEMBER_RING * Math.cos(angle)).toFixed(3)),
                Number((MEMBER_RING * -Math.sin(angle)).toFixed(3)),
            ],
            kind: component?.kind ?? "container",
            tone,
            status,
        }
    })

    const nodes: Array<ArchitectureNode> = [
        { id: CORE_ID, name: labels.core, sub: labels.coreSub, cell: [0, 0], kind: "container", tone: "normal" },
        ...memberNodes,
    ]

    const edges: Array<ArchitectureEdge> = members.flatMap((name) => {
        const out: Array<ArchitectureEdge> = [{ from: CORE_ID, to: name, flow: true }]
        // payment is 2-way: the gateway calls back / IPNs the webhook to Core
        if (isPayment) out.push({ from: name, to: CORE_ID, eventual: true })
        return out
    })

    return {
        board: { cols: [-3, 3], rows: [-3, 3], cell: 1 },
        camera: { position: [10, 9, 10], zoom: 40 },
        nodes,
        edges,
    }
}
