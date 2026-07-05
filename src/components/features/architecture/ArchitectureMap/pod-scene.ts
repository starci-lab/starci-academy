import type {
    ArchitectureEdge,
    ArchitectureNode,
    ArchitectureSceneData,
} from "@/components/blocks/marketing/ArchitectureScene/types"
import type { HealthByName } from "../hooks/useSystemHealthPoll"
import { ARCHITECTURE_PODS, computePodStatus } from "../pods"
import { boardFromNodes } from "./scene"

/** Resolver for the pod name/sub i18n keys + the roll-up badge labels — passed
 *  in so the scene builder stays a pure data function (no `useTranslations`). */
export interface PodSceneLabels {
    /** `architecture.pod.<nameKey>.name`. */
    podName: (nameKey: string) => string
    /** `architecture.pod.<nameKey>.sub` (may be empty). */
    podSub: (nameKey: string) => string | undefined
    /** Core API node name (`architecture.map.core`). */
    core: string
    /** Core API sub-label (`architecture.map.coreSub`). */
    coreSub: string
    /** Roll-up badge texts. */
    checking: string
    up: string
    degraded: string
}

/** The overview node id for the central Core API. */
export const OVERVIEW_CORE_ID = "core"

/**
 * Staggered (honeycomb-ish) INTEGER cells for the 8 pods around Core `[0,0]` —
 * every pod snaps to exactly one square tile (no fractional `cos/sin` toward the
 * gaps between tiles). Two horizontal "flanks" offset vertically from the top /
 * bottom / side pods gives the tidy tessellated read the brainstorm asks for
 * (Direction A), while keeping ~3 cells between neighbours so the hex meshes +
 * floating labels never collide. Order matches {@link ARCHITECTURE_PODS}
 * (payment, auth, ai, data, events, media, coding, notify).
 */
const POD_CELLS: Array<[number, number]> = [
    [0, -3], // payment — top
    [3, -2], // auth — upper right (staggered up)
    [4, 0], // ai — right
    [3, 2], // data — lower right (staggered down)
    [0, 3], // events — bottom
    [-3, 2], // media — lower left
    [-4, 0], // coding — left
    [-3, -2], // notify — upper left
]

/**
 * Builds the pod OVERVIEW scene: the central `Core API` container (DRILLABLE —
 * click it to open the Core-module scene) with the 8 functional pods snapped to
 * a staggered cluster of INTEGER cells around it, each hex pod toned by its live
 * roll-up ({@link computePodStatus}) — gray "checking" before the first probe,
 * then green / yellow / red per the threshold rules. One edge Core → each pod.
 *
 * The pod ids are the scene node ids (`payment`, `auth`, …) so clicking a pod
 * can drive the `?pod=` URL directly; clicking Core (`core`) drills into the
 * Core-module scene.
 *
 * @param healthByName - Latest poll result, or `null` before the first resolve.
 * @param labels - i18n'd names + badge texts.
 */
export const buildPodOverviewScene = (
    healthByName: HealthByName | null,
    labels: PodSceneLabels,
): ArchitectureSceneData => {
    const nodes: Array<ArchitectureNode> = [
        {
            id: OVERVIEW_CORE_ID,
            name: labels.core,
            sub: labels.coreSub,
            cell: [0, 0],
            kind: "container",
            tone: "normal",
        },
        ...ARCHITECTURE_PODS.map((pod, index): ArchitectureNode => {
            const rollup = computePodStatus(pod.members, healthByName, labels)
            return {
                id: pod.id,
                name: labels.podName(pod.nameKey),
                sub: labels.podSub(pod.nameKey),
                cell: POD_CELLS[index],
                kind: "pod",
                tone: rollup.tone,
                status: rollup.status,
            }
        }),
    ]

    const edges: Array<ArchitectureEdge> = ARCHITECTURE_PODS.map((pod) => ({
        from: OVERVIEW_CORE_ID,
        to: pod.id,
        flow: true,
    }))

    return {
        board: boardFromNodes(nodes, 1),
        // re-fit at render time to the actual bounding box (see `CameraFit`);
        // this is only the fallback viewing angle/distance before that runs.
        camera: { position: [12, 11, 12], zoom: 30 },
        nodes,
        edges,
    }
}
